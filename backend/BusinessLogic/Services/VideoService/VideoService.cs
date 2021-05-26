using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using BusinessLogic.Services.VideoFileService;
using DataAccess.Models;
using DataAccess.Repositories.Videos;
using DataAccess.Utils;
using Microsoft.AspNetCore.StaticFiles;
using Xabe.FFmpeg;

namespace BusinessLogic.Services.VideoService
{
    public class VideoService : IVideoService
    {
        private readonly IVideosRepository _videosRepository;
        private readonly string _uploadPath;
        private readonly string _tempPath;
        private readonly IVideoFileService _videoFileService;

        public VideoService(IVideosRepository videosRepository, IVideoFileService videoFileService)
        {
            _videosRepository = videosRepository;
            _uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
            _tempPath = Path.Combine(_uploadPath, "Temp");
            _videoFileService = videoFileService;
        }

        public async Task UploadChunk(Stream requestBody, Guid userId, string chunkNumber, string fileName)
        {
            CreateUserVideoDirectory(userId); // Creates storage folders for users if needed
            
            string newPath = Path.Combine(_tempPath, Path.GetFileNameWithoutExtension(fileName) + "-" + userId + Path.GetExtension(fileName));

            await using var stream = new FileStream(newPath, FileMode.Append);

            await requestBody.CopyToAsync(stream);
        }

        public async Task<Video> CompleteUpload(Guid userId, string fileName)
        {
            string userPath = Path.Combine(_uploadPath, userId.ToString());
            string tempFilePath = Path.Combine(_tempPath, fileName);
            string filePath = Directory.GetFiles(_tempPath)
                .Where(p => p.Contains(Path.GetFileNameWithoutExtension(fileName))
                            && p.Contains(userId.ToString())).ToArray()[0];
            
            File.Move(filePath, tempFilePath);

            long size = new FileInfo(tempFilePath).Length;

            var video = new Video
            {
                UserId = userId,
                Title = Path.GetFileNameWithoutExtension(fileName),
                Size = size,
                UploadDate = DateTime.Now,
                Id = Guid.NewGuid(),
            };


            var info = await FFmpeg.GetMediaInfo(tempFilePath);
            video.Duration = (int)info.Duration.TotalSeconds;
            var streamInfo = info.VideoStreams.ToList()[0];
            video.Width = streamInfo.Width;
            video.Height = streamInfo.Height;
            video.Format = Path.GetExtension(tempFilePath).Replace(".", "");

            string snapshotFolderPath = Path.Combine(userPath, "Snapshots");
            string snapshotPath = Path.Combine(snapshotFolderPath, video.Id + ".png");
            IConversion conversion = await FFmpeg.Conversions.FromSnippet.Snapshot(tempFilePath, snapshotPath, TimeSpan.FromSeconds(1));
            await conversion.Start();

            // no-op if locally
            await _videoFileService.Move(snapshotPath, snapshotPath);
            
            string finalFilePath = Path.Combine(userPath, video.Id + Path.GetExtension(fileName));
            
            await _videoFileService.Move(tempFilePath, finalFilePath);
            
            video.Path = finalFilePath;


            await _videosRepository.InsertVideo(video);
            await _videosRepository.Save();

            return video;
        }

        public async Task DeleteVideo(Video video, Guid userId)
        {
            string snapshotPath = Path.Combine(Path.Combine(_uploadPath, userId.ToString()), Path.Combine("Snapshots", video.Id + ".png"));

            // two try-catch to try deleting both separately
            try
            {
                await _videoFileService.Delete(video.Path);
            }
            catch
            {
                // ignored
            }

            try
            {
                await _videoFileService.Delete(snapshotPath);
            }
            catch
            {
                // ignored
            }

            _videosRepository.RemoveVideo(video);
            await _videosRepository.Save();
        }

        public void CreateUserVideoDirectory(Guid userId)
        {
            _videoFileService.CreateDirectories(userId, _uploadPath, _tempPath);
        }

        public void DeleteAllChunks(string fileName)
        {
            string[] filePaths = Directory.GetFiles(_tempPath)
                .Where(p => p.Contains(Path.GetFileNameWithoutExtension(fileName))).ToArray();

            foreach (string path in filePaths)
            {
                _videoFileService.Delete(path);
            }
        }

        private async Task<long> MergeChunks(string chunk1, string chunk2)
        {
            try
            {
                await using var fs1 = _videoFileService.Open(chunk1, FileMode.Append);
                await using var fs2 = _videoFileService.Open(chunk2, FileMode.Open);
                await fs2.CopyToAsync(fs1);
                return fs1.Length;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message + " : " + ex.StackTrace);
            }
            finally
            {
                await _videoFileService.Delete(chunk2);
            }

            return 0;
        }

        public async Task<byte[]> GetVideoThumbnail(Guid userId, Guid videoId)
        {
            string userPath = Path.Combine(_uploadPath, userId.ToString());
            string snapshotsPath = Path.Combine(userPath, "Snapshots");
            string thumbnailPath = Path.Combine(snapshotsPath, videoId + ".png");
            byte[] videoBytes = await _videoFileService.ReadAllBytesAsync(thumbnailPath);
            return videoBytes;
        }

        public async Task<MemoryStream> GetVideosZipFileStream(List<Video> videos)
        {
            string zipName = Guid.NewGuid() + ".zip";
            string zipCreatePath = Path.Combine(_uploadPath, zipName);

            using (ZipArchive archive = ZipFile.Open(zipCreatePath, ZipArchiveMode.Create))
            {
                foreach(var video in videos)
                {
                    await _videoFileService.ArchiveCreateEntry(archive, video.Path,
                        video.Title + Path.GetExtension(video.Path));
                }
            }

            var memory = new MemoryStream();
            await using (var stream = new FileStream(zipCreatePath, FileMode.Open))
            {
                await stream.CopyToAsync(memory);
            }
            memory.Position = 0;

            File.Delete(zipCreatePath);
            return memory;
        }

        public async Task<long> GetUserVideosSize(Guid userId)
        {
            var videos = await _videosRepository.GetAllVideosByUserId(userId);
            long size = videos.Select(video => video.Size).Sum();
            return size;
        }

        public async Task MarkVideoForDeletion(Video video)
        {
            video.DeleteDate = DateTime.Today;
            await _videosRepository.Save();
        }

        public async Task RestoreVideo(Video video)
        {
            video.DeleteDate = null;
            await _videosRepository.Save();
        }

        public async Task DeleteVideosAutomation()
        {
            var videos = await _videosRepository.GetDeletedVideosOlderThanDays(30);
            foreach(var video in videos)
            {
                try
                {
                    await DeleteVideo(video, video.UserId);
                }
                catch(Exception)
                {
                    continue;
                }
            }
        }

        public Task<Stream> Stream(Video video)
        {
            return _videoFileService.Stream(video);
        }
    }
}
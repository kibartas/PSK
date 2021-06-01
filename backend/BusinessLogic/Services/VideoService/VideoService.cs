using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Threading.Tasks;
using BusinessLogic.Services.VideoFileService;
using DataAccess.Models;
using DataAccess.Repositories.Videos;

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

        public async Task UploadChunk(Stream requestBody, Guid userId, string base64BlockId, Guid videoId)
        {
            CreateUserVideoDirectory(userId); // Creates storage folders for users if needed

            var userPath = Path.Combine(_uploadPath, userId.ToString());
            var filePath = Path.Combine(userPath, videoId.ToString() + ".mp4");

            try
            {
                await _videoFileService.Write(requestBody, filePath, base64BlockId);
            }
            catch
            {
                await _videoFileService.Delete(filePath);
            }
        }

        public async Task<Video> CompleteUpload(Guid userId, string fileName, List<string> base64BlockIds, Guid videoId)
        {
            if (await _videosRepository.GetVideoById(videoId) != null)
            {
                return null;
            }
            
            var userPath = Path.Combine(_uploadPath, userId.ToString());
            var filePath = Path.Combine(userPath, videoId.ToString() + ".mp4");

            var size = await _videoFileService.FinishWrite(filePath, base64BlockIds);

            var video = new Video
            {
                UserId = userId,
                Title = Path.GetFileNameWithoutExtension(fileName),
                Size = size,
                Height = 1,
                Width = 1,
                Format = Path.GetExtension(fileName),
                Duration = 10,
                UploadDate = DateTime.Now,
                Id = videoId,
                Path = filePath
            };


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

        public async Task<byte[]> GetVideoThumbnail(Guid userId, Guid videoId)
        {
            string userPath = Path.Combine(_uploadPath, userId.ToString());
            string snapshotsPath = Path.Combine(userPath, "Snapshots");
            string thumbnailPath = Path.Combine(snapshotsPath, videoId + ".png");
            byte[] videoBytes = await _videoFileService.ReadAllBytesAsync(thumbnailPath);
            return videoBytes;
        }

        public async Task<MemoryStream> GetVideosZipFileStream(IEnumerable<Video> videos)
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
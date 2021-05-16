using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using DataAccess.Models;
using DataAccess.Repositories.Videos;
using DataAccess.Utils;
using Xabe.FFmpeg;

namespace BusinessLogic.Services.VideoService
{
    public class VideoService : IVideoService
    {
        private readonly IVideosRepository _videosRepository;
        private readonly string _uploadPath;
        private readonly string _tempPath;
        private readonly int _chunkSize;

        public VideoService(IVideosRepository videosRepository)
        {
            _videosRepository = videosRepository;
            _uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
            _tempPath = Path.Combine(_uploadPath, "Temp");
            _chunkSize = 28000000; // 28MB
        }

        public async Task UploadChunk(Stream requestBody, Guid userId, string chunkNumber, string fileName)
        {
            string newPath = Path.Combine(_tempPath, chunkNumber + "_" + Path.GetFileNameWithoutExtension(fileName) + "-" + userId + Path.GetExtension(fileName));
            if (!Directory.Exists(_tempPath))
            {
                Directory.CreateDirectory(_tempPath);
            }

            using (FileStream fs = File.Create(newPath))
            {
                byte[] bytes = new byte[_chunkSize];
                int bytesRead = 0;
                while ((bytesRead = await requestBody.ReadAsync(bytes, 0, bytes.Length)) > 0)
                {
                    fs.Write(bytes, 0, bytesRead);
                }
            }
        }

        public async Task<Video> CompleteUpload(Guid userId, string fileName)
        {
            string userPath = Path.Combine(_uploadPath, userId.ToString());
            string tempFilePath = Path.Combine(_tempPath, fileName);
            string[] filePaths = Directory.GetFiles(_tempPath)
                .Where(p => p.Contains(Path.GetFileNameWithoutExtension(fileName))
                            && p.Contains(userId.ToString()))
                .OrderBy(x => int.Parse(Regex.Match(x, RegexValidation.CHUNK_NUMBER_REGEX).Value))
                .ToArray();

            foreach (string chunk in filePaths)
            {
                MergeChunks(tempFilePath, chunk);
            }

            long size = new FileInfo(tempFilePath).Length;
            var video = new Video
            {
                UserId = userId,
                Title = Path.GetFileNameWithoutExtension(fileName),
                Size = size,
                UploadDate = DateTime.Now,
            };

            video.Id = Guid.NewGuid();

            string finalFilePath = Path.Combine(userPath, video.Id + Path.GetExtension(fileName));
            File.Move(tempFilePath, finalFilePath);
            video.Path = finalFilePath;
            string snapshotFolderPath = Path.Combine(userPath, "Snapshots");
            string snapshotPath = Path.Combine(snapshotFolderPath, video.Id + ".png");
            IConversion conversion = await FFmpeg.Conversions.FromSnippet.Snapshot(finalFilePath, snapshotPath, TimeSpan.FromSeconds(1));
            await conversion.Start();

            await _videosRepository.InsertVideo(video);
            await _videosRepository.Save();

            return video;
        }

        public async Task DeleteVideo(Video video, Guid userId)
        {
            string snapshotPath = Path.Combine(Path.Combine(_uploadPath, userId.ToString()), "Snapshots\\" + video.Id + ".png");

            if (!File.Exists(video.Path))
            {
                throw new FileNotFoundException("This video file does not exist");
            }

            if (!File.Exists(snapshotPath))
            {
                throw new FileNotFoundException("Video file's snapshot does not exist");
            }

            File.Delete(video.Path);
            File.Delete(snapshotPath);
            _videosRepository.RemoveVideo(video);
            await _videosRepository.Save();
        }

        public void CreateUserVideoDirectory(Guid userId)
        {
            string userPath = Path.Combine(_uploadPath, userId.ToString());
            Directory.CreateDirectory(userPath);
            Directory.CreateDirectory(Path.Combine(userPath, "/Snapshots"));
        }

        public void DeleteAllChunks(string fileName)
        {
            string[] filePaths = Directory.GetFiles(_tempPath)
                .Where(p => p.Contains(Path.GetFileNameWithoutExtension(fileName))).ToArray();

            foreach (string path in filePaths)
            {
                File.Delete(path);
            }
        }

        private static void MergeChunks(string chunk1, string chunk2)
        {
            FileStream fs1 = null;
            FileStream fs2 = null;
            try
            {
                fs1 = File.Open(chunk1, FileMode.Append);
                fs2 = File.Open(chunk2, FileMode.Open);
                byte[] fs2Content = new byte[fs2.Length];
                fs2.Read(fs2Content, 0, (int)fs2.Length);
                fs1.Write(fs2Content, 0, (int)fs2.Length);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message + " : " + ex.StackTrace);
            }
            finally
            {
                if (fs1 != null) fs1.Close();
                if (fs2 != null) fs2.Close();
                File.Delete(chunk2);
            }
        }

        public async Task<List<Video>> GetUserVideos(Guid userId)
        {
            var videos = await _videosRepository.GetAllVideos();
            var filteredVideos = videos.Where(video => video.DeleteDate == null && video.UserId == userId).ToList();
            return filteredVideos;
        }

        public async Task<Byte[]> GetVideoThumbnail(Guid userId, Guid videoId)
        {
            string userPath = Path.Combine(_uploadPath, userId.ToString());
            string snapshotsPath = Path.Combine(userPath, "Snapshots");
            string thumbnailPath = Path.Combine(snapshotsPath,videoId + ".png");
            Byte[] videoBytes = await File.ReadAllBytesAsync(thumbnailPath);
            return videoBytes;
        }
    }
}
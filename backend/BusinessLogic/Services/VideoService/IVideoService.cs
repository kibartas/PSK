using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using DataAccess.Models;

namespace BusinessLogic.Services.VideoService
{
    public interface IVideoService
    {
        Task UploadChunk(Stream requestBody, Guid userId, string base64BlockId, Guid videoId);
        Task<Video> CompleteUpload(Guid userId, string fileName, List<string> base64BlockIds, Guid videoId);
        Task DeleteVideo(Video video, Guid userId);
        void CreateUserVideoDirectory(Guid userId);
        void DeleteAllChunks(string fileName);
        Task<byte[]> GetVideoThumbnail(Guid userId, Guid videoId);
        Task<MemoryStream> GetVideosZipFileStream(IEnumerable<Video> videos);
        Task<long> GetUserVideosSize(Guid userId);
        Task MarkVideoForDeletion(Video video);
        Task RestoreVideo(Video video);
        Task DeleteVideosAutomation();
        Task<Stream> Stream(Video video);
    }
}
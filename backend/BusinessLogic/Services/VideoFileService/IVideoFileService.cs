using System;
using System.IO;
using System.IO.Compression;
using System.Threading.Tasks;
using DataAccess.Models;

namespace BusinessLogic.Services.VideoFileService
{
    public interface IVideoFileService
    {
        Task Delete(string path);
        Task<byte[]> ReadAllBytesAsync(string path);
        FileStream Open(string fileName, FileMode mode);
        Task Move(string pathFrom, string pathTo);
        Task ArchiveCreateEntry(ZipArchive archive, string videoPath, string entryName);
        Task<Stream> Stream(Video video);
        Task CreateDirectories(Guid userId, string uploadPath, string tempPath);
    }
}
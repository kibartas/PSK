using System;
using System.Collections.Generic;
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
        void CreateDirectories(Guid userId, string uploadPath, string tempPath);
        Task Write(Stream streamFrom, string pathTo, string base64BlockId = null);
        Task FinishWrite(string filePath, IEnumerable<string> base64BlockIds);
    }
}
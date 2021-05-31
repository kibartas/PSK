using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Threading.Tasks;
using DataAccess.Models;

namespace BusinessLogic.Services.VideoFileService
{
    public class LocalVideoFileService : IVideoFileService
    {
        public Task Delete(string path)
        {
            File.Delete(path);
            return Task.CompletedTask;
        }

        public Task<byte[]> ReadAllBytesAsync(string path)
        {
            return File.ReadAllBytesAsync(path);
        }

        public FileStream Open(string fileName, FileMode mode)
        {
            return File.Open(fileName, mode);
        }

        public Task Move(string pathFrom, string pathTo)
        {
            File.Move(pathFrom, pathTo);
            return Task.CompletedTask;
        }

        public Task ArchiveCreateEntry(ZipArchive archive, string videoPath, string entryName)
        {
            archive.CreateEntryFromFile(videoPath, entryName);
            return Task.CompletedTask;
        }

        public Task<Stream> Stream(Video video)
        {
            return Task.FromResult(File.OpenRead(video.Path) as Stream);
        }

        public void CreateDirectories(Guid userId, string uploadPath, string tempPath)
        {
            if (!Directory.Exists(uploadPath))
            {
                Directory.CreateDirectory(uploadPath);
            }
            string userPath = Path.Combine(uploadPath, userId.ToString());
            if (!Directory.Exists(userPath))
            {
                Directory.CreateDirectory(userPath);
            }
            string snapshotsPath = Path.Combine(userPath, "Snapshots");
            if (!Directory.Exists(snapshotsPath))
            {
                Directory.CreateDirectory(snapshotsPath);
            }
            
            if (!Directory.Exists(tempPath))
            {
                Directory.CreateDirectory(tempPath);
            }
        }

        public async Task Write(Stream streamFrom, string pathTo, string base64BlockId)
        {
            await using var fileStream = File.OpenWrite(pathTo);
            await streamFrom.CopyToAsync(fileStream);
        }

        public Task FinishWrite(string filePath, IEnumerable<string> base64BlockIds)
        {
            return Task.CompletedTask;
        }
    }
}
using System;
using System.IO;
using System.IO.Compression;
using System.Threading.Tasks;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using DataAccess.Models;
using Microsoft.Extensions.Configuration;

namespace BusinessLogic.Services.VideoFileService
{
    public class AzureVideoFileService : IVideoFileService
    {

        private readonly BlobContainerClient _blobContainerClient;

        public AzureVideoFileService(IConfiguration configuration)
        {
            _blobContainerClient = new BlobContainerClient(configuration["BlobStorage"], "videos");
        }

        public async Task Delete(string path)
        {
            if (File.Exists(path))
            {
                File.Delete(path);
            }

            try
            {
                await _blobContainerClient.DeleteBlobIfExistsAsync(path, DeleteSnapshotsOption.IncludeSnapshots);
            }
            catch
            {
                // ignored
            }
        }

        public async Task<byte[]> ReadAllBytesAsync(string path)
        {
            var blobClient = _blobContainerClient.GetBlobClient(path);
            var blob = await blobClient.DownloadAsync();

            var stream = blob.Value.Content;

            await using var memoryStream = new MemoryStream();
            await stream.CopyToAsync(memoryStream);
            return memoryStream.ToArray();
        }

        public FileStream Open(string fileName, FileMode mode)
        {
            return File.Open(fileName, mode);
        }

        public async Task Move(string pathFrom, string pathTo)
        {
            await _blobContainerClient.CreateIfNotExistsAsync();
            await _blobContainerClient.UploadBlobAsync(pathTo, File.OpenRead(pathFrom));
            File.Delete(pathFrom);
        }
        
        public async Task ArchiveCreateEntry(ZipArchive archive, string videoPath, string entryName)
        {
            var blob = _blobContainerClient.GetBlobClient(videoPath);
            var entry = archive.CreateEntry(entryName);
            var downloadedBlob = await blob.DownloadAsync();
            await downloadedBlob.Value.Content.CopyToAsync(entry.Open());
        }

        public async Task<Stream> Stream(Video video)
        {
            var blob = _blobContainerClient.GetBlobClient(video.Path);
            var blobStream = await blob.OpenReadAsync();
            return blobStream;
        }


        public Task CreateDirectories(Guid userId, string uploadPath, string tempPath)
        {
            if (!Directory.Exists(tempPath))
            {
                Directory.CreateDirectory(tempPath);
            }
            return Task.CompletedTask;
        }

    }
}
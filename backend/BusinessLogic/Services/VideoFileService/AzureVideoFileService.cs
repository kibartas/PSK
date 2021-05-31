using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Blobs.Specialized;
using DataAccess.Models;
using Microsoft.Extensions.Configuration;

namespace BusinessLogic.Services.VideoFileService
{
    public class AzureVideoFileService : IVideoFileService
    {

        private readonly BlobContainerClient _blobContainerClient;
        private readonly IConfiguration _configuration;

        public AzureVideoFileService(IConfiguration configuration)
        {
            _blobContainerClient = new BlobContainerClient(configuration["BlobStorage"], "videos");
            _configuration = configuration;
        }

        public async Task Delete(string path)
        {
            path = new Regex(@".*(?=Uploads)").Replace(path, "");
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
            path = new Regex(@".*(?=Uploads)").Replace(path, "");
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
            pathTo = new Regex(@".*(?=Uploads)").Replace(pathTo, "");
            await _blobContainerClient.CreateIfNotExistsAsync();
            await _blobContainerClient.UploadBlobAsync(pathTo, File.OpenRead(pathFrom));
            File.Delete(pathFrom);
        }
        
        public async Task ArchiveCreateEntry(ZipArchive archive, string videoPath, string entryName)
        {
            videoPath = new Regex(@".*(?=Uploads)").Replace(videoPath, "");
            var blob = _blobContainerClient.GetBlobClient(videoPath);
            var entry = archive.CreateEntry(entryName);
            var downloadedBlob = await blob.DownloadAsync();
            await downloadedBlob.Value.Content.CopyToAsync(entry.Open());
        }

        public async Task<Stream> Stream(Video video)
        {
            var path = new Regex(@".*(?=Uploads)").Replace(video.Path, "");
            var blob = _blobContainerClient.GetBlobClient(path);
            await using var blobStream = await blob.OpenReadAsync();
            return blobStream;
        }


        public void CreateDirectories(Guid userId, string uploadPath, string tempPath)
        {
            if (!Directory.Exists(tempPath))
            {
                Directory.CreateDirectory(tempPath);
            }
        }

        public async Task Write(Stream streamFrom, string pathTo, string base64BlockId)
        {
            pathTo = new Regex(@".*(?=Uploads)").Replace(pathTo, "");
            await _blobContainerClient.CreateIfNotExistsAsync();
            var blockBlobClient = new BlockBlobClient(_configuration["BlobStorage"], "videos", pathTo);
            if (await blockBlobClient.ExistsAsync())
            {
                await blockBlobClient.SetHttpHeadersAsync(new BlobHttpHeaders()
                {
                    ContentType = "video/mp4"
                });
            }
            await using var memoryStream = new MemoryStream();
            await streamFrom.CopyToAsync(memoryStream);
            memoryStream.Position = 0;
            await blockBlobClient.StageBlockAsync(base64BlockId, memoryStream);
        }

        public async Task FinishWrite(string filePath, IEnumerable<string> base64BlockIds)
        {
            filePath = new Regex(@".*(?=Uploads)").Replace(filePath, "");
            var blockBlobClient = new BlockBlobClient(_configuration["BlobStorage"], "videos", filePath);
            await blockBlobClient.CommitBlockListAsync(base64BlockIds);
            await blockBlobClient.SetHttpHeadersAsync(new BlobHttpHeaders()
            {
                ContentType = "video/mp4"
            });
        }
    }
}
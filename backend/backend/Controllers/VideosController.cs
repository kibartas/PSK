using backend.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using System.IO;
using backend.DTOs;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using System.Security.Claims;
using System;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class VideosController : ControllerBase
    {
        private readonly BackendContext _db;
        private readonly string _uploadPath;
        private readonly string _tempPath;
        private readonly int _chunkSize;

        public VideosController(BackendContext context)
        {
            _db = context;
            _uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "/Uploads/");
            _tempPath = Path.Combine(_uploadPath, "/Temp/");
            _chunkSize = 3145728; //3MB
        }

        [HttpGet,Route("all")]
        public ActionResult<List<Video>> GetAllVideos()
        {
            return _db.Videos.ToList();
        }

        [HttpPost, Route("UploadChunks")]
        public async Task<IActionResult> UploadChunks(string id, string fileName)
        {
            try
            {
                var chunkNumber = id;
                string newPath = Path.Combine(_tempPath, fileName + chunkNumber);
                using (FileStream fs = System.IO.File.Create(newPath))
                {
                    byte[] bytes = new byte[_chunkSize];
                    int bytesRead = 0;
                    while ((bytesRead = await Request.Body.ReadAsync(bytes, 0, bytes.Length)) > 0)
                    {
                        fs.Write(bytes, 0, bytesRead);
                    }
                }
                return Ok();
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost, Route("UploadComplete")]
        public ActionResult<VideoDto> UploadComplete(string fileName)
        {
            var userIdClaim = User.FindFirst(x => x.Type == ClaimTypes.NameIdentifier);
            if (userIdClaim is null)
            {
                return NotFound();
            }

            if (!Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return NotFound();
            }

            var user = _db.Users.FirstOrDefault(x => x.Id == userId);
            if (user is null)
            {
                return NotFound();
            }

            try
            {
                string userPath = Path.Combine(_uploadPath, user.Id.ToString());
                string tempFilePath = Path.Combine(userPath, fileName);
                string[] filePaths = Directory.GetFiles(_tempPath)
                    .Where(p => p.Contains(fileName))
                    .OrderBy(p => Int32.Parse(p.Replace(fileName, "$")
                    .Split('$')[1]))
                    .ToArray();

                foreach (string chunk in filePaths)
                {
                    MergeChunks(tempFilePath, chunk);
                }

                long size = new FileInfo(tempFilePath).Length;
                Video video = new Video()
                {
                    UserId = user.Id,
                    Title = fileName,
                    Size = size,
                    UploadDate = new DateTime(),
                };

                _db.Videos.Add(video);
                string finalFilePath = Path.Combine(userPath, video.Id.ToString());
                System.IO.File.Move(tempFilePath, finalFilePath);

                VideoDto response = new VideoDto()
                {
                    Id = video.Id,
                    Title = video.Title,
                    Size = video.Size,
                    UploadDate = video.UploadDate
                };

                return Ok(response);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPatch, Route("ChangeTitle")]
        public ActionResult<VideoDto> ChangeTitle(Guid id, string title)
        {
            if (id == Guid.Empty) return BadRequest();
            if (string.IsNullOrWhiteSpace(title)) return BadRequest();

            Video video = _db.Videos.Find(id);
            if (video == null) return NotFound();
            video.Title = title;
            _db.SaveChanges();

            var response = new VideoDto()
            {
                Id = video.Id,
                Title = video.Title,
                Size = video.Size,
                UploadDate = video.UploadDate
            };

            return Ok(response);
        }

        [HttpDelete, Route("{id}")]
        public async Task<IActionResult> DeleteVideo([FromRoute] Guid id)
        {
            var userIdClaim = User.FindFirst(x => x.Type == ClaimTypes.NameIdentifier);
            if (userIdClaim is null)
            {
                return NotFound();
            }

            if (!Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return NotFound();
            }

            var user = _db.Users.FirstOrDefault(x => x.Id == userId);
            if (user is null)
            {
                return NotFound();
            }

            if (id == Guid.Empty) return BadRequest();

            Video video = _db.Videos.Find(id);
            if (video == null) return NotFound();
            
            string userPath = Path.Combine(_uploadPath, user.Id.ToString());
            string filePath = Path.Combine(userPath, video.Id.ToString());

            if (!System.IO.File.Exists(filePath)) return BadRequest();
            
            try
            {
                System.IO.File.Delete(filePath);
                _db.Videos.Remove(video);
                await _db.SaveChangesAsync();
            }
            catch
            {
                return BadRequest();
            }

            return Ok();
        }

        private static void MergeChunks(string chunk1, string chunk2)
        {
            FileStream fs1 = null;
            FileStream fs2 = null;
            try
            {
                fs1 = System.IO.File.Open(chunk1, FileMode.Append);
                fs2 = System.IO.File.Open(chunk2, FileMode.Open);
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
                System.IO.File.Delete(chunk2);
            }
        }
    }
}

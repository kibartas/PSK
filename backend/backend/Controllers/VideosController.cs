using backend.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using System.IO;
using backend.DTOs;
using System.Threading.Tasks;
using System.Security.Claims;
using System;
using System.Text.RegularExpressions;
using backend.Utils;
using Xabe.FFmpeg;
using System.Net.Http;
using System.Net;
using System.Net.Http.Headers;
//using System.Web.Http;

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
            _uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
            _tempPath = Path.Combine(_uploadPath, "Temp");
            _chunkSize = 28000000; // 28MB
        }

        [HttpGet,Route("all")]
        public ActionResult<List<Video>> GetAllVideos()
        {
            return _db.Videos.ToList();
        }

        [HttpPost, Route("UploadChunks")]
        public async Task<IActionResult> UploadChunk(string chunkNumber, string fileName)
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
                string newPath = Path.Combine(_tempPath, chunkNumber + "_" + Path.GetFileNameWithoutExtension(fileName) + "-" + user.Id + Path.GetExtension(fileName));
                if (!Directory.Exists(_tempPath)) Directory.CreateDirectory(_tempPath);

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
                try
                {
                    DeleteAllChunks(fileName);
                }
                catch
                {
                    return StatusCode(500);
                }
                return StatusCode(500);
            }
        }

        [HttpPost, Route("UploadComplete")]
        public async Task<IActionResult> UploadComplete(string fileName)
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
                string tempFilePath = Path.Combine(_tempPath, fileName);
                string[] filePaths = Directory.GetFiles(_tempPath)
                    .Where(p => p.Contains(Path.GetFileNameWithoutExtension(fileName)) 
                                && p.Contains(user.Id.ToString()))
                    .OrderBy(x => int.Parse(Regex.Match(x, RegexValidation.CHUNK_NUMBER_REGEX).Value))
                    .ToArray();

                foreach (string chunk in filePaths)
                {
                    MergeChunks(tempFilePath, chunk);
                }

                long size = new FileInfo(tempFilePath).Length;
                Video video = new()
                {
                    UserId = user.Id,
                    Title = Path.GetFileNameWithoutExtension(fileName),
                    Size = size,
                    UploadDate = DateTime.Now,
                };

                video.Id = Guid.NewGuid();

                string finalFilePath = Path.Combine(userPath, video.Id + Path.GetExtension(fileName));
                System.IO.File.Move(tempFilePath, finalFilePath);
                video.Path = finalFilePath;
                string snapshotFolderPath = Path.Combine(userPath, "Snapshots");
                string snapshotPath = Path.Combine(snapshotFolderPath, video.Id + ".png");
                IConversion conversion = await FFmpeg.Conversions.FromSnippet.Snapshot(finalFilePath, snapshotPath, TimeSpan.FromSeconds(1));
                var result = await conversion.Start();

                _db.Videos.Add(video);
                await _db.SaveChangesAsync();

                VideoDto response = new()
                {
                    Id = video.Id,
                    Title = video.Title,
                    Size = video.Size,
                    UploadDate = video.UploadDate
                };

                return Ok(response);
            }
            catch(Exception)
            {
                try
                {
                    DeleteAllChunks(fileName);
                }
                catch
                {
                    return StatusCode(500);
                }
                return StatusCode(500);
            }
        }

        [HttpDelete, Route("DeleteChunks")]
        public ActionResult DeleteChunks(string fileName)
        {
            try
            {
                DeleteAllChunks(fileName);
                return Ok();
            } catch
            {
                return StatusCode(500);
            }
        }

        [HttpPatch]
        public ActionResult<VideoDto> ChangeTitle(Guid id, string newTitle)
        {
            if (id == Guid.Empty) return BadRequest("No Id provided");
            if (string.IsNullOrWhiteSpace(newTitle)) return BadRequest("Empty new title");

            Video video = _db.Videos.Find(id);
            if (video == null) return NotFound();
            video.Title = newTitle;
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

        [HttpGet, Route("stream"), AllowAnonymous]
        public FileStreamResult Video(Guid videoId)
        {
            Video video = _db.Videos.Find(videoId);
            var response = File(System.IO.File.OpenRead(video.Path), "video/mp4", enableRangeProcessing: true);
            return response;
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
            string snapshotPath = Path.Combine(Path.Combine(_uploadPath, user.Id.ToString()), "Snapshots\\" + video.Id + ".png");
            if (!System.IO.File.Exists(video.Path)) return BadRequest("This video file does not exist");
            if (!System.IO.File.Exists(snapshotPath)) return BadRequest("Video file's snapshot does not exist");
            
            try
            {
                System.IO.File.Delete(video.Path);
                System.IO.File.Delete(snapshotPath);
                _db.Videos.Remove(video);
                await _db.SaveChangesAsync();
            }
            catch
            {
                return StatusCode(500);
            }

            return Ok();
        }

        private void DeleteAllChunks(string fileName)
        {
            string[] filePaths = Directory.GetFiles(_tempPath)
                    .Where(p => p.Contains(Path.GetFileNameWithoutExtension(fileName))).ToArray();

            foreach (string path in filePaths)
            {
                System.IO.File.Delete(path);
            }
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

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

        public VideosController(BackendContext context)
        {
            _db = context;
            _uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
        }

        [HttpGet,Route("all")]
        public ActionResult<List<Video>> GetAllVideos()
        {
            return _db.Videos.ToList();
        }

        [HttpPost, Route("UploadVideo")]
        public async Task<IActionResult> UploadVideo(IFormFile videoFile)
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

            if (string.IsNullOrWhiteSpace(videoFile.FileName)) return BadRequest();

            string title = Path.GetFileNameWithoutExtension(videoFile.FileName);
            long size = videoFile.Length;

            string userPath = Path.Combine(_uploadPath, user.Id.ToString());
            if (!Directory.Exists(_uploadPath))
                Directory.CreateDirectory(_uploadPath);
            if (!Directory.Exists(userPath))
                Directory.CreateDirectory(userPath);

            try
            {
                Video video = new Video()
                {
                    Title = title,
                    UserId = user.Id,
                    Size = size,
                    UploadDate = new DateTime()
                };

                string videoFileName = video.Id.ToString() + Path.GetExtension(videoFile.FileName);
                string filePath = Path.Combine(userPath, videoFileName);
                video.Path = filePath;

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await videoFile.CopyToAsync(stream);
                }

                await _db.Videos.AddAsync(video);
                await _db.SaveChangesAsync();
                var response = new VideoDto()
                {
                    Id = video.Id,
                    Size = size,
                    Title = title,
                    UploadDate = video.UploadDate
                };
                return Ok(response);
            }
            catch
            {
                return StatusCode(500);
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
    }
}

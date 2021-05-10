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
            _uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "/Uploads/");
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

            string title = videoFile.FileName;
            string userPath = Path.Combine(_uploadPath, user.Id.ToString());
            long size = videoFile.Length;

            try
            {
                Video video = new Video()
                {
                    Title = title,
                    UserId = user.Id,
                    Size = size,
                    UploadDate = new DateTime()
                };

                string filePath = Path.Combine(userPath, video.Id.ToString());
                using(var stream = new FileStream(filePath, FileMode.Create))
                {
                    await videoFile.CopyToAsync(stream);
                }
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
                return BadRequest();
            }
        }
    }
}

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using BusinessLogic.Services.VideoService;
using DataAccess.Models;
using DataAccess.Repositories.Users;
using DataAccess.Repositories.Videos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RestAPI.Models.Responses;

namespace RestAPI.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class VideosController : ControllerBase
    {
        private readonly IVideosRepository _videosRepository;
        private readonly IUsersRepository _usersRepository;
        private readonly IVideoService _videoService;

        public VideosController(
            IVideosRepository videosRepository, 
            IUsersRepository usersRepository, 
            IVideoService videoService)
        {
            _videosRepository = videosRepository;
            _usersRepository = usersRepository;
            _videoService = videoService;
        }

        [HttpGet,Route("all")]
        public async Task<ActionResult<IEnumerable<Video>>> GetAllVideos()
        {
            return (await _videosRepository.GetAllVideos()).ToList();
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

            var user = await _usersRepository.GetUserById(userId);
            if (user is null)
            {
                return NotFound();
            }

            try
            {
                await _videoService.UploadChunk(Request.Body, user.Id, chunkNumber, fileName);
                return Ok();
            }
            catch
            {
                try
                {
                    _videoService.DeleteAllChunks(fileName);
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

            var user = await _usersRepository.GetUserById(userId);
            if (user is null)
            {
                return NotFound();
            }

            try
            {
                var video = await _videoService.CompleteUpload(user.Id, fileName);

                var response = new VideoDto
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
                    _videoService.DeleteAllChunks(fileName);
                }
                catch
                {
                    return StatusCode(500);
                }
                return StatusCode(500);
            }
        }

        [HttpDelete, Route("DeleteChunks")]
        public IActionResult DeleteChunks(string fileName)
        {
            try
            {
                _videoService.DeleteAllChunks(fileName);
                return Ok();
            } catch
            {
                return StatusCode(500);
            }
        }

        [HttpPatch]
        public async Task<ActionResult<VideoDto>> ChangeTitle(Guid id, string newTitle)
        {
            if (id == Guid.Empty)
            {
                return BadRequest("No Id provided");
            }

            if (string.IsNullOrWhiteSpace(newTitle))
            {
                return BadRequest("Empty new title");
            }

            var video = await _videosRepository.GetVideoById(id);
            if (video == null)
            {
                return NotFound();
            }

            video.Title = newTitle;
            await _videosRepository.Save();

            var response = new VideoDto()
            {
                Id = video.Id,
                Title = video.Title,
                Size = video.Size,
                UploadDate = video.UploadDate
            };

            return Ok(response);
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteVideos([FromBody] List<Guid> ids)
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

            var user = await _usersRepository.GetUserById(userId);
            if (user is null)
            {
                return NotFound();
            }

            foreach (Guid id in ids)
            {
                if (id == Guid.Empty) return BadRequest();

                var video = await _videosRepository.GetVideoById(id);
                if (video == null)
                {
                    return NotFound();
                }

                if (video.UserId != user.Id)
                {
                    return NotFound();
                }

                try
                {
                    await _videoService.DeleteVideo(video, user.Id);
                }
                catch (FileNotFoundException ex)
                {
                    return BadRequest(ex.Message);
                }
                catch
                {
                    return StatusCode(500);
                }
            }

            return Ok();
        }
    }
}

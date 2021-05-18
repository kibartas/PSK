using System;
using System.Collections.Generic;
using System.IO;
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

        [HttpGet, Route("all")]
        public async Task<IActionResult> AllVideos()
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

            var videos = await _videosRepository.GetVideosByUserId(userId);
            List<VideoDto> videoDtos = new List<VideoDto>();

            foreach(var video in videos)
            {
                videoDtos.Add(new VideoDto()
                {
                    Id = video.Id,
                    Title = video.Title,
                    Size = video.Size,
                    UploadDate = video.UploadDate.ToString("yyyy-MM-dd")
                });
            }

            return Ok(videoDtos);
        }

        [HttpGet]
        public async Task<IActionResult> GetVideo(Guid videoId)
        {
            var video = await _videosRepository.GetVideoById(videoId);
            if (video == null) return NotFound();

            var userIdClaim = User.FindFirst(x => x.Type == ClaimTypes.NameIdentifier);
            if (userIdClaim is null)
            {
                return NotFound();
            }

            if (!Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return NotFound();
            }

            if (videoId == Guid.Empty) return BadRequest("Guid is not valid");
            if (video.UserId != userId) return Unauthorized();

            VideoInformationDto videoDto = new VideoInformationDto()
            {
                Id = video.Id,
                Size = video.Size,
                Title = video.Title,
                UploadDate = video.UploadDate.ToString("yyyy-MM-dd"),
                Duration = video.Duration,
                Format = video.Format,
                Height = video.Height,
                Width = video.Width
            };

            return Ok(videoDto);
        }

        [HttpGet, Route("thumbnail")]
        public async Task<IActionResult> GetThumbnail(Guid videoId)
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
            
            if (videoId == Guid.Empty)
            {
                return BadRequest("Bad video guid");
            }

            var video = await _videosRepository.GetVideoById(videoId);
            if (video == null)
            {
                return NotFound();
            }

            if (user.Id != video.UserId)
            {
                return Unauthorized();
            }

            try
            {
                var thumbnailBytes = await _videoService.GetVideoThumbnail(video.UserId, video.Id);
                var thumbnailFile = File(thumbnailBytes, "image/png");
                return thumbnailFile;
            } catch
            {
                return NotFound("Thumbnail file does not exist");
            }
        }

        [HttpGet, Route("stream"), AllowAnonymous]
        public async Task<ActionResult> Stream(Guid videoId, Guid userId)
        {
            if (videoId == Guid.Empty)
            {
                return BadRequest("Video id is not valid");
            }

            if (userId == Guid.Empty)
            {
                return BadRequest("User is not valid");
            }

            var video = await _videosRepository.GetVideoById(videoId);
            if (video == null)
            {
                return NotFound();
            }

            if (video.UserId != userId)
            {
                return Unauthorized();
            }

            var response = File(System.IO.File.OpenRead(video.Path), "video/mp4",video.Title + Path.GetExtension(video.Path), enableRangeProcessing: true);
            return response;
        }

        [HttpPost, Route("DownloadMultiple")]
        public async Task<IActionResult> DownloadMultiple([FromBody] List<Guid> videoIds)
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

            if (videoIds.Count == 0)
            {
                return BadRequest("No ids provided");
            }

            var videos = new List<Video>();
            foreach(var videoId in videoIds)
            {
                if (videoId == Guid.Empty)
                {
                    return BadRequest("Guid is not valid");
                }
                var video = await _videosRepository.GetVideoById(videoId);
                if (video.UserId != user.Id)
                {
                    return Unauthorized();
                }
                videos.Add(video);
            }

            var stream = await _videoService.GetVideosZipFileStream(videos);
            var zipName = "Videos-" + Guid.NewGuid();
            return File(stream, "application/zip", zipName + ".zip");
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
                    UploadDate = video.UploadDate.ToString("yyyy-MM-dd")
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

        [HttpPatch, Route("Title")]
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
                UploadDate = video.UploadDate.ToString("yyyy-MM-dd")
            };

            return Ok(response);
        }

        [HttpPatch, Route("MarkForDeletion")]
        public async Task<ActionResult> MarkVideosForDeletion([FromBody] List<Guid> ids)
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

            foreach(Guid id in ids)
            {
                var video = await _videosRepository.GetVideoById(id);
                if (video == null)
                {
                    return NotFound();
                }

                if (video.UserId != user.Id)
                {
                    return NotFound();
                }

                await _videoService.MarkVideoForDeletion(video);
            }

            return Ok();
        }

        //For recycle bin page
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
                    return NotFound(ex.Message);
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

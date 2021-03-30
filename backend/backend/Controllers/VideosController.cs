using backend.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class VideosController : ControllerBase
    {
        private readonly BackendContext _db;

        public VideosController(BackendContext context)
        {
            _db = context;
        }

        [HttpGet,Route("all")]
        public ActionResult<List<Video>> GetAllVideos()
        {
            return _db.Videos.ToList();
        }
    }
}

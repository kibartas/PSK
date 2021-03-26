using backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VideosController : ControllerBase
    {
        private readonly BackendContext db;

        public VideosController(BackendContext context)
        {
            db = context;
        }

        [HttpGet,Route("all")]
        public ActionResult<List<Video>> GetAllVideos()
        {
            return db.Videos.ToList();
        }
    }
}

using backend.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly BackendContext db;

        public UsersController(BackendContext context)
        {
            db = context;
        }

        [HttpGet,Route("all")]
        public ActionResult<List<User>> GetAllUsers()
        {
            return db.Users.ToList();
        }
    }
}

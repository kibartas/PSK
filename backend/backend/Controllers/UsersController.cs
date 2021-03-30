using backend.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using backend.Utils;
using Newtonsoft.Json;

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

        // Endpoint to test the hash function
        
        /*[HttpPost, Route("test-password")]
        public ActionResult<User> TestPasswordHash(string password)
        {
            var user = new User(password)
            {
                Email = "gee@gee.com",
                Firstname = "public",
                Lastname = "private"
            };
            db.Users.Add(user);
            db.SaveChanges();
            return user;
        }*/
    }
}

using System;
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
            Console.WriteLine("Password: " + user.Password + "; Salt: " + user.Salt[0] + ";\n" 
                              +  Hasher.CheckPlaintextAgainstHash(password, user.Password, user.Salt));
            user.SetNewPassword("foofoo");
            db.Users.Add(user);
            db.SaveChanges();
            Console.WriteLine("Password: " + user.Password + "; Salt: " + user.Salt[0] + ";\n" +  
                              Hasher.CheckPlaintextAgainstHash("foofoo", user.Password, user.Salt));
            return db.Users.Find(user.Id);
        }*/
    }
}

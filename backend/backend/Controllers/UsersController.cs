using System;
using backend.JwtAuthentication;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly BackendContext _db;
        private readonly IJwtAuthentication _jwtAuthentication;

        public UsersController(
            BackendContext context, 
            IJwtAuthentication jwtAuthentication)
        {
            _db = context;
            _jwtAuthentication = jwtAuthentication;
        }

        [HttpGet,Route("all")]
        public ActionResult<List<User>> GetAllUsers()
        {
            return _db.Users.ToList();
        }

        [HttpGet, Route("currentuser")]
        public ActionResult<User> GetCurrentUser()
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

            return user;
        }

        [HttpPost, Route("authentication"), AllowAnonymous]
        public ActionResult<string> Authenticate([FromBody]UserCredentials userCredentials)
        {
            var token = _jwtAuthentication.Authenticate(userCredentials.Email, userCredentials.Password);

            if(token is null)
            {
                return Unauthorized();
            }

            return Ok(token);
        }
    }
}

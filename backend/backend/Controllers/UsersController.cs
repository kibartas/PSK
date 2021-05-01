using System;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using backend.Utils;
using backend.JwtAuthentication;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using backend.DTOs;
using backend.Services.EmailService;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly BackendContext _db;
        private readonly IJwtAuthentication _jwtAuthentication;
        private readonly IEmailService _emailService;

        public UsersController(
            BackendContext context, 
            IJwtAuthentication jwtAuthentication,
            IEmailService emailService)
        {
            _db = context;
            _jwtAuthentication = jwtAuthentication;
            _emailService = emailService;
        }
        
        [HttpGet,Route("all")]
        public ActionResult<List<User>> GetAllUsers()
        {
            return _db.Users.ToList();
        }

        [HttpGet, Route("current")]
        public ActionResult<UserDto> GetCurrentUser()
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

            UserDto userDto = new UserDto()
            {
                Id = user.Id,
                FirstName = user.Firstname,
                LastName = user.Lastname,
                Email = user.Email
            };

            return userDto;
        }

        [HttpGet, Route("authentication"), AllowAnonymous]
        public ActionResult<string> Authenticate(string email, string password)
        {
            var token = _jwtAuthentication.Authenticate(email, password);

            if(token is null)
            {
                return Unauthorized();
            }

            return Ok(token);
        }

        [HttpPost, Route("register"), AllowAnonymous]
        public ActionResult Register([FromBody]RegistrationRequest registrationRequest)
        {
            if (!RegexValidation.IsEmailValid(registrationRequest.Email)) return BadRequest();
            if (!RegexValidation.IsNameValid(registrationRequest.FirstName) || !RegexValidation.IsNameValid(registrationRequest.LastName)) return BadRequest();
            if (!RegexValidation.IsPasswordValid(registrationRequest.Password)) return BadRequest();
            if (_db.Users.FirstOrDefault(user => user.Email == registrationRequest.Email) != null) return Conflict();

            User user = new User(registrationRequest.Password)
            {
                Firstname = registrationRequest.FirstName,
                Lastname = registrationRequest.LastName,
                Email = registrationRequest.Email
            };

            _db.Users.Add(user);
            _db.SaveChanges();
            string endpoint = "http://localhost:3000/verify/" + user.Id;
            _emailService.SendVerificationEmail(user.Firstname, user.Email, endpoint);

            return Ok();
        }

        [HttpPost, Route("verify"), AllowAnonymous]
        public ActionResult Verify(Guid id)
        {
            if (id == Guid.Empty) return BadRequest();
            User user = _db.Users.Find(id);
            if (user == null) return BadRequest();

            user.Confirmed = true;
            _db.SaveChanges();
            return Ok();

        }
    }
}

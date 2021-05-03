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
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;

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

        [HttpGet, Route("current")]
        public ActionResult<UserDto> GetCurrentUser()
        {
            var resetPasswordClaim = User.FindFirst(x => x.Type == "ResetPassword");
            if (resetPasswordClaim is not null && resetPasswordClaim.Value == "True")
            {
                return Unauthorized();
            }
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

        [HttpPost, Route("authentication"), AllowAnonymous]
        public ActionResult<string> Authenticate(string email, string password)
        {
            if(String.IsNullOrWhiteSpace(email) || String.IsNullOrWhiteSpace(password))
            {
                return BadRequest();
            }

            var token = _jwtAuthentication.Authenticate(email, password);

            if (token is null)
            {
                return Unauthorized();
            }

            return Ok(token);
        }

        [HttpPost, Route("register"), AllowAnonymous]
        public ActionResult Register([FromBody] RegistrationRequest registrationRequest)
        {
            if (String.IsNullOrWhiteSpace(registrationRequest.Email) || !RegexValidation.IsEmailValid(registrationRequest.Email)) return BadRequest();
            if (String.IsNullOrWhiteSpace(registrationRequest.FirstName) || String.IsNullOrWhiteSpace(registrationRequest.LastName)
                || !RegexValidation.IsNameValid(registrationRequest.FirstName) || !RegexValidation.IsNameValid(registrationRequest.LastName)) return BadRequest();
            if (String.IsNullOrWhiteSpace(registrationRequest.Password) || !RegexValidation.IsPasswordValid(registrationRequest.Password)) return BadRequest();
            if (_db.Users.FirstOrDefault(user => user.Email == registrationRequest.Email) != null) return Conflict();

            User user = new User(registrationRequest.Password)
            {
                Firstname = registrationRequest.FirstName,
                Lastname = registrationRequest.LastName,
                Email = registrationRequest.Email
            };

            _db.Users.Add(user);

            try
            {
                string endpoint = "http://localhost:3000/verify/" + user.Id;
                _emailService.SendVerificationEmail(user.Firstname, user.Email, endpoint);
                _db.SaveChanges();
            }
            catch
            {
                return StatusCode(500);
            }

            return Ok();
        }

        [HttpPost, Route("verify"), AllowAnonymous]
        public ActionResult Verify(Guid id)
        {
            if (id == Guid.Empty) return BadRequest();
            User user = _db.Users.Find(id);
            if (user == null) return NotFound();

            user.Confirmed = true;
            _db.SaveChanges();

            return Ok();
        }

        [HttpPost, Route("forgot-password"), AllowAnonymous]
        public ActionResult ForgotPassword(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                return BadRequest();
            }

            var user = _db.Users.FirstOrDefault(x => x.Email == email);
            if (user == null)
            {
                return Ok();
            }

            var token = _jwtAuthentication.CreateResetPasswordToken(user.Email);
            
            var endpoint = "http://localhost:3000/reset-password/" + token;
            try
            {
                _emailService.SendForgotPasswordEmail(user.Firstname, user.Email, endpoint);
            }
            catch
            {
                return StatusCode(500);
            }

            return Ok();
        }

        [HttpPost, Route("reset-password")]
        public ActionResult ResetPassword(string newPassword)
        {
            var resetPasswordClaim = User.FindFirst(x => x.Type == "ResetPassword");
            if (resetPasswordClaim is null)
            {
                return NotFound();
            }

            if (resetPasswordClaim.Value != "True")
            {
                return Unauthorized();
            }

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
            
            user.SetNewPassword(newPassword);

            _db.SaveChanges();

            return Ok();
        } 
        [HttpPut, Route("update-credentials")]
        public ActionResult UpdateCredentials([FromBody] ChangeCredentialsRequest request)
        {
            if (String.IsNullOrWhiteSpace(request.Email) || !RegexValidation.IsEmailValid(request.Email)) return BadRequest();
            if (String.IsNullOrWhiteSpace(request.OldPassword) || !RegexValidation.IsPasswordValid(request.OldPassword)) return BadRequest();
            if (String.IsNullOrWhiteSpace(request.NewPassword) || !RegexValidation.IsPasswordValid(request.NewPassword)) return BadRequest();

            if (request.OldPassword == request.NewPassword) return BadRequest();

            var userIdClaim = User.FindFirst(x => x.Type == ClaimTypes.NameIdentifier);
            if (userIdClaim is null) return NotFound();
            if (!Guid.TryParse(userIdClaim.Value, out var userId)) return NotFound();
            var user = _db.Users.FirstOrDefault(x => x.Id == userId);
            if (user is null) return NotFound();

            if (!Hasher.CheckPlaintextAgainstHash(request.OldPassword,user.Password,user.Salt)) return Unauthorized();
            if (user.Email != request.Email && _db.Users.FirstOrDefault(u => u.Email == request.Email) != null) return Conflict();

            user.Email = request.Email;
            user.SetNewPassword(request.NewPassword);

            _db.SaveChanges();
            return Ok();
        }
    }
}

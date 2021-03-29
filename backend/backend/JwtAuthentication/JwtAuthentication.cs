using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;

namespace backend.JwtAuthentication
{
    public class JwtAuthentication : IJwtAuthentication
    {
        private readonly BackendContext _db;
        private readonly string _tokenKey;

        public JwtAuthentication(string tokenKey, BackendContext context)
        {
            _tokenKey = tokenKey;
            _db = context;
        }

        public string Authenticate(string email, string password)
        {
            var user = _db.Users.FirstOrDefault(u => u.Password == password && u.Email == email);
            if (user is null)
            {
                return null;
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_tokenKey);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class User
    {
        private User() {}
        public User(string password)
        {
            Confirmed = false;
            (Salt, Password) = Utils.Hasher.HashPassword(password);
        }
        public Guid Id { get; set; }

        [Required]
        public string Firstname { get; set; }

        [Required]
        public string Lastname { get; set; }

        [Required]
        public string Email { get; set; }

        [Required] public string Password { get; }

        [Required]
        public byte[] Salt { get; }

        [Required]
        public bool Confirmed { get; set; }
        public List<Video> Videos { get; set; }
    }
}

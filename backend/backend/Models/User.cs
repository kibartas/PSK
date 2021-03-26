using System;
using System.Collections.Generic;

namespace backend.Models
{
    public class User
    {
        public User()
        {
            Confirmed = false;
        }
        public Guid Id { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public bool Confirmed { get; set; }
        public List<Video> Videos { get; set; }
    }
}

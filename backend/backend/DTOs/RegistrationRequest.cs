using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTOs
{
    public class RegistrationRequest
    {
        private string firstname { get; set; }
        private string lastname { get; set; }
        private string email { get; set; }
        private string password { get; set; }
    }
}

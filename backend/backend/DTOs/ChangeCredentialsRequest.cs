using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using backend.Utils;

namespace backend.DTOs
{
    public class ChangeCredentialsRequest
    {
        [EmailAddress]
        public string Email { get; set; }
        
        [RegularExpression(@"^(?=.*\d)(?=.*[A-Z])(?!.*[^a-zA-Z0-9@#$^+=])(.{8,})$")]
        public string OldPassword { get; set; }
        
        [RegularExpression(@"^(?=.*\d)(?=.*[A-Z])(?!.*[^a-zA-Z0-9@#$^+=])(.{8,})$")]
        public string NewPassword { get; set; }
    }
}

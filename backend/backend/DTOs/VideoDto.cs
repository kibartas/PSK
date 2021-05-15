using System;
using static System.Net.WebRequestMethods;

namespace backend.DTOs
{
    public class VideoDto
    {
        public Guid Id { get; set; }
        public long Size { get; set; }
        public string Title { get; set; }
        public string UploadDate { get; set; }
    }
}

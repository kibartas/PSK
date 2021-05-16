using System;

namespace RestAPI.Models.Responses
{
    public class VideoDto
    {
        public Guid Id { get; set; }
        public long Size { get; set; }
        public string Title { get; set; }
        public DateTime UploadDate { get; set; }

    }
}

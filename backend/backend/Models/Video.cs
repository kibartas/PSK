using System;

namespace backend.Models
{
    public class Video
    {
        public Video()
        {
            UploadDate = DateTime.UtcNow;
            DeleteDate = null;
        }
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime UploadDate { get; set; }
        public DateTime? DeleteDate { get; set; }
        public Guid UserId { get; set; }
        public User User { get; set; }
    }
}

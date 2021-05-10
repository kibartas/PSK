using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTOs
{
    public class VideoDto
    {
        public Guid Id { get; set; }
        public long Size { get; set; }
        public string Title { get; set; }
        public DateTime UploadDate { get; set; }

    }
}

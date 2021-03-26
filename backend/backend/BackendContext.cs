using backend.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend
{
    public class BackendContext : DbContext
    {
        public BackendContext(DbContextOptions<BackendContext> options) : base(options)
        {

        }

        public DbSet<User> Users { get; set; }
        public DbSet<Video> Videos { get; set; }
    }
}

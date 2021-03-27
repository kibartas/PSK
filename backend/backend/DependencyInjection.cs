using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace backend
{
    public static class DependencyInjection
    {
        public static void RegisterDependencies(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<BackendContext>(options => 
            options.UseSqlServer(configuration.GetConnectionString(nameof(BackendContext))));
        }
    }
}

using BusinessLogic.Services.EmailService;
using BusinessLogic.Services.VideoService;
using Microsoft.Extensions.DependencyInjection;

namespace BusinessLogic.Registry
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddBusinessLogicServices(this IServiceCollection services)
        {
            return services
                    .AddScoped<IEmailService, EmailService>()
                    .AddScoped<IVideoService, VideoService>();
        }
    }
}
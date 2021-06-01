using System;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;

namespace RestAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    Directory.SetCurrentDirectory("/home/kibartas/release");
                    webBuilder.UseKestrel(options =>
                        {
                            options.ListenLocalhost(5000, listenOptions =>
                            {
                                listenOptions.UseHttps(Path.Join(AppContext.BaseDirectory, "certificate.pfx"), "daunauskas");
                            });
                        })
                        .UseStartup<Startup>();
                });
    }
}

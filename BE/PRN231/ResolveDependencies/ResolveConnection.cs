using DAL.Context;
using Microsoft.EntityFrameworkCore;

namespace PRN231.ResolveDependencies
{
    public static class ResolveConnection
    {
        public static IServiceCollection ResolveConnectionString(this IServiceCollection services, string conn)
        {
            services.AddDbContext<AppDbContext>(option => option.UseSqlServer(conn));
            return services;
        }
    }
}

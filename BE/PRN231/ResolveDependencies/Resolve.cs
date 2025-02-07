using DAL.Context;
using Microsoft.EntityFrameworkCore;

namespace PRN231.ResolveDependencies
{
    public static class Resolve
    {
        public static IServiceCollection ResolveServices(this IServiceCollection services, string conn)
        {
            services.AddDbContext<AppDbContext>(option => option.UseSqlServer(conn));
            return services;
        }
    }
}

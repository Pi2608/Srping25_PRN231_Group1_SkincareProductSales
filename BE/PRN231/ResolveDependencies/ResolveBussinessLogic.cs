using BLL.Services.Implements.OrderServices;
using BLL.Services.Implements.ProductServices;
using BLL.Services.Implements.UserServices;
using BLL.Services.Interfaces.IOrderServices;
using BLL.Services.Interfaces.IProductServices;
using BLL.Services.Interfaces.IUserServices;
using DAL.Repositories.Implements;
using DAL.Repositories.Interfaces;

namespace PRN231.ResolveDependencies
{
    public static class ResolveBussinessLogic
    {
        public static IServiceCollection ResolveBussinessLogicInstance(this IServiceCollection services)
        {
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IRoleService, RoleService>();
            services.AddScoped<ICategoryService, CategoryService>();
            services.AddScoped<IProductService, ProductService>();
            services.AddScoped<IProductCategoryService, ProductCategoryService>();
            services.AddScoped<IProductDetailService, ProductDetailService>();
            services.AddScoped<IRatingReviewService, RatingReviewService>();
            services.AddScoped<IOrderService, OrderService>();
            services.AddScoped<IOrderDetailService, OrderDetailServices>();
            services.AddScoped<IOrderVoucherService, OrderVoucherService>();
            services.AddScoped<IVoucherService, VoucherService>();
            return services;
        }
    }
}

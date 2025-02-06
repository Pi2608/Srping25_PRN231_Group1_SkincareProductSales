using DAL.Models.OrderModel;
using DAL.Models.ProductModel;
using DAL.Models.UserModel;
using Microsoft.EntityFrameworkCore;

namespace DAL.Context
{
    public class AppDbContext : DbContext
    {
        //UserModel
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        //ProductModel
        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductCategory> ProductCategories { get; set; }
        public DbSet<ProductDetail> ProductDetails { get; set; }
        public DbSet<RatingReview> RatingReviews { get; set; }
        //OrderModel
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderDetail> OrderDetails { get; set; }
        public DbSet<OrderVoucher> OrderVouchers { get; set; }
        public DbSet<Voucher> Vouchers { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> context) : base(context)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //TODO
        }
    }
}

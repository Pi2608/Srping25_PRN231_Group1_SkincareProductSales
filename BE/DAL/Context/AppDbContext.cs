using DAL.Models;
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
            modelBuilder.Entity<BaseEntity>(entity => {
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETDATE()");
                entity.Property(e => e.UpdateAt).HasDefaultValueSql("GETDATE()");
                entity.Property(e => e.DeletedAt).IsRequired(false);
                entity.Property(e => e.CreatedBy).IsRequired(false);
                entity.Property(e => e.UpdatedBy).IsRequired(false);
            });
            //UserModel
            modelBuilder.Entity<User>()
                        .HasOne(user => user.Role)
                        .WithMany(role => role.Users)
                        .HasForeignKey(user => user.RoleId).OnDelete(DeleteBehavior.NoAction);

            //ProductModel
            modelBuilder.Entity<ProductDetail>()
                        .HasOne(detail => detail.Product)
                        .WithMany(product => product.ProductDetails)
                        .HasForeignKey(detail => detail.ProductId).OnDelete(DeleteBehavior.NoAction);
            modelBuilder.Entity<RatingReview>()
                        .HasOne(review => review.Product)
                        .WithMany(product => product.RatingReviews)
                        .HasForeignKey(review => review.ProductId).OnDelete(DeleteBehavior.NoAction);
            modelBuilder.Entity<ProductCategory>()
                        .HasOne(pc => pc.Product)
                        .WithMany(product => product.ProductCategories)
                        .HasForeignKey(pc => pc.ProductId).OnDelete(DeleteBehavior.NoAction);
            modelBuilder.Entity<ProductCategory>()
                        .HasOne(pc => pc.Category)
                        .WithMany(category => category.ProductCategories)
                        .HasForeignKey(pc => pc.CategoryId).OnDelete(DeleteBehavior.NoAction);
            modelBuilder.Entity<ProductCategory>().HasKey(pc => new { pc.ProductId, pc.CategoryId });

            //OrderModel
            modelBuilder.Entity<OrderDetail>()
                        .HasOne(od => od.Product)
                        .WithMany(product => product.OrderDetails)
                        .HasForeignKey(od => od.ProductId).OnDelete(DeleteBehavior.NoAction);
            modelBuilder.Entity<OrderDetail>()
                        .HasOne(od => od.Order)
                        .WithMany(order => order.OrderDetails)
                        .HasForeignKey(od => od.OrderId).OnDelete(DeleteBehavior.NoAction);
            modelBuilder.Entity<OrderVoucher>()
                        .HasOne(voucher => voucher.Order)
                        .WithMany(order => order.OrderVouchers)
                        .HasForeignKey(voucher => voucher.OrderId).OnDelete(DeleteBehavior.NoAction);
            modelBuilder.Entity<OrderVoucher>()
                        .HasOne(ov => ov.Voucher)
                        .WithMany(voucher => voucher.OrderVouchers)
                        .HasForeignKey(ov => ov.VoucherId).OnDelete(DeleteBehavior.NoAction);
            modelBuilder.Entity<OrderVoucher>().HasKey(ov => new { ov.OrderId, ov.VoucherId });
        }

        public static void SeedData(AppDbContext context)
        {
            var existingRoles = context.Roles.Select(r => r.RoleName).ToHashSet();

            var rolesToAdd = new List<Role>();

            if (!existingRoles.Contains("Admin"))
            {
                rolesToAdd.Add(new Role { Id = Guid.NewGuid(), RoleName = "Admin" });
            }

            if (!existingRoles.Contains("Customer"))
            {
                rolesToAdd.Add(new Role { Id = Guid.NewGuid(), RoleName = "Customer" });
            }

            if (rolesToAdd.Count > 0)
            {
                context.Roles.AddRange(rolesToAdd);
                context.SaveChanges();
            }
        }
    }
}

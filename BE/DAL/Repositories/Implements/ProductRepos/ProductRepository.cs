using DAL.Context;
using DAL.Models.ProductModel;
using DAL.Repositories.Interfaces.IProductRepos;
using System;
using System.Threading.Tasks;

namespace DAL.Repositories.Implements.ProductRepos
{
    public class ProductRepository : Repository<Product>, IProductRepository
    {
        public ProductRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<Product> UpdateAsync(Product product)
        {
            await base.UpdateAsync(product);
            return product;
        }
    }
}

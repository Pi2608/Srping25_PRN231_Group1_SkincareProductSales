using DAL.Models.ProductModel;
using System;
using System.Threading.Tasks;

namespace DAL.Repositories.Interfaces.IProductRepos
{
    public interface IProductRepository : IRepository<Product>
    {
        Task<Product> UpdateAsync(Product product);
    }
}
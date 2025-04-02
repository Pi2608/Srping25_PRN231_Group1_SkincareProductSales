using DAL.Models.ProductModel;
using DTO.Product;

namespace DAL.Repositories.Interfaces.IProductRepos
{
    public interface IProductDetailRepository : IRepository<ProductDetail>
    {
        Task<ProductDetail?> FindProduct(Guid id, int size);
        Task<List<ProductDetailViewDto>> GetProductDetailsByProductIdAsync(Guid id);
    }
}

using DAL.Models.ProductModel;
using DTO.Product;

namespace BLL.Services.Interfaces.IProductServices
{
    public interface ICategoryService
    {
        Task<IEnumerable<CategoryDTO>> GetAllCategory();
        Task<Category> CreateCategory(Category category);
        Task<Category> CreateProductDetail(Category category);
        //Task<Product> GetProductById(Guid productId);
    }
}

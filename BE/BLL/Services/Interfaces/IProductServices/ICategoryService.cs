using DAL.Models.ProductModel;

namespace BLL.Services.Interfaces.IProductServices
{
    public interface ICategoryService
    {
        Task<IEnumerable<Category>> GetAllCategory();
        Task<Category> CreateCategory(Category category);
        Task<Category> CreateProductDetail(Category category);
        //Task<Product> GetProductById(Guid productId);
    }
}

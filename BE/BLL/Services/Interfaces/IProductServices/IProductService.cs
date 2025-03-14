using DAL.Models.ProductModel;
using DTO.Product;

namespace BLL.Services.Interfaces.IProductServices
{
    public interface IProductService
    {
        Task<List<ProductViewDTO>> GetAllProducts();
        Task<ProductViewDTO> GetProductById(Guid id);
        Task<ProductViewDTO> CreateProduct(CreatProductDTO productDto);
        Task<ProductViewDTO> UpdateProduct(Guid id, CreatProductDTO productDto);
        Task<bool> DeleteProduct(Guid id);
    }
}
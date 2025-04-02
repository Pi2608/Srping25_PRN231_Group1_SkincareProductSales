using DAL.Models.ProductModel;
using DTO.Product;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BLL.Services.Interfaces.IProductServices
{
    public interface IProductDetailService
    {
        Task<List<ProductDetailViewDto>> GetAllProductDetails();
        Task<ProductDetailViewDto> GetProductDetailById(Guid id);
        Task<ProductDetailViewDto> CreateProductDetail(CreateProductDetailDTO productDetail);
        Task<List<ProductDetailViewDto>> GetProductDetailByProductId(Guid productId);
        Task<ProductDetailViewDto> UpdateProductDetail(Guid id, CreateProductDetailDTO productDetail);
        Task<bool> DeleteProductDetail(Guid id);
    }
}
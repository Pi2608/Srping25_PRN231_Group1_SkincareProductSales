using DAL.Models.ProductModel;

namespace BLL.Services.Interfaces.IProductServices
{
    public interface IProductDetailService
    {
        Task<List<ProductDetail>> GetAllProductDetails();
        Task<ProductDetail> GetProductDetailById(Guid id);
        Task<ProductDetail> CreateProductDetail(ProductDetail productDetail);
        Task<ProductDetail> UpdateProductDetail(Guid id, ProductDetail updatedProductDetail);
        Task<bool> DeleteProductDetail(Guid id);
    }
}

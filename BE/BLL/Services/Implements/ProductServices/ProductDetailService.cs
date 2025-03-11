using BLL.Services.Interfaces.IProductServices;
using DAL.Models.ProductModel;
using DAL.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace BLL.Services.Implements.ProductServices
{
    public class ProductDetailService : IProductDetailService
    {
        private readonly IUnitOfWork _unitOfWork;

        public ProductDetailService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ProductDetail> CreateProductDetail(ProductDetail productDetail)
        {
            var newProductDetail = await _unitOfWork.ProductDetailRepository.AddAsync(productDetail);
            var process = await _unitOfWork.SaveChangeAsync();
            if (process > 0)
            {
                return newProductDetail;
            }
            throw new Exception("Add fail");
        }

        public Task<bool> DeleteProductDetail(Guid id)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> DeleteProductDtail(Guid id)
        {
            var productdetail = await _unitOfWork.ProductDetailRepository.GetByIdAsync(id);
            if (productdetail is null)
            {
                throw new Exception("Delete fail");
            }
            productdetail.DeletedAt = DateTime.UtcNow;
            await _unitOfWork.ProductDetailRepository.DeleteAsync(productdetail);
            return true;
        }

        public Task<List<ProductDetail>> GetAllProductDetails()
        {
            throw new NotImplementedException();
        }

        public async Task<List<ProductDetail>> GetAllProductsDetail()
        {
            var productdetails = await _unitOfWork.ProductDetailRepository.GetAllAsync(null, true);
            if (productdetails.IsNullOrEmpty())
            {
                throw new Exception("Products is empty");
            }
            return await productdetails.ToListAsync();
        }

        public async Task<ProductDetail> GetProductById(Guid id)
        {
            var productproductdetail = await _unitOfWork.ProductDetailRepository.GetByIdAsync(id);
            if (productproductdetail is null)
            {
                throw new Exception("Product is null");
            }
            return productproductdetail;
        }

        public Task<ProductDetail> GetProductDetailById(Guid id)
        {
            throw new NotImplementedException();
        }

        public async Task<ProductDetail> UpdateProductDetail(Guid id, ProductDetail updatedProductDetail)
        {
            var existingProductDetail = await _unitOfWork.ProductDetailRepository.GetByIdAsync(id, true);
            if (existingProductDetail is null)
            {
                throw new Exception("ProductDetail not found");
            }

            existingProductDetail.ProductId = updatedProductDetail.ProductId;
            existingProductDetail.Product = updatedProductDetail.Product;
            existingProductDetail.Size = updatedProductDetail.Size;
            existingProductDetail.StockQuantity = updatedProductDetail.StockQuantity;
            existingProductDetail.Description = updatedProductDetail.Description;
            existingProductDetail.UpdateAt = DateTime.Now;

            await _unitOfWork.ProductDetailRepository.UpdateAsync(existingProductDetail);
            var process = await _unitOfWork.SaveChangeAsync();
            if (process > 0)
            {
                return existingProductDetail;
            }
            throw new Exception("Update failed");
        }

    }
}

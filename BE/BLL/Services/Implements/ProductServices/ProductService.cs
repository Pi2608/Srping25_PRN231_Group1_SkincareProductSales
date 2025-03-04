using BLL.Services.Interfaces.IProductServices;
using DAL.Models.ProductModel;
using DAL.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace BLL.Services.Implements.ProductServices
{
    public class ProductService : IProductService
    {
        private readonly IUnitOfWork _unitOfWork;

        public ProductService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<Product> CreateProduct(Product product)
        {
            var newProduct = await _unitOfWork.ProductRepository.AddAsync(product);
            var process = await _unitOfWork.SaveChangeAsync();
            if (process > 0)
            {
                return newProduct;
            }
            throw new Exception("Add fail");
        }

        public async Task<bool> DeleteProduct(Guid id)
        {
            var product = await _unitOfWork.ProductRepository.GetByIdAsync(id);
            if (product is null)
            {
                throw new Exception("Delete fail");
            }
            product.DeletedAt = DateTime.UtcNow;
            await _unitOfWork.ProductRepository.DeleteAsync(product);
            return true;
        }

        public async Task<List<Product>> GetAllProducts()
        {
            var products = await _unitOfWork.ProductRepository.GetAllAsync(null, true);
            if (products.IsNullOrEmpty())
            {
                throw new Exception("Products is empty");
            }
            return await products.ToListAsync();
        }

        public async Task<Product> GetProductById(Guid id)
        {
            var product = await _unitOfWork.ProductRepository.GetByIdAsync(id);
            if (product is null)
            {
                throw new Exception("Product is null");
            }
            return product;
        }

        public async Task<Product> UpdateProduct(Guid id, Product product)
        {
            var existingProduct = await _unitOfWork.ProductRepository.GetByIdAsync(id, true);
            if (existingProduct is null)
            {
                throw new Exception("Product is null");
            }
            existingProduct.Name = product.Name;
            existingProduct.Image = product.Image;
            existingProduct.ShortDescription = product.ShortDescription;
            existingProduct.ProductDetails = product.ProductDetails;
            existingProduct.RatingReviews = product.RatingReviews;
            existingProduct.ProductCategories = product.ProductCategories;
            existingProduct.OrderDetails = product.OrderDetails;
            existingProduct.UpdateAt = DateTime.Now;

            await _unitOfWork.ProductRepository.UpdateAsync(existingProduct);
            var process = await _unitOfWork.SaveChangeAsync();
            if (process > 0)
            {
                return existingProduct;
            }
            throw new Exception("Update fail");
        }
    }
}
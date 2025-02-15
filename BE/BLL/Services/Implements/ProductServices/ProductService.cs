using BLL.Services.Interfaces.IProductServices;
using DAL.Models.ProductModel;
using DAL.Repositories.Interfaces.IProductRepos;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BLL.Services.Implements.ProductServices
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;

        public ProductService(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<IEnumerable<Product>> GetAllProductsAsync()
        {
            return await _productRepository.GetAllAsync();
        }

        public async Task<Product?> GetProductByIdAsync(Guid id)
        {
            return await _productRepository.GetByIdAsync(id);
        }

        //public async Task<Product> CreateProductAsync(Product product)
        //{
        //    return await _productRepository.AddAsync(product);
        //}

        public async Task<Product?> UpdateProductAsync(Guid id, Product product)
        {
            var existingProduct = await _productRepository.GetByIdAsync(id);
            if (existingProduct == null) return null;

            existingProduct.Name = product.Name;
            existingProduct.Image = product.Image;
            existingProduct.ShortDescription = product.ShortDescription;
            existingProduct.ProductDetails = product.ProductDetails;
            existingProduct.RatingReviews = product.RatingReviews;
            existingProduct.ProductCategories = product.ProductCategories;
            existingProduct.OrderDetails = product.OrderDetails;

            existingProduct = await _productRepository.UpdateAsync(existingProduct);
            return existingProduct;
        }

        public async Task<bool> DeleteProductAsync(Guid id)
        {
            var product = await _productRepository.GetByIdAsync(id);
            if (product == null) return false;
            await _productRepository.DeleteAsync(product);
            return true;
        }
    }
}
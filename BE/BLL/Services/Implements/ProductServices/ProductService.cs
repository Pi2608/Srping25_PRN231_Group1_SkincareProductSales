using AutoMapper;
using BLL.Services.Interfaces.IProductServices;
using DAL.Models.ProductModel;
using DAL.Repositories.Interfaces;
using DTO.Product;

namespace BLL.Services.Implements.ProductServices
{
    public class ProductService : IProductService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ProductService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<ProductViewDTO> CreateProduct(CreatProductDTO productDto)
        {
            var newProduct = _mapper.Map<Product>(productDto);
            newProduct.CreatedAt = DateTime.Now;
            var addProductResult = await _unitOfWork.ProductRepository.AddAsync(newProduct);
            await _unitOfWork.SaveChangeAsync();
            if (productDto.ProductCategory != null && productDto.ProductCategory.Any())
            {
                foreach (var categoryId in productDto.ProductCategory)
                {
                    var productCategory = new ProductCategory
                    {
                        ProductId = newProduct.Id,
                        CategoryId = categoryId,
                        Product = newProduct,
                        Category = await _unitOfWork.CategoryRepository.GetByIdAsync(categoryId) // Lấy Category từ DB
                    };

                    await _unitOfWork.ProductCategoryRepository.AddAsync(productCategory);
                }
                await _unitOfWork.SaveChangeAsync();
            }

            return _mapper.Map<ProductViewDTO>(addProductResult);
        }


        public async Task<bool> DeleteProduct(Guid id)
        {
            var existingProduct = await _unitOfWork.ProductRepository.GetByIdAsync(id);
            if (existingProduct != null)
            {
                existingProduct.IsDeleted = true;
                existingProduct.DeletedAt = DateTime.UtcNow;
                var deleteProduct = await _unitOfWork.ProductRepository.UpdateAsync(existingProduct);
                var process = await _unitOfWork.SaveChangeAsync();
                return process > 0;
            }
            throw new Exception("Delete fail");
        }

        public async Task<List<ProductViewDTO>> GetAllProducts()
        {
            var products = await _unitOfWork.ProductRepository
                .GetAllAsync(p => !p.IsDeleted, true, "ProductDetails", "ProductCategories.Category");

            return _mapper.Map<List<ProductViewDTO>>(products);
        }



        public async Task<ProductViewDTO> GetProductById(Guid id)
        {
            var product = await _unitOfWork.ProductRepository
                .GetWithConditionAsync(p => p.IsDeleted == false && p.Id == id, true, "ProductDetails", "ProductCategories.Category");

            if (product != null)
            {
                return _mapper.Map<ProductViewDTO>(product);
            }
            throw new Exception("Not Found");
        }

        public async Task<ProductViewDTO> UpdateProduct(Guid id, CreatProductDTO productDto)
        {
            var existingProduct = await _unitOfWork.ProductRepository.GetByIdAsync(id);
            if (existingProduct != null)
            {
                _mapper.Map(productDto, existingProduct);
                existingProduct.UpdateAt = DateTime.Now;
                var updatedProduct = await _unitOfWork.ProductRepository.UpdateAsync(existingProduct);
                var process = await _unitOfWork.SaveChangeAsync();
                return _mapper.Map<ProductViewDTO>(updatedProduct);
            }
            throw new Exception("Update fail");
        }
    }
}
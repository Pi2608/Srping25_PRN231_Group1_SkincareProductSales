using BLL.Services.Interfaces.IProductServices;
using DAL.Models.ProductModel;
using DAL.Repositories.Interfaces;
using DTO.Product;

namespace BLL.Services.Implements.ProductServices
{
    public class CategoryService : ICategoryService
    {
        private readonly IUnitOfWork _unitOfWork;

        public CategoryService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<Category> CreatCategory(Category category)
        {
            var newCategory = await _unitOfWork.CategoryRepository.AddAsync(category);
            var process = await _unitOfWork.SaveChangeAsync();
            if (process > 0)
            {
                return newCategory;
            }
            throw new Exception("Add fail");
        }

        public Task<Category> CreateCategory(Category category)
        {
            throw new NotImplementedException();
        }

        public async Task<Category> CreateProductDetail(Category category)
        {
            var newCategory = await _unitOfWork.CategoryRepository.AddAsync(category);
            var process = await _unitOfWork.SaveChangeAsync();
            if (process > 0)
            {
                return newCategory;
            }
            throw new Exception("Add fail");
        }

        public async Task<IEnumerable<CategoryDTO>> GetAllCategory()
        {
            var categories = await _unitOfWork.CategoryRepository.GetAllAsync();

            return categories.Select(c => new CategoryDTO
            {
                Id = c.Id,
                Name = c.Name,
            });
        }
    }
}

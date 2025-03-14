using BLL.Services.Interfaces.IProductServices;
using Microsoft.AspNetCore.Mvc;
using DAL.Models.ProductModel;

namespace PRN231.Controllers.ProductControllers
{
    public class CategoryController : BaseController
    {
        private readonly ICategoryService _categoryService;

        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCategory()
        {
            try
            {
                var categories = await _categoryService.GetAllCategory();
                return Ok(categories);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //    [HttpPost]
        //    public async Task<IActionResult> CreateCategory([FromBody] CategoryDto categoryDto)
        //    {
        //        try
        //        {
        //            var category = new Category
        //            {
        //                Id = categoryDto.Id,
        //                Name = categoryDto.Name,
        //                ProductCategories = categoryDto.ProductCategoryIds.Select(id => new ProductCategory { ProductId = id, Id = Guid.NewGuid() }).ToList()
        //            };

        //            var result = await _categoryService.CreateCategory(category);
        //            return Ok(result);
        //        }
        //        catch (Exception ex)
        //        {
        //            return BadRequest(ex.Message);
        //        }
        //    }
        //}
    }
}
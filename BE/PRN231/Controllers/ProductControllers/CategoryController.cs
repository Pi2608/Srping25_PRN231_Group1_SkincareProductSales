using BLL.Services.Interfaces.IProductServices;
using Microsoft.AspNetCore.Mvc;
using DAL.Models.ProductModel;

namespace PRN231.Controllers.ProductControllers
{
    //[ApiController]
    //[Route("api/[controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
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
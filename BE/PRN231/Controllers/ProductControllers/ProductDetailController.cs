using BLL.Services.Implements.ProductServices;
using BLL.Services.Interfaces.IProductServices;
using DAL.Models.ProductModel;
using Microsoft.AspNetCore.Mvc;

namespace PRN231.Controllers.ProductControllers
{
    public class ProductDetailController : BaseController
    {
        private readonly IProductDetailService _productDetailService;
    public ProductDetailController(IProductDetailService productDetailService)
    {
        _productDetailService = productDetailService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllProductDetails()
    {
        try
        {
            var products = await _productDetailService.GetAllProductDetails();
            return Ok(products);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetById([FromRoute] Guid id)
    {
        try
        {
            var product = await _productDetailService.GetProductDetailById(id);
            return Ok(product);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateProductDetail([FromBody] ProductDetail product)
    {
        try
        {
            var result = await _productDetailService.CreateProductDetail(product);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut]
    public async Task<IActionResult> UpdateProductDetail([FromRoute] Guid id, [FromBody] ProductDetail product)
    {
        try
        {
            var result = await _productDetailService.UpdateProductDetail(id, product);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteProductDetail([FromRoute] Guid id)
    {
        try
        {
            var result = await _productDetailService.DeleteProductDetail(id);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest();
        }
    }
}
}

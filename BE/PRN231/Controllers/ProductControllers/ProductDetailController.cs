using BLL.Services.Implements.ProductServices;
using BLL.Services.Interfaces.IProductServices;
using DAL.Models.ProductModel;
using DTO.Product;
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
            var productDetails = await _productDetailService.GetAllProductDetails();
            return Ok(productDetails);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetProductDetailById([FromQuery] Guid id)
    {
        try
        {
            var productDetail = await _productDetailService.GetProductDetailById(id);
            return Ok(productDetail);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

        [HttpGet]
    public async Task<IActionResult> GetProductDetailByProductId([FromQuery]Guid productId)
    {
        var result = await _productDetailService.GetProductDetailByProductId(productId);
        return Ok(result);
    }

        [HttpPost]
        public async Task<IActionResult> CreateProductDetail([FromBody] CreateProductDetailDTO productDetailDto)
        {
            try
            {
                var result = await _productDetailService.CreateProductDetail(productDetailDto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        public async Task<IActionResult> UpdateProductDetail([FromQuery] Guid id, [FromBody] CreateProductDetailDTO productDetailDto)
        {
            try
            {
                var result = await _productDetailService.UpdateProductDetail(id, productDetailDto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteProductDetail([FromQuery] Guid id)
        {
            try
            {
                var result = await _productDetailService.DeleteProductDetail(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}

using BLL.Services.Interfaces.IProductServices;
using DAL.Models.ProductModel;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PRN231.Controllers.ProductControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products = await _productService.GetAllProductsAsync();
            return Ok(products);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var product = await _productService.GetProductByIdAsync(id);
            if (product == null) return NotFound();
            return Ok(product);
        }

        //[HttpPost]
        //public async Task<IActionResult> Create([FromBody] Product product)
        //{
        //    if (!ModelState.IsValid) return BadRequest(ModelState);
        //    var createdProduct = await _productService.CreateProductAsync(product);
        //    return CreatedAtAction(nameof(GetById), new { id = createdProduct.Id }, createdProduct);
        //}

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] Product product)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var updatedProduct = await _productService.UpdateProductAsync(id, product);
            if (updatedProduct == null) return NotFound();
            return Ok(updatedProduct);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var success = await _productService.DeleteProductAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}
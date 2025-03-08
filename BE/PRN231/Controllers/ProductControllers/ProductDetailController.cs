using BLL.Services.Interfaces.IProductServices;
using DAL.Models.ProductModel;
using Microsoft.AspNetCore.Mvc;

namespace PRN231.Controllers.ProductControllers
{
    public class ProductDetailController : BaseController
    {
        private readonly IProductService _productDetailService;
    }
}

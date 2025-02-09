using BLL.Services.Interfaces.IProductServices;
using DAL.Repositories.Interfaces;

namespace BLL.Services.Implements.ProductServices
{
    public class ProductDetailService : IProductDetailService
    {
        private readonly IUnitOfWork _unitOfWork;

        public ProductDetailService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
    }
}

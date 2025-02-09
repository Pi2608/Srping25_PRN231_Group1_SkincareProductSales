using BLL.Services.Interfaces.IProductServices;
using DAL.Repositories.Interfaces;

namespace BLL.Services.Implements.ProductServices
{
    public class ProductService : IProductService
    {
        private readonly IUnitOfWork _unitOfWork;

        public ProductService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
    }
}

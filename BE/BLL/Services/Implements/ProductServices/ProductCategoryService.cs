using BLL.Services.Interfaces.IProductServices;
using DAL.Repositories.Interfaces;

namespace BLL.Services.Implements.ProductServices
{
    public class ProductCategoryService : IProductCategoryService
    {
        private readonly IUnitOfWork _unitOfWork;

        public ProductCategoryService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
    }
}

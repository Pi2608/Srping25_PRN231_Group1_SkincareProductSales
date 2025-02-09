using BLL.Services.Interfaces.IProductServices;
using DAL.Repositories.Interfaces;

namespace BLL.Services.Implements.ProductServices
{
    public class CategoryService : ICategoryService
    {
        private readonly IUnitOfWork _unitOfWork;

        public CategoryService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
    }
}

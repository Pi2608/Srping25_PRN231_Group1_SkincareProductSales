using BLL.Services.Interfaces.IProductServices;
using DAL.Repositories.Interfaces;

namespace BLL.Services.Implements.ProductServices
{
    public class RatingReviewService : IRatingReviewService
    {
        private readonly IUnitOfWork _unitOfWork;

        public RatingReviewService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
    }
}

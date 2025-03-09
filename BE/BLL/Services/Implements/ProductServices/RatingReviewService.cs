using BLL.Services.Interfaces.IProductServices;
using DAL.Models.ProductModel;
using DAL.Repositories.Interfaces;
using DTO.Product;

namespace BLL.Services.Implements.ProductServices
{
    public class RatingReviewService : IRatingReviewService
    {
        private readonly IUnitOfWork _unitOfWork;

        public RatingReviewService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<bool> CreateFeedbackAsync(RatingReview feedback)
        {
            if (feedback == null) return false;

            var result = await _unitOfWork.RatingReviewRepository.CreateFeedbackAsync(feedback);
            return result;
        }

        public async Task<IEnumerable<RatingReviewDTO>> GetAllFeedbackAsync()
        {
            return await _unitOfWork.RatingReviewRepository.GetAllFeedbackAsync();
        }

        public async Task<IEnumerable<RatingReview>> GetProdFeedbackAsync(Guid prodId)
        {
            return await _unitOfWork.RatingReviewRepository.GetProdFeedbackAsync(prodId);
        }

        public async Task<bool> EditFeedbackAsync(string feedbackId, RatingReview feedback)
        {
            var result = await _unitOfWork.RatingReviewRepository.EditFeedbackAsync(feedbackId, feedback);
            return result;
        }

        public async Task<bool> DeleteFeedbackAsync(string feedbackId)
        {
            var result = await _unitOfWork.RatingReviewRepository.DeleteFeedbackAsync(feedbackId);
            return result;
        }
    }
}

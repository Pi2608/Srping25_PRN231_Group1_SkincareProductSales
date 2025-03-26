using AutoMapper;
using BLL.Services.Interfaces.IProductServices;
using DAL.Models.ProductModel;
using DAL.Repositories.Interfaces;
using DTO.Product;

namespace BLL.Services.Implements.ProductServices
{
    public class RatingReviewService : IRatingReviewService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public RatingReviewService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<(bool success, string message, RatingReview ratingReview)> CreateFeedbackAsync(Guid userId, CreateRatingReviewDTO feedback)
        {
            if (feedback == null) return new ValueTuple<bool, string, RatingReview>(false, "Rating review cannot be null", null);
            var rtfbDto = _mapper.Map<CreateRatingReviewDTO, RatingReview>(feedback);
            rtfbDto.UserId = userId;
            var result = await _unitOfWork.RatingReviewRepository.CreateRatingReviewAsync(rtfbDto);
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

        public async Task<bool> EditFeedbackAsync(Guid feedbackId, RatingReview feedback)
        {
            var result = await _unitOfWork.RatingReviewRepository.EditFeedbackAsync(feedbackId, feedback);
            return result;
        }

        public async Task<bool> DeleteFeedbackAsync(Guid feedbackId)
        {
            var result = await _unitOfWork.RatingReviewRepository.DeleteFeedbackAsync(feedbackId);
            return result;
        }

        public async Task<RatingReview?> GetFeedbackByIdAsync(Guid feedbackId)
        {
            return await _unitOfWork.RatingReviewRepository.GetFeedbackByIdAsync(feedbackId);
        }
    }
}

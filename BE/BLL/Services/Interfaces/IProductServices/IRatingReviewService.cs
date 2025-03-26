using DAL.Models.ProductModel;
using DTO.Product;

namespace BLL.Services.Interfaces.IProductServices
{
    public interface IRatingReviewService
    {
        Task<(bool success, string message, RatingReview ratingReview)> CreateFeedbackAsync(Guid userId, CreateRatingReviewDTO feedback);
        Task<IEnumerable<RatingReviewDTO>> GetAllFeedbackAsync();
        Task<IEnumerable<RatingReview>> GetProdFeedbackAsync(Guid prodId);
        Task<RatingReview?> GetFeedbackByIdAsync(Guid feedbackId);
        Task<bool> EditFeedbackAsync(Guid feedbackId, RatingReview feedback);
        Task<bool> DeleteFeedbackAsync(Guid feedbackId);
    }
}

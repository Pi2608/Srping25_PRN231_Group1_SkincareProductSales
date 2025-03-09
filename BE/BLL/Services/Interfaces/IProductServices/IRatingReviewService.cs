using DAL.Models.ProductModel;
using DTO.Product;

namespace BLL.Services.Interfaces.IProductServices
{
    public interface IRatingReviewService
    {
        Task<bool> CreateFeedbackAsync(RatingReview feedback);
        Task<IEnumerable<RatingReviewDTO>> GetAllFeedbackAsync();
        Task<IEnumerable<RatingReview>> GetProdFeedbackAsync(Guid prodId);
        Task<bool> EditFeedbackAsync(string feedbackId, RatingReview feedback);
        Task<bool> DeleteFeedbackAsync(string feedbackId);
    }
}

using DAL.Models.ProductModel;
using DTO.Product;

namespace DAL.Repositories.Interfaces.IProductRepos
{
    public interface IRatingReviewRepository : IRepository<RatingReview>
    {
        Task<bool> CreateFeedbackAsync(RatingReview feedback);
        Task<IEnumerable<RatingReviewDTO>> GetAllFeedbackAsync();
        Task<IEnumerable<RatingReview>> GetProdFeedbackAsync(Guid prodId);
        Task<RatingReview?> GetFeedbackByIdAsync(Guid feedBackId);
        Task<bool> EditFeedbackAsync(Guid feedbackId, RatingReview feedback);
        Task<bool> DeleteFeedbackAsync(Guid feedbackId);
    }
}

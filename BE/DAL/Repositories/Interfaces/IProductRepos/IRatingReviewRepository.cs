using DAL.Models.ProductModel;
using DTO.Product;

namespace DAL.Repositories.Interfaces.IProductRepos
{
    public interface IRatingReviewRepository : IRepository<RatingReview>
    {
        Task<bool> CreateFeedbackAsync(RatingReview feedback);
        Task<IEnumerable<RatingReviewDTO>> GetAllFeedbackAsync();
        Task<IEnumerable<RatingReview>> GetProdFeedbackAsync(Guid prodId);
        Task<bool> EditFeedbackAsync(string feedbackId, RatingReview feedback);
        Task<bool> DeleteFeedbackAsync(string feedbackId);
    }
}

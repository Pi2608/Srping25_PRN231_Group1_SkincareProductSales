using DAL.Models.ProductModel;

namespace DAL.Repositories.Interfaces.IProductRepos
{
    public interface IRatingReviewRepository : IRepository<RatingReview>
    {
        Task<bool> CreateFeedbackAsync(RatingReview feedback);
        Task<IEnumerable<RatingReview>> GetAllFeedbackAsync();
        Task<IEnumerable<RatingReview>> GetProdFeedbackAsync(Guid prodId);
        Task<bool> EditFeedbackAsync(string feedbackId, RatingReview feedback);
        Task<bool> DeleteFeedbackAsync(string feedbackId);
    }
}

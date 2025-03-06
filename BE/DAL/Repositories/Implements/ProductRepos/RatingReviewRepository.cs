using DAL.Context;
using DAL.Models.ProductModel;
using DAL.Repositories.Interfaces.IProductRepos;

namespace DAL.Repositories.Implements.ProductRepos
{
    public class RatingReviewRepository : Repository<RatingReview>, IRatingReviewRepository
    {
        public RatingReviewRepository(AppDbContext context) : base(context)
        {
        }

        public Task<bool> CreateFeedbackAsync(RatingReview feedback)
        {
            throw new NotImplementedException();
        }

        public Task<bool> DeleteFeedbackAsync(string feedbackId)
        {
            throw new NotImplementedException();
        }

        public Task<bool> EditFeedbackAsync(string feedbackId, RatingReview feedback)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<RatingReview>> GetAllFeedbackAsync()
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<RatingReview>> GetProdFeedbackAsync(Guid prodId)
        {
            throw new NotImplementedException();
        }
    }
}

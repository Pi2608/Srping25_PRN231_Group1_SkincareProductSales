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
    }
}

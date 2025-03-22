using DAL.Context;
using DAL.Models.ProductModel;
using DAL.Repositories.Interfaces.IProductRepos;
using DTO.Product;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories.Implements.ProductRepos
{
    public class RatingReviewRepository : Repository<RatingReview>, IRatingReviewRepository
    {
        private readonly AppDbContext _context;

        public RatingReviewRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<(bool success, string message, RatingReview review)> CreateRatingReviewAsync(RatingReview ratingReview)
        {
            if (ratingReview == null)
                return (false, "Rating review cannot be null", null);

            bool hasExistingReview = await _context.RatingReviews
                .AnyAsync(r => r.UserId == ratingReview.UserId && 
                            r.ProductId == ratingReview.ProductId && 
                            !r.IsDeleted);

            if (hasExistingReview)
                return (false, "You have already reviewed this product", null);

            bool hasPurchasedAndReceived = await _context.Orders
                .Where(o => o.UserId == ratingReview.UserId && 
                        o.Status == Models.OrderModel.Status.Completed && 
                        !o.IsDeleted)
                .Join(_context.OrderDetails,
                    order => order.Id,
                    orderDetail => orderDetail.OrderId,
                    (order, orderDetail) => new { order, orderDetail })
                .AnyAsync(x => x.orderDetail.ProductId == ratingReview.ProductId && 
                            !x.orderDetail.IsDeleted);

            if (!hasPurchasedAndReceived)
                return (false, "You can only review products you have purchased and received", null);

            ratingReview.CreatedAt = DateTime.UtcNow;
            ratingReview.CreatedBy = ratingReview.UserId;
            ratingReview.IsDeleted = false;

            _context.RatingReviews.Add(ratingReview);
            await _context.SaveChangesAsync();

            return (true, "Review submitted successfully", ratingReview);
        }


        public async Task<bool> DeleteFeedbackAsync(Guid feedbackId)
        {
            var feedback = await _context.RatingReviews.FindAsync(feedbackId);
            if (feedback == null) return false;

            _context.RatingReviews.Remove(feedback);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> EditFeedbackAsync(Guid feedbackId, RatingReview feedback)
        {
            var existingFeedback = await _context.RatingReviews.FindAsync(feedbackId);
            if (existingFeedback == null) return false;

            existingFeedback.Review = feedback.Review;
            existingFeedback.Rating = feedback.Rating;
            existingFeedback.UpdatedAt = DateTime.UtcNow;

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<IEnumerable<RatingReviewDTO>> GetAllFeedbackAsync()
        {
            return await _context.RatingReviews
                    .Where(r => !r.IsDeleted)
                    .Select(r => new RatingReviewDTO
                    {
                        Id = r.Id,
                        ProductId = r.ProductId,
                        UserId = r.UserId,
                        Rating = r.Rating,
                        Review = r.Review,
                        IsDeleted = r.IsDeleted,
                    }).ToListAsync();
        }

        public async Task<RatingReview?> GetFeedbackByIdAsync(Guid feedBackId)
        {
            return await _context.RatingReviews.FirstOrDefaultAsync(r => r.Id == feedBackId);
        }

        public async Task<IEnumerable<RatingReview>> GetProdFeedbackAsync(Guid prodId)
        {
            return await _context.RatingReviews
                                 .Where(r => r.ProductId == prodId)
                                 .ToListAsync();
        }
    }
}

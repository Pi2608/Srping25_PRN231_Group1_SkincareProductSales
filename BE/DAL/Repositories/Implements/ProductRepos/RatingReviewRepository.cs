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

        public async Task<bool> CreateFeedbackAsync(RatingReview feedback)
        {
            if (feedback == null) return false;

            await _context.RatingReviews.AddAsync(feedback);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteFeedbackAsync(string feedbackId)
        {
            var feedback = await _context.RatingReviews.FindAsync(feedbackId);
            if (feedback == null) return false;

            _context.RatingReviews.Remove(feedback);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> EditFeedbackAsync(string feedbackId, RatingReview feedback)
        {
            var existingFeedback = await _context.RatingReviews.FindAsync(feedbackId);
            if (existingFeedback == null) return false;

            existingFeedback.Review = feedback.Review;
            existingFeedback.Rating = feedback.Rating;
            existingFeedback.UpdateAt = DateTime.UtcNow;

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

        public async Task<IEnumerable<RatingReview>> GetProdFeedbackAsync(Guid prodId)
        {
            return await _context.RatingReviews
                                 .Where(r => r.ProductId == prodId)
                                 .ToListAsync();
        }
    }
}

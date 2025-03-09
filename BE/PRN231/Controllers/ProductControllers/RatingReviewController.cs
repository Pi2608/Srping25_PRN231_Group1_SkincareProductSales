using BLL.Services.Interfaces.IProductServices;
using DAL.Models.ProductModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace PRN231.Controllers.ProductControllers
{
    public class RatingReviewController : BaseController
    {
        private readonly IRatingReviewService _ratingReviewService;

        public RatingReviewController(IRatingReviewService ratingReviewService)
        {
            _ratingReviewService = ratingReviewService;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAllFeedback()
        {
            var feedbacks = await _ratingReviewService.GetAllFeedbackAsync();
            if (feedbacks == null)
            {
                return NotFound("NoFeedback Found.");
            }
            return Ok(feedbacks);
        }

        [HttpGet("{productId}")]
        [Authorize]
        public async Task<IActionResult> GetFeedbackByProduct(Guid productId)
        {
            var feedbacks = await _ratingReviewService.GetProdFeedbackAsync(productId);
            return Ok(feedbacks);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateFeedback([FromBody] RatingReview feedback)
        {
            if (feedback == null) return BadRequest("Invalid feedback data");

            var result = await _ratingReviewService.CreateFeedbackAsync(feedback);
            if (!result) return StatusCode(500, "Failed to create feedback");

            return Ok(new { message = "Feedback added successfully!" });
        }

        [HttpPut("{feedbackId}")]
        [Authorize]
        public async Task<IActionResult> UpdateFeedback(string feedbackId, [FromBody] RatingReview feedback)
        {
            var result = await _ratingReviewService.EditFeedbackAsync(feedbackId, feedback);
            if (!result) return NotFound("Feedback not found or update failed");

            return Ok(new { message = "Feedback updated successfully!" });
        }

        [HttpDelete("{feedbackId}")]
        [Authorize]
        public async Task<IActionResult> DeleteFeedback(string feedbackId)
        {
            var result = await _ratingReviewService.DeleteFeedbackAsync(feedbackId);
            if (!result) return NotFound("Feedback not found or deletion failed");

            return Ok(new { message = "Feedback deleted successfully!" });
        }
    }

}

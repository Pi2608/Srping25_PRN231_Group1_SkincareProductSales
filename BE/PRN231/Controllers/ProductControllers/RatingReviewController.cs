using System.Security.Claims;
using BLL.Services.Interfaces.IProductServices;
using DAL.Models.ProductModel;
using DTO.Product;
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
            return Ok(feedbacks ?? new List<RatingReviewDTO>());
        }

        [HttpGet("{productId}")]
        [Authorize]
        public async Task<IActionResult> GetFeedbackByProduct(Guid productId)
        {
            var feedbacks = await _ratingReviewService.GetProdFeedbackAsync(productId);
            return Ok(feedbacks ?? new List<RatingReview>());
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateFeedback([FromBody] RatingReview feedback)
        {
            if (feedback == null) return BadRequest("Invalid feedback data");

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized("User ID not found.");

            feedback.UserId = Guid.Parse(userIdClaim.Value);

            var result = await _ratingReviewService.CreateFeedbackAsync(feedback);
            if (!result) return StatusCode(500, "Failed to create feedback");

            return Ok(new { message = "Feedback added successfully!" });
        }

        [HttpPut("{feedbackId}")]
        [Authorize]
        public async Task<IActionResult> UpdateFeedback(Guid feedbackId, [FromBody] RatingReview feedback)
    {
        if (feedback == null) return BadRequest("Invalid feedback data");

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null) return Unauthorized("User ID not found.");

        var userId = Guid.Parse(userIdClaim.Value);

        var existingFeedback = await _ratingReviewService.GetFeedbackByIdAsync(feedbackId);
        if (existingFeedback == null || existingFeedback.UserId != userId)
            return Forbid("You can only edit your own feedback");

        var result = await _ratingReviewService.EditFeedbackAsync(feedbackId, feedback);
        if (!result) return NotFound("Feedback not found or update failed");

        return Ok(new { message = "Feedback updated successfully!" });
    }

        [HttpDelete]
        [Authorize]
        public async Task<IActionResult> DeleteFeedback(Guid feedbackId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized("User ID not found.");

            var userId = Guid.Parse(userIdClaim.Value);

            var existingFeedback = await _ratingReviewService.GetFeedbackByIdAsync(feedbackId);
            if (existingFeedback == null || existingFeedback.UserId != userId)
                return Forbid("You can only delete your own feedback");

            var result = await _ratingReviewService.DeleteFeedbackAsync(feedbackId);
            if (!result) return NotFound("Feedback not found or deletion failed");

            return Ok(new { message = "Feedback deleted successfully!" });
        }
    }

}

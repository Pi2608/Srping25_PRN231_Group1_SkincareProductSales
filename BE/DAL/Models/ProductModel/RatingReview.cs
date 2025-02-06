using DAL.Models.UserModel;

namespace DAL.Models.ProductModel
{
    public class RatingReview : BaseEntity
    {
        public required Product Product { get; set; }
        public required Guid ProductId { get; set; }
        public required User User { get; set; }
        public required Guid UserId { get; set; }
        public required double Rating { get; set; }
        public required string Review { get; set; }
    }
}

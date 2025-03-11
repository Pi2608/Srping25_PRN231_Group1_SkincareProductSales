using DAL.Models.OrderModel;

namespace DAL.Models.ProductModel
{
    public class Product : BaseEntity
    {
        public required string Name { get; set; }
        public required string Image { get; set; }
        public required string ShortDescription { get; set; }
        public required decimal Price { get; set; }
        public required IEnumerable<ProductDetail> ProductDetails { get; set; }
        public IEnumerable<RatingReview>? RatingReviews { get; set; }
        public required IEnumerable<ProductCategory> ProductCategories { get; set; }
        public IEnumerable<OrderDetail>? OrderDetails{ get; set; }
    }
}

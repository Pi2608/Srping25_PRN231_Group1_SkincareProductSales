namespace DAL.Models.ProductModel
{
    public class ProductCategory : BaseEntity
    {
        public required Guid ProductId { get; set; }
        public required Product Product { get; set; }
        public required Guid CategoryId { get; set; }
        public required Category Category { get; set; }
    }
}

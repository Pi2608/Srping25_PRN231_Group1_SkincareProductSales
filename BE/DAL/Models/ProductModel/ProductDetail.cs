namespace DAL.Models.ProductModel
{
    public class ProductDetail : BaseEntity
    {
        public required Guid ProductId { get; set; }
        public required Product Product { get; set; }
        public required int Size { get; set; }
        public required int StockQuantity { get; set; }
        public required string Description { get; set; }
    }
}

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
    public class CategoryDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public List<Guid> ProductCategoryIds { get; set; } = new();
    }
}

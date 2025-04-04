
namespace DTO.Product
{
    public class ProductDetailViewDto
    {
        public Guid Id { get; set; }
        public Guid ProductId { get; set; }
        public int Size { get; set; }
        public int StockQuantity { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public bool IsDeleted { get; set; }
    }
}

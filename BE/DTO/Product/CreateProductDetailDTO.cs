namespace DTO.Product
{
    public class CreateProductDetailDTO
    {
        public Guid ProductId { get; set; }
        public int Size { get; set; }
        public int StockQuantity { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
    }
}
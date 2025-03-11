namespace DTO.Order
{
    public class OrderDetailViewDto
    {
        public Guid Id { get; set; }
        public int Quantity { get; set; }
        public Guid ProductId { get; set; }
        public string ProductName { get; set; }
        public decimal TotalPrice { get; set; }
    }
}

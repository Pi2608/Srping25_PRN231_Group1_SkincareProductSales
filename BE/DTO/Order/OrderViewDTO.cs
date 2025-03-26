namespace DTO.Order
{
    public class OrderViewDTO
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public decimal TotalPrice { get; set; }
        public string Status { get; set; }
        public string VoucherId { get; set; }
        public List<OrderDetailViewDto> OrderDetails { get; set; }
    }
}

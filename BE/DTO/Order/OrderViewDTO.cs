namespace DTO.Order
{
    public class OrderViewDTO
    {
        public Guid Id { get; set; }
        public decimal TotalPrice { get; set; }
        public List<OrderDetailViewDto> OrderDetails { get; set; }
    }
}

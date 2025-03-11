namespace DTO.Order
{
    public class CreateOrUpdateOrderDetail
    {
        public int Quantity { get; set; }
        public Guid ProductId { get; set; }
        public bool IsDeleted { get; set; } = false;
    }
}

namespace DTO.Order
{
    public class CreateOrUpdateOrder
    {
        public bool IsDeleted { get; set; } = false;
        public List<CreateOrUpdateOrderDetail> OrderDetails { get; set; }
    }
}

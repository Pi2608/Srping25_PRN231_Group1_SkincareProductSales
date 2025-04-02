namespace DTO.Order
{
    public class CreateOrUpdateOrder
    {
        public bool IsDeleted { get; set; } = false;
        public string? VoucherCode { get; set; }
        public List<CreateOrUpdateOrderDetail> OrderDetails { get; set; }
    }
}

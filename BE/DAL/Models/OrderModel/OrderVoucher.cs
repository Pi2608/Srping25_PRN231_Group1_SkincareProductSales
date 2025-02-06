namespace DAL.Models.OrderModel
{
    public class OrderVoucher : BaseEntity
    {
        public Guid OrderId { get; set; }
        public Guid VoucherId { get; set; }
        public required Order Order { get; set; }
        public required Voucher Voucher { get; set; }
    }
}

namespace DAL.Models.OrderModel
{
    public class Voucher : BaseEntity 
    {
        public required string Code { get; set; }
        public required double DiscountPercentage { get; set; }
        public required DateTime ExpiredDate { get; set; }
        public IEnumerable<OrderVoucher>? OrderVouchers { get; set; }
    }
}


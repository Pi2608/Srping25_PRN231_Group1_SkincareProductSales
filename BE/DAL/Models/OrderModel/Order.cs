using DAL.Models.UserModel;

namespace DAL.Models.OrderModel
{
    public class Order : BaseEntity
    {
        public required decimal TotalPrice { get; set; }
        public Status Status { get; set; }
        public required IEnumerable<OrderDetail> OrderDetails { get; set; }
        public IEnumerable<OrderVoucher>? OrderVouchers{ get; set; }
        public User User{ get; set; }
        public Guid UserId { get; set; }
    }
}

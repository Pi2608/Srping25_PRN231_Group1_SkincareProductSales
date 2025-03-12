using DAL.Models.ProductModel;

namespace DAL.Models.OrderModel
{
    public class OrderDetail : BaseEntity
    {
        public int Quantity { get; set; }
        public decimal TotalPrice { get; set; }
        public required Product Product { get; set; }
        public Guid ProductId { get; set; }
        public int Size{ get; set; }
        public Guid OrderId { get; set; }
        public required Order Order { get; set; }
    }
}

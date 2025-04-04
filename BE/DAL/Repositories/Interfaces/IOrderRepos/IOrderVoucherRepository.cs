using DAL.Models.OrderModel;

namespace DAL.Repositories.Interfaces.IOrderRepos
{
    public interface IOrderVoucherRepository : IRepository<OrderVoucher>
    {
        Task<OrderVoucher?> GetOrderVoucherByOrderId(Guid orderId);
    }
}

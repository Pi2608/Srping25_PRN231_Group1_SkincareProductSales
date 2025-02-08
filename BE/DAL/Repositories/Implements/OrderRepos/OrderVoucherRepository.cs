using DAL.Context;
using DAL.Models.OrderModel;
using DAL.Repositories.Interfaces.IOrderRepos;

namespace DAL.Repositories.Implements.OrderRepos
{
    public class OrderVoucherRepository : Repository<OrderVoucher>, IOrderVoucherRepository
    {
        public OrderVoucherRepository(AppDbContext context) : base(context)
        {
        }
    }
}

using DAL.Context;
using DAL.Models.OrderModel;
using DAL.Repositories.Interfaces.IOrderRepos;

namespace DAL.Repositories.Implements.OrderRepos
{
    public class OrderDetailRepository : Repository<OrderDetail>, IOrderDetailRepository
    {
        public OrderDetailRepository(AppDbContext context) : base(context)
        {
        }
    }
}

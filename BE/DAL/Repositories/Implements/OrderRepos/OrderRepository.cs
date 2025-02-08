using DAL.Context;
using DAL.Models.OrderModel;
using DAL.Repositories.Interfaces.IOrderRepos;

namespace DAL.Repositories.Implements.OrderRepos
{
    public class OrderRepository : Repository<Order>, IOrderRepository
    {
        public OrderRepository(AppDbContext context) : base(context)
        {
        }
    }
}

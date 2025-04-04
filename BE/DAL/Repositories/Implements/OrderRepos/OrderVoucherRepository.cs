using DAL.Context;
using DAL.Models.OrderModel;
using DAL.Repositories.Interfaces.IOrderRepos;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories.Implements.OrderRepos
{
    public class OrderVoucherRepository : Repository<OrderVoucher>, IOrderVoucherRepository
    {
        private readonly AppDbContext _context;
        public OrderVoucherRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<OrderVoucher?> GetOrderVoucherByOrderId(Guid orderId)
        {
            IQueryable<OrderVoucher> query = _dbSet;
            return await query.FirstOrDefaultAsync(v => v.OrderId == orderId);
        }
    }
}

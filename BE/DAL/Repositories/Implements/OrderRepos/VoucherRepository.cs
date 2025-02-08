using DAL.Context;
using DAL.Models.OrderModel;
using DAL.Repositories.Interfaces.IOrderRepos;

namespace DAL.Repositories.Implements.OrderRepos
{
    public class VoucherRepository : Repository<Voucher>, IVoucherRepository
    {
        public VoucherRepository(AppDbContext context) : base(context)
        {
        }
    }
}

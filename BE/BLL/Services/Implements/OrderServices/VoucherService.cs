using BLL.Services.Interfaces.IOrderServices;
using DAL.Repositories.Interfaces;

namespace BLL.Services.Implements.OrderServices
{
    public class VoucherService : IVoucherService
    {
        private readonly IUnitOfWork _unitOfWork;

        public VoucherService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
    }
}

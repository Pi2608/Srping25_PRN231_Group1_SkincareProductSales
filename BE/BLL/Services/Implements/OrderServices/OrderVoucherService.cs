using BLL.Services.Interfaces.IOrderServices;
using DAL.Models.OrderModel;
using DAL.Repositories.Interfaces;

namespace BLL.Services.Implements.OrderServices
{
    public class OrderVoucherService : IOrderVoucherService
    {
        private readonly IUnitOfWork _unitOfWork;

        public OrderVoucherService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
    }
}

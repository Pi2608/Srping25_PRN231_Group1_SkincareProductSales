using BLL.Services.Interfaces.IOrderServices;
using DAL.Repositories.Interfaces;

namespace BLL.Services.Implements.OrderServices
{
    public class OrderService : IOrderService
    {
        private readonly IUnitOfWork _unitOfWork;

        public OrderService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
    }
}

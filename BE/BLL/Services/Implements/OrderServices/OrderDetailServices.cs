using BLL.Services.Interfaces.IOrderServices;
using DAL.Repositories.Interfaces;

namespace BLL.Services.Implements.OrderServices
{
    public class OrderDetailServices : IOrderDetailService
    {
        private readonly IUnitOfWork _unitOfWork;

        public OrderDetailServices(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
    }
}

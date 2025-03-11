using BLL.Services.Interfaces.IOrderServices;
using DAL.Models.OrderModel;
using DAL.Repositories.Interfaces;
using DTO.Order;

namespace BLL.Services.Implements.OrderServices
{
    public class OrderDetailServices : IOrderDetailService
    {
        private readonly IUnitOfWork _unitOfWork;

        public OrderDetailServices(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public Task<OrderDetailViewDto> CreateOrder(Order order)
        {
            throw new NotImplementedException();
        }

        public Task<bool> DeleteOrder(Guid id)
        {
            throw new NotImplementedException();
        }

        public Task<List<OrderDetailViewDto>> GetAllOrder()
        {
            throw new NotImplementedException();
        }

        public Task<OrderDetailViewDto> GetOrderById(Guid id)
        {
            throw new NotImplementedException();
        }

        public Task<OrderDetailViewDto> UpdateOrder(Guid id, OrderDetail order)
        {
            throw new NotImplementedException();
        }
    }
}

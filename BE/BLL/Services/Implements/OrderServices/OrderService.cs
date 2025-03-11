using AutoMapper;
using BLL.Services.Interfaces.IOrderServices;
using DAL.Models.OrderModel;
using DAL.Repositories.Interfaces;
using DTO.Order;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace BLL.Services.Implements.OrderServices
{
    public class OrderService : IOrderService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public OrderService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<OrderViewDTO> CreateOrder(CreateOrUpdateOrder order, Guid userId)
        {
            var newOrder = _mapper.Map<Order>(order);
            newOrder.UserId = userId;
            var addOrderResult = await _unitOfWork.OrderRepository.AddAsync(newOrder);
            var process = await _unitOfWork.SaveChangeAsync();
            if (process > 0)
            {
                var viewOrder = _mapper.Map<OrderViewDTO>(addOrderResult);
                return viewOrder;
            }
            throw new Exception("Add fail");
        }

        public Task<bool> DeleteOrder(Guid id)
        {
            throw new NotImplementedException();
        }

        public Task<List<OrderViewDTO>> GetAllOrder()
        {
            throw new NotImplementedException();
        }

        public Task<OrderViewDTO> GetOrderById(Guid id)
        {
            throw new NotImplementedException();
        }

        public Task<OrderViewDTO> UpdateOrder(Guid id, CreateOrUpdateOrder order)
        {
            throw new NotImplementedException();
        }
    }
}

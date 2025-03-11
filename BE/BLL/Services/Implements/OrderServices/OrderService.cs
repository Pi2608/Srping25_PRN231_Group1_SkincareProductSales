using AutoMapper;
using BLL.Services.Interfaces.IOrderServices;
using DAL.Models.OrderModel;
using DAL.Repositories.Interfaces;
using DTO.Order;

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
            newOrder.CreatedAt = DateTime.Now;
            newOrder.CreatedBy = userId;
            var addOrderResult = await _unitOfWork.OrderRepository.AddAsync(newOrder);
            var process = await _unitOfWork.SaveChangeAsync();
            if (process > 0)
            {
                var viewOrder = _mapper.Map<OrderViewDTO>(addOrderResult);
                return viewOrder;
            }
            throw new Exception("Add fail");
        }

        public async Task<bool> DeleteOrder(Guid id)
        {
            var existingOrder = await _unitOfWork.OrderRepository.GetByIdAsync(id);
            if (existingOrder is not null)
            {
                existingOrder.IsDeleted = true;
                existingOrder.DeletedAt = DateTime.UtcNow;
                var deleteOrder = await _unitOfWork.OrderRepository.UpdateAsync(existingOrder);
                var process = await _unitOfWork.SaveChangeAsync();
                if (process > 0)
                {
                    return true;
                }
            }
            throw new Exception("Update fail");
        }

        public async Task<List<OrderViewDTO>> GetAllOrder()
        {
            var orders = await _unitOfWork.OrderRepository.GetAllAsync(o => o.IsDeleted == false, true, "OrderDetails");

            var viewOrder = _mapper.Map<List<OrderViewDTO>>(orders);

            return viewOrder;
        }

        public async Task<OrderViewDTO> GetOrderById(Guid id)
        {
            var order = await _unitOfWork.OrderRepository.GetByIdAsync(id);
            if (order is not null)
            {
                var result = _mapper.Map<OrderViewDTO>(order);
                return result;
            }
            throw new Exception("Not Found");
        }

        public async Task<OrderViewDTO> UpdateOrder(Guid id, CreateOrUpdateOrder order)
        {
            var existingOrder = await _unitOfWork.OrderRepository.GetByIdAsync(id);
            if (existingOrder is not null)
            {
                var updateOrder = _mapper.Map<Order>(order);
                existingOrder.UpdateAt = DateTime.Now;
                existingOrder.IsDeleted = updateOrder.IsDeleted;
                var result = await _unitOfWork.OrderRepository.UpdateAsync(existingOrder);
                var process = await _unitOfWork.SaveChangeAsync();
                if (process > 0)
                {
                    return _mapper.Map<OrderViewDTO>(result); ;
                }
            }
            throw new Exception("Update fail");
        }
    }
}

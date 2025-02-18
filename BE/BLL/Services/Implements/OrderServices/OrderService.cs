using BLL.Services.Interfaces.IOrderServices;
using DAL.Models.OrderModel;
using DAL.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace BLL.Services.Implements.OrderServices
{
    public class OrderService : IOrderService
    {
        private readonly IUnitOfWork _unitOfWork;

        public OrderService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<Order> CreateOrder(Order order)
        {
            var newOrder = await _unitOfWork.OrderRepository.AddAsync(order);
            var process = await _unitOfWork.SaveChangeAsync();
            if (process > 0)
            {
                return newOrder;
            }
            throw new Exception("Add fail");

        }

        public async Task<bool> DeleteOrder(Guid id)
        {
            var order = await _unitOfWork.OrderRepository.GetByIdAsync(id);
            if (order is null)
            {
                throw new Exception("Delete fail");
            }
            order.DeletedAt = DateTime.UtcNow;
            await _unitOfWork.OrderRepository.DeleteAsync(order);
            return true;

        }

        public async Task<List<Order>> GetAllOrder()
        {
            var orders = await _unitOfWork.OrderRepository.GetAllAsync(null, true);
            if (orders.IsNullOrEmpty())
            {
                throw new Exception("Orders is empty");
            }

            return await orders.ToListAsync();
        }

        public async Task<Order> GetOrderById(Guid id)
        {
            var order = await _unitOfWork.OrderRepository.GetByIdAsync(id);
            if (order is null)
            {
                throw new Exception("Order is null");
            }
            return order;
        }

        public async Task<Order> UpdateOrder(Guid id, Order order)
        {
            var existingOrder = await _unitOfWork.OrderRepository.GetByIdAsync(id, true);
            if (existingOrder is null)
            {
                throw new Exception("Order is null");
            }
            existingOrder.TotalPrice = order.TotalPrice;
            existingOrder.Status = order.Status;
            existingOrder.OrderVouchers = order.OrderVouchers;
            existingOrder.OrderDetails = order.OrderDetails;
            existingOrder.UpdateAt = DateTime.Now;

            await _unitOfWork.OrderRepository.UpdateAsync(existingOrder);
            var process = await _unitOfWork.SaveChangeAsync();
            if(process > 0)
            {
                return existingOrder;
            }
            throw new Exception("Update fail");
        }
    }
}

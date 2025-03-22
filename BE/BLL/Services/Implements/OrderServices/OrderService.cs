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

        public async Task<OrderViewDTO> CompleteOrder(Guid id, Guid userId)
        {
            var order = await _unitOfWork.OrderRepository.GetByIdAsync(id, false, "OrderDetails");
            if (order is not null)
            {
                order.Status = Status.Completed;
                order.UpdateAt = DateTime.Now;
                order.UpdatedBy = userId;
                var process = await _unitOfWork.SaveChangeAsync();
                if (process > 0)
                {
                    var result = _mapper.Map<OrderViewDTO>(order);
                    return result;
                }
                throw new Exception("Completed fail");
            }
            throw new Exception("Can not found order");
        }

        public async Task<OrderViewDTO> CreateOrder(CreateOrUpdateOrder order, Guid userId)
        {
            if (order.OrderDetails.IsNullOrEmpty())
            {
                throw new Exception("Order details is empty");
            }
            var newOrder = new Order
            {
                UserId = userId,
                CreatedAt = DateTime.Now,
                CreatedBy = userId,
                Status = Status.Pending,
                TotalPrice = 0,
                OrderDetails = null
            };
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
            var existingOrder = await _unitOfWork.OrderRepository.GetWithConditionAsync(od => od.IsDeleted == false && od.Id == id);
            if (existingOrder is not null)
            {
                existingOrder.IsDeleted = true;
                existingOrder.Status = Status.Canceled;
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
            var orders = await _unitOfWork.OrderRepository.GetQuery(true).Where(e => e.IsDeleted == false)
                .Include(o => o.OrderDetails.Where(od => od.IsDeleted == false))
                .ThenInclude(od => od.Product).Where(o => o.OrderDetails.All(od => od.Product.IsDeleted == false)).ToListAsync();

            var viewOrder = _mapper.Map<List<OrderViewDTO>>(orders);

            return viewOrder;
        }

        public async Task<List<OrderViewDTO>> GetOrderByCurrentUserId(Guid id)
        {
            var orders = await _unitOfWork.OrderRepository.GetQuery(true).Where(e => e.IsDeleted == false && e.UserId == id)
                .Include(o => o.OrderDetails.Where(od => od.IsDeleted == false))
                .ThenInclude(od => od.Product).Where(o => o.OrderDetails.All(od => od.Product.IsDeleted == false)).ToListAsync();

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

        public async Task<OrderViewDTO> ProcessingOrder(Guid id, Guid userId)
        {
            var order = await _unitOfWork.OrderRepository.GetByIdAsync(id, false, "OrderDetails");
            if (order is not null)
            {
                order.Status = Status.Processing;
                order.UpdateAt = DateTime.Now;
                order.UpdatedBy = userId;
                var process = await _unitOfWork.SaveChangeAsync();
                if (process > 0)
                {
                    var result = _mapper.Map<OrderViewDTO>(order);
                    return result;
                }
                throw new Exception("Completed fail");
            }
            throw new Exception("Can not found order");
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

        public async Task<OrderViewDTO> ApplyVoucherToOrder(Guid orderId, string voucherCode, Guid userId)
        {
            var order = await _unitOfWork.OrderRepository.GetByIdAsync(orderId, false, "OrderDetails", "OrderVouchers");
            if (order == null)
            {
                throw new Exception("Order not found");
            }

            var voucher = await _unitOfWork.VoucherRepository.GetWithConditionAsync(v => v.Code == voucherCode && v.ExpiredDate > DateTime.Now);
            if (voucher == null)
            {
                throw new Exception("Voucher not found or expired");
            }

            if (order.TotalPrice < voucher.MinimumOrderTotalPrice)
            {
                throw new Exception("Order total does not meet the minimum requirement for this voucher");
            }

            var orderVoucher = new OrderVoucher
            {
                Order = order,
                OrderId = order.Id,
                VoucherId = voucher.Id,
                Voucher = voucher
            };

            var orderVoucherToAdd = _unitOfWork.OrderVoucherRepository.AddAsync(orderVoucher);

            if (orderVoucherToAdd == null)
            {
                throw new Exception("Failed to apply voucher");
            }

            order.TotalPrice -= (decimal)(order.TotalPrice * (voucher.DiscountPercentage / 100));
            order.UpdateAt = DateTime.Now;
            order.UpdatedBy = userId;

            var updateOrderResult = await _unitOfWork.OrderRepository.UpdateAsync(order);
            var process = await _unitOfWork.SaveChangeAsync();
            if (process > 0)
            {
                var result = _mapper.Map<OrderViewDTO>(updateOrderResult);
                return result;
            }

            throw new Exception("Failed to apply voucher");
        }

    }
}

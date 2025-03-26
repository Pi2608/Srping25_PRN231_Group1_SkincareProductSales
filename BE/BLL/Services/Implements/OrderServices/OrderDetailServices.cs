using AutoMapper;
using BLL.Services.Interfaces.IOrderServices;
using DAL.Models.OrderModel;
using DAL.Repositories.Interfaces;
using DTO.Order;

namespace BLL.Services.Implements.OrderServices
{
    public class OrderDetailServices : IOrderDetailService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public OrderDetailServices(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<List<OrderDetailViewDto>> CreateOrderDetail(Guid orderId, string voucherCode, List<CreateOrUpdateOrderDetail> order)
        {
            var existingOrder = await _unitOfWork.OrderRepository.GetByIdAsync(orderId);
            var user = await _unitOfWork.UserRepository.GetUserById(existingOrder.UserId);
            if (existingOrder is not null)
            {
                var orderDetails = _mapper.Map<List<OrderDetail>>(order);
                foreach (var orderItem in orderDetails)
                {
                    var product = await _unitOfWork.ProductRepository.GetByIdAsync(orderItem.ProductId);
                    if (product is not null)
                    {
                        var productDetail = await _unitOfWork.ProductDetailRepository.GetWithConditionAsync(pd => pd.ProductId == product.Id && pd.Size == orderItem.Size);
                        if (productDetail is null || productDetail.StockQuantity < orderItem.Quantity)
                        {
                            await _unitOfWork.OrderRepository.DeleteAsync(existingOrder);
                            await _unitOfWork.SaveChangeAsync();
                            throw new Exception("Not Found or out of stock");
                        }
                        if (user.MoneyAmount < existingOrder.TotalPrice)
                        {
                            await _unitOfWork.OrderRepository.DeleteAsync(existingOrder);
                            await _unitOfWork.SaveChangeAsync();
                            throw new Exception("Not enough money");
                        }
                        orderItem.OrderId = orderId;
                        orderItem.TotalPrice = orderItem.Quantity * productDetail.Price;
                        existingOrder.TotalPrice += orderItem.TotalPrice;
                        productDetail.StockQuantity -= orderItem.Quantity;
                        await _unitOfWork.ProductDetailRepository.UpdateAsync(productDetail);
                    }
                }

                var addOrderDetails = await _unitOfWork.OrderDetailRepository.AddRangeAsync(orderDetails);
                var updateOrder = await _unitOfWork.OrderRepository.UpdateAsync(existingOrder);
                user.MoneyAmount -= updateOrder.TotalPrice;
                await _unitOfWork.UserRepository.UpdateAsync(user);
                var process = await _unitOfWork.SaveChangeAsync();

                var applyVoucher = await ApplyVoucherToOrder(orderId, voucherCode, existingOrder.UserId);
                var orderAfterUpdate = await _unitOfWork.OrderRepository.GetByIdAsync(orderId);
                orderAfterUpdate.TotalPrice = applyVoucher.TotalPrice;
                var updateVoucher = await _unitOfWork.OrderRepository.UpdateAsync(existingOrder);
                await _unitOfWork.SaveChangeAsync();

                if (process > 0)
                {
                    var result = _mapper.Map<List<OrderDetailViewDto>>(addOrderDetails);
                    return result;
                }

            }
            throw new Exception("Can not found Order");
        }

        public async Task<bool> DeleteOrderDetail(Guid id)
        {
            var existingOrderDetail = await _unitOfWork.OrderDetailRepository.GetByIdAsync(id);
            if (existingOrderDetail is not null)
            {
                existingOrderDetail.IsDeleted = true;
                existingOrderDetail.DeletedAt = DateTime.UtcNow;

                var deleteOrderDetail = await _unitOfWork.OrderDetailRepository.UpdateAsync(existingOrderDetail);
                var process = await _unitOfWork.SaveChangeAsync();

                if (process > 0)
                {
                    return true;
                }
            }
            throw new Exception("Can not found Order");
        }

        public Task<List<OrderDetailViewDto>> GetAllOrderDetail()
        {
            throw new NotImplementedException();
        }

        public async Task<OrderDetailViewDto> GetOrderDetailById(Guid id)
        {
            var existingOrderDetail = await _unitOfWork.OrderDetailRepository.GetWithConditionAsync(od => od.IsDeleted == false && od.Id == id, true, "Product");

            if (existingOrderDetail is not null)
            {
                var result = _mapper.Map<OrderDetailViewDto>(existingOrderDetail);
                return result;
            }
            throw new Exception("Can not found Order");
        }

        public async Task<OrderDetailViewDto> UpdateOrderDetail(Guid id, CreateOrUpdateOrderDetail order)
        {
            var existingOrder = await _unitOfWork.OrderDetailRepository.GetByIdAsync(id);
            if (existingOrder is not null)
            {
                var product = await _unitOfWork.ProductRepository.GetByIdAsync(order.ProductId);
                var productDetail = await _unitOfWork.ProductDetailRepository.GetWithConditionAsync(pd => pd.ProductId == product.Id && pd.Size == order.Size);
                var updateOrder = _mapper.Map<OrderDetail>(order);
                if (product is null || productDetail is null || productDetail.StockQuantity < updateOrder.Quantity)
                {
                    throw new Exception("Not Found or out of stock");
                }
                if (order.Quantity > existingOrder.Quantity)
                {
                    int stock = order.Quantity - existingOrder.Quantity;
                    productDetail.StockQuantity -= stock;
                }
                else
                {
                    int stock = existingOrder.Quantity - order.Quantity;
                    productDetail.StockQuantity += stock;
                }
                existingOrder.Quantity = updateOrder.Quantity;
                existingOrder.TotalPrice = updateOrder.Quantity * productDetail.Price;
                existingOrder.UpdatedAt = DateTime.Now;
                var result = await _unitOfWork.OrderDetailRepository.UpdateAsync(existingOrder);
                var process = await _unitOfWork.SaveChangeAsync();
                if (process > 0)
                {
                    return _mapper.Map<OrderDetailViewDto>(result);
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
            order.UpdatedAt = DateTime.Now;
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

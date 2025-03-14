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

        public async Task<List<OrderDetailViewDto>> CreateOrderDetail(Guid orderId, List<CreateOrUpdateOrderDetail> order)
        {
            var existingOrder = await _unitOfWork.OrderRepository.GetByIdAsync(orderId);
            if (existingOrder is not null)
            {
                var orderDetails = _mapper.Map<List<OrderDetail>>(order);
                foreach (var orderItem in orderDetails)
                {
                    var product = await _unitOfWork.ProductRepository.GetByIdAsync(orderItem.ProductId);
                    if (product is not null)
                    {
                        var productDetail = await _unitOfWork.ProductDetailRepository.GetWithConditionAsync(pd => pd.ProductId == product.Id && pd.Size == orderItem.Size);
                        if (productDetail is not null)
                        {
                            orderItem.OrderId = orderId;
                            orderItem.TotalPrice = orderItem.Quantity * productDetail.Price;
                            existingOrder.TotalPrice += orderItem.TotalPrice;
                        }
                    }
                }

                var addOrderDetails = await _unitOfWork.OrderDetailRepository.AddRangeAsync(orderDetails);
                var updateOrder = await _unitOfWork.OrderRepository.UpdateAsync(existingOrder);
                var process = await _unitOfWork.SaveChangeAsync();

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
                existingOrder.Quantity = updateOrder.Quantity;
                existingOrder.TotalPrice = updateOrder.Quantity * productDetail.Price;
                existingOrder.UpdateAt = DateTime.Now;
                var result = await _unitOfWork.OrderDetailRepository.UpdateAsync(existingOrder);
                var process = await _unitOfWork.SaveChangeAsync();
                if (process > 0)
                {
                    return _mapper.Map<OrderDetailViewDto>(result);
                }
            }
            throw new Exception("Update fail");
        }
    }
}

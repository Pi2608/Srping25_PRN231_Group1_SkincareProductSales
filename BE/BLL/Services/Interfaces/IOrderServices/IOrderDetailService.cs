using DTO.Order;

namespace BLL.Services.Interfaces.IOrderServices
{
    public interface IOrderDetailService
    {
        Task<List<OrderDetailViewDto>> GetAllOrderDetail();
        Task<OrderDetailViewDto> GetOrderDetailById(Guid id);
        Task<List<OrderDetailViewDto>> CreateOrderDetail(Guid orderId, string? voucherCode, List<CreateOrUpdateOrderDetail> order);
        Task<OrderDetailViewDto> UpdateOrderDetail(Guid id, CreateOrUpdateOrderDetail order);
        Task<bool> DeleteOrderDetail(Guid id);
        Task<OrderViewDTO> ApplyVoucherToOrder(Guid orderId, string voucherCode, Guid userId);

    }
}

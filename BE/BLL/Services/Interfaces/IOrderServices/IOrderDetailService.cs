using DAL.Models.OrderModel;
using DTO.Order;

namespace BLL.Services.Interfaces.IOrderServices
{
    public interface IOrderDetailService
    {
        Task<List<OrderDetailViewDto>> GetAllOrder();
        Task<OrderDetailViewDto> GetOrderById(Guid id);
        Task<OrderDetailViewDto> CreateOrder(Order order);
        Task<OrderDetailViewDto> UpdateOrder(Guid id, OrderDetail order);
        Task<bool> DeleteOrder(Guid id);
    }
}

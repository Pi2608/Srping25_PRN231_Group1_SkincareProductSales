using DAL.Models.OrderModel;
using DTO.Order;

namespace BLL.Services.Interfaces.IOrderServices
{
    public interface IOrderService
    {
        Task<List<OrderViewDTO>> GetAllOrder();
        Task<OrderViewDTO> GetOrderById(Guid id);
        Task<List<OrderViewDTO>> GetOrderByCurrentUserId(Guid id);
        Task<OrderViewDTO> CreateOrder(CreateOrUpdateOrder order, Guid userId);
        Task<OrderViewDTO> UpdateOrder(Guid id, CreateOrUpdateOrder order);
        Task<bool> DeleteOrder(Guid id);
    }
}

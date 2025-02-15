using DAL.Models.OrderModel;

namespace BLL.Services.Interfaces.IOrderServices
{
    public interface IOrderService
    {
        Task<List<Order>> GetAllOrder();
        Task<Order> GetOrderById(Guid id);
        Task<Order> CreateOrder(Order order);
        Task<Order> UpdateOrder(Guid id, Order order);
        Task<bool> DeleteOrder(Guid id);
    }
}

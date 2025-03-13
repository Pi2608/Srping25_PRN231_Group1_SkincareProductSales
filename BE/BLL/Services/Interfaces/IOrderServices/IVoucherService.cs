using DAL.Models.OrderModel;
using DAL.Models.ProductModel;
using DTO.Order;

namespace BLL.Services.Interfaces.IOrderServices
{
    public interface IVoucherService
    {
        Task<List<Voucher>> GetAllVouchers();
        Task<Voucher> GetVoucherById(Guid id);
        Task<Voucher> CreateVoucher(Voucher voucher);
        Task<Voucher> UpdateVoucher(Guid id, Voucher voucher);
        Task<bool> DeleteVoucher(Guid id);
    }
}

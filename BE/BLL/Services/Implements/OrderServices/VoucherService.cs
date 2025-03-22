using BLL.Services.Interfaces.IOrderServices;
using DAL.Models.OrderModel;
using DAL.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace BLL.Services.Implements.OrderServices
{
    public class VoucherService : IVoucherService
    {
        private readonly IUnitOfWork _unitOfWork;

        public VoucherService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<Voucher> CreateVoucher(Voucher voucher)
        {
            var newVoucher = await _unitOfWork.VoucherRepository.AddAsync(voucher);
            var process = await _unitOfWork.SaveChangeAsync();
            if (process > 0)
            {
                return newVoucher;
            }
            throw new Exception("Add fail");

        }

        public async Task<bool> DeleteVoucher(Guid id)
        {
            var voucher = await _unitOfWork.VoucherRepository.GetByIdAsync(id);
            if (voucher is null)
            {
                throw new Exception("Delete fail");
            }
            voucher.DeletedAt = DateTime.UtcNow;
            await _unitOfWork.VoucherRepository.DeleteAsync(voucher);
            return true;

        }

        public async Task<List<Voucher>> GetAllVouchers()
        {
            var vouchers = await _unitOfWork.VoucherRepository.GetAllAsync(null, true);
            if (vouchers.IsNullOrEmpty())
            {
                throw new Exception("Orders is empty");
            }

            return await vouchers.ToListAsync();
        }

        public async Task<Voucher> GetVoucherById(Guid id)
        {
            var voucher = await _unitOfWork.VoucherRepository.GetByIdAsync(id);
            if (voucher is null)
            {
                throw new Exception("Order is null");
            }
            return voucher;
        }

        public async Task<Voucher> UpdateVoucher(Guid id, Voucher voucher)
        {
            var existingVoucher = await _unitOfWork.VoucherRepository.GetByIdAsync(id, true);
            if (existingVoucher is null)
            {
                throw new Exception("Order is null");
            }
            existingVoucher.Code = voucher.Code;
            existingVoucher.DiscountPercentage = voucher.DiscountPercentage;
            existingVoucher.ExpiredDate = voucher.ExpiredDate;
            existingVoucher.CreatedBy = voucher.CreatedBy;
            existingVoucher.UpdatedAt = DateTime.Now;

            await _unitOfWork.VoucherRepository.UpdateAsync(existingVoucher);
            var process = await _unitOfWork.SaveChangeAsync();
            if (process > 0)
            {
                return existingVoucher;
            }
            throw new Exception("Update fail");
        }
    }
}

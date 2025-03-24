using AutoMapper;
using BLL.Services.Interfaces.IOrderServices;
using DAL.Models.OrderModel;
using DAL.Models.UserModel;
using DAL.Repositories.Interfaces;
using DTO.Order;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace BLL.Services.Implements.OrderServices
{
    public class VoucherService : IVoucherService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public VoucherService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<Voucher> CreateVoucher(CreateOrUpdateVoucher voucher, Guid userId)
        {
            var newVoucher = new Voucher
            {
                Code = voucher.Code,
                DiscountPercentage = voucher.DiscountPercentage,
                ExpiredDate =  DateTime.Now.AddDays(5),
                MinimumOrderTotalPrice = voucher.MinimumOrderTotalPrice,
                CreatedAt = DateTime.Now,
                CreatedBy = userId,
                UpdatedAt = DateTime.Now,
                DeletedAt = null
            };

            var addVoucher = await _unitOfWork.VoucherRepository.AddAsync(newVoucher);
            var process = await _unitOfWork.SaveChangeAsync();
            if (process > 0)
            {
                var viewVoucher = _mapper.Map<Voucher>(addVoucher);
                return viewVoucher;
            }
            throw new Exception("Add voucher fail");

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

        public async Task<Voucher> UpdateVoucher(Guid id, CreateOrUpdateVoucher voucher)
        {
            var existingVoucher = await _unitOfWork.VoucherRepository.GetByIdAsync(id, true);
            if (existingVoucher is null)
            {
                throw new Exception("Order is null");
            }
            var updateOrder = _mapper.Map<Voucher>(voucher);
            existingVoucher.UpdatedAt = DateTime.Now;
            existingVoucher.IsDeleted = updateOrder.IsDeleted;
            var result = await _unitOfWork.VoucherRepository.UpdateAsync(existingVoucher);
            var process = await _unitOfWork.SaveChangeAsync();
            if (process > 0)
            {
                return _mapper.Map<Voucher>(result); ;
            }
            throw new Exception("Update fail");
        }
    }
}

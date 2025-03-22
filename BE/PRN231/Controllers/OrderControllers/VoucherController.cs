using BLL.Services.Interfaces.IOrderServices;
using DAL.Models.OrderModel;
using DTO.Order;
using Microsoft.AspNetCore.Mvc;
using PRN231.Helper;

namespace PRN231.Controllers.OrderControllers
{
    public class VoucherController : BaseController
    {
        private readonly IVoucherService _voucherService;

        public VoucherController(IVoucherService voucherService)
        {
            _voucherService = voucherService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllVouchers()
        {
            try
            {
                var vouchers = await _voucherService.GetAllVouchers();
                return Ok(vouchers);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetVoucherById(Guid id)
        {
            try
            {
                var voucher = await _voucherService.GetVoucherById(id);
                return Ok(voucher);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateVoucher([FromBody] CreateOrUpdateVoucher voucher)
        {
            try
            {
                var userId = this.GetUserId();
                var result = await _voucherService.CreateVoucher(voucher, userId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> UpdateVoucher([FromQuery] Guid id, [FromBody] Voucher voucher)
        {
            try
            {
                var result = await _voucherService.UpdateVoucher(id, voucher);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteVoucher([FromRoute] Guid id)
        {
            try
            {
                var result = await _voucherService.DeleteVoucher(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
    }
}

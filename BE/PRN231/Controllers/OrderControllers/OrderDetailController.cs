using BLL.Services.Interfaces.IOrderServices;
using DTO.Order;
using Microsoft.AspNetCore.Mvc;

namespace PRN231.Controllers.OrderControllers
{
    public class OrderDetailController : BaseController
    {
        private readonly IOrderDetailService _orderDetailService;
        public OrderDetailController(IOrderDetailService orderDetailService)
        {
            _orderDetailService = orderDetailService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrderDetail([FromQuery] Guid orderId, [FromBody] COD od)
        {
            try
            {
                var orderDetails = await _orderDetailService.CreateOrderDetail(orderId, od.voucherCode, od.order);
                return Ok(orderDetails);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        public async Task<IActionResult> UpdateOrderDetail([FromQuery] Guid orderId, [FromBody] CreateOrUpdateOrderDetail od)
        {
            try
            {
                var orderDetails = await _orderDetailService.UpdateOrderDetail(orderId, od);
                return Ok(orderDetails);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetOrderDetail([FromQuery] Guid orderId)
        {
            try
            {
                var orderDetails = await _orderDetailService.GetOrderDetailById(orderId);
                return Ok(orderDetails);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteOrderDetail([FromQuery] Guid orderId)
        {
            try
            {
                var orderDetails = await _orderDetailService.DeleteOrderDetail(orderId);
                return Ok(orderDetails);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
    public sealed record COD(string voucherCode, List<CreateOrUpdateOrderDetail> order);
}

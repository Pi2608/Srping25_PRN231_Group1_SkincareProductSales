using BLL.Services.Interfaces.IOrderServices;
using DTO.Order;
using Microsoft.AspNetCore.Mvc;
using PRN231.Helper;

namespace PRN231.Controllers.OrderControllers
{
    public class OrderController : BaseController
    {
        private readonly IOrderService _orderService;
        private readonly IOrderDetailService _orderDetailService;
        public OrderController(IOrderService orderService, IOrderDetailService orderDetailService)
        {
            _orderService = orderService;
            _orderDetailService = orderDetailService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllOrder()
        {
            try
            {
                var orders = await _orderService.GetAllOrder();
                return Ok(orders);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet]
        public async Task<IActionResult> GetAllOrderByCurrentUserId()
        {
            try
            {
                var userId = this.GetUserId();
                var orders = await _orderService.GetOrderByCurrentUserId(userId);
                return Ok(orders);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetById([FromQuery] Guid id)
        {
            try
            {
                var order = await _orderService.GetOrderById(id);
                return Ok(order);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> CompleteOrder([FromQuery] Guid id)
        {
            try
            {
                var userId = this.GetUserId();
                var order = await _orderService.CompleteOrder(id, userId);
                return Ok(order);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> ProcessOrder([FromQuery] Guid id)
        {
            try
            {
                var userId = this.GetUserId();
                var order = await _orderService.ProcessingOrder(id, userId);
                return Ok(order);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrUpdateOrder order)
        {
            try
            {
                var userId = this.GetUserId();
                var orderResult = await _orderService.CreateOrder(order, userId);
                var orderDetail = await _orderDetailService.CreateOrderDetail(orderResult.Id, order.VoucherCode, order.OrderDetails);
                var orderView = await _orderService.GetOrderById(orderResult.Id);
                return Ok(orderView);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        public async Task<IActionResult> UpdateOrder([FromQuery] Guid id, [FromBody] CreateOrUpdateOrder order)
        {
            try
            {
                var orderResult = await _orderService.UpdateOrder(id, order);
                return Ok(orderResult);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteOrder([FromQuery] Guid id)
        {
            try
            {
                var result = await _orderService.DeleteOrder(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpPost]
        public async Task<IActionResult> ApplyVoucher([FromQuery] Guid orderId, [FromQuery] string voucherCode)
        {
            try
            {
                var userId = this.GetUserId();
                var order = await _orderService.ApplyVoucherToOrder(orderId, voucherCode, userId);
                return Ok(order);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}

using System.Security.Claims;
using BLL.Services.Interfaces.IUserServices;
using DTO.User;
using Microsoft.AspNetCore.Mvc;
using PRN231.Helper;

namespace PRN231.Controllers.UserControllers
{
    public class VNPayController : BaseController
    {
        private readonly VNPayService _vnPayService;
        private readonly IUserService _userService;
        private readonly ILogger<VNPayController> _logger;

        public VNPayController(VNPayService vnPayService, ILogger<VNPayController> logger, IUserService userService)
        {
            _vnPayService = vnPayService ?? throw new ArgumentNullException(nameof(vnPayService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _userService = userService;

        }

        [HttpPost]
        public IActionResult CreatePayment([FromBody] VNPayRequest request)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized("User ID not found.");
                }
                var userId = this.GetUserId();
                var paymentUrl = _vnPayService.CreatePaymentUrl(request, HttpContext);
                return Ok(new { paymentUrl });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Payment creation failed");
                return BadRequest(new { message = "Failed to create payment", details = ex.Message });
            }
        }

        [HttpGet("vnpay-return")]
        public async Task<IActionResult> VNPayReturn()
        {
            try
            {
                var vnp_Amount = Convert.ToDecimal(Request.Query["vnp_Amount"]) / 100;
                var vnp_TxnRef = Request.Query["vnp_TxnRef"];
                var vnp_ResponseCode = Request.Query["vnp_ResponseCode"];

                if (vnp_ResponseCode == "00") // Giao dịch thành công
                {
                    var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                    if (userIdClaim == null) return Unauthorized("User ID not found.");

                    var userId = this.GetUserId();

                    _userService.TopUpAsync(userId, new TopUpRequestDTO { Amount = vnp_Amount });
                    return Ok(new { message = "Payment successful!", amountAdded = vnp_Amount });
                }
                return BadRequest(new { message = "Payment failed!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error processing payment", error = ex.Message });
            }
        }
    }
}
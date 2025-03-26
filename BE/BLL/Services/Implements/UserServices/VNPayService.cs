using DTO.User;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;
using System.Web;

public class VNPayService
{
    private readonly IConfiguration _configuration;

    public VNPayService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string CreatePaymentUrl(VNPayRequest model, HttpContext httpContext)
    {
        var vnp_TmnCode = _configuration["VNPay:TmnCode"];
        var vnp_HashSecret = _configuration["VNPay:HashSecret"];
        var vnp_Url = _configuration["VNPay:PaymentUrl"];
        var vnp_ReturnUrl = _configuration["VNPay:ReturnUrl"];

        var timeStamp = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
        var amount = (model.Amount * 100).ToString(); // VNPay yêu cầu số tiền tính theo VND x100

        var vnp_Params = new SortedList<string, string>
        {
            { "vnp_Version", "2.1.0" },
            { "vnp_Command", "pay" },
            { "vnp_TmnCode", vnp_TmnCode },
            { "vnp_Amount", amount },
            { "vnp_CurrCode", "VND" },
            { "vnp_TxnRef", timeStamp },
            { "vnp_OrderInfo", model.OrderInfo },
            { "vnp_Locale", "vn" },
            { "vnp_ReturnUrl", vnp_ReturnUrl },
            { "vnp_IpAddr", httpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1" },
            { "vnp_CreateDate", timeStamp }
        };

        // Tạo chuỗi query và mã hóa bằng HashSecret
        var queryString = new StringBuilder();
        foreach (var item in vnp_Params)
        {
            queryString.Append($"{item.Key}={HttpUtility.UrlEncode(item.Value)}&");
        }
        queryString.Length--; // Remove '&' cuối cùng

        var hashData = HashHmacSHA512(vnp_HashSecret, queryString.ToString());
        var paymentUrl = $"{vnp_Url}?{queryString}&vnp_SecureHash={hashData}";

        return paymentUrl;
    }

    private string HashHmacSHA512(string key, string input)
    {
        using (var hmac = new HMACSHA512(Encoding.UTF8.GetBytes(key)))
        {
            var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(input));
            return BitConverter.ToString(hash).Replace("-", "").ToLower();
        }
    }
}

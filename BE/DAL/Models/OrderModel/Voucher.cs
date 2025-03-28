﻿namespace DAL.Models.OrderModel
{
    public class Voucher : BaseEntity 
    {
        public required string Code { get; set; }
        public required decimal DiscountPercentage { get; set; }
        public required DateTime ExpiredDate { get; set; }

        public required decimal MinimumOrderTotalPrice { get; set; }
        public IEnumerable<OrderVoucher>? OrderVouchers { get; set; }
    }
}


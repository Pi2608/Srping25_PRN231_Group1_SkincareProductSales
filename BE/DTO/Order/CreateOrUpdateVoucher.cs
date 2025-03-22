namespace DTO.Order
{
    public class CreateOrUpdateVoucher
    {
        public required string Code { get; set; }
        public required decimal DiscountPercentage { get; set; }
        public required DateTime ExpiredDate { get; set; }
        public required decimal MinimumOrderTotalPrice { get; set; }
    }
}

namespace DTO.Product
{
    public class ProductViewDTO
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
        public string ShortDescription { get; set; }
        public List<ProductDetailViewDto> ProductDetails { get; set; }
        public List<ProductCategoryViewDto> ProductCategories { get; set; }
    }
}
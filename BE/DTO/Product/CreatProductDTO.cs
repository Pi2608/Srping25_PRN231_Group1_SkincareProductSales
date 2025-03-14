
namespace DTO.Product
{
    public class CreatProductDTO
    {
        public string Name { get; set; }
        public string Image { get; set; }
        public string ShortDescription { get; set; }
        public Guid ProductDetailIds { get; set; }
        public Guid ProductCategoryIds { get; set; }
    }
}

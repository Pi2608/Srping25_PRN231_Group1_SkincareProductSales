
namespace DTO.Product
{
    public class CreatProductDTO
    {
        public string Name { get; set; }
        public string Image { get; set; }
        public string ShortDescription { get; set; }
        public List<Guid> ProductCategory { get; set; }
    }
}

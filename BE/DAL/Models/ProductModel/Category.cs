namespace DAL.Models.ProductModel
{
    public class Category : BaseEntity
    {
        public required string Name { get; set; }
        public required IEnumerable<ProductCategory> ProductCategories { get; set; }
    }
}

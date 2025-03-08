public class CategoryDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public List<Guid> ProductCategoryIds { get; set; } = new();
}

namespace DAL.Models
{
    public class BaseEntity
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public bool IsDeleted { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdateAt { get; set; } = DateTime.Now;
        public DateTime? DeletedAt { get; set; }
        public Guid? CreatedBy { get; set; } 
        public Guid? UpdatedBy { get; set; }
    }
}

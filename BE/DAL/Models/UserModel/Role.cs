namespace DAL.Models.UserModel
{
    public class Role : BaseEntity
    {
        public required string RoleName { get; set; }
        public IEnumerable<User>? Users { get; set; }
    }
}

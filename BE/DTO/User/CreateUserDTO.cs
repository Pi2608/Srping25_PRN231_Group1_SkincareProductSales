namespace DTO.User
{
    public class CreateUserDTO
    {
        public required string Account { get; set; }
        public required string Password { get; set; }
        public required string Address { get; set; }
        public required string Email { get; set; }
        public required Guid RoleId { get; set; }
        public Guid? CreatedBy { get; set; }
        public Guid? UpdatedBy { get; set; }
    }
}

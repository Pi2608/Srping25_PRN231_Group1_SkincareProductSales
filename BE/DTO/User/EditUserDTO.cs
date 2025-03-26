namespace DTO.User
{
    public class EditUserDTO
    {
        public string? Account { get; set; }
        public string? Password { get; set; }
        public string? Email { get; set; }
        public string? Address { get; set; }
        public Guid RoleId { get; set; }
    }
}

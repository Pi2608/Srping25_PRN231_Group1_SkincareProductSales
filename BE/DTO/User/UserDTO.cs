using System.ComponentModel.DataAnnotations;

namespace DTO.User
{
    public class UserDTO
    {
        public required string Account { get; set; }
        public required string Password { get; set; }
        [EmailAddress]
        public required string Email { get; set; }
    }
}

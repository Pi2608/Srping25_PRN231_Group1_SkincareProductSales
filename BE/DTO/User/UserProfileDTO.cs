using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO.User
{
    public class UserProfileDTO
    {
        public required string Account { get; set; }
        public required string Address { get; set; }
        public required string Email { get; set; }
    }
}

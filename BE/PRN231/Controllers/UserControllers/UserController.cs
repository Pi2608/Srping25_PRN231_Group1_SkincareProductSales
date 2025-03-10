using BLL.Services.Interfaces.IUserServices;
using DTO.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace PRN231.Controllers.UserControllers
{
    public class UserController : BaseController
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<IActionResult> Login([FromQuery] string email, [FromQuery] string password)
        {
            string? token = await _userService.Login(email, password);
            if (string.IsNullOrEmpty(token)) return Unauthorized();
            return Ok(token);
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAllUser()
        {
            var users = await _userService.GetAllUsers();
            return Ok(users);
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetUser()
        {
            Guid userId = Guid.Parse(User.Claims.First(c => c.Type == "userId").Value);
            var user = await _userService.GetUserById(userId);
            if (user == null) return NotFound("User not found.");
            return Ok(user);
        }

        [HttpPost]
        public async Task<IActionResult> Register([FromBody] UserDTO newUser)
        {
            if (string.IsNullOrWhiteSpace(newUser.Email) || string.IsNullOrWhiteSpace(newUser.Password))
            {
                return BadRequest("Email and Password are required.");
            }

            var token = await _userService.Register(newUser);

            if (string.IsNullOrEmpty(token))
            {
                return BadRequest("U failed");
            }

            return Ok(token);
        }

        [HttpPut]
        [Authorize]
        public async Task<IActionResult> UpdateProfile([FromBody] UserProfileDTO userProfile)
        {
            if (userProfile == null)
            {
                return BadRequest("Invalid profile data.");
            }

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("User ID not found.");
            }

            Guid userId = Guid.Parse(userIdClaim.Value);

            bool success = await _userService.UpdateProfile(userId, userProfile);
            if (!success)
            {
                return NotFound("User not found or update failed.");
            }

            return Ok("Profile updated successfully.");
        }

        [HttpPut]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDTO changePasswordDto)
        {
            if (changePasswordDto == null ||
                string.IsNullOrWhiteSpace(changePasswordDto.OldPassword) ||
                string.IsNullOrWhiteSpace(changePasswordDto.NewPassword))
            {
                return BadRequest("Invalid password data.");
            }

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("User ID not found.");
            }

            Guid userId = Guid.Parse(User.Claims.First(c => c.Type == "userId").Value);

            bool success = await _userService.ChangePassword(userId, changePasswordDto.OldPassword, changePasswordDto.NewPassword);
            if (!success)
            {
                return BadRequest("Invalid credentials or password change failed.");
            }

            return Ok("Password changed successfully.");
        }
    }
}

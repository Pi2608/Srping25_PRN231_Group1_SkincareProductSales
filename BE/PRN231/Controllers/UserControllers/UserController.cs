using BLL.Services.Interfaces.IUserServices;
using DAL.Models.UserModel;
using DTO.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
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
        [EnableQuery]
        public async Task<IActionResult> GetAllUser()
        {
            var users = await _userService.GetAllUsers();
            return Ok(users);
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetUser()
        {
            Guid userId = Guid.Parse(User.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value);
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

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserDTO newUser)
        {
            if (string.IsNullOrWhiteSpace(newUser.Email) || string.IsNullOrWhiteSpace(newUser.Password))
            {
                return BadRequest("Email and Password are required.");
            }

            Guid userId = Guid.Parse(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);
            newUser.CreatedBy = userId;
            newUser.UpdatedBy = userId;

            var (success, message, user) = await _userService.CreateUser(newUser);

            if (!success)
            {
                return BadRequest(new { success, message });
            }

            return Ok(new
            {
                success,
                message,
                user
            });
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> TopUp([FromQuery] TopUpRequestDTO request)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("User ID not found.");
            }

            Guid userId = Guid.Parse(userIdClaim.Value);

            var result = await _userService.TopUpAsync(userId, request);
            if (!result.isSuccess)
                return BadRequest(new { message = result.message });

            return Ok(new { message = result.message, newBalance = result.newBalance });
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
        public async Task<IActionResult> EditUser([FromQuery] Guid id, [FromBody] EditUserDTO updateUserDto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("User ID not found.");
            }

            Guid userId = Guid.Parse(userIdClaim.Value);

            var (success, message) = await _userService.EditUser(id, updateUserDto, userId);
            if (!success)
            {
                return NotFound(message);
            }

            return Ok("User updated successfully.");
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

            Guid userId = Guid.Parse(userIdClaim.Value);

            bool success = await _userService.ChangePassword(userId, changePasswordDto.OldPassword, changePasswordDto.NewPassword);
            if (!success)
            {
                return BadRequest("Invalid credentials or password change failed.");
            }

            return Ok("Password changed successfully.");
        }

        [HttpPut]
        [Authorize]
        public async Task<IActionResult> RestoreUser([FromQuery] Guid id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("User ID not found.");
            }

            Guid userId = Guid.Parse(userIdClaim.Value);

            var (success, message) = await _userService.RestoreUser(id, userId);
            if (!success)
            {
                return NotFound(message);
            }

            return Ok("User restored successfully.");
        }

        [HttpDelete]
        [Authorize]
        public async Task<IActionResult> DeleteUser([FromQuery] Guid id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("User ID not found.");
            }

            Guid userId = Guid.Parse(userIdClaim.Value);

            var (success, message) = await _userService.DeleteUser(id, userId);
            if (!success)
            {
                return NotFound(message);
            }

            return Ok("User deleted successfully.");
        }
    }
}

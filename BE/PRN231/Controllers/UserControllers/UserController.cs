using BLL.Services.Interfaces.IUserServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;

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
            var user = await _userService.GetUser(userId);
            if (user == null) return NotFound("User not found.");
            return Ok(user);
        }
    }
}

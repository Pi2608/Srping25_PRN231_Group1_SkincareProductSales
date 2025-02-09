using BLL.Services.Interfaces.IUserServices;
using Microsoft.AspNetCore.Mvc;

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
        public async Task<IActionResult> GetAllUser()
        {
            return Ok("Success");
        }
    }
}

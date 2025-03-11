using BLL.Services.Interfaces.IUserServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PRN231.Helper;

namespace PRN231.Controllers.UserControllers
{
    public class RoleController : BaseController
    {
        private readonly IRoleService _roleService;
        public RoleController(IRoleService roleService)
        {
            _roleService = roleService;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetCurrentUserRole()
        {
            var roleClaim = this.GetUserRole();
            Console.WriteLine(roleClaim);
            if (roleClaim == null || string.IsNullOrEmpty(roleClaim))
                return Unauthorized("Role not found.");

            return Ok(roleClaim);
        }

        [HttpGet]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> GetAllRoles()
        {
            var roles = await _roleService.GetAllRoles();
            return Ok(roles);
        }
    }
}

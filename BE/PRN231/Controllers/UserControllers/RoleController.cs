using BLL.Services.Implements.UserServices;
using BLL.Services.Interfaces.IUserServices;
using DAL.Models.UserModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;

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
        public async Task<IActionResult> GetUserRole()
        {
            var roleClaim = User.Claims.FirstOrDefault(c => c.Type == "role").Value;
            Console.WriteLine(roleClaim);
            if (roleClaim == null || string.IsNullOrEmpty(roleClaim))
                return Unauthorized("Role not found.");

            return Ok(roleClaim);
        }
    }
}

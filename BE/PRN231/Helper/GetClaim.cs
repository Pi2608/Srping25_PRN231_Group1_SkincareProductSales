using PRN231.Controllers;
using System.Security.Claims;

namespace PRN231.Helper
{
    public static class GetClaim
    {
        public static Guid GetUserId(this BaseController baseController)
        {
            var user = baseController.User;
            if (user == null)
            {
                throw new InvalidOperationException("User is not authenticated.");
            }

            var id = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(id))
            {
                throw new InvalidOperationException("User ID not found in claims.");
            }

            return new Guid(id);
        }
        public static string GetUserRole(this BaseController baseController)
        {
            var user = baseController.User;
            if (user == null)
            {
                throw new InvalidOperationException("User is not authenticated.");
            }

            var role = user.FindFirst(ClaimTypes.Role)?.Value;
            if (string.IsNullOrEmpty(role))
            {
                throw new InvalidOperationException("Role not found in claims.");
            }

            return role;
        }
    }
}

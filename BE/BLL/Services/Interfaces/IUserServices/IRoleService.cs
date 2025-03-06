using DAL.Models.UserModel;

namespace BLL.Services.Interfaces.IUserServices
{
    public interface IRoleService
    {
        Task<IEnumerable<Role>> GetAllRoles();
        Task<Role> GetRoleId(string roleName);
    }
}

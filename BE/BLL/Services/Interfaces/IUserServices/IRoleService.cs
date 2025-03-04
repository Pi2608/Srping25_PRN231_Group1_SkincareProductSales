using DAL.Models.UserModel;

namespace BLL.Services.Interfaces.IUserServices
{
    public interface IRoleService
    {
        Task<Role> GetRoleId(string roleName);
    }
}

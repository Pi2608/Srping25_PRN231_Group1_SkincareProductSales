using DAL.Models.UserModel;

namespace DAL.Repositories.Interfaces.IUserRepos
{
    public interface IRoleRepository : IRepository<Role>
    {
        Task<Role> GetRoleId(string roleName);
        Task<IEnumerable<Role>> GetAllRoles();
    }
}

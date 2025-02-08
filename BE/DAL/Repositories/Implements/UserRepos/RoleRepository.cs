using DAL.Context;
using DAL.Models.UserModel;
using DAL.Repositories.Interfaces.IUserRepos;

namespace DAL.Repositories.Implements.UserRepos
{
    public class RoleRepository : Repository<Role>, IRoleRepository
    {
        public RoleRepository(AppDbContext context) : base(context)
        {
        }
    }
}

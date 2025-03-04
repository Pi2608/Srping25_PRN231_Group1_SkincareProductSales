using DAL.Context;
using DAL.Models.UserModel;
using DAL.Repositories.Interfaces.IUserRepos;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories.Implements.UserRepos
{
    public class RoleRepository : Repository<Role>, IRoleRepository
    {
        private readonly AppDbContext _context;
        public RoleRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<Role> GetRoleId(string roleName)
        {
            IQueryable<Role> query = _dbSet;
            return await query.FirstAsync(r => r.RoleName == roleName);
        }
    }
}

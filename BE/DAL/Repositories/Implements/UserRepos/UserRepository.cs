using DAL.Context;
using DAL.Models.UserModel;
using DAL.Repositories.Interfaces.IUserRepos;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories.Implements.UserRepos
{
    public class UserRepository : Repository<User>, IUserRepository
    {
        private readonly AppDbContext _context;
        public UserRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<User> CreateUser(User user)
        {
            await base.AddAsync(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<User?> GetUserByEmail(string email)
        {
            IQueryable<User> query = _dbSet;
            return await query.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User?> Login(string email, string password)
        {
            IQueryable<User> query = _dbSet;
            return await query.Include(u => u.Role).FirstOrDefaultAsync(u => u.Email == email && u.Password == password);
        }

        public async Task<User?> GetUserById(Guid id)
        {
            IQueryable<User> query = _dbSet;
            return await query.FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<IEnumerable<User>> GetUsers()
        {
            IQueryable<User> query = _dbSet;
            return await query.ToListAsync();
        }
    }
}

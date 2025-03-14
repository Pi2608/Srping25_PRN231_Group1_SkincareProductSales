using DAL.Context;
using DAL.Models.UserModel;
using DAL.Repositories.Interfaces.IUserRepos;
using DTO.User;
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

        public async Task<(bool success, string message, User user)> CreateUser(User user)
        {
            await base.AddAsync(user);
            var result = await _context.SaveChangesAsync();
            if (result > 0)
            {
                return (true, "Create User Successfully", user);
            }
            return (false, "Create User UnSuccessfully", user);
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

        public async Task<bool> UpdateUser(Guid userId, UserProfileDTO us)
        {
            User? user = await GetUserById(userId);
            if (user == null)
            {
                return false;
            }
            user.Account = us.Account;
            user.Email = us.Email;
            user.Address = us.Address;

            var result = await _context.SaveChangesAsync();
            return result > 0;
        }

        public async Task<bool> EditUser(Guid userId, EditUserDTO us, Guid byAdmin)
        {
            User? user = await GetUserById(userId);
            if (user == null)
            {
                return false;
            }
            if (!string.IsNullOrEmpty(us.Account))
                user.Account = us.Account;

            if (!string.IsNullOrEmpty(us.Email))
                user.Email = us.Email;

            if (!string.IsNullOrEmpty(us.Address))
                user.Address = us.Address;

            if (!string.IsNullOrEmpty(us.Password))
            {
                user.Password = us.Password;
            }
            user.RoleId = us.RoleId;
            user.UpdateAt = DateTime.Now;
            user.UpdatedBy = byAdmin;

            var result = await _context.SaveChangesAsync();
            return result > 0;
        }

        public async Task<bool> ChangePasswordAsync(Guid userId, string oldPassword, string newPassword)
        {
            User? user = await GetUserById(userId);
            if (user == null)
            {
                return false;
            }
            if (user.Password != oldPassword)
            {
                return false;
            }
            user.Password = newPassword;

            var result = await _context.SaveChangesAsync();
            return result > 0;
        }
    }
}

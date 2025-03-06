using DAL.Models.UserModel;
using DTO.User;

namespace DAL.Repositories.Interfaces.IUserRepos
{
    public interface IUserRepository : IRepository<User>
    {
        Task<User?> Login(string email, string password);
        Task<User?> GetUserById(Guid id);
        Task<User?> GetUserByEmail(string email);
        Task<IEnumerable<User>> GetUsers();
        Task<User> CreateUser(User user);
        Task<bool> UpdateUser(Guid userId, UserProfileDTO User);
        Task<bool> ChangePasswordAsync(Guid userId, string oldPassword, string newPassword);
    }
}

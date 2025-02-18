using DAL.Models.UserModel;

namespace DAL.Repositories.Interfaces.IUserRepos
{
    public interface IUserRepository : IRepository<User>
    {
        Task<User?> GetUserByEmailAsync(string email, string password);
        Task<User?> GetUserById(Guid id);
        Task<IEnumerable<User>> GetUsers();
        Task<User> CreateUser(User user);
    }
}

using DAL.Models.UserModel;

namespace DAL.Repositories.Interfaces.IUserRepos
{
    public interface IUserRepository : IRepository<User>
    {
        Task<User?> Login(string email, string password);
        Task<User?> GetUserById(Guid id);
        Task<User?> GetUserByEmail(string email);
        Task<IEnumerable<User>> GetUsers();
        Task<User> CreateUser(User user);
    }
}

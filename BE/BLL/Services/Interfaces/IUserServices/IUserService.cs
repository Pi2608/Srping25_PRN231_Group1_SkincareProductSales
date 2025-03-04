using DAL.Models.UserModel;

namespace BLL.Services.Interfaces.IUserServices
{
    public interface IUserService
    {
        Task<IEnumerable<User>> GetAllUsers();
        Task<User?> GetUserById(Guid id);
        Task<User?> GetUserByEmail(string email);
        Task<bool> CheckUserExist(string email);
        Task<bool> Register(User user);
        Task<string?> Login(string email, string password);
    }
}

using DAL.Models.UserModel;
using DTO.User;

namespace BLL.Services.Interfaces.IUserServices
{
    public interface IUserService
    {
        Task<IEnumerable<User>> GetAllUsers();
        Task<User?> GetUserById(Guid id);
        Task<User?> GetUserByEmail(string email);
        Task<bool> CheckUserExist(string email);
        Task<string?> Register(UserDTO? user);
        Task<string?> Login(string email, string password);
    }
}

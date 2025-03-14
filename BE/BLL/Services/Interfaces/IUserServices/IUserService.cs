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
        Task<(bool success, string message, User user)> CreateUser(CreateUserDTO user);
        Task<bool> UpdateProfile(Guid userId, UserProfileDTO us);
        Task<(bool success, string msg)> EditUser(Guid userId, EditUserDTO us, Guid byAdmin);
        Task<bool> ChangePassword(Guid userId, string oldPassword, string newPassword);
        Task<(bool success, string msg)> DeleteUser(Guid userId, Guid byAdmin);
        Task<(bool success, string msg)> RestoreUser(Guid userId, Guid byAdmin);
    }
}

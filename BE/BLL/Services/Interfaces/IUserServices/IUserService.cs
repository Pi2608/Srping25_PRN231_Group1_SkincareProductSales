using DAL.Models.UserModel;

namespace BLL.Services.Interfaces.IUserServices
{
    public interface IUserService
    {
        Task<IEnumerable<User>> GetAllUsers();
        Task<User?> GetUser(Guid id);
        Task<string?> Login(string email, string password);
    }
}

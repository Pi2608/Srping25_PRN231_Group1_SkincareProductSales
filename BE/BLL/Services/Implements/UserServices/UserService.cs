using BLL.Services.Interfaces.IUserServices;
using DAL.Models.UserModel;
using DAL.Repositories.Interfaces;
using Microsoft.Extensions.Configuration;

namespace BLL.Services.Implements.UserServices
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IConfiguration _configuration;

        public UserService(IUnitOfWork unitOfWork, IConfiguration configuration)
        {
            _unitOfWork = unitOfWork;
            _configuration = configuration;
        }

        public Task<bool> Register(User user)
        {
            throw new NotImplementedException();
        }

        public async Task<string?> Login(string email, string password)
        {
            var user = await _unitOfWork.UserRepository.GetUserByEmailAsync(email, password);
            if (user == null) return null;
            AuthService auth = new AuthService(_configuration);
            string token = auth.GenerateJwtToken(user.Id);
            return token;
        }
        public async Task<IEnumerable<User>> GetAllUsers()
        {
            return await _unitOfWork.UserRepository.GetUsers();
        }

        public async Task<User?> GetUser(Guid id)
        {
            return await _unitOfWork.UserRepository.GetUserById(id);
        }
    }
}

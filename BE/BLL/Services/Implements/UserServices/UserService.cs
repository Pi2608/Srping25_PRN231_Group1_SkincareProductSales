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

        public async Task<bool> Register(User user)
        {
            var existingUser = await _unitOfWork.UserRepository.GetUserByEmail(user.Email);
            if (existingUser != null)
            {
                return false;
            }



            await _unitOfWork.UserRepository.CreateUser(user);

            return true;
        }

        public async Task<string?> Login(string email, string password)
        {
            var user = await _unitOfWork.UserRepository.Login(email, password);
            if (user == null) return null;
            AuthService auth = new AuthService(_configuration);
            string token = auth.GenerateJwtToken(user);
            return token;
        }
        public async Task<IEnumerable<User>> GetAllUsers()
        {
            return await _unitOfWork.UserRepository.GetUsers();
        }

        public async Task<User?> GetUserById(Guid id)
        {
            return await _unitOfWork.UserRepository.GetUserById(id);
        }

        public async Task<User?> GetUserByEmail(string email)
        {
            return await _unitOfWork.UserRepository.GetUserByEmail(email);
        }

        public async Task<bool> CheckUserExist(string email)
        {
            User? us = await _unitOfWork.UserRepository.GetUserByEmail(email);
            if (us == null)
            {
                return false;
            }
            return true;
        }
    }
}

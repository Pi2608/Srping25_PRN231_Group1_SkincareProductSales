using AutoMapper;
using BLL.Services.Interfaces.IUserServices;
using DAL.Models.UserModel;
using DAL.Repositories.Interfaces;
using DTO;
using DTO.User;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace BLL.Services.Implements.UserServices
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;

        public UserService(IUnitOfWork unitOfWork, IConfiguration configuration, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _configuration = configuration;
            _mapper = mapper;
        }

        public async Task<string?> Register(UserDTO? user)
        {
            var existingUser = await _unitOfWork.UserRepository.GetUserByEmail(user.Email);
            if (existingUser != null)
            {
                return null;
            }

            var userdto = _mapper.Map<User>(user);

            var defaultRole = await _unitOfWork.RoleRepository.GetRoleId("Customer");
            if (defaultRole != null)
            {
                userdto.RoleId = defaultRole.Id;
            }

            var newUser = await _unitOfWork.UserRepository.CreateUser(userdto);
            
            if (newUser == null)
            {
                return null;
            }

            var secretKey = _configuration["JwtSettings:SecretKey"];
            var issuer = _configuration["JwtSettings:Issuer"];
            var audience = _configuration["JwtSettings:Audience"];
            string token = AuthService.GenerateJwtToken(newUser, secretKey, 1000000, issuer, audience);
            return token;
        }

        public async Task<string?> Login(string email, string password)
        {
            var user = await _unitOfWork.UserRepository.Login(email, password);
            if (user == null) return null;
            var secretKey = _configuration["JwtSettings:SecretKey"];
            var issuer = _configuration["JwtSettings:Issuer"];
            var audience = _configuration["JwtSettings:Audience"];
            string token = AuthService.GenerateJwtToken(user, secretKey, 1000000, issuer, audience);
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

        public async Task<bool> UpdateProfile(Guid userId, UserProfileDTO us)
        {
            var success = await _unitOfWork.UserRepository.UpdateUser(userId, us);
            return success;
        }

        public async Task<bool> ChangePassword(Guid userId, string oldPassword, string newPassword)
        {
            var success = await _unitOfWork.UserRepository.ChangePasswordAsync(userId, oldPassword, newPassword);
            return success;
        }
    }
}

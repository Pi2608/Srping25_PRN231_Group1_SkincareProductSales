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

            if (!newUser.success)
            {
                return null;
            }

            var secretKey = _configuration["JwtSettings:SecretKey"];
            var issuer = _configuration["JwtSettings:Issuer"];
            var audience = _configuration["JwtSettings:Audience"];
            string token = AuthService.GenerateJwtToken(newUser.user, secretKey, 1000000, issuer, audience);
            return token;
        }

        public async Task<string?> Login(string email, string password)
        {
            var user = await _unitOfWork.UserRepository.Login(email, password);
            if (user == null) return null;
            if (user.IsDeleted) return "User is banned";
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

        public async Task<(bool success, string message, User user)> CreateUser(CreateUserDTO user)
        {
            var existingUser = await _unitOfWork.UserRepository.GetUserByEmail(user.Email);
            if (existingUser != null)
            {
                return (false, "User already exists", existingUser);
            }

            var userdto = _mapper.Map<User>(user);

            userdto.CreatedAt = DateTime.Now;
            userdto.UpdatedAt = DateTime.Now;
            userdto.IsDeleted = false;

            var result = await _unitOfWork.UserRepository.CreateUser(userdto);

            if (!result.success)
            {
                return (result.success, result.message, null);
            }

            return (true, "User created successfully", userdto);
        }

        public async Task<bool> UpdateProfile(Guid userId, UserProfileDTO us)
        {
            var success = await _unitOfWork.UserRepository.UpdateUser(userId, us);
            return success;
        }

        public async Task<(bool success, string msg)> EditUser(Guid userId, EditUserDTO us, Guid byAdmin)
        {
            var success = await _unitOfWork.UserRepository.EditUser(userId, us, byAdmin);
            if (success)
            {
                return new(true, "User updated successfully");
            }
            throw new Exception("Can not update user");
        }


        public async Task<bool> ChangePassword(Guid userId, string oldPassword, string newPassword)
        {
            var success = await _unitOfWork.UserRepository.ChangePasswordAsync(userId, oldPassword, newPassword);
            return success;
        }

        public async Task<(bool success, string msg)> DeleteUser(Guid userId, Guid byAdmin)
        {
            var existingUser = await _unitOfWork.UserRepository.GetUserById(userId);
            if (existingUser is not null)
            {
                existingUser.IsDeleted = true;
                existingUser.DeletedAt = DateTime.UtcNow;
                existingUser.UpdatedBy = byAdmin;
                var deleteResult = await _unitOfWork.UserRepository.UpdateAsync(existingUser);
                var process = await _unitOfWork.SaveChangeAsync();
                return new(true, "Delete success");
            }
            throw new Exception("Can not found user");
        }

        public async Task<(bool success, string msg)> RestoreUser(Guid userId, Guid byAdmin)
        {
            var existingUser = await _unitOfWork.UserRepository.GetUserById(userId);
            if (existingUser is null)
            {
                return new(false, "User not found");
            }

            existingUser.IsDeleted = false;
            existingUser.DeletedAt = null;
            existingUser.UpdatedBy = byAdmin;
            var deleteResult = await _unitOfWork.UserRepository.UpdateAsync(existingUser);
            var process = await _unitOfWork.SaveChangeAsync();
            return new(true, "User restored successfully");
        }

        public async Task<(bool isSuccess, string message, decimal? newBalance)> TopUpAsync(Guid userId, TopUpRequestDTO request)
        {
            var user = await _unitOfWork.UserRepository.GetByIdAsync(userId);
            if (user == null)
            {
                return (false, "User not found.", null);
            }

            if (request.Amount < 50000)
            {
                return (false, "Amount must be greater than 0.", null);
            }

            user.MoneyAmount += request.Amount;
            user.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.UserRepository.UpdateAsync(user);
            await _unitOfWork.SaveChangeAsync();

            return (true, "Popyp Successfully", user.MoneyAmount);
        }
    }
}

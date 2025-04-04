﻿using DAL.Models.UserModel;
using DTO.User;

namespace DAL.Repositories.Interfaces.IUserRepos
{
    public interface IUserRepository : IRepository<User>
    {
        Task<User?> Login(string email, string password);
        Task<User?> GetUserById(Guid id);
        Task<User?> GetUserByEmail(string email);
        Task<IEnumerable<User>> GetUsers();
        Task<(bool success, string message, User user)> CreateUser(User user);
        Task<bool> UpdateUser(Guid userId, UserProfileDTO User);
        Task<bool> ChangePasswordAsync(Guid userId, string oldPassword, string newPassword);
        Task<bool> EditUser(Guid userId, EditUserDTO us, Guid byAdmin);
        Task<bool> ChargeUserForOrder(Guid userId, decimal money);
        Task<bool> RefundUserBalance(Guid userId, decimal money);
    }
}

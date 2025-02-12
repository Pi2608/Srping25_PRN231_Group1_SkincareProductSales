﻿using BLL.Services.Interfaces.IUserServices;
using DAL.Repositories.Interfaces;

namespace BLL.Services.Implements.UserServices
{
    public class RoleService : IRoleService
    {
        private readonly IUnitOfWork _unitOfWork;

        public RoleService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
    }
}

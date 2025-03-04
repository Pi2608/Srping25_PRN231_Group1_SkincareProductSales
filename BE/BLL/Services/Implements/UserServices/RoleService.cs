using BLL.Services.Interfaces.IUserServices;
using DAL.Models.UserModel;
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

        public Task<Role> GetRoleId(string roleName)
        {
            return _unitOfWork.RoleRepository.GetRoleId(roleName);
        }
    }
}

using BLL.Services.Interfaces.IUserServices;
using DAL.Repositories.Interfaces;

namespace BLL.Services.Implements.UserServices
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _unitOfWork;

        public UserService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
    }
}

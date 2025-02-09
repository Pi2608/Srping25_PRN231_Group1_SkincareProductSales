using DAL.Repositories.Interfaces.IOrderRepos;
using DAL.Repositories.Interfaces.IProductRepos;
using DAL.Repositories.Interfaces.IUserRepos;

namespace DAL.Repositories.Interfaces
{
    public interface IUnitOfWork
    {
        Task<int> SaveChangeAsync();
        IUserRepository UserRepository { get; }
        IRoleRepository RoleRepository { get; }
        ICategoryRepository CategoryRepository { get; }
        IProductRepository ProductRepository { get; }
        IProductCategoryRepository ProductCategoryRepository { get; }
        IProductDetailRepository ProductDetailRepository { get; }
        IRatingReviewRepository RatingReviewRepository { get; }
        IOrderRepository OrderRepository { get; }
        IOrderDetailRepository OrderDetailRepository { get; }
        IOrderVoucherRepository OrderVoucherRepository { get; }
        IVoucherRepository VoucherRepository { get; }
    }
}

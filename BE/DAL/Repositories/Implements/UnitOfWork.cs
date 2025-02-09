using DAL.Context;
using DAL.Repositories.Implements.OrderRepos;
using DAL.Repositories.Implements.ProductRepos;
using DAL.Repositories.Implements.UserRepos;
using DAL.Repositories.Interfaces;
using DAL.Repositories.Interfaces.IOrderRepos;
using DAL.Repositories.Interfaces.IProductRepos;
using DAL.Repositories.Interfaces.IUserRepos;

namespace DAL.Repositories.Implements
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;
        private readonly IUserRepository _userRepository;
        private readonly IRoleRepository _roleRepository;
        private readonly ICategoryRepository _categoryRepository;
        private readonly IProductRepository _productRepository;
        private readonly IProductCategoryRepository _productCategoryRepository;
        private readonly IProductDetailRepository _productDetailRepository;
        private readonly IRatingReviewRepository _ratingReviewRepository;
        private readonly IOrderRepository _orderRepository;
        private readonly IOrderDetailRepository _orderDetailRepository;
        private readonly IOrderVoucherRepository _orderVoucherRepository;
        private readonly IVoucherRepository _voucherRepository;

        public UnitOfWork(AppDbContext context)
        {
            _context = context;
            _userRepository = new UserRepository(context);
            _roleRepository = new RoleRepository(context);
            _categoryRepository = new CategoryRepository(context);
            _productRepository = new ProductRepository(context);
            _productCategoryRepository = new ProductCategoryRepository(context);
            _productDetailRepository = new ProductDetailRepository(context);
            _ratingReviewRepository = new RatingReviewRepository(context);
            _orderRepository = new OrderRepository(context);
            _orderDetailRepository = new OrderDetailRepository(context);
            _orderVoucherRepository = new OrderVoucherRepository(context);
            _voucherRepository = new VoucherRepository(context);
        }

        public IUserRepository UserRepository => _userRepository;

        public IRoleRepository RoleRepository => _roleRepository;

        public ICategoryRepository CategoryRepository => _categoryRepository;

        public IProductRepository ProductRepository => _productRepository;

        public IProductCategoryRepository ProductCategoryRepository => _productCategoryRepository;

        public IProductDetailRepository ProductDetailRepository => _productDetailRepository;

        public IRatingReviewRepository RatingReviewRepository => _ratingReviewRepository;

        public IOrderRepository OrderRepository => _orderRepository;

        public IOrderDetailRepository OrderDetailRepository => _orderDetailRepository;

        public IOrderVoucherRepository OrderVoucherRepository => _orderVoucherRepository;

        public IVoucherRepository VoucherRepository => _voucherRepository;

        public Task<int> SaveChangeAsync() => _context.SaveChangesAsync();
    }
}

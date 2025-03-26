using DAL.Context;
using DAL.Models.ProductModel;
using DAL.Repositories.Interfaces.IProductRepos;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories.Implements.ProductRepos
{
    public class ProductDetailRepository : Repository<ProductDetail>, IProductDetailRepository
    {
        private readonly AppDbContext _context;
        public ProductDetailRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<ProductDetail?> FindProduct(Guid id, int size)
        {
            return await _context.ProductDetails.FirstOrDefaultAsync(pd => pd.ProductId == id && pd.Size == size); ;
        }
    }
}

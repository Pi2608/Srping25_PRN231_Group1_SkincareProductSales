using DAL.Context;
using DAL.Models.ProductModel;
using DAL.Repositories.Interfaces.IProductRepos;
using DTO.Product;
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

        public async Task<List<ProductDetailViewDto>> GetProductDetailsByProductIdAsync(Guid id)
        {
            return await _context.ProductDetails
                   .Where(pd => pd.ProductId == id)
                   .Select(pd => new ProductDetailViewDto
                   {
                       Id = pd.Id,
                       ProductId = pd.ProductId,
                       Size = pd.Size,
                       Price = pd.Price,
                       Description = pd.Description,
                       StockQuantity = pd.StockQuantity,
                       IsDeleted = pd.IsDeleted
                   })
                   .OrderBy(p => p.Size)
                   .ToListAsync();
        }
    }
}

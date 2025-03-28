﻿using DAL.Models.ProductModel;

namespace DAL.Repositories.Interfaces.IProductRepos
{
    public interface IProductDetailRepository : IRepository<ProductDetail>
    {
        Task<ProductDetail?> FindProduct(Guid id, int size);
    }
}

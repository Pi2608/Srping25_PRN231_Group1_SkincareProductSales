﻿using DAL.Models;
using System.Linq.Expressions;

namespace DAL.Repositories.Interfaces
{
    public interface IRepository<T> where T : BaseEntity
    {
        Task<IQueryable<T>> GetAllAsync(Expression<Func<T, bool>>? expression = null, bool noTracked = false, params string[] includeProperties);
        Task<T> GetWithConditionAsync(Expression<Func<T, bool>>? expression, bool noTracked = false, params string[] includeProperties);
        Task<T> GetByIdAsync(Guid Id, bool noTracked = false, params string[] includeProperties);
        IQueryable<T> GetQueryById(Guid Id, bool noTracked = false);
        IQueryable<T> GetQuery(bool noTracked = false);
        Task<T> AddAsync(T entity);
        Task<List<T>> AddRangeAsync(IEnumerable<T> values);
        Task<T> UpdateAsync(T entity);
        Task DeleteAsync(T entity, bool isHardDelete = false);
    }
}
﻿using DAL.Models;
using System.Linq.Expressions;

namespace DAL.Repositories.Interfaces
{
    public interface IRepository<T> where T : BaseEntity
    {
        Task<IQueryable<T>> GetAllAsync(Expression<Func<T, bool>>? expression = null, bool noTracked = false, params string[] includeProperties);
        Task<T> GetWithCondition(Expression<Func<T, bool>>? expression, bool noTracked = false, params string[] includeProperties);
        Task<T> GetById(Guid Id, bool noTracked = false, params string[] includeProperties);
        Task AddAsync(T entity);
        Task AddRangeAsync(IEnumerable<T> values);
        Task UpdateAsync(T entity);
        Task DeleteAsync(T entity);
    }
}
using DAL.Context;
using DAL.Models;
using DAL.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace DAL.Repositories.Implements
{
    public class Repository<T> : IRepository<T> where T : BaseEntity
    {
        protected DbSet<T> _dbSet;

        public Repository(AppDbContext context)
        {
            _dbSet = context.Set<T>();
        }

        public async Task<T> AddAsync(T entity)
        {
            _dbSet.Add(entity);
            return entity;
        }

        public async Task AddRangeAsync(IEnumerable<T> values)
        {
            foreach (var item in values)
            {
                _dbSet.Add(item);
            }
        }

        public async Task DeleteAsync(T entity, bool isHardDelete = false)
        {
            if (isHardDelete)
            {
                _dbSet.Remove(entity);
            }
            else
            {
                entity.IsDeleted = true;
                _dbSet.Update(entity);
            }
        }

        public async Task<IQueryable<T>> GetAllAsync(Expression<Func<T, bool>>? expression = null, bool noTracked = false, params string[] includeProperties)
        {

            IQueryable<T> query;
            if (noTracked)
            {
                query = _dbSet.AsNoTracking();
            }
            else
            {
                query = _dbSet;
            }

            if (expression is not null)
            {
                query = _dbSet.Where(expression);
            }

            if (includeProperties is not null)
            {
                foreach (var prop in includeProperties)
                {
                    query = query.Include(prop.Trim());
                }
            }
            return query;
        }

        public async Task<T> GetByIdAsync(Guid Id, bool noTracked = false, params string[] includeProperties)
        {
            IQueryable<T> query;
            if (noTracked is true)
            {
                query = _dbSet.AsNoTracking();
            }
            else
            {
                query = _dbSet;
            }
            if (includeProperties is not null)
            {
                foreach (var property in includeProperties)
                {
                    query = query.Include(property);
                }
            }

            var entity = await query.FirstOrDefaultAsync(t => t.Id.Equals(Id));
            return entity;
        }

        public Task<T> GetWithConditionAsync(Expression<Func<T, bool>>? expression, bool noTracked = false, params string[] includeProperties)
        {
            var result = _dbSet.Where(expression);
            if (includeProperties is not null)
            {
                foreach (var prop in includeProperties)
                {
                    result = result.Include(prop.Trim());
                }
            }
            if (noTracked is true)
            {
                result.AsNoTracking();
            }
            return result.FirstOrDefaultAsync();
        }

        public async Task<T> UpdateAsync(T entity)
        {
            _dbSet.Update(entity);
            return entity;
        }
    }
}

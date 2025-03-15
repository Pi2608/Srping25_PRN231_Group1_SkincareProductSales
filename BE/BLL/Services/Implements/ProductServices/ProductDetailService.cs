using AutoMapper;
using BLL.Services.Interfaces.IProductServices;
using DAL.Models.ProductModel;
using DAL.Repositories.Interfaces;
using DTO.Product;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BLL.Services.Implements.ProductServices
{
    public class ProductDetailService : IProductDetailService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ProductDetailService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<List<ProductDetailViewDto>> GetAllProductDetails()
        {
            var productDetails = await _unitOfWork.ProductDetailRepository.GetAllAsync();
            return _mapper.Map<List<ProductDetailViewDto>>(productDetails);
        }

        public async Task<ProductDetailViewDto> GetProductDetailById(Guid id)
        {
            var productDetail = await _unitOfWork.ProductDetailRepository.GetByIdAsync(id);
            if (productDetail == null) throw new Exception("Product Detail not found");
            return _mapper.Map<ProductDetailViewDto>(productDetail);
        }

        public async Task<ProductDetailViewDto> CreateProductDetail(CreateProductDetailDTO productDetail)
        {
            var entity = _mapper.Map<ProductDetail>(productDetail);
            var addedEntity = await _unitOfWork.ProductDetailRepository.AddAsync(entity);
            await _unitOfWork.SaveChangeAsync();
            return _mapper.Map<ProductDetailViewDto>(addedEntity);
        }

        public async Task<ProductDetailViewDto> UpdateProductDetail(Guid id, CreateProductDetailDTO productDetail)
        {
            var existingDetail = await _unitOfWork.ProductDetailRepository.GetByIdAsync(id);
            if (existingDetail == null) throw new Exception("Product Detail not found");

            _mapper.Map(productDetail, existingDetail);
            await _unitOfWork.ProductDetailRepository.UpdateAsync(existingDetail);
            await _unitOfWork.SaveChangeAsync();
            return _mapper.Map<ProductDetailViewDto>(existingDetail);
        }

        public async Task<ProductDetail> GetProductDetailByProductId(Guid productId)
        {
            var productDetails = await _unitOfWork.ProductDetailRepository
                .GetAllAsync(p => p.ProductId == productId, true);

            if (productDetails.IsNullOrEmpty())
            {
                throw new Exception("No product details found for this productId");
            }

            return productDetails.FirstOrDefault();
        }

        public async Task<bool> DeleteProductDetail(Guid id)
        {
            var existingDetail = await _unitOfWork.ProductDetailRepository.GetByIdAsync(id);
            if (existingDetail == null) throw new Exception("Product Detail not found");

            existingDetail.IsDeleted = true;
            await _unitOfWork.ProductDetailRepository.UpdateAsync(existingDetail);
            await _unitOfWork.SaveChangeAsync();
            return true;
        }
    }
}

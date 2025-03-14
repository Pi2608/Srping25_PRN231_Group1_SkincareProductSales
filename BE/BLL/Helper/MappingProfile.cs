using AutoMapper;
using DAL.Models.OrderModel;
using DAL.Models.ProductModel;
using DAL.Models.UserModel;
using DTO.Order;
using DTO.Product;
using DTO.User;

namespace BLL.Helper
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            //order
            CreateMap<UserDTO, User>()
                .ForMember(dest => dest.Address, opt => opt.MapFrom(src => "No Address")).ReverseMap();

            CreateMap<OrderViewDTO, Order>().ReverseMap();
            CreateMap<CreateOrUpdateOrder, Order>().ReverseMap();
            CreateMap<CreateOrUpdateOrderDetail, OrderDetail>().ReverseMap();
            CreateMap<OrderDetailViewDto, OrderDetail>().ReverseMap();

            //product
            CreateMap<Product, ProductViewDTO>()
            .ForMember(dest => dest.Categories,
                opt => opt.MapFrom(src => src.ProductCategories.Select(pc => pc.Category).ToList()));
            CreateMap<Category, CategoryViewDTO>();
            CreateMap<ProductDetail, ProductDetailViewDto>();
            CreateMap<ProductCategory, ProductCategoryViewDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name));
        }
    }
}

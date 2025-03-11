using AutoMapper;
using DAL.Models.OrderModel;
using DAL.Models.UserModel;
using DTO.Order;
using DTO.User;

namespace BLL.Helper
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<UserDTO, User>()
                .ForMember(dest => dest.Address, opt => opt.MapFrom(src => "No Address")).ReverseMap();

            CreateMap<OrderViewDTO, Order>().ReverseMap();
            CreateMap<CreateOrUpdateOrder, Order>().ReverseMap();
            CreateMap<CreateOrUpdateOrderDetail, OrderDetail>().ReverseMap();
            CreateMap<OrderDetailViewDto, OrderDetail>().ReverseMap();
        }
    }
}

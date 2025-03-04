using AutoMapper;
using DAL.Models.UserModel;
using DTO.User;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Helper
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<UserDTO, User>()
                .ForMember(dest => dest.Address, opt => opt.MapFrom(src => "No Address"));
        }
    }
}

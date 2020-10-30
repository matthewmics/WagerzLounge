﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Dtos;
using API.Models;
using AutoMapper;

namespace API.Configs
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Match, MatchDto>();
            CreateMap<Team, TeamDto>();
            CreateMap<AppUser, UserDto>()
                .ForMember(x => x.Username, x => x.MapFrom(x => x.UserName))
                .ForMember(x => x.Token, x => x.MapFrom<TokenResolver>());
        }
    }
}

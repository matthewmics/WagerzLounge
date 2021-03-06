﻿using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Application.User;
using Application.User.Dtos;

namespace API.Controllers
{
    public class UserController : BaseController
    {
        [HttpGet]
        [Authorize]
        public async Task<UserDto> CurrentUser()
        {
            return await Mediator.Send(new GetCurrent.Query());
        }

        [HttpPost("register")]
        public async Task<UserDto> Register(Register.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpPost("login")]
        public async Task<UserDto> Login(Login.Query query)
        {
            return await Mediator.Send(query);
        }

    }
}

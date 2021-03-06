﻿using Application.Interfaces;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace API.Security
{
    public class UserAccessor : IUserAccessor
    {
        private readonly IHttpContextAccessor _httpContext;

        public UserAccessor(IHttpContextAccessor httpContext)
        {
            _httpContext = httpContext;
        }

        public string GetCurrentEmail()
        {
            return _httpContext.HttpContext.User?.Claims?.SingleOrDefault(x => x.Type == ClaimTypes.Email)?
                   .Value;
        }
    }
}

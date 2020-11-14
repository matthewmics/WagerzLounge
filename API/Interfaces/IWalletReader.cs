﻿using API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace API.Interfaces
{
    public interface IWalletReader
    {
        decimal ReadWallet(Customer customer);
    }
}
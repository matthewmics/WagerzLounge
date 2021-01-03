﻿using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Paypal
{
    public class PaypalSettings
    {
        public string ClientId { get; set; }
        public string Secret { get; set; }
        public string ReturnUrl { get; set; }
        public string CancelUrl { get; set; }
    }
}

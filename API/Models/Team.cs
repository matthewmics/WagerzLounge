﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models
{
    public class Team
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
        public ICollection<Match> TeamAMatches { get; set; }
        public ICollection<Match> TeamBMatches { get; set; }
    }
}

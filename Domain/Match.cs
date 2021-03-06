﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain
{
    public class Match
    {
        public int Id { get; set; }

        public Team TeamA { get; set; }
        public int TeamAId { get; set; }

        public Team TeamB { get; set; }
        public int TeamBId { get; set; }

        public string EventName { get; set; }
        public int Series { get; set; }

        public short GameId { get; set; }
        public Game Game { get; set; }


        public ICollection<Prediction> Predictions { get; set; }
        public ICollection<MatchComment> MatchComments{ get; set; }

    }
}

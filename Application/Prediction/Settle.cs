﻿using MediatR;
using Persistence;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Microsoft.EntityFrameworkCore;

namespace Application.Prediction
{
    public class Settle
    {

        public class Command : IRequest
        {
            public int PredictionId { get; set; }
            public int TeamId { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var prediction = await _context.Predictions
                    .Include(x => x.Match).ThenInclude(x => x.Predictions)
                    .Include(x => x.PredictionStatus)
                    .SingleOrDefaultAsync(x => x.Id == request.PredictionId);

                if (prediction == null)
                    throw new RestException(System.Net.HttpStatusCode.NotFound, 
                        new { Prediction = "Prediction not found" });

                var match = prediction.Match;

                if(prediction.PredictionStatus.Id != Domain.PredictionStatus.Live)
                    throw new RestException(System.Net.HttpStatusCode.NotFound, 
                        new { Prediction = "Prediction must be live in order to settle" });

                var winningTeamId = match.TeamAId == request.TeamId ? match.TeamAId :
                                    match.TeamBId == request.TeamId ? match.TeamBId : -1;

                if (winningTeamId == -1)
                    throw new RestException(System.Net.HttpStatusCode.BadRequest, 
                        new { Team = "Selected team is not participating the prediction" });

                if (prediction.IsMain)
                {
                    foreach (var p in prediction.Match.Predictions)
                    {
                        if (p.PredictionStatusId != Domain.PredictionStatus.Settled)
                        {
                            p.PredictionStatusId = Domain.PredictionStatus.Cancelled;
                        }
                    }
                }

                prediction.PredictionStatusId = Domain.PredictionStatus.Settled;
                prediction.WinnerId = winningTeamId;

                var success = await _context.SaveChangesAsync() > 0;

                if (success)
                    return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }

    }
}
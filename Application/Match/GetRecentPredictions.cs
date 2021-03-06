﻿using MediatR;
using Persistence;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using System.Linq;
using Application.Match.Dtos;
using Application.Photo;

namespace Application.Match
{
    public class GetRecentPredictions
    {

        public class Query : IRequest<List<PredictionRecentDto>>
        {
            public int MatchId { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<PredictionRecentDto>>
        {
            private readonly DataContext _ctx;
            private readonly IMapper _mapper;
            private readonly IImageHostGenerator _imageHostGenerator;

            public Handler(DataContext ctx, IMapper mapper, IImageHostGenerator imageHostGenerator)
            {
                _ctx = ctx;
                _mapper = mapper;
                _imageHostGenerator = imageHostGenerator;
            }

            public async Task<List<PredictionRecentDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var match = await _ctx.Matches
                    .Include(x => x.Predictions)
                        .ThenInclude(x => x.Predictors)
                            .ThenInclude(x => x.Wagerer)
                    .SingleOrDefaultAsync(x => x.Id == request.MatchId);

                if (match == null)
                    throw new RestException(System.Net.HttpStatusCode.NotFound, new { Match = "Not found" });


                var recentPredictors = match.Predictions
                    .SelectMany(x => x.Predictors)
                    .Select(x => new PredictionRecentDto
                    {
                        Amount = x.Amount,
                        PredictionName = x.Prediction.Title,
                        UserPhoto = x.Wagerer.ProfilePhoto,
                        When = x.PredictedAt
                    })
                    .OrderByDescending(x => x.When)
                    .Take(8)
                    .ToList();

                recentPredictors.ForEach(x =>
                {
                    x.UserPhoto = _imageHostGenerator.GetHostImage(x.UserPhoto);
                });

                return recentPredictors;
            }
        }

    }
}

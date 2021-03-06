import { IPrediction, IPredictionStatus } from "./prediction";
import { ITeam } from "./team";

export interface IMatchEnvelope {
    matches: IMatch[];
    matchCount: number;
}

export interface IMatch {
    id: number;
    category: string;
    eventName: string;
    startDate: Date;
    settledDate: Date;
    teamA: ITeam;
    teamB: ITeam;
    winner: ITeam;
    predictions: IPrediction[];
    series: number;
    matchStatus: IPredictionStatus;
    game: IGame;
    comments: IComment[];
}

export interface IComment {
    id: string;
    displayName: string;
    message: string;
    photo: string;
    createdAt: Date;
}

export interface IGame {
    id: number;
    name: string;
    displayText: string;
}

export interface IMatchForm {
    eventName: string;
    teamAId: number;
    teamBId: number;
    gameId: number;
    series: number;
    title: string;
    description: string;
    startsAt: Date;
}

export interface IMatchRecent {
    teamA: ITeam;
    teamB: ITeam;
    winner: ITeam;
    settledDate: Date;
    id: number;
}

export interface IMatchPredictionRecent {
    userPhoto: string;
    predictionName: string;
    amount: number;
    when: Date;
}
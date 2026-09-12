import source from "./playerStats.json";
import type { PlayerCareerStats, SeasonResult } from "@/types/mleague";

type CareerTuple = [
  matchesPlayed: number,
  totalPoints: number,
  averagePlacement: number | null,
  firstPlaceCount: number,
  secondPlaceCount: number,
  thirdPlaceCount: number,
  fourthPlaceCount: number,
  topRate: number | null,
  topTwoRate: number | null,
  lastAvoidanceRate: number | null,
  pointsPerMatch: number | null,
];

type SeasonTuple = [
  season: string,
  matchesPlayed: number,
  regularSeasonPoints: number,
];

type SourcePlayerStats = {
  playerId: string;
  career: CareerTuple;
  seasons: SeasonTuple[];
  notes?: string[];
};

const sourcePlayers = source.players as SourcePlayerStats[];

export const playerCareerStats: PlayerCareerStats[] = sourcePlayers.map((player) => {
  const [
    matchesPlayed,
    totalPoints,
    averagePlacement,
    firstPlaceCount,
    secondPlaceCount,
    thirdPlaceCount,
    fourthPlaceCount,
    topRate,
    topTwoRate,
    lastAvoidanceRate,
    pointsPerMatch,
  ] = player.career;

  return {
    playerId: player.playerId,
    matchesPlayed,
    totalPoints,
    averagePlacement,
    firstPlaceCount,
    secondPlaceCount,
    thirdPlaceCount,
    fourthPlaceCount,
    topRate,
    topTwoRate,
    lastAvoidanceRate,
    pointsPerMatch,
    period: source.source.period,
    sourceLabel: source.source.label,
    verifiedAt: source.source.verifiedAt,
    notes: player.notes || [],
  };
});

export const seasonResults: SeasonResult[] = sourcePlayers.flatMap((player) =>
  player.seasons.map(([season, matchesPlayed, regularSeasonPoints]) => ({
    id: `result-${player.playerId.replace("player-", "")}-${season}`,
    playerId: player.playerId,
    season,
    regularSeasonPoints,
    matchesPlayed,
    sourceLabel: source.source.label,
    verifiedAt: source.source.verifiedAt,
  })),
);

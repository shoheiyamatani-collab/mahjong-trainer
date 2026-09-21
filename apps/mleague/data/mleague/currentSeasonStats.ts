import source from "./currentSeasonStats.json";

export const currentSeason = source.season;
export const currentSeasonStatsVerifiedAt = source.verifiedAt;
export const currentSeasonStatsThrough = source.through;
export const currentSeasonStatsSourceUrl = source.sourceUrl;

export type CurrentSeasonPlayerStatLine = {
  matchesPlayed: number;
  points: number;
  averagePlacement: number | null;
  firstPlaceCount: number;
  secondPlaceCount: number;
  thirdPlaceCount: number;
  fourthPlaceCount: number;
};

export const emptyCurrentSeasonStat: CurrentSeasonPlayerStatLine = {
  matchesPlayed: 0,
  points: 0,
  averagePlacement: null,
  firstPlaceCount: 0,
  secondPlaceCount: 0,
  thirdPlaceCount: 0,
  fourthPlaceCount: 0,
};

export const currentSeasonPlayerStatsByPlayerId: Record<
  string,
  CurrentSeasonPlayerStatLine
> = source.players;

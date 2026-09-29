import source from "./currentSeasonStats.json";

export const currentSeason = source.season;
export const currentSeasonStatsVerifiedAt = source.verifiedAt;
export const currentSeasonStatsThrough = source.through;
export const currentSeasonStatsCompletedTablesOnThrough =
  source.completedTablesOnThrough ?? 1;
export const currentSeasonStatsTotalTablesOnThrough =
  source.totalTablesOnThrough ?? currentSeasonStatsCompletedTablesOnThrough;
export const currentSeasonStatsSourceUrl = source.sourceUrl;
export const currentSeasonStatsProgressLabel =
  currentSeasonStatsCompletedTablesOnThrough < currentSeasonStatsTotalTablesOnThrough
    ? `${currentSeasonStatsThrough.replaceAll("-", ".")} ${currentSeasonStatsCompletedTablesOnThrough}/${currentSeasonStatsTotalTablesOnThrough}卓終了時点`
    : `${currentSeasonStatsThrough.replaceAll("-", ".")} 対局終了時点`;

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

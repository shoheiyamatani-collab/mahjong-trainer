export const currentSeason = "2026-27";
export const currentSeasonStatsVerifiedAt = "2026-09-17";
export const currentSeasonStatsThrough = "2026-09-15";
export const currentSeasonStatsSourceUrl = "https://m-league.jp/stats/";

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

// Mリーグ公式「2026-27 チーム成績表」を2026年9月17日に確認。
// 未出場の選手はページ側で0試合として補完します。
export const currentSeasonPlayerStatsByPlayerId: Record<
  string,
  CurrentSeasonPlayerStatLine
> = {
  "player-miura-tomohiro": {
    matchesPlayed: 1,
    points: -48.1,
    averagePlacement: 4,
    firstPlaceCount: 0,
    secondPlaceCount: 0,
    thirdPlaceCount: 0,
    fourthPlaceCount: 1,
  },
  "player-aikawa-megumu": {
    matchesPlayed: 1,
    points: 58,
    averagePlacement: 1,
    firstPlaceCount: 1,
    secondPlaceCount: 0,
    thirdPlaceCount: 0,
    fourthPlaceCount: 0,
  },
  "player-okada-sayaka": {
    matchesPlayed: 1,
    points: -81.8,
    averagePlacement: 4,
    firstPlaceCount: 0,
    secondPlaceCount: 0,
    thirdPlaceCount: 0,
    fourthPlaceCount: 1,
  },
  "player-shirinashihama-wataru": {
    matchesPlayed: 1,
    points: 64.9,
    averagePlacement: 1,
    firstPlaceCount: 1,
    secondPlaceCount: 0,
    thirdPlaceCount: 0,
    fourthPlaceCount: 0,
  },
  "player-nakabayashi-kei": {
    matchesPlayed: 1,
    points: 3.8,
    averagePlacement: 2,
    firstPlaceCount: 0,
    secondPlaceCount: 1,
    thirdPlaceCount: 0,
    fourthPlaceCount: 0,
  },
  "player-asakura-koshin": {
    matchesPlayed: 1,
    points: 54.7,
    averagePlacement: 1,
    firstPlaceCount: 1,
    secondPlaceCount: 0,
    thirdPlaceCount: 0,
    fourthPlaceCount: 0,
  },
  "player-matsumoto-yoshihiro": {
    matchesPlayed: 1,
    points: 7.4,
    averagePlacement: 2,
    firstPlaceCount: 0,
    secondPlaceCount: 1,
    thirdPlaceCount: 0,
    fourthPlaceCount: 0,
  },
  "player-hinata-aiko": {
    matchesPlayed: 1,
    points: -19.5,
    averagePlacement: 3,
    firstPlaceCount: 0,
    secondPlaceCount: 0,
    thirdPlaceCount: 1,
    fourthPlaceCount: 0,
  },
  "player-suzuki-taro": {
    matchesPlayed: 1,
    points: -55.2,
    averagePlacement: 4,
    firstPlaceCount: 0,
    secondPlaceCount: 0,
    thirdPlaceCount: 0,
    fourthPlaceCount: 1,
  },
  "player-asami-maki": {
    matchesPlayed: 1,
    points: -14.2,
    averagePlacement: 3,
    firstPlaceCount: 0,
    secondPlaceCount: 0,
    thirdPlaceCount: 1,
    fourthPlaceCount: 0,
  },
  "player-kayamori-sayaka": {
    matchesPlayed: 1,
    points: 69.7,
    averagePlacement: 1,
    firstPlaceCount: 1,
    secondPlaceCount: 0,
    thirdPlaceCount: 0,
    fourthPlaceCount: 0,
  },
  "player-daigo-hiroshi": {
    matchesPlayed: 1,
    points: 13.2,
    averagePlacement: 2,
    firstPlaceCount: 0,
    secondPlaceCount: 1,
    thirdPlaceCount: 0,
    fourthPlaceCount: 0,
  },
  "player-sasaki-hisato": {
    matchesPlayed: 1,
    points: -14,
    averagePlacement: 3,
    firstPlaceCount: 0,
    secondPlaceCount: 0,
    thirdPlaceCount: 1,
    fourthPlaceCount: 0,
  },
  "player-takizawa-kazunori": {
    matchesPlayed: 1,
    points: -42.3,
    averagePlacement: 4,
    firstPlaceCount: 0,
    secondPlaceCount: 0,
    thirdPlaceCount: 0,
    fourthPlaceCount: 1,
  },
  "player-nikaido-aki": {
    matchesPlayed: 1,
    points: -22.9,
    averagePlacement: 3,
    firstPlaceCount: 0,
    secondPlaceCount: 0,
    thirdPlaceCount: 1,
    fourthPlaceCount: 0,
  },
  "player-uchikawa-kotaro": {
    matchesPlayed: 1,
    points: 26.3,
    averagePlacement: 2,
    firstPlaceCount: 0,
    secondPlaceCount: 1,
    thirdPlaceCount: 0,
    fourthPlaceCount: 0,
  },
};

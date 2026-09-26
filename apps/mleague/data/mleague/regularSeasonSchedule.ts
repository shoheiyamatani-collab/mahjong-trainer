export type ScheduleTeamId =
  | "team-abemas"
  | "team-fightclub"
  | "team-drivens"
  | "team-furinkazan"
  | "team-phoenix"
  | "team-sakuraknights"
  | "team-pirates"
  | "team-raiden"
  | "team-beast"
  | "team-jets";

export type RegularSeasonMatchDay = {
  date: string;
  tables: readonly (readonly ScheduleTeamId[])[];
};

export const regularSeasonScheduleVerifiedAt = "2026-09-26";
export const regularSeasonScheduleSourceUrl = "https://m-league.jp/games/";

export const regularSeasonSchedule = [
  { date: "2026-09-14", tables: [["team-jets", "team-fightclub", "team-abemas", "team-pirates"]] },
  { date: "2026-09-15", tables: [["team-drivens", "team-furinkazan", "team-sakuraknights", "team-phoenix"]] },
  { date: "2026-09-17", tables: [["team-jets", "team-drivens", "team-raiden", "team-beast"]] },
  { date: "2026-09-18", tables: [["team-sakuraknights", "team-fightclub", "team-raiden", "team-pirates"]] },
  { date: "2026-09-21", tables: [["team-drivens", "team-sakuraknights", "team-abemas", "team-beast"], ["team-jets", "team-furinkazan", "team-phoenix", "team-raiden"]] },
  { date: "2026-09-22", tables: [["team-furinkazan", "team-sakuraknights", "team-abemas", "team-raiden"], ["team-fightclub", "team-phoenix", "team-beast", "team-pirates"]] },
  { date: "2026-09-24", tables: [["team-jets", "team-abemas", "team-phoenix", "team-beast"], ["team-drivens", "team-furinkazan", "team-fightclub", "team-pirates"]] },
  { date: "2026-09-25", tables: [["team-drivens", "team-abemas", "team-raiden", "team-pirates"], ["team-jets", "team-furinkazan", "team-sakuraknights", "team-beast"]] },
  { date: "2026-09-28", tables: [["team-jets", "team-sakuraknights", "team-phoenix", "team-pirates"], ["team-furinkazan", "team-fightclub", "team-abemas", "team-beast"]] },
  { date: "2026-09-29", tables: [["team-furinkazan", "team-raiden", "team-beast", "team-pirates"], ["team-drivens", "team-fightclub", "team-abemas", "team-phoenix"]] },
  { date: "2026-10-01", tables: [["team-jets", "team-drivens", "team-fightclub", "team-phoenix"], ["team-furinkazan", "team-sakuraknights", "team-raiden", "team-pirates"]] },
  { date: "2026-10-02", tables: [["team-jets", "team-fightclub", "team-raiden", "team-beast"], ["team-drivens", "team-sakuraknights", "team-abemas", "team-phoenix"]] },
  { date: "2026-10-05", tables: [["team-jets", "team-furinkazan", "team-fightclub", "team-abemas"], ["team-drivens", "team-phoenix", "team-beast", "team-pirates"]] },
  { date: "2026-10-06", tables: [["team-drivens", "team-furinkazan", "team-phoenix", "team-raiden"], ["team-jets", "team-sakuraknights", "team-fightclub", "team-pirates"]] },
  { date: "2026-10-08", tables: [["team-drivens", "team-furinkazan", "team-sakuraknights", "team-beast"], ["team-jets", "team-abemas", "team-raiden", "team-pirates"]] },
  { date: "2026-10-09", tables: [["team-furinkazan", "team-abemas", "team-beast", "team-pirates"], ["team-sakuraknights", "team-fightclub", "team-phoenix", "team-raiden"]] },
  { date: "2026-10-12", tables: [["team-jets", "team-sakuraknights", "team-phoenix", "team-beast"], ["team-drivens", "team-fightclub", "team-abemas", "team-raiden"]] },
  { date: "2026-10-13", tables: [["team-furinkazan", "team-fightclub", "team-phoenix", "team-pirates"], ["team-sakuraknights", "team-abemas", "team-raiden", "team-beast"]] },
  { date: "2026-10-15", tables: [["team-drivens", "team-fightclub", "team-beast", "team-pirates"], ["team-jets", "team-furinkazan", "team-abemas", "team-phoenix"]] },
  { date: "2026-10-16", tables: [["team-abemas", "team-phoenix", "team-raiden", "team-beast"], ["team-jets", "team-drivens", "team-sakuraknights", "team-pirates"]] },
  { date: "2026-10-19", tables: [["team-sakuraknights", "team-fightclub", "team-abemas", "team-pirates"], ["team-jets", "team-drivens", "team-furinkazan", "team-raiden"]] },
  { date: "2026-10-20", tables: [["team-jets", "team-drivens", "team-sakuraknights", "team-raiden"], ["team-furinkazan", "team-fightclub", "team-phoenix", "team-beast"]] },
  { date: "2026-10-22", tables: [["team-jets", "team-abemas", "team-phoenix", "team-pirates"], ["team-furinkazan", "team-sakuraknights", "team-fightclub", "team-beast"]] },
  { date: "2026-10-23", tables: [["team-drivens", "team-furinkazan", "team-fightclub", "team-abemas"], ["team-phoenix", "team-raiden", "team-beast", "team-pirates"]] },
  { date: "2026-10-26", tables: [["team-drivens", "team-furinkazan", "team-raiden", "team-pirates"], ["team-jets", "team-sakuraknights", "team-abemas", "team-beast"]] },
  { date: "2026-10-27", tables: [["team-furinkazan", "team-sakuraknights", "team-phoenix", "team-raiden"], ["team-jets", "team-drivens", "team-fightclub", "team-beast"]] },
  { date: "2026-10-29", tables: [["team-jets", "team-fightclub", "team-phoenix", "team-raiden"], ["team-drivens", "team-sakuraknights", "team-abemas", "team-pirates"]] },
  { date: "2026-10-30", tables: [["team-sakuraknights", "team-fightclub", "team-abemas", "team-raiden"], ["team-jets", "team-furinkazan", "team-beast", "team-pirates"]] },
  { date: "2026-11-02", tables: [["team-jets", "team-drivens", "team-phoenix", "team-beast"], ["team-sakuraknights", "team-abemas", "team-raiden", "team-pirates"]] },
  { date: "2026-11-03", tables: [["team-furinkazan", "team-sakuraknights", "team-beast", "team-pirates"], ["team-drivens", "team-fightclub", "team-phoenix", "team-raiden"]] },
  { date: "2026-11-05", tables: [["team-jets", "team-sakuraknights", "team-fightclub", "team-raiden"], ["team-drivens", "team-furinkazan", "team-abemas", "team-phoenix"]] },
  { date: "2026-11-06", tables: [["team-drivens", "team-fightclub", "team-abemas", "team-beast"], ["team-jets", "team-furinkazan", "team-phoenix", "team-pirates"]] },
  { date: "2026-11-09", tables: [["team-drivens", "team-sakuraknights", "team-phoenix", "team-pirates"], ["team-furinkazan", "team-fightclub", "team-raiden", "team-beast"]] },
  { date: "2026-11-10", tables: [["team-drivens", "team-sakuraknights", "team-fightclub", "team-pirates"], ["team-jets", "team-abemas", "team-raiden", "team-beast"]] },
  { date: "2026-11-12", tables: [["team-fightclub", "team-abemas", "team-phoenix", "team-pirates"], ["team-jets", "team-drivens", "team-furinkazan", "team-sakuraknights"]] },
  { date: "2026-11-13", tables: [["team-jets", "team-furinkazan", "team-abemas", "team-pirates"], ["team-sakuraknights", "team-phoenix", "team-raiden", "team-beast"]] },
  { date: "2026-11-16", tables: [["team-jets", "team-fightclub", "team-phoenix", "team-beast"], ["team-drivens", "team-furinkazan", "team-abemas", "team-raiden"]] },
  { date: "2026-11-17", tables: [["team-drivens", "team-raiden", "team-beast", "team-pirates"], ["team-jets", "team-sakuraknights", "team-fightclub", "team-abemas"]] },
  { date: "2026-11-19", tables: [["team-furinkazan", "team-sakuraknights", "team-fightclub", "team-phoenix"], ["team-jets", "team-drivens", "team-raiden", "team-pirates"]] },
  { date: "2026-11-20", tables: [["team-sakuraknights", "team-abemas", "team-phoenix", "team-raiden"], ["team-furinkazan", "team-fightclub", "team-beast", "team-pirates"]] },
  { date: "2026-11-23", tables: [["team-jets", "team-drivens", "team-furinkazan", "team-fightclub"], ["team-abemas", "team-phoenix", "team-beast", "team-pirates"]] },
  { date: "2026-11-24", tables: [["team-furinkazan", "team-abemas", "team-phoenix", "team-raiden"], ["team-jets", "team-drivens", "team-sakuraknights", "team-beast"]] },
  { date: "2026-11-26", tables: [["team-furinkazan", "team-sakuraknights", "team-abemas", "team-beast"], ["team-jets", "team-fightclub", "team-raiden", "team-pirates"]] },
  { date: "2026-11-27", tables: [["team-jets", "team-phoenix", "team-beast", "team-pirates"], ["team-drivens", "team-sakuraknights", "team-fightclub", "team-abemas"]] },
  { date: "2026-11-30", tables: [["team-drivens", "team-furinkazan", "team-raiden", "team-beast"], ["team-jets", "team-sakuraknights", "team-abemas", "team-phoenix"]] },
  { date: "2026-12-01", tables: [["team-fightclub", "team-abemas", "team-raiden", "team-pirates"], ["team-jets", "team-drivens", "team-furinkazan", "team-phoenix"]] },
  { date: "2026-12-03", tables: [["team-drivens", "team-furinkazan", "team-fightclub", "team-beast"], ["team-sakuraknights", "team-phoenix", "team-raiden", "team-pirates"]] },
  { date: "2026-12-04", tables: [["team-jets", "team-raiden", "team-beast", "team-pirates"], ["team-furinkazan", "team-sakuraknights", "team-fightclub", "team-abemas"]] },
  { date: "2026-12-07", tables: [["team-jets", "team-fightclub", "team-abemas", "team-phoenix"], ["team-drivens", "team-sakuraknights", "team-raiden", "team-beast"]] },
  { date: "2026-12-08", tables: [["team-jets", "team-furinkazan", "team-sakuraknights", "team-pirates"], ["team-drivens", "team-abemas", "team-phoenix", "team-beast"]] },
  { date: "2026-12-10", tables: [["team-furinkazan", "team-abemas", "team-raiden", "team-beast"], ["team-drivens", "team-fightclub", "team-phoenix", "team-pirates"]] },
  { date: "2026-12-11", tables: [["team-jets", "team-drivens", "team-fightclub", "team-raiden"], ["team-furinkazan", "team-sakuraknights", "team-phoenix", "team-pirates"]] },
  { date: "2026-12-14", tables: [["team-sakuraknights", "team-fightclub", "team-phoenix", "team-beast"], ["team-jets", "team-drivens", "team-abemas", "team-pirates"]] },
  { date: "2026-12-15", tables: [["team-jets", "team-furinkazan", "team-phoenix", "team-beast"], ["team-drivens", "team-sakuraknights", "team-abemas", "team-raiden"]] },
  { date: "2026-12-17", tables: [["team-sakuraknights", "team-abemas", "team-beast", "team-pirates"], ["team-furinkazan", "team-fightclub", "team-phoenix", "team-raiden"]] },
  { date: "2026-12-18", tables: [["team-jets", "team-drivens", "team-sakuraknights", "team-fightclub"], ["team-furinkazan", "team-abemas", "team-raiden", "team-pirates"]] },
  { date: "2026-12-21", tables: [["team-drivens", "team-phoenix", "team-raiden", "team-pirates"], ["team-jets", "team-furinkazan", "team-fightclub", "team-beast"]] },
  { date: "2026-12-22", tables: [["team-jets", "team-sakuraknights", "team-phoenix", "team-raiden"], ["team-fightclub", "team-abemas", "team-beast", "team-pirates"]] },
  { date: "2026-12-24", tables: [["team-drivens", "team-furinkazan", "team-sakuraknights", "team-abemas"], ["team-jets", "team-fightclub", "team-beast", "team-pirates"]] },
  { date: "2026-12-25", tables: [["team-drivens", "team-furinkazan", "team-beast", "team-pirates"], ["team-jets", "team-abemas", "team-phoenix", "team-raiden"]] },
  { date: "2027-01-04", tables: [["team-furinkazan", "team-sakuraknights", "team-fightclub", "team-raiden"]] },
  { date: "2027-01-05", tables: [["team-jets", "team-drivens", "team-abemas", "team-phoenix"]] },
  { date: "2027-01-07", tables: [["team-furinkazan", "team-phoenix", "team-beast", "team-pirates"]] },
  { date: "2027-01-08", tables: [["team-drivens", "team-sakuraknights", "team-fightclub", "team-raiden"]] },
  { date: "2027-01-11", tables: [["team-jets", "team-sakuraknights", "team-raiden", "team-beast"]] },
  { date: "2027-01-12", tables: [["team-furinkazan", "team-fightclub", "team-abemas", "team-pirates"]] },
  { date: "2027-01-14", tables: [["team-drivens", "team-sakuraknights", "team-phoenix", "team-beast"]] },
  { date: "2027-01-15", tables: [["team-abemas", "team-phoenix", "team-raiden", "team-pirates"]] },
  { date: "2027-01-18", tables: [["team-jets", "team-drivens", "team-furinkazan", "team-fightclub"]] },
  { date: "2027-01-19", tables: [["team-fightclub", "team-abemas", "team-phoenix", "team-beast"]] },
  { date: "2027-01-21", tables: [["team-drivens", "team-furinkazan", "team-sakuraknights", "team-pirates"]] },
  { date: "2027-01-22", tables: [["team-jets", "team-furinkazan", "team-fightclub", "team-raiden"]] },
  { date: "2027-01-25", tables: [["team-jets", "team-abemas", "team-beast", "team-pirates"]] },
  { date: "2027-01-26", tables: [["team-drivens", "team-sakuraknights", "team-phoenix", "team-raiden"]] },
  { date: "2027-01-28", tables: [["team-sakuraknights", "team-fightclub", "team-abemas", "team-beast"]] },
  { date: "2027-01-29", tables: [["team-jets", "team-drivens", "team-phoenix", "team-pirates"]] },
  { date: "2027-02-01", tables: [["team-furinkazan", "team-fightclub", "team-raiden", "team-pirates"]] },
  { date: "2027-02-02", tables: [["team-jets", "team-drivens", "team-abemas", "team-raiden"]] },
  { date: "2027-02-04", tables: [["team-furinkazan", "team-sakuraknights", "team-phoenix", "team-beast"]] },
  { date: "2027-02-05", tables: [["team-drivens", "team-sakuraknights", "team-fightclub", "team-phoenix"]] },
  { date: "2027-02-08", tables: [["team-jets", "team-furinkazan", "team-abemas", "team-beast"]] },
  { date: "2027-02-09", tables: [["team-sakuraknights", "team-raiden", "team-beast", "team-pirates"]] },
  { date: "2027-02-11", tables: [["team-jets", "team-drivens", "team-furinkazan", "team-pirates"]] },
  { date: "2027-02-12", tables: [["team-fightclub", "team-abemas", "team-phoenix", "team-raiden"]] },
  { date: "2027-02-15", tables: [["team-jets", "team-sakuraknights", "team-fightclub", "team-beast"]] },
  { date: "2027-02-16", tables: [["team-drivens", "team-furinkazan", "team-abemas", "team-pirates"]] },
  { date: "2027-02-18", tables: [["team-jets", "team-phoenix", "team-raiden", "team-pirates"]] },
  { date: "2027-02-19", tables: [["team-drivens", "team-fightclub", "team-phoenix", "team-beast"]] },
  { date: "2027-02-22", tables: [["team-furinkazan", "team-sakuraknights", "team-abemas", "team-raiden"]] },
  { date: "2027-02-23", tables: [["team-jets", "team-sakuraknights", "team-abemas", "team-pirates"]] },
  { date: "2027-02-25", tables: [["team-drivens", "team-fightclub", "team-raiden", "team-beast"]] },
  { date: "2027-02-26", tables: [["team-jets", "team-furinkazan", "team-fightclub", "team-phoenix"]] },
  { date: "2027-03-01", tables: [["team-sakuraknights", "team-abemas", "team-phoenix", "team-pirates"]] },
  { date: "2027-03-02", tables: [["team-drivens", "team-furinkazan", "team-raiden", "team-beast"]] },
] as const satisfies readonly RegularSeasonMatchDay[];


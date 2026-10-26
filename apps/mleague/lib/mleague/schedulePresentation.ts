import type { RegularSeasonMatchDay, ScheduleTeamId } from "@/data/mleague/regularSeasonSchedule";

const weekdayJa = ["日", "月", "火", "水", "木", "金", "土"] as const;
const weekdayFullJa = ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"] as const;
const weekdayEn = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;

export type UpcomingScheduledMatch = {
  date: string;
  tableIndex: number;
  tableLabel: string;
  matchNumber: number;
  teams: readonly ScheduleTeamId[];
};

export function getScheduleDateLabels(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) throw new RangeError(`対局日付がYYYY-MM-DD形式ではありません: ${value}`);

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const utcDate = new Date(Date.UTC(year, month - 1, day));
  if (
    utcDate.getUTCFullYear() !== year ||
    utcDate.getUTCMonth() !== month - 1 ||
    utcDate.getUTCDate() !== day
  ) {
    throw new RangeError(`対局日付が実在する日付ではありません: ${value}`);
  }

  const weekdayIndex = utcDate.getUTCDay();
  return {
    shortDate: `${month}.${day}`,
    weekdayJa: weekdayJa[weekdayIndex],
    weekdayFullJa: weekdayFullJa[weekdayIndex],
    weekdayEn: weekdayEn[weekdayIndex],
  };
}

export function getUpcomingScheduledMatches(
  schedule: readonly RegularSeasonMatchDay[],
  statsThrough: string,
  completedTablesOnThrough: number,
  totalTablesOnThrough: number,
  limit: number,
  resultsThrough?: string,
): UpcomingScheduledMatch[] {
  if (!Number.isInteger(limit) || limit < 0) {
    throw new RangeError("表示する対局数は0以上の整数で指定してください。");
  }

  let matchNumber = 0;
  const upcoming: UpcomingScheduledMatch[] = [];

  for (const matchDay of schedule) {
    for (const [tableIndex, teams] of matchDay.tables.entries()) {
      matchNumber += 1;
      if (resultsThrough && matchDay.date <= resultsThrough) continue;

      const isAfterLatestStats = matchDay.date > statsThrough;
      const isUnfinishedOnStatsDate =
        matchDay.date === statsThrough &&
        completedTablesOnThrough < totalTablesOnThrough &&
        tableIndex >= completedTablesOnThrough;

      if (!isAfterLatestStats && !isUnfinishedOnStatsDate) continue;

      upcoming.push({
        date: matchDay.date,
        tableIndex,
        tableLabel: `${String.fromCharCode(65 + tableIndex)}卓`,
        matchNumber,
        teams,
      });
    }
  }

  return upcoming.slice(0, limit);
}

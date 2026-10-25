import { describe, expect, it } from "vitest";
import { getScheduleDateLabels, getUpcomingScheduledMatches } from "./schedulePresentation";

describe("M.League schedule presentation", () => {
  it("formats October 26, 2026 as Monday without relying on the host timezone", () => {
    expect(getScheduleDateLabels("2026-10-26")).toEqual({
      shortDate: "10.26",
      weekdayJa: "月",
      weekdayFullJa: "月曜日",
      weekdayEn: "MON",
    });
  });

  it("uses schedule data and completed-results progress for the next tables", () => {
    const schedule = [
      { date: "2026-10-23", tables: [["team-drivens", "team-furinkazan", "team-fightclub", "team-abemas"], ["team-phoenix", "team-raiden", "team-beast", "team-pirates"]] },
      { date: "2026-10-26", tables: [["team-drivens", "team-furinkazan", "team-raiden", "team-pirates"], ["team-jets", "team-sakuraknights", "team-abemas", "team-beast"]] },
    ] as const;

    const matches = getUpcomingScheduledMatches(schedule, "2026-10-23", 2, 2, 2);
    expect(matches.map(({ date, tableLabel, matchNumber, teams }) => ({ date, tableLabel, matchNumber, teams }))).toEqual([
      { date: "2026-10-26", tableLabel: "A卓", matchNumber: 3, teams: schedule[1].tables[0] },
      { date: "2026-10-26", tableLabel: "B卓", matchNumber: 4, teams: schedule[1].tables[1] },
    ]);
  });

  it("skips already completed tables on a partially updated stats date", () => {
    const schedule = [{
      date: "2026-10-26",
      tables: [["team-drivens", "team-furinkazan", "team-raiden", "team-pirates"], ["team-jets", "team-sakuraknights", "team-abemas", "team-beast"]],
    }] as const;

    expect(getUpcomingScheduledMatches(schedule, "2026-10-26", 1, 2, 1)).toMatchObject([
      { tableIndex: 1, tableLabel: "B卓", matchNumber: 2, teams: schedule[0].tables[1] },
    ]);
  });

  it("rejects malformed calendar dates instead of displaying a wrong weekday", () => {
    expect(() => getScheduleDateLabels("2026-02-30")).toThrow(RangeError);
    expect(() => getScheduleDateLabels("2026/10/26")).toThrow(RangeError);
  });
});

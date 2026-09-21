import assert from "node:assert/strict";
import test from "node:test";
import { inferStatsThrough, parseOfficialStats, parsePlayerIdMap } from "./update-mleague-stats.mjs";

function playerSource(names) {
  return names.map((name, index) => `{
    id: "player-${index + 1}",
    displayName: "${name}",
  }`).join("\n");
}

function teamSection(names) {
  const values = {
    "試合数": 1,
    "ポイント": 0,
    "平着": 1,
    "1位": 1,
    "2位": 0,
    "3位": 0,
    "4位": 0,
  };
  const rows = Object.entries(values).map(([label, value]) =>
    `<tr><th scope="row">${label}</th>${names.map(() => `<td>${value}</td>`).join("")}</tr>`,
  ).join("");
  return `<section class="p-stats__team"><table class="p-stats__table"><tr><th scope="row">選手名</th>${names.map((name) => `<th scope="col">${name}</th>`).join("")}</tr>${rows}</table></section>`;
}

test("official regular-season tables are parsed into player IDs", () => {
  const names = Array.from({ length: 40 }, (_, index) => `選手 ${index + 1}`);
  const sections = Array.from({ length: 10 }, (_, index) => teamSection(names.slice(index * 4, index * 4 + 4))).join("");
  const html = `<h1>Stats 2026-27 チーム成績表</h1><div id="panel_1">${sections}</div><div id="panel_2"></div>`;
  const result = parseOfficialStats(html, parsePlayerIdMap(playerSource(names)));
  assert.equal(result.season, "2026-27");
  assert.equal(Object.keys(result.players).length, 40);
  assert.deepEqual(result.players["player-1"], {
    matchesPlayed: 1,
    points: 0,
    averagePlacement: 1,
    firstPlaceCount: 1,
    secondPlaceCount: 0,
    thirdPlaceCount: 0,
    fourthPlaceCount: 0,
  });
});

test("invalid placement totals stop the update", () => {
  const names = Array.from({ length: 40 }, (_, index) => `選手 ${index + 1}`);
  const sections = Array.from({ length: 10 }, (_, index) => teamSection(names.slice(index * 4, index * 4 + 4))).join("");
  const html = `<h1>Stats 2026-27 チーム成績表</h1><div id="panel_1">${sections.replace("<td>1</td>", "<td>2</td>")}</div><div id="panel_2"></div>`;
  assert.throws(() => parseOfficialStats(html, parsePlayerIdMap(playerSource(names))), /試合数と着順合計/);
});

test("latest completed schedule date is inferred from aggregate match count", () => {
  const schedule = `
    { date: "2026-09-14", tables: [["team-a", "team-b", "team-c", "team-d"]] },
    { date: "2026-09-15", tables: [["team-a", "team-b", "team-c", "team-d"]] },
  `;
  assert.equal(inferStatsThrough(schedule, 16), "2026-09-15");
});

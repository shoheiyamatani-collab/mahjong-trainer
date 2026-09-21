import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

export const STATS_URL = "https://m-league.jp/stats/";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = path.join(root, "apps/mleague/data/mleague/currentSeasonStats.json");
const playersPath = path.join(root, "apps/mleague/data/mleague/players.ts");
const schedulePath = path.join(root, "apps/mleague/data/mleague/regularSeasonSchedule.ts");
const requiredRows = ["試合数", "ポイント", "平着", "1位", "2位", "3位", "4位"];

function decodeHtml(value) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#039;|&apos;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeName(value) {
  return value.replace(/[\s\u3000・]/g, "").toLocaleLowerCase("ja");
}

export function parsePlayerIdMap(source) {
  const result = new Map();
  const pattern = /\bid:\s*"(player-[^"]+)"[\s\S]*?\bdisplayName:\s*"([^"]+)"/g;
  for (const match of source.matchAll(pattern)) {
    const key = normalizeName(match[2]);
    if (result.has(key)) throw new Error(`選手名が重複しています: ${match[2]}`);
    result.set(key, match[1]);
  }
  if (result.size < 40) throw new Error(`選手IDの読み込み件数が不足しています: ${result.size}`);
  return result;
}

function extractCells(rowHtml, scope) {
  const pattern = new RegExp(`<th[^>]*scope=["']${scope}["'][^>]*>([\\s\\S]*?)<\\/th>`, "gi");
  return [...rowHtml.matchAll(pattern)].map((match) => decodeHtml(match[1]));
}

function extractDataCells(rowHtml) {
  return [...rowHtml.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((match) => decodeHtml(match[1]));
}

function asNumber(value, label, playerName) {
  const parsed = Number(value.replaceAll(",", ""));
  if (!Number.isFinite(parsed)) throw new Error(`${playerName}の${label}を数値として読めません: ${value}`);
  return parsed;
}

export function parseOfficialStats(html, playerIdMap) {
  const season = html.match(/(\d{4}-\d{2})\s+チーム成績表/i)?.[1];
  if (!season) throw new Error("公式ページからシーズンを判定できませんでした");
  const regularStart = html.indexOf('id="panel_1"');
  const nextPanel = html.indexOf('id="panel_2"', regularStart + 1);
  if (regularStart < 0) throw new Error("レギュラーシーズン表が見つかりませんでした");
  const regularHtml = html.slice(regularStart, nextPanel > regularStart ? nextPanel : undefined);
  const players = {};
  const unknownNames = [];
  const sectionPattern = /<section\s+class="p-stats__team"[\s\S]*?<table\s+class="p-stats__table"[^>]*>([\s\S]*?)<\/table>[\s\S]*?<\/section>/gi;

  for (const section of regularHtml.matchAll(sectionPattern)) {
    const rows = [...section[1].matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].map((match) => match[1]);
    const names = rows.flatMap((row) => extractCells(row, "col"));
    if (names.length === 0) continue;
    const valuesByLabel = new Map();
    for (const row of rows) {
      const label = extractCells(row, "row")[0];
      if (label) valuesByLabel.set(label, extractDataCells(row));
    }
    for (const label of requiredRows) {
      if (valuesByLabel.get(label)?.length !== names.length) throw new Error(`${label}の列数が選手数と一致しません`);
    }

    names.forEach((name, index) => {
      const playerId = playerIdMap.get(normalizeName(name));
      if (!playerId) {
        unknownNames.push(name);
        return;
      }
      if (players[playerId]) throw new Error(`公式成績に選手が重複しています: ${name}`);
      const matchesPlayed = asNumber(valuesByLabel.get("試合数")[index], "試合数", name);
      const averageValue = asNumber(valuesByLabel.get("平着")[index], "平着", name);
      const stat = {
        matchesPlayed,
        points: asNumber(valuesByLabel.get("ポイント")[index], "ポイント", name),
        averagePlacement: matchesPlayed === 0 ? null : averageValue,
        firstPlaceCount: asNumber(valuesByLabel.get("1位")[index], "1位", name),
        secondPlaceCount: asNumber(valuesByLabel.get("2位")[index], "2位", name),
        thirdPlaceCount: asNumber(valuesByLabel.get("3位")[index], "3位", name),
        fourthPlaceCount: asNumber(valuesByLabel.get("4位")[index], "4位", name),
      };
      const placementCount = stat.firstPlaceCount + stat.secondPlaceCount + stat.thirdPlaceCount + stat.fourthPlaceCount;
      if (placementCount !== matchesPlayed) throw new Error(`${name}の試合数と着順合計が一致しません`);
      if (matchesPlayed > 0) {
        const calculatedAverage = (stat.firstPlaceCount + stat.secondPlaceCount * 2 + stat.thirdPlaceCount * 3 + stat.fourthPlaceCount * 4) / matchesPlayed;
        if (Math.abs(calculatedAverage - stat.averagePlacement) > 0.01) throw new Error(`${name}の平均着順が着順回数と一致しません`);
      }
      players[playerId] = stat;
    });
  }

  if (unknownNames.length) throw new Error(`未登録の選手がいます: ${unknownNames.join("、")}`);
  if (Object.keys(players).length !== 40) throw new Error(`公式成績の選手数が40人ではありません: ${Object.keys(players).length}`);
  return { season, players };
}

export function inferStatsThrough(scheduleSource, totalPlayerMatches) {
  let cumulativeMatches = 0;
  let through = null;
  const pattern = /\{\s*date:\s*"(\d{4}-\d{2}-\d{2})",\s*tables:\s*(\[[^\n]+\])\s*\}/g;
  for (const match of scheduleSource.matchAll(pattern)) {
    const teamEntries = [...match[2].matchAll(/"team-[^"]+"/g)].length;
    if (teamEntries % 4 !== 0) throw new Error(`日程のチーム数が不正です: ${match[1]}`);
    cumulativeMatches += (teamEntries / 4) * 8;
    if (cumulativeMatches === totalPlayerMatches) through = match[1];
    if (cumulativeMatches > totalPlayerMatches) break;
  }
  if (!through) throw new Error(`合計${totalPlayerMatches}半荘に対応する対局日を判定できません`);
  return through;
}

function japanDate() {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Tokyo" }).format(new Date());
}

function stableStats(value) {
  return JSON.stringify({ season: value.season, players: value.players });
}

export async function updateStats({ html, write = true } = {}) {
  const [playersSource, scheduleSource, previousText] = await Promise.all([
    fs.readFile(playersPath, "utf8"),
    fs.readFile(schedulePath, "utf8"),
    fs.readFile(outputPath, "utf8"),
  ]);
  const responseHtml = html ?? await fetch(STATS_URL, {
    headers: { "user-agent": "JongfolioStatsUpdater/1.0 (+https://jongfolio.com/)" },
  }).then((response) => {
    if (!response.ok) throw new Error(`公式成績表の取得に失敗しました: HTTP ${response.status}`);
    return response.text();
  });
  const parsed = parseOfficialStats(responseHtml, parsePlayerIdMap(playersSource));
  const previous = JSON.parse(previousText);
  const totalPlayerMatches = Object.values(parsed.players).reduce((sum, stat) => sum + stat.matchesPlayed, 0);
  const changed = stableStats(previous) !== stableStats(parsed);
  const next = changed ? {
    season: parsed.season,
    verifiedAt: japanDate(),
    through: inferStatsThrough(scheduleSource, totalPlayerMatches),
    sourceUrl: STATS_URL,
    players: parsed.players,
  } : previous;
  if (changed && write) await fs.writeFile(outputPath, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  return { changed, playerCount: Object.keys(parsed.players).length, totalPlayerMatches, data: next };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await updateStats({ write: !process.argv.includes("--check") });
  console.log(JSON.stringify({ changed: result.changed, playerCount: result.playerCount, totalPlayerMatches: result.totalPlayerMatches, through: result.data.through }));
}

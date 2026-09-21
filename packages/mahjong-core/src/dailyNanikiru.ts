import { analyzeDiscards, type DiscardAnalysis } from "./analyzer";
import { isObviousIsolatedTile, middleTileRatio, scoreComplexShape } from "./ukeireMax";
import {
  countsToTiles,
  parseHand,
  tileIndex,
  type Counts34,
  type Tile,
  validateCounts,
} from "./tiles";

const TOKYO_OFFSET_MS = 9 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const CANDIDATE_COUNT = 4;
const MAX_CANDIDATE_ATTEMPTS = 20;

// Existing, verified iishanten shapes are transformed by suit and rank symmetry.
// These transformations preserve shanten and ukeire while providing a broad daily pool.
const DAILY_BASE_HANDS = [
  "1223678m3455p899s",
  "456789m126667p35s",
  "5m3333678p455678s",
  "22266679m444457s",
  "24556678m233678p",
  "2333567m4589p456s",
  "111334m7899p3666s",
  "3m4446789p222334s",
  "7m134556788p2234s",
  "467778m223p23678s",
  "5567789m115p1345s",
  "155678m3458889p3s",
  "55999m4557p34567s",
  "13357899m567p678s",
  "234m25p333667899s",
  "5789m224455668p7s",
  "13555m124567p123s",
  "77m223444579p789s",
  "455m34567p112223s",
  "566m3455p1113334s",
  "66m67899p1234556s",
  "23m788p234566678s",
  "2333m2334468p345s",
  "44m23456p1334789s",
  "255567888m44s777s",
  "4m2345667p578999s",
  "56m44455677p6789s",
  "1235m445677p4556s",
  "456788p23355578s",
  "7889m789p3455899s",
  "5677m12378p12378s",
  "55679m234778p789s",
  "3334m455679p3455s",
] as const;

const SUIT_PERMUTATIONS = [
  [0, 1, 2],
  [0, 2, 1],
  [1, 0, 2],
  [1, 2, 0],
  [2, 0, 1],
  [2, 1, 0],
] as const;

export interface DailyNanikiruChoice {
  discard: Tile;
  afterDiscardShanten: number;
  ukeire: Tile[];
  ukeireTypes: number;
  ukeireTiles: number;
  isBest: boolean;
}

export interface DailyNanikiruQuality {
  accepted: boolean;
  score: number;
  nearBestCandidateCount: number;
  bestToNextGap: number;
  complexShapeScore: number;
  middleTileRatio: number;
}

export interface DailyNanikiruProblem {
  date: string;
  seed: number;
  hand: Tile[];
  counts: Counts34;
  handKey: string;
  shanten: number;
  choices: DailyNanikiruChoice[];
  bestDiscards: Tile[];
  bestUkeire: Tile[];
  bestUkeireTypes: number;
  bestUkeireTiles: number;
  nextBestUkeireTiles: number;
  explanation: string;
  checkerPath: string;
  quality: DailyNanikiruQuality;
}

interface EvaluatedCandidate {
  counts: Counts34;
  ranking: DiscardAnalysis[];
  best: DiscardAnalysis[];
  nextBest: DiscardAnalysis;
  quality: DailyNanikiruQuality;
}

export function generateDailyNanikiru(date: string): DailyNanikiruProblem {
  assertDateKey(date);
  const seed = seedFromText(date);
  const rng = createSeededRandom(date);
  const candidates: EvaluatedCandidate[] = [];
  const seenHands = new Set<string>();

  for (let attempt = 0; attempt < MAX_CANDIDATE_ATTEMPTS && candidates.length < CANDIDATE_COUNT; attempt += 1) {
    const base = parseHand(DAILY_BASE_HANDS[Math.floor(rng() * DAILY_BASE_HANDS.length)]!);
    const permutation = SUIT_PERMUTATIONS[Math.floor(rng() * SUIT_PERMUTATIONS.length)]!;
    const mirrorMask = Math.floor(rng() * 8);
    const counts = transformNumberHand(base, permutation, mirrorMask);
    const handKey = counts.join(",");
    if (seenHands.has(handKey)) continue;
    seenHands.add(handKey);

    const evaluated = evaluateCandidate(counts);
    if (evaluated.quality.accepted) candidates.push(evaluated);
  }

  if (candidates.length === 0) {
    const fallback = evaluateCandidate(parseHand("24556678m233678p"));
    if (!fallback.quality.accepted) {
      throw new Error("Daily nani-kiru fallback did not pass quality validation.");
    }
    candidates.push(fallback);
  }

  candidates.sort((left, right) => right.quality.score - left.quality.score || left.counts.join("").localeCompare(right.counts.join("")));
  const topScore = candidates[0]!.quality.score;
  const qualityPool = candidates.filter((candidate) => candidate.quality.score >= topScore - 18);
  const selected = qualityPool[Math.floor(rng() * qualityPool.length)]!;
  return serializeProblem(date, seed, selected);
}

export function japanDate(value = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(value);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function millisecondsUntilNextJapanDate(value = new Date()): number {
  const shifted = value.getTime() + TOKYO_OFFSET_MS;
  const nextBoundary = (Math.floor(shifted / DAY_MS) + 1) * DAY_MS - TOKYO_OFFSET_MS;
  return Math.max(1, nextBoundary - value.getTime());
}

export function createSeededRandom(seedText: string): () => number {
  let state = seedFromText(seedText);
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

export function isDailyNanikiruCorrect(problem: DailyNanikiruProblem, discard: Tile): boolean {
  return problem.bestDiscards.includes(discard);
}

export function bestDailyDiscards(results: DiscardAnalysis[]): DiscardAnalysis[] {
  if (results.length === 0) return [];
  const bestShanten = Math.min(...results.map((result) => result.afterDiscardShanten));
  const eligible = results.filter((result) => result.afterDiscardShanten === bestShanten);
  const bestUkeire = Math.max(...eligible.map((result) => result.ukeireTiles));
  return eligible.filter((result) => result.ukeireTiles === bestUkeire);
}

export function dailyTileDisplay(tile: Tile): string {
  if (tile.endsWith("m")) return `${tile[0]}萬`;
  if (tile.endsWith("p")) return `${tile[0]}筒`;
  if (tile.endsWith("s")) return `${tile[0]}索`;
  return tile;
}

function evaluateCandidate(counts: Counts34): EvaluatedCandidate {
  validateCounts(counts, 14);
  const results = analyzeDiscards(counts, { includeTenpaiDetails: false });
  const best = bestDailyDiscards(results);
  const bestShanten = best[0]?.afterDiscardShanten ?? 99;
  const ranking = results
    .filter((result) => result.afterDiscardShanten === bestShanten)
    .slice()
    .sort((left, right) => right.ukeireTiles - left.ukeireTiles || right.ukeireTypes - left.ukeireTypes || tileIndex(left.discard) - tileIndex(right.discard));
  const bestTiles = ranking[0]?.ukeireTiles ?? 0;
  const nextBest = ranking.find((result) => result.ukeireTiles < bestTiles) ?? ranking[best.length] ?? ranking[0];
  if (!nextBest) throw new Error("Daily nani-kiru candidate has no discard analysis.");

  const gap = Math.max(0, bestTiles - nextBest.ukeireTiles);
  const nearBestCandidateCount = ranking.filter((result) => bestTiles - result.ukeireTiles <= 10).length;
  const complexShapeScore = scoreComplexShape(counts);
  const middleRatio = middleTileRatio(counts);
  const bestTypes = Math.max(0, ...best.map((result) => result.ukeireTypes));
  const obviousOnly = best.length > 0 && best.every((result) => isObviousIsolatedTile(result.discard, counts));
  const accepted = bestShanten === 1
    && best.length >= 1
    && best.length <= 3
    && bestTypes >= 5
    && bestTiles >= 16
    && gap >= 1
    && gap <= 10
    && nearBestCandidateCount >= 3
    && complexShapeScore >= 2
    && middleRatio >= 0.4
    && !obviousOnly;
  const gapScore = Math.max(0, 10 - Math.abs(gap - 4) * 2);
  const score = (accepted ? 100 : 0)
    + Math.min(nearBestCandidateCount, 6) * 4
    + Math.min(complexShapeScore, 12) * 2
    + Math.round(middleRatio * 12)
    + Math.min(bestTypes, 12)
    + gapScore
    - Math.max(0, best.length - 1) * 2;

  return {
    counts,
    ranking,
    best,
    nextBest,
    quality: {
      accepted,
      score,
      nearBestCandidateCount,
      bestToNextGap: gap,
      complexShapeScore,
      middleTileRatio: middleRatio,
    },
  };
}

function serializeProblem(date: string, seed: number, candidate: EvaluatedCandidate): DailyNanikiruProblem {
  const bestResult = candidate.best[0]!;
  const bestDiscards = candidate.best.map((result) => result.discard).sort((left, right) => tileIndex(left) - tileIndex(right));
  const bestLabels = bestDiscards.map(dailyTileDisplay).join("・");
  const nextLabel = dailyTileDisplay(candidate.nextBest.discard);
  const answerLead = bestDiscards.length === 1 ? `正解は${bestLabels}。` : `正解は${bestLabels}の${bestDiscards.length}通り。`;
  const explanation = `${answerLead}受け入れは${bestResult.ukeireTypes}種${bestResult.ukeireTiles}枚です。次善の${nextLabel}切りより${candidate.quality.bestToNextGap}枚広く、シャンテン数を悪化させません。`;
  const counts = candidate.counts.slice();
  const checkerPath = `/analysis/mahjong-tool?hand=${encodeURIComponent(counts.join(","))}&autoRun=1#analysis-results`;

  return {
    date,
    seed,
    hand: countsToTiles(counts),
    counts,
    handKey: counts.join(","),
    shanten: bestResult.afterDiscardShanten,
    choices: candidate.ranking.slice(0, 3).map((result) => ({
      discard: result.discard,
      afterDiscardShanten: result.afterDiscardShanten,
      ukeire: result.ukeire.slice(),
      ukeireTypes: result.ukeireTypes,
      ukeireTiles: result.ukeireTiles,
      isBest: bestDiscards.includes(result.discard),
    })),
    bestDiscards,
    bestUkeire: bestResult.ukeire.slice(),
    bestUkeireTypes: bestResult.ukeireTypes,
    bestUkeireTiles: bestResult.ukeireTiles,
    nextBestUkeireTiles: candidate.nextBest.ukeireTiles,
    explanation,
    checkerPath,
    quality: candidate.quality,
  };
}

function transformNumberHand(
  counts: Counts34,
  suitPermutation: readonly [number, number, number],
  mirrorMask: number,
): Counts34 {
  const transformed = Array(34).fill(0);
  for (let sourceSuit = 0; sourceSuit < 3; sourceSuit += 1) {
    const targetSuit = suitPermutation[sourceSuit]!;
    const mirrored = (mirrorMask & (1 << sourceSuit)) !== 0;
    for (let rank = 0; rank < 9; rank += 1) {
      const targetRank = mirrored ? 8 - rank : rank;
      transformed[targetSuit * 9 + targetRank] = counts[sourceSuit * 9 + rank]!;
    }
  }
  for (let index = 27; index < 34; index += 1) transformed[index] = counts[index]!;
  validateCounts(transformed, 14);
  return transformed;
}

function seedFromText(value: string): number {
  let state = 2166136261;
  for (const char of value) {
    state ^= char.codePointAt(0) ?? 0;
    state = Math.imul(state, 16777619);
  }
  return state >>> 0;
}

function assertDateKey(value: string): void {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) throw new Error(`Invalid daily nani-kiru date: ${value}`);
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  if (parsed.getUTCFullYear() !== year || parsed.getUTCMonth() !== month - 1 || parsed.getUTCDate() !== day) {
    throw new Error(`Invalid daily nani-kiru date: ${value}`);
  }
}

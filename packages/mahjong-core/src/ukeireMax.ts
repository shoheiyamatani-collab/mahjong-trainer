import { analyzeDiscards, bestDiscardsForReview, type DiscardAnalysis } from "./analyzer";
import { type Counts34, type Tile, countsToTiles, parseHand, tileIndex, validateCounts } from "./tiles";

const NUMBER_TILE_COUNT = 27;
const MIN_BEST_UKEIRE_TYPES = 6;

const UKEIRE_MAX_SEEDS = [
  "1223678m3455p899s",
  "456789m126667p35s",
  "5m3333678p455678s",
  "22266679m444457s",
  "117m4555p677899s",
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
  "455m34567p112223s"
];

export interface UkeireMaxQuestion {
  counts: Counts34;
  results: DiscardAnalysis[];
  bestDiscards: Tile[];
  bestUkeireTypes: number;
  bestUkeireTiles: number;
}

export type UkeireMaxAnswerState = "correct" | "partial" | "wrong";

export function buildUkeireMaxQuestion(counts: Counts34): UkeireMaxQuestion | null {
  validateCounts(counts, 14);
  if (hasHonors(counts)) return null;

  const results = analyzeDiscards(counts).filter((result) => result.afterDiscardShanten === 1);
  if (results.length === 0) return null;

  const bestResults = bestDiscardsForReview(results);
  if (bestResults.length === 0) return null;

  const bestUkeireTypes = Math.max(...bestResults.map((result) => result.ukeireTypes));
  const bestUkeireTiles = Math.max(...bestResults.map((result) => result.ukeireTiles));
  if (bestUkeireTypes < MIN_BEST_UKEIRE_TYPES) return null;

  return {
    counts,
    results,
    bestDiscards: bestResults.map((result) => result.discard),
    bestUkeireTypes,
    bestUkeireTiles
  };
}

export function generateUkeireMaxQuestion(rng: () => number = Math.random, maxAttempts = 200): UkeireMaxQuestion {
  const seeds = shuffledSeeds(rng);
  for (const seed of seeds) {
    const question = buildUkeireMaxQuestion(parseHand(seed));
    if (question) return question;
  }

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const question = buildUkeireMaxQuestion(randomNumberHand(rng));
    if (question) return question;
  }

  const fallback = buildUkeireMaxQuestion(parseHand("1455m2345677p678s"));
  if (!fallback) {
    throw new Error("No Ukeire MAX question could be generated.");
  }
  return fallback;
}

export function evaluateUkeireMaxAnswer(question: UkeireMaxQuestion, selected: Tile[]): UkeireMaxAnswerState {
  const answer = normalizeSelection(selected);
  const best = normalizeSelection(question.bestDiscards);
  if (answer.length === best.length && answer.every((tile) => best.includes(tile))) {
    return "correct";
  }
  if (answer.length > 0 && answer.length < best.length && answer.every((tile) => best.includes(tile))) {
    return "partial";
  }
  return "wrong";
}

export function toggleUkeireMaxSelection(selected: Tile[], tile: Tile): Tile[] {
  if (selected.includes(tile)) {
    return selected.filter((selectedTile) => selectedTile !== tile);
  }
  return [...selected, tile];
}

function normalizeSelection(tiles: Tile[]): Tile[] {
  return [...new Set(tiles)].sort((a, b) => tileIndex(a) - tileIndex(b));
}

function hasHonors(counts: Counts34): boolean {
  return counts.slice(NUMBER_TILE_COUNT).some((count) => count > 0);
}

function randomNumberHand(rng: () => number): Counts34 {
  const counts = Array(34).fill(0);
  while (countsToTiles(counts).length < 14) {
    const index = Math.floor(rng() * NUMBER_TILE_COUNT);
    if (counts[index] >= 4) continue;
    counts[index] += 1;
  }
  return counts;
}

function shuffledSeeds(rng: () => number): string[] {
  const seeds = UKEIRE_MAX_SEEDS.slice();
  for (let i = seeds.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [seeds[i], seeds[j]] = [seeds[j]!, seeds[i]!];
  }
  return seeds;
}

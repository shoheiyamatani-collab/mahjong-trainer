import { normalShanten } from "./shanten";
import { SUITS, type Counts34, type Suit, type Tile, tileName } from "./tiles";

export type ChinitsuCounts = number[];
export type ChinitsuSuit = Suit;

export interface ChinitsuWaitQuestion {
  counts: ChinitsuCounts;
  suit: ChinitsuSuit;
  waits: number[];
  remainingTiles: Record<number, number>;
}

export function parseChinitsuHand(text: string, expectedTotal?: number): ChinitsuCounts {
  const counts = Array(9).fill(0);
  for (const char of text.trim()) {
    if (/\s/.test(char) || [",", "、", "，", "/", "|"].includes(char)) continue;
    if (char < "1" || char > "9") {
      throw new Error(`Chinitsu hands must use only ranks 1-9: ${char}`);
    }
    const index = Number(char) - 1;
    counts[index] += 1;
    if (counts[index] > 4) {
      throw new Error(`A rank appears more than four times: ${char}`);
    }
  }
  validateChinitsuCounts(counts, expectedTotal);
  return counts;
}

export function validateChinitsuCounts(counts: ChinitsuCounts, expectedTotal?: number): void {
  if (counts.length !== 9) {
    throw new Error("A chinitsu hand must use 9 rank counts.");
  }
  counts.forEach((count, index) => {
    if (count < 0) {
      throw new Error("Rank counts cannot be negative.");
    }
    if (count > 4) {
      throw new Error(`A rank appears more than four times: ${index + 1}`);
    }
  });
  if (expectedTotal != null && sumChinitsuCounts(counts) !== expectedTotal) {
    throw new Error(`Expected ${expectedTotal} tiles, got ${sumChinitsuCounts(counts)}.`);
  }
}

export function chinitsuRanks(counts: ChinitsuCounts): number[] {
  validateChinitsuCounts(counts);
  const ranks: number[] = [];
  counts.forEach((count, index) => {
    for (let i = 0; i < count; i += 1) {
      ranks.push(index + 1);
    }
  });
  return ranks;
}

export function chinitsuTiles(counts: ChinitsuCounts, suit: ChinitsuSuit): Tile[] {
  return chinitsuRanks(counts).map((rank) => chinitsuTile(rank, suit));
}

export function chinitsuTile(rank: number, suit: ChinitsuSuit): Tile {
  if (rank < 1 || rank > 9) {
    throw new Error("rank must be between 1 and 9.");
  }
  return `${rank}${suit}` as Tile;
}

export function findChinitsuWaits13(counts: ChinitsuCounts): number[] {
  validateChinitsuCounts(counts, 13);
  const waits: number[] = [];
  counts.forEach((count, index) => {
    if (count >= 4) return;
    const drawn = counts.slice();
    drawn[index] += 1;
    if (isChinitsuWin(drawn)) {
      waits.push(index + 1);
    }
  });
  return waits;
}

export function isChinitsuWin(counts: ChinitsuCounts): boolean {
  validateChinitsuCounts(counts, 14);
  if (isChinitsuChiitoitsu(counts)) return true;
  return normalShanten(to34Counts(counts, "m")) === -1;
}

export function isChinitsuChiitoitsu(counts: ChinitsuCounts): boolean {
  validateChinitsuCounts(counts, 14);
  return counts.filter((count) => count === 2).length === 7;
}

export function remainingTilesForChinitsuWaits(counts: ChinitsuCounts, waits: number[]): Record<number, number> {
  validateChinitsuCounts(counts, 13);
  const remaining: Record<number, number> = {};
  for (const rank of waits) {
    if (rank < 1 || rank > 9) {
      throw new Error("wait ranks must be between 1 and 9.");
    }
    const left = 4 - counts[rank - 1]!;
    if (left <= 0) {
      throw new Error(`rank ${rank} has no remaining tiles.`);
    }
    remaining[rank] = left;
  }
  return remaining;
}

export function generateChinitsuWaitQuestion(
  rng: () => number = Math.random,
  suit: ChinitsuSuit = randomChinitsuSuit(rng),
  recentHands: string[] = [],
  maxAttempts = 10000
): ChinitsuWaitQuestion {
  let fallback: ChinitsuWaitQuestion | null = null;
  const recent = new Set(recentHands);
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const counts = generateChinitsuCounts(rng);
    const waits = findChinitsuWaits13(counts);
    if (waits.length === 0) continue;

    const question = {
      counts,
      suit,
      waits,
      remainingTiles: remainingTilesForChinitsuWaits(counts, waits)
    };
    if (!fallback) fallback = question;
    if (!recent.has(chinitsuHandKey(counts))) return question;
  }
  if (fallback) return fallback;
  throw new Error("Could not generate a valid chinitsu wait question.");
}

export function evaluateChinitsuWaitAnswer(correctWaits: number[], answer: number[]): boolean {
  return normalizeRanks(correctWaits).join(",") === normalizeRanks(answer).join(",");
}

export function toggleChinitsuRankSelection(selected: number[], rank: number): number[] {
  if (selected.includes(rank)) {
    return selected.filter((selectedRank) => selectedRank !== rank);
  }
  return normalizeRanks([...selected, rank]);
}

export function chinitsuHandKey(counts: ChinitsuCounts): string {
  return chinitsuRanks(counts).join("");
}

export function nextChinitsuSuit(suit: ChinitsuSuit): ChinitsuSuit {
  if (suit === "m") return "p";
  if (suit === "p") return "s";
  return "m";
}

function generateChinitsuCounts(rng: () => number): ChinitsuCounts {
  const wall = Array.from({ length: 36 }, (_, index) => (index % 9) + 1);
  const counts = Array(9).fill(0);
  for (let draw = 0; draw < 13; draw += 1) {
    const wallIndex = Math.floor(rng() * wall.length);
    const [rank] = wall.splice(wallIndex, 1);
    counts[rank! - 1] += 1;
  }
  validateChinitsuCounts(counts, 13);
  return counts;
}

function to34Counts(counts: ChinitsuCounts, suit: ChinitsuSuit): Counts34 {
  validateChinitsuCounts(counts);
  const result = Array(34).fill(0);
  const suitOffset = SUITS.indexOf(suit) * 9;
  counts.forEach((count, index) => {
    result[suitOffset + index] = count;
  });
  // Keep the type tied to the shared tile list and catch accidental offset drift.
  tileName(suitOffset);
  return result;
}

function randomChinitsuSuit(rng: () => number): ChinitsuSuit {
  return SUITS[Math.floor(rng() * SUITS.length)]!;
}

function normalizeRanks(ranks: number[]): number[] {
  return [...new Set(ranks)].sort((a, b) => a - b);
}

function sumChinitsuCounts(counts: ChinitsuCounts): number {
  return counts.reduce((sum, count) => sum + count, 0);
}

import type { Counts34 } from "./tiles";
import { LruCache, incrementSimulationCounter } from "./performance";

const blockCache = new LruCache<string, readonly number[]>(50_000);
const shantenCache = new LruCache<string, number>(50_000);
const LOCAL_TAATSU_BASE = 8;
const COMBINED_TAATSU_BASE = 16;

export function normalShanten(counts: Counts34): number {
  return normalShantenWithOpenMelds(counts, 0);
}

export function normalShantenWithOpenMelds(counts: Counts34, openMeldCount: number): number {
  if (counts.length !== 34) {
    throw new Error("normalShantenWithOpenMelds expects 34 tile counts.");
  }
  if (!Number.isInteger(openMeldCount) || openMeldCount < 0 || openMeldCount > 4) {
    throw new Error("openMeldCount must be an integer from 0 to 4.");
  }
  const cacheKey = `${openMeldCount}|${counts.join(",")}`;
  const cached = shantenCache.get(cacheKey);
  if (cached != null) return cached;
  incrementSimulationCounter("shantenCalculationCount");

  let best = 8 - openMeldCount * 2;
  const pairOptions: Array<number | null> = [null];
  counts.forEach((count, index) => {
    if (count >= 2) pairOptions.push(index);
  });

  for (const pairIndex of pairOptions) {
    const working = counts.slice();
    let hasPair = 0;
    if (pairIndex != null) {
      working[pairIndex] -= 2;
      hasPair = 1;
    }

    for (const option of blockOptions(working)) {
      const melds = option >> 4;
      const taatsu = option & 15;
      const totalMelds = melds + openMeldCount;
      if (totalMelds > 4) continue;
      const cappedTaatsu = Math.min(taatsu, 4 - totalMelds);
      best = Math.min(best, 8 - 2 * totalMelds - cappedTaatsu - hasPair);
    }
  }

  shantenCache.set(cacheKey, best);
  return best;
}

function blockOptions(counts: Counts34): readonly number[] {
  let combined: readonly number[] = [0];
  for (const [start, length, allowSequences] of [
    [0, 9, true],
    [9, 9, true],
    [18, 9, true],
    [27, 7, false],
  ] as const) {
    const local = localBlockOptions(counts.slice(start, start + length), allowSequences);
    const next = new Set<number>();
    for (const current of combined) {
      const currentMelds = current >> 4;
      const currentTaatsu = current & 15;
      for (const option of local) {
        const melds = currentMelds + (option >> 3);
        const taatsu = currentTaatsu + (option & 7);
        next.add(melds * COMBINED_TAATSU_BASE + taatsu);
      }
    }
    combined = [...next];
  }
  return combined;
}

function localBlockOptions(counts: number[], allowSequences: boolean): readonly number[] {
  const key = `${allowSequences ? "s" : "h"}${encodeBaseFive(counts)}`;
  const cached = blockCache.get(key);
  if (cached) return cached;
  const first = counts.findIndex((count) => count > 0);
  if (first < 0) {
    const empty = [0] as const;
    blockCache.set(key, empty);
    return empty;
  }

  const results = new Set<number>();
  const addBranch = (nextCounts: number[], meldDelta = 0, taatsuDelta = 0) => {
    for (const option of localBlockOptions(nextCounts, allowSequences)) {
      results.add(
        ((option >> 3) + meldDelta) * LOCAL_TAATSU_BASE
          + (option & 7)
          + taatsuDelta,
      );
    }
  };

  const skipped = counts.slice();
  skipped[first] -= 1;
  addBranch(skipped);

  if (counts[first]! >= 3) {
    const triplet = counts.slice();
    triplet[first] -= 3;
    addBranch(triplet, 1);
  }

  if (allowSequences && first <= 6 && counts[first + 1]! > 0 && counts[first + 2]! > 0) {
    const sequence = counts.slice();
    sequence[first] -= 1;
    sequence[first + 1] -= 1;
    sequence[first + 2] -= 1;
    addBranch(sequence, 1);
  }

  if (counts[first]! >= 2) {
    const pairTaatsu = counts.slice();
    pairTaatsu[first] -= 2;
    addBranch(pairTaatsu, 0, 1);
  }

  if (allowSequences && first <= 7 && counts[first + 1]! > 0) {
    const adjacent = counts.slice();
    adjacent[first] -= 1;
    adjacent[first + 1] -= 1;
    addBranch(adjacent, 0, 1);
  }

  if (allowSequences && first <= 6 && counts[first + 2]! > 0) {
    const closedWait = counts.slice();
    closedWait[first] -= 1;
    closedWait[first + 2] -= 1;
    addBranch(closedWait, 0, 1);
  }

  const result = [...results];
  blockCache.set(key, result);
  return result;
}

function encodeBaseFive(counts: readonly number[]): number {
  let encoded = 0;
  for (const count of counts) encoded = encoded * 5 + count;
  return encoded;
}

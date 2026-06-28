import type { Counts34 } from "./tiles";

const blockCache = new Map<string, Set<string>>();

export function normalShanten(counts: Counts34): number {
  if (counts.length !== 34) {
    throw new Error("normalShanten expects 34 tile counts.");
  }

  let best = 8;
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
      const [melds, taatsu] = option.split(",").map(Number) as [number, number];
      const cappedTaatsu = Math.min(taatsu, 4 - melds);
      best = Math.min(best, 8 - 2 * melds - cappedTaatsu - hasPair);
    }
  }

  return best;
}

function blockOptions(counts: Counts34): Set<string> {
  const key = counts.join(",");
  const cached = blockCache.get(key);
  if (cached) return cached;

  const first = counts.findIndex((count) => count > 0);
  if (first < 0) {
    const result = new Set(["0,0"]);
    blockCache.set(key, result);
    return result;
  }

  const results = new Set<string>();
  const addBranch = (nextCounts: Counts34, meldDelta = 0, taatsuDelta = 0) => {
    for (const option of blockOptions(nextCounts)) {
      const [melds, taatsu] = option.split(",").map(Number) as [number, number];
      results.add(`${melds + meldDelta},${taatsu + taatsuDelta}`);
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

  if (canStartSequence(first) && counts[first + 1]! > 0 && counts[first + 2]! > 0) {
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

  if (canConnect(first, 1) && counts[first + 1]! > 0) {
    const adjacent = counts.slice();
    adjacent[first] -= 1;
    adjacent[first + 1] -= 1;
    addBranch(adjacent, 0, 1);
  }

  if (canConnect(first, 2) && counts[first + 2]! > 0) {
    const closedWait = counts.slice();
    closedWait[first] -= 1;
    closedWait[first + 2] -= 1;
    addBranch(closedWait, 0, 1);
  }

  blockCache.set(key, results);
  return results;
}

function canStartSequence(index: number): boolean {
  return index < 27 && index % 9 <= 6;
}

function canConnect(index: number, distance: number): boolean {
  return index < 27 && Math.floor(index / 9) === Math.floor((index + distance) / 9) && (index % 9) + distance <= 8;
}

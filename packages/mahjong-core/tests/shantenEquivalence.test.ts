import { describe, expect, it } from "vitest";

import { normalShantenWithOpenMelds, type Counts34 } from "../src";

describe("factorized normal shanten", () => {
  it("matches the previous whole-hand decomposition on deterministic random hands", () => {
    let state = 0x20260723;
    const random = () => {
      state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
      return state / 0x1_0000_0000;
    };

    for (let sample = 0; sample < 180; sample += 1) {
      const openMeldCount = sample % 5;
      const tileCount = Math.max(1, 14 - openMeldCount * 3 - (sample % 2));
      const counts: Counts34 = Array(34).fill(0);
      while (counts.reduce((sum, count) => sum + count, 0) < tileCount) {
        const index = Math.floor(random() * 34);
        if (counts[index]! < 4) counts[index] += 1;
      }
      expect(normalShantenWithOpenMelds(counts, openMeldCount)).toBe(referenceShanten(counts, openMeldCount));
    }
  });
});

function referenceShanten(counts: Counts34, openMeldCount: number): number {
  let best = 8 - openMeldCount * 2;
  const pairOptions: Array<number | null> = [null];
  counts.forEach((count, index) => {
    if (count >= 2) pairOptions.push(index);
  });
  for (const pairIndex of pairOptions) {
    const working = counts.slice();
    const hasPair = pairIndex == null ? 0 : 1;
    if (pairIndex != null) working[pairIndex] -= 2;
    for (const option of referenceBlockOptions(working)) {
      const [melds, taatsu] = option.split(",").map(Number) as [number, number];
      const totalMelds = melds + openMeldCount;
      if (totalMelds > 4) continue;
      best = Math.min(best, 8 - 2 * totalMelds - Math.min(taatsu, 4 - totalMelds) - hasPair);
    }
  }
  return best;
}

function referenceBlockOptions(counts: Counts34): Set<string> {
  const first = counts.findIndex((count) => count > 0);
  if (first < 0) return new Set(["0,0"]);
  const results = new Set<string>();
  const add = (next: Counts34, meldDelta = 0, taatsuDelta = 0) => {
    for (const option of referenceBlockOptions(next)) {
      const [melds, taatsu] = option.split(",").map(Number) as [number, number];
      results.add(`${melds + meldDelta},${taatsu + taatsuDelta}`);
    }
  };
  const skipped = counts.slice();
  skipped[first] -= 1;
  add(skipped);
  if (counts[first]! >= 3) {
    const next = counts.slice();
    next[first] -= 3;
    add(next, 1);
  }
  if (first < 27 && first % 9 <= 6 && counts[first + 1]! > 0 && counts[first + 2]! > 0) {
    const next = counts.slice();
    next[first] -= 1;
    next[first + 1] -= 1;
    next[first + 2] -= 1;
    add(next, 1);
  }
  if (counts[first]! >= 2) {
    const next = counts.slice();
    next[first] -= 2;
    add(next, 0, 1);
  }
  for (const distance of [1, 2]) {
    if (first >= 27 || Math.floor(first / 9) !== Math.floor((first + distance) / 9) || first % 9 + distance > 8 || counts[first + distance]! <= 0) continue;
    const next = counts.slice();
    next[first] -= 1;
    next[first + distance] -= 1;
    add(next, 0, 1);
  }
  return results;
}

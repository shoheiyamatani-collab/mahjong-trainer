import { normalShantenWithOpenMelds } from "./shanten";
import { chiitoitsuShanten } from "./chiitoitsu";
import { kokushiShantenForStrategy } from "./recommendation/features";
import { tileName, type Counts34 } from "./tiles";

export function handProgressShanten(counts: Counts34, openMeldCount = 0): number {
  const normal = normalShantenWithOpenMelds(counts, openMeldCount);
  return openMeldCount ? normal : Math.min(normal, chiitoitsuShanten(counts), kokushiShantenForStrategy(counts));
}

/** Known counts include the concealed hand, exposed melds and all visible tiles, without duplicates. */
export function analyzeHandProgress(counts: Counts34, openMeldCount = 0, knownCounts: Counts34 = counts) {
  const shanten = handProgressShanten(counts, openMeldCount);
  const ukeire: Array<{ tile: ReturnType<typeof tileName>; remaining: number }> = [];
  const waits: ReturnType<typeof tileName>[] = [];
  if (counts.reduce((sum, count) => sum + count, 0) + openMeldCount * 3 === 13) {
    for (let index = 0; index < 34; index += 1) {
      if (counts[index]! >= 4) continue;
      const drawn = counts.slice();
      drawn[index] += 1;
      const progress = handProgressShanten(drawn, openMeldCount);
      if (progress === -1) waits.push(tileName(index));
      if (progress < shanten && knownCounts[index]! < 4) ukeire.push({ tile: tileName(index), remaining: 4 - knownCounts[index]! });
    }
  }
  return { shanten, waits, ukeire, ukeireCount: ukeire.reduce((sum, item) => sum + item.remaining, 0) };
}

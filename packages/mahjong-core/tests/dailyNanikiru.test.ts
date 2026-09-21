import { describe, expect, it } from "vitest";
import {
  analyzeDiscards,
  bestDailyDiscards,
  generateDailyNanikiru,
  isDailyNanikiruCorrect,
  japanDate,
  millisecondsUntilNextJapanDate,
  parseHand,
  sumCounts,
  type Tile,
} from "../src";

describe("daily nani-kiru", () => {
  it("returns the same serializable problem for the same date", () => {
    const first = generateDailyNanikiru("2026-09-21");
    const second = generateDailyNanikiru("2026-09-21");

    expect(second).toEqual(first);
    expect(() => JSON.stringify(first)).not.toThrow();
  });

  it("changes the problem on the following day", () => {
    const first = generateDailyNanikiru("2026-09-21");
    const second = generateDailyNanikiru("2026-09-22");

    expect(second.handKey).not.toBe(first.handKey);
  });

  it("uses the Asia/Tokyo date boundary", () => {
    expect(japanDate(new Date("2026-09-20T14:59:59.999Z"))).toBe("2026-09-20");
    expect(japanDate(new Date("2026-09-20T15:00:00.000Z"))).toBe("2026-09-21");
    expect(millisecondsUntilNextJapanDate(new Date("2026-09-20T14:59:59.000Z"))).toBe(1000);
  });

  it("keeps all maximum-ukeire tied discards as correct answers", () => {
    const tied = bestDailyDiscards(analyzeDiscards(parseHand("56m44455677p6789s")));
    const generated = generateDailyNanikiru("2026-09-21");
    const problem = { ...generated, bestDiscards: tied.map((result) => result.discard) };

    expect(tied.map((result) => result.discard).sort()).toEqual(["6s", "9s"]);
    expect(isDailyNanikiruCorrect(problem, "6s")).toBe(true);
    expect(isDailyNanikiruCorrect(problem, "9s")).toBe(true);
    expect(isDailyNanikiruCorrect(problem, "5m")).toBe(false);
  });

  it("generates and verifies 365 days without excessive duplication", { timeout: 30_000 }, () => {
    const handKeys = new Set<string>();
    const bestDiscardCounts = new Map<Tile, number>();
    const startedAt = performance.now();

    for (let offset = 0; offset < 365; offset += 1) {
      const date = addUtcDays("2026-01-01", offset);
      const problem = generateDailyNanikiru(date);
      const verified = bestDailyDiscards(analyzeDiscards(problem.counts, { includeTenpaiDetails: false })).map((result) => result.discard).sort();

      expect(problem.date).toBe(date);
      expect(problem.quality.accepted).toBe(true);
      expect(sumCounts(problem.counts)).toBe(14);
      expect(Math.max(...problem.counts)).toBeLessThanOrEqual(4);
      expect(problem.hand).toHaveLength(14);
      expect(problem.choices).toHaveLength(3);
      expect(problem.shanten).toBe(1);
      expect(problem.bestDiscards.slice().sort()).toEqual(verified);
      expect(problem.bestUkeireTiles).toBeGreaterThan(problem.nextBestUkeireTiles);

      handKeys.add(problem.handKey);
      for (const discard of problem.bestDiscards) {
        bestDiscardCounts.set(discard, (bestDiscardCounts.get(discard) ?? 0) + 1);
      }
    }

    const elapsedMs = performance.now() - startedAt;
    const mostFrequentDiscard = Math.max(...bestDiscardCounts.values());
    expect(handKeys.size).toBeGreaterThanOrEqual(300);
    expect(mostFrequentDiscard).toBeLessThanOrEqual(65);
    expect(elapsedMs).toBeLessThan(45_000);
  });
});

function addUtcDays(date: string, offset: number): string {
  const value = new Date(`${date}T00:00:00.000Z`);
  value.setUTCDate(value.getUTCDate() + offset);
  return value.toISOString().slice(0, 10);
}

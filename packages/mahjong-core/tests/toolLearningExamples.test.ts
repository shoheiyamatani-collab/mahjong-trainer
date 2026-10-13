import { describe, expect, it } from "vitest";
import { CHECKER_SAMPLE_HAND, scoreLearningExamples } from "../../../apps/web/app/tools/toolLearningExamples";
import { getCheckerLearningResults, getScoreLearningResults } from "../../../apps/web/app/tools/toolLearningResults";
import { calculateHandScore, normalShanten, parseHand, sumCounts, tileIndex, validateCounts } from "../src";

describe("tool learning examples", () => {
  it("verifies the full 14-tile checker comparison and same-rate candidates", () => {
    const counts = parseHand(CHECKER_SAMPLE_HAND);
    validateCounts(counts, 14);
    expect(normalShanten(counts)).toBe(1);
    const results = getCheckerLearningResults();
    expect(results.map((result) => [result.discard, result.afterDiscardShanten, result.ukeireTypes, result.ukeireTiles])).toEqual([
      ["1p", 1, 16, 54], ["4p", 1, 16, 54], ["3m", 1, 15, 50], ["8m", 1, 5, 16], ["4m", 2, 22, 75]
    ]);
    expect(results[0]!.ukeire).toEqual(results[1]!.ukeire);
    expect(results[0]!.goodShapeTiles).toBe(30);
    expect(results[0]!.superGoodShapeTiles).toBe(18);
  });

  it("checks each displayed effective tile against shanten and its physical count", () => {
    const counts = parseHand(CHECKER_SAMPLE_HAND);
    for (const result of getCheckerLearningResults()) {
      const after = counts.slice();
      after[tileIndex(result.discard)]!--;
      expect(sumCounts(after)).toBe(13);
      let total = 0;
      for (const tile of result.ukeire) {
        const index = tileIndex(tile);
        const drawn = after.slice();
        drawn[index]!++;
        expect(drawn[index]).toBeLessThanOrEqual(4);
        expect(normalShanten(drawn)).toBeLessThan(result.afterDiscardShanten);
        total += 4 - after[index]!;
      }
      expect(total).toBe(result.ukeireTiles);
    }
  });

  it("verifies legal score example hands, melds and distinct preset IDs", () => {
    expect(new Set(scoreLearningExamples.map((example) => example.id)).size).toBe(4);
    for (const example of scoreLearningExamples) {
      const counts = parseHand(example.handText);
      const total = counts.slice();
      for (const meld of example.input.melds ?? []) {
        for (const tile of meld.tiles) total[tileIndex(tile)]!++;
      }
      validateCounts(total, 14);
      expect(counts[tileIndex(example.input.winningTile)]).toBeGreaterThan(0);
    }
  });

  it("verifies the ron, tsumo, honba/sticks and open-hand calculation examples", () => {
    const results = getScoreLearningResults();
    expect(results.map(({ result }) => [result.score.han, result.fu?.totalBeforeRounding, result.fu?.roundedFu, result.score.totalPoints])).toEqual([
      [2, 30, 30, 2000], [3, 20, 20, 2700], [2, 30, 30, 3600], [1, 24, 30, 1000]
    ]);
    expect(results[1]!.result.score.payments.map((payment) => payment.points)).toEqual([700, 1300]);
    expect(results[2]!.result.score.payments).toEqual([{ label: "放銃者", points: 2600 }]);
    expect(results[3]!.result.yaku).toEqual([{ name: "役牌", han: 1 }]);
    expect(results[3]!.result.fu?.items.map((item) => item.fu)).toEqual([20, 4]);
  });

  it("a loaded example can be changed without changing the original lesson", () => {
    const example = scoreLearningExamples[0]!;
    const before = JSON.stringify(example);
    const changed = calculateHandScore({ ...example.input, counts: parseHand(example.handText), isDealer: true, seatWind: "東" });
    expect(changed.score.totalPoints).toBe(2900);
    expect(JSON.stringify(example)).toBe(before);
  });
});

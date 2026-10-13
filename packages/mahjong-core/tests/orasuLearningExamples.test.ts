import { describe, expect, it } from "vitest";
import { orasuExamples } from "../../../apps/web/app/analysis/orasu-condition/orasuExamples";
import { calculateOrasuConditions, hasReachedOrasuTarget, validateOrasuConditionInput } from "../src";

describe("published orasu learning examples", () => {
  it("keeps preset IDs unique and every example reproducible", () => {
    expect(new Set(orasuExamples.map((example) => example.id)).size).toBe(orasuExamples.length);
    for (const example of orasuExamples) {
      expect(validateOrasuConditionInput(example.input)).toEqual([]);
      expect(example.input.dealerSeat).toBe("east");
      expect(example.input.selfSeat).toBe("south");
      expect(Object.values(example.input.scores).reduce((sum, value) => sum + value, 0) + example.input.riichiSticks * 1000).toBe(100000);
      const copy = JSON.parse(JSON.stringify(example.input));
      expect(calculateOrasuConditions(copy)).toEqual(calculateOrasuConditions(example.input));
    }
  });

  it("verifies the 3500-point gap and the distinct ron/tsumo routes", () => {
    const input = orasuExamples[0]!.input;
    const result = calculateOrasuConditions(input);
    expect(input.scores.east - input.scores.south).toBe(3500);
    expect(result.pointsToTargetLine).toBe(3501);
    expect(result.ron.east?.candidate.baseTotalPoints).toBe(2000);
    expect(result.ron.east?.postScores).toEqual({ east: 30000, south: 30500, west: 22000, north: 17500 });
    expect(result.ron.west?.candidate.baseTotalPoints).toBe(3600);
    expect(result.ron.north?.candidate.baseTotalPoints).toBe(3600);
    expect(result.tsumo?.candidate.basePayments.map((payment) => payment.points)).toEqual([600, 1200]);
    expect(result.tsumo?.postScores).toEqual({ east: 30800, south: 30900, west: 21400, north: 16900 });
    expect(hasReachedOrasuTarget({ ...input.scores, east: 30400, south: 30100 }, "south", 1, "strict")).toBe(false);
  });

  it("verifies second place against all four scores", () => {
    const result = calculateOrasuConditions(orasuExamples[1]!.input);
    expect(result.ron.west?.candidate.baseTotalPoints).toBe(12000);
    expect(result.ron.west?.postScores).toEqual({ east: 45000, south: 22000, west: 18000, north: 15000 });
    expect(result.ron.west?.postRanking.find((row) => row.seat === "south")?.rank).toBe(2);
    expect(hasReachedOrasuTarget({ east: 45000, south: 18000, west: 22000, north: 15000 }, "south", 2, "strict")).toBe(false);
  });

  it("does not charge the discarder for the deposited riichi stick", () => {
    const result = calculateOrasuConditions(orasuExamples[2]!.input);
    expect(result.ron.east?.candidate.baseTotalPoints).toBe(1000);
    expect(result.ron.east?.candidate.settlementPayments[0]?.points).toBe(1600);
    expect(result.ron.east?.postScores).toEqual({ east: 30400, south: 31100, west: 22000, north: 16500 });
  });

  it("verifies both policies at the tied-top boundary", () => {
    const input = orasuExamples[3]!.input;
    const allowed = calculateOrasuConditions(input);
    const strict = calculateOrasuConditions({ ...input, tiePolicy: "strict" });
    expect(allowed.ron.east?.candidate.baseTotalPoints).toBe(2000);
    expect(allowed.ron.east?.postScores).toEqual({ east: 30000, south: 30000, west: 22500, north: 17500 });
    expect(strict.ron.east?.candidate.baseTotalPoints).toBe(2300);
    expect(hasReachedOrasuTarget(allowed.ron.east!.postScores, "south", 1, "strict")).toBe(false);
  });

  it.each(orasuExamples)("all displayed routes in $id conserve points and attain the target", ({ input }) => {
    const result = calculateOrasuConditions(input);
    for (const route of [...Object.values(result.ron), result.tsumo]) {
      if (!route) continue;
      expect(Object.values(route.postScores).reduce((sum, value) => sum + value, 0)).toBe(100000);
      expect(hasReachedOrasuTarget(route.postScores, input.selfSeat, input.targetRank, input.tiePolicy)).toBe(true);
    }
  });
});

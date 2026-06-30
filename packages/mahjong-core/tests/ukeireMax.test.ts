import { describe, expect, it } from "vitest";
import {
  buildUkeireMaxQuestion,
  countsToTiles,
  difficultUkeireDebugInfo,
  evaluateUkeireMaxAnswer,
  evaluateDifficultUkeireQuestion,
  filterDifficultUkeireQuestion,
  generateUkeireMaxQuestion,
  isObviousIsolatedTile,
  middleTileRatio,
  parseHand,
  scoreComplexShape,
  sumCounts,
  toggleUkeireMaxSelection,
  type Counts34,
  type DiscardAnalysis,
  type UkeireMaxQuestion
} from "../src";

describe("ukeire max questions", () => {
  it("builds a question from a 14-tile no-honor hand", () => {
    const question = buildUkeireMaxQuestion(parseHand("1455m2345677p678s"));

    expect(question).not.toBeNull();
    expect(question?.bestUkeireTypes).toBeGreaterThanOrEqual(6);
    expect(question?.bestDiscards).toEqual(["1m"]);
    expect(question?.results.every((result) => result.afterDiscardShanten === 1)).toBe(true);
  });

  it("rejects hands with honors", () => {
    const question = buildUkeireMaxQuestion(parseHand("1455m2345677p67s東"));

    expect(question).toBeNull();
  });

  it("evaluates exact, partial, and wrong answers", () => {
    const question = buildUkeireMaxQuestion(parseHand("56m44455677p6789s"));
    expect(question?.bestDiscards.sort()).toEqual(["6s", "9s"]);

    expect(evaluateUkeireMaxAnswer(question!, ["6s", "9s"])).toBe("correct");
    expect(evaluateUkeireMaxAnswer(question!, ["6s"])).toBe("partial");
    expect(evaluateUkeireMaxAnswer(question!, ["5m"])).toBe("wrong");
  });

  it("toggles a selected discard", () => {
    expect(toggleUkeireMaxSelection([], "6s")).toEqual(["6s"]);
    expect(toggleUkeireMaxSelection(["6s"], "6s")).toEqual([]);
  });

  it("generates a valid question", () => {
    const question = generateUkeireMaxQuestion(() => 0.42);

    expect(sumCounts(question.counts)).toBe(14);
    expect(countsToTiles(question.counts).every((tile) => tile.endsWith("m") || tile.endsWith("p") || tile.endsWith("s"))).toBe(true);
    expect(question.bestDiscards.length).toBeGreaterThan(0);
    expect(question.bestUkeireTypes).toBeGreaterThanOrEqual(6);
  });

  it("accepts difficult questions with a close best-second gap", () => {
    const question = syntheticDifficultQuestion([["5m", 28], ["4m", 26], ["6m", 25]]);
    const evaluation = evaluateDifficultUkeireQuestion(question);

    expect(evaluation.accepted).toBe(true);
    expect(evaluation.bestSecondDiff).toBe(2);
    expect(evaluation.nearBestCandidateCount).toBe(3);
    expect(filterDifficultUkeireQuestion(question)).toBe(true);
  });

  it("rejects tied best discards and obvious isolated best discards", () => {
    const tied = syntheticDifficultQuestion([["5m", 28], ["4m", 28], ["6m", 25]]);
    const isolatedCounts = parseHand("14445556667777m");
    const isolated = syntheticDifficultQuestion([["1m", 28], ["4m", 26], ["5m", 25]], isolatedCounts);

    expect(evaluateDifficultUkeireQuestion(tied).rejectReasons).toContain("tied_best");
    expect(isObviousIsolatedTile("1m", isolatedCounts)).toBe(true);
    expect(evaluateDifficultUkeireQuestion(isolated).rejectReasons).toContain("obvious_isolated_best_discard");
  });

  it("exposes difficult debug metrics and rewards complex middle-heavy shapes", () => {
    const question = syntheticDifficultQuestion([["5m", 28], ["4m", 26], ["6m", 25]]);
    const debug = difficultUkeireDebugInfo(question);
    const complexCounts = parseHand("3334455667788m");
    const simpleCounts = parseHand("113579m2468p19s");

    expect(debug.accepted).toBe(true);
    expect(debug.bestSecondDiff).toBe(2);
    expect(debug.ranking[0]).toMatchObject({ discard: "5m", ukeireTiles: 28 });
    expect(middleTileRatio(complexCounts)).toBeGreaterThan(0.6);
    expect(scoreComplexShape(complexCounts)).toBeGreaterThan(scoreComplexShape(simpleCounts));
  });
});

function syntheticDifficultQuestion(discards: Array<[DiscardAnalysis["discard"], number]>, counts: Counts34 = parseHand("33344455566677m")): UkeireMaxQuestion {
  const results = discards.map(([discard, ukeireTiles]) => discardResult(discard, ukeireTiles));
  const bestTiles = Math.max(...results.map((result) => result.ukeireTiles));
  return {
    counts,
    results,
    bestDiscards: results.filter((result) => result.ukeireTiles === bestTiles).map((result) => result.discard),
    bestUkeireTypes: 6,
    bestUkeireTiles: bestTiles
  };
}

function discardResult(discard: DiscardAnalysis["discard"], ukeireTiles: number): DiscardAnalysis {
  return {
    discard,
    afterDiscardShanten: 1,
    isIishanten: true,
    ukeireTypes: 6,
    ukeireTiles,
    ukeire: [],
    goodShapeTypes: 0,
    goodShapeTiles: 0,
    goodShapeRate: 0,
    superGoodShapeTypes: 0,
    superGoodShapeTiles: 0,
    superGoodShapeRate: 0,
    tenpaiDetails: []
  };
}

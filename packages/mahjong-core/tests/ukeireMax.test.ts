import { describe, expect, it } from "vitest";
import {
  buildUkeireMaxQuestion,
  countsToTiles,
  evaluateUkeireMaxAnswer,
  generateUkeireMaxQuestion,
  parseHand,
  sumCounts,
  toggleUkeireMaxSelection
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
});

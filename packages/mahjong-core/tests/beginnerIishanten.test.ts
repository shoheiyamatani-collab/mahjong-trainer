import { describe, expect, it } from "vitest";
import {
  beginnerIishantenProblems,
  buildBeginnerIishantenQuestion,
  countsToTiles,
  parseBeginnerIishantenHand,
  parseBeginnerIishantenTile,
  sumCounts,
  TILE_NAMES,
  validateBeginnerIishantenProblem
} from "../src";

describe("beginner iishanten fixed problems", () => {
  it("contains 10 beginner fixed problems", () => {
    expect(beginnerIishantenProblems).toHaveLength(10);
  });

  it("parses z honor notation and keeps 14 tiles", () => {
    const counts = parseBeginnerIishantenHand("4567m2349p678s155z");
    expect(sumCounts(counts)).toBe(14);
    expect(countsToTiles(counts)).toContain(TILE_NAMES[27]);
  });

  it("validates every problem answer as max ukeire among choices", () => {
    for (const problem of beginnerIishantenProblems) {
    const question = buildBeginnerIishantenQuestion(problem);
    const iishantenChoices = question.choices.filter((choice) => choice.analysis.afterDiscardShanten === 1);
    const bestTiles = Math.max(...iishantenChoices.map((choice) => choice.analysis.ukeireTiles));

    expect(sumCounts(question.counts), problem.id).toBe(14);
    expect(problem.choices, problem.id).toContain(problem.answer);
    expect(iishantenChoices.length, problem.id).toBeGreaterThan(0);
    expect(question.answerResult.afterDiscardShanten, problem.id).toBe(1);
    expect(question.answerResult.ukeireTiles, problem.id).toBe(bestTiles);
    expect(() => validateBeginnerIishantenProblem(problem), problem.id).not.toThrow();
    }
  });

  it("reports calculated ukeire for the fixed data", () => {
    const summary = beginnerIishantenProblems.map((problem) => {
      const question = buildBeginnerIishantenQuestion(problem);
      return [
        problem.id,
        problem.answer,
        question.choices.map((choice) => `${choice.discard}:s${choice.analysis.afterDiscardShanten}/${choice.analysis.ukeireTiles}`).join(",")
      ];
    });

    expect(summary).toHaveLength(10);
  });

  it("parses choice notation into internal tiles", () => {
    expect(parseBeginnerIishantenTile("1z")).toBe(TILE_NAMES[27]);
    expect(parseBeginnerIishantenTile("7z")).toBe(TILE_NAMES[33]);
    expect(parseBeginnerIishantenTile("4m")).toBe("4m");
  });
});

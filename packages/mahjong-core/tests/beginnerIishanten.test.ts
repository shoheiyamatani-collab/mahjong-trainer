import { describe, expect, it } from "vitest";
import {
  beginnerIishantenProblems,
  buildBeginnerIishantenQuestion,
  countsToTiles,
  normalShanten,
  parseBeginnerIishantenHand,
  parseBeginnerIishantenTile,
  sumCounts,
  TILE_NAMES,
  validateBeginnerIishantenProblem
} from "../src";

describe("beginner iishanten fixed problems", () => {
  it("contains one beginner fixed problem per theme", () => {
    const themes = new Set(beginnerIishantenProblems.map((problem) => problem.theme));

    expect(beginnerIishantenProblems).toHaveLength(7);
    expect(themes.size).toBe(beginnerIishantenProblems.length);
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
      expect(normalShanten(question.counts), problem.id).toBe(1);
      expect(problem.choices, problem.id).toContain(problem.answer);
      expect(iishantenChoices.length, problem.id).toBe(problem.choices.length);
      expect(iishantenChoices.length, problem.id).toBeGreaterThan(0);
      expect(question.answerResult.afterDiscardShanten, problem.id).toBe(1);
      expect(question.answerResult.ukeireTiles, problem.id).toBe(bestTiles);
      expect(() => validateBeginnerIishantenProblem(problem), problem.id).not.toThrow();
    }
  });

  it("does not use an obvious isolated tile as the answer", () => {
    for (const problem of beginnerIishantenProblems) {
      const question = buildBeginnerIishantenQuestion(problem);
      const answer = parseBeginnerIishantenTile(problem.answer);
      const tileIndex = TILE_NAMES.indexOf(answer);
      expect(tileIndex, problem.id).toBeGreaterThanOrEqual(0);
      expect(tileIndex, problem.id).toBeLessThan(27);

      const suitStart = Math.floor(tileIndex / 9) * 9;
      const rank = tileIndex % 9;
      const nearRanks = [rank - 2, rank - 1, rank, rank + 1, rank + 2]
        .filter((nearRank) => nearRank >= 0 && nearRank < 9);
      const relatedTileCount = nearRanks.reduce((total, nearRank) => total + question.counts[suitStart + nearRank]!, 0);

      expect(relatedTileCount, problem.id).toBeGreaterThan(1);
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

    expect(summary).toHaveLength(7);
  });

  it("parses choice notation into internal tiles", () => {
    expect(parseBeginnerIishantenTile("1z")).toBe(TILE_NAMES[27]);
    expect(parseBeginnerIishantenTile("7z")).toBe(TILE_NAMES[33]);
    expect(parseBeginnerIishantenTile("4m")).toBe("4m");
  });
});

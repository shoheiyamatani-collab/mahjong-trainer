import { describe, expect, it } from "vitest";
import { loadConfig } from "../src/config.js";
import { youtubeDescription, youtubeTitle } from "../src/metadata.js";
import { generateProblem, verifyProblem } from "../src/problem.js";
import { generateDailyNanikiru } from "@mahjong-trainer/mahjong-core";

describe("shorts problems", () => {
  it.each(["nani-kiru", "machi"] as const)("generates and re-verifies %s with shared mahjong logic", async (type) => {
    const config = await loadConfig();
    const problem = generateProblem(type, "2026-09-20", 1, [], config);

    expect(() => verifyProblem(problem)).not.toThrow();
    expect(problem.hand).toHaveLength(type === "nani-kiru" ? 14 : 13);
    expect(problem.answer.length).toBeGreaterThan(0);
    expect(problem.verification.verified).toBe(true);
    expect(problem.narration.find((segment) => segment.id === "answer")?.displayText).toContain(problem.answerDisplay);
    expect(problem.narration.find((segment) => segment.id === "answer")?.speechText).toContain(problem.answerReading);
    expect(problem.narration.find((segment) => segment.id === "answer")?.speechText).not.toContain("正解は");
    expect(problem.answerReading).not.toBe(problem.answerDisplay);
  });

  it("creates linked YouTube metadata with the configured credit", async () => {
    const config = await loadConfig();
    const problem = generateProblem("nani-kiru", "2026-09-20", 1, [], config);

    expect(youtubeTitle(problem)).toContain("毎日何切る");
    expect(youtubeDescription(problem, config)).toContain(problem.toolUrl);
    expect(youtubeDescription(problem, config)).toContain("VOICEVOX:ずんだもん");
  });

  it("uses the same date-based nani-kiru problem as the website", async () => {
    const config = await loadConfig();
    const problem = generateProblem("nani-kiru", "2026-09-21", 1, [], config);
    const daily = generateDailyNanikiru("2026-09-21");

    expect(problem.handKey).toBe(daily.handKey);
    expect(problem.answer).toEqual(daily.bestDiscards);
    expect(problem.toolPath).toBe(daily.checkerPath);
  });
});

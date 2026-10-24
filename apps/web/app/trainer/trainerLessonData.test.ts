import { describe, expect, it } from "vitest";
import {
  analyzeDiscards, countsToTiles, emptyCounts, findChinitsuWaits13, parseChinitsuHand,
  parseHand, sumCounts, tileIndex, validateCounts
} from "@mahjong-trainer/mahjong-core";
import { getIishantenLesson, getTrainingScoreLesson, getUkeireLesson, getWaitLesson, WAIT_LESSON_HANDS } from "./trainerLessonData";
import { trainerScoreExamples } from "./trainerScoreExamples";
import { scoreLearningExamples } from "../tools/toolLearningExamples";

describe("training worked lessons", () => {
  it("uses an existing authored iishanten problem and the same calculation", () => {
    const lesson = getIishantenLesson();
    validateCounts(lesson.counts, 14);
    const results = analyzeDiscards(lesson.counts);
    for (const choice of lesson.choices) expect(choice.analysis).toEqual(results.find((row) => row.discard === choice.discard));
    expect(lesson.answerResult.discard).toBe("2m");
    expect(lesson.answerResult.ukeireTiles).toBe(33);
    expect(lesson.choices.every((choice) => choice.analysis.afterDiscardShanten === 1)).toBe(true);
    expect(lesson.answerResult.ukeireTiles).toBe(Math.max(...lesson.choices.map((choice) => choice.analysis.ukeireTiles)));
    const bestShanten = Math.min(...results.map((row) => row.afterDiscardShanten));
    expect(lesson.answerResult.afterDiscardShanten).toBe(bestShanten);
    expect(lesson.answerResult.ukeireTiles).toBe(Math.max(...results.filter((row) => row.afterDiscardShanten === bestShanten).map((row) => row.ukeireTiles)));
  });

  it("does not turn a multiple-answer ukeire example into a single-answer lesson", () => {
    const lesson = getUkeireLesson();
    validateCounts(lesson.counts, 14);
    expect(lesson.bestDiscards).toEqual(["6s", "9s"]);
    const results = analyzeDiscards(lesson.counts);
    expect(lesson.bestUkeireTiles).toBe(Math.max(...results.filter((row) => row.afterDiscardShanten === 1).map((row) => row.ukeireTiles)));
    for (const tile of lesson.bestDiscards) expect(results.find((row) => row.discard === tile)?.ukeireTiles).toBe(lesson.bestUkeireTiles);
  });

  it.each(["seven-tile", "chinitsu"] as const)("%s shows a full 13-tile hand and a physical proof for each wait", (slug) => {
    const lesson = getWaitLesson(slug);
    validateCounts(lesson.counts, 13);
    expect(lesson.shanten).toBe(0);
    expect(lesson.waits.length).toBeGreaterThanOrEqual(3);
    for (const proof of lesson.proofs) {
      const counts = emptyCounts();
      for (const tile of [...proof.decomposition.melds.flatMap((meld) => meld.tiles), ...proof.decomposition.pair.tiles]) counts[tileIndex(tile)]!++;
      validateCounts(counts, 14);
      const expected = lesson.counts.slice();
      expected[tileIndex(proof.tile)]!++;
      expect(counts).toEqual(expected);
      expect(proof.remaining).toBe(4 - lesson.counts[tileIndex(proof.tile)]!);
    }
    expect(lesson.ukeireCount).toBe(lesson.proofs.reduce((total, proof) => total + proof.remaining, 0));
    if (slug === "seven-tile") expect(lesson.waits).toEqual(["2m", "5m", "8m"]);
    else expect(lesson.waits.map((tile) => Number(tile[0]))).toEqual(findChinitsuWaits13(parseChinitsuHand(WAIT_LESSON_HANDS.chinitsu.replace("p", ""), 13)));
  });

  it("the same completed hand has different yaku/fu when the winning tile changes", () => {
    const examples = getTrainingScoreLesson("score");
    expect(examples[0]!.counts).toEqual(examples[1]!.counts);
    expect(examples.map(({ result }) => [result.score.han, result.fu?.totalBeforeRounding, result.fu?.roundedFu, result.score.totalPoints])).toEqual([
      [1, 32, 40, 1300], [2, 30, 30, 2000]
    ]);
  });

  it("kan hands have 15 physical tiles and retain the open/closed fu difference", () => {
    const examples = getTrainingScoreLesson("score-hard");
    for (const example of examples) {
      const counts = example.counts.slice();
      for (const meld of example.input.melds!) for (const tile of meld.tiles) counts[tileIndex(tile)]!++;
      validateCounts(counts, 15);
      expect(sumCounts(example.counts)).toBe(11);
    }
    expect(examples.map(({ result }) => [result.score.han, result.fu?.totalBeforeRounding, result.fu?.roundedFu, result.score.totalPoints])).toEqual([
      [1, 72, 80, 2600], [1, 46, 50, 1600]
    ]);
  });

  it("uses distinct, legal presets without replacing any existing calculator example", () => {
    const ids = [...scoreLearningExamples, ...trainerScoreExamples].map((example) => example.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(scoreLearningExamples).toHaveLength(4);
    for (const example of trainerScoreExamples) {
      expect(countsToTiles(parseHand(example.handText))).toContain(example.input.winningTile);
      expect(example.input.honba).toBe(0);
      expect(example.input.riichiSticks).toBe(0);
    }
  });
});

import { analyzeDiscards, calculateHandScore, parseHand, type DiscardAnalysis } from "@mahjong-trainer/mahjong-core";
import { CHECKER_COMPARISON_DISCARDS, CHECKER_SAMPLE_HAND, scoreLearningExamples } from "./toolLearningExamples";

// Only the static article components call these functions. Interactive tools keep their existing calculations.
export function getCheckerLearningResults(): DiscardAnalysis[] {
  const results = analyzeDiscards(parseHand(CHECKER_SAMPLE_HAND));
  return CHECKER_COMPARISON_DISCARDS.map((tile) => {
    const result = results.find((item) => item.discard === tile);
    if (!result) throw new Error(`Missing checker example discard: ${tile}`);
    return result;
  });
}

export function getScoreLearningResults() {
  return scoreLearningExamples.map((example) => ({
    ...example,
    result: calculateHandScore({ ...example.input, counts: parseHand(example.handText) })
  }));
}

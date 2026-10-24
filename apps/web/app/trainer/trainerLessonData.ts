import {
  analyzeHandProgress, beginnerIishantenProblems, buildBeginnerIishantenQuestion,
  buildUkeireMaxQuestion, calculateHandScore, parseHand, standardHandDecompositions, tileIndex
} from "@mahjong-trainer/mahjong-core";
import { trainerScoreExamples } from "./trainerScoreExamples";

export const UKEIRE_LESSON_HAND = "56m44455677p6789s";
export const WAIT_LESSON_HANDS = {
  "seven-tile": "2345678m123p789s",
  chinitsu: "1122334455678p"
} as const;

export function getIishantenLesson() {
  const problem = beginnerIishantenProblems.find((item) => item.id === "beginner_iishanten_001");
  if (!problem) throw new Error("Missing introductory training example");
  return buildBeginnerIishantenQuestion(problem);
}
export function getUkeireLesson() {
  const question = buildUkeireMaxQuestion(parseHand(UKEIRE_LESSON_HAND));
  if (!question) throw new Error("Invalid ukeire training example");
  return question;
}

export function getWaitLesson(slug: keyof typeof WAIT_LESSON_HANDS) {
  const counts = parseHand(WAIT_LESSON_HANDS[slug]);
  const progress = analyzeHandProgress(counts);
  return {
    counts, ...progress,
    proofs: progress.waits.map((tile) => {
      const completed = counts.slice();
      completed[tileIndex(tile)]!++;
      const decomposition = standardHandDecompositions(completed)[0];
      if (!decomposition) throw new Error(`Missing winning decomposition: ${slug}/${tile}`);
      return { tile, remaining: progress.ukeire.find((item) => item.tile === tile)?.remaining ?? 0, decomposition };
    })
  };
}

export function getTrainingScoreLesson(slug: "score" | "score-hard") {
  const ids = slug === "score" ? ["training-score-edge", "training-score-ryanmen"] : ["training-score-ankan", "training-score-open-kan"];
  return ids.map((id) => {
    const example = trainerScoreExamples.find((item) => item.id === id)!;
    const counts = parseHand(example.handText);
    return { ...example, counts, result: calculateHandScore({ ...example.input, counts }) };
  });
}

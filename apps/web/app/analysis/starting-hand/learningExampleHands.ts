import { parseHand } from "@mahjong-trainer/mahjong-core";

// The same four hands displayed in StartingHandLearningGuide; no simulation runs on navigation.
export const startingLearningHands = [
  "2378m2367p239s東發",
  "4m7p1235789s東東發白",
  "2234m556p778s南南白",
  "3467m238p456s發發西",
] as const;

export function startingLearningExampleHref(index: number) {
  const hand = startingLearningHands[index];
  if (!hand) throw new Error(`Unknown starting-hand learning example: ${index}`);
  return `/analysis/starting-hand?hand=${encodeURIComponent(parseHand(hand).join(","))}#starting-hand-input`;
}

import { analyzeDiscards, parseHand } from "@mahjong-trainer/mahjong-core";

export const BLOCK_COMPARISON_HAND = "12355m45699p2378s";

export function getBlockComparisonExample() {
  const hand = parseHand(BLOCK_COMPARISON_HAND);
  const results = analyzeDiscards(hand);
  const choices = ["9p", "2s"].map((discard) => {
    const result = results.find((row) => row.discard === discard);
    if (!result) throw new Error(`Missing block example discard: ${discard}`);
    return result;
  });
  return { hand, choices, href: `/analysis/mahjong-tool?hand=${encodeURIComponent(hand.join(","))}#checker-workspace` };
}

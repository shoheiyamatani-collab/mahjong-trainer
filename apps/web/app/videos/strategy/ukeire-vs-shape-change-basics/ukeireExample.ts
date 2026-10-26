import { analyzeDiscards, parseHand, tileIndex, type Tile } from "@mahjong-trainer/mahjong-core";
import { CHECKER_SAMPLE_HAND } from "../../../tools/toolLearningExamples";
import { getCheckerLearningResults } from "../../../tools/toolLearningResults";

export function getUkeireProgressExample() {
  const hand = parseHand(CHECKER_SAMPLE_HAND);
  const base = getCheckerLearningResults().find((row) => row.discard === "1p")!;
  const afterDiscard = hand.slice();
  afterDiscard[tileIndex(base.discard)]! -= 1;
  const compareDraw = (draw: Tile) => {
    const drawnHand = afterDiscard.slice();
    drawnHand[tileIndex(draw)]! += 1;
    const result = analyzeDiscards(drawnHand).find((row) => row.discard === "6s");
    if (!result) throw new Error("Missing existing checker example comparison");
    return { draw, drawnHand, result };
  };
  const progress = compareDraw("2m");
  const shapeChange = compareDraw("5p");
  const checkerHref = (counts: number[]) => `/analysis/mahjong-tool?hand=${encodeURIComponent(counts.join(","))}#checker-workspace`;
  return { hand, base, afterDiscard, progress, shapeChange,
    originalHref: checkerHref(hand), progressHref: checkerHref(progress.drawnHand), shapeChangeHref: checkerHref(shapeChange.drawnHand) };
}

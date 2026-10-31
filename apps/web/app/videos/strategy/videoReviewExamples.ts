import { analyzeDiscards, analyzeHandProgress, countsToTiles, parseHand, type Tile } from "@mahjong-trainer/mahjong-core";
import { tileAssetName } from "../../components/TileFigures";

export const PAIR_REVIEW_HAND = "12388m45699p67s東東";
export const NO_YAKU_REVIEW_HAND = "234567m678p34s白白";
export const SUJI_COUNTEREXAMPLE_HAND = "22789m23455p678s";

export function getPairReviewExample() {
  const hand = parseHand(PAIR_REVIEW_HAND);
  const results = analyzeDiscards(hand);
  const choices = (["9p", "6s"] as Tile[]).map((discard) => {
    const choice = results.find((row) => row.discard === discard);
    if (!choice) throw new Error(`Missing review example: ${discard}`);
    return choice;
  });
  return {
    hand, choices,
    tiles: countsToTiles(hand).map((tile) => tileAssetName(tile)),
    href: `/analysis/mahjong-tool?hand=${encodeURIComponent(hand.join(","))}#checker-workspace`
  };
}

export function getWaitReviewExample(notation: string) {
  const hand = parseHand(notation);
  return {
    tiles: countsToTiles(hand).map((tile) => tileAssetName(tile)),
    waits: analyzeHandProgress(hand).waits.map((tile) => tileAssetName(tile))
  };
}

import { describe, expect, it } from "vitest";
import { addTile, analyzeHandProgress, calculateHandScore, parseHand, validateCounts, type HandScoreInput, type Tile } from "@mahjong-trainer/mahjong-core";
import { getPairReviewExample, getWaitReviewExample, NO_YAKU_REVIEW_HAND, PAIR_REVIEW_HAND, SUJI_COUNTEREXAMPLE_HAND } from "./videoReviewExamples";

const base: Omit<HandScoreInput, "counts" | "winningTile"> = {
  isDealer: false, winMethod: "ron", roundWind: "東", seatWind: "南", riichi: false, dora: 0, honba: 0, riichiSticks: 0
};

describe("independent video review examples", () => {
  it("compares two legal discards from the same complete 14-tile input", () => {
    const example = getPairReviewExample();
    validateCounts(example.hand, 14);
    expect(example.hand).toEqual(parseHand(PAIR_REVIEW_HAND));
    expect(example.choices.map((row) => [row.discard, row.afterDiscardShanten, row.ukeireTypes, row.ukeireTiles])).toEqual([
      ["9p", 1, 4, 12], ["6s", 1, 3, 6]
    ]);
    const url = new URL(example.href, "https://jongfolio.com");
    expect(url.searchParams.get("hand")).toBe(example.hand.join(","));
    expect(example.tiles).toHaveLength(14);
  });

  it("shows an actual yaku-less ron, not an accidental pinfu or tanyao", () => {
    const hand = parseHand(NO_YAKU_REVIEW_HAND);
    validateCounts(hand, 13);
    expect(analyzeHandProgress(hand).waits).toEqual(["2s", "5s"]);
    expect(getWaitReviewExample(NO_YAKU_REVIEW_HAND).tiles).toHaveLength(13);
    for (const winningTile of ["2s", "5s"] as Tile[]) {
      const input = { ...base, counts: addTile(hand, winningTile), winningTile };
      expect(() => calculateHandScore(input)).toThrow("役がありません。");
      expect(calculateHandScore({ ...input, riichi: true }).yaku.map((yaku) => yaku.name)).toEqual(["リーチ"]);
      expect(calculateHandScore({ ...input, winMethod: "tsumo" }).yaku.map((yaku) => yaku.name)).toEqual(["門前清自摸和"]);
    }
  });

  it("5m in the river does not rule out a 2m shanpon wait", () => {
    const hand = parseHand(SUJI_COUNTEREXAMPLE_HAND);
    validateCounts(hand, 13);
    expect(analyzeHandProgress(hand).waits).toEqual(["2m", "5p"]);
    const completed = addTile(hand, "2m");
    validateCounts(completed, 14);
    expect(calculateHandScore({ ...base, counts: completed, winningTile: "2m", riichi: true }).yaku.map((yaku) => yaku.name)).toContain("リーチ");
  });
});

import { describe, expect, it } from "vitest";
import { analyzeDiscards, bestDiscardsForReview, calculateVisibleUkeire, countsToTiles, emptyCounts, normalShanten, parseHand, sumCounts, tileIndex } from "../src";

describe("mahjong-core tiles and analyzer", () => {
  it("parses compact hand notation", () => {
    const counts = parseHand("345688m1234p3456s");

    expect(sumCounts(counts)).toBe(14);
    expect(countsToTiles(counts)).toEqual([
      "3m",
      "4m",
      "5m",
      "6m",
      "8m",
      "8m",
      "1p",
      "2p",
      "3p",
      "4p",
      "3s",
      "4s",
      "5s",
      "6s",
    ]);
  });

  it("matches the Streamlit sample hand analysis", () => {
    const counts = parseHand("345688m1234p3456s");
    const results = analyzeDiscards(counts);
    const best = bestDiscardsForReview(results).map((result) => result.discard);

    expect(best).toEqual(["1p", "4p"]);
    expect(normalShanten(counts)).toBe(1);
    expect(results.find((result) => result.discard === "1p")).toMatchObject({
      ukeireTypes: 16,
      ukeireTiles: 54,
    });
  });

  it("subtracts public tiles and the candidate's own discard from remaining ukeire", () => {
    const hand = parseHand("345688m1234p3456s");
    const result = analyzeDiscards(hand).find((candidate) => candidate.discard === "1p")!;
    const visible = emptyCounts();
    visible[tileIndex("3m")] = 2;

    const availability = calculateVisibleUkeire(hand, result.discard, visible, result.ukeire);
    const threeMan = availability.find((item) => item.tile === "3m")!;

    expect(result.ukeireTiles).toBe(54);
    expect(threeMan).toMatchObject({ tile: "3m", visible: 2, heldAfterDiscard: 1, remaining: 1 });
    expect(availability.reduce((sum, item) => sum + item.remaining, 0)).toBeLessThan(result.ukeireTiles);
  });

  it("counts the candidate discard as public when that tile is still an effective tile", () => {
    const hand = parseHand("112233m445566p77s");
    const visible = emptyCounts();
    const result = analyzeDiscards(hand).find((candidate) => candidate.discard === "1m")!;

    const availability = calculateVisibleUkeire(hand, result.discard, visible, ["1m"]);
    expect(availability[0]).toMatchObject({ tile: "1m", visible: 1, heldAfterDiscard: 1, remaining: 2 });
  });

  it("rejects impossible visible-tile totals", () => {
    const hand = parseHand("1111m23456p123s55m");
    const visible = emptyCounts();
    visible[tileIndex("1m")] = 1;

    expect(() => calculateVisibleUkeire(hand, "5m", visible, ["1m"])).toThrow("4枚を超えています");
  });
});

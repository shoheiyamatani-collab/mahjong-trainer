import { describe, expect, it } from "vitest";
import { analyzeDiscards, bestDiscardsForReview, countsToTiles, normalShanten, parseHand, sumCounts } from "../src";

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
});

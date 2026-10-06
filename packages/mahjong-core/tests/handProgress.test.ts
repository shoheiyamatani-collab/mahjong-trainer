import { describe, expect, it } from "vitest";
import { analyzeHandProgress, handProgressShanten, normalShantenWithOpenMelds, parseHand, tileIndex } from "../src/index";

describe("shared hand progress", () => {
  it("includes seven pairs and kokushi only in closed hands", () => {
    expect(handProgressShanten(parseHand("1144m2277p3388s東"))).toBe(0);
    expect(handProgressShanten(parseHand("19m19p19s東南西北白發中"))).toBe(0);
    const counts = parseHand("1144m2277p33s");
    expect(handProgressShanten(counts, 1)).toBe(normalShantenWithOpenMelds(counts, 1));
  });
  it("subtracts public tiles without pretending to know the wall", () => {
    const counts = parseHand("123m456p789s11m23s"), known = counts.slice();
    known[tileIndex("1s")] += 2; known[tileIndex("4s")] += 3;
    const result = analyzeHandProgress(counts, 0, known);
    expect(result.ukeire).toEqual([{ tile: "1s", remaining: 2 }, { tile: "4s", remaining: 1 }]);
    expect(result.ukeireCount).toBe(3);
  });
  it("never computes a hypothetical fifteenth tile from fourteen tiles", () => {
    expect(analyzeHandProgress(parseHand("123m456p789s11m234s")).ukeire).toEqual([]);
  });
});

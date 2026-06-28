import { describe, expect, it } from "vitest";
import {
  chinitsuHandKey,
  chinitsuRanks,
  chinitsuTiles,
  evaluateChinitsuWaitAnswer,
  findChinitsuWaits13,
  generateChinitsuWaitQuestion,
  isChinitsuChiitoitsu,
  parseChinitsuHand,
  remainingTilesForChinitsuWaits,
  toggleChinitsuRankSelection
} from "../src";

describe("chinitsu wait training", () => {
  it("parses one-suit rank strings", () => {
    const counts = parseChinitsuHand("1112345678999", 13);

    expect(chinitsuRanks(counts)).toEqual([1, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 9, 9]);
    expect(chinitsuHandKey(counts)).toBe("1112345678999");
    expect(chinitsuTiles(counts, "p").slice(0, 3)).toEqual(["1p", "1p", "1p"]);
  });

  it("rejects invalid rank input", () => {
    expect(() => parseChinitsuHand("123m")).toThrow();
    expect(() => parseChinitsuHand("11111")).toThrow();
    expect(() => parseChinitsuHand("123456789", 13)).toThrow();
  });

  it("finds waits for standard shapes", () => {
    const counts = parseChinitsuHand("1112345678889", 13);

    expect(findChinitsuWaits13(counts)).toEqual([1, 4, 7, 8, 9]);
  });

  it("includes chiitoitsu waits", () => {
    const counts = parseChinitsuHand("1122334455668", 13);
    const won = parseChinitsuHand("11223344556688", 14);

    expect(findChinitsuWaits13(counts)).toEqual([8]);
    expect(isChinitsuChiitoitsu(won)).toBe(true);
  });

  it("excludes ranks already used four times", () => {
    const counts = parseChinitsuHand("1111222233334", 13);

    expect(findChinitsuWaits13(counts)).toEqual([4, 5]);
  });

  it("evaluates exact wait answers", () => {
    expect(evaluateChinitsuWaitAnswer([1, 4, 7], [7, 1, 4])).toBe(true);
    expect(evaluateChinitsuWaitAnswer([1, 4, 7], [1, 4])).toBe(false);
    expect(evaluateChinitsuWaitAnswer([1, 4, 7], [1, 4, 7, 9])).toBe(false);
  });

  it("returns remaining wait tiles", () => {
    const counts = parseChinitsuHand("1112345567899", 13);

    expect(findChinitsuWaits13(counts)).toEqual([5, 9]);
    expect(remainingTilesForChinitsuWaits(counts, [5, 9])).toEqual({ 5: 2, 9: 2 });
  });

  it("generates a valid wait question and toggles selected ranks", () => {
    let seed = 20260629;
    const rng = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
    const question = generateChinitsuWaitQuestion(rng, "s");

    expect(chinitsuRanks(question.counts)).toHaveLength(13);
    expect(question.suit).toBe("s");
    expect(question.waits.length).toBeGreaterThan(0);
    expect(findChinitsuWaits13(question.counts)).toEqual(question.waits);
    expect(toggleChinitsuRankSelection([], 5)).toEqual([5]);
    expect(toggleChinitsuRankSelection([5], 5)).toEqual([]);
  });
});

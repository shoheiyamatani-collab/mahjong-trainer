import { describe, expect, it } from "vitest";
import {
  evaluateSevenShapeAnswer,
  findSevenShapeWaits,
  generateSevenShapeQuestion,
  getSevenShapePatterns,
  SEVEN_SHAPE_PATTERNS,
  sevenShapeQuestionKey,
  toggleSevenShapeRankSelection,
  validateSevenShapePattern
} from "../src";

describe("seven-shape wait training", () => {
  it("contains 19 total patterns and 16 basic patterns", () => {
    expect(SEVEN_SHAPE_PATTERNS).toHaveLength(19);
    expect(getSevenShapePatterns("basic")).toHaveLength(16);
    expect(getSevenShapePatterns("all")).toHaveLength(19);
  });

  it("keeps every pattern valid and wait data consistent", () => {
    for (const pattern of SEVEN_SHAPE_PATTERNS) {
      expect(pattern.tiles).toHaveLength(7);
      expect(pattern.waits.length).toBeGreaterThan(0);
      expect(() => validateSevenShapePattern(pattern)).not.toThrow();

      const counts = new Map<number, number>();
      for (const rank of pattern.tiles) {
        counts.set(rank, (counts.get(rank) ?? 0) + 1);
      }
      expect(Math.max(...counts.values())).toBeLessThanOrEqual(4);
      expect(findSevenShapeWaits(pattern.tiles)).toEqual(pattern.waits);
    }
  });

  it("keeps all 19 patterns unique after normalizing slide and mirror variants", () => {
    const normalizedKeys = SEVEN_SHAPE_PATTERNS.map((pattern) => sevenShapeClassKey(pattern.tiles));
    expect(new Set(normalizedKeys).size).toBe(SEVEN_SHAPE_PATTERNS.length);

    for (const pattern of getSevenShapePatterns("basic")) {
      expect(Math.max(...rankCounts(pattern.tiles))).toBeLessThan(4);
    }
    for (const pattern of SEVEN_SHAPE_PATTERNS.slice(16)) {
      expect(Math.max(...rankCounts(pattern.tiles))).toBe(4);
    }
  });

  it("rejects invalid seven-shape hands", () => {
    expect(() => findSevenShapeWaits([1, 2, 3, 4, 5, 6])).toThrow();
    expect(() => findSevenShapeWaits([1, 1, 1, 1, 1, 2, 3])).toThrow();
    expect(() => findSevenShapeWaits([1, 2, 3, 4, 5, 6, 10])).toThrow();
  });

  it("generates fixed suited questions without repeating recent patterns", () => {
    let seed = 20260630;
    const rng = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
    const first = generateSevenShapeQuestion("basic", rng, [], "m");
    const second = generateSevenShapeQuestion("basic", rng, [sevenShapeQuestionKey(first)], "p");
    const firstPattern = SEVEN_SHAPE_PATTERNS.find((pattern) => pattern.id === first.patternId)!;
    const secondPattern = SEVEN_SHAPE_PATTERNS.find((pattern) => pattern.id === second.patternId)!;

    expect(first.tiles).toEqual(firstPattern.tiles);
    expect(first.waits).toEqual(firstPattern.waits);
    expect(first.suit).toBe("m");
    expect(second.tiles).toEqual(secondPattern.tiles);
    expect(second.waits).toEqual(secondPattern.waits);
    expect(second.suit).toBe("p");
    expect(sevenShapeQuestionKey(second)).not.toBe(sevenShapeQuestionKey(first));
  });

  it("evaluates exact multi-wait answers and toggles selected ranks", () => {
    expect(evaluateSevenShapeAnswer([1, 4, 7], [7, 1, 4])).toBe(true);
    expect(evaluateSevenShapeAnswer([1, 4, 7], [1, 4])).toBe(false);
    expect(evaluateSevenShapeAnswer([1, 4, 7], [1, 4, 7, 8])).toBe(false);
    expect(toggleSevenShapeRankSelection([], 5)).toEqual([5]);
    expect(toggleSevenShapeRankSelection([3, 5], 3)).toEqual([5]);
  });
});

function sevenShapeClassKey(tiles: number[]): string {
  const counts = rankCounts(tiles);
  const occupied = counts.map((count, index) => count > 0 ? index : -1).filter((index) => index >= 0);
  const left = occupied[0]!;
  const right = occupied[occupied.length - 1]!;
  const compact = counts.slice(left, right + 1);
  const mirrored = compact.slice().reverse();
  const key = compact.join("");
  const mirroredKey = mirrored.join("");
  return key < mirroredKey ? key : mirroredKey;
}

function rankCounts(tiles: number[]): number[] {
  const counts = Array(9).fill(0);
  for (const tile of tiles) {
    counts[tile - 1] += 1;
  }
  return counts;
}

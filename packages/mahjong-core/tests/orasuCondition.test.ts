import { describe, expect, it } from "vitest";
import {
  calculateOrasuConditions,
  calculateOrasuDraw,
  hasReachedOrasuTarget,
  validateOrasuConditionInput,
  type OrasuConditionInput,
  type OrasuScores
} from "../src";

const scores: OrasuScores = { east: 32_000, south: 28_500, west: 22_000, north: 17_500 };

function makeInput(overrides: Partial<OrasuConditionInput> = {}): OrasuConditionInput {
  return {
    scores,
    selfSeat: "south",
    dealerSeat: "east",
    targetRank: 1,
    honba: 0,
    riichiSticks: 0,
    tiePolicy: "strict",
    ...overrides
  };
}

describe("orasu conditions", () => {
  it("finds the minimum child ron condition against another child", () => {
    const result = calculateOrasuConditions(makeInput());

    expect(result.ron.west?.candidate.basePayments[0]?.points).toBe(3600);
    expect(result.ron.west?.postScores.south).toBe(32_100);
    expect(result.ron.west?.postScores.west).toBe(18_400);
  });

  it("accounts for a direct hit on the dealer", () => {
    const result = calculateOrasuConditions(makeInput());

    expect(result.ron.east?.candidate.basePayments[0]?.points).toBe(2000);
    expect(result.ron.east?.postScores).toEqual({ east: 30_000, south: 30_500, west: 22_000, north: 17_500 });
  });

  it("uses dealer ron values when the winner is dealer", () => {
    const result = calculateOrasuConditions(makeInput({
      scores: { east: 25_000, south: 29_000, west: 24_000, north: 22_000 },
      selfSeat: "east",
      targetRank: 1
    }));

    expect(result.ron.south?.candidate.basePayments[0]?.points).toBe(2400);
  });

  it("finds child and dealer tsumo conditions", () => {
    const child = calculateOrasuConditions(makeInput());
    const dealer = calculateOrasuConditions(makeInput({
      scores: { east: 25_000, south: 29_000, west: 24_000, north: 22_000 },
      selfSeat: "east"
    }));

    expect(child.tsumo?.candidate.basePayments.map((payment) => payment.points)).toEqual([600, 1200]);
    expect(dealer.tsumo?.candidate.basePayments[0]?.points).toBe(1200);
  });

  it("applies honba and riichi sticks to the settlement", () => {
    const result = calculateOrasuConditions(makeInput({ honba: 2, riichiSticks: 1 }));
    const direct = result.ron.east;

    expect(direct?.candidate.basePayments[0]?.points).toBe(1000);
    expect(direct?.candidate.settlementPayments[0]?.points).toBe(1600);
    expect(direct?.postScores.south).toBe(31_100);
    expect(direct?.postScores.east).toBe(30_400);
  });

  it("supports strict and tie-allowed rank rules", () => {
    const tied = { east: 30_000, south: 30_000, west: 22_000, north: 18_000 } satisfies OrasuScores;

    expect(hasReachedOrasuTarget(tied, "south", 1, "strict")).toBe(false);
    expect(hasReachedOrasuTarget(tied, "south", 1, "allow")).toBe(true);
  });

  it("can require a direct hit from one player while another ron is insufficient", () => {
    const result = calculateOrasuConditions(makeInput({
      scores: { east: 45_000, south: 10_000, west: 30_000, north: 15_000 },
      targetRank: 2
    }));

    expect(result.ron.west?.candidate.baseTotalPoints).toBeLessThan(result.ron.north?.candidate.baseTotalPoints ?? Infinity);
  });

  it("reaches mangan, haneman and yakuman bands when required", () => {
    const mangan = calculateOrasuConditions(makeInput({ scores: { east: 40_000, south: 24_500, west: 20_000, north: 15_500 } }));
    const haneman = calculateOrasuConditions(makeInput({ scores: { east: 45_000, south: 25_000, west: 18_000, north: 12_000 } }));
    const yakuman = calculateOrasuConditions(makeInput({ scores: { east: 70_000, south: 20_000, west: 6_000, north: 4_000 } }));

    expect(mangan.ron.east?.candidate.limitName).toBe("mangan");
    expect(haneman.ron.east?.candidate.limitName).toBe("haneman");
    expect(yakuman.ron.east?.candidate.limitName).toBe("yakuman");
  });

  it("returns no route when a single yakuman cannot reach the target", () => {
    const result = calculateOrasuConditions(makeInput({ scores: { east: 100_000, south: 0, west: 0, north: 0 } }));

    expect(result.ron.west).toBeNull();
    expect(result.tsumo).toBeNull();
  });

  it("detects an already achieved top-two or last-avoidance target", () => {
    const topTwo = calculateOrasuConditions(makeInput({ targetRank: 2 }));
    const topThree = calculateOrasuConditions(makeInput({ targetRank: 3 }));

    expect(topTwo.alreadyAchieved).toBe(true);
    expect(topThree.alreadyAchieved).toBe(true);
  });

  it("settles one, two, three, all and no tenpai draws", () => {
    expect(calculateOrasuDraw(scores, ["south"]).postScores).toEqual({ east: 31_000, south: 31_500, west: 21_000, north: 16_500 });
    expect(calculateOrasuDraw(scores, ["east", "south"]).postScores).toEqual({ east: 33_500, south: 30_000, west: 20_500, north: 16_000 });
    expect(calculateOrasuDraw(scores, ["east", "south", "west"]).postScores).toEqual({ east: 33_000, south: 29_500, west: 23_000, north: 14_500 });
    expect(calculateOrasuDraw(scores, ORASU_ALL_SEATS).postScores).toEqual(scores);
    expect(calculateOrasuDraw(scores, []).postScores).toEqual(scores);
  });

  it("rejects blank, negative and non-100-unit score values", () => {
    expect(validateOrasuConditionInput(makeInput({ scores: { ...scores, east: Number.NaN } }))).toContain("eastの持ち点を入力してください。");
    expect(validateOrasuConditionInput(makeInput({ scores: { ...scores, south: -100 } }))).toContain("southの持ち点は0点以上で入力してください。");
    expect(validateOrasuConditionInput(makeInput({ scores: { ...scores, west: 22_050 } }))).toContain("westの持ち点は100点単位で入力してください。");
  });
});

const ORASU_ALL_SEATS = ["east", "south", "west", "north"] as const;

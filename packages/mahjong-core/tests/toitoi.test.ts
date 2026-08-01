import { describe, expect, it } from "vitest";
import {
  analyzeToitoiDiscards,
  aggregateToitoiTrials,
  emptyCounts,
  evaluateToitoiPonDecision,
  evaluateToitoiProgress,
  isToitoiCompatibleMeld,
  isToitoiComplete,
  parseHand,
  runToitoiSimulation,
  shouldToitoiChi,
  shouldToitoiRiichi,
  toitoiShanten,
  toitoiWinningTileDetails,
  toitoiWinningTiles,
  type ToitoiMeld,
  type ChantaTrialResult,
} from "../src";

describe("toitoi structural completion", () => {
  it.each([
    "111m222p333s白白白東東",
    "東東東南南南西西西北北北白白",
    "111999m111999p11s",
  ])("accepts a four-triplet-one-pair structure: %s", (hand) => {
    expect(isToitoiComplete(parseHand(hand))).toBe(true);
  });

  it("accepts open triplets, including four open triplets", () => {
    const oneOpen: ToitoiMeld[] = [{ kind: "pon", tiles: ["1m", "1m", "1m"] }];
    const allOpen: ToitoiMeld[] = [
      { kind: "pon", tiles: ["1m", "1m", "1m"] },
      { kind: "pon", tiles: ["2p", "2p", "2p"] },
      { kind: "pon", tiles: ["3s", "3s", "3s"] },
      { kind: "pon", tiles: ["白", "白", "白"] },
    ];

    expect(isToitoiComplete(parseHand("222p333s白白白東東"), oneOpen)).toBe(true);
    expect(isToitoiComplete(parseHand("東東"), allOpen)).toBe(true);
  });

  it.each([
    "123m222p333s白白白東東",
    "11223344556677m",
    "1111m222p333s白白白東",
  ])("rejects sequences, seven pairs, and four-copy overlap: %s", (hand) => {
    expect(isToitoiComplete(parseHand(hand))).toBe(false);
  });

  it("rejects a fixed sequence and malformed duplicate triplets", () => {
    const chi: ToitoiMeld[] = [{ kind: "chi", tiles: ["1m", "2m", "3m"] }];
    const duplicate: ToitoiMeld[] = [
      { kind: "pon", tiles: ["東", "東", "東"] },
      { kind: "pon", tiles: ["東", "東", "東"] },
    ];
    expect(isToitoiComplete(parseHand("222p333s白白白東東"), chi)).toBe(false);
    expect(isToitoiCompatibleMeld(duplicate[1]!, [duplicate[0]!])).toBe(false);
  });
});

describe("toitoi shanten and live waits", () => {
  it("distinguishes completion, tenpai, and iishanten", () => {
    expect(toitoiShanten(parseHand("111m222p333s白白白東東"))).toBe(-1);
    expect(toitoiShanten(parseHand("111m222p333s白白發發"))).toBe(0);
    expect(toitoiShanten(parseHand("111m222p白白發發東東南"))).toBe(1);
  });

  it("finds both shanpon waits and their live counts", () => {
    const hand = parseHand("111m222p333s白白發發");
    expect(toitoiWinningTiles(hand)).toEqual(["白", "發"]);
    expect(toitoiWinningTileDetails(hand)).toEqual([
      { tile: "白", remaining: 2, waitType: "SHANPON" },
      { tile: "發", remaining: 2, waitType: "SHANPON" },
    ]);
    expect(evaluateToitoiProgress(hand).waitLiveCount).toBe(4);
  });

  it("finds a tanki wait and excludes dead waits", () => {
    const hand = parseHand("111m222p333s白白白東");
    expect(toitoiWinningTileDetails(hand)).toEqual([
      { tile: "東", remaining: 3, waitType: "TANKI" },
    ]);
    const dead = evaluateToitoiProgress(hand, [], emptyCounts());
    expect(dead.isTenpai).toBe(false);
    expect(dead.isPossible).toBe(false);
  });
});

describe("toitoi discard policy", () => {
  it("discards the fourth copy instead of treating it as a second set", () => {
    const choices = analyzeToitoiDiscards(parseHand("1111m222p333s白白發發"));
    expect(choices[0]?.tile).toBe("1m");
    expect(choices[0]?.targetShanten).toBe(0);
  });

  it("keeps completed triplets and discards an unrelated singleton", () => {
    const choices = analyzeToitoiDiscards(parseHand("111m222p333s白白發發5m"));
    expect(choices[0]?.tile).toBe("5m");
    expect(choices[0]?.completedTripletCount).toBe(3);
  });

  it("never chooses chi or riichi for the target strategy", () => {
    expect(shouldToitoiChi()).toBe(false);
    expect(shouldToitoiRiichi()).toBe(false);
  });

  it("calls pon only after evaluating the resulting discard", () => {
    const hand = parseHand("111m22p33s白白發發東南");
    const decision = evaluateToitoiPonDecision(hand, [], "2p");
    expect(decision.call).toBe(true);
    expect(decision.afterShanten).toBeLessThan(decision.beforeShanten);
    expect(decision.discardTile).not.toBeNull();
  });
});

describe("toitoi four-player simulation", () => {
  it("aggregates reach order and wait/open details with valid denominators", () => {
    const trials: ChantaTrialResult[] = [
      {
        outcome: "targetWin",
        targetMeldCount: 1,
        targetPonCount: 1,
        winMethod: "ron",
        toitoiWinWaitType: "SHANPON",
        toitoiInitialPairKindCount: 2,
        toitoiMaximumPairKindCount: 4,
        toitoiInitialTripletKindCount: 0,
        toitoiMaximumTripletKindCount: 4,
        toitoiWaitLiveCountAtTenpai: 3,
        progress: {
          reachedTargetIishanten: true,
          reachedTargetTenpai: true,
          reachedTargetWin: true,
          firstIishantenTurn: 2,
          firstTenpaiTurn: 5,
          winTurn: 7,
        },
      },
      {
        outcome: "draw",
        targetMeldCount: 0,
        targetPonCount: 0,
        toitoiInitialPairKindCount: 1,
        toitoiMaximumPairKindCount: 3,
        toitoiInitialTripletKindCount: 0,
        toitoiMaximumTripletKindCount: 2,
        progress: { reachedTargetIishanten: true, reachedTargetTenpai: false, reachedTargetWin: false },
      },
      {
        outcome: "invalid",
        targetMeldCount: 0,
        progress: { reachedTargetIishanten: false, reachedTargetTenpai: false, reachedTargetWin: false },
      },
    ];
    const result = aggregateToitoiTrials(trials);
    expect(result.validTrials).toBe(2);
    expect(result.winRate).toBe(0.5);
    expect(result.winRate).toBeLessThanOrEqual(result.tenpaiRate);
    expect(result.tenpaiRate).toBeLessThanOrEqual(result.iishantenRate);
    expect(result.closedWinCount + result.openWinCount).toBe(result.winCount);
    expect(result.details?.toitoi?.shanponWinCount).toBe(1);
    expect(result.details?.toitoi?.averageMaximumPairKindCount).toBe(3.5);
    expect(result.details?.toitoi?.averageChiCount).toBe(0);
  });

  it("repeats the shared-table simulation for the same seed without chi or riichi", () => {
    const input = {
      initialHand: parseHand("111m22p33s白白發發東南"),
      trials: 2,
      seed: 20260718,
      debug: true,
    };
    const first = runToitoiSimulation(input);
    expect(first).toEqual(runToitoiSimulation(input));
    expect(first.validTrials).toBe(2);
    expect(first.invalidTrials).toBe(0);
    expect(first.aiVersion).toMatch(/^toitoi-ai-/);
    expect(first.debugTrials?.[0]?.some((turn) => turn.toitoiWaits != null)).toBe(true);
    expect(first.details?.toitoi?.averagePonCount).toBeGreaterThanOrEqual(0);
    expect(first.details?.toitoi?.averageChiCount).toBe(0);
  });
});

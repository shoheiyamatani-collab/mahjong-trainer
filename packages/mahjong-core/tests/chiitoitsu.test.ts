import { describe, expect, it } from "vitest";
import {
  analyzeChiitoitsuDiscards,
  aggregateChiitoitsuTrials,
  canCompleteChiitoitsu,
  chiitoitsuPairKindCount,
  chiitoitsuShanten,
  chiitoitsuWinningTiles,
  emptyCounts,
  evaluateChiitoitsuProgress,
  isChiitoitsuComplete,
  parseHand,
  runChiitoitsuSimulation,
  shouldChiitoitsuCall,
  shouldChiitoitsuRiichi,
  type ChiitoitsuMeld,
  type ChantaTrialResult,
} from "../src";

describe("chiitoitsu completion and shanten", () => {
  it("accepts exactly seven distinct pairs, including shapes that also have a normal interpretation", () => {
    expect(isChiitoitsuComplete(parseHand("112233m445566p77s"))).toBe(true);
    expect(isChiitoitsuComplete(parseHand("11223344556677m"))).toBe(true);
  });

  it("does not use a quad as two pairs", () => {
    const hand = parseHand("11112233445566m");

    expect(chiitoitsuPairKindCount(hand)).toBe(6);
    expect(isChiitoitsuComplete(hand)).toBe(false);
  });

  it("uses the dedicated seven-pairs shanten formula", () => {
    expect(chiitoitsuShanten(parseHand("1122334455667m"))).toBe(0);
    expect(chiitoitsuShanten(parseHand("11223344556m7p8s"))).toBe(1);
    expect(chiitoitsuShanten(parseHand("11223344556677m"))).toBe(-1);
  });

  it("becomes impossible as soon as the hand is opened", () => {
    const melds: ChiitoitsuMeld[] = [{ kind: "pon", tiles: ["1m", "1m", "1m"] }];
    const hand = parseHand("22334455667p8s");

    expect(chiitoitsuShanten(hand, melds)).toBe(Number.POSITIVE_INFINITY);
    expect(canCompleteChiitoitsu(hand, emptyCounts(), melds)).toBe(false);
  });
});

describe("chiitoitsu live waits and decisions", () => {
  it("counts only a live singleton pair wait as tenpai", () => {
    const hand = parseHand("1122334455667m");
    const live = evaluateChiitoitsuProgress(hand);
    const dead = evaluateChiitoitsuProgress(hand, [], emptyCounts());

    expect(chiitoitsuWinningTiles(hand)).toEqual(["7m"]);
    expect(live.isTenpai).toBe(true);
    expect(live.waitLiveCount).toBe(3);
    expect(dead.isTenpai).toBe(false);
    expect(dead.isIishanten).toBe(false);
  });

  it("keeps completed pairs and removes the excess copy of a triplet", () => {
    const choices = analyzeChiitoitsuDiscards(parseHand("11122334455678m"));

    expect(choices[0]?.tile).toBe("1m");
    expect(choices[0]?.pairKindCount).toBe(5);
    expect(choices[0]?.excessDuplicateCount).toBe(0);
  });

  it("never calls or declares riichi", () => {
    expect(shouldChiitoitsuCall()).toBe(false);
    expect(shouldChiitoitsuRiichi()).toBe(false);
  });
});

describe("chiitoitsu four-player simulation", () => {
  it("aggregates target-only pair and wait statistics without calls", () => {
    const trials: ChantaTrialResult[] = [
      {
        outcome: "targetWin",
        targetMeldCount: 0,
        winMethod: "tsumo",
        initialPairKindCount: 4,
        maximumPairKindCount: 7,
        finalPairKindCount: 7,
        waitChangeCount: 2,
        waitLiveCountAtTenpai: 2,
        progress: {
          reachedTargetIishanten: true,
          reachedTargetTenpai: true,
          reachedTargetWin: true,
          firstIishantenTurn: 3,
          firstTenpaiTurn: 5,
          winTurn: 8,
        },
      },
    ];
    const result = aggregateChiitoitsuTrials(trials);

    expect(result.roleId).toBe("chiitoitsu");
    expect(result.openWinCount).toBe(0);
    expect(result.averageCallCount).toBe(0);
    expect(result.details?.chiitoitsu?.averageMaximumPairKindCount).toBe(7);
    expect(result.details?.chiitoitsu?.averageWaitChangeCount).toBe(2);
  });

  it("repeats the same shared-table simulation for the same seed", () => {
    const input = {
      initialHand: parseHand("112233m4455p6s7s8s"),
      trials: 2,
      seed: 20260718,
      debug: true,
    };
    const first = runChiitoitsuSimulation(input);

    expect(first).toEqual(runChiitoitsuSimulation(input));
    expect(first.validTrials).toBe(2);
    expect(first.invalidTrials).toBe(0);
    expect(first.averageCallCount).toBe(0);
    expect(first.aiVersion).toMatch(/^chiitoitsu-ai-/);
    expect(first.debugTrials?.[0]?.some((turn) => turn.pairKindCount != null)).toBe(true);
  });
});

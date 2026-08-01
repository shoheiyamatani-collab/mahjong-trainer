import { describe, expect, it } from "vitest";
import {
  analyzePinfuDiscards,
  aggregatePinfuTrials,
  classifyPinfuWin,
  classifySequenceWait,
  emptyCounts,
  evaluatePinfuProgress,
  parseHand,
  pinfuShanten,
  pinfuWinningTiles,
  runPinfuSimulation,
  shouldPinfuChi,
  shouldPinfuKan,
  shouldPinfuPon,
  shouldPinfuRiichi,
  tileName,
  type Counts34,
  type PinfuMeld,
  type ChantaTrialResult,
} from "../src";

function withPair(hand: string, index: number): Counts34 {
  const counts = parseHand(hand);
  counts[index] = 2;
  return counts;
}

describe("pinfu completion and wait classification", () => {
  it("accepts a closed four-sequence hand only when the actual win is ryanmen", () => {
    expect(classifyPinfuWin(parseHand("23m456m789m123p55s"), "1m")).toMatchObject({
      type: "PINFU",
      waitType: "RYANMEN",
      pairTile: "5s",
      pairType: "SUITED",
    });
    expect(classifyPinfuWin(parseHand("23m456m789m123p55s"), "4m").type).toBe("PINFU");
  });

  it.each([
    ["13m456m789m123p55s", "2m", "KANCHAN"],
    ["12m456m789m123p55s", "3m", "PENCHAN"],
    ["123m456m789m123p5s", "5s", "TANKI"],
    ["123m456m789m55p66s", "5p", "SHANPON"],
  ] as const)("rejects a non-ryanmen completion: %s + %s", (hand, winningTile, waitType) => {
    const result = classifyPinfuWin(parseHand(hand), winningTile);
    expect(result.type).toBe("NONE");
    expect(result.waitTypes).toContain(waitType);
  });

  it("classifies sequence waits at both edges", () => {
    expect(classifySequenceWait(0, 0)).toBe("RYANMEN");
    expect(classifySequenceWait(0, 2)).toBe("PENCHAN");
    expect(classifySequenceWait(3, 4)).toBe("KANCHAN");
    expect(classifySequenceWait(6, 6)).toBe("PENCHAN");
    expect(classifySequenceWait(6, 8)).toBe("RYANMEN");
  });

  it("accepts a valid decomposition when repeated sequences overlap", () => {
    expect(classifyPinfuWin(parseHand("23344m456p789s55s"), "2m").type).toBe("PINFU");
  });

  it("rejects triplets, calls, and value-pair hands", () => {
    expect(classifyPinfuWin(parseHand("11m456m789m123p55s"), "1m").type).toBe("NONE");
    const chi: PinfuMeld[] = [{ kind: "chi", tiles: ["1m", "2m", "3m"] }];
    expect(classifyPinfuWin(parseHand("23m456m789m123p55s"), "1m", chi).type).toBe("NONE");

    for (const valuePairIndex of [27, 28, 31, 32, 33]) {
      const hand = withPair("23m456m789m123p", valuePairIndex);
      expect(classifyPinfuWin(hand, "1m").type).toBe("NONE");
    }
  });

  it("allows non-value winds and responds to round/seat context", () => {
    for (const pairIndex of [29, 30]) {
      const hand = withPair("23m456m789m123p", pairIndex);
      expect(classifyPinfuWin(hand, "1m").type).toBe("PINFU");
    }
    const eastPair = withPair("23m456m789m123p", 27);
    expect(classifyPinfuWin(eastPair, "1m", [], { roundWind: "SOUTH", seatWind: "WEST" }).type).toBe("PINFU");
  });
});

describe("pinfu constrained shanten and policy", () => {
  it("distinguishes live tenpai and iishanten", () => {
    const tenpai = parseHand("23m456m789m123p55s");
    const iishanten = parseHand("23m456m789m12p55s9s");
    expect(pinfuShanten(tenpai)).toBe(0);
    expect(pinfuWinningTiles(tenpai)).toEqual(["1m", "4m", "7m"]);
    expect(evaluatePinfuProgress(tenpai)).toMatchObject({ isTenpai: true, waitKindCount: 3, waitLiveCount: 10 });
    expect(pinfuShanten(iishanten)).toBe(1);
    expect(evaluatePinfuProgress(iishanten).isIishanten).toBe(true);
  });

  it("does not count a dead ryanmen as target tenpai", () => {
    const dead = emptyCounts();
    const evaluation = evaluatePinfuProgress(parseHand("23m456m789m123p55s"), [], dead);
    expect(evaluation.isTenpai).toBe(false);
    expect(evaluation.isPossible).toBe(false);
  });

  it("discards a value honor before a completed sequence or valid pair", () => {
    const hand = parseHand("23m456m789m123p55s");
    hand[27] = 1;
    const best = analyzePinfuDiscards(hand)[0];
    expect(best?.tile).toBe(tileName(27));
    expect(best?.targetShanten).toBe(0);
  });

  it("never calls or declares riichi", () => {
    expect(shouldPinfuChi()).toBe(false);
    expect(shouldPinfuPon()).toBe(false);
    expect(shouldPinfuKan()).toBe(false);
    expect(shouldPinfuRiichi()).toBe(false);
  });
});

describe("pinfu four-player simulation", () => {
  it("aggregates reach order and closed-hand details with valid denominators", () => {
    const trials: ChantaTrialResult[] = [
      {
        outcome: "targetWin",
        targetMeldCount: 0,
        winMethod: "ron",
        pinfuMaximumCompletedSequenceCount: 4,
        pinfuMaximumRyanmenTaatsuCount: 2,
        pinfuWaitKindCountAtTenpai: 2,
        pinfuWaitLiveCountAtTenpai: 6,
        pinfuWinPairType: "SUITED",
        pinfuSkippedNonTargetWinCount: 1,
        progress: {
          reachedTargetIishanten: true,
          reachedTargetTenpai: true,
          reachedTargetWin: true,
          firstIishantenTurn: 2,
          firstTenpaiTurn: 4,
          winTurn: 7,
        },
      },
      {
        outcome: "draw",
        targetMeldCount: 0,
        pinfuMaximumCompletedSequenceCount: 2,
        pinfuMaximumRyanmenTaatsuCount: 3,
        pinfuSkippedNonTargetWinCount: 0,
        progress: { reachedTargetIishanten: true, reachedTargetTenpai: false, reachedTargetWin: false },
      },
      {
        outcome: "invalid",
        targetMeldCount: 0,
        progress: { reachedTargetIishanten: false, reachedTargetTenpai: false, reachedTargetWin: false },
      },
    ];
    const result = aggregatePinfuTrials(trials);
    expect(result.validTrials).toBe(2);
    expect(result.winRate).toBeLessThanOrEqual(result.tenpaiRate);
    expect(result.tenpaiRate).toBeLessThanOrEqual(result.iishantenRate);
    expect(result.closedWinCount).toBe(result.winCount);
    expect(result.openWinCount).toBe(0);
    expect(result.details?.pinfu?.suitedPairWinCount).toBe(1);
    expect(result.details?.pinfu?.skippedNonPinfuWinCount).toBe(1);
    expect(result.details?.pinfu?.averageCallCount).toBe(0);
    expect(result.details?.pinfu?.riichiCount).toBe(0);
  });

  it("repeats the shared-table simulation for the same seed without calls or riichi", () => {
    const input = {
      initialHand: parseHand("23m456m789m12p55s9s"),
      trials: 2,
      seed: 20260718,
      debug: true,
    };
    const first = runPinfuSimulation(input);
    expect(first).toEqual(runPinfuSimulation(input));
    expect(first.validTrials).toBe(2);
    expect(first.invalidTrials).toBe(0);
    expect(first.aiVersion).toMatch(/^pinfu-ai-/);
    expect(first.averageCallCount).toBe(0);
    expect(first.details?.pinfu?.riichiCount).toBe(0);
    expect(first.debugTrials?.[0]?.some((turn) => turn.pinfuWaits != null)).toBe(true);
  });
});

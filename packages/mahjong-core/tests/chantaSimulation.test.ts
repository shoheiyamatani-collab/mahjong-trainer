import { describe, expect, it } from "vitest";
import {
  aggregateChantaTrials,
  chantaShanten,
  chantaWinningTiles,
  emptyCounts,
  evaluateChantaProgress,
  isChantaComplete,
  normalShantenWithOpenMelds,
  parseHand,
  runChantaSimulation,
  updateTargetProgress,
  type ChantaMeld,
  type ChantaTrialResult,
  type TargetProgressState,
} from "../src";

describe("chanta-specific progress", () => {
  it("recognizes a legal chanta completion and its live wait", () => {
    expect(isChantaComplete(parseHand("123789m111p東東東99s"))).toBe(true);
    const tenpai = parseHand("123789m111p東東99s");

    expect(chantaShanten(tenpai)).toBe(0);
    expect(chantaWinningTiles(tenpai)).toContain("東");
    expect(evaluateChantaProgress(tenpai).isTenpai).toBe(true);
  });

  it("recognizes chanta iishanten independently from ordinary useful shapes", () => {
    const hand = parseHand("123789m11p東東99s5s");
    const progress = evaluateChantaProgress(hand);

    expect(chantaShanten(hand)).toBe(1);
    expect(progress.isIishanten).toBe(true);
    expect(progress.effectiveTiles.map((detail) => detail.tile)).toEqual(expect.arrayContaining(["1p", "東"]));
  });

  it("rejects an open meld that makes chanta impossible", () => {
    const melds: ChantaMeld[] = [{ kind: "chi", tiles: ["2m", "3m", "4m"] }];
    const hand = parseHand("789m11p東東99s5s");

    expect(normalShantenWithOpenMelds(hand, 1)).toBeLessThanOrEqual(1);
    expect(chantaShanten(hand, melds)).toBe(Number.POSITIVE_INFINITY);
    expect(evaluateChantaProgress(hand, melds).isPossible).toBe(false);
  });

  it("recognizes iishanten after a chanta-compatible call", () => {
    const melds: ChantaMeld[] = [{ kind: "chi", tiles: ["1m", "2m", "3m"] }];
    const hand = parseHand("789m11p東東99s5s");

    expect(chantaShanten(hand, melds)).toBe(1);
    expect(evaluateChantaProgress(hand, melds).isIishanten).toBe(true);
  });

  it("counts junchan while still rejecting honroutou", () => {
    expect(isChantaComplete(parseHand("123789m123789p99s"))).toBe(true);
    expect(isChantaComplete(parseHand("111999m111p東東東白白"))).toBe(false);
  });

  it("recognizes a live junchan wait without requiring an honor tile", () => {
    const tenpai = parseHand("123789m123789p9s");
    const progress = evaluateChantaProgress(tenpai);

    expect(chantaShanten(tenpai)).toBe(0);
    expect(chantaWinningTiles(tenpai)).toContain("9s");
    expect(progress.isTenpai).toBe(true);
    expect(progress.isIishanten).toBe(true);
  });

  it("does not count a dead chanta wait as reached", () => {
    const tenpai = parseHand("123789m111p東東99s");
    const available = emptyCounts();
    const progress = evaluateChantaProgress(tenpai, [], available);

    expect(progress.shanten).toBe(0);
    expect(progress.isPossible).toBe(false);
    expect(progress.isTenpai).toBe(false);
    expect(progress.isIishanten).toBe(false);
  });

  it("keeps first reach records after the hand retreats", () => {
    const initial: TargetProgressState = {
      reachedTargetIishanten: false,
      reachedTargetTenpai: false,
      reachedTargetWin: false,
    };
    const reached = updateTargetProgress(initial, evaluateChantaProgress(parseHand("123789m111p東東99s")), 4, 18);
    const retreated = updateTargetProgress(reached, evaluateChantaProgress(parseHand("123789m11p東東99s5s")), 7, 29);

    expect(retreated.reachedTargetIishanten).toBe(true);
    expect(retreated.reachedTargetTenpai).toBe(true);
    expect(retreated.firstIishantenTurn).toBe(4);
    expect(retreated.firstTenpaiTurn).toBe(4);
    expect(retreated.firstTenpaiEventOrder).toBe(18);
  });
});

describe("chanta reach aggregation", () => {
  it("uses valid trials as every denominator and preserves reach ordering", () => {
    const trials: ChantaTrialResult[] = [
      trial("targetWin", true, true, 2, 4, 7),
      trial("opponentWin", true, true, 3, 6),
      trial("draw", true, false, 5),
      trial("targetImpossible", false, false),
      trial("invalid", false, false),
    ];
    const result = aggregateChantaTrials(trials);

    expect(result.validTrials).toBe(4);
    expect(result.invalidTrials).toBe(1);
    expect(result.iishantenReachCount).toBe(3);
    expect(result.tenpaiReachCount).toBe(2);
    expect(result.winCount).toBe(1);
    expect(result.iishantenRate).toBe(0.75);
    expect(result.tenpaiRate).toBe(0.5);
    expect(result.winRate).toBe(0.25);
    expect(result.averageFirstIishantenTurn).toBeCloseTo(10 / 3);
    expect(result.averageFirstTenpaiTurn).toBe(5);
    expect(result.practicalTenpaiScore).toBe(50);
    expect(result.tenpaiByTurn6Rate).toBe(0.5);
    expect(result.tenpaiByTurn8Rate).toBe(0.5);
    expect(result.preemptiveTenpaiRate).toBe(0.5);
    expect(result.chasingTenpaiRate).toBe(0);
    expect(result.winRate).toBeLessThanOrEqual(result.tenpaiRate);
    expect(result.tenpaiRate).toBeLessThanOrEqual(result.iishantenRate);
  });

  it("runs deterministic four-player trials without breaking reach ordering", () => {
    const result = runChantaSimulation({
      initialHand: parseHand("12m789m19p789s東東白"),
      trials: 8,
      seed: 20260718,
      debug: true,
    });

    expect(result.totalTrials).toBe(8);
    expect(result.validTrials).toBe(8);
    expect(result.invalidTrials).toBe(0);
    expect(result.winRate).toBeLessThanOrEqual(result.tenpaiRate);
    expect(result.tenpaiRate).toBeLessThanOrEqual(result.iishantenRate);
    expect(result.aiVersion).toMatch(/^chanta-ai-/);
    expect(result.ruleVersion).toMatch(/^starting-hand-rules-/);
    expect(result.debugTrials?.length).toBe(1);
  });
});

function trial(
  outcome: ChantaTrialResult["outcome"],
  iishanten: boolean,
  tenpai: boolean,
  firstIishantenTurn?: number,
  firstTenpaiTurn?: number,
  winTurn?: number,
): ChantaTrialResult {
  return {
    outcome,
    targetMeldCount: 0,
    ...(outcome === "targetWin" ? { winMethod: "tsumo" as const } : {}),
    progress: {
      reachedTargetIishanten: iishanten,
      reachedTargetTenpai: tenpai,
      reachedTargetWin: outcome === "targetWin",
      ...(firstIishantenTurn != null ? { firstIishantenTurn } : {}),
      ...(firstTenpaiTurn != null ? { firstTenpaiTurn } : {}),
      ...(winTurn != null ? { winTurn } : {}),
    },
  };
}

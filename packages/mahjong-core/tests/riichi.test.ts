import { describe, expect, it } from "vitest";
import {
  aggregateRiichiTrials,
  analyzeRiichiDiscards,
  emptyCounts,
  evaluateRiichiLegality,
  evaluateRiichiProgress,
  parseHand,
  riichiShanten,
  riichiWinningTiles,
  runRiichiSimulation,
  shouldDeclareRiichi,
  shouldRiichiChi,
  shouldRiichiKan,
  shouldRiichiPon,
  tileIndex,
  type ChantaTrialResult,
  type RiichiMeld,
} from "../src";

describe("riichi legality and constrained progress", () => {
  const tenpai = parseHand("123m123p123s45s77m");

  it("accepts a closed live tenpai with enough points and wall tiles", () => {
    expect(riichiShanten(tenpai)).toBe(0);
    expect(riichiWinningTiles(tenpai)).toEqual(["3s", "6s"]);
    expect(evaluateRiichiLegality({
      counts: tenpai,
      wallTilesRemaining: 4,
      points: 1_000,
    })).toMatchObject({ legal: true, closed: true, tenpai: true, furiten: false });
  });

  it("rejects an open, short-wall, low-points, or furiten declaration", () => {
    const openMeld: RiichiMeld[] = [{ kind: "chi", tiles: ["1m", "2m", "3m"] }];
    expect(evaluateRiichiLegality({
      counts: tenpai,
      melds: openMeld,
      wallTilesRemaining: 20,
      points: 25_000,
    }).legal).toBe(false);
    expect(shouldDeclareRiichi({ counts: tenpai, wallTilesRemaining: 3, points: 25_000 })).toBe(false);
    expect(shouldDeclareRiichi({ counts: tenpai, wallTilesRemaining: 20, points: 999 })).toBe(false);

    const ownDiscards = emptyCounts();
    ownDiscards[tileIndex("3s")] = 1;
    expect(evaluateRiichiLegality({
      counts: tenpai,
      ownDiscards,
      wallTilesRemaining: 20,
      points: 25_000,
    })).toMatchObject({ legal: false, furiten: true });
  });

  it("does not treat a tenpai with no live waits as a legal declaration", () => {
    const deadWaits = emptyCounts();
    expect(riichiWinningTiles(tenpai, [], deadWaits)).toEqual([]);
    expect(evaluateRiichiLegality({
      counts: tenpai,
      availableCounts: deadWaits,
      wallTilesRemaining: 20,
      points: 25_000,
    })).toMatchObject({ legal: false, tenpai: false, liveWaitCount: 0 });
  });

  it("supports a closed seven-pairs route", () => {
    const chiitoitsuTenpai = parseHand("11m22m33m44p55p66s7s");
    expect(riichiShanten(chiitoitsuTenpai)).toBe(0);
    expect(riichiWinningTiles(chiitoitsuTenpai)).toEqual(["7s"]);
    expect(evaluateRiichiProgress(chiitoitsuTenpai)).toMatchObject({
      isPossible: true,
      isTenpai: true,
      canDeclareRiichi: true,
      chiitoitsuShanten: 0,
    });
  });

  it("selects a discard that reaches legal riichi over a distant shape", () => {
    const choices = analyzeRiichiDiscards(parseHand("123m123p123s45s77m9p"));
    expect(choices[0]).toMatchObject({ tile: "9p", targetShanten: 0, canDeclareRiichi: true });
  });

  it("never calls chi, pon, or kan", () => {
    expect(shouldRiichiChi()).toBe(false);
    expect(shouldRiichiPon()).toBe(false);
    expect(shouldRiichiKan()).toBe(false);
  });
});

describe("riichi simulation and aggregation", () => {
  it("aggregates declaration timing, post-declaration wins, and valid denominators", () => {
    const trials: ChantaTrialResult[] = [
      {
        outcome: "targetWin",
        targetMeldCount: 0,
        winMethod: "ron",
        riichiDeclarationAttempted: true,
        riichiEstablished: true,
        riichiDeclarationTurn: 4,
        riichiDeclarationDiscard: "9p",
        riichiWaitKindCountAtDeclaration: 2,
        riichiWaitLiveCountAtDeclaration: 7,
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
        riichiDeclarationAttempted: true,
        riichiEstablished: true,
        riichiDeclarationTurn: 6,
        riichiWaitKindCountAtDeclaration: 1,
        riichiWaitLiveCountAtDeclaration: 2,
        progress: {
          reachedTargetIishanten: true,
          reachedTargetTenpai: true,
          reachedTargetWin: false,
          firstIishantenTurn: 3,
          firstTenpaiTurn: 6,
        },
      },
      {
        outcome: "opponentWin",
        targetMeldCount: 0,
        riichiDeclarationAttempted: true,
        riichiDeclarationDealIn: true,
        progress: {
          reachedTargetIishanten: true,
          reachedTargetTenpai: false,
          reachedTargetWin: false,
          firstIishantenTurn: 5,
        },
      },
      {
        outcome: "invalid",
        targetMeldCount: 0,
        progress: { reachedTargetIishanten: false, reachedTargetTenpai: false, reachedTargetWin: false },
      },
    ];

    const result = aggregateRiichiTrials(trials);
    expect(result.validTrials).toBe(3);
    expect(result.winRate).toBeCloseTo(1 / 3);
    expect(result.tenpaiRate).toBeCloseTo(2 / 3);
    expect(result.iishantenRate).toBe(1);
    expect(result.winRate).toBeLessThanOrEqual(result.tenpaiRate);
    expect(result.tenpaiRate).toBeLessThanOrEqual(result.iishantenRate);
    expect(result.details?.riichi).toMatchObject({
      declarationAttemptCount: 3,
      declarationCount: 2,
      declarationDealInCount: 1,
      ronWinCount: 1,
      tsumoWinCount: 0,
      furitenRiichiCount: 0,
      averageCallCount: 0,
    });
    expect(result.details?.riichi?.winAfterDeclarationRate).toBe(0.5);
    expect(result.details?.riichi?.averageDeclarationTurn).toBe(5);
  });

  it("repeats the shared-table simulation for the same seed without calls", () => {
    const input = {
      initialHand: parseHand("123m456m123p45s77s"),
      trials: 2,
      seed: 20260718,
      debug: true,
    };
    const first = runRiichiSimulation(input);
    expect(first).toEqual(runRiichiSimulation(input));
    expect(first.validTrials).toBe(2);
    expect(first.invalidTrials).toBe(0);
    expect(first.aiVersion).toMatch(/^riichi-ai-/);
    expect(first.averageCallCount).toBe(0);
    expect(first.closedWinCount).toBe(first.winCount);
    expect(first.details?.riichi?.averageCallCount).toBe(0);
    expect(first.debugTrials?.[0]?.some((turn) => turn.riichiCanDeclare != null)).toBe(true);
  });
});

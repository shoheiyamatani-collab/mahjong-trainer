import { describe, expect, it } from "vitest";
import {
  analyzeFlushDiscards,
  aggregateFlushTrials,
  classifyFlushWin,
  emptyCounts,
  evaluateFlushCandidates,
  evaluateFlushProgress,
  hasHonorMeld,
  isFlushCompatibleMeld,
  lockedFlushSuit,
  parseHand,
  runFlushSimulation,
  type ChantaTrialResult,
  type FlushMeld,
} from "../src";

describe("flush completion classification", () => {
  it("classifies closed and open honitsu", () => {
    expect(classifyFlushWin(parseHand("123456789m東東東白白"))).toEqual({ type: "HONITSU", suit: "MAN" });

    const melds: FlushMeld[] = [{ kind: "chi", tiles: ["1m", "2m", "3m"] }];
    expect(classifyFlushWin(parseHand("456789m東東東白白"), melds)).toEqual({ type: "HONITSU", suit: "MAN" });
  });

  it("classifies closed and open chinitsu without also calling them honitsu", () => {
    expect(classifyFlushWin(parseHand("11123456788899m"))).toEqual({ type: "CHINITSU", suit: "MAN" });

    const melds: FlushMeld[] = [{ kind: "pon", tiles: ["9p", "9p", "9p"] }];
    expect(classifyFlushWin(parseHand("11123456788p"), melds)).toEqual({ type: "CHINITSU", suit: "PIN" });
  });

  it("supports closed seven pairs for both target types", () => {
    expect(classifyFlushWin(parseHand("112233m東東南南西西北北"))).toEqual({ type: "HONITSU", suit: "MAN" });
    expect(classifyFlushWin(parseHand("11223344556677s"))).toEqual({ type: "CHINITSU", suit: "SOU" });
  });

  it("rejects two number suits and all-honor hands", () => {
    expect(classifyFlushWin(parseHand("123m456789p東東東白白")).type).toBe("NONE");
    expect(classifyFlushWin(parseHand("東東東南南南西西西北北北白白")).type).toBe("NONE");
  });
});

describe("flush trial aggregation", () => {
  it("keeps honitsu and chinitsu exclusive and preserves reach ordering", () => {
    const trials: ChantaTrialResult[] = [
      flushTrial("HONITSU", "MAN", 2),
      flushTrial("CHINITSU", "PIN", 0),
      { outcome: "draw", targetMeldCount: 1, progress: { reachedTargetIishanten: true, reachedTargetTenpai: false, reachedTargetWin: false } },
      { outcome: "opponentWin", targetMeldCount: 0, progress: { reachedTargetIishanten: false, reachedTargetTenpai: false, reachedTargetWin: false } },
      { outcome: "invalid", targetMeldCount: 0, progress: { reachedTargetIishanten: false, reachedTargetTenpai: false, reachedTargetWin: false } },
    ];
    const result = aggregateFlushTrials(trials);
    const details = result.details?.flush;

    expect(result.validTrials).toBe(4);
    expect(result.winCount).toBe(2);
    expect(details?.honitsuWinCount).toBe(1);
    expect(details?.chinitsuWinCount).toBe(1);
    expect((details?.honitsuWinCount ?? 0) + (details?.chinitsuWinCount ?? 0)).toBe(result.winCount);
    expect((details?.honitsuWinRate ?? 0) + (details?.chinitsuWinRate ?? 0)).toBe(result.winRate);
    expect(result.winRate).toBeLessThanOrEqual(result.tenpaiRate);
    expect(result.tenpaiRate).toBeLessThanOrEqual(result.iishantenRate);
  });

  it("repeats the same simulation for the same seed", () => {
    const input = { initialHand: parseHand("111234567m東東9p9s"), trials: 2, seed: 20260718, debug: true };
    const first = runFlushSimulation(input);
    expect(first.validTrials).toBe(2);
    expect(first.invalidTrials).toBe(0);
    expect(first.debugTrials?.[0]?.[0]?.flushCandidates).toHaveLength(6);
    expect(first).toEqual(runFlushSimulation(input));
  });
});

function flushTrial(type: "HONITSU" | "CHINITSU", suit: "MAN" | "PIN" | "SOU", calls: number): ChantaTrialResult {
  return {
    outcome: "targetWin",
    targetMeldCount: calls,
    winMethod: "tsumo",
    flushWinType: type,
    selectedSuitAtWin: suit,
    progress: {
      reachedTargetIishanten: true,
      reachedTargetTenpai: true,
      reachedTargetWin: true,
      firstIishantenTurn: 2,
      firstTenpaiTurn: 4,
      winTurn: 6,
    },
  };
}

describe("flush target selection", () => {
  it("selects the structurally strongest number suit", () => {
    const man = evaluateFlushCandidates(parseHand("1112345678m東東9p"))[0];
    const pin = evaluateFlushCandidates(parseHand("1112345678p東東9s"))[0];
    const sou = evaluateFlushCandidates(parseHand("1112345678s東東9m"))[0];

    expect(man?.suit).toBe("MAN");
    expect(pin?.suit).toBe("PIN");
    expect(sou?.suit).toBe("SOU");
  });

  it("locks after a number meld but not after an honor pon", () => {
    const manMeld: FlushMeld[] = [{ kind: "chi", tiles: ["2m", "3m", "4m"] }];
    const honorMeld: FlushMeld[] = [{ kind: "pon", tiles: ["白", "白", "白"] }];

    expect(lockedFlushSuit(manMeld)).toBe("MAN");
    expect(isFlushCompatibleMeld({ kind: "pon", tiles: ["5p", "5p", "5p"] }, manMeld)).toBe(false);
    expect(evaluateFlushCandidates(parseHand("567m22p東東東白白"), manMeld).filter((candidate) => candidate.possible).every((candidate) => candidate.suit === "MAN")).toBe(true);
    expect(lockedFlushSuit(honorMeld)).toBeNull();
    expect(hasHonorMeld(honorMeld)).toBe(true);
    expect(evaluateFlushCandidates(parseHand("123m123p11s東東白"), honorMeld).filter((candidate) => candidate.possible).every((candidate) => candidate.targetType === "HONITSU")).toBe(true);
  });

  it("prefers removing a clear off-suit tile and keeps an honor pair", () => {
    const hand = parseHand("1112345678m東東9p9s");
    const best = analyzeFlushDiscards(hand);
    const accepted = best.filter((choice) => choice.targetShanten === best[0]!.targetShanten && choice.targetUkeireCount === best[0]!.targetUkeireCount).map((choice) => choice.tile);

    expect(accepted).toEqual(expect.arrayContaining(["9p", "9s"]));
    expect(accepted).not.toContain("東");
  });
});

describe("flush-specific waits and reach", () => {
  it("counts only live target waits as flush tenpai", () => {
    const hand = parseHand("123456789m東東東白");
    const live = evaluateFlushProgress(hand);
    const dead = evaluateFlushProgress(hand, [], emptyCounts());

    expect(live.isTenpai).toBe(true);
    expect(live.winningTiles).toEqual(["白"]);
    expect(dead.isTenpai).toBe(false);
    expect(dead.isIishanten).toBe(false);
  });

  it("keeps honitsu and chinitsu effective tiles as one union", () => {
    const hand = parseHand("1122334455667m");
    const progress = evaluateFlushProgress(hand);
    const unique = new Set(progress.effectiveTiles.map((detail) => detail.tile));

    expect(unique.size).toBe(progress.effectiveTiles.length);
  });
});

import { describe, expect, it } from "vitest";
import {
  HAND_TARGET_RANKING_STRATEGIES,
  PINFU_AI_VERSION,
  PRACTICAL_TENPAI_SCORING_VERSION,
  RIICHI_AI_VERSION,
  buildHandTargetRankingCacheKey,
  compareHandTargetRankingItems,
  createHandTargetRanking,
  parseHand,
  runHandTargetRanking,
  runPinfuSimulation,
  sortHandTargetRankingItems,
  type HandTargetRankingRoleId,
  type RoleSimulationResult,
} from "../src";

const ROLE_IDS: HandTargetRankingRoleId[] = [
  "chanta", "flush", "chiitoitsu", "ikkitsuukan", "toitoi", "tanyao", "sanshoku", "riichi",
];

function resultFor(
  roleId: HandTargetRankingRoleId,
  options: Partial<RoleSimulationResult> = {},
): RoleSimulationResult {
  const validTrials = options.validTrials ?? 100;
  const tenpaiRate = options.tenpaiRate ?? 0.4;
  const winRate = options.winRate ?? 0.2;
  const iishantenRate = options.iishantenRate ?? 0.6;
  return {
    roleId,
    roleName: roleId,
    practicalTenpaiScore: 30,
    rawTenpaiRate: tenpaiRate,
    tenpaiByTurn6Count: 10,
    tenpaiByTurn6Rate: 0.1,
    tenpaiByTurn8Count: 20,
    tenpaiByTurn8Rate: 0.2,
    tenpaiByTurn10Count: 30,
    tenpaiByTurn10Rate: 0.3,
    tenpaiByTurn12Count: Math.round(tenpaiRate * validTrials),
    tenpaiByTurn12Rate: tenpaiRate,
    tenpaiByTurn15Count: Math.round(tenpaiRate * validTrials),
    tenpaiByTurn15Rate: tenpaiRate,
    preemptiveTenpaiCount: Math.round(tenpaiRate * validTrials),
    preemptiveTenpaiRate: tenpaiRate,
    chasingTenpaiCount: 0,
    chasingTenpaiRate: 0,
    totalPracticalTenpaiTrialScore: 30,
    totalPracticalTenpaiScoreUnits: 3000,
    practicalTenpaiScoringVersion: PRACTICAL_TENPAI_SCORING_VERSION,
    tenpaiTurnDistribution: {
      throughTurn6Rate: 0.1,
      turn7To9Rate: 0.1,
      turn10To12Rate: Math.max(0, tenpaiRate - 0.2),
      turn13To15Rate: 0,
      turn16PlusRate: 0,
      notReachedRate: 1 - tenpaiRate,
    },
    tenpaiTurnDistributionCounts: {
      throughTurn6Count: 10,
      turn7To9Count: 10,
      turn10To12Count: Math.max(0, Math.round(tenpaiRate * validTrials) - 20),
      turn13To15Count: 0,
      turn16PlusCount: 0,
      notReachedCount: validTrials - Math.round(tenpaiRate * validTrials),
    },
    iishantenReachCount: Math.round(iishantenRate * validTrials),
    iishantenRate,
    averageFirstIishantenTurn: 3,
    tenpaiReachCount: Math.round(tenpaiRate * validTrials),
    tenpaiRate,
    averageFirstTenpaiTurn: 7,
    winCount: Math.round(winRate * validTrials),
    winRate,
    averageWinTurn: 10,
    opponentWinCount: 50,
    opponentWinRate: 0.5,
    drawCount: 10,
    drawRate: 0.1,
    targetImpossibleCount: 0,
    targetImpossibleRate: 0,
    closedWinCount: Math.round(winRate * validTrials),
    openWinCount: 0,
    averageCallCount: 0,
    ronWinCount: Math.round(winRate * validTrials),
    tsumoWinCount: 0,
    totalTrials: validTrials,
    validTrials,
    invalidTrials: 0,
    aiVersion: `${roleId}-ai-test`,
    ruleVersion: "rule-test",
    ...options,
  };
}

describe("starting-hand strategy ranking", () => {
  it("contains exactly seven yaku targets and riichi, but no pinfu", () => {
    expect(HAND_TARGET_RANKING_STRATEGIES).toHaveLength(8);
    expect(HAND_TARGET_RANKING_STRATEGIES.map((strategy) => strategy.id)).toEqual(ROLE_IDS);
    expect(HAND_TARGET_RANKING_STRATEGIES.some((strategy) => strategy.id === ("pinfu" as never))).toBe(false);
    expect(HAND_TARGET_RANKING_STRATEGIES.find((strategy) => strategy.id === "riichi")).toMatchObject({
      category: "RIICHI_TARGET",
      detailPath: "/analysis/starting-hand/riichi",
    });
  });

  it("uses practical tenpai score as the primary ranking axis", () => {
    const results = ROLE_IDS.map((roleId) => resultFor(roleId, roleId === "riichi" ? {
      tenpaiRate: 0.8,
      tenpaiReachCount: 80,
      winRate: 0.05,
      winCount: 5,
      details: {
        riichi: {
          declarationAttemptCount: 10,
          declarationCount: 10,
          declarationRate: 0.1,
          winAfterDeclarationRate: 0.02,
          averageDeclarationTurn: 8,
          averageWaitKindCountAtDeclaration: 1.5,
          averageWaitLiveCountAtDeclaration: 4,
          ronWinCount: 3,
          tsumoWinCount: 2,
          declarationDealInCount: 0,
          skippedPreDeclarationWinCount: 0,
          furitenRiichiCount: 0,
          averageCallCount: 0,
          startingPoints: 25_000,
          riichiCost: 1_000,
          minimumWallTiles: 4,
        },
      },
    } : { tenpaiRate: 0.5, tenpaiReachCount: 50 }));
    results[0] = resultFor("chanta", { practicalTenpaiScore: 45 });

    const ranking = createHandTargetRanking(results);
    expect(ranking[0]).toMatchObject({ roleId: "chanta", practicalTenpaiScore: 45 });
    const riichi = ranking.find((item) => item.roleId === "riichi");
    expect(riichi).toMatchObject({ tenpaiRate: 0.8, strategyCategory: "RIICHI_TARGET" });
    expect(riichi?.riichiDetails).toMatchObject({ declarationRate: 0.1, postRiichiWinRate: 0.02 });
  });

  it("uses preemptive rate, turn-12 rate, total rate, average turn, then existing tie breakers", () => {
    const results = ROLE_IDS.map((roleId) => resultFor(roleId));
    results[1] = resultFor("flush", { preemptiveTenpaiRate: 0.6 });
    results[2] = resultFor("chiitoitsu", { tenpaiByTurn12Rate: 0.7 });
    const ranking = createHandTargetRanking(results);
    expect(ranking.slice(0, 3).map((item) => item.roleId)).toEqual(["flush", "chiitoitsu", "chanta"]);
  });

  it("applies every practical ranking tie breaker without rounding", () => {
    const base = createHandTargetRanking(ROLE_IDS.map((roleId) => resultFor(roleId)))
      .find((item) => item.roleId === "flush")!;
    expect(compareHandTargetRankingItems({ ...base, practicalTenpaiScore: 30.0001 }, base)).toBeLessThan(0);
    expect(compareHandTargetRankingItems({ ...base, preemptiveTenpaiRate: 0.41 }, base)).toBeLessThan(0);
    expect(compareHandTargetRankingItems({ ...base, tenpaiByTurn12Rate: 0.41 }, base)).toBeLessThan(0);
    expect(compareHandTargetRankingItems({ ...base, tenpaiRate: 0.41 }, base)).toBeLessThan(0);
    expect(compareHandTargetRankingItems({ ...base, averageFirstTenpaiTurn: 6.9 }, base)).toBeLessThan(0);
    expect(compareHandTargetRankingItems({ ...base, winRate: 0.21 }, base)).toBeLessThan(0);
    expect(compareHandTargetRankingItems({ ...base, averageFirstTenpaiTurn: null }, base)).toBeGreaterThan(0);
  });

  it("supports each requested ranking view without mutating the stored default order", () => {
    const ranking = createHandTargetRanking(ROLE_IDS.map((roleId, index) => resultFor(roleId, {
      practicalTenpaiScore: 20 + index,
      tenpaiRate: 0.2 + index / 100,
      tenpaiByTurn12Rate: 0.1 + (ROLE_IDS.length - index) / 100,
      preemptiveTenpaiRate: 0.05 + (index % 3) / 100,
      averageFirstTenpaiTurn: 10 - index / 10,
    })));
    const original = ranking.map((item) => item.roleId);
    expect(sortHandTargetRankingItems(ranking, "tenpai")[0]?.roleId).toBe("riichi");
    expect(sortHandTargetRankingItems(ranking, "turn12")[0]?.roleId).toBe("chanta");
    expect(sortHandTargetRankingItems(ranking, "averageTurn")[0]?.roleId).toBe("riichi");
    expect(ranking.map((item) => item.roleId)).toEqual(original);
  });

  it("includes the riichi AI version and excludes the pinfu AI version from the ranking cache key", () => {
    const key = buildHandTargetRankingCacheKey(parseHand("12m789m19p789s東東白"), 100, 12345);
    expect(key).toContain(RIICHI_AI_VERSION);
    expect(key).toContain(PRACTICAL_TENPAI_SCORING_VERSION);
    expect(key).not.toContain(PINFU_AI_VERSION);
  });

  it("keeps pinfu available as a standalone simulation", () => {
    const result = runPinfuSimulation({
      initialHand: parseHand("23m456m789m12p55s9s"),
      trials: 1,
      seed: 12345,
    });
    expect(result.roleId).toBe("pinfu");
    expect(result.aiVersion).toBe(PINFU_AI_VERSION);
  });

  it("runs all eight strategies in the fixed order and reuses the deterministic cache", () => {
    const initialHand = parseHand("12m789m19p789s東東白");
    const progress: HandTargetRankingRoleId[] = [];
    const input = { initialHand, trials: 1, seed: 246810 };
    const first = runHandTargetRanking(input, ({ roleId }) => progress.push(roleId));
    const cachedProgress: HandTargetRankingRoleId[] = [];
    const second = runHandTargetRanking(input, ({ roleId }) => cachedProgress.push(roleId));

    expect(progress).toEqual(ROLE_IDS);
    expect(first.items.map((item) => item.roleId).sort()).toEqual([...ROLE_IDS].sort());
    expect(second).toBe(first);
    expect(cachedProgress).toEqual([]);
  });
});

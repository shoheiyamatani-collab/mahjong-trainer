import {
  CHANTA_AI_VERSION,
  CHANTA_RULE_VERSION,
  OPPONENT_AI_VERSION,
  runChantaSimulation,
  runChiitoitsuSimulation,
  runFlushSimulation,
  runIkkitsuukanSimulation,
  runRiichiSimulation,
  runSanshokuSimulation,
  runTanyaoSimulation,
  runToitoiSimulation,
  type ChantaSimulationInput,
  type RoleSimulationResult,
} from "./chantaSimulation";
import { CHIITOITSU_AI_VERSION } from "./chiitoitsu";
import { FLUSH_AI_VERSION } from "./flush";
import { IKKITSUUKAN_AI_VERSION } from "./ikkitsuukan";
import { RIICHI_AI_VERSION } from "./riichi";
import { SANSHOKU_AI_VERSION } from "./sanshoku";
import { TANYAO_AI_VERSION } from "./tanyao";
import { TOITOI_AI_VERSION } from "./toitoi";
import { PRACTICAL_TENPAI_SCORING_VERSION } from "./practicalTenpai";
import { type Counts34, validateCounts } from "./tiles";
import { LruCache } from "./performance";

export const HAND_TARGET_RANKING_VERSION = "hand-target-ranking-1.2.0";

export type HandTargetRankingSort = "practical" | "tenpai" | "turn12" | "preemptive" | "averageTurn";

export type HandTargetRankingRoleId =
  | "chanta"
  | "flush"
  | "chiitoitsu"
  | "ikkitsuukan"
  | "toitoi"
  | "tanyao"
  | "sanshoku"
  | "riichi";

export type HandTargetStrategyCategory = "YAKU_TARGET" | "RIICHI_TARGET";

export interface HandTargetRankingStrategy {
  id: HandTargetRankingRoleId;
  name: string;
  description: string;
  category: HandTargetStrategyCategory;
  detailPath: string;
  helpAnchor: string;
}

export const HAND_TARGET_RANKING_STRATEGIES: readonly HandTargetRankingStrategy[] = [
  {
    id: "chanta",
    name: "チャンタ",
    description: "すべての面子と雀頭に1・9・字牌を絡める手役",
    category: "YAKU_TARGET",
    detailPath: "/analysis/starting-hand/chanta",
    helpAnchor: "chanta",
  },
  {
    id: "flush",
    name: "染め手",
    description: "ホンイツまたはチンイツを目指す手役",
    category: "YAKU_TARGET",
    detailPath: "/analysis/starting-hand/flush",
    helpAnchor: "flush",
  },
  {
    id: "chiitoitsu",
    name: "七対子",
    description: "異なる7種類の対子を作る門前役",
    category: "YAKU_TARGET",
    detailPath: "/analysis/starting-hand/chiitoitsu",
    helpAnchor: "chiitoitsu",
  },
  {
    id: "ikkitsuukan",
    name: "一気通貫",
    description: "同じ色で123・456・789をそろえる手役",
    category: "YAKU_TARGET",
    detailPath: "/analysis/starting-hand/ikkitsuukan",
    helpAnchor: "ikkitsuukan",
  },
  {
    id: "toitoi",
    name: "対々和",
    description: "4つの刻子と雀頭を作る手役",
    category: "YAKU_TARGET",
    detailPath: "/analysis/starting-hand/toitoi",
    helpAnchor: "toitoi",
  },
  {
    id: "tanyao",
    name: "タンヤオ",
    description: "2〜8の数牌だけでアガる手役",
    category: "YAKU_TARGET",
    detailPath: "/analysis/starting-hand/tanyao",
    helpAnchor: "tanyao",
  },
  {
    id: "sanshoku",
    name: "三色同順",
    description: "3色で同じ数字の順子をそろえる手役",
    category: "YAKU_TARGET",
    detailPath: "/analysis/starting-hand/sanshoku",
    helpAnchor: "sanshoku",
  },
  {
    id: "riichi",
    name: "リーチ",
    description: "門前を維持してリーチ可能なテンパイを目指す戦略",
    category: "RIICHI_TARGET",
    detailPath: "/analysis/starting-hand/riichi",
    helpAnchor: "riichi",
  },
] as const;

export interface HandTargetRankingItem {
  rank: number;
  roleId: HandTargetRankingRoleId;
  roleName: string;
  shortDescription: string;
  practicalTenpaiScore: number;
  practicalTenpaiScoringVersion: string;
  preemptiveTenpaiRate: number;
  chasingTenpaiRate: number;
  tenpaiByTurn6Rate: number;
  tenpaiByTurn8Rate: number;
  tenpaiByTurn10Rate: number;
  tenpaiByTurn12Rate: number;
  tenpaiByTurn15Rate: number;
  tenpaiReachCount: number;
  tenpaiRate: number;
  averageFirstTenpaiTurn: number | null;
  iishantenReachCount: number;
  iishantenRate: number;
  winCount: number;
  winRate: number;
  validTrials: number;
  invalidTrials: number;
  aiVersion: string;
  ruleVersion: string;
  detailPath: string;
  helpAnchor: string;
  strategyCategory: HandTargetStrategyCategory;
  riichiDetails?: {
    declarationRate: number;
    postRiichiWinRate: number | null;
    averageRiichiTurn: number | null;
    averageWaitLiveCountAtDeclaration: number | null;
    ronWinCount: number;
    tsumoWinCount: number;
  };
}

export interface HandTargetRankingResult {
  items: HandTargetRankingItem[];
  roleResults: Partial<Record<HandTargetRankingRoleId, RoleSimulationResult>>;
  trials: number;
  baseSeed: number;
  cacheKey: string;
  rankingVersion: string;
}

export interface HandTargetRankingProgress {
  current: number;
  total: number;
  roleId: HandTargetRankingRoleId;
  roleName: string;
}

const rankingCache = new LruCache<string, HandTargetRankingResult>(12);
const fixedOrder = new Map(HAND_TARGET_RANKING_STRATEGIES.map((strategy, index) => [strategy.id, index]));

const strategyRunners: Record<HandTargetRankingRoleId, (input: ChantaSimulationInput) => RoleSimulationResult> = {
  chanta: runChantaSimulation,
  flush: runFlushSimulation,
  chiitoitsu: runChiitoitsuSimulation,
  ikkitsuukan: runIkkitsuukanSimulation,
  toitoi: runToitoiSimulation,
  tanyao: runTanyaoSimulation,
  sanshoku: runSanshokuSimulation,
  riichi: runRiichiSimulation,
};

export function createHandTargetRanking(
  results: RoleSimulationResult[],
): HandTargetRankingItem[] {
  const byId = new Map(results.map((result) => [result.roleId, result]));
  const items = HAND_TARGET_RANKING_STRATEGIES.map((strategy) => {
    const result = byId.get(strategy.id);
    if (!result) throw new Error(`${strategy.name}の分析結果がありません。`);
    const riichi = strategy.id === "riichi" ? result.details?.riichi : undefined;
    return {
      rank: 0,
      roleId: strategy.id,
      roleName: strategy.name,
      shortDescription: strategy.description,
      practicalTenpaiScore: result.practicalTenpaiScore,
      practicalTenpaiScoringVersion: result.practicalTenpaiScoringVersion,
      preemptiveTenpaiRate: result.preemptiveTenpaiRate,
      chasingTenpaiRate: result.chasingTenpaiRate,
      tenpaiByTurn6Rate: result.tenpaiByTurn6Rate,
      tenpaiByTurn8Rate: result.tenpaiByTurn8Rate,
      tenpaiByTurn10Rate: result.tenpaiByTurn10Rate,
      tenpaiByTurn12Rate: result.tenpaiByTurn12Rate,
      tenpaiByTurn15Rate: result.tenpaiByTurn15Rate,
      tenpaiReachCount: result.tenpaiReachCount,
      tenpaiRate: result.tenpaiRate,
      averageFirstTenpaiTurn: result.averageFirstTenpaiTurn,
      iishantenReachCount: result.iishantenReachCount,
      iishantenRate: result.iishantenRate,
      winCount: result.winCount,
      winRate: result.winRate,
      validTrials: result.validTrials,
      invalidTrials: result.invalidTrials,
      aiVersion: result.aiVersion,
      ruleVersion: result.ruleVersion,
      detailPath: strategy.detailPath,
      helpAnchor: strategy.helpAnchor,
      strategyCategory: strategy.category,
      ...(riichi ? {
        riichiDetails: {
          declarationRate: riichi.declarationRate,
          postRiichiWinRate: riichi.winAfterDeclarationRate,
          averageRiichiTurn: riichi.averageDeclarationTurn,
          averageWaitLiveCountAtDeclaration: riichi.averageWaitLiveCountAtDeclaration,
          ronWinCount: riichi.ronWinCount,
          tsumoWinCount: riichi.tsumoWinCount,
        },
      } : {}),
    } satisfies HandTargetRankingItem;
  });
  return sortHandTargetRankingItems(items, "practical");
}

export function compareHandTargetRankingItems(
  left: HandTargetRankingItem,
  right: HandTargetRankingItem,
): number {
  if (left.practicalTenpaiScore !== right.practicalTenpaiScore) {
    return right.practicalTenpaiScore - left.practicalTenpaiScore;
  }
  if (left.preemptiveTenpaiRate !== right.preemptiveTenpaiRate) {
    return right.preemptiveTenpaiRate - left.preemptiveTenpaiRate;
  }
  if (left.tenpaiByTurn12Rate !== right.tenpaiByTurn12Rate) {
    return right.tenpaiByTurn12Rate - left.tenpaiByTurn12Rate;
  }
  if (left.tenpaiRate !== right.tenpaiRate) return right.tenpaiRate - left.tenpaiRate;
  const leftTurn = left.averageFirstTenpaiTurn ?? Number.POSITIVE_INFINITY;
  const rightTurn = right.averageFirstTenpaiTurn ?? Number.POSITIVE_INFINITY;
  if (leftTurn !== rightTurn) return leftTurn - rightTurn;
  if (left.winRate !== right.winRate) return right.winRate - left.winRate;
  return (fixedOrder.get(left.roleId) ?? 99) - (fixedOrder.get(right.roleId) ?? 99);
}

export function sortHandTargetRankingItems(
  items: readonly HandTargetRankingItem[],
  sort: HandTargetRankingSort,
): HandTargetRankingItem[] {
  const compareSelected = (left: HandTargetRankingItem, right: HandTargetRankingItem): number => {
    if (sort === "tenpai" && left.tenpaiRate !== right.tenpaiRate) return right.tenpaiRate - left.tenpaiRate;
    if (sort === "turn12" && left.tenpaiByTurn12Rate !== right.tenpaiByTurn12Rate) {
      return right.tenpaiByTurn12Rate - left.tenpaiByTurn12Rate;
    }
    if (sort === "preemptive" && left.preemptiveTenpaiRate !== right.preemptiveTenpaiRate) {
      return right.preemptiveTenpaiRate - left.preemptiveTenpaiRate;
    }
    if (sort === "averageTurn") {
      const leftTurn = left.averageFirstTenpaiTurn ?? Number.POSITIVE_INFINITY;
      const rightTurn = right.averageFirstTenpaiTurn ?? Number.POSITIVE_INFINITY;
      if (leftTurn !== rightTurn) return leftTurn - rightTurn;
    }
    return compareHandTargetRankingItems(left, right);
  };
  return [...items]
    .sort(compareSelected)
    .map((item, index) => ({ ...item, rank: index + 1 }));
}

export function buildHandTargetRankingCacheKey(
  hand: Counts34,
  trials: number,
  baseSeed: number,
): string {
  validateCounts(hand, 13);
  return [
    hand.join(","),
    trials,
    baseSeed,
    CHANTA_AI_VERSION,
    FLUSH_AI_VERSION,
    CHIITOITSU_AI_VERSION,
    IKKITSUUKAN_AI_VERSION,
    TOITOI_AI_VERSION,
    TANYAO_AI_VERSION,
    SANSHOKU_AI_VERSION,
    RIICHI_AI_VERSION,
    OPPONENT_AI_VERSION,
    CHANTA_RULE_VERSION,
    HAND_TARGET_RANKING_VERSION,
    PRACTICAL_TENPAI_SCORING_VERSION,
  ].join("|");
}

export function runHandTargetRanking(
  input: ChantaSimulationInput,
  onProgress?: (progress: HandTargetRankingProgress) => void,
): HandTargetRankingResult {
  validateCounts(input.initialHand, 13);
  const baseSeed = input.seed ?? Date.now();
  const cacheKey = buildHandTargetRankingCacheKey(input.initialHand, input.trials, baseSeed);
  const cached = rankingCache.get(cacheKey);
  if (cached && !input.debug) return cached;
  const roleResults: Partial<Record<HandTargetRankingRoleId, RoleSimulationResult>> = {};
  HAND_TARGET_RANKING_STRATEGIES.forEach((strategy, index) => {
    onProgress?.({ current: index + 1, total: HAND_TARGET_RANKING_STRATEGIES.length, roleId: strategy.id, roleName: strategy.name });
    const result = strategyRunners[strategy.id]({ ...input, seed: baseSeed });
    roleResults[strategy.id] = result;
  });
  const ranking = createHandTargetRankingResult(roleResults, input.initialHand, input.trials, baseSeed);
  if (!input.debug) rankingCache.set(cacheKey, ranking);
  return ranking;
}

export function createHandTargetRankingResult(
  roleResults: Partial<Record<HandTargetRankingRoleId, RoleSimulationResult>>,
  hand: Counts34,
  trials: number,
  baseSeed: number,
): HandTargetRankingResult {
  validateCounts(hand, 13);
  const orderedResults = HAND_TARGET_RANKING_STRATEGIES.map((strategy) => {
    const result = roleResults[strategy.id];
    if (!result) throw new Error(`Missing simulation result for ${strategy.id}.`);
    return result;
  });
  return {
    items: createHandTargetRanking(orderedResults),
    roleResults: { ...roleResults },
    trials,
    baseSeed,
    cacheKey: buildHandTargetRankingCacheKey(hand, trials, baseSeed),
    rankingVersion: HAND_TARGET_RANKING_VERSION,
  };
}

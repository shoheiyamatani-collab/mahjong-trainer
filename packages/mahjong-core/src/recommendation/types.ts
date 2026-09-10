import type { Counts34, Suit, Tile } from "../tiles";
import type { HandTargetRankingRoleId } from "../startingHandRanking";
import type { RoleSimulationResult } from "../chantaSimulation";

export type Wind = "東" | "南" | "西" | "北";
export interface StrategySettings {
  roundWind: Wind;
  seatWind: Wind;
  doraIndicator: Tile | null;
}
export const DEFAULT_STRATEGY_SETTINGS: Readonly<StrategySettings> = {
  roundWind: "東", seatWind: "南", doraIndicator: null,
};
export type StrategyCategory = "closed" | "yakuhai" | "sequences" | "flush" | "pairs" | "outside" | "kokushi";
export type StrategyTier = "本線" | "対抗" | "サブ" | "ロマン" | "追わない";
export type StrategyEvidence = Partial<Record<HandTargetRankingRoleId, RoleSimulationResult>>;

export interface HandBlocks {
  melds: number;
  sequences: number;
  taatsu: number;
  ryanmen: number;
  kanchan: number;
  penchan: number;
  pairs: number;
  isolated: number;
}
export interface SequenceSeed {
  start: number;
  tilesBySuit: Tile[][];
  coverage: number;
  completeSuitCount: number;
  weakestSuitCount: number;
}
export interface IttsuSeed {
  suit: Suit;
  tiles: Tile[];
  coverage: number;
  completedSequences: number;
}
export interface YakuhaiSeed { tile: Tile; count: number; han: number; live: number }
export interface HandFeatures {
  counts: Counts34;
  normalShanten: number;
  chiitoitsuShanten: number;
  kokushiShanten: number;
  normalUkeire: number;
  normalEffectiveTiles: Tile[];
  pairKinds: number;
  tripletKinds: number;
  honorCount: number;
  terminalHonorCount: number;
  terminalHonorKinds: number;
  terminalHonorPair: boolean;
  suitCounts: number[];
  blocks: HandBlocks;
  fiveBlockCoverage: number;
  sanshoku: SequenceSeed[];
  ittsu: IttsuSeed[];
  yakuhai: YakuhaiSeed[];
  valuePairKinds: number;
  valueTripletKinds: number;
  valueHonorCount: number;
  dora: Tile | null;
  doraCount: number;
  outsideSeedCount: number;
  iipeikouSeeds: number;
}

export interface StrategyEvaluation {
  id: string;
  name: string;
  category: StrategyCategory;
  tier: StrategyTier;
  overallScore: number;
  speedScore: number;
  winRateScore: number;
  valueScore: number;
  shapeScore: number;
  flexibilityScore: number;
  callScore: number;
  yakuScore: number;
  suitabilityScore: number;
  /** A transparent model estimate, not an exact constrained shanten. */
  estimatedTargetShanten: number;
  commitmentPenalty: number;
  lostDoraCount: number;
  reasons: string[];
  cautions: string[];
  branch: string;
  sourceRoleId?: HandTargetRankingRoleId;
  evidenceScope: "family" | "hand";
  simulation: null | {
    trials: number;
    winRate: number;
    tenpaiRate: number;
    winRateError: number;
    confidence: "低" | "中" | "高";
  };
}
export interface PivotTile {
  tile: Tile;
  strategyId: string;
  strategyName: string;
  scoreDelta: number;
  recommendedDiscard: Tile;
  remaining: number;
  explanation: string;
}
export interface StrategyRecommendation {
  version: string;
  features: HandFeatures;
  strategies: StrategyEvaluation[];
  featured: StrategyEvaluation[];
  type: { name: string; description: string };
  conclusion: string;
  closeCall: string | null;
  pivots: PivotTile[];
  settings: StrategySettings;
}

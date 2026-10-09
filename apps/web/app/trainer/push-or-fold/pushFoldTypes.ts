import type { Counts34, HandScoreResult, OrasuScores, Tile } from "@mahjong-trainer/mahjong-core";
import type { ReplayMeld, ReplayTile, RiverTile } from "@mahjong-trainer/tenhou-analysis/types";
import type { CallDifficulty } from "../call-or-pass/callModel";

export const seats = ["東", "南", "西", "北"] as const;
export type Wind = typeof seats[number];
export type PushFoldAction = "push" | "fold";
export const actionLabels = { push: "押す", fold: "オリる" };
export const strengthLabels = { clear: "教材上の推奨が明確", lean_push: "押し寄り", lean_fold: "オリ寄り", debatable: "判断が分かれる" };
export const categoryLabels = { distance: "進行度", value: "打点", shape: "待ち・受け入れ", defense: "安全情報", attacks: "複数攻撃・副露", conditions: "着順条件", endgame: "終盤・流局" };
export type PushFoldCategory = keyof typeof categoryLabels;
export type PushFoldPlayer = { seat: Wind; river: RiverTile[]; melds: ReplayMeld[]; riichi: { tileId: number; turn: number } | null; attacking: boolean };
export type PushFoldQuestion = {
  id: string; version: 1; difficulty: CallDifficulty; category: PushFoldCategory; title: string;
  roundWind: "東" | "南"; roundNumber: number; honba: number; riichiSticks: number; turn: number;
  seatWind: Wind; scores: [number, number, number, number]; hand: ReplayTile[]; drawnTileId: number;
  doraIndicators: ReplayTile[]; players: PushFoldPlayer[]; wallTilesRemaining: number;
  rules: { redFives: true; openTanyao: true; tiePolicy: "strict"; agariYame: false };
  recommendedAction: PushFoldAction; recommendationStrength: keyof typeof strengthLabels;
  acceptableActions: PushFoldAction[]; discards: Record<PushFoldAction, number[]>; declareRiichi: boolean;
  context: string; valuePlan: string; reasoning: string[]; changes: string[];
  pushBenefits: string[]; pushRisks: string[]; foldBenefits: string[]; foldCosts: string[];
  targetRank?: 1 | 2 | 3;
  sources: string[]; review: { status: "verified" | "draft"; method: string; at: string };
  expected: { pushShanten: number; waits?: Tile[]; minimumRon?: number; maximumRon?: number };
};
export type SafetyFacts = {
  opponent: Wind; genbutsu: boolean; suji: boolean; noChance: Tile[]; oneChance: Tile[];
  publicCopies: number; dora: boolean; red: boolean; possibleWaits: string[];
  labels: string[]; reason: string;
};
export type PushFoldValue = Pick<HandScoreResult["score"], "han" | "fu" | "payments" | "totalPoints"> & { yaku: string[] };
export type PushFoldWait = { tile: Tile; red: boolean; remaining: number; ron: PushFoldValue | null; tsumo: PushFoldValue | null };
export type PushFoldBranch = {
  discard: ReplayTile; hand: ReplayTile[]; counts: Counts34; shanten: number;
  ukeire: { tile: Tile; remaining: number }[]; ukeireCount: number; waits: Tile[]; values: PushFoldWait[];
  furiten: boolean; canRiichi: boolean; dora: number; redDora: number; meldYaku: string[];
  safety: SafetyFacts[]; safeToAll: boolean;
};
export type PushFoldOutcome = { label: string; scores: OrasuScores; rank: number; tied: boolean; achieved: boolean; dealerContinues: boolean };
export type PreparedPushFoldQuestion = {
  question: PushFoldQuestion; branches: PushFoldBranch[]; ranking: { seat: Wind; score: number; rank: number; tied: boolean }[];
  safeCopies: number; outcomes: PushFoldOutcome[]; drawCases: { label: string; pushGain: number; foldLoss: number; pushRank: number; foldRank: number }[];
  checkerHref: string | null;
};

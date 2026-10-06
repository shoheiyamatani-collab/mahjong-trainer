import type { Tile, extractHandBlocks } from "@mahjong-trainer/mahjong-core";
import type { CATEGORY_LABELS } from "./labels";

export type ReplayTile = { id: number; tile: Tile; red: boolean };
export type SourceType = "tenhou" | "synthetic";
export type LogSource = { sourceType: SourceType; logId: string; date: string | null; url: string | null };
export type MeldKind = "chi" | "pon" | "ankan" | "daiminkan" | "kakan";
export type ReplayMeld = { kind: MeldKind; tiles: ReplayTile[]; from: number; calledTile: ReplayTile | null };
export type RiverTile = { tile: ReplayTile; turn: number; sequence: number; tsumogiri: boolean; riichi: boolean; calledBy: number | null };
export type PlayerSnapshot = { player: number; hand: ReplayTile[]; melds: ReplayMeld[]; river: RiverTile[]; riichi: boolean };
export type RoundInfo = { index: number; round: string; roundWind: Tile; dealer: number; honba: number; riichiSticks: number; scores: number[] };
type EventBase = { sequence: number; roundIndex: number; snapshots: PlayerSnapshot[] };
export type ReplayEvent = EventBase & (
  | { type: "init"; initialHands: ReplayTile[][] }
  | { type: "draw"; player: number; tile: ReplayTile; turn: number; handBefore: ReplayTile[]; handAfter: ReplayTile[]; rinshan: boolean }
  | { type: "discard"; player: number; tile: ReplayTile; turn: number; tsumogiri: boolean; riichi: boolean; handBeforeDraw: ReplayTile[] | null; handBeforeDiscard: ReplayTile[]; handAfterDiscard: ReplayTile[]; visibleTiles: ReplayTile[] }
  | { type: "call"; player: number; meld: ReplayMeld; handBefore: ReplayTile[]; handAfter: ReplayTile[]; robbed: boolean }
  | { type: "reach"; player: number; step: 1 | 2 }
  | { type: "dora"; tile: ReplayTile }
  | { type: "win"; player: number; from: number; method: "ron" | "tsumo"; tile: ReplayTile; winningHand: ReplayTile[]; chankan: boolean }
  | { type: "draw-game"; reason: string }
);
export type DiscardEvent = Extract<ReplayEvent, { type: "discard" }>;
export type ParsedRound = { info: RoundInfo; doraIndicators: ReplayTile[]; events: ReplayEvent[]; ended: boolean };
export type ParsedLog = { version: "2.3"; source: LogSource; table: "houou" | "other"; redFives: boolean; rounds: ParsedRound[] };
export type HandBlock = { kind: "sequence" | "triplet" | "pair" | "ryanmen" | "penchan" | "kanchan" | "isolated"; tiles: Tile[] };
export type HandAnalysis = { shanten: number; normalShanten: number; tenpai: boolean; waits: Tile[]; waitKind: "tanki" | "other" | null; blocks: HandBlock[]; blockStructure: ReturnType<typeof extractHandBlocks>; meldCandidates: HandBlock[]; taatsuCandidates: HandBlock[]; headCandidates: Tile[]; isolated: Tile[]; ukeire: Tile[]; ukeireCount: number; ukeireBasis: "own-hand-and-public-tiles" };
export type QuestionCategory = keyof typeof CATEGORY_LABELS;
export type QuestionStep = { sequence: number; type: "discard" | "call"; turn: number; tile: ReplayTile; tsumogiri: boolean | null; meld: ReplayMeld | null; handBeforeDraw: ReplayTile[] | null; handBefore: ReplayTile[]; handAfter: ReplayTile[]; meldsBefore: ReplayMeld[]; meldsAfter: ReplayMeld[]; before: HandAnalysis; after: HandAnalysis; shantenBeforeDraw: number | null };
export type QualityFlag = "ambiguousShape" | "tooEarly" | "lowLearningValue" | "complexCall" | "uncertainAnalysis";
export type TedashiQuestion = {
  id: string;
  status: "candidate" | "approved" | "rejected";
  source: LogSource & { platform: "tenhou"; table: "houou" | "other"; round: string; honba: number; seat: Tile; player: number; turn: number; eventSequence: number; doraIndicators: ReplayTile[] };
  river: RiverTile[];
  focusDiscard: RiverTile;
  actual: { handBeforeDraw: ReplayTile[] | null; handBefore: ReplayTile[]; handAfter: ReplayTile[]; drawnTile: ReplayTile | null; melds: ReplayMeld[]; before: HandAnalysis; after: HandAnalysis; shantenBeforeDraw: number | null };
  analysis: { category: QuestionCategory; clarityScore: number; summary: string; reading: string; focusBlocks: HandBlock[]; retainedMelds: HandBlock[]; followingTsumogiri: number; ambiguityReasons: string[] };
  difficulty: "easy" | "normal" | "hard";
  qualityFlags: QualityFlag[];
  prompt: string;
  choices: Array<{ id: string; text: string }>;
  answer: string;
  steps?: QuestionStep[];
  referenceUrl?: string;
  contentHash: string;
  selection?: { score: number; reasons: string[]; priority: "S" | "A"; referenceMatched: boolean };
  review?: { contentHash: string; reviewedAt: string; permissionReference: string };
};

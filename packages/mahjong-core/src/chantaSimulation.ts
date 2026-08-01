import { calculateHandScore, type HandScoreMeld } from "./handScore";
import { normalShantenWithOpenMelds } from "./shanten";
import { LruCache, incrementSimulationCounter } from "./performance";
import {
  aggregatePracticalTenpaiMetrics,
  assertPracticalTenpaiMetrics,
  calculatePracticalTenpaiTrialScore,
  type PracticalTenpaiMetrics,
  type PracticalTenpaiScoreInput,
} from "./practicalTenpai";
import {
  CHIITOITSU_AI_VERSION,
  analyzeChiitoitsuDiscards,
  chiitoitsuPairKindCount,
  chiitoitsuShanten,
  evaluateChiitoitsuProgress,
  isChiitoitsuComplete,
  selectBestChiitoitsuDiscard,
  type ChiitoitsuDiscardEvaluation,
  type ChiitoitsuProgressEvaluation,
} from "./chiitoitsu";
import {
  IKKITSUUKAN_AI_VERSION,
  analyzeIkkitsuukanDiscards,
  classifyIkkitsuukanWin,
  countOpenIkkitsuukanMelds,
  evaluateIkkitsuukanProgress,
  ikkitsuukanShanten,
  isIkkitsuukanCompatibleMeld,
  selectBestIkkitsuukanDiscard,
  type IkkitsuukanCandidateEvaluation,
  type IkkitsuukanDiscardEvaluation,
  type IkkitsuukanProgressEvaluation,
  type IkkitsuukanSuit,
} from "./ikkitsuukan";
import {
  TOITOI_AI_VERSION,
  analyzeToitoiDiscards,
  evaluateToitoiPonDecision,
  evaluateToitoiProgress,
  isToitoiCompatibleMeld,
  isToitoiComplete,
  selectBestToitoiDiscard,
  toitoiShanten,
  type ToitoiDiscardEvaluation,
  type ToitoiPonDecision,
  type ToitoiProgressEvaluation,
  type ToitoiWaitType,
} from "./toitoi";
import {
  DEFAULT_PINFU_ROUND_CONTEXT,
  PINFU_AI_VERSION,
  analyzePinfuDiscards,
  classifyPinfuWin,
  evaluatePinfuProgress,
  pinfuShanten,
  selectBestPinfuDiscard,
  type PinfuDiscardEvaluation,
  type PinfuProgressEvaluation,
} from "./pinfu";
import {
  DEFAULT_TANYAO_RULE_CONFIG,
  TANYAO_AI_VERSION,
  analyzeTanyaoDiscards,
  classifyTanyaoWin,
  evaluateTanyaoCallDecision,
  evaluateTanyaoProgress,
  isTanyaoCompatibleMeld,
  selectBestTanyaoDiscard,
  tanyaoShanten,
  type TanyaoCallDecision,
  type TanyaoDiscardEvaluation,
  type TanyaoProgressEvaluation,
  type TanyaoShape,
} from "./tanyao";
import {
  SANSHOKU_AI_VERSION,
  analyzeSanshokuDiscards,
  classifySanshokuWin,
  countOpenSanshokuMelds,
  evaluateSanshokuCallDecision,
  evaluateSanshokuProgress,
  isSanshokuCompatibleMeld,
  sanshokuShanten,
  selectBestSanshokuDiscard,
  type SanshokuCallDecision,
  type SanshokuCandidateEvaluation,
  type SanshokuDiscardEvaluation,
  type SanshokuProgressEvaluation,
  type SanshokuSequenceStart,
} from "./sanshoku";
import {
  DEFAULT_RIICHI_RULE_CONFIG,
  RIICHI_AI_VERSION,
  analyzeRiichiDiscards,
  evaluateRiichiProgress,
  isRiichiComplete,
  riichiShanten,
  selectBestRiichiDiscard,
  shouldDeclareRiichi,
  type RiichiDiscardEvaluation,
  type RiichiProgressEvaluation,
} from "./riichi";
import {
  FLUSH_AI_VERSION,
  analyzeFlushDiscards,
  classifyFlushWin,
  evaluateFlushCandidates,
  evaluateFlushProgress,
  flushShanten,
  isFlushCompatibleMeld,
  lockedFlushSuit,
  selectBestFlushDiscard,
  type FlushCandidateEvaluation,
  type FlushDiscardEvaluation,
  type FlushProgressEvaluation,
  type FlushSuit,
  type FlushTargetType,
  type FlushWinType,
} from "./flush";
import {
  TILE_NAMES,
  type Counts34,
  type Tile,
  countsToTiles,
  emptyCounts,
  sumCounts,
  tileIndex,
  tileName,
  validateCounts,
} from "./tiles";

export const CHANTA_AI_VERSION = "chanta-ai-1.1.0";
export const CHANTA_RULE_VERSION = "starting-hand-rules-1.3.0";
export const OPPONENT_AI_VERSION = "fastest-opponent-ai-1.0.0";

export type ChantaMeldKind = "chi" | "pon";

export interface ChantaMeld {
  kind: ChantaMeldKind;
  tiles: Tile[];
}

export interface TargetProgressState {
  reachedTargetIishanten: boolean;
  reachedTargetTenpai: boolean;
  reachedTargetWin: boolean;
  firstIishantenTurn?: number;
  firstTenpaiTurn?: number;
  firstTenpaiEventOrder?: number;
  firstOpponentRiichiTurn?: number;
  firstOpponentRiichiEventOrder?: number;
  opponentWinTurn?: number;
  opponentWinEventOrder?: number;
  winTurn?: number;
}

export interface ChantaEffectiveTile {
  tile: Tile;
  remaining: number;
  resultingShanten: number;
  discards: Tile[];
}

export interface ChantaProgressEvaluation {
  shanten: number;
  isPossible: boolean;
  isIishanten: boolean;
  isTenpai: boolean;
  winningTiles: Tile[];
  effectiveTiles: ChantaEffectiveTile[];
}

export interface ChantaDebugTurn {
  turn: number;
  normalShanten: number;
  targetShanten: number;
  reachedTargetIishanten: boolean;
  reachedTargetTenpai: boolean;
  firstIishantenTurn?: number;
  firstTenpaiTurn?: number;
  firstTenpaiEventOrder?: number;
  firstOpponentRiichiTurn?: number;
  firstOpponentRiichiEventOrder?: number;
  opponentWinTurn?: number;
  opponentWinEventOrder?: number;
  practicalTenpaiTurnWeight?: number;
  practicalTenpaiSituationWeight?: number;
  practicalTenpaiTrialScore?: number;
  practicalTenpaiSituation?: "BEFORE_OPPONENT_RIICHI" | "AFTER_OPPONENT_RIICHI" | "NOT_REACHED";
  trialOutcome?: ChantaTrialOutcome;
  targetEffectiveTiles: ChantaEffectiveTile[];
  differenceReason: string | null;
  hand?: Tile[];
  melds?: ChantaMeld[];
  selectedSuit?: FlushSuit | null;
  fixedSuit?: FlushSuit | null;
  honitsuPossible?: boolean;
  chinitsuPossible?: boolean;
  flushCandidates?: FlushCandidateEvaluation[];
  bestTargetType?: FlushTargetType;
  targetUkeireCount?: number;
  selectedDiscard?: Tile;
  discardEvaluations?: FlushDiscardEvaluation[];
  decisionReason?: string;
  pairKindCount?: number;
  uniqueKindCount?: number;
  chiitoitsuWaits?: Tile[];
  chiitoitsuWaitLiveCount?: number;
  chiitoitsuDiscardEvaluations?: ChiitoitsuDiscardEvaluation[];
  ikkitsuukanCandidates?: IkkitsuukanCandidateEvaluation[];
  ikkitsuukanDiscardEvaluations?: IkkitsuukanDiscardEvaluation[];
  ikkitsuukanLockedSuit?: IkkitsuukanSuit | null;
  completedRequiredSequenceCount?: number;
  completedSequenceCount?: number;
  requiredSequenceSlots?: number;
  remainingMeldSlots?: number;
  lowSequenceProgress?: number;
  middleSequenceProgress?: number;
  highSequenceProgress?: number;
  toitoiDiscardEvaluations?: ToitoiDiscardEvaluation[];
  completedTripletCount?: number;
  openTripletCount?: number;
  promotablePairCount?: number;
  headCandidateCount?: number;
  liveSingletonCount?: number;
  excessFourthTileCount?: number;
  toitoiWaitType?: ToitoiWaitType | null;
  toitoiWaits?: Tile[];
  toitoiWaitLiveCount?: number;
  toitoiCallDecision?: ToitoiPonDecision & { tile: Tile };
  pinfuDiscardEvaluations?: PinfuDiscardEvaluation[];
  pinfuWaits?: Tile[];
  pinfuWaitKindCount?: number;
  pinfuWaitLiveCount?: number;
  ryanmenTaatsuCount?: number;
  kanchanTaatsuCount?: number;
  penchanTaatsuCount?: number;
  validPairCandidateCount?: number;
  valuePairCount?: number;
  skippedNonPinfuWinCount?: number;
  tanyaoDiscardEvaluations?: TanyaoDiscardEvaluation[];
  tanyaoWaits?: Tile[];
  tanyaoWaitKindCount?: number;
  tanyaoWaitLiveCount?: number;
  terminalHonorCount?: number;
  simpleTileCount?: number;
  simpleTaatsuCount?: number;
  simplePairCount?: number;
  simpleTripletCount?: number;
  tanyaoBestShape?: TanyaoShape | null;
  tanyaoStandardShanten?: number;
  tanyaoChiitoitsuShanten?: number;
  tanyaoCallDecision?: TanyaoCallDecision & { meld: ChantaMeld };
  skippedNonTanyaoWinCount?: number;
  sanshokuCandidates?: SanshokuCandidateEvaluation[];
  sanshokuDiscardEvaluations?: SanshokuDiscardEvaluation[];
  sanshokuBestSequenceStart?: SanshokuSequenceStart | null;
  sanshokuLockedSequenceStart?: SanshokuSequenceStart | null;
  sanshokuManProgress?: number;
  sanshokuPinProgress?: number;
  sanshokuSouProgress?: number;
  sanshokuWaits?: Tile[];
  sanshokuWaitKindCount?: number;
  sanshokuWaitLiveCount?: number;
  sanshokuCallDecision?: SanshokuCallDecision & { meld: ChantaMeld };
  skippedNonSanshokuWinCount?: number;
  riichiDiscardEvaluations?: RiichiDiscardEvaluation[];
  riichiWaits?: Tile[];
  riichiWaitKindCount?: number;
  riichiWaitLiveCount?: number;
  riichiCanDeclare?: boolean;
  riichiFuriten?: boolean;
  riichiPoints?: number;
  riichiWallTilesRemaining?: number;
  riichiDeclarationAttempted?: boolean;
  riichiDeclarationTile?: Tile;
  riichiEstablished?: boolean;
  riichiEstablishedTurn?: number;
  riichiSkippedPreDeclarationWinCount?: number;
}

export type ChantaTrialOutcome = "targetWin" | "opponentWin" | "draw" | "targetImpossible" | "invalid";

export interface ChantaTrialResult {
  outcome: ChantaTrialOutcome;
  progress: TargetProgressState;
  targetMeldCount: number;
  winMethod?: "ron" | "tsumo";
  debugTurns?: ChantaDebugTurn[];
  flushWinType?: FlushWinType;
  selectedSuitAtWin?: FlushSuit | null;
  targetChiCount?: number;
  targetPonCount?: number;
  finalTargetShanten?: number;
  initialPairKindCount?: number;
  maximumPairKindCount?: number;
  finalPairKindCount?: number;
  waitChangeCount?: number;
  waitLiveCountAtTenpai?: number;
  ikkitsuukanWinSuit?: IkkitsuukanSuit | null;
  openRequiredSequenceCount?: number;
  openExtraMeldCount?: number;
  maximumCompletedRequiredSequenceCount?: number;
  toitoiInitialPairKindCount?: number;
  toitoiMaximumPairKindCount?: number;
  toitoiInitialTripletKindCount?: number;
  toitoiMaximumTripletKindCount?: number;
  toitoiWaitTypeAtTenpai?: ToitoiWaitType | null;
  toitoiWaitLiveCountAtTenpai?: number;
  toitoiWinWaitType?: ToitoiWaitType | null;
  pinfuMaximumCompletedSequenceCount?: number;
  pinfuMaximumRyanmenTaatsuCount?: number;
  pinfuWaitKindCountAtTenpai?: number;
  pinfuWaitLiveCountAtTenpai?: number;
  pinfuWinPairType?: "SUITED" | "NON_VALUE_WIND" | null;
  pinfuSkippedNonTargetWinCount?: number;
  tanyaoInitialTerminalHonorCount?: number;
  tanyaoMinimumTerminalHonorCount?: number;
  tanyaoMaximumCompletedSimpleMeldCount?: number;
  tanyaoMaximumSimpleTaatsuCount?: number;
  tanyaoMaximumRyanmenTaatsuCount?: number;
  tanyaoWaitKindCountAtTenpai?: number;
  tanyaoWaitLiveCountAtTenpai?: number;
  tanyaoWinShape?: TanyaoShape | null;
  tanyaoSkippedNonTargetWinCount?: number;
  sanshokuWinSequenceStart?: SanshokuSequenceStart | null;
  sanshokuOpenRequiredSequenceCount?: number;
  sanshokuOpenExtraMeldCount?: number;
  sanshokuMaximumCompletedRequiredSequenceCount?: number;
  sanshokuWaitKindCountAtTenpai?: number;
  sanshokuWaitLiveCountAtTenpai?: number;
  sanshokuSkippedNonTargetWinCount?: number;
  riichiDeclarationAttempted?: boolean;
  riichiEstablished?: boolean;
  riichiDeclarationTurn?: number;
  riichiDeclarationDiscard?: Tile;
  riichiDeclarationDealIn?: boolean;
  riichiWaitKindCountAtDeclaration?: number;
  riichiWaitLiveCountAtDeclaration?: number;
  riichiSkippedPreDeclarationWinCount?: number;
}

export interface FlushResultDetails {
  honitsuWinCount: number;
  honitsuWinRate: number;
  chinitsuWinCount: number;
  chinitsuWinRate: number;
  manSuitWinCount: number;
  pinSuitWinCount: number;
  souSuitWinCount: number;
  honitsuAverageCallCount: number;
  chinitsuAverageCallCount: number;
  averageChiCount: number;
  averagePonCount: number;
}

export interface ChiitoitsuResultDetails {
  averageInitialPairKindCount: number;
  averageMaximumPairKindCount: number;
  averageFinalPairKindCount: number;
  averageWaitChangeCount: number;
  averageLiveWaitCountAtTenpai: number;
}

export interface IkkitsuukanResultDetails {
  manSuitWinCount: number;
  pinSuitWinCount: number;
  souSuitWinCount: number;
  averageRequiredSequenceCallCount: number;
  averageExtraMeldCallCount: number;
  averageMaximumCompletedRequiredSequenceCount: number;
}

export interface ToitoiResultDetails {
  closedWinCount: number;
  openWinCount: number;
  ronWinCount: number;
  tsumoWinCount: number;
  shanponWinCount: number;
  tankiWinCount: number;
  averagePonCount: number;
  averageChiCount: number;
  averageInitialPairKindCount: number;
  averageMaximumPairKindCount: number;
  averageInitialTripletKindCount: number;
  averageMaximumTripletKindCount: number;
  averageWaitLiveCountAtTenpai: number | null;
  averageOpenTripletCountAtWin: number;
}

export interface PinfuResultDetails {
  averageWaitKindCountAtTenpai: number | null;
  averageWaitLiveCountAtTenpai: number | null;
  averageMaximumCompletedSequenceCount: number;
  averageMaximumRyanmenTaatsuCount: number;
  suitedPairWinCount: number;
  nonValueWindPairWinCount: number;
  skippedNonPinfuWinCount: number;
  averageCallCount: number;
  riichiCount: number;
}

export interface TanyaoResultDetails {
  closedWinCount: number;
  openWinCount: number;
  standardWinCount: number;
  chiitoitsuWinCount: number;
  ronWinCount: number;
  tsumoWinCount: number;
  averageCallCount: number;
  averageChiCount: number;
  averagePonCount: number;
  averageInitialTerminalHonorCount: number;
  averageMinimumTerminalHonorCount: number;
  averageMaximumCompletedSimpleMeldCount: number;
  averageMaximumSimpleTaatsuCount: number;
  averageMaximumRyanmenTaatsuCount: number;
  averageTargetWaitKindCountAtTenpai: number | null;
  averageTargetWaitLiveCountAtTenpai: number | null;
  skippedNonTanyaoWinCount: number;
  riichiCount: 0;
  openTanyaoEnabled: true;
}

export interface SanshokuResultDetails {
  closedWinCount: number;
  openWinCount: number;
  ronWinCount: number;
  tsumoWinCount: number;
  sequence123WinCount: number;
  sequence234WinCount: number;
  sequence345WinCount: number;
  sequence456WinCount: number;
  sequence567WinCount: number;
  sequence678WinCount: number;
  sequence789WinCount: number;
  averageCallCount: number;
  averageRequiredSequenceCallCount: number;
  averageExtraMeldCallCount: number;
  averageMaximumCompletedRequiredSequenceCount: number;
  averageTargetWaitKindCountAtTenpai: number | null;
  averageTargetWaitLiveCountAtTenpai: number | null;
  skippedNonSanshokuWinCount: number;
  riichiCount: 0;
}

export interface RiichiResultDetails {
  declarationAttemptCount: number;
  declarationCount: number;
  declarationRate: number;
  winAfterDeclarationRate: number | null;
  averageDeclarationTurn: number | null;
  averageWaitKindCountAtDeclaration: number | null;
  averageWaitLiveCountAtDeclaration: number | null;
  ronWinCount: number;
  tsumoWinCount: number;
  declarationDealInCount: number;
  skippedPreDeclarationWinCount: number;
  furitenRiichiCount: 0;
  averageCallCount: 0;
  startingPoints: number;
  riichiCost: number;
  minimumWallTiles: number;
}

export interface RoleSimulationResult extends PracticalTenpaiMetrics {
  roleId: string;
  roleName: string;
  iishantenReachCount: number;
  iishantenRate: number;
  averageFirstIishantenTurn: number | null;
  tenpaiReachCount: number;
  tenpaiRate: number;
  averageFirstTenpaiTurn: number | null;
  winCount: number;
  winRate: number;
  averageWinTurn: number | null;
  opponentWinCount: number;
  opponentWinRate: number;
  drawCount: number;
  drawRate: number;
  targetImpossibleCount: number;
  targetImpossibleRate: number;
  closedWinCount: number;
  openWinCount: number;
  averageCallCount: number;
  ronWinCount: number;
  tsumoWinCount: number;
  totalTrials: number;
  validTrials: number;
  invalidTrials: number;
  aiVersion: string;
  ruleVersion: string;
  debugTrials?: ChantaDebugTurn[][];
  details?: {
    flush?: FlushResultDetails;
    chiitoitsu?: ChiitoitsuResultDetails;
    ikkitsuukan?: IkkitsuukanResultDetails;
    toitoi?: ToitoiResultDetails;
    pinfu?: PinfuResultDetails;
    tanyao?: TanyaoResultDetails;
    sanshoku?: SanshokuResultDetails;
    riichi?: RiichiResultDetails;
  };
}

export interface ChantaSimulationInput {
  initialHand: Counts34;
  trials: number;
  seed?: number;
  debug?: boolean;
  debugTrialLimit?: number;
}

export type SimulationRoleId = "chanta" | "flush" | "chiitoitsu" | "ikkitsuukan" | "toitoi" | "pinfu" | "tanyao" | "sanshoku" | "riichi";

export interface RoleSimulationCheckpoint {
  roleId: SimulationRoleId;
  completedTrials: number;
  randomState: number;
  result: RoleSimulationResult;
}

export interface RoleSimulationSession {
  readonly roleId: SimulationRoleId;
  readonly completedTrials: number;
  runBatch(batchSize: number): RoleSimulationResult;
  getResult(): RoleSimulationResult | null;
  createCheckpoint(): RoleSimulationCheckpoint | null;
}

interface RegionOption {
  needed: Array<[number, number]>;
  melds: number;
  pairs: number;
  hasSequence: boolean;
  hasHonor: boolean;
}

interface FixedContext {
  counts: Counts34;
  meldCount: number;
  hasSequence: boolean;
  hasHonor: boolean;
  valid: boolean;
}

interface PlayerState {
  counts: Counts34;
  melds: ChantaMeld[];
  riichi: boolean;
  temporaryTargetFuriten: boolean;
  ownDiscards: Counts34;
  chiitoitsuStats?: {
    initialPairKindCount: number;
    maximumPairKindCount: number;
    lastWaitIndex: number | null;
    waitChangeCount: number;
    waitLiveCountAtTenpai: number;
  };
  ikkitsuukanStats?: {
    maximumCompletedRequiredSequenceCount: number;
  };
  toitoiStats?: {
    initialPairKindCount: number;
    maximumPairKindCount: number;
    initialTripletKindCount: number;
    maximumTripletKindCount: number;
    waitTypeAtTenpai: ToitoiWaitType | null;
    waitLiveCountAtTenpai: number;
  };
  toitoiCallDecision?: ToitoiPonDecision & { tile: Tile };
  pinfuStats?: {
    maximumCompletedSequenceCount: number;
    maximumRyanmenTaatsuCount: number;
    waitKindCountAtTenpai: number;
    waitLiveCountAtTenpai: number;
    skippedNonTargetWinCount: number;
  };
  tanyaoStats?: {
    initialTerminalHonorCount: number;
    minimumTerminalHonorCount: number;
    maximumCompletedSimpleMeldCount: number;
    maximumSimpleTaatsuCount: number;
    maximumRyanmenTaatsuCount: number;
    waitKindCountAtTenpai: number;
    waitLiveCountAtTenpai: number;
    skippedNonTargetWinCount: number;
  };
  tanyaoCallDecision?: TanyaoCallDecision & { meld: ChantaMeld };
  sanshokuStats?: {
    lockedSequenceStart: SanshokuSequenceStart | null;
    maximumCompletedRequiredSequenceCount: number;
    maximumManProgress: number;
    maximumPinProgress: number;
    maximumSouProgress: number;
    waitKindCountAtTenpai: number;
    waitLiveCountAtTenpai: number;
    skippedNonTargetWinCount: number;
  };
  sanshokuCallDecision?: SanshokuCallDecision & { meld: ChantaMeld };
  riichiStats?: {
    points: number;
    declarationAttempted: boolean;
    established: boolean;
    declarationTurn?: number;
    declarationDiscard?: Tile;
    declarationDealIn: boolean;
    waitKindCountAtDeclaration: number;
    waitLiveCountAtDeclaration: number;
    skippedPreDeclarationWinCount: number;
  };
}

type TargetMode = SimulationRoleId;

interface TableState {
  players: PlayerState[];
  wall: number[];
  discards: number[];
}

interface DiscardChoice {
  index: number;
  shanten: number;
  ukeire: number;
}

interface CallChoice {
  caller: number;
  meld: ChantaMeld;
  removed: number[];
  discard: DiscardChoice;
}

const TERMINAL_OR_HONOR_INDICES = [0, 8, 9, 17, 18, 26, 27, 28, 29, 30, 31, 32, 33] as const;
const DRAGON_INDICES = new Set([31, 32, 33]);
const shantenCache = new LruCache<string, number>(20_000);

export function chantaShanten(counts: Counts34, melds: ChantaMeld[] = []): number {
  validateCounts(counts);
  const cacheKey = `${meldKey(melds)}|${counts.join(",")}`;
  const cached = shantenCache.get(cacheKey);
  if (cached != null) return cached;
  incrementSimulationCounter("targetShantenCalculationCount");
  const fixed = fixedContext(melds);
  if (!fixed.valid || sumCounts(counts) > 14 - fixed.meldCount * 3) {
    shantenCache.set(cacheKey, Number.POSITIVE_INFINITY);
    return Number.POSITIVE_INFINITY;
  }
  const overlap = bestChantaOverlap(counts, fixed);
  if (!Number.isFinite(overlap)) {
    shantenCache.set(cacheKey, Number.POSITIVE_INFINITY);
    return Number.POSITIVE_INFINITY;
  }
  const targetConcealedTiles = 14 - fixed.meldCount * 3;
  const result = targetConcealedTiles - overlap - 1;
  shantenCache.set(cacheKey, result);
  return result;
}

export function isChantaComplete(counts: Counts34, melds: ChantaMeld[] = []): boolean {
  const expected = 14 - melds.length * 3;
  return sumCounts(counts) === expected && chantaShanten(counts, melds) === -1;
}

export function chantaWinningTiles(
  counts: Counts34,
  melds: ChantaMeld[] = [],
  availableCounts = defaultAvailableCounts(counts, melds),
): Tile[] {
  incrementSimulationCounter("waitCalculationCount");
  validateAvailableCounts(availableCounts);
  const winning: Tile[] = [];
  for (let index = 0; index < 34; index += 1) {
    if (counts[index]! >= 4 || availableCounts[index]! <= 0) continue;
    const next = counts.slice();
    next[index] += 1;
    if (isChantaComplete(next, melds)) winning.push(tileName(index));
  }
  return winning;
}

export function chantaEffectiveTiles(
  counts: Counts34,
  melds: ChantaMeld[] = [],
  availableCounts = defaultAvailableCounts(counts, melds),
): ChantaEffectiveTile[] {
  incrementSimulationCounter("ukeireCalculationCount");
  validateAvailableCounts(availableCounts);
  const currentShanten = chantaShanten(counts, melds);
  const effective: ChantaEffectiveTile[] = [];

  for (let drawIndex = 0; drawIndex < 34; drawIndex += 1) {
    if (counts[drawIndex]! >= 4 || availableCounts[drawIndex]! <= 0) continue;
    const drawn = counts.slice();
    drawn[drawIndex] += 1;
    if (chantaShanten(drawn, melds) >= currentShanten) continue;
    let best = Number.POSITIVE_INFINITY;
    const discards: Tile[] = [];
    for (let discardIndex = 0; discardIndex < 34; discardIndex += 1) {
      if (drawn[discardIndex]! <= 0) continue;
      const after = drawn.slice();
      after[discardIndex] -= 1;
      const nextShanten = chantaShanten(after, melds);
      if (nextShanten < best) {
        best = nextShanten;
        discards.splice(0, discards.length, tileName(discardIndex));
      } else if (nextShanten === best) {
        discards.push(tileName(discardIndex));
      }
    }
    if (best < currentShanten) {
      effective.push({
        tile: tileName(drawIndex),
        remaining: availableCounts[drawIndex]!,
        resultingShanten: best,
        discards,
      });
    }
  }
  return effective;
}

export function evaluateChantaProgress(
  counts: Counts34,
  melds: ChantaMeld[] = [],
  availableCounts = defaultAvailableCounts(counts, melds),
): ChantaProgressEvaluation {
  const shanten = chantaShanten(counts, melds);
  const isPossible = Number.isFinite(shanten) && canCompleteChanta(counts, melds, availableCounts);
  const winningTiles = shanten === 0 && isPossible ? chantaWinningTiles(counts, melds, availableCounts) : [];
  const effectiveTiles = shanten > 0 && shanten <= 3 && isPossible
    ? chantaEffectiveTiles(counts, melds, availableCounts)
    : [];
  const isTenpai = winningTiles.length > 0;
  const canReachLiveTenpai = shanten === 1 && effectiveTiles.some((detail) => {
    if (detail.resultingShanten !== 0) return false;
    const drawIndex = tileIndex(detail.tile);
    const drawn = counts.slice();
    drawn[drawIndex] += 1;
    return detail.discards.some((discard) => {
      const after = drawn.slice();
      after[tileIndex(discard)] -= 1;
      const remaining = availableCounts.slice();
      remaining[drawIndex] -= 1;
      return chantaWinningTiles(after, melds, remaining).length > 0;
    });
  });
  return {
    shanten,
    isPossible,
    isIishanten: isTenpai || canReachLiveTenpai,
    isTenpai,
    winningTiles,
    effectiveTiles,
  };
}

export function updateTargetProgress(
  state: TargetProgressState,
  evaluation: Pick<ChantaProgressEvaluation, "isIishanten" | "isTenpai">,
  turn: number,
  eventOrder?: number,
): TargetProgressState {
  const next = { ...state };
  if (evaluation.isIishanten && !next.reachedTargetIishanten) {
    next.reachedTargetIishanten = true;
    next.firstIishantenTurn = turn;
  }
  if (evaluation.isTenpai && !next.reachedTargetTenpai) {
    next.reachedTargetTenpai = true;
    next.firstTenpaiTurn = turn;
    if (eventOrder != null) next.firstTenpaiEventOrder = eventOrder;
  }
  return next;
}

export function createRoleSimulationSession(
  input: ChantaSimulationInput,
  roleId: SimulationRoleId,
  resume?: RoleSimulationCheckpoint,
): RoleSimulationSession {
  validateSimulationInput(input);
  if (resume && resume.roleId !== roleId) {
    throw new Error("The simulation checkpoint belongs to a different strategy.");
  }
  if (resume && resume.completedTrials > input.trials) {
    throw new Error("The simulation checkpoint exceeds the requested trial count.");
  }
  const random = mulberry32(input.seed ?? Date.now(), resume?.randomState);
  const debugLimit = input.debug ? Math.max(1, Math.min(5, input.debugTrialLimit ?? 1)) : 0;
  let completedTrials = resume?.completedTrials ?? 0;
  let cumulativeResult = resume?.result ?? null;

  return {
    roleId,
    get completedTrials() {
      return completedTrials;
    },
    runBatch(batchSize: number) {
      if (!Number.isInteger(batchSize) || batchSize < 1) {
        throw new Error("batchSize must be a positive integer.");
      }
      const remaining = input.trials - completedTrials;
      const count = Math.min(batchSize, remaining);
      if (count === 0) {
        if (!cumulativeResult) throw new Error("No simulation trials have been completed.");
        return cumulativeResult;
      }
      const batch: ChantaTrialResult[] = [];
      for (let offset = 0; offset < count; offset += 1) {
        const trialIndex = completedTrials + offset;
        try {
          const trial = runTrial(input.initialHand, random, trialIndex < debugLimit, roleId);
          batch.push(trial);
          if (trial.debugTurns) incrementSimulationCounter("detailedLogCount", trial.debugTurns.length);
        } catch {
          batch.push({ outcome: "invalid", progress: emptyProgress(), targetMeldCount: 0 });
        }
      }
      const batchResult = aggregateTrialsForRole(roleId, batch, count);
      cumulativeResult = cumulativeResult
        ? mergeRoleSimulationResults(cumulativeResult, batchResult)
        : batchResult;
      completedTrials += count;
      return cumulativeResult;
    },
    getResult() {
      return cumulativeResult;
    },
    createCheckpoint() {
      if (!cumulativeResult) return null;
      return {
        roleId,
        completedTrials,
        randomState: random.getState(),
        result: cumulativeResult,
      };
    },
  };
}

function runRoleSimulation(input: ChantaSimulationInput, roleId: SimulationRoleId): RoleSimulationResult {
  const session = createRoleSimulationSession(input, roleId);
  return session.runBatch(input.trials);
}

function aggregateTrialsForRole(
  roleId: SimulationRoleId,
  trials: ChantaTrialResult[],
  totalTrials: number,
): RoleSimulationResult {
  switch (roleId) {
    case "flush": return aggregateFlushTrials(trials, totalTrials);
    case "chiitoitsu": return aggregateChiitoitsuTrials(trials, totalTrials);
    case "ikkitsuukan": return aggregateIkkitsuukanTrials(trials, totalTrials);
    case "toitoi": return aggregateToitoiTrials(trials, totalTrials);
    case "pinfu": return aggregatePinfuTrials(trials, totalTrials);
    case "tanyao": return aggregateTanyaoTrials(trials, totalTrials);
    case "sanshoku": return aggregateSanshokuTrials(trials, totalTrials);
    case "riichi": return aggregateRiichiTrials(trials, totalTrials);
    default: return aggregateChantaTrials(trials, totalTrials);
  }
}

function practicalTenpaiInputForProgress(progress: TargetProgressState): PracticalTenpaiScoreInput {
  return {
    reachedTargetTenpai: progress.reachedTargetTenpai,
    firstTargetTenpaiTurn: progress.firstTenpaiTurn ?? null,
    firstTargetTenpaiEventOrder: progress.firstTenpaiEventOrder ?? null,
    firstOpponentRiichiEventOrder: progress.firstOpponentRiichiEventOrder ?? null,
  };
}

function practicalTenpaiInputForTrial(trial: ChantaTrialResult): PracticalTenpaiScoreInput {
  return practicalTenpaiInputForProgress(trial.progress);
}

function practicalTenpaiMetricsForTrials(trials: readonly ChantaTrialResult[]): PracticalTenpaiMetrics {
  return aggregatePracticalTenpaiMetrics(trials.map(practicalTenpaiInputForTrial));
}

export function aggregateChantaTrials(trials: ChantaTrialResult[], totalTrials = trials.length): RoleSimulationResult {
  const valid = trials.filter((trial) => trial.outcome !== "invalid");
  const reachedIishanten = valid.filter((trial) => trial.progress.reachedTargetIishanten);
  const reachedTenpai = valid.filter((trial) => trial.progress.reachedTargetTenpai);
  const wins = valid.filter((trial) => trial.outcome === "targetWin");
  const denominator = valid.length;
  const rate = (count: number) => denominator === 0 ? 0 : count / denominator;
  const opponentWins = valid.filter((trial) => trial.outcome === "opponentWin").length;
  const draws = valid.filter((trial) => trial.outcome === "draw").length;
  const impossible = valid.filter((trial) => trial.outcome === "targetImpossible").length;
  const closedWins = wins.filter((trial) => trial.targetMeldCount === 0).length;
  const ronWins = wins.filter((trial) => trial.winMethod === "ron").length;
  const debugTrials = trials.flatMap((trial) => trial.debugTurns ? [trial.debugTurns] : []);

  return {
    ...practicalTenpaiMetricsForTrials(valid),
    roleId: "chanta",
    roleName: "純チャン・チャンタ",
    iishantenReachCount: reachedIishanten.length,
    iishantenRate: rate(reachedIishanten.length),
    averageFirstIishantenTurn: average(reachedIishanten.map((trial) => trial.progress.firstIishantenTurn)),
    tenpaiReachCount: reachedTenpai.length,
    tenpaiRate: rate(reachedTenpai.length),
    averageFirstTenpaiTurn: average(reachedTenpai.map((trial) => trial.progress.firstTenpaiTurn)),
    winCount: wins.length,
    winRate: rate(wins.length),
    averageWinTurn: average(wins.map((trial) => trial.progress.winTurn)),
    opponentWinCount: opponentWins,
    opponentWinRate: rate(opponentWins),
    drawCount: draws,
    drawRate: rate(draws),
    targetImpossibleCount: impossible,
    targetImpossibleRate: rate(impossible),
    closedWinCount: closedWins,
    openWinCount: wins.length - closedWins,
    averageCallCount: denominator === 0 ? 0 : valid.reduce((sum, trial) => sum + trial.targetMeldCount, 0) / denominator,
    ronWinCount: ronWins,
    tsumoWinCount: wins.length - ronWins,
    totalTrials,
    validTrials: denominator,
    invalidTrials: totalTrials - denominator,
    aiVersion: CHANTA_AI_VERSION,
    ruleVersion: CHANTA_RULE_VERSION,
    ...(debugTrials.length ? { debugTrials } : {}),
  };
}

export function runChantaSimulation(input: ChantaSimulationInput): RoleSimulationResult {
  return runRoleSimulation(input, "chanta");
}

export function aggregateFlushTrials(trials: ChantaTrialResult[], totalTrials = trials.length): RoleSimulationResult {
  const valid = trials.filter((trial) => trial.outcome !== "invalid");
  const reachedIishanten = valid.filter((trial) => trial.progress.reachedTargetIishanten);
  const reachedTenpai = valid.filter((trial) => trial.progress.reachedTargetTenpai);
  const wins = valid.filter((trial) => trial.outcome === "targetWin");
  const honitsuWins = wins.filter((trial) => trial.flushWinType === "HONITSU");
  const chinitsuWins = wins.filter((trial) => trial.flushWinType === "CHINITSU");
  const denominator = valid.length;
  const rate = (count: number) => denominator === 0 ? 0 : count / denominator;
  const opponentWins = valid.filter((trial) => trial.outcome === "opponentWin").length;
  const draws = valid.filter((trial) => trial.outcome === "draw").length;
  const impossible = valid.filter((trial) => trial.outcome === "targetImpossible").length;
  const closedWins = wins.filter((trial) => trial.targetMeldCount === 0).length;
  const ronWins = wins.filter((trial) => trial.winMethod === "ron").length;
  const debugTrials = trials.flatMap((trial) => trial.debugTurns ? [trial.debugTurns] : []);
  const suitWins = (suit: FlushSuit) => wins.filter((trial) => trial.selectedSuitAtWin === suit).length;
  const averageCalls = (items: ChantaTrialResult[]) => average(items.map((trial) => trial.targetMeldCount)) ?? 0;

  return {
    ...practicalTenpaiMetricsForTrials(valid),
    roleId: "flush",
    roleName: "染め手（ホンイツ・チンイツ）",
    iishantenReachCount: reachedIishanten.length,
    iishantenRate: rate(reachedIishanten.length),
    averageFirstIishantenTurn: average(reachedIishanten.map((trial) => trial.progress.firstIishantenTurn)),
    tenpaiReachCount: reachedTenpai.length,
    tenpaiRate: rate(reachedTenpai.length),
    averageFirstTenpaiTurn: average(reachedTenpai.map((trial) => trial.progress.firstTenpaiTurn)),
    winCount: wins.length,
    winRate: rate(wins.length),
    averageWinTurn: average(wins.map((trial) => trial.progress.winTurn)),
    opponentWinCount: opponentWins,
    opponentWinRate: rate(opponentWins),
    drawCount: draws,
    drawRate: rate(draws),
    targetImpossibleCount: impossible,
    targetImpossibleRate: rate(impossible),
    closedWinCount: closedWins,
    openWinCount: wins.length - closedWins,
    averageCallCount: denominator === 0 ? 0 : valid.reduce((sum, trial) => sum + trial.targetMeldCount, 0) / denominator,
    ronWinCount: ronWins,
    tsumoWinCount: wins.length - ronWins,
    totalTrials,
    validTrials: denominator,
    invalidTrials: totalTrials - denominator,
    aiVersion: FLUSH_AI_VERSION,
    ruleVersion: CHANTA_RULE_VERSION,
    details: {
      flush: {
        honitsuWinCount: honitsuWins.length,
        honitsuWinRate: rate(honitsuWins.length),
        chinitsuWinCount: chinitsuWins.length,
        chinitsuWinRate: rate(chinitsuWins.length),
        manSuitWinCount: suitWins("MAN"),
        pinSuitWinCount: suitWins("PIN"),
        souSuitWinCount: suitWins("SOU"),
        honitsuAverageCallCount: averageCalls(honitsuWins),
        chinitsuAverageCallCount: averageCalls(chinitsuWins),
        averageChiCount: denominator === 0 ? 0 : valid.reduce((sum, trial) => sum + (trial.targetChiCount ?? 0), 0) / denominator,
        averagePonCount: denominator === 0 ? 0 : valid.reduce((sum, trial) => sum + (trial.targetPonCount ?? 0), 0) / denominator,
      },
    },
    ...(debugTrials.length ? { debugTrials } : {}),
  };
}

export function runFlushSimulation(input: ChantaSimulationInput): RoleSimulationResult {
  return runRoleSimulation(input, "flush");
}

export function aggregateChiitoitsuTrials(
  trials: ChantaTrialResult[],
  totalTrials = trials.length,
): RoleSimulationResult {
  const valid = trials.filter((trial) => trial.outcome !== "invalid");
  const reachedIishanten = valid.filter((trial) => trial.progress.reachedTargetIishanten);
  const reachedTenpai = valid.filter((trial) => trial.progress.reachedTargetTenpai);
  const wins = valid.filter((trial) => trial.outcome === "targetWin");
  const denominator = valid.length;
  const rate = (count: number) => denominator === 0 ? 0 : count / denominator;
  const opponentWins = valid.filter((trial) => trial.outcome === "opponentWin").length;
  const draws = valid.filter((trial) => trial.outcome === "draw").length;
  const impossible = valid.filter((trial) => trial.outcome === "targetImpossible").length;
  const ronWins = wins.filter((trial) => trial.winMethod === "ron").length;
  const debugTrials = trials.flatMap((trial) => trial.debugTurns ? [trial.debugTurns] : []);

  return {
    ...practicalTenpaiMetricsForTrials(valid),
    roleId: "chiitoitsu",
    roleName: "七対子全力狙い",
    iishantenReachCount: reachedIishanten.length,
    iishantenRate: rate(reachedIishanten.length),
    averageFirstIishantenTurn: average(reachedIishanten.map((trial) => trial.progress.firstIishantenTurn)),
    tenpaiReachCount: reachedTenpai.length,
    tenpaiRate: rate(reachedTenpai.length),
    averageFirstTenpaiTurn: average(reachedTenpai.map((trial) => trial.progress.firstTenpaiTurn)),
    winCount: wins.length,
    winRate: rate(wins.length),
    averageWinTurn: average(wins.map((trial) => trial.progress.winTurn)),
    opponentWinCount: opponentWins,
    opponentWinRate: rate(opponentWins),
    drawCount: draws,
    drawRate: rate(draws),
    targetImpossibleCount: impossible,
    targetImpossibleRate: rate(impossible),
    closedWinCount: wins.length,
    openWinCount: 0,
    averageCallCount: 0,
    ronWinCount: ronWins,
    tsumoWinCount: wins.length - ronWins,
    totalTrials,
    validTrials: denominator,
    invalidTrials: totalTrials - denominator,
    aiVersion: CHIITOITSU_AI_VERSION,
    ruleVersion: CHANTA_RULE_VERSION,
    details: {
      chiitoitsu: {
        averageInitialPairKindCount: average(valid.map((trial) => trial.initialPairKindCount)) ?? 0,
        averageMaximumPairKindCount: average(valid.map((trial) => trial.maximumPairKindCount)) ?? 0,
        averageFinalPairKindCount: average(valid.map((trial) => trial.finalPairKindCount)) ?? 0,
        averageWaitChangeCount: average(valid.map((trial) => trial.waitChangeCount)) ?? 0,
        averageLiveWaitCountAtTenpai: average(
          valid.filter((trial) => trial.progress.reachedTargetTenpai).map((trial) => trial.waitLiveCountAtTenpai),
        ) ?? 0,
      },
    },
    ...(debugTrials.length ? { debugTrials } : {}),
  };
}

export function runChiitoitsuSimulation(input: ChantaSimulationInput): RoleSimulationResult {
  return runRoleSimulation(input, "chiitoitsu");
}

export function aggregateIkkitsuukanTrials(
  trials: ChantaTrialResult[],
  totalTrials = trials.length,
): RoleSimulationResult {
  const valid = trials.filter((trial) => trial.outcome !== "invalid");
  const reachedIishanten = valid.filter((trial) => trial.progress.reachedTargetIishanten);
  const reachedTenpai = valid.filter((trial) => trial.progress.reachedTargetTenpai);
  const wins = valid.filter((trial) => trial.outcome === "targetWin");
  const denominator = valid.length;
  const rate = (count: number) => denominator === 0 ? 0 : count / denominator;
  const opponentWins = valid.filter((trial) => trial.outcome === "opponentWin").length;
  const draws = valid.filter((trial) => trial.outcome === "draw").length;
  const impossible = valid.filter((trial) => trial.outcome === "targetImpossible").length;
  const closedWins = wins.filter((trial) => trial.targetMeldCount === 0).length;
  const ronWins = wins.filter((trial) => trial.winMethod === "ron").length;
  const debugTrials = trials.flatMap((trial) => trial.debugTurns ? [trial.debugTurns] : []);
  const suitWins = (suit: IkkitsuukanSuit) => wins.filter((trial) => trial.ikkitsuukanWinSuit === suit).length;

  return {
    ...practicalTenpaiMetricsForTrials(valid),
    roleId: "ikkitsuukan",
    roleName: "一気通貫",
    iishantenReachCount: reachedIishanten.length,
    iishantenRate: rate(reachedIishanten.length),
    averageFirstIishantenTurn: average(reachedIishanten.map((trial) => trial.progress.firstIishantenTurn)),
    tenpaiReachCount: reachedTenpai.length,
    tenpaiRate: rate(reachedTenpai.length),
    averageFirstTenpaiTurn: average(reachedTenpai.map((trial) => trial.progress.firstTenpaiTurn)),
    winCount: wins.length,
    winRate: rate(wins.length),
    averageWinTurn: average(wins.map((trial) => trial.progress.winTurn)),
    opponentWinCount: opponentWins,
    opponentWinRate: rate(opponentWins),
    drawCount: draws,
    drawRate: rate(draws),
    targetImpossibleCount: impossible,
    targetImpossibleRate: rate(impossible),
    closedWinCount: closedWins,
    openWinCount: wins.length - closedWins,
    averageCallCount: denominator === 0 ? 0 : valid.reduce((sum, trial) => sum + trial.targetMeldCount, 0) / denominator,
    ronWinCount: ronWins,
    tsumoWinCount: wins.length - ronWins,
    totalTrials,
    validTrials: denominator,
    invalidTrials: totalTrials - denominator,
    aiVersion: IKKITSUUKAN_AI_VERSION,
    ruleVersion: CHANTA_RULE_VERSION,
    details: {
      ikkitsuukan: {
        manSuitWinCount: suitWins("MAN"),
        pinSuitWinCount: suitWins("PIN"),
        souSuitWinCount: suitWins("SOU"),
        averageRequiredSequenceCallCount: average(valid.map((trial) => trial.openRequiredSequenceCount)) ?? 0,
        averageExtraMeldCallCount: average(valid.map((trial) => trial.openExtraMeldCount)) ?? 0,
        averageMaximumCompletedRequiredSequenceCount: average(
          valid.map((trial) => trial.maximumCompletedRequiredSequenceCount),
        ) ?? 0,
      },
    },
    ...(debugTrials.length ? { debugTrials } : {}),
  };
}

export function runIkkitsuukanSimulation(input: ChantaSimulationInput): RoleSimulationResult {
  return runRoleSimulation(input, "ikkitsuukan");
}

export function aggregateToitoiTrials(
  trials: ChantaTrialResult[],
  totalTrials = trials.length,
): RoleSimulationResult {
  const valid = trials.filter((trial) => trial.outcome !== "invalid");
  const reachedIishanten = valid.filter((trial) => trial.progress.reachedTargetIishanten);
  const reachedTenpai = valid.filter((trial) => trial.progress.reachedTargetTenpai);
  const wins = valid.filter((trial) => trial.outcome === "targetWin");
  const denominator = valid.length;
  const rate = (count: number) => denominator === 0 ? 0 : count / denominator;
  const opponentWins = valid.filter((trial) => trial.outcome === "opponentWin").length;
  const draws = valid.filter((trial) => trial.outcome === "draw").length;
  const impossible = valid.filter((trial) => trial.outcome === "targetImpossible").length;
  const closedWins = wins.filter((trial) => trial.targetMeldCount === 0).length;
  const ronWins = wins.filter((trial) => trial.winMethod === "ron").length;
  const shanponWins = wins.filter((trial) => trial.toitoiWinWaitType === "SHANPON").length;
  const tankiWins = wins.filter((trial) => trial.toitoiWinWaitType === "TANKI").length;
  const debugTrials = trials.flatMap((trial) => trial.debugTurns ? [trial.debugTurns] : []);

  return {
    ...practicalTenpaiMetricsForTrials(valid),
    roleId: "toitoi",
    roleName: "対々和",
    iishantenReachCount: reachedIishanten.length,
    iishantenRate: rate(reachedIishanten.length),
    averageFirstIishantenTurn: average(reachedIishanten.map((trial) => trial.progress.firstIishantenTurn)),
    tenpaiReachCount: reachedTenpai.length,
    tenpaiRate: rate(reachedTenpai.length),
    averageFirstTenpaiTurn: average(reachedTenpai.map((trial) => trial.progress.firstTenpaiTurn)),
    winCount: wins.length,
    winRate: rate(wins.length),
    averageWinTurn: average(wins.map((trial) => trial.progress.winTurn)),
    opponentWinCount: opponentWins,
    opponentWinRate: rate(opponentWins),
    drawCount: draws,
    drawRate: rate(draws),
    targetImpossibleCount: impossible,
    targetImpossibleRate: rate(impossible),
    closedWinCount: closedWins,
    openWinCount: wins.length - closedWins,
    averageCallCount: denominator === 0 ? 0 : valid.reduce((sum, trial) => sum + trial.targetMeldCount, 0) / denominator,
    ronWinCount: ronWins,
    tsumoWinCount: wins.length - ronWins,
    totalTrials,
    validTrials: denominator,
    invalidTrials: totalTrials - denominator,
    aiVersion: TOITOI_AI_VERSION,
    ruleVersion: CHANTA_RULE_VERSION,
    details: {
      toitoi: {
        closedWinCount: closedWins,
        openWinCount: wins.length - closedWins,
        ronWinCount: ronWins,
        tsumoWinCount: wins.length - ronWins,
        shanponWinCount: shanponWins,
        tankiWinCount: tankiWins,
        averagePonCount: average(valid.map((trial) => trial.targetPonCount)) ?? 0,
        averageChiCount: average(valid.map((trial) => trial.targetChiCount)) ?? 0,
        averageInitialPairKindCount: average(valid.map((trial) => trial.toitoiInitialPairKindCount)) ?? 0,
        averageMaximumPairKindCount: average(valid.map((trial) => trial.toitoiMaximumPairKindCount)) ?? 0,
        averageInitialTripletKindCount: average(valid.map((trial) => trial.toitoiInitialTripletKindCount)) ?? 0,
        averageMaximumTripletKindCount: average(valid.map((trial) => trial.toitoiMaximumTripletKindCount)) ?? 0,
        averageWaitLiveCountAtTenpai: average(
          reachedTenpai.map((trial) => trial.toitoiWaitLiveCountAtTenpai),
        ),
        averageOpenTripletCountAtWin: average(wins.map((trial) => trial.targetPonCount)) ?? 0,
      },
    },
    ...(debugTrials.length ? { debugTrials } : {}),
  };
}

export function runToitoiSimulation(input: ChantaSimulationInput): RoleSimulationResult {
  return runRoleSimulation(input, "toitoi");
}

export function aggregatePinfuTrials(
  trials: ChantaTrialResult[],
  totalTrials = trials.length,
): RoleSimulationResult {
  const valid = trials.filter((trial) => trial.outcome !== "invalid");
  const reachedIishanten = valid.filter((trial) => trial.progress.reachedTargetIishanten);
  const reachedTenpai = valid.filter((trial) => trial.progress.reachedTargetTenpai);
  const wins = valid.filter((trial) => trial.outcome === "targetWin");
  const denominator = valid.length;
  const rate = (count: number) => denominator === 0 ? 0 : count / denominator;
  const opponentWins = valid.filter((trial) => trial.outcome === "opponentWin").length;
  const draws = valid.filter((trial) => trial.outcome === "draw").length;
  const impossible = valid.filter((trial) => trial.outcome === "targetImpossible").length;
  const ronWins = wins.filter((trial) => trial.winMethod === "ron").length;
  const debugTrials = trials.flatMap((trial) => trial.debugTurns ? [trial.debugTurns] : []);

  return {
    ...practicalTenpaiMetricsForTrials(valid),
    roleId: "pinfu",
    roleName: "平和",
    iishantenReachCount: reachedIishanten.length,
    iishantenRate: rate(reachedIishanten.length),
    averageFirstIishantenTurn: average(reachedIishanten.map((trial) => trial.progress.firstIishantenTurn)),
    tenpaiReachCount: reachedTenpai.length,
    tenpaiRate: rate(reachedTenpai.length),
    averageFirstTenpaiTurn: average(reachedTenpai.map((trial) => trial.progress.firstTenpaiTurn)),
    winCount: wins.length,
    winRate: rate(wins.length),
    averageWinTurn: average(wins.map((trial) => trial.progress.winTurn)),
    opponentWinCount: opponentWins,
    opponentWinRate: rate(opponentWins),
    drawCount: draws,
    drawRate: rate(draws),
    targetImpossibleCount: impossible,
    targetImpossibleRate: rate(impossible),
    closedWinCount: wins.length,
    openWinCount: 0,
    averageCallCount: 0,
    ronWinCount: ronWins,
    tsumoWinCount: wins.length - ronWins,
    totalTrials,
    validTrials: denominator,
    invalidTrials: totalTrials - denominator,
    aiVersion: PINFU_AI_VERSION,
    ruleVersion: CHANTA_RULE_VERSION,
    details: {
      pinfu: {
        averageWaitKindCountAtTenpai: average(reachedTenpai.map((trial) => trial.pinfuWaitKindCountAtTenpai)),
        averageWaitLiveCountAtTenpai: average(reachedTenpai.map((trial) => trial.pinfuWaitLiveCountAtTenpai)),
        averageMaximumCompletedSequenceCount: average(
          valid.map((trial) => trial.pinfuMaximumCompletedSequenceCount),
        ) ?? 0,
        averageMaximumRyanmenTaatsuCount: average(
          valid.map((trial) => trial.pinfuMaximumRyanmenTaatsuCount),
        ) ?? 0,
        suitedPairWinCount: wins.filter((trial) => trial.pinfuWinPairType === "SUITED").length,
        nonValueWindPairWinCount: wins.filter((trial) => trial.pinfuWinPairType === "NON_VALUE_WIND").length,
        skippedNonPinfuWinCount: valid.reduce(
          (sum, trial) => sum + (trial.pinfuSkippedNonTargetWinCount ?? 0),
          0,
        ),
        averageCallCount: 0,
        riichiCount: 0,
      },
    },
    ...(debugTrials.length ? { debugTrials } : {}),
  };
}

export function runPinfuSimulation(input: ChantaSimulationInput): RoleSimulationResult {
  return runRoleSimulation(input, "pinfu");
}

export function aggregateTanyaoTrials(
  trials: ChantaTrialResult[],
  totalTrials = trials.length,
): RoleSimulationResult {
  const valid = trials.filter((trial) => trial.outcome !== "invalid");
  const reachedIishanten = valid.filter((trial) => trial.progress.reachedTargetIishanten);
  const reachedTenpai = valid.filter((trial) => trial.progress.reachedTargetTenpai);
  const wins = valid.filter((trial) => trial.outcome === "targetWin");
  const denominator = valid.length;
  const rate = (count: number) => denominator === 0 ? 0 : count / denominator;
  const opponentWins = valid.filter((trial) => trial.outcome === "opponentWin").length;
  const draws = valid.filter((trial) => trial.outcome === "draw").length;
  const impossible = valid.filter((trial) => trial.outcome === "targetImpossible").length;
  const closedWins = wins.filter((trial) => trial.targetMeldCount === 0).length;
  const ronWins = wins.filter((trial) => trial.winMethod === "ron").length;
  const standardWins = wins.filter((trial) => trial.tanyaoWinShape === "STANDARD").length;
  const chiitoitsuWins = wins.filter((trial) => trial.tanyaoWinShape === "CHIITOITSU").length;
  const debugTrials = trials.flatMap((trial) => trial.debugTurns ? [trial.debugTurns] : []);

  return {
    ...practicalTenpaiMetricsForTrials(valid),
    roleId: "tanyao",
    roleName: "タンヤオ",
    iishantenReachCount: reachedIishanten.length,
    iishantenRate: rate(reachedIishanten.length),
    averageFirstIishantenTurn: average(reachedIishanten.map((trial) => trial.progress.firstIishantenTurn)),
    tenpaiReachCount: reachedTenpai.length,
    tenpaiRate: rate(reachedTenpai.length),
    averageFirstTenpaiTurn: average(reachedTenpai.map((trial) => trial.progress.firstTenpaiTurn)),
    winCount: wins.length,
    winRate: rate(wins.length),
    averageWinTurn: average(wins.map((trial) => trial.progress.winTurn)),
    opponentWinCount: opponentWins,
    opponentWinRate: rate(opponentWins),
    drawCount: draws,
    drawRate: rate(draws),
    targetImpossibleCount: impossible,
    targetImpossibleRate: rate(impossible),
    closedWinCount: closedWins,
    openWinCount: wins.length - closedWins,
    averageCallCount: denominator === 0 ? 0 : valid.reduce((sum, trial) => sum + trial.targetMeldCount, 0) / denominator,
    ronWinCount: ronWins,
    tsumoWinCount: wins.length - ronWins,
    totalTrials,
    validTrials: denominator,
    invalidTrials: totalTrials - denominator,
    aiVersion: TANYAO_AI_VERSION,
    ruleVersion: CHANTA_RULE_VERSION,
    details: {
      tanyao: {
        closedWinCount: closedWins,
        openWinCount: wins.length - closedWins,
        standardWinCount: standardWins,
        chiitoitsuWinCount: chiitoitsuWins,
        ronWinCount: ronWins,
        tsumoWinCount: wins.length - ronWins,
        averageCallCount: average(valid.map((trial) => trial.targetMeldCount)) ?? 0,
        averageChiCount: average(valid.map((trial) => trial.targetChiCount)) ?? 0,
        averagePonCount: average(valid.map((trial) => trial.targetPonCount)) ?? 0,
        averageInitialTerminalHonorCount: average(valid.map((trial) => trial.tanyaoInitialTerminalHonorCount)) ?? 0,
        averageMinimumTerminalHonorCount: average(valid.map((trial) => trial.tanyaoMinimumTerminalHonorCount)) ?? 0,
        averageMaximumCompletedSimpleMeldCount: average(
          valid.map((trial) => trial.tanyaoMaximumCompletedSimpleMeldCount),
        ) ?? 0,
        averageMaximumSimpleTaatsuCount: average(valid.map((trial) => trial.tanyaoMaximumSimpleTaatsuCount)) ?? 0,
        averageMaximumRyanmenTaatsuCount: average(
          valid.map((trial) => trial.tanyaoMaximumRyanmenTaatsuCount),
        ) ?? 0,
        averageTargetWaitKindCountAtTenpai: average(
          reachedTenpai.map((trial) => trial.tanyaoWaitKindCountAtTenpai),
        ),
        averageTargetWaitLiveCountAtTenpai: average(
          reachedTenpai.map((trial) => trial.tanyaoWaitLiveCountAtTenpai),
        ),
        skippedNonTanyaoWinCount: valid.reduce(
          (sum, trial) => sum + (trial.tanyaoSkippedNonTargetWinCount ?? 0),
          0,
        ),
        riichiCount: 0,
        openTanyaoEnabled: true,
      },
    },
    ...(debugTrials.length ? { debugTrials } : {}),
  };
}

export function runTanyaoSimulation(input: ChantaSimulationInput): RoleSimulationResult {
  return runRoleSimulation(input, "tanyao");
}

export function aggregateSanshokuTrials(
  trials: ChantaTrialResult[],
  totalTrials = trials.length,
): RoleSimulationResult {
  const valid = trials.filter((trial) => trial.outcome !== "invalid");
  const reachedIishanten = valid.filter((trial) => trial.progress.reachedTargetIishanten);
  const reachedTenpai = valid.filter((trial) => trial.progress.reachedTargetTenpai);
  const wins = valid.filter((trial) => trial.outcome === "targetWin");
  const denominator = valid.length;
  const rate = (count: number) => denominator === 0 ? 0 : count / denominator;
  const opponentWins = valid.filter((trial) => trial.outcome === "opponentWin").length;
  const draws = valid.filter((trial) => trial.outcome === "draw").length;
  const impossible = valid.filter((trial) => trial.outcome === "targetImpossible").length;
  const closedWins = wins.filter((trial) => trial.targetMeldCount === 0).length;
  const ronWins = wins.filter((trial) => trial.winMethod === "ron").length;
  const sequenceWins = (start: SanshokuSequenceStart) => wins.filter(
    (trial) => trial.sanshokuWinSequenceStart === start,
  ).length;
  const debugTrials = trials.flatMap((trial) => trial.debugTurns ? [trial.debugTurns] : []);
  return {
    ...practicalTenpaiMetricsForTrials(valid),
    roleId: "sanshoku",
    roleName: "三色同順",
    iishantenReachCount: reachedIishanten.length,
    iishantenRate: rate(reachedIishanten.length),
    averageFirstIishantenTurn: average(reachedIishanten.map((trial) => trial.progress.firstIishantenTurn)),
    tenpaiReachCount: reachedTenpai.length,
    tenpaiRate: rate(reachedTenpai.length),
    averageFirstTenpaiTurn: average(reachedTenpai.map((trial) => trial.progress.firstTenpaiTurn)),
    winCount: wins.length,
    winRate: rate(wins.length),
    averageWinTurn: average(wins.map((trial) => trial.progress.winTurn)),
    opponentWinCount: opponentWins,
    opponentWinRate: rate(opponentWins),
    drawCount: draws,
    drawRate: rate(draws),
    targetImpossibleCount: impossible,
    targetImpossibleRate: rate(impossible),
    closedWinCount: closedWins,
    openWinCount: wins.length - closedWins,
    averageCallCount: average(valid.map((trial) => trial.targetMeldCount)) ?? 0,
    ronWinCount: ronWins,
    tsumoWinCount: wins.length - ronWins,
    totalTrials,
    validTrials: denominator,
    invalidTrials: totalTrials - denominator,
    aiVersion: SANSHOKU_AI_VERSION,
    ruleVersion: CHANTA_RULE_VERSION,
    details: {
      sanshoku: {
        closedWinCount: closedWins,
        openWinCount: wins.length - closedWins,
        ronWinCount: ronWins,
        tsumoWinCount: wins.length - ronWins,
        sequence123WinCount: sequenceWins(1),
        sequence234WinCount: sequenceWins(2),
        sequence345WinCount: sequenceWins(3),
        sequence456WinCount: sequenceWins(4),
        sequence567WinCount: sequenceWins(5),
        sequence678WinCount: sequenceWins(6),
        sequence789WinCount: sequenceWins(7),
        averageCallCount: average(valid.map((trial) => trial.targetMeldCount)) ?? 0,
        averageRequiredSequenceCallCount: average(
          valid.map((trial) => trial.sanshokuOpenRequiredSequenceCount),
        ) ?? 0,
        averageExtraMeldCallCount: average(valid.map((trial) => trial.sanshokuOpenExtraMeldCount)) ?? 0,
        averageMaximumCompletedRequiredSequenceCount: average(
          valid.map((trial) => trial.sanshokuMaximumCompletedRequiredSequenceCount),
        ) ?? 0,
        averageTargetWaitKindCountAtTenpai: average(
          reachedTenpai.map((trial) => trial.sanshokuWaitKindCountAtTenpai),
        ),
        averageTargetWaitLiveCountAtTenpai: average(
          reachedTenpai.map((trial) => trial.sanshokuWaitLiveCountAtTenpai),
        ),
        skippedNonSanshokuWinCount: valid.reduce(
          (sum, trial) => sum + (trial.sanshokuSkippedNonTargetWinCount ?? 0),
          0,
        ),
        riichiCount: 0,
      },
    },
    ...(debugTrials.length ? { debugTrials } : {}),
  };
}

export function runSanshokuSimulation(input: ChantaSimulationInput): RoleSimulationResult {
  return runRoleSimulation(input, "sanshoku");
}

export function aggregateRiichiTrials(
  trials: ChantaTrialResult[],
  totalTrials = trials.length,
): RoleSimulationResult {
  const valid = trials.filter((trial) => trial.outcome !== "invalid");
  const reachedIishanten = valid.filter((trial) => trial.progress.reachedTargetIishanten);
  const reachedTenpai = valid.filter((trial) => trial.progress.reachedTargetTenpai);
  const declarations = valid.filter((trial) => trial.riichiEstablished);
  const wins = valid.filter((trial) => trial.outcome === "targetWin" && trial.riichiEstablished);
  const denominator = valid.length;
  const rate = (count: number) => denominator === 0 ? 0 : count / denominator;
  const opponentWins = valid.filter((trial) => trial.outcome === "opponentWin").length;
  const draws = valid.filter((trial) => trial.outcome === "draw").length;
  const impossible = valid.filter((trial) => trial.outcome === "targetImpossible").length;
  const ronWins = wins.filter((trial) => trial.winMethod === "ron").length;
  const debugTrials = trials.flatMap((trial) => trial.debugTurns ? [trial.debugTurns] : []);
  return {
    ...practicalTenpaiMetricsForTrials(valid),
    roleId: "riichi",
    roleName: "リーチ",
    iishantenReachCount: reachedIishanten.length,
    iishantenRate: rate(reachedIishanten.length),
    averageFirstIishantenTurn: average(reachedIishanten.map((trial) => trial.progress.firstIishantenTurn)),
    tenpaiReachCount: reachedTenpai.length,
    tenpaiRate: rate(reachedTenpai.length),
    averageFirstTenpaiTurn: average(reachedTenpai.map((trial) => trial.progress.firstTenpaiTurn)),
    winCount: wins.length,
    winRate: rate(wins.length),
    averageWinTurn: average(wins.map((trial) => trial.progress.winTurn)),
    opponentWinCount: opponentWins,
    opponentWinRate: rate(opponentWins),
    drawCount: draws,
    drawRate: rate(draws),
    targetImpossibleCount: impossible,
    targetImpossibleRate: rate(impossible),
    closedWinCount: wins.length,
    openWinCount: 0,
    averageCallCount: 0,
    ronWinCount: ronWins,
    tsumoWinCount: wins.length - ronWins,
    totalTrials,
    validTrials: denominator,
    invalidTrials: totalTrials - denominator,
    aiVersion: RIICHI_AI_VERSION,
    ruleVersion: CHANTA_RULE_VERSION,
    details: {
      riichi: {
        declarationAttemptCount: valid.filter((trial) => trial.riichiDeclarationAttempted).length,
        declarationCount: declarations.length,
        declarationRate: rate(declarations.length),
        winAfterDeclarationRate: declarations.length === 0 ? null : wins.length / declarations.length,
        averageDeclarationTurn: average(declarations.map((trial) => trial.riichiDeclarationTurn)),
        averageWaitKindCountAtDeclaration: average(
          declarations.map((trial) => trial.riichiWaitKindCountAtDeclaration),
        ),
        averageWaitLiveCountAtDeclaration: average(
          declarations.map((trial) => trial.riichiWaitLiveCountAtDeclaration),
        ),
        ronWinCount: ronWins,
        tsumoWinCount: wins.length - ronWins,
        declarationDealInCount: valid.filter((trial) => trial.riichiDeclarationDealIn).length,
        skippedPreDeclarationWinCount: valid.reduce(
          (sum, trial) => sum + (trial.riichiSkippedPreDeclarationWinCount ?? 0),
          0,
        ),
        furitenRiichiCount: 0,
        averageCallCount: 0,
        startingPoints: DEFAULT_RIICHI_RULE_CONFIG.startingPoints,
        riichiCost: DEFAULT_RIICHI_RULE_CONFIG.riichiCost,
        minimumWallTiles: DEFAULT_RIICHI_RULE_CONFIG.minimumWallTiles,
      },
    },
    ...(debugTrials.length ? { debugTrials } : {}),
  };
}

export function runRiichiSimulation(input: ChantaSimulationInput): RoleSimulationResult {
  return runRoleSimulation(input, "riichi");
}

function validateSimulationInput(input: ChantaSimulationInput): void {
  validateCounts(input.initialHand, 13);
  if (!Number.isInteger(input.trials) || input.trials < 1 || input.trials > 10000) {
    throw new Error("試行回数は1〜10,000回で指定してください。");
  }
}

export function mergeRoleSimulationResults(
  left: RoleSimulationResult,
  right: RoleSimulationResult,
): RoleSimulationResult {
  if (left.roleId !== right.roleId || left.aiVersion !== right.aiVersion || left.ruleVersion !== right.ruleVersion) {
    throw new Error("Simulation results with different strategies or versions cannot be merged.");
  }
  const validTrials = left.validTrials + right.validTrials;
  const totalTrials = left.totalTrials + right.totalTrials;
  const iishantenReachCount = left.iishantenReachCount + right.iishantenReachCount;
  const tenpaiReachCount = left.tenpaiReachCount + right.tenpaiReachCount;
  const winCount = left.winCount + right.winCount;
  const opponentWinCount = left.opponentWinCount + right.opponentWinCount;
  const drawCount = left.drawCount + right.drawCount;
  const targetImpossibleCount = left.targetImpossibleCount + right.targetImpossibleCount;
  const rate = (count: number) => validTrials === 0 ? 0 : count / validTrials;
  const debugTrials = [...(left.debugTrials ?? []), ...(right.debugTrials ?? [])].slice(0, 5);
  const practicalTenpai = mergePracticalTenpaiMetrics(left, right, validTrials);

  return {
    ...left,
    ...practicalTenpai,
    iishantenReachCount,
    iishantenRate: rate(iishantenReachCount),
    averageFirstIishantenTurn: weightedAverage(
      left.averageFirstIishantenTurn,
      left.iishantenReachCount,
      right.averageFirstIishantenTurn,
      right.iishantenReachCount,
    ),
    tenpaiReachCount,
    tenpaiRate: rate(tenpaiReachCount),
    averageFirstTenpaiTurn: weightedAverage(
      left.averageFirstTenpaiTurn,
      left.tenpaiReachCount,
      right.averageFirstTenpaiTurn,
      right.tenpaiReachCount,
    ),
    winCount,
    winRate: rate(winCount),
    averageWinTurn: weightedAverage(left.averageWinTurn, left.winCount, right.averageWinTurn, right.winCount),
    opponentWinCount,
    opponentWinRate: rate(opponentWinCount),
    drawCount,
    drawRate: rate(drawCount),
    targetImpossibleCount,
    targetImpossibleRate: rate(targetImpossibleCount),
    closedWinCount: left.closedWinCount + right.closedWinCount,
    openWinCount: left.openWinCount + right.openWinCount,
    averageCallCount: weightedAverage(left.averageCallCount, left.validTrials, right.averageCallCount, right.validTrials) ?? 0,
    ronWinCount: left.ronWinCount + right.ronWinCount,
    tsumoWinCount: left.tsumoWinCount + right.tsumoWinCount,
    totalTrials,
    validTrials,
    invalidTrials: totalTrials - validTrials,
    details: mergeRoleResultDetails(left, right),
    ...(debugTrials.length ? { debugTrials } : { debugTrials: undefined }),
  };
}

function mergePracticalTenpaiMetrics(
  left: RoleSimulationResult,
  right: RoleSimulationResult,
  validTrials: number,
): PracticalTenpaiMetrics {
  if (left.practicalTenpaiScoringVersion !== right.practicalTenpaiScoringVersion) {
    throw new Error("Practical tenpai results with different scoring versions cannot be merged.");
  }
  const rate = (count: number) => validTrials === 0 ? 0 : count / validTrials;
  const tenpaiByTurn6Count = left.tenpaiByTurn6Count + right.tenpaiByTurn6Count;
  const tenpaiByTurn8Count = left.tenpaiByTurn8Count + right.tenpaiByTurn8Count;
  const tenpaiByTurn10Count = left.tenpaiByTurn10Count + right.tenpaiByTurn10Count;
  const tenpaiByTurn12Count = left.tenpaiByTurn12Count + right.tenpaiByTurn12Count;
  const tenpaiByTurn15Count = left.tenpaiByTurn15Count + right.tenpaiByTurn15Count;
  const preemptiveTenpaiCount = left.preemptiveTenpaiCount + right.preemptiveTenpaiCount;
  const chasingTenpaiCount = left.chasingTenpaiCount + right.chasingTenpaiCount;
  const totalPracticalTenpaiScoreUnits = left.totalPracticalTenpaiScoreUnits + right.totalPracticalTenpaiScoreUnits;
  const distributionCounts = {
    throughTurn6Count: left.tenpaiTurnDistributionCounts.throughTurn6Count
      + right.tenpaiTurnDistributionCounts.throughTurn6Count,
    turn7To9Count: left.tenpaiTurnDistributionCounts.turn7To9Count
      + right.tenpaiTurnDistributionCounts.turn7To9Count,
    turn10To12Count: left.tenpaiTurnDistributionCounts.turn10To12Count
      + right.tenpaiTurnDistributionCounts.turn10To12Count,
    turn13To15Count: left.tenpaiTurnDistributionCounts.turn13To15Count
      + right.tenpaiTurnDistributionCounts.turn13To15Count,
    turn16PlusCount: left.tenpaiTurnDistributionCounts.turn16PlusCount
      + right.tenpaiTurnDistributionCounts.turn16PlusCount,
    notReachedCount: left.tenpaiTurnDistributionCounts.notReachedCount
      + right.tenpaiTurnDistributionCounts.notReachedCount,
  };
  const result: PracticalTenpaiMetrics = {
    practicalTenpaiScore: validTrials === 0 ? 0 : totalPracticalTenpaiScoreUnits / validTrials,
    rawTenpaiRate: rate(left.tenpaiReachCount + right.tenpaiReachCount),
    tenpaiByTurn6Count,
    tenpaiByTurn6Rate: rate(tenpaiByTurn6Count),
    tenpaiByTurn8Count,
    tenpaiByTurn8Rate: rate(tenpaiByTurn8Count),
    tenpaiByTurn10Count,
    tenpaiByTurn10Rate: rate(tenpaiByTurn10Count),
    tenpaiByTurn12Count,
    tenpaiByTurn12Rate: rate(tenpaiByTurn12Count),
    tenpaiByTurn15Count,
    tenpaiByTurn15Rate: rate(tenpaiByTurn15Count),
    preemptiveTenpaiCount,
    preemptiveTenpaiRate: rate(preemptiveTenpaiCount),
    chasingTenpaiCount,
    chasingTenpaiRate: rate(chasingTenpaiCount),
    averageFirstTenpaiTurn: weightedAverage(
      left.averageFirstTenpaiTurn,
      left.tenpaiReachCount,
      right.averageFirstTenpaiTurn,
      right.tenpaiReachCount,
    ),
    totalPracticalTenpaiTrialScore: totalPracticalTenpaiScoreUnits / 100,
    totalPracticalTenpaiScoreUnits,
    practicalTenpaiScoringVersion: left.practicalTenpaiScoringVersion,
    tenpaiTurnDistributionCounts: distributionCounts,
    tenpaiTurnDistribution: {
      throughTurn6Rate: rate(distributionCounts.throughTurn6Count),
      turn7To9Rate: rate(distributionCounts.turn7To9Count),
      turn10To12Rate: rate(distributionCounts.turn10To12Count),
      turn13To15Rate: rate(distributionCounts.turn13To15Count),
      turn16PlusRate: rate(distributionCounts.turn16PlusCount),
      notReachedRate: rate(distributionCounts.notReachedCount),
    },
  };
  assertPracticalTenpaiMetrics(result);
  return result;
}

function mergeRoleResultDetails(
  left: RoleSimulationResult,
  right: RoleSimulationResult,
): RoleSimulationResult["details"] {
  const validWeight = [left.validTrials, right.validTrials] as const;
  const tenpaiWeight = [left.tenpaiReachCount, right.tenpaiReachCount] as const;
  const winWeight = [left.winCount, right.winCount] as const;
  if (left.roleId === "flush") {
    const a = left.details?.flush;
    const b = right.details?.flush;
    if (!a || !b) return undefined;
    const honitsuWinCount = a.honitsuWinCount + b.honitsuWinCount;
    const chinitsuWinCount = a.chinitsuWinCount + b.chinitsuWinCount;
    const denominator = left.validTrials + right.validTrials;
    return { flush: {
      honitsuWinCount,
      honitsuWinRate: denominator === 0 ? 0 : honitsuWinCount / denominator,
      chinitsuWinCount,
      chinitsuWinRate: denominator === 0 ? 0 : chinitsuWinCount / denominator,
      manSuitWinCount: a.manSuitWinCount + b.manSuitWinCount,
      pinSuitWinCount: a.pinSuitWinCount + b.pinSuitWinCount,
      souSuitWinCount: a.souSuitWinCount + b.souSuitWinCount,
      honitsuAverageCallCount: weightedAverage(a.honitsuAverageCallCount, a.honitsuWinCount, b.honitsuAverageCallCount, b.honitsuWinCount) ?? 0,
      chinitsuAverageCallCount: weightedAverage(a.chinitsuAverageCallCount, a.chinitsuWinCount, b.chinitsuAverageCallCount, b.chinitsuWinCount) ?? 0,
      averageChiCount: weightedAverage(a.averageChiCount, validWeight[0], b.averageChiCount, validWeight[1]) ?? 0,
      averagePonCount: weightedAverage(a.averagePonCount, validWeight[0], b.averagePonCount, validWeight[1]) ?? 0,
    } };
  }
  if (left.roleId === "chiitoitsu") {
    const a = left.details?.chiitoitsu;
    const b = right.details?.chiitoitsu;
    if (!a || !b) return undefined;
    return { chiitoitsu: {
      averageInitialPairKindCount: weightedAverage(a.averageInitialPairKindCount, validWeight[0], b.averageInitialPairKindCount, validWeight[1]) ?? 0,
      averageMaximumPairKindCount: weightedAverage(a.averageMaximumPairKindCount, validWeight[0], b.averageMaximumPairKindCount, validWeight[1]) ?? 0,
      averageFinalPairKindCount: weightedAverage(a.averageFinalPairKindCount, validWeight[0], b.averageFinalPairKindCount, validWeight[1]) ?? 0,
      averageWaitChangeCount: weightedAverage(a.averageWaitChangeCount, validWeight[0], b.averageWaitChangeCount, validWeight[1]) ?? 0,
      averageLiveWaitCountAtTenpai: weightedAverage(a.averageLiveWaitCountAtTenpai, tenpaiWeight[0], b.averageLiveWaitCountAtTenpai, tenpaiWeight[1]) ?? 0,
    } };
  }
  if (left.roleId === "ikkitsuukan") {
    const a = left.details?.ikkitsuukan;
    const b = right.details?.ikkitsuukan;
    if (!a || !b) return undefined;
    return { ikkitsuukan: {
      manSuitWinCount: a.manSuitWinCount + b.manSuitWinCount,
      pinSuitWinCount: a.pinSuitWinCount + b.pinSuitWinCount,
      souSuitWinCount: a.souSuitWinCount + b.souSuitWinCount,
      averageRequiredSequenceCallCount: weightedAverage(a.averageRequiredSequenceCallCount, validWeight[0], b.averageRequiredSequenceCallCount, validWeight[1]) ?? 0,
      averageExtraMeldCallCount: weightedAverage(a.averageExtraMeldCallCount, validWeight[0], b.averageExtraMeldCallCount, validWeight[1]) ?? 0,
      averageMaximumCompletedRequiredSequenceCount: weightedAverage(a.averageMaximumCompletedRequiredSequenceCount, validWeight[0], b.averageMaximumCompletedRequiredSequenceCount, validWeight[1]) ?? 0,
    } };
  }
  if (left.roleId === "toitoi") {
    const a = left.details?.toitoi;
    const b = right.details?.toitoi;
    if (!a || !b) return undefined;
    return { toitoi: {
      closedWinCount: a.closedWinCount + b.closedWinCount,
      openWinCount: a.openWinCount + b.openWinCount,
      ronWinCount: a.ronWinCount + b.ronWinCount,
      tsumoWinCount: a.tsumoWinCount + b.tsumoWinCount,
      shanponWinCount: a.shanponWinCount + b.shanponWinCount,
      tankiWinCount: a.tankiWinCount + b.tankiWinCount,
      averagePonCount: weightedAverage(a.averagePonCount, validWeight[0], b.averagePonCount, validWeight[1]) ?? 0,
      averageChiCount: weightedAverage(a.averageChiCount, validWeight[0], b.averageChiCount, validWeight[1]) ?? 0,
      averageInitialPairKindCount: weightedAverage(a.averageInitialPairKindCount, validWeight[0], b.averageInitialPairKindCount, validWeight[1]) ?? 0,
      averageMaximumPairKindCount: weightedAverage(a.averageMaximumPairKindCount, validWeight[0], b.averageMaximumPairKindCount, validWeight[1]) ?? 0,
      averageInitialTripletKindCount: weightedAverage(a.averageInitialTripletKindCount, validWeight[0], b.averageInitialTripletKindCount, validWeight[1]) ?? 0,
      averageMaximumTripletKindCount: weightedAverage(a.averageMaximumTripletKindCount, validWeight[0], b.averageMaximumTripletKindCount, validWeight[1]) ?? 0,
      averageWaitLiveCountAtTenpai: weightedAverage(a.averageWaitLiveCountAtTenpai, tenpaiWeight[0], b.averageWaitLiveCountAtTenpai, tenpaiWeight[1]),
      averageOpenTripletCountAtWin: weightedAverage(a.averageOpenTripletCountAtWin, winWeight[0], b.averageOpenTripletCountAtWin, winWeight[1]) ?? 0,
    } };
  }
  if (left.roleId === "pinfu") {
    const a = left.details?.pinfu;
    const b = right.details?.pinfu;
    if (!a || !b) return undefined;
    return { pinfu: {
      averageWaitKindCountAtTenpai: weightedAverage(a.averageWaitKindCountAtTenpai, tenpaiWeight[0], b.averageWaitKindCountAtTenpai, tenpaiWeight[1]),
      averageWaitLiveCountAtTenpai: weightedAverage(a.averageWaitLiveCountAtTenpai, tenpaiWeight[0], b.averageWaitLiveCountAtTenpai, tenpaiWeight[1]),
      averageMaximumCompletedSequenceCount: weightedAverage(a.averageMaximumCompletedSequenceCount, validWeight[0], b.averageMaximumCompletedSequenceCount, validWeight[1]) ?? 0,
      averageMaximumRyanmenTaatsuCount: weightedAverage(a.averageMaximumRyanmenTaatsuCount, validWeight[0], b.averageMaximumRyanmenTaatsuCount, validWeight[1]) ?? 0,
      suitedPairWinCount: a.suitedPairWinCount + b.suitedPairWinCount,
      nonValueWindPairWinCount: a.nonValueWindPairWinCount + b.nonValueWindPairWinCount,
      skippedNonPinfuWinCount: a.skippedNonPinfuWinCount + b.skippedNonPinfuWinCount,
      averageCallCount: 0,
      riichiCount: 0,
    } };
  }
  if (left.roleId === "tanyao") {
    const a = left.details?.tanyao;
    const b = right.details?.tanyao;
    if (!a || !b) return undefined;
    return { tanyao: {
      closedWinCount: a.closedWinCount + b.closedWinCount,
      openWinCount: a.openWinCount + b.openWinCount,
      standardWinCount: a.standardWinCount + b.standardWinCount,
      chiitoitsuWinCount: a.chiitoitsuWinCount + b.chiitoitsuWinCount,
      ronWinCount: a.ronWinCount + b.ronWinCount,
      tsumoWinCount: a.tsumoWinCount + b.tsumoWinCount,
      averageCallCount: weightedAverage(a.averageCallCount, validWeight[0], b.averageCallCount, validWeight[1]) ?? 0,
      averageChiCount: weightedAverage(a.averageChiCount, validWeight[0], b.averageChiCount, validWeight[1]) ?? 0,
      averagePonCount: weightedAverage(a.averagePonCount, validWeight[0], b.averagePonCount, validWeight[1]) ?? 0,
      averageInitialTerminalHonorCount: weightedAverage(a.averageInitialTerminalHonorCount, validWeight[0], b.averageInitialTerminalHonorCount, validWeight[1]) ?? 0,
      averageMinimumTerminalHonorCount: weightedAverage(a.averageMinimumTerminalHonorCount, validWeight[0], b.averageMinimumTerminalHonorCount, validWeight[1]) ?? 0,
      averageMaximumCompletedSimpleMeldCount: weightedAverage(a.averageMaximumCompletedSimpleMeldCount, validWeight[0], b.averageMaximumCompletedSimpleMeldCount, validWeight[1]) ?? 0,
      averageMaximumSimpleTaatsuCount: weightedAverage(a.averageMaximumSimpleTaatsuCount, validWeight[0], b.averageMaximumSimpleTaatsuCount, validWeight[1]) ?? 0,
      averageMaximumRyanmenTaatsuCount: weightedAverage(a.averageMaximumRyanmenTaatsuCount, validWeight[0], b.averageMaximumRyanmenTaatsuCount, validWeight[1]) ?? 0,
      averageTargetWaitKindCountAtTenpai: weightedAverage(a.averageTargetWaitKindCountAtTenpai, tenpaiWeight[0], b.averageTargetWaitKindCountAtTenpai, tenpaiWeight[1]),
      averageTargetWaitLiveCountAtTenpai: weightedAverage(a.averageTargetWaitLiveCountAtTenpai, tenpaiWeight[0], b.averageTargetWaitLiveCountAtTenpai, tenpaiWeight[1]),
      skippedNonTanyaoWinCount: a.skippedNonTanyaoWinCount + b.skippedNonTanyaoWinCount,
      riichiCount: 0,
      openTanyaoEnabled: true,
    } };
  }
  if (left.roleId === "sanshoku") {
    const a = left.details?.sanshoku;
    const b = right.details?.sanshoku;
    if (!a || !b) return undefined;
    return { sanshoku: {
      closedWinCount: a.closedWinCount + b.closedWinCount,
      openWinCount: a.openWinCount + b.openWinCount,
      ronWinCount: a.ronWinCount + b.ronWinCount,
      tsumoWinCount: a.tsumoWinCount + b.tsumoWinCount,
      sequence123WinCount: a.sequence123WinCount + b.sequence123WinCount,
      sequence234WinCount: a.sequence234WinCount + b.sequence234WinCount,
      sequence345WinCount: a.sequence345WinCount + b.sequence345WinCount,
      sequence456WinCount: a.sequence456WinCount + b.sequence456WinCount,
      sequence567WinCount: a.sequence567WinCount + b.sequence567WinCount,
      sequence678WinCount: a.sequence678WinCount + b.sequence678WinCount,
      sequence789WinCount: a.sequence789WinCount + b.sequence789WinCount,
      averageCallCount: weightedAverage(a.averageCallCount, validWeight[0], b.averageCallCount, validWeight[1]) ?? 0,
      averageRequiredSequenceCallCount: weightedAverage(a.averageRequiredSequenceCallCount, validWeight[0], b.averageRequiredSequenceCallCount, validWeight[1]) ?? 0,
      averageExtraMeldCallCount: weightedAverage(a.averageExtraMeldCallCount, validWeight[0], b.averageExtraMeldCallCount, validWeight[1]) ?? 0,
      averageMaximumCompletedRequiredSequenceCount: weightedAverage(a.averageMaximumCompletedRequiredSequenceCount, validWeight[0], b.averageMaximumCompletedRequiredSequenceCount, validWeight[1]) ?? 0,
      averageTargetWaitKindCountAtTenpai: weightedAverage(a.averageTargetWaitKindCountAtTenpai, tenpaiWeight[0], b.averageTargetWaitKindCountAtTenpai, tenpaiWeight[1]),
      averageTargetWaitLiveCountAtTenpai: weightedAverage(a.averageTargetWaitLiveCountAtTenpai, tenpaiWeight[0], b.averageTargetWaitLiveCountAtTenpai, tenpaiWeight[1]),
      skippedNonSanshokuWinCount: a.skippedNonSanshokuWinCount + b.skippedNonSanshokuWinCount,
      riichiCount: 0,
    } };
  }
  if (left.roleId === "riichi") {
    const a = left.details?.riichi;
    const b = right.details?.riichi;
    if (!a || !b) return undefined;
    const declarationCount = a.declarationCount + b.declarationCount;
    const validTrials = left.validTrials + right.validTrials;
    const wins = left.winCount + right.winCount;
    return { riichi: {
      declarationAttemptCount: a.declarationAttemptCount + b.declarationAttemptCount,
      declarationCount,
      declarationRate: validTrials === 0 ? 0 : declarationCount / validTrials,
      winAfterDeclarationRate: declarationCount === 0 ? null : wins / declarationCount,
      averageDeclarationTurn: weightedAverage(a.averageDeclarationTurn, a.declarationCount, b.averageDeclarationTurn, b.declarationCount),
      averageWaitKindCountAtDeclaration: weightedAverage(a.averageWaitKindCountAtDeclaration, a.declarationCount, b.averageWaitKindCountAtDeclaration, b.declarationCount),
      averageWaitLiveCountAtDeclaration: weightedAverage(a.averageWaitLiveCountAtDeclaration, a.declarationCount, b.averageWaitLiveCountAtDeclaration, b.declarationCount),
      ronWinCount: a.ronWinCount + b.ronWinCount,
      tsumoWinCount: a.tsumoWinCount + b.tsumoWinCount,
      declarationDealInCount: a.declarationDealInCount + b.declarationDealInCount,
      skippedPreDeclarationWinCount: a.skippedPreDeclarationWinCount + b.skippedPreDeclarationWinCount,
      furitenRiichiCount: 0,
      averageCallCount: 0,
      startingPoints: a.startingPoints,
      riichiCost: a.riichiCost,
      minimumWallTiles: a.minimumWallTiles,
    } };
  }
  return undefined;
}

function weightedAverage(
  left: number | null,
  leftWeight: number,
  right: number | null,
  rightWeight: number,
): number | null {
  const usableLeftWeight = left == null ? 0 : leftWeight;
  const usableRightWeight = right == null ? 0 : rightWeight;
  const totalWeight = usableLeftWeight + usableRightWeight;
  if (totalWeight === 0) return null;
  return ((left ?? 0) * usableLeftWeight + (right ?? 0) * usableRightWeight) / totalWeight;
}

function bestChantaOverlap(counts: Counts34, fixed: FixedContext, availableCounts?: Counts34): number {
  const regions = buildRegionOptions(fixed, counts, availableCounts);
  const remainingMelds = 4 - fixed.meldCount;
  let states = new Map<string, number>();
  states.set(`0|0|${fixed.hasSequence ? 1 : 0}|${fixed.hasHonor ? 1 : 0}`, 0);

  for (const options of regions) {
    const next = new Map<string, number>();
    for (const [key, score] of states) {
      const [melds, pairs, hasSequence, hasHonor] = key.split("|").map(Number);
      for (const option of options) {
        const nextMelds = melds! + option.melds;
        const nextPairs = pairs! + option.pairs;
        if (nextMelds > remainingMelds || nextPairs > 1) continue;
        const nextKey = `${nextMelds}|${nextPairs}|${hasSequence || option.hasSequence ? 1 : 0}|${hasHonor || option.hasHonor ? 1 : 0}`;
        const overlap = score + option.needed.reduce((sum, [index, needed]) => sum + Math.min(counts[index]!, needed), 0);
        if (overlap > (next.get(nextKey) ?? Number.NEGATIVE_INFINITY)) next.set(nextKey, overlap);
      }
    }
    states = next;
  }

  return Math.max(
    states.get(`${remainingMelds}|1|1|0`) ?? Number.NEGATIVE_INFINITY,
    states.get(`${remainingMelds}|1|1|1`) ?? Number.NEGATIVE_INFINITY,
  );
}

function canCompleteChanta(counts: Counts34, melds: ChantaMeld[], availableCounts: Counts34): boolean {
  validateAvailableCounts(availableCounts);
  const fixed = fixedContext(melds);
  if (!fixed.valid) return false;
  return Number.isFinite(bestChantaOverlap(counts, fixed, availableCounts));
}

function buildRegionOptions(fixed: FixedContext, counts: Counts34, availableCounts?: Counts34): RegionOption[][] {
  const supply = availableCounts ? counts.map((count, index) => count + availableCounts[index]!) : null;
  const regions: RegionOption[][] = [];
  for (let suit = 0; suit < 3; suit += 1) {
    const base = suit * 9;
    regions.push(edgeRegionOptions([base, base + 1, base + 2], base, fixed, supply));
    regions.push(edgeRegionOptions([base + 6, base + 7, base + 8], base + 8, fixed, supply));
  }
  for (let index = 27; index < 34; index += 1) {
    regions.push(honorRegionOptions(index, fixed, supply));
  }
  return regions;
}

function edgeRegionOptions(
  sequence: [number, number, number],
  terminal: number,
  fixed: FixedContext,
  supply: number[] | null,
): RegionOption[] {
  const capacities = sequence.map((index) => 4 - fixed.counts[index]!);
  const maxSequences = Math.min(...capacities);
  const options: RegionOption[] = [];
  for (let sequences = 0; sequences <= maxSequences; sequences += 1) {
    for (let triplet = 0; triplet <= 1; triplet += 1) {
      for (let pair = 0; pair <= 1; pair += 1) {
        if (pair && triplet) continue;
        const needed = sequence.map((index) => [index, sequences + (index === terminal ? triplet * 3 + pair * 2 : 0)] as [number, number]);
        if (needed.some(([index, count]) => count > 4 - fixed.counts[index]!)) continue;
        if (supply && needed.some(([index, count]) => count > supply[index]!)) continue;
        options.push({
          needed: needed.filter(([, count]) => count > 0),
          melds: sequences + triplet,
          pairs: pair,
          hasSequence: sequences > 0,
          hasHonor: false,
        });
      }
    }
  }
  return options;
}

function honorRegionOptions(index: number, fixed: FixedContext, supply: number[] | null): RegionOption[] {
  const capacity = 4 - fixed.counts[index]!;
  const options: RegionOption[] = [{ needed: [], melds: 0, pairs: 0, hasSequence: false, hasHonor: false }];
  if (capacity >= 2 && (!supply || supply[index]! >= 2)) {
    options.push({ needed: [[index, 2]], melds: 0, pairs: 1, hasSequence: false, hasHonor: true });
  }
  if (capacity >= 3 && (!supply || supply[index]! >= 3)) {
    options.push({ needed: [[index, 3]], melds: 1, pairs: 0, hasSequence: false, hasHonor: true });
  }
  return options;
}

function fixedContext(melds: ChantaMeld[]): FixedContext {
  const counts = emptyCounts();
  let hasSequence = false;
  let hasHonor = false;
  let valid = melds.length <= 4;
  for (const meld of melds) {
    const indexes = meld.tiles.map(tileIndex).sort((a, b) => a - b);
    if (meld.kind === "chi") {
      const startRank = indexes[0]! % 9;
      if (indexes.length !== 3 || indexes[0]! >= 27 || indexes[1] !== indexes[0]! + 1 || indexes[2] !== indexes[0]! + 2 || (startRank !== 0 && startRank !== 6)) valid = false;
      hasSequence = true;
    } else {
      if (indexes.length !== 3 || new Set(indexes).size !== 1 || !isTerminalOrHonorIndex(indexes[0]!)) valid = false;
    }
    for (const index of indexes) {
      counts[index] += 1;
      if (index >= 27) hasHonor = true;
      if (counts[index]! > 4) valid = false;
    }
  }
  return { counts, meldCount: melds.length, hasSequence, hasHonor, valid };
}

function defaultAvailableCounts(counts: Counts34, melds: ChantaMeld[]): Counts34 {
  const fixed = fixedContext(melds);
  return counts.map((count, index) => Math.max(0, 4 - count - fixed.counts[index]!));
}

function validateAvailableCounts(counts: Counts34): void {
  if (counts.length !== 34 || counts.some((count) => !Number.isInteger(count) || count < 0 || count > 4)) {
    throw new Error("availableCounts must contain 34 values from 0 to 4.");
  }
}

function isTerminalOrHonorIndex(index: number): boolean {
  return index >= 27 || index % 9 === 0 || index % 9 === 8;
}

function emptyProgress(): TargetProgressState {
  return { reachedTargetIishanten: false, reachedTargetTenpai: false, reachedTargetWin: false };
}

function runTrial(initialHand: Counts34, random: () => number, debug: boolean, targetMode: TargetMode): ChantaTrialResult {
  const table = buildTable(initialHand, random);
  if (targetMode === "chiitoitsu") {
    const initialPairKindCount = chiitoitsuPairKindCount(initialHand);
    table.players[0]!.chiitoitsuStats = {
      initialPairKindCount,
      maximumPairKindCount: initialPairKindCount,
      lastWaitIndex: null,
      waitChangeCount: 0,
      waitLiveCountAtTenpai: 0,
    };
  } else if (targetMode === "ikkitsuukan") {
    const initial = evaluateIkkitsuukanProgress(initialHand);
    table.players[0]!.ikkitsuukanStats = {
      maximumCompletedRequiredSequenceCount: initial.bestCandidate?.completedRequiredSequenceCount ?? 0,
    };
  } else if (targetMode === "toitoi") {
    const initial = evaluateToitoiProgress(initialHand);
    table.players[0]!.toitoiStats = {
      initialPairKindCount: initial.pairKindCount,
      maximumPairKindCount: initial.pairKindCount,
      initialTripletKindCount: initial.completedTripletCount,
      maximumTripletKindCount: initial.completedTripletCount,
      waitTypeAtTenpai: initial.waitType,
      waitLiveCountAtTenpai: initial.waitLiveCount,
    };
  } else if (targetMode === "pinfu") {
    const initial = evaluatePinfuProgress(initialHand, [], undefined, DEFAULT_PINFU_ROUND_CONTEXT);
    table.players[0]!.pinfuStats = {
      maximumCompletedSequenceCount: initial.completedSequenceCount,
      maximumRyanmenTaatsuCount: initial.ryanmenTaatsuCount,
      waitKindCountAtTenpai: initial.waitKindCount,
      waitLiveCountAtTenpai: initial.waitLiveCount,
      skippedNonTargetWinCount: 0,
    };
  } else if (targetMode === "tanyao") {
    const initial = evaluateTanyaoProgress(initialHand, [], undefined, DEFAULT_TANYAO_RULE_CONFIG);
    table.players[0]!.tanyaoStats = {
      initialTerminalHonorCount: initial.terminalHonorCount,
      minimumTerminalHonorCount: initial.terminalHonorCount,
      maximumCompletedSimpleMeldCount: initial.completedSimpleMeldCount,
      maximumSimpleTaatsuCount: initial.simpleTaatsuCount,
      maximumRyanmenTaatsuCount: initial.ryanmenTaatsuCount,
      waitKindCountAtTenpai: initial.waitKindCount,
      waitLiveCountAtTenpai: initial.waitLiveCount,
      skippedNonTargetWinCount: 0,
    };
  } else if (targetMode === "sanshoku") {
    const initial = evaluateSanshokuProgress(initialHand);
    table.players[0]!.sanshokuStats = {
      lockedSequenceStart: null,
      maximumCompletedRequiredSequenceCount: initial.bestCandidate?.completedRequiredSequenceCount ?? 0,
      maximumManProgress: initial.bestCandidate?.manProgress ?? 0,
      maximumPinProgress: initial.bestCandidate?.pinProgress ?? 0,
      maximumSouProgress: initial.bestCandidate?.souProgress ?? 0,
      waitKindCountAtTenpai: initial.waitKindCount,
      waitLiveCountAtTenpai: initial.waitLiveCount,
      skippedNonTargetWinCount: 0,
    };
  } else if (targetMode === "riichi") {
    table.players[0]!.riichiStats = {
      points: DEFAULT_RIICHI_RULE_CONFIG.startingPoints,
      declarationAttempted: false,
      established: false,
      declarationDealIn: false,
      waitKindCountAtDeclaration: 0,
      waitLiveCountAtDeclaration: 0,
      skippedPreDeclarationWinCount: 0,
    };
  }
  let progress = emptyProgress();
  let targetTurn = 0;
  let currentPlayer = 0;
  let needsDraw = true;
  let eventOrder = 0;
  const debugTurns: ChantaDebugTurn[] = [];

  let observed = observeTarget(table, progress, targetTurn, eventOrder, debugTurns, debug, targetMode);
  progress = observed.progress;
  if (!observed.evaluation.isPossible) {
    return trialResult(table.players[0]!, targetMode, "targetImpossible", progress, debugTurns, debug);
  }

  while (table.wall.length > 0) {
    const player = table.players[currentPlayer]!;
    let drawnIndex: number | null = null;
    if (needsDraw) {
      drawnIndex = table.wall.pop()!;
      player.counts[drawnIndex] += 1;
      eventOrder += 1;
      if (currentPlayer === 0) {
        targetTurn += 1;
        if (targetMode === "flush" || targetMode === "chiitoitsu" || targetMode === "ikkitsuukan" || targetMode === "toitoi" || targetMode === "pinfu" || targetMode === "tanyao" || targetMode === "sanshoku" || targetMode === "riichi") {
          player.temporaryTargetFuriten = false;
        }
      }
      if (canPlayerWin(table, currentPlayer, drawnIndex, "tsumo", targetMode)) {
        if (currentPlayer === 0) {
          progress = markTargetWin(progress, targetTurn, eventOrder);
          return trialResult(player, targetMode, "targetWin", progress, debugTurns, debug, "tsumo", drawnIndex);
        }
        progress = markOpponentWin(progress, targetTurn, eventOrder);
        return trialResult(table.players[0]!, targetMode, "opponentWin", progress, debugTurns, debug);
      }
      if (currentPlayer === 0
        && targetMode === "pinfu"
        && player.pinfuStats
        && normalShantenWithOpenMelds(player.counts, player.melds.length) === -1) {
        player.pinfuStats.skippedNonTargetWinCount += 1;
      }
      if (currentPlayer === 0
        && targetMode === "tanyao"
        && player.tanyaoStats
        && normalShantenWithOpenMelds(player.counts, player.melds.length) === -1) {
        player.tanyaoStats.skippedNonTargetWinCount += 1;
      }
      if (currentPlayer === 0
        && targetMode === "sanshoku"
        && player.sanshokuStats
        && normalShantenWithOpenMelds(player.counts, player.melds.length) === -1) {
        player.sanshokuStats.skippedNonTargetWinCount += 1;
      }
      if (currentPlayer === 0
        && targetMode === "riichi"
        && player.riichiStats
        && !player.riichi
        && isRiichiComplete(player.counts, player.melds)) {
        player.riichiStats.skippedPreDeclarationWinCount += 1;
      }
    }

    const choice = player.riichi && drawnIndex != null
      ? { index: drawnIndex, shanten: 0, ukeire: 0 }
      : currentPlayer === 0
        ? selectTargetDiscard(
          player.counts,
          player.melds,
          availableForPlayer(table, 0),
          targetMode,
          player.ownDiscards,
          player.sanshokuStats?.lockedSequenceStart ?? null,
          table.wall.length,
          player.riichiStats?.points ?? DEFAULT_RIICHI_RULE_CONFIG.startingPoints,
        )
        : selectFastestDiscard(player.counts, player.melds.length);
    if (debug && currentPlayer === 0 && targetMode === "flush") {
      const available = availableForPlayer(table, 0);
      const discardEvaluations = analyzeFlushDiscards(player.counts, player.melds, available);
      const selected = discardEvaluations.find((candidate) => candidate.index === choice.index);
      debugTurns.push({
        turn: targetTurn,
        normalShanten: normalShantenWithOpenMelds(player.counts, player.melds.length),
        targetShanten: selected?.targetShanten ?? choice.shanten,
        reachedTargetIishanten: progress.reachedTargetIishanten,
        reachedTargetTenpai: progress.reachedTargetTenpai,
        ...(progress.firstIishantenTurn != null ? { firstIishantenTurn: progress.firstIishantenTurn } : {}),
        ...(progress.firstTenpaiTurn != null ? { firstTenpaiTurn: progress.firstTenpaiTurn } : {}),
        targetEffectiveTiles: [],
        differenceReason: null,
        hand: countsToTiles(player.counts),
        melds: player.melds,
        selectedSuit: selected?.bestSuit ?? null,
        fixedSuit: flushFixedSuit(player.melds),
        bestTargetType: selected?.bestTargetType,
        targetUkeireCount: selected?.targetUkeireCount ?? 0,
        selectedDiscard: tileName(choice.index),
        discardEvaluations,
        decisionReason: "染め手専用シャンテン、合算有効牌、形の強さ、他色牌処理、通常進行の順で辞書式比較しました。",
      });
    } else if (debug && currentPlayer === 0 && targetMode === "chiitoitsu") {
      const available = availableForPlayer(table, 0);
      const discardEvaluations = analyzeChiitoitsuDiscards(player.counts, available, player.ownDiscards);
      const selected = discardEvaluations.find((candidate) => candidate.index === choice.index);
      debugTurns.push({
        turn: targetTurn,
        normalShanten: normalShantenWithOpenMelds(player.counts, player.melds.length),
        targetShanten: selected?.targetShanten ?? choice.shanten,
        reachedTargetIishanten: progress.reachedTargetIishanten,
        reachedTargetTenpai: progress.reachedTargetTenpai,
        ...(progress.firstIishantenTurn != null ? { firstIishantenTurn: progress.firstIishantenTurn } : {}),
        ...(progress.firstTenpaiTurn != null ? { firstTenpaiTurn: progress.firstTenpaiTurn } : {}),
        targetEffectiveTiles: [],
        differenceReason: null,
        hand: countsToTiles(player.counts),
        melds: player.melds,
        pairKindCount: selected?.pairKindCount,
        uniqueKindCount: selected?.uniqueKindCount,
        targetUkeireCount: selected?.targetUkeireCount ?? 0,
        selectedDiscard: tileName(choice.index),
        chiitoitsuDiscardEvaluations: discardEvaluations,
        decisionReason: "対子を保存し、3・4枚使いの余剰牌、七対子向聴数、山に残る単騎候補、フリテンの順に比較しました。",
      });
    } else if (debug && currentPlayer === 0 && targetMode === "ikkitsuukan") {
      const available = availableForPlayer(table, 0);
      const discardEvaluations = analyzeIkkitsuukanDiscards(
        player.counts,
        player.melds,
        available,
        player.ownDiscards,
      );
      const selected = discardEvaluations.find((candidate) => candidate.index === choice.index);
      debugTurns.push({
        turn: targetTurn,
        normalShanten: normalShantenWithOpenMelds(player.counts, player.melds.length),
        targetShanten: selected?.targetShanten ?? choice.shanten,
        reachedTargetIishanten: progress.reachedTargetIishanten,
        reachedTargetTenpai: progress.reachedTargetTenpai,
        ...(progress.firstIishantenTurn != null ? { firstIishantenTurn: progress.firstIishantenTurn } : {}),
        ...(progress.firstTenpaiTurn != null ? { firstTenpaiTurn: progress.firstTenpaiTurn } : {}),
        targetEffectiveTiles: [],
        differenceReason: null,
        hand: countsToTiles(player.counts),
        melds: player.melds,
        selectedSuit: selected?.bestSuit ?? null,
        ikkitsuukanLockedSuit: evaluateIkkitsuukanProgress(player.counts, player.melds, available).lockedSuit,
        completedRequiredSequenceCount: selected?.completedRequiredSequenceCount ?? 0,
        requiredSequenceSlots: selected?.requiredSequenceSlots ?? 3,
        remainingMeldSlots: selected?.remainingMeldSlots ?? 4,
        lowSequenceProgress: selected?.lowSequenceProgress ?? 0,
        middleSequenceProgress: selected?.middleSequenceProgress ?? 0,
        highSequenceProgress: selected?.highSequenceProgress ?? 0,
        targetUkeireCount: selected?.targetUkeireCount ?? 0,
        selectedDiscard: tileName(choice.index),
        ikkitsuukanDiscardEvaluations: discardEvaluations,
        decisionReason: "成立可能性、専用向聴数、有効牌、必須3順子、残り面子と雀頭、通常進行の順で辞書式比較しました。",
      });
    } else if (debug && currentPlayer === 0 && targetMode === "toitoi") {
      const available = availableForPlayer(table, 0);
      const discardEvaluations = analyzeToitoiDiscards(
        player.counts,
        player.melds,
        available,
        player.ownDiscards,
      );
      const selected = discardEvaluations.find((candidate) => candidate.index === choice.index);
      const current = evaluateToitoiProgress(player.counts, player.melds, available);
      debugTurns.push({
        turn: targetTurn,
        normalShanten: normalShantenWithOpenMelds(player.counts, player.melds.length),
        targetShanten: selected?.targetShanten ?? choice.shanten,
        reachedTargetIishanten: progress.reachedTargetIishanten,
        reachedTargetTenpai: progress.reachedTargetTenpai,
        ...(progress.firstIishantenTurn != null ? { firstIishantenTurn: progress.firstIishantenTurn } : {}),
        ...(progress.firstTenpaiTurn != null ? { firstTenpaiTurn: progress.firstTenpaiTurn } : {}),
        targetEffectiveTiles: current.effectiveTiles,
        differenceReason: "順子を使わず、異なる4種類の刻子と別牌種の雀頭だけで完成する経路を評価しています。",
        hand: countsToTiles(player.counts),
        melds: player.melds,
        completedTripletCount: selected?.completedTripletCount ?? current.completedTripletCount,
        openTripletCount: current.openTripletCount,
        pairKindCount: selected?.pairKindCount ?? current.pairKindCount,
        promotablePairCount: selected?.promotablePairCount ?? current.promotablePairCount,
        headCandidateCount: selected?.headCandidateCount ?? current.headCandidateCount,
        liveSingletonCount: selected?.liveSingletonCount ?? current.liveSingletonCount,
        excessFourthTileCount: selected?.excessFourthTileCount ?? current.excessFourthTileCount,
        toitoiWaitType: current.waitType,
        toitoiWaits: current.winningTiles,
        toitoiWaitLiveCount: current.waitLiveCount,
        ...(player.toitoiCallDecision ? { toitoiCallDecision: player.toitoiCallDecision } : {}),
        targetUkeireCount: selected?.targetUkeireCount ?? 0,
        selectedDiscard: tileName(choice.index),
        toitoiDiscardEvaluations: discardEvaluations,
        decisionReason: "成立可能性、専用向聴数、刻子、対子と雀頭候補、有効牌、4枚使いの余剰牌の順で辞書式比較しました。",
      });
      delete player.toitoiCallDecision;
    } else if (debug && currentPlayer === 0 && targetMode === "pinfu") {
      const available = availableForPlayer(table, 0);
      const discardEvaluations = analyzePinfuDiscards(
        player.counts,
        player.melds,
        available,
        player.ownDiscards,
        DEFAULT_PINFU_ROUND_CONTEXT,
      );
      const selected = discardEvaluations.find((candidate) => candidate.index === choice.index);
      const current = evaluatePinfuProgress(
        player.counts,
        player.melds,
        available,
        DEFAULT_PINFU_ROUND_CONTEXT,
      );
      debugTurns.push({
        turn: targetTurn,
        normalShanten: normalShantenWithOpenMelds(player.counts, player.melds.length),
        targetShanten: selected?.targetShanten ?? choice.shanten,
        reachedTargetIishanten: progress.reachedTargetIishanten,
        reachedTargetTenpai: progress.reachedTargetTenpai,
        ...(progress.firstIishantenTurn != null ? { firstIishantenTurn: progress.firstIishantenTurn } : {}),
        ...(progress.firstTenpaiTurn != null ? { firstTenpaiTurn: progress.firstTenpaiTurn } : {}),
        targetEffectiveTiles: current.effectiveTiles,
        differenceReason: "門前・順子4組・役牌でない雀頭・実際の和了牌による両面待ちを専用条件として評価しています。",
        hand: countsToTiles(player.counts),
        melds: player.melds,
        completedSequenceCount: current.completedSequenceCount,
        ryanmenTaatsuCount: current.ryanmenTaatsuCount,
        kanchanTaatsuCount: current.kanchanTaatsuCount,
        penchanTaatsuCount: current.penchanTaatsuCount,
        validPairCandidateCount: current.validPairCandidateCount,
        valuePairCount: current.valuePairCount,
        pinfuWaits: current.winningTiles,
        pinfuWaitKindCount: current.waitKindCount,
        pinfuWaitLiveCount: current.waitLiveCount,
        skippedNonPinfuWinCount: player.pinfuStats?.skippedNonTargetWinCount ?? 0,
        targetUkeireCount: selected?.targetUkeireCount ?? 0,
        selectedDiscard: tileName(choice.index),
        pinfuDiscardEvaluations: discardEvaluations,
        decisionReason: "平和成立可能性、専用向聴数、両面受け入れ、完成順子、役牌雀頭候補の処理、通常進行の順で辞書式比較しました。",
      });
    }
    if (debug && currentPlayer === 0 && targetMode === "tanyao") {
      const available = availableForPlayer(table, 0);
      const discardEvaluations = analyzeTanyaoDiscards(
        player.counts,
        player.melds,
        available,
        player.ownDiscards,
        DEFAULT_TANYAO_RULE_CONFIG,
      );
      const selected = discardEvaluations.find((candidate) => candidate.index === choice.index);
      const current = evaluateTanyaoProgress(
        player.counts,
        player.melds,
        available,
        DEFAULT_TANYAO_RULE_CONFIG,
      );
      debugTurns.push({
        turn: targetTurn,
        normalShanten: normalShantenWithOpenMelds(player.counts, player.melds.length),
        targetShanten: selected?.targetShanten ?? choice.shanten,
        reachedTargetIishanten: progress.reachedTargetIishanten,
        reachedTargetTenpai: progress.reachedTargetTenpai,
        ...(progress.firstIishantenTurn != null ? { firstIishantenTurn: progress.firstIishantenTurn } : {}),
        ...(progress.firstTenpaiTurn != null ? { firstTenpaiTurn: progress.firstTenpaiTurn } : {}),
        targetEffectiveTiles: current.effectiveTiles,
        differenceReason: "1・9・字牌を完成形から除外し、通常形と七対子形のうち近い経路だけを評価しています。",
        hand: countsToTiles(player.counts),
        melds: player.melds,
        terminalHonorCount: current.terminalHonorCount,
        simpleTileCount: current.simpleTileCount,
        completedSequenceCount: current.completedSimpleMeldCount,
        simpleTaatsuCount: current.simpleTaatsuCount,
        ryanmenTaatsuCount: current.ryanmenTaatsuCount,
        simplePairCount: current.simplePairCount,
        simpleTripletCount: current.simpleTripletCount,
        tanyaoBestShape: current.bestShape,
        tanyaoStandardShanten: current.standardShanten,
        tanyaoChiitoitsuShanten: current.chiitoitsuShanten,
        tanyaoWaits: current.winningTiles,
        tanyaoWaitKindCount: current.waitKindCount,
        tanyaoWaitLiveCount: current.waitLiveCount,
        skippedNonTanyaoWinCount: player.tanyaoStats?.skippedNonTargetWinCount ?? 0,
        ...(player.tanyaoCallDecision ? { tanyaoCallDecision: player.tanyaoCallDecision } : {}),
        targetUkeireCount: selected?.targetUkeireCount ?? 0,
        selectedDiscard: tileName(choice.index),
        tanyaoDiscardEvaluations: discardEvaluations,
        decisionReason: "タンヤオ成立可能性、専用向聴数、生きている有効牌、1・9・字牌の処理、中張牌の面子・両面形、通常進行の順で辞書式比較しました。",
      });
      delete player.tanyaoCallDecision;
    }
    if (debug && currentPlayer === 0 && targetMode === "sanshoku") {
      const available = availableForPlayer(table, 0);
      const lock = player.sanshokuStats?.lockedSequenceStart ?? null;
      const discardEvaluations = analyzeSanshokuDiscards(
        player.counts,
        player.melds,
        available,
        player.ownDiscards,
        lock,
      );
      const selected = discardEvaluations.find((candidate) => candidate.index === choice.index);
      const current = evaluateSanshokuProgress(player.counts, player.melds, available, lock);
      debugTurns.push({
        turn: targetTurn,
        normalShanten: normalShantenWithOpenMelds(player.counts, player.melds.length),
        targetShanten: selected?.targetShanten ?? choice.shanten,
        reachedTargetIishanten: progress.reachedTargetIishanten,
        reachedTargetTenpai: progress.reachedTargetTenpai,
        ...(progress.firstIishantenTurn != null ? { firstIishantenTurn: progress.firstIishantenTurn } : {}),
        ...(progress.firstTenpaiTurn != null ? { firstTenpaiTurn: progress.firstTenpaiTurn } : {}),
        targetEffectiveTiles: current.effectiveTiles,
        differenceReason: "萬子・筒子・索子の同じ開始数字の順子3組と、残り1面子・雀頭を同時に置ける完成経路だけを評価しています。",
        hand: countsToTiles(player.counts),
        melds: player.melds,
        sanshokuBestSequenceStart: current.bestCandidate?.sequenceStart ?? null,
        sanshokuLockedSequenceStart: lock,
        sanshokuManProgress: current.bestCandidate?.manProgress ?? 0,
        sanshokuPinProgress: current.bestCandidate?.pinProgress ?? 0,
        sanshokuSouProgress: current.bestCandidate?.souProgress ?? 0,
        completedRequiredSequenceCount: current.bestCandidate?.completedRequiredSequenceCount ?? 0,
        requiredSequenceSlots: current.bestCandidate?.requiredSequenceSlots ?? 3,
        remainingMeldSlots: current.bestCandidate?.remainingMeldSlots ?? 4,
        sanshokuWaits: current.winningTiles,
        sanshokuWaitKindCount: current.waitKindCount,
        sanshokuWaitLiveCount: current.waitLiveCount,
        sanshokuCandidates: current.candidates,
        sanshokuDiscardEvaluations: discardEvaluations,
        ...(player.sanshokuCallDecision ? { sanshokuCallDecision: player.sanshokuCallDecision } : {}),
        skippedNonSanshokuWinCount: player.sanshokuStats?.skippedNonTargetWinCount ?? 0,
        targetUkeireCount: selected?.targetUkeireCount ?? 0,
        selectedDiscard: tileName(choice.index),
        decisionReason: "成立可能性、専用向聴数、生きた有効牌、3色の進行バランス、必須順子、残り1面子・雀頭、通常進行の順で辞書式比較しました。",
      });
      delete player.sanshokuCallDecision;
    }
    if (debug && currentPlayer === 0 && targetMode === "riichi") {
      const available = availableForPlayer(table, 0);
      const discardEvaluations = analyzeRiichiDiscards(
        player.counts,
        available,
        player.ownDiscards,
        table.wall.length,
        player.riichiStats?.points ?? DEFAULT_RIICHI_RULE_CONFIG.startingPoints,
      );
      const selected = discardEvaluations.find((candidate) => candidate.index === choice.index);
      const current = evaluateRiichiProgress(
        player.counts,
        player.melds,
        available,
        player.ownDiscards,
        table.wall.length,
        player.riichiStats?.points ?? DEFAULT_RIICHI_RULE_CONFIG.startingPoints,
        player.riichi,
      );
      debugTurns.push({
        turn: targetTurn,
        normalShanten: current.shanten,
        targetShanten: selected?.targetShanten ?? choice.shanten,
        reachedTargetIishanten: progress.reachedTargetIishanten,
        reachedTargetTenpai: progress.reachedTargetTenpai,
        ...(progress.firstIishantenTurn != null ? { firstIishantenTurn: progress.firstIishantenTurn } : {}),
        ...(progress.firstTenpaiTurn != null ? { firstTenpaiTurn: progress.firstTenpaiTurn } : {}),
        targetEffectiveTiles: current.effectiveTiles,
        differenceReason: "門前の通常形と七対子形を比較し、最速の生きた非フリテンテンパイを評価しています。",
        hand: countsToTiles(player.counts),
        melds: player.melds,
        riichiDiscardEvaluations: discardEvaluations,
        riichiWaits: current.winningTiles,
        riichiWaitKindCount: current.waitKindCount,
        riichiWaitLiveCount: current.waitLiveCount,
        riichiCanDeclare: selected?.canDeclareRiichi ?? current.canDeclareRiichi,
        riichiFuriten: selected?.furitenRisk ?? current.isFuriten,
        riichiPoints: player.riichiStats?.points,
        riichiWallTilesRemaining: table.wall.length,
        riichiDeclarationAttempted: player.riichiStats?.declarationAttempted,
        riichiDeclarationTile: player.riichiStats?.declarationDiscard,
        riichiEstablished: player.riichiStats?.established,
        riichiEstablishedTurn: player.riichiStats?.declarationTurn,
        riichiSkippedPreDeclarationWinCount: player.riichiStats?.skippedPreDeclarationWinCount,
        targetUkeireCount: selected?.targetUkeireCount ?? 0,
        selectedDiscard: tileName(choice.index),
        decisionReason: "門前向聴数、受け入れ、非フリテン、待ち残り枚数、良形受け入れの順で辞書式比較しました。",
      });
    }
    player.counts[choice.index] -= 1;
    table.discards[choice.index] += 1;
    player.ownDiscards[choice.index] += 1;
    eventOrder += 1;

    let pendingRiichi = false;
    if (currentPlayer === 0 && targetMode === "riichi" && player.riichiStats && !player.riichi) {
      const available = availableForPlayer(table, 0);
      pendingRiichi = shouldDeclareRiichi({
        counts: player.counts,
        melds: player.melds,
        availableCounts: available,
        ownDiscards: player.ownDiscards,
        wallTilesRemaining: table.wall.length,
        points: player.riichiStats.points,
      });
      if (pendingRiichi) {
        const declaration = evaluateRiichiProgress(
          player.counts,
          player.melds,
          available,
          player.ownDiscards,
          table.wall.length,
          player.riichiStats.points,
        );
        player.riichiStats.declarationAttempted = true;
        player.riichiStats.declarationDiscard = tileName(choice.index);
        player.riichiStats.waitKindCountAtDeclaration = declaration.waitKindCount;
        player.riichiStats.waitLiveCountAtDeclaration = declaration.waitLiveCount;
      }
    }

    if (currentPlayer !== 0) {
      const targetCanWin = canPlayerWin(table, 0, choice.index, "ron", targetMode);
      if (targetCanWin) {
        progress = markTargetWin(progress, targetTurn, eventOrder);
        return trialResult(table.players[0]!, targetMode, "targetWin", progress, debugTurns, debug, "ron", choice.index);
      }
      if ((targetMode === "flush" || targetMode === "chiitoitsu" || targetMode === "ikkitsuukan" || targetMode === "toitoi" || targetMode === "pinfu" || targetMode === "tanyao" || targetMode === "sanshoku" || targetMode === "riichi")
        && isOrdinaryCompleteWithRon(table.players[0]!, choice.index)) {
        table.players[0]!.temporaryTargetFuriten = true;
        if (targetMode === "pinfu" && table.players[0]!.pinfuStats) {
          table.players[0]!.pinfuStats!.skippedNonTargetWinCount += 1;
        }
        if (targetMode === "tanyao" && table.players[0]!.tanyaoStats) {
          table.players[0]!.tanyaoStats!.skippedNonTargetWinCount += 1;
        }
        if (targetMode === "sanshoku" && table.players[0]!.sanshokuStats) {
          table.players[0]!.sanshokuStats!.skippedNonTargetWinCount += 1;
        }
        if (targetMode === "riichi" && !table.players[0]!.riichi && table.players[0]!.riichiStats) {
          table.players[0]!.riichiStats!.skippedPreDeclarationWinCount += 1;
        }
      }
    }
    for (let offset = 1; offset < 4; offset += 1) {
      const winner = (currentPlayer + offset) % 4;
      if (winner === 0) continue;
      if (canPlayerWin(table, winner, choice.index, "ron", targetMode)) {
        if (pendingRiichi && player.riichiStats) player.riichiStats.declarationDealIn = true;
        progress = markOpponentWin(progress, targetTurn, eventOrder);
        return trialResult(table.players[0]!, targetMode, "opponentWin", progress, debugTurns, debug);
      }
    }

    if (pendingRiichi && player.riichiStats) {
      player.riichi = true;
      player.riichiStats.established = true;
      player.riichiStats.declarationTurn = targetTurn;
      player.riichiStats.points -= DEFAULT_RIICHI_RULE_CONFIG.riichiCost;
    }

    if (currentPlayer === 0) {
      observed = observeTarget(table, progress, targetTurn, eventOrder, debugTurns, debug, targetMode);
      progress = observed.progress;
      if (!observed.evaluation.isPossible) {
        return trialResult(player, targetMode, "targetImpossible", progress, debugTurns, debug);
      }
    } else if (!player.riichi && player.melds.length === 0 && normalShantenWithOpenMelds(player.counts, 0) === 0) {
      player.riichi = true;
      progress = markFirstOpponentRiichi(progress, targetTurn, eventOrder);
    }

    const call = chooseCall(table, currentPlayer, choice.index, targetMode);
    if (call) {
      applyCall(table, call);
      currentPlayer = call.caller;
      needsDraw = false;
      continue;
    }
    currentPlayer = (currentPlayer + 1) % 4;
    needsDraw = true;
  }

  return trialResult(table.players[0]!, targetMode, "draw", progress, debugTurns, debug);
}

function buildTable(initialHand: Counts34, random: () => number): TableState {
  const deck: number[] = [];
  for (let index = 0; index < 34; index += 1) {
    for (let copy = initialHand[index]!; copy < 4; copy += 1) deck.push(index);
  }
  shuffle(deck, random);
  const players: PlayerState[] = [{
    counts: initialHand.slice(),
    melds: [],
    riichi: false,
    temporaryTargetFuriten: false,
    ownDiscards: emptyCounts(),
  }];
  for (let playerIndex = 1; playerIndex < 4; playerIndex += 1) {
    const counts = emptyCounts();
    for (let tile = 0; tile < 13; tile += 1) counts[deck.pop()!] += 1;
    players.push({ counts, melds: [], riichi: false, temporaryTargetFuriten: false, ownDiscards: emptyCounts() });
  }
  return { players, wall: deck, discards: emptyCounts() };
}

function observeTarget(
  table: TableState,
  progress: TargetProgressState,
  turn: number,
  eventOrder: number,
  debugTurns: ChantaDebugTurn[],
  debug: boolean,
  targetMode: TargetMode,
): {
  progress: TargetProgressState;
  evaluation: ChantaProgressEvaluation | FlushProgressEvaluation | ChiitoitsuProgressEvaluation | IkkitsuukanProgressEvaluation | ToitoiProgressEvaluation | PinfuProgressEvaluation | TanyaoProgressEvaluation | SanshokuProgressEvaluation | RiichiProgressEvaluation;
} {
  const target = table.players[0]!;
  const available = availableForPlayer(table, 0);
  const evaluation = targetMode === "chanta"
    ? evaluateChantaProgress(target.counts, target.melds, available)
    : targetMode === "flush"
      ? evaluateFlushProgress(target.counts, target.melds, available)
      : targetMode === "chiitoitsu"
        ? evaluateChiitoitsuProgress(target.counts, target.melds, available)
        : targetMode === "ikkitsuukan"
          ? evaluateIkkitsuukanProgress(target.counts, target.melds, available)
          : targetMode === "toitoi"
            ? evaluateToitoiProgress(target.counts, target.melds, available)
            : targetMode === "pinfu"
              ? evaluatePinfuProgress(target.counts, target.melds, available, DEFAULT_PINFU_ROUND_CONTEXT)
              : targetMode === "tanyao"
                ? evaluateTanyaoProgress(target.counts, target.melds, available, DEFAULT_TANYAO_RULE_CONFIG)
                : targetMode === "sanshoku"
                  ? evaluateSanshokuProgress(
                    target.counts,
                    target.melds,
                    available,
                    target.sanshokuStats?.lockedSequenceStart ?? null,
                  )
                  : evaluateRiichiProgress(
                    target.counts,
                    target.melds,
                    available,
                    target.ownDiscards,
                    table.wall.length,
                    target.riichiStats?.points ?? DEFAULT_RIICHI_RULE_CONFIG.startingPoints,
                    target.riichi,
                  );
  if (targetMode === "chiitoitsu" && target.chiitoitsuStats) {
    const chiitoitsu = evaluation as ChiitoitsuProgressEvaluation;
    target.chiitoitsuStats.maximumPairKindCount = Math.max(
      target.chiitoitsuStats.maximumPairKindCount,
      chiitoitsu.pairKindCount,
    );
    if (chiitoitsu.isTenpai) {
      const waitIndex = chiitoitsu.winningTiles.length === 1 ? tileIndex(chiitoitsu.winningTiles[0]!) : null;
      if (waitIndex != null
        && target.chiitoitsuStats.lastWaitIndex != null
        && waitIndex !== target.chiitoitsuStats.lastWaitIndex) {
        target.chiitoitsuStats.waitChangeCount += 1;
      }
      target.chiitoitsuStats.lastWaitIndex = waitIndex;
      target.chiitoitsuStats.waitLiveCountAtTenpai = chiitoitsu.waitLiveCount;
    }
  }
  if (targetMode === "ikkitsuukan" && target.ikkitsuukanStats) {
    const ikkitsuukan = evaluation as IkkitsuukanProgressEvaluation;
    target.ikkitsuukanStats.maximumCompletedRequiredSequenceCount = Math.max(
      target.ikkitsuukanStats.maximumCompletedRequiredSequenceCount,
      ikkitsuukan.bestCandidate?.completedRequiredSequenceCount ?? 0,
    );
  }
  if (targetMode === "toitoi" && target.toitoiStats) {
    const toitoi = evaluation as ToitoiProgressEvaluation;
    target.toitoiStats.maximumPairKindCount = Math.max(
      target.toitoiStats.maximumPairKindCount,
      toitoi.pairKindCount,
    );
    target.toitoiStats.maximumTripletKindCount = Math.max(
      target.toitoiStats.maximumTripletKindCount,
      toitoi.completedTripletCount,
    );
    if (toitoi.isTenpai) {
      target.toitoiStats.waitTypeAtTenpai = toitoi.waitType;
      target.toitoiStats.waitLiveCountAtTenpai = toitoi.waitLiveCount;
    }
  }
  if (targetMode === "pinfu" && target.pinfuStats) {
    const pinfu = evaluation as PinfuProgressEvaluation;
    target.pinfuStats.maximumCompletedSequenceCount = Math.max(
      target.pinfuStats.maximumCompletedSequenceCount,
      pinfu.completedSequenceCount,
    );
    target.pinfuStats.maximumRyanmenTaatsuCount = Math.max(
      target.pinfuStats.maximumRyanmenTaatsuCount,
      pinfu.ryanmenTaatsuCount,
    );
    if (pinfu.isTenpai) {
      target.pinfuStats.waitKindCountAtTenpai = pinfu.waitKindCount;
      target.pinfuStats.waitLiveCountAtTenpai = pinfu.waitLiveCount;
    }
  }
  if (targetMode === "tanyao" && target.tanyaoStats) {
    const tanyao = evaluation as TanyaoProgressEvaluation;
    target.tanyaoStats.minimumTerminalHonorCount = Math.min(
      target.tanyaoStats.minimumTerminalHonorCount,
      tanyao.terminalHonorCount,
    );
    target.tanyaoStats.maximumCompletedSimpleMeldCount = Math.max(
      target.tanyaoStats.maximumCompletedSimpleMeldCount,
      tanyao.completedSimpleMeldCount,
    );
    target.tanyaoStats.maximumSimpleTaatsuCount = Math.max(
      target.tanyaoStats.maximumSimpleTaatsuCount,
      tanyao.simpleTaatsuCount,
    );
    target.tanyaoStats.maximumRyanmenTaatsuCount = Math.max(
      target.tanyaoStats.maximumRyanmenTaatsuCount,
      tanyao.ryanmenTaatsuCount,
    );
    if (tanyao.isTenpai) {
      target.tanyaoStats.waitKindCountAtTenpai = tanyao.waitKindCount;
      target.tanyaoStats.waitLiveCountAtTenpai = tanyao.waitLiveCount;
    }
  }
  if (targetMode === "sanshoku" && target.sanshokuStats) {
    const sanshoku = evaluation as SanshokuProgressEvaluation;
    const best = sanshoku.bestCandidate;
    target.sanshokuStats.maximumCompletedRequiredSequenceCount = Math.max(
      target.sanshokuStats.maximumCompletedRequiredSequenceCount,
      best?.completedRequiredSequenceCount ?? 0,
    );
    target.sanshokuStats.maximumManProgress = Math.max(target.sanshokuStats.maximumManProgress, best?.manProgress ?? 0);
    target.sanshokuStats.maximumPinProgress = Math.max(target.sanshokuStats.maximumPinProgress, best?.pinProgress ?? 0);
    target.sanshokuStats.maximumSouProgress = Math.max(target.sanshokuStats.maximumSouProgress, best?.souProgress ?? 0);
    if (sanshoku.isTenpai) {
      target.sanshokuStats.waitKindCountAtTenpai = sanshoku.waitKindCount;
      target.sanshokuStats.waitLiveCountAtTenpai = sanshoku.waitLiveCount;
    }
  }
  const nextProgress = updateTargetProgress(progress, evaluation, turn, eventOrder);
  if (debug) {
    const normal = normalShantenWithOpenMelds(target.counts, target.melds.length);
    const baseDebug: ChantaDebugTurn = {
      turn,
      normalShanten: normal,
      targetShanten: evaluation.shanten,
      reachedTargetIishanten: nextProgress.reachedTargetIishanten,
      reachedTargetTenpai: nextProgress.reachedTargetTenpai,
      ...(nextProgress.firstIishantenTurn != null ? { firstIishantenTurn: nextProgress.firstIishantenTurn } : {}),
      ...(nextProgress.firstTenpaiTurn != null ? { firstTenpaiTurn: nextProgress.firstTenpaiTurn } : {}),
      targetEffectiveTiles: evaluation.effectiveTiles,
      differenceReason: normal === evaluation.shanten
        ? null
        : targetMode === "chanta"
          ? targetDifferenceReason(target.counts)
          : targetMode === "flush"
            ? "選択色以外の数牌、またはホンイツ・チンイツの色条件を通常シャンテンとは別に評価しています。"
            : targetMode === "chiitoitsu"
              ? "七対子専用の対子種類数・単騎待ち・残り枚数で評価しています。"
              : targetMode === "ikkitsuukan"
                ? "同色123・456・789を含む完成分解だけを対象に評価しています。"
                : targetMode === "toitoi"
                  ? "順子を使わない4刻子1雀頭の完成分解だけを対象に評価しています。"
                  : targetMode === "tanyao"
                    ? "1・9・字牌を完成形から除外し、通常形と七対子形のうち近い経路だけを評価しています。"
                    : targetMode === "sanshoku"
                      ? "同じ開始数字の順子を3色に1組ずつ含む完成分解だけを対象に評価しています。"
                      : targetMode === "riichi"
                        ? "門前の通常形と七対子形を比較し、生きた非フリテンテンパイへ進む経路を評価しています。"
                        : "門前・順子4組・役牌でない雀頭・両面待ちを満たす経路だけを対象に評価しています。",
    };
    if (targetMode === "flush") {
      const flush = evaluation as FlushProgressEvaluation;
      Object.assign(baseDebug, {
        hand: countsToTiles(target.counts),
        melds: target.melds,
        selectedSuit: flush.bestCandidate?.suit ?? null,
        fixedSuit: flush.fixedSuit,
        honitsuPossible: flush.candidates.some((candidate) => candidate.possible && candidate.targetType === "HONITSU"),
        chinitsuPossible: flush.chinitsuPossible,
        flushCandidates: flush.candidates,
        bestTargetType: flush.bestCandidate?.targetType,
        targetUkeireCount: flush.bestCandidate?.ukeireCount ?? 0,
      });
    } else if (targetMode === "chiitoitsu") {
      const chiitoitsu = evaluation as ChiitoitsuProgressEvaluation;
      Object.assign(baseDebug, {
        hand: countsToTiles(target.counts),
        melds: target.melds,
        pairKindCount: chiitoitsu.pairKindCount,
        uniqueKindCount: chiitoitsu.uniqueKindCount,
        chiitoitsuWaits: chiitoitsu.winningTiles,
        chiitoitsuWaitLiveCount: chiitoitsu.waitLiveCount,
        targetUkeireCount: chiitoitsu.isTenpai
          ? chiitoitsu.waitLiveCount
          : chiitoitsu.effectiveTiles.reduce((sum, tile) => sum + tile.remaining, 0),
      });
    } else if (targetMode === "ikkitsuukan") {
      const ikkitsuukan = evaluation as IkkitsuukanProgressEvaluation;
      const best = ikkitsuukan.bestCandidate;
      Object.assign(baseDebug, {
        hand: countsToTiles(target.counts),
        melds: target.melds,
        selectedSuit: best?.suit ?? null,
        ikkitsuukanLockedSuit: ikkitsuukan.lockedSuit,
        ikkitsuukanCandidates: ikkitsuukan.candidates,
        completedRequiredSequenceCount: best?.completedRequiredSequenceCount ?? 0,
        requiredSequenceSlots: best?.requiredSequenceSlots ?? 3,
        remainingMeldSlots: best?.remainingMeldSlots ?? 4,
        lowSequenceProgress: best?.lowSequenceProgress ?? 0,
        middleSequenceProgress: best?.middleSequenceProgress ?? 0,
        highSequenceProgress: best?.highSequenceProgress ?? 0,
        targetUkeireCount: best?.ukeireCount ?? 0,
      });
    } else if (targetMode === "toitoi") {
      const toitoi = evaluation as ToitoiProgressEvaluation;
      Object.assign(baseDebug, {
        hand: countsToTiles(target.counts),
        melds: target.melds,
        completedTripletCount: toitoi.completedTripletCount,
        openTripletCount: toitoi.openTripletCount,
        pairKindCount: toitoi.pairKindCount,
        promotablePairCount: toitoi.promotablePairCount,
        headCandidateCount: toitoi.headCandidateCount,
        liveSingletonCount: toitoi.liveSingletonCount,
        excessFourthTileCount: toitoi.excessFourthTileCount,
        toitoiWaitType: toitoi.waitType,
        toitoiWaits: toitoi.winningTiles,
        toitoiWaitLiveCount: toitoi.waitLiveCount,
        targetUkeireCount: toitoi.isTenpai
          ? toitoi.waitLiveCount
          : toitoi.effectiveTiles.reduce((sum, tile) => sum + tile.remaining, 0),
      });
    } else if (targetMode === "pinfu") {
      const pinfu = evaluation as PinfuProgressEvaluation;
      Object.assign(baseDebug, {
        hand: countsToTiles(target.counts),
        melds: target.melds,
        completedSequenceCount: pinfu.completedSequenceCount,
        ryanmenTaatsuCount: pinfu.ryanmenTaatsuCount,
        kanchanTaatsuCount: pinfu.kanchanTaatsuCount,
        penchanTaatsuCount: pinfu.penchanTaatsuCount,
        validPairCandidateCount: pinfu.validPairCandidateCount,
        valuePairCount: pinfu.valuePairCount,
        pinfuWaits: pinfu.winningTiles,
        pinfuWaitKindCount: pinfu.waitKindCount,
        pinfuWaitLiveCount: pinfu.waitLiveCount,
        skippedNonPinfuWinCount: target.pinfuStats?.skippedNonTargetWinCount ?? 0,
        targetUkeireCount: pinfu.isTenpai
          ? pinfu.waitLiveCount
          : pinfu.effectiveTiles.reduce((sum, tile) => sum + tile.remaining, 0),
      });
    } else if (targetMode === "tanyao") {
      const tanyao = evaluation as TanyaoProgressEvaluation;
      Object.assign(baseDebug, {
        hand: countsToTiles(target.counts),
        melds: target.melds,
        terminalHonorCount: tanyao.terminalHonorCount,
        simpleTileCount: tanyao.simpleTileCount,
        completedSequenceCount: tanyao.completedSimpleMeldCount,
        simpleTaatsuCount: tanyao.simpleTaatsuCount,
        ryanmenTaatsuCount: tanyao.ryanmenTaatsuCount,
        simplePairCount: tanyao.simplePairCount,
        simpleTripletCount: tanyao.simpleTripletCount,
        tanyaoBestShape: tanyao.bestShape,
        tanyaoStandardShanten: tanyao.standardShanten,
        tanyaoChiitoitsuShanten: tanyao.chiitoitsuShanten,
        tanyaoWaits: tanyao.winningTiles,
        tanyaoWaitKindCount: tanyao.waitKindCount,
        tanyaoWaitLiveCount: tanyao.waitLiveCount,
        skippedNonTanyaoWinCount: target.tanyaoStats?.skippedNonTargetWinCount ?? 0,
        targetUkeireCount: tanyao.isTenpai
          ? tanyao.waitLiveCount
          : tanyao.effectiveTiles.reduce((sum, tile) => sum + tile.remaining, 0),
      });
    } else if (targetMode === "sanshoku") {
      const sanshoku = evaluation as SanshokuProgressEvaluation;
      const best = sanshoku.bestCandidate;
      Object.assign(baseDebug, {
        hand: countsToTiles(target.counts),
        melds: target.melds,
        sanshokuBestSequenceStart: best?.sequenceStart ?? null,
        sanshokuLockedSequenceStart: target.sanshokuStats?.lockedSequenceStart ?? null,
        sanshokuManProgress: best?.manProgress ?? 0,
        sanshokuPinProgress: best?.pinProgress ?? 0,
        sanshokuSouProgress: best?.souProgress ?? 0,
        completedRequiredSequenceCount: best?.completedRequiredSequenceCount ?? 0,
        requiredSequenceSlots: best?.requiredSequenceSlots ?? 3,
        remainingMeldSlots: best?.remainingMeldSlots ?? 4,
        sanshokuWaits: sanshoku.winningTiles,
        sanshokuWaitKindCount: sanshoku.waitKindCount,
        sanshokuWaitLiveCount: sanshoku.waitLiveCount,
        sanshokuCandidates: sanshoku.candidates,
        skippedNonSanshokuWinCount: target.sanshokuStats?.skippedNonTargetWinCount ?? 0,
        targetUkeireCount: sanshoku.isTenpai
          ? sanshoku.waitLiveCount
          : sanshoku.effectiveTiles.reduce((sum, tile) => sum + tile.remaining, 0),
      });
    } else if (targetMode === "riichi") {
      const riichi = evaluation as RiichiProgressEvaluation;
      Object.assign(baseDebug, {
        hand: countsToTiles(target.counts),
        melds: target.melds,
        riichiWaits: riichi.winningTiles,
        riichiWaitKindCount: riichi.waitKindCount,
        riichiWaitLiveCount: riichi.waitLiveCount,
        riichiCanDeclare: riichi.canDeclareRiichi,
        riichiFuriten: riichi.isFuriten,
        riichiPoints: target.riichiStats?.points,
        riichiWallTilesRemaining: table.wall.length,
        riichiDeclarationAttempted: target.riichiStats?.declarationAttempted,
        riichiDeclarationTile: target.riichiStats?.declarationDiscard,
        riichiEstablished: target.riichiStats?.established,
        riichiEstablishedTurn: target.riichiStats?.declarationTurn,
        riichiSkippedPreDeclarationWinCount: target.riichiStats?.skippedPreDeclarationWinCount,
        targetUkeireCount: riichi.isTenpai
          ? riichi.waitLiveCount
          : riichi.effectiveTiles.reduce((sum, tile) => sum + tile.remaining, 0),
      });
    }
    debugTurns.push(baseDebug);
  }
  return { progress: nextProgress, evaluation };
}

function markTargetWin(progress: TargetProgressState, turn: number, eventOrder: number): TargetProgressState {
  return {
    ...progress,
    reachedTargetIishanten: true,
    reachedTargetTenpai: true,
    reachedTargetWin: true,
    firstIishantenTurn: progress.firstIishantenTurn ?? Math.max(0, turn - 1),
    firstTenpaiTurn: progress.firstTenpaiTurn ?? Math.max(0, turn - 1),
    firstTenpaiEventOrder: progress.firstTenpaiEventOrder ?? eventOrder,
    winTurn: turn,
  };
}

function markFirstOpponentRiichi(
  progress: TargetProgressState,
  turn: number,
  eventOrder: number,
): TargetProgressState {
  if (progress.firstOpponentRiichiEventOrder != null) return progress;
  return {
    ...progress,
    firstOpponentRiichiTurn: turn,
    firstOpponentRiichiEventOrder: eventOrder,
  };
}

function markOpponentWin(progress: TargetProgressState, turn: number, eventOrder: number): TargetProgressState {
  return {
    ...progress,
    opponentWinTurn: turn,
    opponentWinEventOrder: eventOrder,
  };
}

function targetShantenForMode(
  counts: Counts34,
  melds: ChantaMeld[],
  available: Counts34,
  targetMode: TargetMode,
  lockedSequenceStart: SanshokuSequenceStart | null = null,
): number {
  if (targetMode === "chanta") return chantaShanten(counts, melds);
  if (targetMode === "flush") return flushShanten(counts, melds);
  if (targetMode === "chiitoitsu") return chiitoitsuShanten(counts, melds);
  if (targetMode === "ikkitsuukan") return ikkitsuukanShanten(counts, melds);
  if (targetMode === "toitoi") return toitoiShanten(counts, melds, available);
  if (targetMode === "pinfu") return pinfuShanten(counts, melds, available, DEFAULT_PINFU_ROUND_CONTEXT);
  if (targetMode === "tanyao") return tanyaoShanten(counts, melds, available, DEFAULT_TANYAO_RULE_CONFIG);
  if (targetMode === "sanshoku") return sanshokuShanten(counts, melds, available, lockedSequenceStart);
  return riichiShanten(counts, melds);
}

function trialResult(
  player: PlayerState,
  targetMode: TargetMode,
  outcome: ChantaTrialOutcome,
  progress: TargetProgressState,
  debugTurns: ChantaDebugTurn[],
  debug: boolean,
  winMethod?: "ron" | "tsumo",
  winningIndex?: number,
): ChantaTrialResult {
  const targetChiCount = player.melds.filter((meld) => meld.kind === "chi").length;
  const targetPonCount = player.melds.filter((meld) => meld.kind === "pon").length;
  const available = snapshotAvailableCounts(player.counts, player.melds);
  const practicalScore = calculatePracticalTenpaiTrialScore(practicalTenpaiInputForProgress(progress));
  if (debug && debugTurns.length > 0) {
    Object.assign(debugTurns[debugTurns.length - 1]!, {
      ...(progress.firstTenpaiEventOrder != null ? { firstTenpaiEventOrder: progress.firstTenpaiEventOrder } : {}),
      ...(progress.firstOpponentRiichiTurn != null ? { firstOpponentRiichiTurn: progress.firstOpponentRiichiTurn } : {}),
      ...(progress.firstOpponentRiichiEventOrder != null
        ? { firstOpponentRiichiEventOrder: progress.firstOpponentRiichiEventOrder }
        : {}),
      ...(progress.opponentWinTurn != null ? { opponentWinTurn: progress.opponentWinTurn } : {}),
      ...(progress.opponentWinEventOrder != null ? { opponentWinEventOrder: progress.opponentWinEventOrder } : {}),
      practicalTenpaiTurnWeight: practicalScore.turnWeight,
      practicalTenpaiSituationWeight: practicalScore.situationWeight,
      practicalTenpaiTrialScore: practicalScore.trialScore,
      practicalTenpaiSituation: practicalScore.situation,
      trialOutcome: outcome,
    });
  }
  const result: ChantaTrialResult = {
    outcome,
    progress,
    targetMeldCount: player.melds.length,
    targetChiCount,
    targetPonCount,
    finalTargetShanten: targetShantenForMode(
      player.counts,
      player.melds,
      available,
      targetMode,
      player.sanshokuStats?.lockedSequenceStart ?? null,
    ),
    ...(winMethod ? { winMethod } : {}),
    ...(debug ? { debugTurns } : {}),
  };
  if (targetMode === "chiitoitsu" && player.chiitoitsuStats) {
    result.initialPairKindCount = player.chiitoitsuStats.initialPairKindCount;
    result.maximumPairKindCount = player.chiitoitsuStats.maximumPairKindCount;
    result.finalPairKindCount = chiitoitsuPairKindCount(player.counts);
    result.waitChangeCount = player.chiitoitsuStats.waitChangeCount;
    result.waitLiveCountAtTenpai = player.chiitoitsuStats.waitLiveCountAtTenpai;
  }
  if (targetMode === "ikkitsuukan" && player.ikkitsuukanStats) {
    const winningCounts = player.counts.slice();
    if (outcome === "targetWin" && winMethod === "ron" && winningIndex != null) winningCounts[winningIndex] += 1;
    const classification = outcome === "targetWin"
      ? classifyIkkitsuukanWin(winningCounts, player.melds)
      : { type: "NONE" as const, suit: null };
    const current = evaluateIkkitsuukanProgress(player.counts, player.melds, available);
    const suit = classification.suit ?? current.bestCandidate?.suit ?? null;
    const open = suit ? countOpenIkkitsuukanMelds(player.melds, suit) : { required: 0, extra: player.melds.length };
    result.ikkitsuukanWinSuit = classification.suit;
    result.openRequiredSequenceCount = open.required;
    result.openExtraMeldCount = open.extra;
    result.maximumCompletedRequiredSequenceCount = Math.max(
      player.ikkitsuukanStats.maximumCompletedRequiredSequenceCount,
      classification.type === "IKKITSUUKAN" ? 3 : 0,
    );
  }
  if (targetMode === "toitoi" && player.toitoiStats) {
    const winningCounts = player.counts.slice();
    if (outcome === "targetWin" && winMethod === "ron" && winningIndex != null) winningCounts[winningIndex] += 1;
    result.toitoiInitialPairKindCount = player.toitoiStats.initialPairKindCount;
    result.toitoiMaximumPairKindCount = player.toitoiStats.maximumPairKindCount;
    result.toitoiInitialTripletKindCount = player.toitoiStats.initialTripletKindCount;
    result.toitoiMaximumTripletKindCount = Math.max(
      player.toitoiStats.maximumTripletKindCount,
      outcome === "targetWin" ? 4 : 0,
    );
    result.toitoiWaitTypeAtTenpai = player.toitoiStats.waitTypeAtTenpai;
    result.toitoiWaitLiveCountAtTenpai = player.toitoiStats.waitLiveCountAtTenpai;
    if (outcome === "targetWin" && winningIndex != null && isToitoiComplete(winningCounts, player.melds)) {
      const preWinCount = winMethod === "tsumo"
        ? winningCounts[winningIndex]! - 1
        : player.counts[winningIndex]!;
      result.toitoiWinWaitType = preWinCount === 1 ? "TANKI" : "SHANPON";
    }
  }
  if (targetMode === "pinfu" && player.pinfuStats) {
    result.pinfuMaximumCompletedSequenceCount = player.pinfuStats.maximumCompletedSequenceCount;
    result.pinfuMaximumRyanmenTaatsuCount = player.pinfuStats.maximumRyanmenTaatsuCount;
    result.pinfuWaitKindCountAtTenpai = player.pinfuStats.waitKindCountAtTenpai;
    result.pinfuWaitLiveCountAtTenpai = player.pinfuStats.waitLiveCountAtTenpai;
    result.pinfuSkippedNonTargetWinCount = player.pinfuStats.skippedNonTargetWinCount;
    if (outcome === "targetWin" && winningIndex != null) {
      const preWinCounts = player.counts.slice();
      if (winMethod === "tsumo") preWinCounts[winningIndex] -= 1;
      const classification = classifyPinfuWin(
        preWinCounts,
        tileName(winningIndex),
        player.melds,
        DEFAULT_PINFU_ROUND_CONTEXT,
      );
      result.pinfuWinPairType = classification.pairType;
    }
  }
  if (targetMode === "tanyao" && player.tanyaoStats) {
    result.tanyaoInitialTerminalHonorCount = player.tanyaoStats.initialTerminalHonorCount;
    result.tanyaoMinimumTerminalHonorCount = player.tanyaoStats.minimumTerminalHonorCount;
    result.tanyaoMaximumCompletedSimpleMeldCount = player.tanyaoStats.maximumCompletedSimpleMeldCount;
    result.tanyaoMaximumSimpleTaatsuCount = player.tanyaoStats.maximumSimpleTaatsuCount;
    result.tanyaoMaximumRyanmenTaatsuCount = player.tanyaoStats.maximumRyanmenTaatsuCount;
    result.tanyaoWaitKindCountAtTenpai = player.tanyaoStats.waitKindCountAtTenpai;
    result.tanyaoWaitLiveCountAtTenpai = player.tanyaoStats.waitLiveCountAtTenpai;
    result.tanyaoSkippedNonTargetWinCount = player.tanyaoStats.skippedNonTargetWinCount;
    if (outcome === "targetWin") {
      const winningCounts = player.counts.slice();
      if (winMethod === "ron" && winningIndex != null) winningCounts[winningIndex] += 1;
      result.tanyaoWinShape = classifyTanyaoWin(
        winningCounts,
        player.melds,
        DEFAULT_TANYAO_RULE_CONFIG,
      ).shape;
    }
  }
  if (targetMode === "sanshoku" && player.sanshokuStats) {
    const winningCounts = player.counts.slice();
    if (outcome === "targetWin" && winMethod === "ron" && winningIndex != null) winningCounts[winningIndex] += 1;
    const classification = outcome === "targetWin"
      ? classifySanshokuWin(
        winningCounts,
        player.melds,
        player.sanshokuStats.lockedSequenceStart,
      )
      : { type: "NONE" as const, sequenceStart: null };
    const current = evaluateSanshokuProgress(
      player.counts,
      player.melds,
      available,
      player.sanshokuStats.lockedSequenceStart,
    );
    const sequenceStart = classification.sequenceStart
      ?? player.sanshokuStats.lockedSequenceStart
      ?? current.bestCandidate?.sequenceStart
      ?? null;
    const open = sequenceStart
      ? countOpenSanshokuMelds(player.melds, sequenceStart)
      : { required: 0, extra: player.melds.length };
    result.sanshokuWinSequenceStart = classification.sequenceStart;
    result.sanshokuOpenRequiredSequenceCount = open.required;
    result.sanshokuOpenExtraMeldCount = open.extra;
    result.sanshokuMaximumCompletedRequiredSequenceCount = Math.max(
      player.sanshokuStats.maximumCompletedRequiredSequenceCount,
      classification.type === "SANSHOKU" ? 3 : 0,
    );
    result.sanshokuWaitKindCountAtTenpai = player.sanshokuStats.waitKindCountAtTenpai;
    result.sanshokuWaitLiveCountAtTenpai = player.sanshokuStats.waitLiveCountAtTenpai;
    result.sanshokuSkippedNonTargetWinCount = player.sanshokuStats.skippedNonTargetWinCount;
  }
  if (targetMode === "riichi" && player.riichiStats) {
    result.riichiDeclarationAttempted = player.riichiStats.declarationAttempted;
    result.riichiEstablished = player.riichiStats.established;
    result.riichiDeclarationTurn = player.riichiStats.declarationTurn;
    result.riichiDeclarationDiscard = player.riichiStats.declarationDiscard;
    result.riichiDeclarationDealIn = player.riichiStats.declarationDealIn;
    result.riichiWaitKindCountAtDeclaration = player.riichiStats.waitKindCountAtDeclaration;
    result.riichiWaitLiveCountAtDeclaration = player.riichiStats.waitLiveCountAtDeclaration;
    result.riichiSkippedPreDeclarationWinCount = player.riichiStats.skippedPreDeclarationWinCount;
  }
  if (targetMode === "flush" && outcome === "targetWin") {
    const winningCounts = player.counts.slice();
    if (winMethod === "ron" && winningIndex != null) winningCounts[winningIndex] += 1;
    const classification = classifyFlushWin(winningCounts, player.melds);
    result.flushWinType = classification.type;
    result.selectedSuitAtWin = classification.suit;
  }
  return result;
}

function snapshotAvailableCounts(counts: Counts34, melds: ChantaMeld[]): Counts34 {
  const fixed = emptyCounts();
  for (const meld of melds) for (const tile of meld.tiles) fixed[tileIndex(tile)] += 1;
  return counts.map((count, index) => Math.max(0, 4 - count - fixed[index]!));
}

function flushFixedSuit(melds: ChantaMeld[]): FlushSuit | null {
  const locked = lockedFlushSuit(melds);
  return locked === "CONFLICT" ? null : locked;
}

function availableForPlayer(table: TableState, playerIndex: number): Counts34 {
  const own = table.players[playerIndex]!;
  const visible = table.discards.slice();
  for (const player of table.players) {
    for (const meld of player.melds) {
      for (const tile of meld.tiles) visible[tileIndex(tile)] += 1;
    }
  }
  return visible.map((count, index) => Math.max(0, 4 - count - own.counts[index]!));
}

function selectTargetDiscard(
  counts: Counts34,
  melds: ChantaMeld[],
  available: Counts34,
  targetMode: TargetMode,
  ownDiscards = emptyCounts(),
  lockedSequenceStart: SanshokuSequenceStart | null = null,
  wallTilesRemaining = 70,
  points = DEFAULT_RIICHI_RULE_CONFIG.startingPoints,
): DiscardChoice {
  if (targetMode === "flush") {
    const choice = selectBestFlushDiscard(counts, melds, available);
    return { index: choice.index, shanten: choice.targetShanten, ukeire: choice.targetUkeireCount };
  }
  if (targetMode === "ikkitsuukan") {
    const choice = selectBestIkkitsuukanDiscard(counts, melds, available, ownDiscards);
    if (!choice) throw new Error("打牌候補がありません。");
    return { index: choice.index, shanten: choice.targetShanten, ukeire: choice.targetUkeireCount };
  }
  if (targetMode === "toitoi") {
    const choice = selectBestToitoiDiscard(counts, melds, available, ownDiscards);
    return { index: choice.index, shanten: choice.targetShanten, ukeire: choice.targetUkeireCount };
  }
  if (targetMode === "pinfu") {
    const choice = selectBestPinfuDiscard(
      counts,
      melds,
      available,
      ownDiscards,
      DEFAULT_PINFU_ROUND_CONTEXT,
    );
    return { index: choice.index, shanten: choice.targetShanten, ukeire: choice.targetUkeireCount };
  }
  if (targetMode === "tanyao") {
    const choice = selectBestTanyaoDiscard(
      counts,
      melds,
      available,
      ownDiscards,
      DEFAULT_TANYAO_RULE_CONFIG,
    );
    return { index: choice.index, shanten: choice.targetShanten, ukeire: choice.targetUkeireCount };
  }
  if (targetMode === "sanshoku") {
    const choice = selectBestSanshokuDiscard(
      counts,
      melds,
      available,
      ownDiscards,
      lockedSequenceStart,
    );
    if (!choice) throw new Error("三色同順の打牌候補がありません。");
    return { index: choice.index, shanten: choice.targetShanten, ukeire: choice.targetUkeireCount };
  }
  if (targetMode === "riichi") {
    const choice = selectBestRiichiDiscard(
      counts,
      available,
      ownDiscards,
      wallTilesRemaining,
      points,
    );
    return { index: choice.index, shanten: choice.targetShanten, ukeire: choice.targetUkeireCount };
  }
  if (targetMode === "chiitoitsu") {
    const choice = selectBestChiitoitsuDiscard(counts, available, ownDiscards);
    if (!choice) throw new Error("打牌候補がありません。");
    return { index: choice.index, shanten: choice.targetShanten, ukeire: choice.targetUkeireCount };
  }
  const candidates: DiscardChoice[] = [];
  for (let index = 0; index < 34; index += 1) {
    if (counts[index]! <= 0) continue;
    const after = counts.slice();
    after[index] -= 1;
    const shanten = chantaShanten(after, melds);
    candidates.push({ index, shanten, ukeire: 0 });
  }
  if (candidates.length === 0) throw new Error("打牌候補がありません。");
  const bestShanten = Math.min(...candidates.map((choice) => choice.shanten));
  const finalists = candidates.filter((choice) => choice.shanten === bestShanten).map((choice) => {
    const after = counts.slice();
    after[choice.index] -= 1;
    return { ...choice, ukeire: chantaUkeireCount(after, melds, available, choice.shanten) };
  });
  return finalists.sort(compareDiscard)[0]!;
}

function selectFastestDiscard(counts: Counts34, openMeldCount: number): DiscardChoice {
  const candidates: DiscardChoice[] = [];
  for (let index = 0; index < 34; index += 1) {
    if (counts[index]! <= 0) continue;
    const after = counts.slice();
    after[index] -= 1;
    const shanten = normalShantenWithOpenMelds(after, openMeldCount);
    candidates.push({ index, shanten, ukeire: localAcceptanceScore(after, index) });
  }
  if (candidates.length === 0) throw new Error("打牌候補がありません。");
  const bestShanten = Math.min(...candidates.map((choice) => choice.shanten));
  const finalists = candidates.filter((choice) => choice.shanten === bestShanten);
  return finalists.sort(compareDiscard)[0]!;
}

function compareDiscard(left: DiscardChoice, right: DiscardChoice): number {
  if (left.shanten !== right.shanten) return left.shanten - right.shanten;
  if (left.ukeire !== right.ukeire) return right.ukeire - left.ukeire;
  return left.index - right.index;
}

function chantaUkeireCount(counts: Counts34, melds: ChantaMeld[], available: Counts34, shanten: number): number {
  if (!Number.isFinite(shanten)) return 0;
  let total = 0;
  for (let index = 0; index < 34; index += 1) {
    if (counts[index]! >= 4 || available[index]! <= 0) continue;
    const drawn = counts.slice();
    drawn[index] += 1;
    if (chantaShanten(drawn, melds) < shanten) total += available[index]!;
  }
  return total;
}

function localAcceptanceScore(counts: Counts34, discardedIndex: number): number {
  let score = 0;
  for (let index = 0; index < 34; index += 1) {
    if (counts[index]! >= 4) continue;
    const remaining = 4 - counts[index]!;
    if (counts[index]! >= 2) score += remaining * 3;
    else if (counts[index] === 1) score += remaining;
    if (index < 27) {
      for (const distance of [1, 2]) {
        for (const direction of [-1, 1]) {
          const neighbor = index + distance * direction;
          if (neighbor >= 0 && neighbor < 27 && Math.floor(neighbor / 9) === Math.floor(index / 9) && counts[neighbor]! > 0) {
            score += remaining * (distance === 1 ? 2 : 1);
          }
        }
      }
    }
  }
  if (discardedIndex >= 27 && counts[discardedIndex] === 0) score += 1;
  return score;
}

function canPlayerWin(
  table: TableState,
  playerIndex: number,
  winningIndex: number,
  method: "ron" | "tsumo",
  targetMode: TargetMode,
): boolean {
  const player = table.players[playerIndex]!;
  if (playerIndex === 0
    && (targetMode === "flush" || targetMode === "chiitoitsu" || targetMode === "ikkitsuukan" || targetMode === "toitoi" || targetMode === "pinfu" || targetMode === "tanyao" || targetMode === "sanshoku" || targetMode === "riichi")
    && method === "ron"
    && player.temporaryTargetFuriten) return false;
  if (playerIndex === 0
    && (targetMode === "chiitoitsu" || targetMode === "ikkitsuukan" || targetMode === "toitoi" || targetMode === "pinfu" || targetMode === "tanyao" || targetMode === "sanshoku" || targetMode === "riichi")
    && method === "ron"
    && player.ownDiscards[winningIndex]! > 0) return false;
  const counts = player.counts.slice();
  if (method === "ron") {
    if (counts[winningIndex]! >= 4) return false;
    counts[winningIndex] += 1;
  }
  if (playerIndex === 0) {
    if (targetMode === "chanta") return isChantaComplete(counts, player.melds);
    if (targetMode === "flush") return classifyFlushWin(counts, player.melds).type !== "NONE";
    if (targetMode === "chiitoitsu") return isChiitoitsuComplete(counts, player.melds);
    if (targetMode === "ikkitsuukan") return classifyIkkitsuukanWin(counts, player.melds).type === "IKKITSUUKAN";
    if (targetMode === "toitoi") return isToitoiComplete(counts, player.melds);
    if (targetMode === "tanyao") {
      return classifyTanyaoWin(counts, player.melds, DEFAULT_TANYAO_RULE_CONFIG).type === "TANYAO";
    }
    if (targetMode === "sanshoku") {
      return classifySanshokuWin(
        counts,
        player.melds,
        player.sanshokuStats?.lockedSequenceStart ?? null,
      ).type === "SANSHOKU";
    }
    if (targetMode === "riichi") return player.riichi && isRiichiComplete(counts, player.melds);
    const preWinCounts = player.counts.slice();
    if (method === "tsumo") preWinCounts[winningIndex] -= 1;
    return classifyPinfuWin(
      preWinCounts,
      tileName(winningIndex),
      player.melds,
      DEFAULT_PINFU_ROUND_CONTEXT,
    ).type === "PINFU";
  }
  if (normalShantenWithOpenMelds(counts, player.melds.length) !== -1) return false;
  try {
    calculateHandScore({
      counts,
      melds: player.melds as HandScoreMeld[],
      winningTile: tileName(winningIndex),
      isDealer: playerIndex === 0,
      winMethod: method,
      roundWind: TILE_NAMES[27]!,
      seatWind: TILE_NAMES[27 + playerIndex]!,
      riichi: player.riichi,
    });
    return true;
  } catch {
    return false;
  }
}

function isOrdinaryCompleteWithRon(player: PlayerState, winningIndex: number): boolean {
  if (player.counts[winningIndex]! >= 4) return false;
  const counts = player.counts.slice();
  counts[winningIndex] += 1;
  return normalShantenWithOpenMelds(counts, player.melds.length) === -1
    || (player.melds.length === 0 && isChiitoitsuComplete(counts));
}

function chooseCall(table: TableState, discarder: number, discardedIndex: number, targetMode: TargetMode): CallChoice | null {
  const order = [1, 2, 3].map((offset) => (discarder + offset) % 4);
  for (const caller of order) {
    const call = ponCall(table, caller, discardedIndex, targetMode);
    if (call) return call;
  }
  const nextPlayer = (discarder + 1) % 4;
  return chiCall(table, nextPlayer, discardedIndex, targetMode);
}

function ponCall(table: TableState, caller: number, discardedIndex: number, targetMode: TargetMode): CallChoice | null {
  const player = table.players[caller]!;
  if (caller === 0 && (targetMode === "chiitoitsu" || targetMode === "pinfu" || targetMode === "riichi")) return null;
  if (player.riichi || player.melds.length >= 4 || player.counts[discardedIndex]! < 2) return null;
  if (caller === 0 && targetMode === "chanta" && !isTerminalOrHonorIndex(discardedIndex)) return null;
  const concealed = player.counts.slice();
  concealed[discardedIndex] -= 2;
  const tile = tileName(discardedIndex);
  const meld: ChantaMeld = { kind: "pon", tiles: [tile, tile, tile] };
  if (caller === 0 && targetMode === "flush" && !isFlushCompatibleMeld(meld, player.melds)) return null;
  if (caller === 0 && targetMode === "ikkitsuukan" && !isIkkitsuukanCompatibleMeld(meld, player.melds)) return null;
  if (caller === 0 && targetMode === "toitoi" && !isToitoiCompatibleMeld(meld, player.melds)) return null;
  if (caller === 0 && targetMode === "tanyao"
    && !isTanyaoCompatibleMeld(meld, player.melds, DEFAULT_TANYAO_RULE_CONFIG)) return null;
  if (caller === 0 && targetMode === "sanshoku"
    && !isSanshokuCompatibleMeld(
      meld,
      player.melds,
      player.sanshokuStats?.lockedSequenceStart ?? null,
    )) return null;
  return acceptedCall(table, caller, concealed, meld, [discardedIndex, discardedIndex], targetMode);
}

function chiCall(table: TableState, caller: number, discardedIndex: number, targetMode: TargetMode): CallChoice | null {
  const player = table.players[caller]!;
  if (caller === 0 && (targetMode === "chiitoitsu" || targetMode === "toitoi" || targetMode === "pinfu" || targetMode === "riichi")) return null;
  if (player.riichi || player.melds.length >= 4 || discardedIndex >= 27) return null;
  const rank = discardedIndex % 9;
  const suitBase = Math.floor(discardedIndex / 9) * 9;
  const starts = caller === 0 && targetMode === "chanta"
    ? [rank <= 2 ? 0 : 6].filter((start) => start <= rank && rank <= start + 2)
    : Array.from({ length: 3 }, (_, offset) => rank - 2 + offset).filter((start) => start >= 0 && start <= 6 && start <= rank && rank <= start + 2);
  let best: CallChoice | null = null;
  for (const start of starts) {
    const indexes = [suitBase + start, suitBase + start + 1, suitBase + start + 2];
    const removed = indexes.filter((index) => index !== discardedIndex);
    if (removed.some((index) => player.counts[index]! <= removed.filter((value) => value === index).length - 1)) continue;
    const concealed = player.counts.slice();
    for (const index of removed) concealed[index] -= 1;
    const meld: ChantaMeld = { kind: "chi", tiles: indexes.map(tileName) };
    if (caller === 0 && targetMode === "flush" && !isFlushCompatibleMeld(meld, player.melds)) continue;
    if (caller === 0 && targetMode === "ikkitsuukan" && !isIkkitsuukanCompatibleMeld(meld, player.melds)) continue;
    if (caller === 0 && targetMode === "tanyao"
      && !isTanyaoCompatibleMeld(meld, player.melds, DEFAULT_TANYAO_RULE_CONFIG)) continue;
    if (caller === 0 && targetMode === "sanshoku"
      && !isSanshokuCompatibleMeld(
        meld,
        player.melds,
        player.sanshokuStats?.lockedSequenceStart ?? null,
      )) continue;
    const call = acceptedCall(table, caller, concealed, meld, removed, targetMode);
    if (call && (!best || compareDiscard(call.discard, best.discard) < 0)) best = call;
  }
  return best;
}

function acceptedCall(
  table: TableState,
  caller: number,
  concealed: Counts34,
  meld: ChantaMeld,
  removed: number[],
  targetMode: TargetMode,
): CallChoice | null {
  const player = table.players[caller]!;
  const nextMelds = [...player.melds, meld];
  const currentShanten = caller === 0
    ? targetShantenForMode(
      player.counts,
      player.melds,
      availableForPlayer(table, caller),
      targetMode,
      player.sanshokuStats?.lockedSequenceStart ?? null,
    )
    : normalShantenWithOpenMelds(player.counts, player.melds.length);
  let discard = caller === 0
    ? selectTargetDiscard(
      concealed,
      nextMelds,
      availableForPlayer(table, caller),
      targetMode,
      player.ownDiscards,
      player.sanshokuStats?.lockedSequenceStart ?? null,
    )
    : selectFastestDiscard(concealed, nextMelds.length);
  if (caller === 0 && targetMode === "toitoi") {
    const decision = evaluateToitoiPonDecision(
      player.counts,
      player.melds,
      meld.tiles[0]!,
      availableForPlayer(table, caller),
      player.ownDiscards,
    );
    player.toitoiCallDecision = { ...decision, tile: meld.tiles[0]! };
    if (!decision.call) return null;
  } else if (caller === 0 && targetMode === "tanyao") {
    const decision = evaluateTanyaoCallDecision(
      player.counts,
      player.melds,
      concealed,
      meld,
      availableForPlayer(table, caller),
      player.ownDiscards,
      DEFAULT_TANYAO_RULE_CONFIG,
    );
    player.tanyaoCallDecision = { ...decision, meld };
    if (!decision.call) return null;
  } else if (caller === 0 && targetMode === "sanshoku") {
    const decision = evaluateSanshokuCallDecision(
      player.counts,
      player.melds,
      concealed,
      meld,
      availableForPlayer(table, caller),
      player.ownDiscards,
      player.sanshokuStats?.lockedSequenceStart ?? null,
    );
    player.sanshokuCallDecision = { ...decision, meld };
    if (!decision.call) return null;
    const choice = selectBestSanshokuDiscard(
      concealed,
      nextMelds,
      availableForPlayer(table, caller),
      player.ownDiscards,
      decision.lockedSequenceStart,
    );
    if (!choice) return null;
    discard = { index: choice.index, shanten: choice.targetShanten, ukeire: choice.targetUkeireCount };
    if (player.sanshokuStats) player.sanshokuStats.lockedSequenceStart = decision.lockedSequenceStart;
  } else if (discard.shanten >= currentShanten) {
    return null;
  }
  if (caller !== 0 && !hasOpenYakuPath(concealed, nextMelds, caller)) return null;
  return { caller, meld, removed, discard };
}

function hasOpenYakuPath(counts: Counts34, melds: ChantaMeld[], playerIndex: number): boolean {
  const yakuhai = melds.some((meld) => meld.kind === "pon" && (() => {
    const index = tileIndex(meld.tiles[0]!);
    return DRAGON_INDICES.has(index) || index === 27 || index === 27 + playerIndex;
  })());
  if (yakuhai) return true;
  const used = counts.flatMap((count, index) => count > 0 ? [index] : []);
  const meldIndexes = melds.flatMap((meld) => meld.tiles.map(tileIndex));
  const all = [...used, ...meldIndexes];
  if (all.length && all.every((index) => index < 27 && index % 9 !== 0 && index % 9 !== 8)) return true;
  const suits = new Set(all.filter((index) => index < 27).map((index) => Math.floor(index / 9)));
  if (suits.size === 1) return true;
  return Number.isFinite(chantaShanten(counts, melds));
}

function applyCall(table: TableState, call: CallChoice): void {
  const player = table.players[call.caller]!;
  for (const index of call.removed) player.counts[index] -= 1;
  player.melds.push(call.meld);
  table.discards[tileIndex(call.meld.tiles.find((tile) => !call.removed.includes(tileIndex(tile))) ?? call.meld.tiles[0]!)] -= 1;
}

function targetDifferenceReason(counts: Counts34): string {
  const simpleCount = counts.slice(0, 27).reduce((sum, count, index) => sum + (index % 9 >= 3 && index % 9 <= 5 ? count : 0), 0);
  if (simpleCount > 0) return "4〜6の牌や中張牌だけの面子候補は、純チャン・チャンタ完成形には使えません。";
  return "通常手で使えるブロックの一部が、純チャン・チャンタの1・9・字牌条件を満たしていません。";
}

function average(values: Array<number | undefined>): number | null {
  const present = values.filter((value): value is number => value != null);
  return present.length === 0 ? null : present.reduce((sum, value) => sum + value, 0) / present.length;
}

function meldKey(melds: ChantaMeld[]): string {
  return melds
    .map((meld) => `${meld.kind}:${meld.tiles.map(tileIndex).sort((left, right) => left - right).join(".")}`)
    .sort()
    .join(";");
}

function shuffle(values: number[], random: () => number): void {
  for (let index = values.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [values[index], values[swap]] = [values[swap]!, values[index]!];
  }
}

type StatefulRandom = (() => number) & { getState: () => number };

function mulberry32(seed: number, resumedState?: number): StatefulRandom {
  let value = (resumedState ?? seed) >>> 0;
  const random = (() => {
    value += 0x6d2b79f5;
    let output = value;
    output = Math.imul(output ^ (output >>> 15), output | 1);
    output ^= output + Math.imul(output ^ (output >>> 7), output | 61);
    return ((output ^ (output >>> 14)) >>> 0) / 4294967296;
  }) as StatefulRandom;
  random.getState = () => value >>> 0;
  return random;
}

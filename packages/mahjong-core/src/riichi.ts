import { chiitoitsuShanten, isChiitoitsuComplete } from "./chiitoitsu";
import { normalShantenWithOpenMelds } from "./shanten";
import { LruCache, incrementSimulationCounter } from "./performance";
import {
  type Counts34,
  type Tile,
  emptyCounts,
  sumCounts,
  tileIndex,
  tileName,
  validateCounts,
} from "./tiles";

export const RIICHI_AI_VERSION = "riichi-ai-1.0.0";

export interface RiichiRuleConfig {
  startingPoints: number;
  riichiCost: number;
  minimumWallTiles: number;
  allowFuritenRiichi: boolean;
}

export const DEFAULT_RIICHI_RULE_CONFIG: RiichiRuleConfig = {
  startingPoints: 25_000,
  riichiCost: 1_000,
  minimumWallTiles: 4,
  allowFuritenRiichi: false,
};

export interface RiichiMeld {
  kind: "chi" | "pon";
  tiles: Tile[];
}

export interface RiichiEffectiveTile {
  tile: Tile;
  remaining: number;
  resultingShanten: number;
  discards: Tile[];
  reachesTenpai: boolean;
  reachesLegalRiichi: boolean;
  waitKindCount: number;
  waitLiveCount: number;
  furiten: boolean;
  createsGoodWait: boolean;
}

export interface RiichiProgressEvaluation {
  shanten: number;
  standardShanten: number;
  chiitoitsuShanten: number;
  isPossible: boolean;
  isIishanten: boolean;
  isTenpai: boolean;
  isFuriten: boolean;
  canDeclareRiichi: boolean;
  winningTiles: Tile[];
  effectiveTiles: RiichiEffectiveTile[];
  waitKindCount: number;
  waitLiveCount: number;
  waitQualityScore: number;
  completedMeldCount: number;
  taatsuCount: number;
  ryanmenTaatsuCount: number;
  pairKindCount: number;
  isolatedTileKindCount: number;
}

export interface RiichiDiscardEvaluation {
  index: number;
  tile: Tile;
  targetPossible: boolean;
  targetShanten: number;
  targetUkeireKinds: number;
  targetUkeireCount: number;
  goodShapeUkeireCount: number;
  waitKindCount: number;
  waitLiveCount: number;
  waitQualityScore: number;
  furitenRisk: boolean;
  canDeclareRiichi: boolean;
  standardShanten: number;
  chiitoitsuShanten: number;
  completedMeldCount: number;
  taatsuCount: number;
  ryanmenTaatsuCount: number;
  pairKindCount: number;
  isolatedTileKindCount: number;
}

export interface RiichiLegalityInput {
  counts: Counts34;
  melds?: RiichiMeld[];
  availableCounts?: Counts34;
  ownDiscards?: Counts34;
  wallTilesRemaining: number;
  points: number;
  alreadyRiichi?: boolean;
  ruleConfig?: RiichiRuleConfig;
}

export interface RiichiLegalityResult {
  legal: boolean;
  closed: boolean;
  tenpai: boolean;
  liveWaitCount: number;
  furiten: boolean;
  reasons: string[];
}

const progressCache = new LruCache<string, RiichiProgressEvaluation>(20_000);

export function riichiShanten(counts: Counts34, melds: RiichiMeld[] = []): number {
  validateCounts(counts);
  if (melds.length > 0) return Number.POSITIVE_INFINITY;
  return Math.min(normalShantenWithOpenMelds(counts, 0), chiitoitsuShanten(counts));
}

export function isRiichiComplete(counts: Counts34, melds: RiichiMeld[] = []): boolean {
  validateCounts(counts);
  if (melds.length > 0 || sumCounts(counts) !== 14) return false;
  return normalShantenWithOpenMelds(counts, 0) === -1 || isChiitoitsuComplete(counts);
}

export function riichiWinningTiles(
  counts: Counts34,
  melds: RiichiMeld[] = [],
  availableCounts = defaultAvailableCounts(counts),
): Tile[] {
  incrementSimulationCounter("waitCalculationCount");
  validateCounts(counts);
  validateAvailableCounts(availableCounts);
  if (melds.length > 0 || sumCounts(counts) !== 13 || riichiShanten(counts, melds) !== 0) return [];
  const waits: Tile[] = [];
  for (let index = 0; index < 34; index += 1) {
    if (counts[index]! >= 4 || availableCounts[index]! <= 0) continue;
    const won = counts.slice();
    won[index] += 1;
    if (isRiichiComplete(won, melds)) waits.push(tileName(index));
  }
  return waits;
}

export function evaluateRiichiLegality(input: RiichiLegalityInput): RiichiLegalityResult {
  const melds = input.melds ?? [];
  const availableCounts = input.availableCounts ?? defaultAvailableCounts(input.counts);
  const ownDiscards = input.ownDiscards ?? emptyCounts();
  const rule = input.ruleConfig ?? DEFAULT_RIICHI_RULE_CONFIG;
  validateCounts(input.counts);
  validateAvailableCounts(availableCounts);
  validateCounts(ownDiscards);
  const waits = riichiWinningTiles(input.counts, melds, availableCounts);
  const liveWaitCount = waits.reduce((sum, tile) => sum + availableCounts[tileIndex(tile)]!, 0);
  const furiten = waits.some((tile) => ownDiscards[tileIndex(tile)]! > 0);
  const closed = melds.length === 0;
  const tenpai = riichiShanten(input.counts, melds) === 0 && liveWaitCount > 0;
  const reasons: string[] = [];
  if (!closed) reasons.push("副露しているため門前ではありません。");
  if (!tenpai) reasons.push(liveWaitCount <= 0 ? "生きた待ち牌がありません。" : "テンパイしていません。");
  if (input.points < rule.riichiCost) reasons.push("リーチ棒を出す持ち点がありません。");
  if (input.wallTilesRemaining < rule.minimumWallTiles) reasons.push("リーチ宣言に必要な牌山枚数がありません。");
  if (input.alreadyRiichi) reasons.push("すでにリーチしています。");
  if (furiten && !rule.allowFuritenRiichi) reasons.push("現在の方針ではフリテンリーチを行いません。");
  return {
    legal: closed
      && tenpai
      && input.points >= rule.riichiCost
      && input.wallTilesRemaining >= rule.minimumWallTiles
      && !input.alreadyRiichi
      && (!furiten || rule.allowFuritenRiichi),
    closed,
    tenpai,
    liveWaitCount,
    furiten,
    reasons,
  };
}

export function evaluateRiichiProgress(
  counts: Counts34,
  melds: RiichiMeld[] = [],
  availableCounts = defaultAvailableCounts(counts),
  ownDiscards = emptyCounts(),
  wallTilesRemaining = 70,
  points = DEFAULT_RIICHI_RULE_CONFIG.startingPoints,
  alreadyRiichi = false,
  ruleConfig = DEFAULT_RIICHI_RULE_CONFIG,
): RiichiProgressEvaluation {
  validateCounts(counts);
  validateAvailableCounts(availableCounts);
  validateCounts(ownDiscards);
  const key = `${counts.join(",")}|${meldKey(melds)}|${availableCounts.join(",")}|${ownDiscards.join(",")}|${wallTilesRemaining}|${points}|${alreadyRiichi ? 1 : 0}`;
  const cached = progressCache.get(key);
  if (cached) return cached;
  incrementSimulationCounter("targetShantenCalculationCount");
  const standardShanten = melds.length === 0
    ? normalShantenWithOpenMelds(counts, 0)
    : Number.POSITIVE_INFINITY;
  const chiitoi = melds.length === 0 ? chiitoitsuShanten(counts) : Number.POSITIVE_INFINITY;
  const shanten = Math.min(standardShanten, chiitoi);
  const possible = melds.length === 0;
  const winningTiles = possible && shanten === 0
    ? riichiWinningTiles(counts, melds, availableCounts)
    : [];
  const waitLiveCount = winningTiles.reduce((sum, tile) => sum + availableCounts[tileIndex(tile)]!, 0);
  const isFuriten = winningTiles.some((tile) => ownDiscards[tileIndex(tile)]! > 0);
  const legality = evaluateRiichiLegality({
    counts,
    melds,
    availableCounts,
    ownDiscards,
    wallTilesRemaining,
    points,
    alreadyRiichi,
    ruleConfig,
  });
  const isTenpai = shanten === 0 && waitLiveCount > 0
    && (alreadyRiichi || legality.legal);
  const effectiveTiles = possible && shanten > 0
    ? riichiEffectiveTiles(
      counts,
      availableCounts,
      ownDiscards,
      wallTilesRemaining,
      points,
      ruleConfig,
    )
    : [];
  const traits = shapeTraits(counts);
  const evaluation: RiichiProgressEvaluation = {
    shanten,
    standardShanten,
    chiitoitsuShanten: chiitoi,
    isPossible: possible,
    isIishanten: isTenpai || (shanten === 1 && effectiveTiles.some((tile) => tile.reachesLegalRiichi)),
    isTenpai,
    isFuriten,
    canDeclareRiichi: legality.legal,
    winningTiles,
    effectiveTiles,
    waitKindCount: winningTiles.length,
    waitLiveCount,
    waitQualityScore: waitQuality(counts, winningTiles),
    ...traits,
  };
  progressCache.set(key, evaluation);
  return evaluation;
}

export function riichiEffectiveTiles(
  counts: Counts34,
  availableCounts = defaultAvailableCounts(counts),
  ownDiscards = emptyCounts(),
  wallTilesRemaining = 70,
  points = DEFAULT_RIICHI_RULE_CONFIG.startingPoints,
  ruleConfig = DEFAULT_RIICHI_RULE_CONFIG,
): RiichiEffectiveTile[] {
  validateCounts(counts);
  validateAvailableCounts(availableCounts);
  validateCounts(ownDiscards);
  const currentShanten = riichiShanten(counts);
  if (!Number.isFinite(currentShanten)) return [];
  const result: RiichiEffectiveTile[] = [];
  for (let drawIndex = 0; drawIndex < 34; drawIndex += 1) {
    if (counts[drawIndex]! >= 4 || availableCounts[drawIndex]! <= 0) continue;
    const drawn = counts.slice();
    drawn[drawIndex] += 1;
    let bestShanten = Number.POSITIVE_INFINITY;
    const bestStates: Array<{ discardIndex: number; after: Counts34 }> = [];
    for (let discardIndex = 0; discardIndex < 34; discardIndex += 1) {
      if (drawn[discardIndex]! <= 0) continue;
      const after = drawn.slice();
      after[discardIndex] -= 1;
      const shanten = riichiShanten(after);
      if (shanten < bestShanten) {
        bestShanten = shanten;
        bestStates.splice(0, bestStates.length, { discardIndex, after });
      } else if (shanten === bestShanten) {
        bestStates.push({ discardIndex, after });
      }
    }
    if (bestShanten >= currentShanten) continue;
    const nextAvailable = availableCounts.slice();
    nextAvailable[drawIndex] = Math.max(0, nextAvailable[drawIndex]! - 1);
    let reachesTenpai = false;
    let reachesLegalRiichi = false;
    let bestWaitKindCount = 0;
    let bestWaitLiveCount = 0;
    let furiten = true;
    let bestQuality = 0;
    for (const state of bestStates) {
      if (bestShanten !== 0) continue;
      const futureDiscards = ownDiscards.slice();
      futureDiscards[state.discardIndex] += 1;
      const waits = riichiWinningTiles(state.after, [], nextAvailable);
      const live = waits.reduce((sum, tile) => sum + nextAvailable[tileIndex(tile)]!, 0);
      const stateFuriten = waits.some((tile) => futureDiscards[tileIndex(tile)]! > 0);
      const legal = evaluateRiichiLegality({
        counts: state.after,
        availableCounts: nextAvailable,
        ownDiscards: futureDiscards,
        wallTilesRemaining: Math.max(0, wallTilesRemaining - 1),
        points,
        ruleConfig,
      }).legal;
      reachesTenpai ||= waits.length > 0 && live > 0;
      reachesLegalRiichi ||= legal;
      if (live > bestWaitLiveCount || (live === bestWaitLiveCount && waits.length > bestWaitKindCount)) {
        bestWaitLiveCount = live;
        bestWaitKindCount = waits.length;
        furiten = stateFuriten;
        bestQuality = waitQuality(state.after, waits);
      }
    }
    result.push({
      tile: tileName(drawIndex),
      remaining: availableCounts[drawIndex]!,
      resultingShanten: bestShanten,
      discards: bestStates.map((state) => tileName(state.discardIndex)),
      reachesTenpai,
      reachesLegalRiichi,
      waitKindCount: bestWaitKindCount,
      waitLiveCount: bestWaitLiveCount,
      furiten,
      createsGoodWait: bestQuality >= 4 || bestWaitKindCount >= 2,
    });
  }
  return result;
}

export function analyzeRiichiDiscards(
  counts: Counts34,
  availableCounts = defaultAvailableCounts(counts),
  ownDiscards = emptyCounts(),
  wallTilesRemaining = 70,
  points = DEFAULT_RIICHI_RULE_CONFIG.startingPoints,
  ruleConfig = DEFAULT_RIICHI_RULE_CONFIG,
): RiichiDiscardEvaluation[] {
  incrementSimulationCounter("discardEvaluationCount");
  validateCounts(counts);
  validateAvailableCounts(availableCounts);
  validateCounts(ownDiscards);
  const evaluations: RiichiDiscardEvaluation[] = [];
  for (let index = 0; index < 34; index += 1) {
    if (counts[index]! <= 0) continue;
    const after = counts.slice();
    after[index] -= 1;
    const futureDiscards = ownDiscards.slice();
    futureDiscards[index] += 1;
    const progress = evaluateRiichiProgress(
      after,
      [],
      availableCounts,
      futureDiscards,
      wallTilesRemaining,
      points,
      false,
      ruleConfig,
    );
    const effective = progress.effectiveTiles;
    const targetUkeireKinds = progress.isTenpai ? progress.waitKindCount : effective.length;
    const targetUkeireCount = progress.isTenpai
      ? progress.waitLiveCount
      : effective.reduce((sum, tile) => sum + tile.remaining, 0);
    evaluations.push({
      index,
      tile: tileName(index),
      targetPossible: progress.isPossible,
      targetShanten: progress.shanten,
      targetUkeireKinds,
      targetUkeireCount,
      goodShapeUkeireCount: progress.isTenpai
        ? (progress.waitQualityScore >= 4 || progress.waitKindCount >= 2 ? progress.waitLiveCount : 0)
        : effective.filter((tile) => tile.createsGoodWait).reduce((sum, tile) => sum + tile.remaining, 0),
      waitKindCount: progress.waitKindCount,
      waitLiveCount: progress.waitLiveCount,
      waitQualityScore: progress.waitQualityScore,
      furitenRisk: progress.isFuriten,
      canDeclareRiichi: progress.canDeclareRiichi,
      standardShanten: progress.standardShanten,
      chiitoitsuShanten: progress.chiitoitsuShanten,
      completedMeldCount: progress.completedMeldCount,
      taatsuCount: progress.taatsuCount,
      ryanmenTaatsuCount: progress.ryanmenTaatsuCount,
      pairKindCount: progress.pairKindCount,
      isolatedTileKindCount: progress.isolatedTileKindCount,
    });
  }
  return evaluations.sort(compareRiichiDiscards);
}

export function selectBestRiichiDiscard(
  counts: Counts34,
  availableCounts = defaultAvailableCounts(counts),
  ownDiscards = emptyCounts(),
  wallTilesRemaining = 70,
  points = DEFAULT_RIICHI_RULE_CONFIG.startingPoints,
  ruleConfig = DEFAULT_RIICHI_RULE_CONFIG,
): RiichiDiscardEvaluation {
  const best = analyzeRiichiDiscards(
    counts,
    availableCounts,
    ownDiscards,
    wallTilesRemaining,
    points,
    ruleConfig,
  )[0];
  if (!best) throw new Error("A discard cannot be selected from an empty hand.");
  return best;
}

export function shouldDeclareRiichi(input: RiichiLegalityInput): boolean {
  return evaluateRiichiLegality(input).legal;
}

export function shouldRiichiChi(): boolean {
  return false;
}

export function shouldRiichiPon(): boolean {
  return false;
}

export function shouldRiichiKan(): boolean {
  return false;
}

function compareRiichiDiscards(left: RiichiDiscardEvaluation, right: RiichiDiscardEvaluation): number {
  if (left.targetPossible !== right.targetPossible) return left.targetPossible ? -1 : 1;
  if (left.targetShanten !== right.targetShanten) return left.targetShanten - right.targetShanten;
  if (left.targetShanten === 0 && left.canDeclareRiichi !== right.canDeclareRiichi) return left.canDeclareRiichi ? -1 : 1;
  if (left.furitenRisk !== right.furitenRisk) return left.furitenRisk ? 1 : -1;
  if (left.targetUkeireCount !== right.targetUkeireCount) return right.targetUkeireCount - left.targetUkeireCount;
  if (left.targetUkeireKinds !== right.targetUkeireKinds) return right.targetUkeireKinds - left.targetUkeireKinds;
  if (left.goodShapeUkeireCount !== right.goodShapeUkeireCount) return right.goodShapeUkeireCount - left.goodShapeUkeireCount;
  if (left.waitQualityScore !== right.waitQualityScore) return right.waitQualityScore - left.waitQualityScore;
  if (left.ryanmenTaatsuCount !== right.ryanmenTaatsuCount) return right.ryanmenTaatsuCount - left.ryanmenTaatsuCount;
  if (left.completedMeldCount !== right.completedMeldCount) return right.completedMeldCount - left.completedMeldCount;
  if (left.pairKindCount !== right.pairKindCount) return right.pairKindCount - left.pairKindCount;
  if (left.isolatedTileKindCount !== right.isolatedTileKindCount) return left.isolatedTileKindCount - right.isolatedTileKindCount;
  return left.index - right.index;
}

function waitQuality(counts: Counts34, waits: Tile[]): number {
  if (waits.length >= 3) return 6;
  if (waits.length >= 2) return 5;
  if (waits.length === 0) return 0;
  const index = tileIndex(waits[0]!);
  if (index >= 27) return 1;
  const rank = index % 9;
  const base = index - rank;
  const completesLowerRyanmen = rank <= 6
    && counts[base + rank + 1]! > 0
    && counts[base + rank + 2]! > 0
    && rank !== 2;
  const completesUpperRyanmen = rank >= 2
    && counts[base + rank - 1]! > 0
    && counts[base + rank - 2]! > 0
    && rank !== 6;
  if (completesLowerRyanmen || completesUpperRyanmen) return 4;
  if (rank >= 1 && rank <= 7 && counts[index - 1]! > 0 && counts[index + 1]! > 0) return 2;
  return 1;
}

function shapeTraits(counts: Counts34): Pick<RiichiProgressEvaluation,
  "completedMeldCount" | "taatsuCount" | "ryanmenTaatsuCount" | "pairKindCount" | "isolatedTileKindCount"> {
  let completedMeldCount = 0;
  let taatsuCount = 0;
  let ryanmenTaatsuCount = 0;
  let pairKindCount = 0;
  let isolatedTileKindCount = 0;
  for (let index = 0; index < 34; index += 1) {
    const count = counts[index]!;
    if (count >= 3) completedMeldCount += 1;
    if (count >= 2) {
      pairKindCount += 1;
      taatsuCount += 1;
    }
    if (count <= 0) continue;
    if (index < 27) {
      const rank = index % 9;
      const base = index - rank;
      const near = [rank - 2, rank - 1, rank + 1, rank + 2]
        .some((candidate) => candidate >= 0 && candidate <= 8 && counts[base + candidate]! > 0);
      if (!near && count === 1) isolatedTileKindCount += 1;
    } else if (count === 1) {
      isolatedTileKindCount += 1;
    }
  }
  for (let suit = 0; suit < 3; suit += 1) {
    const base = suit * 9;
    for (let start = 0; start <= 6; start += 1) {
      if (counts[base + start]! > 0 && counts[base + start + 1]! > 0 && counts[base + start + 2]! > 0) {
        completedMeldCount += 1;
      }
    }
    for (let start = 0; start <= 7; start += 1) {
      if (counts[base + start]! > 0 && counts[base + start + 1]! > 0) {
        taatsuCount += 1;
        if (start >= 1 && start <= 6) ryanmenTaatsuCount += 1;
      }
    }
    for (let start = 0; start <= 6; start += 1) {
      if (counts[base + start]! > 0 && counts[base + start + 2]! > 0) taatsuCount += 1;
    }
  }
  return { completedMeldCount, taatsuCount, ryanmenTaatsuCount, pairKindCount, isolatedTileKindCount };
}

function defaultAvailableCounts(counts: Counts34): Counts34 {
  return counts.map((count) => Math.max(0, 4 - count));
}

function validateAvailableCounts(counts: Counts34): void {
  if (counts.length !== 34 || counts.some((count) => !Number.isInteger(count) || count < 0 || count > 4)) {
    throw new Error("availableCounts must contain 34 values from 0 to 4.");
  }
}

function meldKey(melds: RiichiMeld[]): string {
  return melds.map((meld) => `${meld.kind}:${meld.tiles.join(".")}`).sort().join(";");
}

import { normalShanten } from "./shanten";
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

export const CHIITOITSU_AI_VERSION = "chiitoitsu-ai-1.0.0";

export interface ChiitoitsuMeld {
  kind: "chi" | "pon";
  tiles: Tile[];
}

export interface ChiitoitsuEffectiveTile {
  tile: Tile;
  remaining: number;
  resultingShanten: number;
  discards: Tile[];
}

export interface ChiitoitsuProgressEvaluation {
  shanten: number;
  isPossible: boolean;
  isIishanten: boolean;
  isTenpai: boolean;
  pairKindCount: number;
  uniqueKindCount: number;
  winningTiles: Tile[];
  effectiveTiles: ChiitoitsuEffectiveTile[];
  waitLiveCount: number;
}

export interface ChiitoitsuDiscardEvaluation {
  index: number;
  tile: Tile;
  targetPossible: boolean;
  targetShanten: number;
  pairKindCount: number;
  uniqueKindCount: number;
  targetUkeireKinds: number;
  targetUkeireCount: number;
  excessDuplicateCount: number;
  liveSingletonCount: number;
  furitenRisk: boolean;
  waitLiveCount: number;
  normalShanten: number;
  normalUkeireCount: number;
  discardability: number;
}

const progressCache = new LruCache<string, ChiitoitsuProgressEvaluation>(20_000);

export function chiitoitsuPairKindCount(counts: Counts34): number {
  validateCounts(counts);
  return counts.filter((count) => count >= 2).length;
}

export function chiitoitsuUniqueKindCount(counts: Counts34): number {
  validateCounts(counts);
  return counts.filter((count) => count > 0).length;
}

export function chiitoitsuShanten(counts: Counts34, melds: ChiitoitsuMeld[] = []): number {
  validateCounts(counts);
  if (melds.length > 0) return Number.POSITIVE_INFINITY;
  const pairs = chiitoitsuPairKindCount(counts);
  const unique = chiitoitsuUniqueKindCount(counts);
  return 6 - pairs + Math.max(0, 7 - unique);
}

export function isChiitoitsuComplete(counts: Counts34, melds: ChiitoitsuMeld[] = []): boolean {
  validateCounts(counts);
  return melds.length === 0
    && sumCounts(counts) === 14
    && counts.filter((count) => count === 2).length === 7
    && counts.every((count) => count === 0 || count === 2);
}

export function canCompleteChiitoitsu(
  counts: Counts34,
  availableCounts = defaultAvailableCounts(counts),
  melds: ChiitoitsuMeld[] = [],
): boolean {
  validateCounts(counts);
  validateAvailableCounts(availableCounts);
  if (melds.length > 0) return false;
  let possiblePairs = 0;
  for (let index = 0; index < 34; index += 1) {
    const count = counts[index]!;
    const available = availableCounts[index]!;
    if (count >= 2 || (count === 1 && available >= 1) || (count === 0 && available >= 2)) {
      possiblePairs += 1;
    }
  }
  return possiblePairs >= 7;
}

export function chiitoitsuWinningTiles(
  counts: Counts34,
  melds: ChiitoitsuMeld[] = [],
  availableCounts = defaultAvailableCounts(counts),
): Tile[] {
  incrementSimulationCounter("waitCalculationCount");
  validateCounts(counts);
  validateAvailableCounts(availableCounts);
  if (melds.length > 0 || sumCounts(counts) !== 13) return [];
  const winning: Tile[] = [];
  for (let index = 0; index < 34; index += 1) {
    if (counts[index]! >= 4 || availableCounts[index]! <= 0) continue;
    const next = counts.slice();
    next[index] += 1;
    if (isChiitoitsuComplete(next)) winning.push(tileName(index));
  }
  return winning;
}

export function chiitoitsuEffectiveTiles(
  counts: Counts34,
  melds: ChiitoitsuMeld[] = [],
  availableCounts = defaultAvailableCounts(counts),
): ChiitoitsuEffectiveTile[] {
  validateCounts(counts);
  validateAvailableCounts(availableCounts);
  if (melds.length > 0) return [];
  const currentShanten = chiitoitsuShanten(counts);
  const effective: ChiitoitsuEffectiveTile[] = [];

  for (let drawIndex = 0; drawIndex < 34; drawIndex += 1) {
    if (counts[drawIndex]! >= 4 || availableCounts[drawIndex]! <= 0) continue;
    const drawn = counts.slice();
    drawn[drawIndex] += 1;
    if (isChiitoitsuComplete(drawn)) {
      effective.push({
        tile: tileName(drawIndex),
        remaining: availableCounts[drawIndex]!,
        resultingShanten: -1,
        discards: [],
      });
      continue;
    }

    let best = Number.POSITIVE_INFINITY;
    const discards: Tile[] = [];
    for (let discardIndex = 0; discardIndex < 34; discardIndex += 1) {
      if (drawn[discardIndex]! <= 0) continue;
      const after = drawn.slice();
      after[discardIndex] -= 1;
      const nextShanten = chiitoitsuShanten(after);
      if (nextShanten < best) {
        best = nextShanten;
        discards.splice(0, discards.length, tileName(discardIndex));
      } else if (nextShanten === best) {
        discards.push(tileName(discardIndex));
      }
    }
    if (best >= currentShanten) continue;

    const remaining = availableCounts.slice();
    remaining[drawIndex] -= 1;
    const reachesLiveTenpai = best === 0 && discards.some((discard) => {
      const after = drawn.slice();
      after[tileIndex(discard)] -= 1;
      return chiitoitsuWinningTiles(after, [], remaining).length > 0;
    });
    effective.push({
      tile: tileName(drawIndex),
      remaining: availableCounts[drawIndex]!,
      resultingShanten: reachesLiveTenpai ? 0 : Math.max(1, best),
      discards,
    });
  }
  return effective;
}

export function evaluateChiitoitsuProgress(
  counts: Counts34,
  melds: ChiitoitsuMeld[] = [],
  availableCounts = defaultAvailableCounts(counts),
): ChiitoitsuProgressEvaluation {
  validateCounts(counts);
  validateAvailableCounts(availableCounts);
  const key = `${melds.length}|${counts.join(",")}|${availableCounts.join(",")}`;
  const cached = progressCache.get(key);
  if (cached) return cached;
  incrementSimulationCounter("targetShantenCalculationCount");

  const rawShanten = chiitoitsuShanten(counts, melds);
  const isPossible = Number.isFinite(rawShanten) && canCompleteChiitoitsu(counts, availableCounts, melds);
  const winningTiles = rawShanten === 0 && isPossible
    ? chiitoitsuWinningTiles(counts, melds, availableCounts)
    : [];
  const isTenpai = winningTiles.length > 0;
  const effectiveTiles = rawShanten > 0 && rawShanten <= 3 && isPossible
    ? chiitoitsuEffectiveTiles(counts, melds, availableCounts)
    : [];
  const canReachLiveTenpai = rawShanten === 1
    && effectiveTiles.some((tile) => tile.resultingShanten === 0);
  const evaluation: ChiitoitsuProgressEvaluation = {
    shanten: isTenpai ? 0 : canReachLiveTenpai ? 1 : rawShanten,
    isPossible,
    isIishanten: isTenpai || canReachLiveTenpai,
    isTenpai,
    pairKindCount: chiitoitsuPairKindCount(counts),
    uniqueKindCount: chiitoitsuUniqueKindCount(counts),
    winningTiles,
    effectiveTiles,
    waitLiveCount: winningTiles.reduce((sum, tile) => sum + availableCounts[tileIndex(tile)]!, 0),
  };
  progressCache.set(key, evaluation);
  return evaluation;
}

export function analyzeChiitoitsuDiscards(
  counts: Counts34,
  availableCounts = defaultAvailableCounts(counts),
  ownDiscards = emptyCounts(),
): ChiitoitsuDiscardEvaluation[] {
  incrementSimulationCounter("discardEvaluationCount");
  validateCounts(counts);
  validateAvailableCounts(availableCounts);
  validateAvailableCounts(ownDiscards);
  const evaluations: ChiitoitsuDiscardEvaluation[] = [];

  for (let index = 0; index < 34; index += 1) {
    if (counts[index]! <= 0) continue;
    const after = counts.slice();
    after[index] -= 1;
    const progress = evaluateChiitoitsuProgress(after, [], availableCounts);
    const effective = progress.effectiveTiles;
    evaluations.push({
      index,
      tile: tileName(index),
      targetPossible: progress.isPossible,
      targetShanten: progress.shanten,
      pairKindCount: progress.pairKindCount,
      uniqueKindCount: progress.uniqueKindCount,
      targetUkeireKinds: progress.isTenpai ? progress.winningTiles.length : effective.length,
      targetUkeireCount: progress.isTenpai
        ? progress.waitLiveCount
        : effective.reduce((sum, tile) => sum + tile.remaining, 0),
      excessDuplicateCount: after.reduce((sum, count) => sum + Math.max(0, count - 2), 0),
      liveSingletonCount: after.reduce(
        (sum, count, tileIndexValue) => sum + (count === 1 ? availableCounts[tileIndexValue]! : 0),
        0,
      ),
      furitenRisk: progress.winningTiles.some((tile) => ownDiscards[tileIndex(tile)]! > 0),
      waitLiveCount: progress.waitLiveCount,
      normalShanten: Number.POSITIVE_INFINITY,
      normalUkeireCount: 0,
      discardability: discardabilityScore(index),
    });
  }
  const targetBest = evaluations.slice().sort(compareChiitoitsuTarget)[0];
  if (targetBest) {
    for (const evaluation of evaluations) {
      if (compareChiitoitsuTarget(evaluation, targetBest) !== 0) continue;
      const after = counts.slice();
      after[evaluation.index] -= 1;
      evaluation.normalShanten = normalShanten(after);
      evaluation.normalUkeireCount = normalUkeireCount(after, availableCounts, evaluation.normalShanten);
    }
  }
  return evaluations.sort(compareChiitoitsuDiscard);
}

export function selectBestChiitoitsuDiscard(
  counts: Counts34,
  availableCounts = defaultAvailableCounts(counts),
  ownDiscards = emptyCounts(),
): ChiitoitsuDiscardEvaluation | null {
  return analyzeChiitoitsuDiscards(counts, availableCounts, ownDiscards)[0] ?? null;
}

export function shouldChiitoitsuCall(): false {
  return false;
}

export function shouldChiitoitsuRiichi(): false {
  return false;
}

function compareChiitoitsuDiscard(left: ChiitoitsuDiscardEvaluation, right: ChiitoitsuDiscardEvaluation): number {
  const targetComparison = compareChiitoitsuTarget(left, right);
  if (targetComparison !== 0) return targetComparison;
  if (left.normalShanten !== right.normalShanten) return left.normalShanten - right.normalShanten;
  if (left.normalUkeireCount !== right.normalUkeireCount) return right.normalUkeireCount - left.normalUkeireCount;
  // Keep tiles that opponents are more likely to discard; this is only a final tie breaker.
  if (left.discardability !== right.discardability) return left.discardability - right.discardability;
  return left.index - right.index;
}

function compareChiitoitsuTarget(left: ChiitoitsuDiscardEvaluation, right: ChiitoitsuDiscardEvaluation): number {
  if (left.targetPossible !== right.targetPossible) return left.targetPossible ? -1 : 1;
  if (left.targetShanten !== right.targetShanten) return left.targetShanten - right.targetShanten;
  if (left.pairKindCount !== right.pairKindCount) return right.pairKindCount - left.pairKindCount;
  if (left.targetUkeireCount !== right.targetUkeireCount) return right.targetUkeireCount - left.targetUkeireCount;
  if (left.targetUkeireKinds !== right.targetUkeireKinds) return right.targetUkeireKinds - left.targetUkeireKinds;
  if (left.excessDuplicateCount !== right.excessDuplicateCount) {
    return left.excessDuplicateCount - right.excessDuplicateCount;
  }
  if (left.liveSingletonCount !== right.liveSingletonCount) {
    return right.liveSingletonCount - left.liveSingletonCount;
  }
  if (left.furitenRisk !== right.furitenRisk) return left.furitenRisk ? 1 : -1;
  if (left.waitLiveCount !== right.waitLiveCount) return right.waitLiveCount - left.waitLiveCount;
  if (left.uniqueKindCount !== right.uniqueKindCount) return right.uniqueKindCount - left.uniqueKindCount;
  return 0;
}

function normalUkeireCount(counts: Counts34, availableCounts: Counts34, shanten: number): number {
  let total = 0;
  for (let index = 0; index < 34; index += 1) {
    if (counts[index]! >= 4 || availableCounts[index]! <= 0) continue;
    const next = counts.slice();
    next[index] += 1;
    if (normalShanten(next) < shanten) total += availableCounts[index]!;
  }
  return total;
}

function discardabilityScore(index: number): number {
  if (index >= 27) return 4;
  const rank = index % 9;
  if (rank === 0 || rank === 8) return 3;
  if (rank === 1 || rank === 7) return 2;
  if (rank === 2 || rank === 6) return 1;
  return 0;
}

function defaultAvailableCounts(counts: Counts34): Counts34 {
  return counts.map((count) => 4 - count);
}

function validateAvailableCounts(counts: Counts34): void {
  if (counts.length !== 34 || counts.some((count) => !Number.isInteger(count) || count < 0 || count > 4)) {
    throw new Error("Available counts must contain 34 integers from 0 to 4.");
  }
}

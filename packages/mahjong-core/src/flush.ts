import { normalShantenWithOpenMelds } from "./shanten";
import { LruCache, incrementSimulationCounter } from "./performance";
import {
  type Counts34,
  type Tile,
  sumCounts,
  tileIndex,
  tileName,
  validateCounts,
} from "./tiles";

export const FLUSH_AI_VERSION = "flush-ai-1.0.0";

export type FlushSuit = "MAN" | "PIN" | "SOU";
export type FlushTargetType = "HONITSU" | "CHINITSU";
export type FlushWinType = FlushTargetType | "NONE";

export interface FlushMeld {
  kind: "chi" | "pon";
  tiles: Tile[];
}

export interface FlushCandidateEvaluation {
  suit: FlushSuit;
  targetType: FlushTargetType;
  possible: boolean;
  shanten: number;
  ukeireCount: number;
  effectiveTiles: Tile[];
  suitedBlockCount: number;
  honorBlockCount: number;
  offSuitTileCount: number;
  callabilityScore: number;
  sevenPairsShanten: number;
}

export interface FlushEffectiveTile {
  tile: Tile;
  remaining: number;
  resultingShanten: number;
  bestSuit: FlushSuit;
  bestTargetType: FlushTargetType;
  discards: Tile[];
}

export interface FlushProgressEvaluation {
  shanten: number;
  isPossible: boolean;
  isIishanten: boolean;
  isTenpai: boolean;
  winningTiles: Tile[];
  effectiveTiles: FlushEffectiveTile[];
  candidates: FlushCandidateEvaluation[];
  bestCandidate: FlushCandidateEvaluation | null;
  fixedSuit: FlushSuit | null;
  chinitsuPossible: boolean;
}

export interface FlushDiscardEvaluation {
  index: number;
  tile: Tile;
  targetPossible: boolean;
  targetShanten: number;
  targetUkeireCount: number;
  bestSuit: FlushSuit;
  bestTargetType: FlushTargetType;
  suitedBlockCount: number;
  honorBlockCount: number;
  offSuitTileCount: number;
  callabilityScore: number;
  normalShanten: number;
  normalUkeireCount: number;
}

export interface FlushWinClassification {
  type: FlushWinType;
  suit: FlushSuit | null;
}

const SUITS: FlushSuit[] = ["MAN", "PIN", "SOU"];
const progressCache = new LruCache<string, FlushProgressEvaluation>(20_000);
const targetShantenCache = new LruCache<string, number>(20_000);
const winCache = new LruCache<string, FlushWinClassification>(10_000);

export function classifyFlushWin(counts: Counts34, melds: FlushMeld[] = []): FlushWinClassification {
  validateCounts(counts);
  const key = `${meldKey(melds)}|${counts.join(",")}`;
  const cached = winCache.get(key);
  if (cached) return cached;

  const expected = 14 - melds.length * 3;
  if (sumCounts(counts) !== expected || melds.length > 4 || !meldsAreValid(melds)) {
    return cacheWin(key, { type: "NONE", suit: null });
  }
  const allIndexes = physicalTileIndexes(counts, melds);
  const physicalCounts = Array(34).fill(0) as Counts34;
  for (const index of allIndexes) {
    physicalCounts[index] += 1;
    if (physicalCounts[index]! > 4) return cacheWin(key, { type: "NONE", suit: null });
  }
  const numberSuits = new Set(allIndexes.filter((index) => index < 27).map(indexSuit));
  const hasHonors = allIndexes.some((index) => index >= 27);
  if (numberSuits.size !== 1) return cacheWin(key, { type: "NONE", suit: null });

  const standardComplete = normalShantenWithOpenMelds(counts, melds.length) === -1;
  const sevenPairsComplete = melds.length === 0 && isSevenPairsComplete(counts);
  if (!standardComplete && !sevenPairsComplete) return cacheWin(key, { type: "NONE", suit: null });

  const suit = [...numberSuits][0]!;
  return cacheWin(key, { type: hasHonors ? "HONITSU" : "CHINITSU", suit });
}

export function lockedFlushSuit(melds: FlushMeld[]): FlushSuit | null | "CONFLICT" {
  const suits = new Set<FlushSuit>();
  for (const meld of melds) {
    for (const tile of meld.tiles) {
      const index = tileIndex(tile);
      if (index < 27) suits.add(indexSuit(index));
    }
  }
  if (suits.size > 1) return "CONFLICT";
  return suits.size === 1 ? [...suits][0]! : null;
}

export function hasHonorMeld(melds: FlushMeld[]): boolean {
  return melds.some((meld) => meld.tiles.some((tile) => tileIndex(tile) >= 27));
}

export function flushTargetShanten(
  counts: Counts34,
  melds: FlushMeld[],
  suit: FlushSuit,
  targetType: FlushTargetType,
): number {
  validateCounts(counts);
  const key = `${suit}|${targetType}|${meldKey(melds)}|${counts.join(",")}`;
  const cached = targetShantenCache.get(key);
  if (cached != null) return cached;
  if (!candidateAllowed(melds, suit, targetType)) return cacheTargetShanten(key, Number.POSITIVE_INFINITY);

  const restricted = counts.map((count, index) => isAllowedIndex(index, suit, targetType) ? count : 0);
  let standard = normalShantenWithOpenMelds(restricted, melds.length);
  if (targetType === "HONITSU") {
    const indexes = physicalTileIndexes(restricted, melds);
    const hasSuit = indexes.some((index) => index < 27 && indexSuit(index) === suit);
    const hasHonor = indexes.some((index) => index >= 27);
    if (!hasSuit) standard += 2;
    if (!hasHonor) standard += 2;
  }
  const sevenPairs = melds.length === 0 ? flushSevenPairsShanten(counts, suit, targetType) : Number.POSITIVE_INFINITY;
  return cacheTargetShanten(key, Math.min(standard, sevenPairs));
}

export function evaluateFlushCandidates(
  counts: Counts34,
  melds: FlushMeld[] = [],
  availableCounts = defaultAvailableCounts(counts, melds),
): FlushCandidateEvaluation[] {
  return evaluateFlushCandidatesInternal(counts, melds, availableCounts, true);
}

export function flushShanten(counts: Counts34, melds: FlushMeld[] = []): number {
  return evaluateFlushCandidatesInternal(counts, melds, defaultAvailableCounts(counts, melds), false)
    .find((candidate) => candidate.possible)?.shanten ?? Number.POSITIVE_INFINITY;
}

function evaluateFlushCandidatesInternal(
  counts: Counts34,
  melds: FlushMeld[],
  availableCounts: Counts34,
  includeUkeire: boolean,
): FlushCandidateEvaluation[] {
  validateAvailableCounts(availableCounts);
  const candidates: FlushCandidateEvaluation[] = [];
  for (const suit of SUITS) {
    for (const targetType of ["HONITSU", "CHINITSU"] as const) {
      const possible = candidateAllowed(melds, suit, targetType);
      const shanten = possible ? flushTargetShanten(counts, melds, suit, targetType) : Number.POSITIVE_INFINITY;
      const effectiveIndexes = includeUkeire && possible && Number.isFinite(shanten)
        ? targetEffectiveIndexes(counts, melds, availableCounts, suit, targetType, shanten)
        : [];
      candidates.push({
        suit,
        targetType,
        possible: possible && Number.isFinite(shanten),
        shanten,
        ukeireCount: effectiveIndexes.reduce((sum, index) => sum + availableCounts[index]!, 0),
        effectiveTiles: effectiveIndexes.map(tileName),
        suitedBlockCount: suitedBlockScore(counts, suit),
        honorBlockCount: targetType === "HONITSU" ? honorBlockScore(counts) : 0,
        offSuitTileCount: offSuitTileCount(counts, suit, targetType),
        callabilityScore: callabilityScore(counts, suit, targetType, availableCounts),
        sevenPairsShanten: melds.length === 0 ? flushSevenPairsShanten(counts, suit, targetType) : Number.POSITIVE_INFINITY,
      });
    }
  }
  return candidates.sort(compareFlushCandidate);
}

export function evaluateFlushProgress(
  counts: Counts34,
  melds: FlushMeld[] = [],
  availableCounts = defaultAvailableCounts(counts, melds),
): FlushProgressEvaluation {
  validateCounts(counts);
  validateAvailableCounts(availableCounts);
  const key = `${meldKey(melds)}|${counts.join(",")}|${availableCounts.join(",")}`;
  const cached = progressCache.get(key);
  if (cached) return cached;
  incrementSimulationCounter("targetShantenCalculationCount");

  const candidates = evaluateFlushCandidates(counts, melds, availableCounts);
  const bestCandidate = candidates.find((candidate) => candidate.possible) ?? null;
  const winningTiles = flushWinningTiles(counts, melds, availableCounts);
  const isTenpai = winningTiles.length > 0;
  const estimatedShanten = bestCandidate?.shanten ?? Number.POSITIVE_INFINITY;
  const searchShanten = !isTenpai && estimatedShanten <= 0 ? 1 : estimatedShanten;
  let effectiveTiles = searchShanten > 0 && searchShanten <= 3
    ? flushEffectiveTiles(counts, melds, availableCounts, searchShanten)
    : [];
  const canReachLiveTenpai = !isTenpai && searchShanten <= 1
    && effectiveTiles.some((detail) => detail.resultingShanten === 0);
  const shanten = isTenpai ? 0 : canReachLiveTenpai ? 1 : Math.max(2, estimatedShanten);
  if (shanten !== searchShanten && shanten <= 3) {
    effectiveTiles = flushEffectiveTiles(counts, melds, availableCounts, shanten);
  }
  const locked = lockedFlushSuit(melds);
  const evaluation: FlushProgressEvaluation = {
    shanten,
    isPossible: bestCandidate != null,
    isIishanten: isTenpai || canReachLiveTenpai,
    isTenpai,
    winningTiles,
    effectiveTiles,
    candidates,
    bestCandidate,
    fixedSuit: locked === "CONFLICT" ? null : locked,
    chinitsuPossible: candidates.some((candidate) => candidate.targetType === "CHINITSU" && candidate.possible),
  };
  progressCache.set(key, evaluation);
  return evaluation;
}

export function flushWinningTiles(
  counts: Counts34,
  melds: FlushMeld[] = [],
  availableCounts = defaultAvailableCounts(counts, melds),
): Tile[] {
  incrementSimulationCounter("waitCalculationCount");
  const winning: Tile[] = [];
  for (let index = 0; index < 34; index += 1) {
    if (counts[index]! >= 4 || availableCounts[index]! <= 0) continue;
    const next = counts.slice();
    next[index] += 1;
    if (classifyFlushWin(next, melds).type !== "NONE") winning.push(tileName(index));
  }
  return winning;
}

export function flushEffectiveTiles(
  counts: Counts34,
  melds: FlushMeld[] = [],
  availableCounts = defaultAvailableCounts(counts, melds),
  currentShanten = evaluateFlushCandidates(counts, melds, availableCounts)[0]?.shanten ?? Number.POSITIVE_INFINITY,
): FlushEffectiveTile[] {
  const effective: FlushEffectiveTile[] = [];
  for (let drawIndex = 0; drawIndex < 34; drawIndex += 1) {
    if (counts[drawIndex]! >= 4 || availableCounts[drawIndex]! <= 0) continue;
    const drawn = counts.slice();
    drawn[drawIndex] += 1;
    if (classifyFlushWin(drawn, melds).type !== "NONE") {
      const win = classifyFlushWin(drawn, melds);
      effective.push({
        tile: tileName(drawIndex),
        remaining: availableCounts[drawIndex]!,
        resultingShanten: -1,
        bestSuit: win.suit!,
        bestTargetType: win.type as FlushTargetType,
        discards: [],
      });
      continue;
    }
    let best: FlushCandidateEvaluation | null = null;
    const discards: Tile[] = [];
    for (let discardIndex = 0; discardIndex < 34; discardIndex += 1) {
      if (drawn[discardIndex]! <= 0) continue;
      const after = drawn.slice();
      after[discardIndex] -= 1;
      const candidate = evaluateFlushCandidatesInternal(after, melds, availableCounts, false)[0];
      if (!candidate?.possible) continue;
      if (!best || compareFlushCandidate(candidate, best) < 0) {
        best = candidate;
        discards.splice(0, discards.length, tileName(discardIndex));
      } else if (candidate.shanten === best.shanten && candidate.ukeireCount === best.ukeireCount) {
        discards.push(tileName(discardIndex));
      }
    }
    if (best && best.shanten < currentShanten) {
      const remaining = availableCounts.slice();
      remaining[drawIndex] -= 1;
      const reachesTenpai = best.shanten === 0 && discards.some((discard) => {
        const after = drawn.slice();
        after[tileIndex(discard)] -= 1;
        return flushWinningTiles(after, melds, remaining).length > 0;
      });
      effective.push({
        tile: tileName(drawIndex),
        remaining: availableCounts[drawIndex]!,
        resultingShanten: reachesTenpai ? 0 : Math.max(1, best.shanten),
        bestSuit: best.suit,
        bestTargetType: best.targetType,
        discards,
      });
    }
  }
  return effective;
}

export function analyzeFlushDiscards(
  counts: Counts34,
  melds: FlushMeld[] = [],
  availableCounts = defaultAvailableCounts(counts, melds),
): FlushDiscardEvaluation[] {
  incrementSimulationCounter("discardEvaluationCount");
  const preliminary: Array<{ index: number; after: Counts34; best: FlushCandidateEvaluation | undefined }> = [];
  for (let index = 0; index < 34; index += 1) {
    if (counts[index]! <= 0) continue;
    const after = counts.slice();
    after[index] -= 1;
    const best = evaluateFlushCandidatesInternal(after, melds, availableCounts, false).find((candidate) => candidate.possible);
    preliminary.push({ index, after, best });
  }
  const bestShanten = Math.min(...preliminary.map(({ best }) => best?.shanten ?? Number.POSITIVE_INFINITY));
  const evaluations: FlushDiscardEvaluation[] = [];
  for (const { index, after, best: preliminaryBest } of preliminary) {
    const best = preliminaryBest?.shanten === bestShanten
      ? evaluateFlushCandidates(after, melds, availableCounts).find((candidate) => candidate.possible)
      : preliminaryBest;
    const normalShanten = normalShantenWithOpenMelds(after, melds.length);
    evaluations.push({
      index,
      tile: tileName(index),
      targetPossible: best != null,
      targetShanten: best?.shanten ?? Number.POSITIVE_INFINITY,
      targetUkeireCount: best?.ukeireCount ?? 0,
      bestSuit: best?.suit ?? "MAN",
      bestTargetType: best?.targetType ?? "HONITSU",
      suitedBlockCount: best?.suitedBlockCount ?? 0,
      honorBlockCount: best?.honorBlockCount ?? 0,
      offSuitTileCount: best?.offSuitTileCount ?? 14,
      callabilityScore: best?.callabilityScore ?? 0,
      normalShanten,
      normalUkeireCount: normalUkeireCount(after, melds.length, availableCounts, normalShanten),
    });
  }
  return evaluations.sort(compareFlushDiscard);
}

export function selectBestFlushDiscard(
  counts: Counts34,
  melds: FlushMeld[] = [],
  availableCounts = defaultAvailableCounts(counts, melds),
): FlushDiscardEvaluation {
  const best = analyzeFlushDiscards(counts, melds, availableCounts)[0];
  if (!best) throw new Error("打牌候補がありません。");
  return best;
}

export function isFlushCompatibleMeld(meld: FlushMeld, existingMelds: FlushMeld[] = []): boolean {
  if (!meldsAreValid([meld])) return false;
  const locked = lockedFlushSuit(existingMelds);
  if (locked === "CONFLICT") return false;
  const number = meld.tiles.map(tileIndex).find((index) => index < 27);
  return number == null || locked == null || indexSuit(number) === locked;
}

function compareFlushCandidate(left: FlushCandidateEvaluation, right: FlushCandidateEvaluation): number {
  if (left.possible !== right.possible) return left.possible ? -1 : 1;
  if (left.shanten !== right.shanten) return left.shanten - right.shanten;
  if (left.ukeireCount !== right.ukeireCount) return right.ukeireCount - left.ukeireCount;
  const leftLikelihood = left.suitedBlockCount * 3 + left.honorBlockCount * 2 + left.callabilityScore;
  const rightLikelihood = right.suitedBlockCount * 3 + right.honorBlockCount * 2 + right.callabilityScore;
  if (leftLikelihood !== rightLikelihood) return rightLikelihood - leftLikelihood;
  if (left.offSuitTileCount !== right.offSuitTileCount) return left.offSuitTileCount - right.offSuitTileCount;
  if (left.suit !== right.suit) return SUITS.indexOf(left.suit) - SUITS.indexOf(right.suit);
  return left.targetType === right.targetType ? 0 : left.targetType === "HONITSU" ? -1 : 1;
}

function compareFlushDiscard(left: FlushDiscardEvaluation, right: FlushDiscardEvaluation): number {
  if (left.targetPossible !== right.targetPossible) return left.targetPossible ? -1 : 1;
  if (left.targetShanten !== right.targetShanten) return left.targetShanten - right.targetShanten;
  if (left.targetUkeireCount !== right.targetUkeireCount) return right.targetUkeireCount - left.targetUkeireCount;
  const leftLikelihood = left.suitedBlockCount * 3 + left.honorBlockCount * 2 + left.callabilityScore;
  const rightLikelihood = right.suitedBlockCount * 3 + right.honorBlockCount * 2 + right.callabilityScore;
  if (leftLikelihood !== rightLikelihood) return rightLikelihood - leftLikelihood;
  if (left.offSuitTileCount !== right.offSuitTileCount) return left.offSuitTileCount - right.offSuitTileCount;
  if (left.normalShanten !== right.normalShanten) return left.normalShanten - right.normalShanten;
  if (left.normalUkeireCount !== right.normalUkeireCount) return right.normalUkeireCount - left.normalUkeireCount;
  return left.index - right.index;
}

function candidateAllowed(melds: FlushMeld[], suit: FlushSuit, targetType: FlushTargetType): boolean {
  if (!meldsAreValid(melds)) return false;
  const locked = lockedFlushSuit(melds);
  if (locked === "CONFLICT" || (locked != null && locked !== suit)) return false;
  if (targetType === "CHINITSU" && hasHonorMeld(melds)) return false;
  return true;
}

function targetEffectiveIndexes(
  counts: Counts34,
  melds: FlushMeld[],
  available: Counts34,
  suit: FlushSuit,
  targetType: FlushTargetType,
  currentShanten: number,
): number[] {
  const indexes: number[] = [];
  for (let index = 0; index < 34; index += 1) {
    if (!isAllowedIndex(index, suit, targetType) || counts[index]! >= 4 || available[index]! <= 0) continue;
    const drawn = counts.slice();
    drawn[index] += 1;
    if (flushTargetShanten(drawn, melds, suit, targetType) < currentShanten) indexes.push(index);
  }
  return indexes;
}

function flushSevenPairsShanten(counts: Counts34, suit: FlushSuit, targetType: FlushTargetType): number {
  const indexes = Array.from({ length: 34 }, (_, index) => index).filter((index) => isAllowedIndex(index, suit, targetType));
  let states = new Map<string, number>([["0|0|0", 0]]);
  for (const index of indexes) {
    const next = new Map(states);
    for (const [key, overlap] of states) {
      const [pairs, hasSuit, hasHonor] = key.split("|").map(Number);
      if (pairs! >= 7) continue;
      const nextKey = `${pairs! + 1}|${hasSuit || index < 27 ? 1 : 0}|${hasHonor || index >= 27 ? 1 : 0}`;
      next.set(nextKey, Math.max(next.get(nextKey) ?? -1, overlap + Math.min(2, counts[index]!)));
    }
    states = next;
  }
  const overlap = targetType === "HONITSU" ? states.get("7|1|1") : states.get("7|1|0");
  return overlap == null ? Number.POSITIVE_INFINITY : 13 - overlap;
}

function suitedBlockScore(counts: Counts34, suit: FlushSuit): number {
  const base = suitBase(suit);
  let score = 0;
  for (let rank = 0; rank < 9; rank += 1) {
    const count = counts[base + rank]!;
    if (count >= 3) score += 3;
    else if (count >= 2) score += 2;
    if (rank <= 6 && counts[base + rank + 1]! > 0 && counts[base + rank + 2]! > 0) score += 3;
    else if (rank <= 7 && counts[base + rank + 1]! > 0) score += 1;
    else if (rank <= 6 && counts[base + rank + 2]! > 0) score += 1;
  }
  return score;
}

function honorBlockScore(counts: Counts34): number {
  return counts.slice(27).reduce((score, count) => score + (count >= 3 ? 3 : count >= 2 ? 2 : 0), 0);
}

function callabilityScore(counts: Counts34, suit: FlushSuit, targetType: FlushTargetType, available: Counts34): number {
  const base = suitBase(suit);
  let score = 0;
  for (let rank = 0; rank < 9; rank += 1) {
    if (counts[base + rank]! >= 2 && available[base + rank]! > 0) score += available[base + rank]!;
    if (rank <= 6) {
      const present = [0, 1, 2].filter((offset) => counts[base + rank + offset]! > 0).length;
      if (present >= 2) score += 1;
    }
  }
  if (targetType === "HONITSU") {
    for (let index = 27; index < 34; index += 1) {
      if (counts[index]! >= 2 && available[index]! > 0) score += available[index]!;
    }
  }
  return score;
}

function offSuitTileCount(counts: Counts34, suit: FlushSuit, targetType: FlushTargetType): number {
  return counts.reduce((total, count, index) => total + (isAllowedIndex(index, suit, targetType) ? 0 : count), 0);
}

function normalUkeireCount(counts: Counts34, meldCount: number, available: Counts34, shanten: number): number {
  let total = 0;
  for (let index = 0; index < 34; index += 1) {
    if (counts[index]! >= 4 || available[index]! <= 0) continue;
    const drawn = counts.slice();
    drawn[index] += 1;
    if (normalShantenWithOpenMelds(drawn, meldCount) < shanten) total += available[index]!;
  }
  return total;
}

function isAllowedIndex(index: number, suit: FlushSuit, targetType: FlushTargetType): boolean {
  return index < 27 ? indexSuit(index) === suit : targetType === "HONITSU";
}

function indexSuit(index: number): FlushSuit {
  return SUITS[Math.floor(index / 9)]!;
}

function suitBase(suit: FlushSuit): number {
  return SUITS.indexOf(suit) * 9;
}

function physicalTileIndexes(counts: Counts34, melds: FlushMeld[]): number[] {
  const indexes = counts.flatMap((count, index) => Array.from({ length: count }, () => index));
  for (const meld of melds) indexes.push(...meld.tiles.map(tileIndex));
  return indexes;
}

function isSevenPairsComplete(counts: Counts34): boolean {
  return sumCounts(counts) === 14 && counts.filter((count) => count === 2).length === 7;
}

function meldsAreValid(melds: FlushMeld[]): boolean {
  if (melds.length > 4) return false;
  const physical = Array(34).fill(0) as Counts34;
  for (const meld of melds) {
    const indexes = meld.tiles.map(tileIndex).sort((left, right) => left - right);
    const validPon = meld.kind === "pon" && indexes.length === 3 && new Set(indexes).size === 1;
    const validChi = meld.kind === "chi"
      && indexes.length === 3
      && indexes[0]! < 27
      && indexes[1] === indexes[0]! + 1
      && indexes[2] === indexes[0]! + 2
      && Math.floor(indexes[0]! / 9) === Math.floor(indexes[2]! / 9);
    if (!validPon && !validChi) return false;
    for (const index of indexes) {
      physical[index] += 1;
      if (physical[index]! > 4) return false;
    }
  }
  return true;
}

function defaultAvailableCounts(counts: Counts34, melds: FlushMeld[]): Counts34 {
  const fixed = Array(34).fill(0) as Counts34;
  for (const meld of melds) for (const tile of meld.tiles) fixed[tileIndex(tile)] += 1;
  return counts.map((count, index) => Math.max(0, 4 - count - fixed[index]!));
}

function validateAvailableCounts(counts: Counts34): void {
  if (counts.length !== 34 || counts.some((count) => !Number.isInteger(count) || count < 0 || count > 4)) {
    throw new Error("availableCounts must contain 34 values from 0 to 4.");
  }
}

function meldKey(melds: FlushMeld[]): string {
  return melds
    .map((meld) => `${meld.kind}:${meld.tiles.map(tileIndex).sort((left, right) => left - right).join(".")}`)
    .sort()
    .join(";");
}

function cacheTargetShanten(key: string, value: number): number {
  targetShantenCache.set(key, value);
  return value;
}

function cacheWin(key: string, value: FlushWinClassification): FlushWinClassification {
  winCache.set(key, value);
  return value;
}

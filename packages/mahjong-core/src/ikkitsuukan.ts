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

export const IKKITSUUKAN_AI_VERSION = "ikkitsuukan-ai-1.0.0";

export type IkkitsuukanSuit = "MAN" | "PIN" | "SOU";

export interface IkkitsuukanMeld {
  kind: "chi" | "pon";
  tiles: Tile[];
}

export interface IkkitsuukanCandidateEvaluation {
  suit: IkkitsuukanSuit;
  possible: boolean;
  shanten: number;
  ukeireKinds: number;
  ukeireCount: number;
  effectiveTiles: Tile[];
  completedRequiredSequenceCount: number;
  lowSequenceProgress: number;
  middleSequenceProgress: number;
  highSequenceProgress: number;
  extraMeldProgress: number;
  pairProgress: number;
  remainingMeldSlots: number;
  requiredSequenceSlots: number;
  openRequiredSequenceCount: number;
  openExtraMeldCount: number;
  callabilityScore: number;
}

export interface IkkitsuukanEffectiveTile {
  tile: Tile;
  remaining: number;
  resultingShanten: number;
  bestSuit: IkkitsuukanSuit;
  discards: Tile[];
  improves: Array<"123" | "456" | "789" | "extraMeld" | "pair">;
}

export interface IkkitsuukanProgressEvaluation {
  shanten: number;
  isPossible: boolean;
  isIishanten: boolean;
  isTenpai: boolean;
  winningTiles: Tile[];
  effectiveTiles: IkkitsuukanEffectiveTile[];
  candidates: IkkitsuukanCandidateEvaluation[];
  bestCandidate: IkkitsuukanCandidateEvaluation | null;
  lockedSuit: IkkitsuukanSuit | null;
}

export interface IkkitsuukanDiscardEvaluation {
  index: number;
  tile: Tile;
  targetPossible: boolean;
  targetShanten: number;
  bestSuit: IkkitsuukanSuit;
  targetUkeireKinds: number;
  targetUkeireCount: number;
  completedRequiredSequenceCount: number;
  lowSequenceProgress: number;
  middleSequenceProgress: number;
  highSequenceProgress: number;
  extraMeldProgress: number;
  pairProgress: number;
  remainingMeldSlots: number;
  requiredSequenceSlots: number;
  callabilityScore: number;
  furitenRisk: boolean;
  normalShanten: number;
  normalUkeireCount: number;
}

export interface IkkitsuukanWinClassification {
  type: "IKKITSUUKAN" | "NONE";
  suit: IkkitsuukanSuit | null;
}

interface CompletionTemplate {
  counts: Counts34;
  entries: Array<[number, number]>;
}

interface FixedMeldContext {
  valid: boolean;
  counts: Counts34;
  lockedSuit: IkkitsuukanSuit | null | "CONFLICT";
}

const SUITS: IkkitsuukanSuit[] = ["MAN", "PIN", "SOU"];
const REQUIRED_STARTS = [0, 3, 6] as const;
const templateCache = new LruCache<string, CompletionTemplate[]>(10_000);
const winCache = new LruCache<string, IkkitsuukanWinClassification>(10_000);
const progressCache = new LruCache<string, IkkitsuukanProgressEvaluation>(20_000);

export function classifyIkkitsuukanWin(
  counts: Counts34,
  melds: IkkitsuukanMeld[] = [],
): IkkitsuukanWinClassification {
  validateCounts(counts);
  const key = `${meldKey(melds)}|${counts.join(",")}`;
  const cached = winCache.get(key);
  if (cached) return cached;
  const expected = 14 - melds.length * 3;
  if (sumCounts(counts) !== expected) return cacheWin(key, { type: "NONE", suit: null });

  for (const suit of allowedSuits(melds)) {
    if (completionTemplates(melds, suit).some((template) => sameCounts(template.counts, counts))) {
      return cacheWin(key, { type: "IKKITSUUKAN", suit });
    }
  }
  return cacheWin(key, { type: "NONE", suit: null });
}

export function isIkkitsuukanComplete(counts: Counts34, melds: IkkitsuukanMeld[] = []): boolean {
  return classifyIkkitsuukanWin(counts, melds).type === "IKKITSUUKAN";
}

export function lockedIkkitsuukanSuit(
  melds: IkkitsuukanMeld[],
): IkkitsuukanSuit | null | "CONFLICT" {
  return fixedMeldContext(melds).lockedSuit;
}

export function countOpenIkkitsuukanMelds(
  melds: IkkitsuukanMeld[],
  suit: IkkitsuukanSuit,
): { required: number; extra: number } {
  const required = new Set<number>();
  for (const meld of melds) {
    const sequence = requiredSequenceInfo(meld);
    if (sequence?.suit === suit) required.add(sequence.part);
  }
  return { required: required.size, extra: melds.length - required.size };
}

export function isIkkitsuukanCompatibleMeld(
  meld: IkkitsuukanMeld,
  existingMelds: IkkitsuukanMeld[] = [],
): boolean {
  return allowedSuits([...existingMelds, meld]).some(
    (suit) => completionTemplates([...existingMelds, meld], suit).length > 0,
  );
}

export function ikkitsuukanShanten(
  counts: Counts34,
  melds: IkkitsuukanMeld[] = [],
): number {
  const best = evaluateIkkitsuukanCandidatesInternal(counts, melds, defaultAvailableCounts(counts, melds), false)
    .find((candidate) => candidate.possible);
  return best?.shanten ?? Number.POSITIVE_INFINITY;
}

export function evaluateIkkitsuukanCandidates(
  counts: Counts34,
  melds: IkkitsuukanMeld[] = [],
  availableCounts = defaultAvailableCounts(counts, melds),
): IkkitsuukanCandidateEvaluation[] {
  return evaluateIkkitsuukanCandidatesInternal(counts, melds, availableCounts, true);
}

export function ikkitsuukanWinningTiles(
  counts: Counts34,
  melds: IkkitsuukanMeld[] = [],
  availableCounts = defaultAvailableCounts(counts, melds),
): Tile[] {
  incrementSimulationCounter("waitCalculationCount");
  validateCounts(counts);
  validateAvailableCounts(availableCounts);
  const winning: Tile[] = [];
  for (let index = 0; index < 34; index += 1) {
    if (counts[index]! >= 4 || availableCounts[index]! <= 0) continue;
    const next = counts.slice();
    next[index] += 1;
    if (isIkkitsuukanComplete(next, melds)) winning.push(tileName(index));
  }
  return winning;
}

export function ikkitsuukanEffectiveTiles(
  counts: Counts34,
  melds: IkkitsuukanMeld[] = [],
  availableCounts = defaultAvailableCounts(counts, melds),
  currentShanten = ikkitsuukanShanten(counts, melds),
): IkkitsuukanEffectiveTile[] {
  validateCounts(counts);
  validateAvailableCounts(availableCounts);
  if (!Number.isFinite(currentShanten) || currentShanten <= 0) return [];
  const candidates = evaluateIkkitsuukanCandidates(counts, melds, availableCounts)
    .filter((candidate) => candidate.possible && candidate.shanten === currentShanten);
  const byTile = new Map<number, IkkitsuukanEffectiveTile>();
  for (const candidate of candidates) {
    for (const tile of candidate.effectiveTiles) {
      const drawIndex = tileIndex(tile);
      if (byTile.has(drawIndex)) continue;
      const drawn = counts.slice();
      drawn[drawIndex] += 1;
      const supplied = completionTemplates(melds, candidate.suit).filter((template) => template.entries.every(
        ([index, needed]) => needed <= drawn[index]! + availableCounts[index]! - (index === drawIndex ? 1 : 0),
      ));
      const bestOverlap = Math.max(...supplied.map((template) => sparseOverlapCount(drawn, template)));
      const discards = new Set<Tile>();
      for (const template of supplied) {
        if (sparseOverlapCount(drawn, template) !== bestOverlap) continue;
        for (let discardIndex = 0; discardIndex < 34; discardIndex += 1) {
          if (drawn[discardIndex]! > template.counts[discardIndex]!) discards.add(tileName(discardIndex));
        }
      }
      const remaining = availableCounts.slice();
      remaining[drawIndex] -= 1;
      const reachesLiveTenpai = currentShanten - 1 === 0 && [...discards].some((discard) => {
        const after = drawn.slice();
        after[tileIndex(discard)] -= 1;
        return ikkitsuukanWinningTiles(after, melds, remaining).length > 0;
      });
      byTile.set(drawIndex, {
        tile,
        remaining: availableCounts[drawIndex]!,
        resultingShanten: reachesLiveTenpai ? 0 : Math.max(1, currentShanten - 1),
        bestSuit: candidate.suit,
        discards: [...discards],
        improves: improvedParts(drawIndex, candidate.suit),
      });
    }
  }
  return [...byTile.values()].sort((left, right) => tileIndex(left.tile) - tileIndex(right.tile));
}

export function evaluateIkkitsuukanProgress(
  counts: Counts34,
  melds: IkkitsuukanMeld[] = [],
  availableCounts = defaultAvailableCounts(counts, melds),
): IkkitsuukanProgressEvaluation {
  validateCounts(counts);
  validateAvailableCounts(availableCounts);
  const key = `${meldKey(melds)}|${counts.join(",")}|${availableCounts.join(",")}`;
  const cached = progressCache.get(key);
  if (cached) return cached;
  incrementSimulationCounter("targetShantenCalculationCount");

  const candidates = evaluateIkkitsuukanCandidates(counts, melds, availableCounts);
  const bestCandidate = candidates.find((candidate) => candidate.possible) ?? null;
  const rawShanten = bestCandidate?.shanten ?? Number.POSITIVE_INFINITY;
  const winningTiles = rawShanten === 0 ? ikkitsuukanWinningTiles(counts, melds, availableCounts) : [];
  const isTenpai = winningTiles.length > 0;
  const effectiveTiles = rawShanten > 0 && rawShanten <= 3 && bestCandidate
    ? ikkitsuukanEffectiveTiles(counts, melds, availableCounts, rawShanten)
    : [];
  const canReachLiveTenpai = rawShanten === 1
    && effectiveTiles.some((tile) => tile.resultingShanten === 0);
  const locked = lockedIkkitsuukanSuit(melds);
  const evaluation: IkkitsuukanProgressEvaluation = {
    shanten: isTenpai ? 0 : canReachLiveTenpai ? 1 : rawShanten,
    isPossible: bestCandidate != null,
    isIishanten: isTenpai || canReachLiveTenpai,
    isTenpai,
    winningTiles,
    effectiveTiles,
    candidates,
    bestCandidate,
    lockedSuit: locked === "CONFLICT" ? null : locked,
  };
  progressCache.set(key, evaluation);
  return evaluation;
}

export function analyzeIkkitsuukanDiscards(
  counts: Counts34,
  melds: IkkitsuukanMeld[] = [],
  availableCounts = defaultAvailableCounts(counts, melds),
  ownDiscards: Counts34 = Array(34).fill(0),
): IkkitsuukanDiscardEvaluation[] {
  incrementSimulationCounter("discardEvaluationCount");
  validateCounts(counts);
  validateAvailableCounts(availableCounts);
  validateAvailableCounts(ownDiscards);
  const preliminary: Array<{
    index: number;
    after: Counts34;
    candidate: IkkitsuukanCandidateEvaluation | undefined;
  }> = [];
  for (let index = 0; index < 34; index += 1) {
    if (counts[index]! <= 0) continue;
    const after = counts.slice();
    after[index] -= 1;
    const candidate = evaluateIkkitsuukanCandidatesInternal(after, melds, availableCounts, false)
      .find((item) => item.possible);
    preliminary.push({ index, after, candidate });
  }
  const bestShanten = Math.min(...preliminary.map(({ candidate }) => candidate?.shanten ?? Number.POSITIVE_INFINITY));
  const evaluations = preliminary.map(({ index, after, candidate: initialCandidate }) => {
    const candidate = initialCandidate?.shanten === bestShanten
      ? evaluateIkkitsuukanCandidates(after, melds, availableCounts).find((item) => item.possible)
      : initialCandidate;
    const waits = candidate?.shanten === 0 ? ikkitsuukanWinningTiles(after, melds, availableCounts) : [];
    return {
      index,
      tile: tileName(index),
      targetPossible: candidate != null,
      targetShanten: candidate?.shanten ?? Number.POSITIVE_INFINITY,
      bestSuit: candidate?.suit ?? "MAN",
      targetUkeireKinds: candidate?.ukeireKinds ?? 0,
      targetUkeireCount: candidate?.ukeireCount ?? 0,
      completedRequiredSequenceCount: candidate?.completedRequiredSequenceCount ?? 0,
      lowSequenceProgress: candidate?.lowSequenceProgress ?? 0,
      middleSequenceProgress: candidate?.middleSequenceProgress ?? 0,
      highSequenceProgress: candidate?.highSequenceProgress ?? 0,
      extraMeldProgress: candidate?.extraMeldProgress ?? 0,
      pairProgress: candidate?.pairProgress ?? 0,
      remainingMeldSlots: candidate?.remainingMeldSlots ?? 0,
      requiredSequenceSlots: candidate?.requiredSequenceSlots ?? 3,
      callabilityScore: candidate?.callabilityScore ?? 0,
      furitenRisk: waits.some((tile) => ownDiscards[tileIndex(tile)]! > 0),
      normalShanten: Number.POSITIVE_INFINITY,
      normalUkeireCount: 0,
    } satisfies IkkitsuukanDiscardEvaluation;
  });
  const targetBest = evaluations.slice().sort(compareIkkitsuukanTarget)[0];
  if (targetBest) {
    for (const evaluation of evaluations) {
      if (compareIkkitsuukanTarget(evaluation, targetBest) !== 0) continue;
      const after = counts.slice();
      after[evaluation.index] -= 1;
      evaluation.normalShanten = normalShantenWithOpenMelds(after, melds.length);
      evaluation.normalUkeireCount = normalUkeireCount(
        after,
        melds.length,
        availableCounts,
        evaluation.normalShanten,
      );
    }
  }
  return evaluations.sort(compareIkkitsuukanDiscard);
}

export function selectBestIkkitsuukanDiscard(
  counts: Counts34,
  melds: IkkitsuukanMeld[] = [],
  availableCounts = defaultAvailableCounts(counts, melds),
  ownDiscards: Counts34 = Array(34).fill(0),
): IkkitsuukanDiscardEvaluation | null {
  return analyzeIkkitsuukanDiscards(counts, melds, availableCounts, ownDiscards)[0] ?? null;
}

export function shouldIkkitsuukanRiichi(): false {
  return false;
}

function evaluateIkkitsuukanCandidatesInternal(
  counts: Counts34,
  melds: IkkitsuukanMeld[],
  availableCounts: Counts34,
  includeUkeire: boolean,
): IkkitsuukanCandidateEvaluation[] {
  validateCounts(counts);
  validateAvailableCounts(availableCounts);
  const candidates = allowedSuits(melds).map(
    (suit) => evaluateIkkitsuukanCandidateForSuit(counts, melds, availableCounts, suit, includeUkeire),
  );
  return candidates.sort(compareIkkitsuukanCandidate);
}

function evaluateIkkitsuukanCandidateForSuit(
  counts: Counts34,
  melds: IkkitsuukanMeld[],
  availableCounts: Counts34,
  suit: IkkitsuukanSuit,
  includeUkeire: boolean,
): IkkitsuukanCandidateEvaluation {
  const templates = completionTemplates(melds, suit);
  const supplied = templates.filter((template) => template.entries.every(
    ([index, needed]) => needed <= counts[index]! + availableCounts[index]!,
  ));
  const possible = supplied.length > 0;
  const bestTemplate = possible ? bestOverlapTemplate(counts, supplied) : null;
  const shanten = bestTemplate
    ? (14 - melds.length * 3) - sparseOverlapCount(counts, bestTemplate) - 1
    : Number.POSITIVE_INFINITY;
  const effectiveIndexes = includeUkeire && possible
    ? effectiveIndexesForSuit(counts, melds, availableCounts, suit, shanten)
    : [];
  const open = countOpenIkkitsuukanMelds(melds, suit);
  const sectionProgress = REQUIRED_STARTS.map((start) => requiredSectionProgress(counts, melds, suit, start));
  return {
    suit,
    possible,
    shanten,
    ukeireKinds: effectiveIndexes.length,
    ukeireCount: effectiveIndexes.reduce((sum, index) => sum + availableCounts[index]!, 0),
    effectiveTiles: effectiveIndexes.map(tileName),
    completedRequiredSequenceCount: sectionProgress.filter((progress) => progress === 3).length,
    lowSequenceProgress: sectionProgress[0]!,
    middleSequenceProgress: sectionProgress[1]!,
    highSequenceProgress: sectionProgress[2]!,
    extraMeldProgress: bestExtraMeldProgress(counts, suit),
    pairProgress: bestPairProgress(counts),
    remainingMeldSlots: 4 - melds.length,
    requiredSequenceSlots: 3 - open.required,
    openRequiredSequenceCount: open.required,
    openExtraMeldCount: open.extra,
    callabilityScore: requiredCallabilityScore(counts, availableCounts, melds, suit),
  };
}

function completionTemplates(melds: IkkitsuukanMeld[], suit: IkkitsuukanSuit): CompletionTemplate[] {
  const key = `${suit}|${meldKey(melds)}`;
  const cached = templateCache.get(key);
  if (cached) return cached;
  const fixed = fixedMeldContext(melds);
  if (!fixed.valid || fixed.lockedSuit === "CONFLICT" || (fixed.lockedSuit && fixed.lockedSuit !== suit)) {
    templateCache.set(key, []);
    return [];
  }
  const open = countOpenIkkitsuukanMelds(melds, suit);
  const missingRequiredStarts = REQUIRED_STARTS.filter((start) => !hasOpenRequiredSequence(melds, suit, start));
  const concealedMeldSlots = 4 - melds.length;
  const concealedExtraSlots = 1 - open.extra;
  if (open.extra > 1 || missingRequiredStarts.length > concealedMeldSlots || concealedExtraSlots < 0
    || missingRequiredStarts.length + concealedExtraSlots !== concealedMeldSlots) {
    templateCache.set(key, []);
    return [];
  }

  const base = Array(34).fill(0) as Counts34;
  for (const start of missingRequiredStarts) {
    const index = suitBase(suit) + start;
    base[index] += 1;
    base[index + 1] += 1;
    base[index + 2] += 1;
  }
  const extraMelds = concealedExtraSlots === 1 ? allMeldCounts() : [Array(34).fill(0) as Counts34];
  const templates: CompletionTemplate[] = [];
  const seen = new Set<string>();
  for (const extra of extraMelds) {
    for (let pairIndex = 0; pairIndex < 34; pairIndex += 1) {
      const target = base.map((count, index) => count + extra[index]!) as Counts34;
      target[pairIndex] += 2;
      if (target.some((count, index) => count + fixed.counts[index]! > 4)) continue;
      const targetKey = target.join(",");
      if (seen.has(targetKey)) continue;
      seen.add(targetKey);
      templates.push({
        counts: target,
        entries: target.flatMap((count, index) => count > 0 ? [[index, count] as [number, number]] : []),
      });
    }
  }
  templateCache.set(key, templates);
  return templates;
}

function fixedMeldContext(melds: IkkitsuukanMeld[]): FixedMeldContext {
  const counts = Array(34).fill(0) as Counts34;
  const requiredSuits = new Set<IkkitsuukanSuit>();
  let valid = melds.length <= 4;
  for (const meld of melds) {
    const indexes = meld.tiles.map(tileIndex).sort((left, right) => left - right);
    if (meld.kind === "chi") {
      if (indexes.length !== 3 || indexes[0]! >= 27 || indexes[1] !== indexes[0]! + 1
        || indexes[2] !== indexes[0]! + 2 || Math.floor(indexes[0]! / 9) !== Math.floor(indexes[2]! / 9)) {
        valid = false;
      }
    } else if (indexes.length !== 3 || new Set(indexes).size !== 1) {
      valid = false;
    }
    const info = requiredSequenceInfo(meld);
    if (info) requiredSuits.add(info.suit);
    for (const index of indexes) {
      counts[index] += 1;
      if (counts[index]! > 4) valid = false;
    }
  }
  return {
    valid,
    counts,
    lockedSuit: requiredSuits.size > 1 ? "CONFLICT" : requiredSuits.size === 1 ? [...requiredSuits][0]! : null,
  };
}

function allowedSuits(melds: IkkitsuukanMeld[]): IkkitsuukanSuit[] {
  const fixed = fixedMeldContext(melds);
  if (!fixed.valid || fixed.lockedSuit === "CONFLICT") return [];
  return fixed.lockedSuit ? [fixed.lockedSuit] : SUITS;
}

function requiredSequenceInfo(meld: IkkitsuukanMeld): { suit: IkkitsuukanSuit; part: number } | null {
  if (meld.kind !== "chi") return null;
  const indexes = meld.tiles.map(tileIndex).sort((left, right) => left - right);
  if (indexes.length !== 3 || indexes[0]! >= 27 || indexes[1] !== indexes[0]! + 1 || indexes[2] !== indexes[0]! + 2) return null;
  const start = indexes[0]! % 9;
  if (!REQUIRED_STARTS.includes(start as 0 | 3 | 6)) return null;
  return { suit: indexSuit(indexes[0]!), part: start };
}

function hasOpenRequiredSequence(melds: IkkitsuukanMeld[], suit: IkkitsuukanSuit, start: number): boolean {
  return melds.some((meld) => {
    const info = requiredSequenceInfo(meld);
    return info?.suit === suit && info.part === start;
  });
}

function effectiveIndexesForSuit(
  counts: Counts34,
  melds: IkkitsuukanMeld[],
  availableCounts: Counts34,
  suit: IkkitsuukanSuit,
  currentShanten: number,
): number[] {
  if (!Number.isFinite(currentShanten)) return [];
  const supplied = completionTemplates(melds, suit).filter((template) => template.entries.every(
    ([index, needed]) => needed <= counts[index]! + availableCounts[index]!,
  ));
  const bestOverlap = Math.max(...supplied.map((template) => sparseOverlapCount(counts, template)));
  const effective = new Set<number>();
  for (const template of supplied) {
    if (sparseOverlapCount(counts, template) !== bestOverlap) continue;
    for (const [index, needed] of template.entries) {
      if (counts[index]! < needed && availableCounts[index]! > 0) effective.add(index);
    }
  }
  return [...effective].sort((left, right) => left - right);
}

function compareIkkitsuukanCandidate(
  left: IkkitsuukanCandidateEvaluation,
  right: IkkitsuukanCandidateEvaluation,
): number {
  if (left.possible !== right.possible) return left.possible ? -1 : 1;
  if (left.shanten !== right.shanten) return left.shanten - right.shanten;
  if (left.ukeireCount !== right.ukeireCount) return right.ukeireCount - left.ukeireCount;
  if (left.completedRequiredSequenceCount !== right.completedRequiredSequenceCount) {
    return right.completedRequiredSequenceCount - left.completedRequiredSequenceCount;
  }
  const leftRequiredProgress = left.lowSequenceProgress + left.middleSequenceProgress + left.highSequenceProgress;
  const rightRequiredProgress = right.lowSequenceProgress + right.middleSequenceProgress + right.highSequenceProgress;
  if (leftRequiredProgress !== rightRequiredProgress) return rightRequiredProgress - leftRequiredProgress;
  if (left.extraMeldProgress !== right.extraMeldProgress) return right.extraMeldProgress - left.extraMeldProgress;
  if (left.pairProgress !== right.pairProgress) return right.pairProgress - left.pairProgress;
  if (left.callabilityScore !== right.callabilityScore) return right.callabilityScore - left.callabilityScore;
  return SUITS.indexOf(left.suit) - SUITS.indexOf(right.suit);
}

function compareIkkitsuukanDiscard(
  left: IkkitsuukanDiscardEvaluation,
  right: IkkitsuukanDiscardEvaluation,
): number {
  const targetComparison = compareIkkitsuukanTarget(left, right);
  if (targetComparison !== 0) return targetComparison;
  if (left.normalShanten !== right.normalShanten) return left.normalShanten - right.normalShanten;
  if (left.normalUkeireCount !== right.normalUkeireCount) return right.normalUkeireCount - left.normalUkeireCount;
  return left.index - right.index;
}

function compareIkkitsuukanTarget(
  left: IkkitsuukanDiscardEvaluation,
  right: IkkitsuukanDiscardEvaluation,
): number {
  if (left.targetPossible !== right.targetPossible) return left.targetPossible ? -1 : 1;
  if (left.targetShanten !== right.targetShanten) return left.targetShanten - right.targetShanten;
  if (left.targetUkeireCount !== right.targetUkeireCount) return right.targetUkeireCount - left.targetUkeireCount;
  if (left.completedRequiredSequenceCount !== right.completedRequiredSequenceCount) {
    return right.completedRequiredSequenceCount - left.completedRequiredSequenceCount;
  }
  const leftProgress = left.lowSequenceProgress + left.middleSequenceProgress + left.highSequenceProgress;
  const rightProgress = right.lowSequenceProgress + right.middleSequenceProgress + right.highSequenceProgress;
  if (leftProgress !== rightProgress) return rightProgress - leftProgress;
  if (left.extraMeldProgress !== right.extraMeldProgress) return right.extraMeldProgress - left.extraMeldProgress;
  if (left.pairProgress !== right.pairProgress) return right.pairProgress - left.pairProgress;
  if (left.callabilityScore !== right.callabilityScore) return right.callabilityScore - left.callabilityScore;
  if (left.furitenRisk !== right.furitenRisk) return left.furitenRisk ? 1 : -1;
  return 0;
}

function requiredSectionProgress(
  counts: Counts34,
  melds: IkkitsuukanMeld[],
  suit: IkkitsuukanSuit,
  start: number,
): number {
  if (hasOpenRequiredSequence(melds, suit, start)) return 3;
  const base = suitBase(suit) + start;
  return [base, base + 1, base + 2].reduce((sum, index) => sum + (counts[index]! > 0 ? 1 : 0), 0);
}

function requiredCallabilityScore(
  counts: Counts34,
  available: Counts34,
  melds: IkkitsuukanMeld[],
  suit: IkkitsuukanSuit,
): number {
  let score = 0;
  for (const start of REQUIRED_STARTS) {
    if (hasOpenRequiredSequence(melds, suit, start)) {
      score += 12;
      continue;
    }
    const base = suitBase(suit) + start;
    const present = [base, base + 1, base + 2].filter((index) => counts[index]! > 0);
    if (present.length === 2) {
      const missing = [base, base + 1, base + 2].find((index) => counts[index]! === 0)!;
      score += available[missing]! * 2;
    } else if (present.length === 3) {
      score += 10;
    }
  }
  return score;
}

function bestExtraMeldProgress(counts: Counts34, targetSuit: IkkitsuukanSuit): number {
  let best = 0;
  for (let index = 0; index < 34; index += 1) best = Math.max(best, Math.min(3, counts[index]!));
  for (let suit = 0; suit < 3; suit += 1) {
    for (let start = 0; start <= 6; start += 1) {
      const base = suit * 9 + start;
      const progress = [base, base + 1, base + 2].reduce((sum, index) => sum + (counts[index]! > 0 ? 1 : 0), 0);
      const isRequired = indexSuit(base) === targetSuit && REQUIRED_STARTS.includes(start as 0 | 3 | 6);
      if (!isRequired) best = Math.max(best, progress);
    }
  }
  return best;
}

function bestPairProgress(counts: Counts34): number {
  return counts.some((count) => count >= 2) ? 2 : counts.some((count) => count === 1) ? 1 : 0;
}

function improvedParts(index: number, suit: IkkitsuukanSuit): Array<"123" | "456" | "789" | "extraMeld" | "pair"> {
  if (index >= 27 || indexSuit(index) !== suit) return ["extraMeld", "pair"];
  const rank = index % 9;
  if (rank <= 2) return ["123", "extraMeld", "pair"];
  if (rank <= 5) return ["456", "extraMeld", "pair"];
  return ["789", "extraMeld", "pair"];
}

function bestOverlapTemplate(counts: Counts34, templates: CompletionTemplate[]): CompletionTemplate | null {
  let best: CompletionTemplate | null = null;
  let bestOverlap = -1;
  for (const template of templates) {
    const overlap = sparseOverlapCount(counts, template);
    if (overlap > bestOverlap) {
      best = template;
      bestOverlap = overlap;
    }
  }
  return best;
}

function sparseOverlapCount(counts: Counts34, template: CompletionTemplate): number {
  return template.entries.reduce((sum, [index, needed]) => sum + Math.min(counts[index]!, needed), 0);
}

function allMeldCounts(): Counts34[] {
  const melds: Counts34[] = [];
  for (let index = 0; index < 34; index += 1) {
    const triplet = Array(34).fill(0) as Counts34;
    triplet[index] = 3;
    melds.push(triplet);
  }
  for (let suit = 0; suit < 3; suit += 1) {
    for (let start = 0; start <= 6; start += 1) {
      const sequence = Array(34).fill(0) as Counts34;
      const base = suit * 9 + start;
      sequence[base] = 1;
      sequence[base + 1] = 1;
      sequence[base + 2] = 1;
      melds.push(sequence);
    }
  }
  return melds;
}

function normalUkeireCount(counts: Counts34, meldCount: number, available: Counts34, shanten: number): number {
  let total = 0;
  for (let index = 0; index < 34; index += 1) {
    if (counts[index]! >= 4 || available[index]! <= 0) continue;
    const next = counts.slice();
    next[index] += 1;
    if (normalShantenWithOpenMelds(next, meldCount) < shanten) total += available[index]!;
  }
  return total;
}

function defaultAvailableCounts(counts: Counts34, melds: IkkitsuukanMeld[]): Counts34 {
  const fixed = fixedMeldContext(melds).counts;
  return counts.map((count, index) => Math.max(0, 4 - count - fixed[index]!));
}

function validateAvailableCounts(counts: Counts34): void {
  if (counts.length !== 34 || counts.some((count) => !Number.isInteger(count) || count < 0 || count > 4)) {
    throw new Error("Available counts must contain 34 integers from 0 to 4.");
  }
}

function sameCounts(left: Counts34, right: Counts34): boolean {
  return left.every((count, index) => count === right[index]);
}

function cacheWin(key: string, value: IkkitsuukanWinClassification): IkkitsuukanWinClassification {
  winCache.set(key, value);
  return value;
}

function suitBase(suit: IkkitsuukanSuit): number {
  return SUITS.indexOf(suit) * 9;
}

function indexSuit(index: number): IkkitsuukanSuit {
  return SUITS[Math.floor(index / 9)]!;
}

function meldKey(melds: IkkitsuukanMeld[]): string {
  return melds
    .map((meld) => `${meld.kind}:${meld.tiles.map(tileIndex).sort((left, right) => left - right).join(".")}`)
    .sort()
    .join(";");
}

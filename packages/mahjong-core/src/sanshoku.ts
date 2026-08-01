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

export const SANSHOKU_AI_VERSION = "sanshoku-ai-1.0.0";

export type SanshokuSequenceStart = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type SanshokuSuit = "MAN" | "PIN" | "SOU";

export interface SanshokuMeld {
  kind: "chi" | "pon";
  tiles: Tile[];
}

export interface SanshokuWinClassification {
  type: "SANSHOKU" | "NONE";
  sequenceStart: SanshokuSequenceStart | null;
  sequenceStarts: SanshokuSequenceStart[];
}

export interface SanshokuCandidateEvaluation {
  sequenceStart: SanshokuSequenceStart;
  possible: boolean;
  shanten: number;
  ukeireKinds: number;
  ukeireCount: number;
  effectiveTiles: Tile[];
  completedRequiredSequenceCount: number;
  manProgress: number;
  pinProgress: number;
  souProgress: number;
  minimumSuitProgress: number;
  extraMeldProgress: number;
  pairProgress: number;
  remainingMeldSlots: number;
  requiredSequenceSlots: number;
  openRequiredSequenceCount: number;
  openExtraMeldCount: number;
  callabilityScore: number;
}

export interface SanshokuEffectiveTile {
  tile: Tile;
  remaining: number;
  resultingShanten: number;
  bestSequenceStart: SanshokuSequenceStart;
  discards: Tile[];
  improvedSuits: SanshokuSuit[];
  completesRequiredSequence: boolean;
  reachesIishanten: boolean;
  reachesTenpai: boolean;
  completes: boolean;
}

export interface SanshokuProgressEvaluation {
  shanten: number;
  isPossible: boolean;
  isIishanten: boolean;
  isTenpai: boolean;
  winningTiles: Tile[];
  waitKindCount: number;
  waitLiveCount: number;
  effectiveTiles: SanshokuEffectiveTile[];
  candidates: SanshokuCandidateEvaluation[];
  bestCandidate: SanshokuCandidateEvaluation | null;
  lockedSequenceStart: SanshokuSequenceStart | null;
}

export interface SanshokuDiscardEvaluation {
  index: number;
  tile: Tile;
  targetPossible: boolean;
  targetShanten: number;
  bestSequenceStart: SanshokuSequenceStart;
  targetUkeireKinds: number;
  targetUkeireCount: number;
  completedRequiredSequenceCount: number;
  manProgress: number;
  pinProgress: number;
  souProgress: number;
  minimumSuitProgress: number;
  extraMeldProgress: number;
  pairProgress: number;
  remainingMeldSlots: number;
  requiredSequenceSlots: number;
  openRequiredSequenceCount: number;
  openExtraMeldCount: number;
  callabilityScore: number;
  targetTenpaiWaitCount: number;
  targetTenpaiLiveCount: number;
  furitenRisk: boolean;
  normalShanten: number;
  normalUkeireCount: number;
}

export interface SanshokuCallDecision {
  call: boolean;
  reason: string;
  beforeShanten: number;
  afterShanten: number;
  beforeUkeireCount: number;
  afterUkeireCount: number;
  discardedTile: Tile | null;
  requiredSequenceCall: boolean;
  lockedSequenceStart: SanshokuSequenceStart | null;
}

interface CompletionTemplate {
  counts: Counts34;
  entries: Array<[number, number]>;
}

interface FixedMeldContext {
  valid: boolean;
  counts: Counts34;
}

interface CallOutcome {
  lock: SanshokuSequenceStart | null;
  required: boolean;
  discard: SanshokuDiscardEvaluation;
  progress: SanshokuProgressEvaluation;
  ukeire: number;
}

const SEQUENCE_STARTS: SanshokuSequenceStart[] = [1, 2, 3, 4, 5, 6, 7];
const SUITS: SanshokuSuit[] = ["MAN", "PIN", "SOU"];
const templateCache = new LruCache<string, CompletionTemplate[]>(10_000);
const winCache = new LruCache<string, SanshokuWinClassification>(10_000);
const progressCache = new LruCache<string, SanshokuProgressEvaluation>(20_000);

export function classifySanshokuWin(
  counts: Counts34,
  melds: SanshokuMeld[] = [],
  lockedSequenceStart: SanshokuSequenceStart | null = null,
): SanshokuWinClassification {
  validateCounts(counts);
  const key = `${lockedSequenceStart ?? 0}|${meldKey(melds)}|${counts.join(",")}`;
  const cached = winCache.get(key);
  if (cached) return cached;
  const expected = 14 - melds.length * 3;
  if (sumCounts(counts) !== expected) return cacheWin(key, noneWin());
  const starts = allowedStarts(lockedSequenceStart).filter((start) => completionTemplates(melds, start)
    .some((template) => sameCounts(template.counts, counts)));
  return cacheWin(key, starts.length
    ? { type: "SANSHOKU", sequenceStart: starts[0]!, sequenceStarts: starts }
    : noneWin());
}

export function isSanshokuComplete(
  counts: Counts34,
  melds: SanshokuMeld[] = [],
  lockedSequenceStart: SanshokuSequenceStart | null = null,
): boolean {
  return classifySanshokuWin(counts, melds, lockedSequenceStart).type === "SANSHOKU";
}

export function countOpenSanshokuMelds(
  melds: SanshokuMeld[],
  sequenceStart: SanshokuSequenceStart,
): { required: number; extra: number } {
  const requiredSuits = new Set<SanshokuSuit>();
  for (const meld of melds) {
    const info = sequenceInfo(meld);
    if (info?.sequenceStart === sequenceStart) requiredSuits.add(info.suit);
  }
  return { required: requiredSuits.size, extra: melds.length - requiredSuits.size };
}

export function isSanshokuCompatibleMeld(
  meld: SanshokuMeld,
  existingMelds: SanshokuMeld[] = [],
  lockedSequenceStart: SanshokuSequenceStart | null = null,
): boolean {
  return allowedStarts(lockedSequenceStart).some(
    (start) => completionTemplates([...existingMelds, meld], start).length > 0,
  );
}

export function sanshokuShanten(
  counts: Counts34,
  melds: SanshokuMeld[] = [],
  availableCounts = defaultAvailableCounts(counts, melds),
  lockedSequenceStart: SanshokuSequenceStart | null = null,
): number {
  const best = evaluateSanshokuCandidatesInternal(
    counts,
    melds,
    availableCounts,
    lockedSequenceStart,
    false,
  ).find((candidate) => candidate.possible);
  return best?.shanten ?? Number.POSITIVE_INFINITY;
}

export function evaluateSanshokuCandidates(
  counts: Counts34,
  melds: SanshokuMeld[] = [],
  availableCounts = defaultAvailableCounts(counts, melds),
  lockedSequenceStart: SanshokuSequenceStart | null = null,
): SanshokuCandidateEvaluation[] {
  return evaluateSanshokuCandidatesInternal(counts, melds, availableCounts, lockedSequenceStart, true);
}

export function sanshokuWinningTiles(
  counts: Counts34,
  melds: SanshokuMeld[] = [],
  availableCounts = defaultAvailableCounts(counts, melds),
  lockedSequenceStart: SanshokuSequenceStart | null = null,
): Tile[] {
  incrementSimulationCounter("waitCalculationCount");
  validateCounts(counts);
  validateAvailableCounts(availableCounts);
  if (sumCounts(counts) !== 13 - melds.length * 3) return [];
  const winning: Tile[] = [];
  for (let index = 0; index < 34; index += 1) {
    if (counts[index]! >= 4 || availableCounts[index]! <= 0) continue;
    const next = counts.slice();
    next[index] += 1;
    if (isSanshokuComplete(next, melds, lockedSequenceStart)) winning.push(tileName(index));
  }
  return winning;
}

export function sanshokuEffectiveTiles(
  counts: Counts34,
  melds: SanshokuMeld[] = [],
  availableCounts = defaultAvailableCounts(counts, melds),
  currentShanten?: number,
  lockedSequenceStart: SanshokuSequenceStart | null = null,
): SanshokuEffectiveTile[] {
  validateCounts(counts);
  validateAvailableCounts(availableCounts);
  const baseShanten = currentShanten
    ?? sanshokuShanten(counts, melds, availableCounts, lockedSequenceStart);
  if (!Number.isFinite(baseShanten) || baseShanten <= 0) return [];
  const candidates = evaluateSanshokuCandidates(counts, melds, availableCounts, lockedSequenceStart)
    .filter((candidate) => candidate.possible && candidate.shanten === baseShanten);
  const byTile = new Map<number, SanshokuEffectiveTile>();
  for (const candidate of candidates) {
    for (const tile of candidate.effectiveTiles) {
      const drawIndex = tileIndex(tile);
      const drawn = counts.slice();
      drawn[drawIndex] += 1;
      const supplied = suppliedTemplates(drawn, melds, availableCounts, candidate.sequenceStart, drawIndex);
      if (!supplied.length) continue;
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
      const reachesLiveTenpai = baseShanten - 1 === 0 && [...discards].some((discard) => {
        const after = drawn.slice();
        after[tileIndex(discard)] -= 1;
        return sanshokuWinningTiles(after, melds, remaining, lockedSequenceStart).length > 0;
      });
      const improvedSuits = improvedRequiredSuits(drawIndex, candidate.sequenceStart);
      const item: SanshokuEffectiveTile = {
        tile,
        remaining: availableCounts[drawIndex]!,
        resultingShanten: reachesLiveTenpai ? 0 : Math.max(1, baseShanten - 1),
        bestSequenceStart: candidate.sequenceStart,
        discards: [...discards],
        improvedSuits,
        completesRequiredSequence: improvedSuits.some((suit) => requiredSuitProgress(
          counts,
          melds,
          suit,
          candidate.sequenceStart,
        ) === 2),
        reachesIishanten: baseShanten - 1 === 1,
        reachesTenpai: reachesLiveTenpai,
        completes: false,
      };
      const existing = byTile.get(drawIndex);
      if (!existing || compareEffective(item, existing) < 0) byTile.set(drawIndex, item);
    }
  }
  return [...byTile.values()].sort((left, right) => tileIndex(left.tile) - tileIndex(right.tile));
}

export function evaluateSanshokuProgress(
  counts: Counts34,
  melds: SanshokuMeld[] = [],
  availableCounts = defaultAvailableCounts(counts, melds),
  lockedSequenceStart: SanshokuSequenceStart | null = null,
): SanshokuProgressEvaluation {
  validateCounts(counts);
  validateAvailableCounts(availableCounts);
  const key = `${lockedSequenceStart ?? 0}|${meldKey(melds)}|${counts.join(",")}|${availableCounts.join(",")}`;
  const cached = progressCache.get(key);
  if (cached) return cached;
  incrementSimulationCounter("targetShantenCalculationCount");
  const candidates = evaluateSanshokuCandidates(counts, melds, availableCounts, lockedSequenceStart);
  const bestCandidate = candidates.find((candidate) => candidate.possible) ?? null;
  const rawShanten = bestCandidate?.shanten ?? Number.POSITIVE_INFINITY;
  const winningTiles = rawShanten === 0
    ? sanshokuWinningTiles(counts, melds, availableCounts, lockedSequenceStart)
    : [];
  const isTenpai = winningTiles.length > 0;
  const effectiveTiles = rawShanten > 0 && rawShanten <= 3
    ? sanshokuEffectiveTiles(counts, melds, availableCounts, rawShanten, lockedSequenceStart)
    : [];
  const isIishanten = isTenpai || (rawShanten === 1
    && effectiveTiles.some((tile) => tile.resultingShanten === 0));
  const evaluation: SanshokuProgressEvaluation = {
    shanten: isTenpai ? 0 : isIishanten ? 1 : rawShanten,
    isPossible: bestCandidate != null,
    isIishanten,
    isTenpai,
    winningTiles,
    waitKindCount: winningTiles.length,
    waitLiveCount: winningTiles.reduce((sum, tile) => sum + availableCounts[tileIndex(tile)]!, 0),
    effectiveTiles,
    candidates,
    bestCandidate,
    lockedSequenceStart,
  };
  progressCache.set(key, evaluation);
  return evaluation;
}

export function analyzeSanshokuDiscards(
  counts: Counts34,
  melds: SanshokuMeld[] = [],
  availableCounts = defaultAvailableCounts(counts, melds),
  ownDiscards: Counts34 = Array(34).fill(0),
  lockedSequenceStart: SanshokuSequenceStart | null = null,
): SanshokuDiscardEvaluation[] {
  incrementSimulationCounter("discardEvaluationCount");
  validateCounts(counts);
  validateAvailableCounts(availableCounts);
  validateAvailableCounts(ownDiscards);
  const preliminary: Array<{ index: number; after: Counts34; candidate: SanshokuCandidateEvaluation | undefined }> = [];
  for (let index = 0; index < 34; index += 1) {
    if (counts[index]! <= 0) continue;
    const after = counts.slice();
    after[index] -= 1;
    const candidate = evaluateSanshokuCandidatesInternal(
      after,
      melds,
      availableCounts,
      lockedSequenceStart,
      false,
    ).find((item) => item.possible);
    preliminary.push({ index, after, candidate });
  }
  const bestShanten = Math.min(...preliminary.map(({ candidate }) => candidate?.shanten ?? Number.POSITIVE_INFINITY));
  const evaluations = preliminary.map(({ index, after, candidate: initialCandidate }) => {
    const candidate = initialCandidate?.shanten === bestShanten
      ? evaluateSanshokuCandidates(after, melds, availableCounts, lockedSequenceStart)
        .find((item) => item.possible)
      : initialCandidate;
    const waits = candidate?.shanten === 0
      ? sanshokuWinningTiles(after, melds, availableCounts, lockedSequenceStart)
      : [];
    return {
      index,
      tile: tileName(index),
      targetPossible: candidate != null,
      targetShanten: candidate?.shanten ?? Number.POSITIVE_INFINITY,
      bestSequenceStart: candidate?.sequenceStart ?? lockedSequenceStart ?? 1,
      targetUkeireKinds: candidate?.ukeireKinds ?? 0,
      targetUkeireCount: candidate?.ukeireCount ?? 0,
      completedRequiredSequenceCount: candidate?.completedRequiredSequenceCount ?? 0,
      manProgress: candidate?.manProgress ?? 0,
      pinProgress: candidate?.pinProgress ?? 0,
      souProgress: candidate?.souProgress ?? 0,
      minimumSuitProgress: candidate?.minimumSuitProgress ?? 0,
      extraMeldProgress: candidate?.extraMeldProgress ?? 0,
      pairProgress: candidate?.pairProgress ?? 0,
      remainingMeldSlots: candidate?.remainingMeldSlots ?? 0,
      requiredSequenceSlots: candidate?.requiredSequenceSlots ?? 3,
      openRequiredSequenceCount: candidate?.openRequiredSequenceCount ?? 0,
      openExtraMeldCount: candidate?.openExtraMeldCount ?? melds.length,
      callabilityScore: candidate?.callabilityScore ?? 0,
      targetTenpaiWaitCount: waits.length,
      targetTenpaiLiveCount: waits.reduce((sum, tile) => sum + availableCounts[tileIndex(tile)]!, 0),
      furitenRisk: waits.some((tile) => ownDiscards[tileIndex(tile)]! > 0),
      normalShanten: Number.POSITIVE_INFINITY,
      normalUkeireCount: 0,
    } satisfies SanshokuDiscardEvaluation;
  });
  const targetBest = evaluations.slice().sort(compareSanshokuTarget)[0];
  if (targetBest) {
    for (const evaluation of evaluations) {
      if (compareSanshokuTarget(evaluation, targetBest) !== 0) continue;
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
  return evaluations.sort(compareSanshokuDiscard);
}

export function selectBestSanshokuDiscard(
  counts: Counts34,
  melds: SanshokuMeld[] = [],
  availableCounts = defaultAvailableCounts(counts, melds),
  ownDiscards: Counts34 = Array(34).fill(0),
  lockedSequenceStart: SanshokuSequenceStart | null = null,
): SanshokuDiscardEvaluation | null {
  return analyzeSanshokuDiscards(counts, melds, availableCounts, ownDiscards, lockedSequenceStart)[0] ?? null;
}

export function evaluateSanshokuCallDecision(
  beforeCounts: Counts34,
  beforeMelds: SanshokuMeld[],
  afterCallCounts: Counts34,
  calledMeld: SanshokuMeld,
  availableCounts: Counts34,
  ownDiscards: Counts34 = Array(34).fill(0),
  lockedSequenceStart: SanshokuSequenceStart | null = null,
): SanshokuCallDecision {
  incrementSimulationCounter("callEvaluationCount");
  if (!isSanshokuCompatibleMeld(calledMeld, beforeMelds, lockedSequenceStart)) {
    return noCall("鳴くと三色同順に必要な面子枠が不足します。", lockedSequenceStart);
  }
  const before = evaluateSanshokuProgress(beforeCounts, beforeMelds, availableCounts, lockedSequenceStart);
  const calledSequence = sequenceInfo(calledMeld);
  const lockOptions = new Set<SanshokuSequenceStart | null>([lockedSequenceStart]);
  if (!lockedSequenceStart && calledSequence) lockOptions.add(calledSequence.sequenceStart);
  const outcomes: CallOutcome[] = [];
  for (const proposedLock of lockOptions) {
    if (!isSanshokuCompatibleMeld(calledMeld, beforeMelds, proposedLock)) continue;
    const nextMelds = [...beforeMelds, calledMeld];
    const discard = selectBestSanshokuDiscard(
      afterCallCounts,
      nextMelds,
      availableCounts,
      ownDiscards,
      proposedLock,
    );
    if (!discard) continue;
    const afterDiscard = afterCallCounts.slice();
    afterDiscard[discard.index] -= 1;
    let finalLock = proposedLock;
    let progress = evaluateSanshokuProgress(afterDiscard, nextMelds, availableCounts, finalLock);
    const required = calledSequence != null
      && progress.bestCandidate?.sequenceStart === calledSequence.sequenceStart;
    if (!finalLock && required) {
      finalLock = calledSequence.sequenceStart;
      progress = evaluateSanshokuProgress(afterDiscard, nextMelds, availableCounts, finalLock);
    }
    outcomes.push({
      lock: finalLock,
      required,
      discard,
      progress,
      ukeire: targetUkeireCount(progress),
    });
  }
  const best = outcomes.sort(compareCallOutcome)[0];
  if (!best || !best.progress.isPossible) return noCall("鳴き後に三色同順の完成経路が残りません。", lockedSequenceStart);
  const beforeUkeire = targetUkeireCount(before);
  const improves = best.progress.shanten < before.shanten;
  const broadens = best.progress.shanten === before.shanten && best.ukeire > beforeUkeire;
  const completesRequired = best.required
    && best.progress.bestCandidate != null
    && best.progress.bestCandidate.completedRequiredSequenceCount
      > (before.bestCandidate?.completedRequiredSequenceCount ?? 0)
    && best.ukeire >= beforeUkeire;
  const call = improves || broadens || completesRequired;
  return {
    call,
    reason: call
      ? best.required
        ? `${best.lock ?? best.progress.bestCandidate?.sequenceStart}三色の対象順子が完成し、専用進行が改善します。`
        : "残り1面子として使え、専用向聴数または生きた有効牌が改善します。"
      : "鳴き後の専用向聴数・有効牌・面子枠が改善しないため見送ります。",
    beforeShanten: before.shanten,
    afterShanten: best.progress.shanten,
    beforeUkeireCount: beforeUkeire,
    afterUkeireCount: best.ukeire,
    discardedTile: best.discard.tile,
    requiredSequenceCall: best.required,
    lockedSequenceStart: call ? best.lock : lockedSequenceStart,
  };
}

export function shouldSanshokuRiichi(): false {
  return false;
}

function evaluateSanshokuCandidatesInternal(
  counts: Counts34,
  melds: SanshokuMeld[],
  availableCounts: Counts34,
  lockedSequenceStart: SanshokuSequenceStart | null,
  includeUkeire: boolean,
): SanshokuCandidateEvaluation[] {
  validateCounts(counts);
  validateAvailableCounts(availableCounts);
  return allowedStarts(lockedSequenceStart).map((start) => evaluateCandidate(
    counts,
    melds,
    availableCounts,
    start,
    includeUkeire,
  )).sort(compareCandidate);
}

function evaluateCandidate(
  counts: Counts34,
  melds: SanshokuMeld[],
  availableCounts: Counts34,
  sequenceStart: SanshokuSequenceStart,
  includeUkeire: boolean,
): SanshokuCandidateEvaluation {
  const templates = completionTemplates(melds, sequenceStart);
  const supplied = templates.filter((template) => template.entries.every(
    ([index, needed]) => needed <= counts[index]! + availableCounts[index]!,
  ));
  const possible = supplied.length > 0;
  const bestTemplate = possible ? bestOverlapTemplate(counts, supplied) : null;
  const shanten = bestTemplate
    ? (14 - melds.length * 3) - sparseOverlapCount(counts, bestTemplate) - 1
    : Number.POSITIVE_INFINITY;
  const effectiveIndexes = includeUkeire && possible
    ? effectiveIndexesForCandidate(counts, supplied, availableCounts)
    : [];
  const open = countOpenSanshokuMelds(melds, sequenceStart);
  const progress = SUITS.map((suit) => requiredSuitProgress(counts, melds, suit, sequenceStart));
  return {
    sequenceStart,
    possible,
    shanten,
    ukeireKinds: effectiveIndexes.length,
    ukeireCount: effectiveIndexes.reduce((sum, index) => sum + availableCounts[index]!, 0),
    effectiveTiles: effectiveIndexes.map(tileName),
    completedRequiredSequenceCount: progress.filter((value) => value === 3).length,
    manProgress: progress[0]!,
    pinProgress: progress[1]!,
    souProgress: progress[2]!,
    minimumSuitProgress: Math.min(...progress),
    extraMeldProgress: bestExtraMeldProgress(counts, sequenceStart),
    pairProgress: bestPairProgress(counts),
    remainingMeldSlots: 4 - melds.length,
    requiredSequenceSlots: 3 - open.required,
    openRequiredSequenceCount: open.required,
    openExtraMeldCount: open.extra,
    callabilityScore: callabilityScore(counts, melds, availableCounts, sequenceStart),
  };
}

function completionTemplates(
  melds: SanshokuMeld[],
  sequenceStart: SanshokuSequenceStart,
): CompletionTemplate[] {
  const key = `${sequenceStart}|${meldKey(melds)}`;
  const cached = templateCache.get(key);
  if (cached) return cached;
  const fixed = fixedMeldContext(melds);
  if (!fixed.valid) return cacheTemplates(key, []);
  const requiredSuits = openRequiredSuits(melds, sequenceStart);
  const open = countOpenSanshokuMelds(melds, sequenceStart);
  const missingSuits = SUITS.filter((suit) => !requiredSuits.has(suit));
  const concealedMeldSlots = 4 - melds.length;
  const concealedExtraSlots = 1 - open.extra;
  if (open.extra > 1 || concealedExtraSlots < 0
    || missingSuits.length + concealedExtraSlots !== concealedMeldSlots) {
    return cacheTemplates(key, []);
  }
  const base = Array(34).fill(0) as Counts34;
  for (const suit of missingSuits) addSequence(base, suitBase(suit) + sequenceStart - 1);
  const extraMelds = concealedExtraSlots === 1
    ? allMeldCounts()
    : [Array(34).fill(0) as Counts34];
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
  return cacheTemplates(key, templates);
}

function fixedMeldContext(melds: SanshokuMeld[]): FixedMeldContext {
  const counts = Array(34).fill(0) as Counts34;
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
    for (const index of indexes) {
      counts[index] += 1;
      if (counts[index]! > 4) valid = false;
    }
  }
  return { valid, counts };
}

function sequenceInfo(meld: SanshokuMeld): { suit: SanshokuSuit; sequenceStart: SanshokuSequenceStart } | null {
  if (meld.kind !== "chi") return null;
  const indexes = meld.tiles.map(tileIndex).sort((left, right) => left - right);
  if (indexes.length !== 3 || indexes[0]! >= 27 || indexes[1] !== indexes[0]! + 1
    || indexes[2] !== indexes[0]! + 2 || Math.floor(indexes[0]! / 9) !== Math.floor(indexes[2]! / 9)) return null;
  return { suit: indexSuit(indexes[0]!), sequenceStart: (indexes[0]! % 9 + 1) as SanshokuSequenceStart };
}

function openRequiredSuits(
  melds: SanshokuMeld[],
  sequenceStart: SanshokuSequenceStart,
): Set<SanshokuSuit> {
  const suits = new Set<SanshokuSuit>();
  for (const meld of melds) {
    const info = sequenceInfo(meld);
    if (info?.sequenceStart === sequenceStart) suits.add(info.suit);
  }
  return suits;
}

function effectiveIndexesForCandidate(
  counts: Counts34,
  supplied: CompletionTemplate[],
  availableCounts: Counts34,
): number[] {
  if (!supplied.length) return [];
  const overlap = Math.max(...supplied.map((template) => sparseOverlapCount(counts, template)));
  const indexes = new Set<number>();
  for (const template of supplied) {
    if (sparseOverlapCount(counts, template) !== overlap) continue;
    for (const [index, needed] of template.entries) {
      if (counts[index]! < needed && counts[index]! < 4 && availableCounts[index]! > 0) indexes.add(index);
    }
  }
  return [...indexes].sort((left, right) => left - right);
}

function suppliedTemplates(
  drawn: Counts34,
  melds: SanshokuMeld[],
  availableCounts: Counts34,
  sequenceStart: SanshokuSequenceStart,
  drawIndex: number,
): CompletionTemplate[] {
  return completionTemplates(melds, sequenceStart).filter((template) => template.entries.every(
    ([index, needed]) => needed <= drawn[index]! + availableCounts[index]! - (index === drawIndex ? 1 : 0),
  ));
}

function requiredSuitProgress(
  counts: Counts34,
  melds: SanshokuMeld[],
  suit: SanshokuSuit,
  sequenceStart: SanshokuSequenceStart,
): number {
  if (openRequiredSuits(melds, sequenceStart).has(suit)) return 3;
  const base = suitBase(suit) + sequenceStart - 1;
  return [base, base + 1, base + 2].reduce((sum, index) => sum + Math.min(1, counts[index]!), 0);
}

function callabilityScore(
  counts: Counts34,
  melds: SanshokuMeld[],
  availableCounts: Counts34,
  sequenceStart: SanshokuSequenceStart,
): number {
  return SUITS.reduce((score, suit) => {
    const progress = requiredSuitProgress(counts, melds, suit, sequenceStart);
    if (progress === 3) return score + 3;
    const base = suitBase(suit) + sequenceStart - 1;
    const missingLive = [base, base + 1, base + 2].some(
      (index) => counts[index]! === 0 && availableCounts[index]! > 0,
    );
    return score + (missingLive ? progress : 0);
  }, 0);
}

function bestExtraMeldProgress(counts: Counts34, sequenceStart: SanshokuSequenceStart): number {
  let best = 0;
  for (let index = 0; index < 34; index += 1) best = Math.max(best, Math.min(3, counts[index]!));
  for (let suit = 0; suit < 3; suit += 1) {
    for (let start = 0; start <= 6; start += 1) {
      if (start === sequenceStart - 1) continue;
      best = Math.max(best, [0, 1, 2].reduce(
        (sum, offset) => sum + Math.min(1, counts[suit * 9 + start + offset]!),
        0,
      ));
    }
  }
  return best;
}

function bestPairProgress(counts: Counts34): number {
  return counts.some((count) => count >= 2) ? 2 : counts.some((count) => count === 1) ? 1 : 0;
}

function improvedRequiredSuits(index: number, sequenceStart: SanshokuSequenceStart): SanshokuSuit[] {
  if (index >= 27) return [];
  const rank = index % 9 + 1;
  if (rank < sequenceStart || rank > sequenceStart + 2) return [];
  return [indexSuit(index)];
}

function compareCandidate(left: SanshokuCandidateEvaluation, right: SanshokuCandidateEvaluation): number {
  if (left.possible !== right.possible) return left.possible ? -1 : 1;
  if (left.shanten !== right.shanten) return left.shanten - right.shanten;
  if (left.ukeireCount !== right.ukeireCount) return right.ukeireCount - left.ukeireCount;
  if (left.minimumSuitProgress !== right.minimumSuitProgress) return right.minimumSuitProgress - left.minimumSuitProgress;
  if (left.completedRequiredSequenceCount !== right.completedRequiredSequenceCount) {
    return right.completedRequiredSequenceCount - left.completedRequiredSequenceCount;
  }
  const leftProgress = left.manProgress + left.pinProgress + left.souProgress;
  const rightProgress = right.manProgress + right.pinProgress + right.souProgress;
  if (leftProgress !== rightProgress) return rightProgress - leftProgress;
  if (left.extraMeldProgress !== right.extraMeldProgress) return right.extraMeldProgress - left.extraMeldProgress;
  if (left.pairProgress !== right.pairProgress) return right.pairProgress - left.pairProgress;
  if (left.callabilityScore !== right.callabilityScore) return right.callabilityScore - left.callabilityScore;
  return left.sequenceStart - right.sequenceStart;
}

function compareSanshokuTarget(left: SanshokuDiscardEvaluation, right: SanshokuDiscardEvaluation): number {
  if (left.targetPossible !== right.targetPossible) return left.targetPossible ? -1 : 1;
  if (left.targetShanten !== right.targetShanten) return left.targetShanten - right.targetShanten;
  if (left.furitenRisk !== right.furitenRisk) return left.furitenRisk ? 1 : -1;
  if (left.targetUkeireCount !== right.targetUkeireCount) return right.targetUkeireCount - left.targetUkeireCount;
  if (left.minimumSuitProgress !== right.minimumSuitProgress) return right.minimumSuitProgress - left.minimumSuitProgress;
  if (left.completedRequiredSequenceCount !== right.completedRequiredSequenceCount) {
    return right.completedRequiredSequenceCount - left.completedRequiredSequenceCount;
  }
  const leftProgress = left.manProgress + left.pinProgress + left.souProgress;
  const rightProgress = right.manProgress + right.pinProgress + right.souProgress;
  if (leftProgress !== rightProgress) return rightProgress - leftProgress;
  if (left.extraMeldProgress !== right.extraMeldProgress) return right.extraMeldProgress - left.extraMeldProgress;
  if (left.pairProgress !== right.pairProgress) return right.pairProgress - left.pairProgress;
  if (left.callabilityScore !== right.callabilityScore) return right.callabilityScore - left.callabilityScore;
  return 0;
}

function compareSanshokuDiscard(left: SanshokuDiscardEvaluation, right: SanshokuDiscardEvaluation): number {
  const target = compareSanshokuTarget(left, right);
  if (target !== 0) return target;
  if (left.normalShanten !== right.normalShanten) return left.normalShanten - right.normalShanten;
  if (left.normalUkeireCount !== right.normalUkeireCount) return right.normalUkeireCount - left.normalUkeireCount;
  return left.index - right.index;
}

function compareEffective(left: SanshokuEffectiveTile, right: SanshokuEffectiveTile): number {
  if (left.resultingShanten !== right.resultingShanten) return left.resultingShanten - right.resultingShanten;
  if (left.completesRequiredSequence !== right.completesRequiredSequence) return left.completesRequiredSequence ? -1 : 1;
  return left.bestSequenceStart - right.bestSequenceStart;
}

function compareCallOutcome(left: CallOutcome, right: CallOutcome): number {
  if (left.progress.isPossible !== right.progress.isPossible) return left.progress.isPossible ? -1 : 1;
  if (left.progress.shanten !== right.progress.shanten) return left.progress.shanten - right.progress.shanten;
  if (left.ukeire !== right.ukeire) return right.ukeire - left.ukeire;
  if (left.required !== right.required) return left.required ? -1 : 1;
  return compareSanshokuDiscard(left.discard, right.discard);
}

function targetUkeireCount(progress: SanshokuProgressEvaluation): number {
  if (progress.isTenpai) return progress.waitLiveCount;
  return progress.effectiveTiles.reduce((sum, tile) => sum + tile.remaining, 0);
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
  for (let suit = 0; suit < 3; suit += 1) {
    for (let start = 0; start <= 6; start += 1) {
      const counts = Array(34).fill(0) as Counts34;
      addSequence(counts, suit * 9 + start);
      melds.push(counts);
    }
  }
  for (let index = 0; index < 34; index += 1) {
    const counts = Array(34).fill(0) as Counts34;
    counts[index] = 3;
    melds.push(counts);
  }
  return melds;
}

function normalUkeireCount(counts: Counts34, meldCount: number, available: Counts34, shanten: number): number {
  if (!Number.isFinite(shanten)) return 0;
  let total = 0;
  for (let index = 0; index < 34; index += 1) {
    if (counts[index]! >= 4 || available[index]! <= 0) continue;
    const next = counts.slice();
    next[index] += 1;
    if (normalShantenWithOpenMelds(next, meldCount) < shanten) total += available[index]!;
  }
  return total;
}

function defaultAvailableCounts(counts: Counts34, melds: SanshokuMeld[]): Counts34 {
  const fixed = fixedMeldContext(melds);
  return counts.map((count, index) => Math.max(0, 4 - count - fixed.counts[index]!));
}

function validateAvailableCounts(counts: Counts34): void {
  if (counts.length !== 34 || counts.some((count) => !Number.isInteger(count) || count < 0 || count > 4)) {
    throw new Error("availableCounts must contain 34 values from 0 to 4.");
  }
}

function allowedStarts(locked: SanshokuSequenceStart | null): SanshokuSequenceStart[] {
  return locked == null ? SEQUENCE_STARTS : [locked];
}

function addSequence(counts: Counts34, start: number): void {
  counts[start] += 1;
  counts[start + 1] += 1;
  counts[start + 2] += 1;
}

function suitBase(suit: SanshokuSuit): number {
  return suit === "MAN" ? 0 : suit === "PIN" ? 9 : 18;
}

function indexSuit(index: number): SanshokuSuit {
  return index < 9 ? "MAN" : index < 18 ? "PIN" : "SOU";
}

function sameCounts(left: Counts34, right: Counts34): boolean {
  return left.every((count, index) => count === right[index]);
}

function meldKey(melds: SanshokuMeld[]): string {
  return melds.map((meld) => `${meld.kind}:${meld.tiles.map(tileIndex).sort((a, b) => a - b).join(".")}`).sort().join("|");
}

function cacheTemplates(key: string, templates: CompletionTemplate[]): CompletionTemplate[] {
  templateCache.set(key, templates);
  return templates;
}

function cacheWin(key: string, value: SanshokuWinClassification): SanshokuWinClassification {
  winCache.set(key, value);
  return value;
}

function noneWin(): SanshokuWinClassification {
  return { type: "NONE", sequenceStart: null, sequenceStarts: [] };
}

function noCall(reason: string, lock: SanshokuSequenceStart | null): SanshokuCallDecision {
  return {
    call: false,
    reason,
    beforeShanten: Number.POSITIVE_INFINITY,
    afterShanten: Number.POSITIVE_INFINITY,
    beforeUkeireCount: 0,
    afterUkeireCount: 0,
    discardedTile: null,
    requiredSequenceCall: false,
    lockedSequenceStart: lock,
  };
}

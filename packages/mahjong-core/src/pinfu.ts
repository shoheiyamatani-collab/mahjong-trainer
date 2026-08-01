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

export const PINFU_AI_VERSION = "pinfu-ai-1.0.0";

export type PinfuWind = "EAST" | "SOUTH" | "WEST" | "NORTH";
export type PinfuWaitType = "RYANMEN" | "KANCHAN" | "PENCHAN" | "TANKI" | "SHANPON";

export interface PinfuRoundContext {
  roundWind: PinfuWind;
  seatWind: PinfuWind;
}

export const DEFAULT_PINFU_ROUND_CONTEXT: PinfuRoundContext = {
  roundWind: "EAST",
  seatWind: "SOUTH",
};

export interface PinfuMeld {
  kind: "chi" | "pon";
  tiles: Tile[];
}

export interface PinfuWinClassification {
  type: "PINFU" | "NONE";
  waitTypes: PinfuWaitType[];
  waitType: PinfuWaitType | null;
  pairTile: Tile | null;
  pairType: "SUITED" | "NON_VALUE_WIND" | null;
  winningSequence: Tile[] | null;
}

export interface PinfuWinningTile {
  tile: Tile;
  remaining: number;
  classification: PinfuWinClassification;
}

export interface PinfuEffectiveTile {
  tile: Tile;
  remaining: number;
  resultingShanten: number;
  discards: Tile[];
  reachesIishanten: boolean;
  reachesTenpai: boolean;
  createsSequence: boolean;
  createsRyanmen: boolean;
  createsValidPair: boolean;
}

export interface PinfuPlan {
  possible: boolean;
  shanten: number;
  overlap: number;
  effectiveIndexes: number[];
  discardIndexes: number[];
}

export interface PinfuProgressEvaluation {
  shanten: number;
  isPossible: boolean;
  isIishanten: boolean;
  isTenpai: boolean;
  winningTiles: Tile[];
  winningTileDetails: PinfuWinningTile[];
  effectiveTiles: PinfuEffectiveTile[];
  waitKindCount: number;
  waitLiveCount: number;
  completedSequenceCount: number;
  ryanmenTaatsuCount: number;
  kanchanTaatsuCount: number;
  penchanTaatsuCount: number;
  validPairCandidateCount: number;
  valuePairCount: number;
  tripletCount: number;
}

export interface PinfuDiscardEvaluation {
  index: number;
  tile: Tile;
  targetPossible: boolean;
  targetShanten: number;
  targetUkeireKinds: number;
  targetUkeireCount: number;
  completedSequenceCount: number;
  ryanmenTaatsuCount: number;
  validPairCandidateCount: number;
  valuePairCount: number;
  tripletCount: number;
  furitenRisk: boolean;
  normalShanten: number;
  normalUkeireCount: number;
}

interface Group {
  kind: "sequence" | "triplet";
  indexes: [number, number, number];
}

interface StandardDecomposition {
  pairIndex: number;
  groups: Group[];
}

interface SuitOption {
  needed: number[];
  sequences: number;
  taatsu: 0 | 1;
  pair: 0 | 1;
  waitOffsets: number[];
}

interface RegionChoice {
  overlap: number;
  missing: Set<number>;
  excess: Set<number>;
}

interface CombinedChoice extends RegionChoice {
  sequences: number;
  taatsu: number;
  pair: number;
}

const WIND_INDEX: Record<PinfuWind, number> = {
  EAST: 27,
  SOUTH: 28,
  WEST: 29,
  NORTH: 30,
};

const suitOptions = buildSuitOptions();
const planCache = new LruCache<string, PinfuPlan>(20_000);
const progressCache = new LruCache<string, PinfuProgressEvaluation>(20_000);

export function classifySequenceWait(sequenceStart: number, winningIndex: number): PinfuWaitType {
  if (winningIndex === sequenceStart + 1) return "KANCHAN";
  const rank = sequenceStart % 9;
  if ((rank === 0 && winningIndex === sequenceStart + 2)
    || (rank === 6 && winningIndex === sequenceStart)) return "PENCHAN";
  return "RYANMEN";
}

export function classifyPinfuWin(
  preWinCounts: Counts34,
  winningTile: Tile,
  melds: PinfuMeld[] = [],
  context: PinfuRoundContext = DEFAULT_PINFU_ROUND_CONTEXT,
): PinfuWinClassification {
  validateCounts(preWinCounts);
  const none = (waitTypes: PinfuWaitType[] = []): PinfuWinClassification => ({
    type: "NONE",
    waitTypes,
    waitType: waitTypes.length === 1 ? waitTypes[0]! : null,
    pairTile: null,
    pairType: null,
    winningSequence: null,
  });
  if (melds.length > 0 || sumCounts(preWinCounts) !== 13) return none();
  const winningIndex = tileIndex(winningTile);
  if (preWinCounts[winningIndex]! >= 4) return none();
  const completed = preWinCounts.slice();
  completed[winningIndex] += 1;
  const decompositions = decomposeStandardHand(completed);
  const allWaitTypes = new Set<PinfuWaitType>();

  for (const decomposition of decompositions) {
    if (decomposition.pairIndex === winningIndex) allWaitTypes.add("TANKI");
    for (const group of decomposition.groups) {
      if (!group.indexes.includes(winningIndex)) continue;
      allWaitTypes.add(group.kind === "triplet"
        ? "SHANPON"
        : classifySequenceWait(group.indexes[0], winningIndex));
    }
    if (!isValidPinfuPair(decomposition.pairIndex, context)) continue;
    if (decomposition.groups.some((group) => group.kind !== "sequence")) continue;
    const winningSequence = decomposition.groups.find((group) =>
      group.indexes.includes(winningIndex)
      && classifySequenceWait(group.indexes[0], winningIndex) === "RYANMEN");
    if (!winningSequence) continue;
    const pairType = decomposition.pairIndex < 27 ? "SUITED" : "NON_VALUE_WIND";
    return {
      type: "PINFU",
      waitTypes: [...new Set<PinfuWaitType>([...allWaitTypes, "RYANMEN"])],
      waitType: "RYANMEN",
      pairTile: tileName(decomposition.pairIndex),
      pairType,
      winningSequence: winningSequence.indexes.map(tileName),
    };
  }
  return none([...allWaitTypes]);
}

export function isPinfuComplete(
  preWinCounts: Counts34,
  winningTile: Tile,
  melds: PinfuMeld[] = [],
  context: PinfuRoundContext = DEFAULT_PINFU_ROUND_CONTEXT,
): boolean {
  return classifyPinfuWin(preWinCounts, winningTile, melds, context).type === "PINFU";
}

export function evaluatePinfuPlan(
  counts: Counts34,
  melds: PinfuMeld[] = [],
  availableCounts = defaultAvailableCounts(counts),
  context: PinfuRoundContext = DEFAULT_PINFU_ROUND_CONTEXT,
): PinfuPlan {
  validateCounts(counts);
  validateAvailableCounts(availableCounts);
  const total = sumCounts(counts);
  const key = `${context.roundWind}:${context.seatWind}|${counts.join(",")}|${availableCounts.join(",")}|${meldKey(melds)}`;
  const cached = planCache.get(key);
  if (cached) return cached;
  if (melds.length > 0 || total < 0 || total > 14) return cachePlan(key, impossiblePlan());

  const regionChoices: Array<Map<string, RegionChoice>> = [];
  for (let suit = 0; suit < 3; suit += 1) {
    regionChoices.push(evaluateSuitRegion(counts, availableCounts, suit));
  }
  regionChoices.push(evaluateHonorRegion(counts, availableCounts, context));

  let states = new Map<string, CombinedChoice>();
  states.set("0|0|0", {
    overlap: 0,
    missing: new Set(),
    excess: new Set(),
    sequences: 0,
    taatsu: 0,
    pair: 0,
  });
  for (const region of regionChoices) {
    const next = new Map<string, CombinedChoice>();
    for (const state of states.values()) {
      for (const [signature, choice] of region) {
        const [sequences, taatsu, pair] = signature.split("|").map(Number);
        const combined: CombinedChoice = {
          overlap: state.overlap + choice.overlap,
          missing: unionSets(state.missing, choice.missing),
          excess: unionSets(state.excess, choice.excess),
          sequences: state.sequences + sequences!,
          taatsu: state.taatsu + taatsu!,
          pair: state.pair + pair!,
        };
        if (combined.sequences > 3 || combined.taatsu > 1 || combined.pair > 1) continue;
        const combinedKey = `${combined.sequences}|${combined.taatsu}|${combined.pair}`;
        mergeChoice(next, combinedKey, combined);
      }
    }
    states = next;
  }

  const best = states.get("3|1|1");
  if (!best) return cachePlan(key, impossiblePlan());
  return cachePlan(key, {
    possible: true,
    shanten: 13 - best.overlap,
    overlap: best.overlap,
    effectiveIndexes: [...best.missing].sort((left, right) => left - right),
    discardIndexes: [...best.excess].sort((left, right) => left - right),
  });
}

export function pinfuShanten(
  counts: Counts34,
  melds: PinfuMeld[] = [],
  availableCounts = defaultAvailableCounts(counts),
  context: PinfuRoundContext = DEFAULT_PINFU_ROUND_CONTEXT,
): number {
  return evaluatePinfuPlan(counts, melds, availableCounts, context).shanten;
}

export function pinfuWinningTileDetails(
  counts: Counts34,
  melds: PinfuMeld[] = [],
  availableCounts = defaultAvailableCounts(counts),
  context: PinfuRoundContext = DEFAULT_PINFU_ROUND_CONTEXT,
): PinfuWinningTile[] {
  validateCounts(counts);
  validateAvailableCounts(availableCounts);
  if (melds.length > 0 || sumCounts(counts) !== 13) return [];
  const result: PinfuWinningTile[] = [];
  for (let index = 0; index < 34; index += 1) {
    if (counts[index]! >= 4 || availableCounts[index]! <= 0) continue;
    const classification = classifyPinfuWin(counts, tileName(index), melds, context);
    if (classification.type === "PINFU") {
      result.push({ tile: tileName(index), remaining: availableCounts[index]!, classification });
    }
  }
  return result;
}

export function pinfuWinningTiles(
  counts: Counts34,
  melds: PinfuMeld[] = [],
  availableCounts = defaultAvailableCounts(counts),
  context: PinfuRoundContext = DEFAULT_PINFU_ROUND_CONTEXT,
): Tile[] {
  incrementSimulationCounter("waitCalculationCount");
  return pinfuWinningTileDetails(counts, melds, availableCounts, context).map((item) => item.tile);
}

export function evaluatePinfuProgress(
  counts: Counts34,
  melds: PinfuMeld[] = [],
  availableCounts = defaultAvailableCounts(counts),
  context: PinfuRoundContext = DEFAULT_PINFU_ROUND_CONTEXT,
): PinfuProgressEvaluation {
  validateCounts(counts);
  validateAvailableCounts(availableCounts);
  const key = `${context.roundWind}:${context.seatWind}|${counts.join(",")}|${availableCounts.join(",")}|${meldKey(melds)}`;
  const cached = progressCache.get(key);
  if (cached) return cached;
  incrementSimulationCounter("targetShantenCalculationCount");
  const plan = evaluatePinfuPlan(counts, melds, availableCounts, context);
  const winningTileDetails = plan.shanten === 0
    ? pinfuWinningTileDetails(counts, melds, availableCounts, context)
    : [];
  const effectiveTiles = plan.shanten > 0
    ? plan.effectiveIndexes
      .filter((index) => counts[index]! < 4 && availableCounts[index]! > 0)
      .map((index) => ({
        tile: tileName(index),
        remaining: availableCounts[index]!,
        resultingShanten: plan.shanten - 1,
        discards: [],
        reachesIishanten: plan.shanten - 1 === 1,
        reachesTenpai: plan.shanten - 1 === 0,
        createsSequence: completesSequence(counts, index),
        createsRyanmen: createsRyanmenTaatsu(counts, index),
        createsValidPair: counts[index] === 1 && isValidPinfuPair(index, context),
      }))
    : [];
  const traits = classifyShape(counts, context);
  const evaluation: PinfuProgressEvaluation = {
    shanten: plan.shanten,
    isPossible: plan.possible,
    isIishanten: plan.shanten === 1 && effectiveTiles.some((item) => item.reachesTenpai),
    isTenpai: plan.shanten === 0 && winningTileDetails.length > 0,
    winningTiles: winningTileDetails.map((item) => item.tile),
    winningTileDetails,
    effectiveTiles,
    waitKindCount: winningTileDetails.length,
    waitLiveCount: winningTileDetails.reduce((sum, item) => sum + item.remaining, 0),
    ...traits,
  };
  progressCache.set(key, evaluation);
  return evaluation;
}

export function analyzePinfuDiscards(
  counts: Counts34,
  melds: PinfuMeld[] = [],
  availableCounts = defaultAvailableCounts(counts),
  ownDiscards?: Counts34,
  context: PinfuRoundContext = DEFAULT_PINFU_ROUND_CONTEXT,
): PinfuDiscardEvaluation[] {
  incrementSimulationCounter("discardEvaluationCount");
  validateCounts(counts);
  validateAvailableCounts(availableCounts);
  if (ownDiscards) validateCounts(ownDiscards);
  return evaluateDiscardIndexes(
    counts,
    counts.flatMap((count, index) => count > 0 ? [index] : []),
    melds,
    availableCounts,
    ownDiscards,
    context,
  ).sort(comparePinfuDiscards);
}

function evaluateDiscardIndexes(
  counts: Counts34,
  indexes: number[],
  melds: PinfuMeld[],
  availableCounts: Counts34,
  ownDiscards: Counts34 | undefined,
  context: PinfuRoundContext,
): PinfuDiscardEvaluation[] {
  const evaluations: PinfuDiscardEvaluation[] = [];
  for (const index of indexes) {
    if (index < 0 || index >= 34 || counts[index]! <= 0) continue;
    const after = counts.slice();
    after[index] -= 1;
    const progress = evaluatePinfuProgress(after, melds, availableCounts, context);
    const targetTiles = progress.isTenpai
      ? progress.winningTileDetails.map((item) => ({ index: tileIndex(item.tile), remaining: item.remaining }))
      : progress.effectiveTiles.map((item) => ({ index: tileIndex(item.tile), remaining: item.remaining }));
    const normalShanten = normalShantenWithOpenMelds(after, melds.length);
    evaluations.push({
      index,
      tile: tileName(index),
      targetPossible: progress.isPossible,
      targetShanten: progress.shanten,
      targetUkeireKinds: targetTiles.length,
      targetUkeireCount: targetTiles.reduce((sum, item) => sum + item.remaining, 0),
      completedSequenceCount: progress.completedSequenceCount,
      ryanmenTaatsuCount: progress.ryanmenTaatsuCount,
      validPairCandidateCount: progress.validPairCandidateCount,
      valuePairCount: progress.valuePairCount,
      tripletCount: progress.tripletCount,
      furitenRisk: targetTiles.some((item) => (ownDiscards?.[item.index] ?? 0) > 0),
      normalShanten,
      normalUkeireCount: normalUkeireCount(after, availableCounts, normalShanten),
    });
  }
  return evaluations;
}

export function selectBestPinfuDiscard(
  counts: Counts34,
  melds: PinfuMeld[] = [],
  availableCounts = defaultAvailableCounts(counts),
  ownDiscards?: Counts34,
  context: PinfuRoundContext = DEFAULT_PINFU_ROUND_CONTEXT,
): PinfuDiscardEvaluation {
  const plan = evaluatePinfuPlan(counts, melds, availableCounts, context);
  const candidateIndexes = plan.discardIndexes.filter((index) => counts[index]! > 0);
  const evaluations = evaluateDiscardIndexes(
    counts,
    candidateIndexes.length > 0 ? candidateIndexes : counts.flatMap((count, index) => count > 0 ? [index] : []),
    melds,
    availableCounts,
    ownDiscards,
    context,
  );
  const best = evaluations.sort(comparePinfuDiscards)[0];
  if (!best) throw new Error("A discard cannot be selected from an empty hand.");
  return best;
}

export function shouldPinfuChi(): boolean {
  return false;
}

export function shouldPinfuPon(): boolean {
  return false;
}

export function shouldPinfuKan(): boolean {
  return false;
}

export function shouldPinfuRiichi(): boolean {
  return false;
}

function comparePinfuDiscards(left: PinfuDiscardEvaluation, right: PinfuDiscardEvaluation): number {
  if (left.targetPossible !== right.targetPossible) return left.targetPossible ? -1 : 1;
  if (left.targetShanten !== right.targetShanten) return left.targetShanten - right.targetShanten;
  if (left.furitenRisk !== right.furitenRisk) return left.furitenRisk ? 1 : -1;
  if (left.targetUkeireCount !== right.targetUkeireCount) return right.targetUkeireCount - left.targetUkeireCount;
  if (left.targetUkeireKinds !== right.targetUkeireKinds) return right.targetUkeireKinds - left.targetUkeireKinds;
  if (left.ryanmenTaatsuCount !== right.ryanmenTaatsuCount) return right.ryanmenTaatsuCount - left.ryanmenTaatsuCount;
  if (left.completedSequenceCount !== right.completedSequenceCount) return right.completedSequenceCount - left.completedSequenceCount;
  if (left.validPairCandidateCount !== right.validPairCandidateCount) return right.validPairCandidateCount - left.validPairCandidateCount;
  if (left.valuePairCount !== right.valuePairCount) return left.valuePairCount - right.valuePairCount;
  if (left.tripletCount !== right.tripletCount) return left.tripletCount - right.tripletCount;
  if (left.normalShanten !== right.normalShanten) return left.normalShanten - right.normalShanten;
  if (left.normalUkeireCount !== right.normalUkeireCount) return right.normalUkeireCount - left.normalUkeireCount;
  return left.index - right.index;
}

function evaluateSuitRegion(counts: Counts34, availableCounts: Counts34, suit: number): Map<string, RegionChoice> {
  const base = suit * 9;
  const current = counts.slice(base, base + 9);
  const supply = current.map((count, rank) => count + availableCounts[base + rank]!);
  const key = `${current.join("")}|${supply.join("")}`;
  const cache = suitRegionCache[suit]!.get(key);
  if (cache) return cache;
  const choices = new Map<string, RegionChoice>();
  for (const option of suitOptions) {
    if (option.needed.some((needed, rank) => needed > supply[rank]!)) continue;
    if (option.taatsu && !option.waitOffsets.some((rank) => option.needed[rank]! + 1 <= supply[rank]!)) continue;
    const overlap = option.needed.reduce((sum, needed, rank) => sum + Math.min(needed, current[rank]!), 0);
    const missing = new Set<number>();
    const excess = new Set<number>();
    option.needed.forEach((needed, rank) => {
      if (needed > current[rank]!) missing.add(base + rank);
      if (current[rank]! > needed) excess.add(base + rank);
    });
    mergeChoice(choices, `${option.sequences}|${option.taatsu}|${option.pair}`, { overlap, missing, excess });
  }
  suitRegionCache[suit]!.set(key, choices);
  return choices;
}

const suitRegionCache = [new Map<string, Map<string, RegionChoice>>(), new Map(), new Map()];

function evaluateHonorRegion(
  counts: Counts34,
  availableCounts: Counts34,
  context: PinfuRoundContext,
): Map<string, RegionChoice> {
  const choices = new Map<string, RegionChoice>();
  choices.set("0|0|0", {
    overlap: 0,
    missing: new Set(),
    excess: new Set(counts.flatMap((count, index) => index >= 27 && count > 0 ? [index] : [])),
  });
  for (let index = 27; index <= 30; index += 1) {
    if (!isValidPinfuPair(index, context) || counts[index]! + availableCounts[index]! < 2) continue;
    mergeChoice(choices, "0|0|1", {
      overlap: Math.min(2, counts[index]!),
      missing: counts[index]! >= 2 ? new Set() : new Set([index]),
      excess: new Set(counts.flatMap((count, candidateIndex) =>
        candidateIndex >= 27 && count > (candidateIndex === index ? 2 : 0) ? [candidateIndex] : [])),
    });
  }
  return choices;
}

function buildSuitOptions(): SuitOption[] {
  const sequencePatterns: Array<{ needed: number[]; count: number }> = [];
  const recurse = (minimumStart: number, remaining: number, needed: number[], count: number) => {
    sequencePatterns.push({ needed: needed.slice(), count });
    if (remaining === 0) return;
    for (let start = minimumStart; start <= 6; start += 1) {
      const next = needed.slice();
      next[start] += 1;
      next[start + 1] += 1;
      next[start + 2] += 1;
      if (next.some((value) => value > 4)) continue;
      recurse(start, remaining - 1, next, count + 1);
    }
  };
  recurse(0, 3, Array(9).fill(0), 0);
  const uniqueSequences = new Map<string, { needed: number[]; count: number }>();
  for (const pattern of sequencePatterns) uniqueSequences.set(`${pattern.count}|${pattern.needed.join("")}`, pattern);

  const options: SuitOption[] = [];
  for (const pattern of uniqueSequences.values()) {
    for (let taatsuStart = -1; taatsuStart <= 6; taatsuStart += 1) {
      if (taatsuStart === 0) continue;
      for (let pairRank = -1; pairRank <= 8; pairRank += 1) {
        const needed = pattern.needed.slice();
        const hasTaatsu = taatsuStart >= 1;
        if (hasTaatsu) {
          needed[taatsuStart] += 1;
          needed[taatsuStart + 1] += 1;
        }
        if (pairRank >= 0) needed[pairRank] += 2;
        if (needed.some((value) => value > 4)) continue;
        options.push({
          needed,
          sequences: pattern.count,
          taatsu: hasTaatsu ? 1 : 0,
          pair: pairRank >= 0 ? 1 : 0,
          waitOffsets: hasTaatsu ? [taatsuStart - 1, taatsuStart + 2] : [],
        });
      }
    }
  }
  return options;
}

function mergeChoice<T extends RegionChoice>(map: Map<string, T>, key: string, candidate: T): void {
  const current = map.get(key);
  if (!current || candidate.overlap > current.overlap) {
    map.set(key, candidate);
    return;
  }
  if (candidate.overlap === current.overlap) {
    current.missing = unionSets(current.missing, candidate.missing);
    current.excess = unionSets(current.excess, candidate.excess);
  }
}

function decomposeStandardHand(counts: Counts34): StandardDecomposition[] {
  if (sumCounts(counts) !== 14) return [];
  const results: StandardDecomposition[] = [];
  for (let pairIndex = 0; pairIndex < 34; pairIndex += 1) {
    if (counts[pairIndex]! < 2) continue;
    const rest = counts.slice();
    rest[pairIndex] -= 2;
    for (const groups of decomposeGroups(rest)) {
      if (groups.length === 4) results.push({ pairIndex, groups });
    }
  }
  return results;
}

function decomposeGroups(counts: Counts34): Group[][] {
  const first = counts.findIndex((count) => count > 0);
  if (first < 0) return [[]];
  const results: Group[][] = [];
  if (counts[first]! >= 3) {
    const next = counts.slice();
    next[first] -= 3;
    for (const rest of decomposeGroups(next)) {
      results.push([{ kind: "triplet", indexes: [first, first, first] }, ...rest]);
    }
  }
  if (first < 27 && first % 9 <= 6 && counts[first + 1]! > 0 && counts[first + 2]! > 0) {
    const next = counts.slice();
    next[first] -= 1;
    next[first + 1] -= 1;
    next[first + 2] -= 1;
    for (const rest of decomposeGroups(next)) {
      results.push([{ kind: "sequence", indexes: [first, first + 1, first + 2] }, ...rest]);
    }
  }
  return results;
}

function classifyShape(
  counts: Counts34,
  context: PinfuRoundContext,
): Omit<PinfuProgressEvaluation,
  "shanten" | "isPossible" | "isIishanten" | "isTenpai" | "winningTiles" |
  "winningTileDetails" | "effectiveTiles" | "waitKindCount" | "waitLiveCount"> {
  let ryanmenTaatsuCount = 0;
  let kanchanTaatsuCount = 0;
  let penchanTaatsuCount = 0;
  for (let suit = 0; suit < 3; suit += 1) {
    const base = suit * 9;
    for (let start = 0; start <= 7; start += 1) {
      if (counts[base + start]! > 0 && counts[base + start + 1]! > 0) {
        if (start === 0 || start === 7) penchanTaatsuCount += 1;
        else ryanmenTaatsuCount += 1;
      }
    }
    for (let start = 0; start <= 6; start += 1) {
      if (counts[base + start]! > 0 && counts[base + start + 2]! > 0) kanchanTaatsuCount += 1;
    }
  }
  let validPairCandidateCount = 0;
  let valuePairCount = 0;
  let tripletCount = 0;
  counts.forEach((count, index) => {
    if (count >= 2) {
      if (isValidPinfuPair(index, context)) validPairCandidateCount += 1;
      else valuePairCount += 1;
    }
    if (count >= 3) tripletCount += 1;
  });
  return {
    completedSequenceCount: maximumCompletedSequences(counts),
    ryanmenTaatsuCount,
    kanchanTaatsuCount,
    penchanTaatsuCount,
    validPairCandidateCount,
    valuePairCount,
    tripletCount,
  };
}

function maximumCompletedSequences(counts: Counts34): number {
  let total = 0;
  for (let suit = 0; suit < 3; suit += 1) {
    const local = counts.slice(suit * 9, suit * 9 + 9);
    const memo = new Map<string, number>();
    const search = (state: number[]): number => {
      const key = state.join("");
      const cached = memo.get(key);
      if (cached != null) return cached;
      let best = 0;
      for (let start = 0; start <= 6; start += 1) {
        if (state[start]! <= 0 || state[start + 1]! <= 0 || state[start + 2]! <= 0) continue;
        const next = state.slice();
        next[start] -= 1;
        next[start + 1] -= 1;
        next[start + 2] -= 1;
        best = Math.max(best, 1 + search(next));
      }
      memo.set(key, best);
      return best;
    };
    total += search(local);
  }
  return total;
}

function completesSequence(counts: Counts34, index: number): boolean {
  if (index >= 27) return false;
  const rank = index % 9;
  const base = index - rank;
  for (let start = Math.max(0, rank - 2); start <= Math.min(6, rank); start += 1) {
    const indexes = [base + start, base + start + 1, base + start + 2];
    if (indexes.every((value) => value === index || counts[value]! > 0)) return true;
  }
  return false;
}

function createsRyanmenTaatsu(counts: Counts34, index: number): boolean {
  if (index >= 27) return false;
  const rank = index % 9;
  const base = index - rank;
  return (rank >= 1 && counts[base + rank - 1]! > 0)
    || (rank <= 6 && counts[base + rank + 1]! > 0);
}

function isValidPinfuPair(index: number, context: PinfuRoundContext): boolean {
  if (index < 27) return true;
  if (index >= 31) return false;
  return index !== WIND_INDEX[context.roundWind] && index !== WIND_INDEX[context.seatWind];
}

function normalUkeireCount(counts: Counts34, availableCounts: Counts34, shanten: number): number {
  if (!Number.isFinite(shanten)) return 0;
  let total = 0;
  for (let index = 0; index < 34; index += 1) {
    if (counts[index]! >= 4 || availableCounts[index]! <= 0) continue;
    const next = counts.slice();
    next[index] += 1;
    if (normalShantenWithOpenMelds(next, 0) < shanten) total += availableCounts[index]!;
  }
  return total;
}

function defaultAvailableCounts(counts: Counts34): Counts34 {
  return counts.map((count) => Math.max(0, 4 - count));
}

function validateAvailableCounts(counts: Counts34): void {
  if (counts.length !== 34 || counts.some((count) => !Number.isInteger(count) || count < 0 || count > 4)) {
    throw new Error("availableCounts must contain 34 values from 0 to 4.");
  }
}

function meldKey(melds: PinfuMeld[]): string {
  return melds.map((meld) => `${meld.kind}:${meld.tiles.map(tileIndex).join(".")}`).join(";");
}

function impossiblePlan(): PinfuPlan {
  return {
    possible: false,
    shanten: Number.POSITIVE_INFINITY,
    overlap: Number.NEGATIVE_INFINITY,
    effectiveIndexes: [],
    discardIndexes: [],
  };
}

function cachePlan(key: string, plan: PinfuPlan): PinfuPlan {
  planCache.set(key, plan);
  return plan;
}

function unionSets(left: Set<number>, right: Set<number>): Set<number> {
  return new Set([...left, ...right]);
}

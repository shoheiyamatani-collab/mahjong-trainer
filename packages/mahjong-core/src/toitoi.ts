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

export const TOITOI_AI_VERSION = "toitoi-ai-1.0.0";

export interface ToitoiMeld {
  kind: "chi" | "pon";
  tiles: Tile[];
}

export type ToitoiWaitType = "SHANPON" | "TANKI";

export interface ToitoiPlan {
  possible: boolean;
  shanten: number;
  overlap: number;
  tripletIndexes: number[];
  pairIndex: number | null;
}

export interface ToitoiWinningTile {
  tile: Tile;
  remaining: number;
  waitType: ToitoiWaitType;
}

export interface ToitoiEffectiveTile {
  tile: Tile;
  remaining: number;
  resultingShanten: number;
  discards: Tile[];
  completesPair: boolean;
  completesTriplet: boolean;
  increasesHeadCandidates: boolean;
  reachesTenpai: boolean;
  completes: boolean;
}

export interface ToitoiProgressEvaluation {
  shanten: number;
  isPossible: boolean;
  isIishanten: boolean;
  isTenpai: boolean;
  winningTiles: Tile[];
  winningTileDetails: ToitoiWinningTile[];
  effectiveTiles: ToitoiEffectiveTile[];
  waitType: ToitoiWaitType | null;
  waitLiveCount: number;
  completedTripletCount: number;
  openTripletCount: number;
  pairKindCount: number;
  promotablePairCount: number;
  headCandidateCount: number;
  liveSingletonCount: number;
  excessFourthTileCount: number;
}

export interface ToitoiDiscardEvaluation {
  index: number;
  tile: Tile;
  targetPossible: boolean;
  targetShanten: number;
  completedTripletCount: number;
  openTripletCount: number;
  pairKindCount: number;
  promotablePairCount: number;
  headCandidateCount: number;
  targetUkeireKinds: number;
  targetUkeireCount: number;
  liveSingletonCount: number;
  excessFourthTileCount: number;
  shanponWaitPotential: number;
  tankiWaitPotential: number;
  furitenRisk: boolean;
  normalShanten: number;
  normalUkeireCount: number;
}

export interface ToitoiPonDecision {
  call: boolean;
  reason: string;
  beforeShanten: number;
  afterShanten: number;
  beforeUkeireCount: number;
  afterUkeireCount: number;
  discardIndex: number | null;
  discardTile: Tile | null;
}

interface FixedMeldContext {
  valid: boolean;
  counts: Counts34;
  tripletIndexes: Set<number>;
}

interface PlanSearchResult {
  overlap: number;
  tripletIndexes: number[];
  pairIndex: number | null;
}

const planCache = new LruCache<string, ToitoiPlan>(20_000);
const winningCache = new LruCache<string, ToitoiWinningTile[]>(10_000);
const progressCache = new LruCache<string, ToitoiProgressEvaluation>(20_000);

export function isToitoiComplete(counts: Counts34, melds: ToitoiMeld[] = []): boolean {
  validateCounts(counts);
  const fixed = fixedMeldContext(melds);
  if (!fixed.valid || sumCounts(counts) !== 14 - melds.length * 3) return false;
  return evaluateToitoiPlan(counts, melds).shanten === -1;
}

export function toitoiShanten(
  counts: Counts34,
  melds: ToitoiMeld[] = [],
  availableCounts = defaultAvailableCounts(counts, melds),
): number {
  return evaluateToitoiPlan(counts, melds, availableCounts).shanten;
}

export function evaluateToitoiPlan(
  counts: Counts34,
  melds: ToitoiMeld[] = [],
  availableCounts = defaultAvailableCounts(counts, melds),
): ToitoiPlan {
  validateCounts(counts);
  validateAvailableCounts(availableCounts);
  const fixed = fixedMeldContext(melds);
  const concealedTarget = 14 - melds.length * 3;
  const concealedTotal = sumCounts(counts);
  const key = `${meldKey(melds)}|${counts.join(",")}|${availableCounts.join(",")}`;
  const cached = planCache.get(key);
  if (cached) return cached;

  if (!fixed.valid || concealedTotal < concealedTarget - 1 || concealedTotal > concealedTarget) {
    return cachePlan(key, impossiblePlan());
  }

  const neededTriplets = 4 - melds.length;
  const memo = new Map<string, PlanSearchResult | null>();
  const search = (index: number, tripletsLeft: number, pairLeft: number): PlanSearchResult | null => {
    if (tripletsLeft < 0 || pairLeft < 0) return null;
    if (index === 34) {
      return tripletsLeft === 0 && pairLeft === 0
        ? { overlap: 0, tripletIndexes: [], pairIndex: null }
        : null;
    }
    if (34 - index < tripletsLeft + pairLeft) return null;
    const memoKey = `${index}|${tripletsLeft}|${pairLeft}`;
    if (memo.has(memoKey)) return memo.get(memoKey) ?? null;

    let best = search(index + 1, tripletsLeft, pairLeft);
    if (!fixed.tripletIndexes.has(index)) {
      const supply = counts[index]! + availableCounts[index]!;
      if (tripletsLeft > 0 && supply >= 3) {
        const rest = search(index + 1, tripletsLeft - 1, pairLeft);
        if (rest) {
          best = betterPlan(best, {
            overlap: rest.overlap + Math.min(3, counts[index]!),
            tripletIndexes: [index, ...rest.tripletIndexes],
            pairIndex: rest.pairIndex,
          });
        }
      }
      if (pairLeft > 0 && supply >= 2) {
        const rest = search(index + 1, tripletsLeft, pairLeft - 1);
        if (rest) {
          best = betterPlan(best, {
            overlap: rest.overlap + Math.min(2, counts[index]!),
            tripletIndexes: rest.tripletIndexes,
            pairIndex: index,
          });
        }
      }
    }
    memo.set(memoKey, best);
    return best;
  };

  const best = search(0, neededTriplets, 1);
  if (!best) return cachePlan(key, impossiblePlan());
  return cachePlan(key, {
    possible: true,
    shanten: concealedTarget - best.overlap - 1,
    overlap: best.overlap,
    tripletIndexes: [...fixed.tripletIndexes, ...best.tripletIndexes].sort((a, b) => a - b),
    pairIndex: best.pairIndex,
  });
}

export function toitoiWinningTileDetails(
  counts: Counts34,
  melds: ToitoiMeld[] = [],
  availableCounts = defaultAvailableCounts(counts, melds),
): ToitoiWinningTile[] {
  validateCounts(counts);
  validateAvailableCounts(availableCounts);
  const key = `${meldKey(melds)}|${counts.join(",")}|${availableCounts.join(",")}`;
  const cached = winningCache.get(key);
  if (cached) return cached;
  const winning: ToitoiWinningTile[] = [];
  for (let index = 0; index < 34; index += 1) {
    if (counts[index]! >= 4 || availableCounts[index]! <= 0) continue;
    const next = counts.slice();
    next[index] += 1;
    if (!isToitoiComplete(next, melds)) continue;
    const waitType: ToitoiWaitType = counts[index] === 1 ? "TANKI" : "SHANPON";
    winning.push({ tile: tileName(index), remaining: availableCounts[index]!, waitType });
  }
  winningCache.set(key, winning);
  return winning;
}

export function toitoiWinningTiles(
  counts: Counts34,
  melds: ToitoiMeld[] = [],
  availableCounts = defaultAvailableCounts(counts, melds),
): Tile[] {
  incrementSimulationCounter("waitCalculationCount");
  return toitoiWinningTileDetails(counts, melds, availableCounts).map((item) => item.tile);
}

export function toitoiEffectiveTiles(
  counts: Counts34,
  melds: ToitoiMeld[] = [],
  availableCounts = defaultAvailableCounts(counts, melds),
  currentShanten = toitoiShanten(counts, melds, availableCounts),
): ToitoiEffectiveTile[] {
  validateCounts(counts);
  validateAvailableCounts(availableCounts);
  if (!Number.isFinite(currentShanten) || currentShanten <= 0) return [];
  const effective: ToitoiEffectiveTile[] = [];

  for (let drawIndex = 0; drawIndex < 34; drawIndex += 1) {
    if (counts[drawIndex]! >= 4 || availableCounts[drawIndex]! <= 0) continue;
    const drawn = counts.slice();
    drawn[drawIndex] += 1;
    const remaining = availableCounts.slice();
    remaining[drawIndex] -= 1;

    if (isToitoiComplete(drawn, melds)) {
      effective.push({
        tile: tileName(drawIndex),
        remaining: availableCounts[drawIndex]!,
        resultingShanten: -1,
        discards: [],
        completesPair: counts[drawIndex] === 1,
        completesTriplet: counts[drawIndex] === 2,
        increasesHeadCandidates: counts[drawIndex] === 1,
        reachesTenpai: false,
        completes: true,
      });
      continue;
    }

    let bestShanten = Number.POSITIVE_INFINITY;
    const discards: Tile[] = [];
    for (let discardIndex = 0; discardIndex < 34; discardIndex += 1) {
      if (drawn[discardIndex]! <= 0) continue;
      const after = drawn.slice();
      after[discardIndex] -= 1;
      const shanten = toitoiShanten(after, melds, remaining);
      if (!Number.isFinite(shanten)) continue;
      if (shanten === 0 && toitoiWinningTiles(after, melds, remaining).length === 0) continue;
      if (shanten < bestShanten) {
        bestShanten = shanten;
        discards.length = 0;
        discards.push(tileName(discardIndex));
      } else if (shanten === bestShanten) {
        discards.push(tileName(discardIndex));
      }
    }
    if (bestShanten >= currentShanten) continue;
    effective.push({
      tile: tileName(drawIndex),
      remaining: availableCounts[drawIndex]!,
      resultingShanten: bestShanten,
      discards,
      completesPair: counts[drawIndex] === 1,
      completesTriplet: counts[drawIndex] === 2,
      increasesHeadCandidates: counts[drawIndex] === 1,
      reachesTenpai: bestShanten === 0,
      completes: false,
    });
  }
  return effective;
}

export function evaluateToitoiProgress(
  counts: Counts34,
  melds: ToitoiMeld[] = [],
  availableCounts = defaultAvailableCounts(counts, melds),
): ToitoiProgressEvaluation {
  validateCounts(counts);
  validateAvailableCounts(availableCounts);
  const key = `${meldKey(melds)}|${counts.join(",")}|${availableCounts.join(",")}`;
  const cached = progressCache.get(key);
  if (cached) return cached;
  incrementSimulationCounter("targetShantenCalculationCount");
  const plan = evaluateToitoiPlan(counts, melds, availableCounts);
  const winningTileDetails = plan.shanten === 0
    ? toitoiWinningTileDetails(counts, melds, availableCounts)
    : [];
  const effectiveTiles = plan.shanten > 0 && plan.shanten <= 3
    ? toitoiEffectiveTiles(counts, melds, availableCounts, plan.shanten)
    : [];
  const traits = classifyTileRoles(counts, melds, availableCounts);
  const waitTypes = new Set(winningTileDetails.map((item) => item.waitType));
  const evaluation: ToitoiProgressEvaluation = {
    shanten: plan.shanten,
    isPossible: plan.possible,
    isIishanten: plan.shanten === 1 && effectiveTiles.some((item) => item.reachesTenpai),
    isTenpai: plan.shanten === 0 && winningTileDetails.length > 0,
    winningTiles: winningTileDetails.map((item) => item.tile),
    winningTileDetails,
    effectiveTiles,
    waitType: waitTypes.size === 1 ? [...waitTypes][0]! : null,
    waitLiveCount: winningTileDetails.reduce((sum, item) => sum + item.remaining, 0),
    ...traits,
  };
  progressCache.set(key, evaluation);
  return evaluation;
}

export function analyzeToitoiDiscards(
  counts: Counts34,
  melds: ToitoiMeld[] = [],
  availableCounts = defaultAvailableCounts(counts, melds),
  ownDiscards?: Counts34,
): ToitoiDiscardEvaluation[] {
  incrementSimulationCounter("discardEvaluationCount");
  validateCounts(counts);
  validateAvailableCounts(availableCounts);
  if (ownDiscards) validateCounts(ownDiscards);
  const evaluations: ToitoiDiscardEvaluation[] = [];
  for (let index = 0; index < 34; index += 1) {
    if (counts[index]! <= 0) continue;
    const after = counts.slice();
    after[index] -= 1;
    const progress = evaluateToitoiProgress(after, melds, availableCounts);
    const targetTiles = progress.isTenpai
      ? progress.winningTileDetails.map((item) => ({ tile: item.tile, remaining: item.remaining }))
      : progress.effectiveTiles.map((item) => ({ tile: item.tile, remaining: item.remaining }));
    const normalShanten = normalShantenWithOpenMelds(after, melds.length);
    evaluations.push({
      index,
      tile: tileName(index),
      targetPossible: progress.isPossible,
      targetShanten: progress.shanten,
      completedTripletCount: progress.completedTripletCount,
      openTripletCount: progress.openTripletCount,
      pairKindCount: progress.pairKindCount,
      promotablePairCount: progress.promotablePairCount,
      headCandidateCount: progress.headCandidateCount,
      targetUkeireKinds: targetTiles.length,
      targetUkeireCount: targetTiles.reduce((sum, item) => sum + item.remaining, 0),
      liveSingletonCount: progress.liveSingletonCount,
      excessFourthTileCount: progress.excessFourthTileCount,
      shanponWaitPotential: progress.winningTileDetails.filter((item) => item.waitType === "SHANPON").length,
      tankiWaitPotential: progress.winningTileDetails.filter((item) => item.waitType === "TANKI").length,
      furitenRisk: progress.winningTiles.some((tile) => (ownDiscards?.[tileIndex(tile)] ?? 0) > 0),
      normalShanten,
      normalUkeireCount: normalUkeireCount(after, melds.length, availableCounts, normalShanten),
    });
  }
  return evaluations.sort(compareToitoiDiscards);
}

export function selectBestToitoiDiscard(
  counts: Counts34,
  melds: ToitoiMeld[] = [],
  availableCounts = defaultAvailableCounts(counts, melds),
  ownDiscards?: Counts34,
): ToitoiDiscardEvaluation {
  const best = analyzeToitoiDiscards(counts, melds, availableCounts, ownDiscards)[0];
  if (!best) throw new Error("A discard cannot be selected from an empty hand.");
  return best;
}

export function isToitoiCompatibleMeld(
  meld: ToitoiMeld,
  existingMelds: ToitoiMeld[] = [],
): boolean {
  return fixedMeldContext([...existingMelds, meld]).valid;
}

export function shouldToitoiChi(): boolean {
  return false;
}

export function shouldToitoiRiichi(): boolean {
  return false;
}

export function evaluateToitoiPonDecision(
  counts: Counts34,
  melds: ToitoiMeld[],
  discardedTile: Tile,
  availableCounts = defaultAvailableCounts(counts, melds),
  ownDiscards?: Counts34,
): ToitoiPonDecision {
  incrementSimulationCounter("callEvaluationCount");
  validateCounts(counts);
  validateAvailableCounts(availableCounts);
  const index = tileIndex(discardedTile);
  const before = evaluateToitoiProgress(counts, melds, availableCounts);
  const beforeUkeireCount = targetUkeireCount(before);
  const rejected = (reason: string): ToitoiPonDecision => ({
    call: false,
    reason,
    beforeShanten: before.shanten,
    afterShanten: Number.POSITIVE_INFINITY,
    beforeUkeireCount,
    afterUkeireCount: 0,
    discardIndex: null,
    discardTile: null,
  });
  if (counts[index]! < 2) return rejected("ポンに必要な対子がありません。");
  const meld: ToitoiMeld = { kind: "pon", tiles: [discardedTile, discardedTile, discardedTile] };
  if (!isToitoiCompatibleMeld(meld, melds)) return rejected("ポン後に4刻子1雀頭の有効な完成経路が残りません。");

  const concealed = counts.slice();
  concealed[index] -= 2;
  const nextMelds = [...melds, meld];
  const discard = selectBestToitoiDiscard(concealed, nextMelds, availableCounts, ownDiscards);
  const afterDiscard = concealed.slice();
  afterDiscard[discard.index] -= 1;
  const after = evaluateToitoiProgress(afterDiscard, nextMelds, availableCounts);
  const afterUkeireCount = targetUkeireCount(after);
  const improved = after.shanten < before.shanten;
  const sameButWider = after.shanten === before.shanten
    && after.headCandidateCount > 0
    && afterUkeireCount > beforeUkeireCount;
  const call = after.isPossible && (improved || sameButWider);
  return {
    call,
    reason: call
      ? improved
        ? "刻子が完成し、対々和専用向聴数が改善するためポンします。"
        : "専用向聴数を維持しながら有効牌が増え、雀頭候補も残るためポンします。"
      : after.headCandidateCount === 0
        ? "唯一の雀頭候補を失い、代わりの雀頭候補が残らないため見送ります。"
        : "ポン後に対々和専用向聴数または有効牌が改善しないため見送ります。",
    beforeShanten: before.shanten,
    afterShanten: after.shanten,
    beforeUkeireCount,
    afterUkeireCount,
    discardIndex: discard.index,
    discardTile: discard.tile,
  };
}

function compareToitoiDiscards(left: ToitoiDiscardEvaluation, right: ToitoiDiscardEvaluation): number {
  if (left.targetPossible !== right.targetPossible) return left.targetPossible ? -1 : 1;
  if (left.targetShanten !== right.targetShanten) return left.targetShanten - right.targetShanten;
  if (left.furitenRisk !== right.furitenRisk) return left.furitenRisk ? 1 : -1;
  if (left.completedTripletCount !== right.completedTripletCount) return right.completedTripletCount - left.completedTripletCount;
  if (left.pairKindCount !== right.pairKindCount) return right.pairKindCount - left.pairKindCount;
  if (left.headCandidateCount !== right.headCandidateCount) return right.headCandidateCount - left.headCandidateCount;
  if (left.targetUkeireCount !== right.targetUkeireCount) return right.targetUkeireCount - left.targetUkeireCount;
  if (left.targetUkeireKinds !== right.targetUkeireKinds) return right.targetUkeireKinds - left.targetUkeireKinds;
  if (left.promotablePairCount !== right.promotablePairCount) return right.promotablePairCount - left.promotablePairCount;
  if (left.liveSingletonCount !== right.liveSingletonCount) return right.liveSingletonCount - left.liveSingletonCount;
  if (left.excessFourthTileCount !== right.excessFourthTileCount) return left.excessFourthTileCount - right.excessFourthTileCount;
  if (left.shanponWaitPotential !== right.shanponWaitPotential) return right.shanponWaitPotential - left.shanponWaitPotential;
  if (left.tankiWaitPotential !== right.tankiWaitPotential) return right.tankiWaitPotential - left.tankiWaitPotential;
  if (left.normalShanten !== right.normalShanten) return left.normalShanten - right.normalShanten;
  if (left.normalUkeireCount !== right.normalUkeireCount) return right.normalUkeireCount - left.normalUkeireCount;
  return left.index - right.index;
}

function classifyTileRoles(
  counts: Counts34,
  melds: ToitoiMeld[],
  availableCounts: Counts34,
): Omit<ToitoiProgressEvaluation,
  "shanten" | "isPossible" | "isIishanten" | "isTenpai" | "winningTiles" |
  "winningTileDetails" | "effectiveTiles" | "waitType" | "waitLiveCount"> {
  const fixed = fixedMeldContext(melds);
  let concealedTriplets = 0;
  let pairKindCount = 0;
  let promotablePairCount = 0;
  let liveSingletonCount = 0;
  let excessFourthTileCount = 0;
  for (let index = 0; index < 34; index += 1) {
    const count = counts[index]!;
    if (fixed.tripletIndexes.has(index)) {
      excessFourthTileCount += count;
      continue;
    }
    if (count >= 3) concealedTriplets += 1;
    if (count >= 2) pairKindCount += 1;
    if (count === 2 && availableCounts[index]! > 0) promotablePairCount += 1;
    if (count === 1 && availableCounts[index]! > 0) liveSingletonCount += 1;
    if (count === 4) excessFourthTileCount += 1;
  }
  return {
    completedTripletCount: melds.length + concealedTriplets,
    openTripletCount: melds.length,
    pairKindCount,
    promotablePairCount,
    headCandidateCount: pairKindCount,
    liveSingletonCount,
    excessFourthTileCount,
  };
}

function targetUkeireCount(progress: ToitoiProgressEvaluation): number {
  return progress.isTenpai
    ? progress.waitLiveCount
    : progress.effectiveTiles.reduce((sum, tile) => sum + tile.remaining, 0);
}

function fixedMeldContext(melds: ToitoiMeld[]): FixedMeldContext {
  const counts = Array(34).fill(0) as Counts34;
  const tripletIndexes = new Set<number>();
  let valid = melds.length <= 4;
  for (const meld of melds) {
    if (meld.kind !== "pon" || meld.tiles.length !== 3) {
      valid = false;
      continue;
    }
    const indexes = meld.tiles.map(tileIndex);
    if (!indexes.every((index) => index === indexes[0])) {
      valid = false;
      continue;
    }
    const index = indexes[0]!;
    counts[index] += 3;
    if (tripletIndexes.has(index) || counts[index]! > 4) valid = false;
    tripletIndexes.add(index);
  }
  return { valid, counts, tripletIndexes };
}

function defaultAvailableCounts(counts: Counts34, melds: ToitoiMeld[]): Counts34 {
  const fixed = fixedMeldContext(melds);
  return counts.map((count, index) => Math.max(0, 4 - count - fixed.counts[index]!));
}

function normalUkeireCount(
  counts: Counts34,
  meldCount: number,
  availableCounts: Counts34,
  shanten: number,
): number {
  let total = 0;
  for (let index = 0; index < 34; index += 1) {
    if (counts[index]! >= 4 || availableCounts[index]! <= 0) continue;
    const next = counts.slice();
    next[index] += 1;
    if (normalShantenWithOpenMelds(next, meldCount) < shanten) total += availableCounts[index]!;
  }
  return total;
}

function validateAvailableCounts(counts: Counts34): void {
  if (counts.length !== 34 || counts.some((count) => !Number.isInteger(count) || count < 0 || count > 4)) {
    throw new Error("availableCounts must contain 34 values from 0 to 4.");
  }
}

function betterPlan(current: PlanSearchResult | null, candidate: PlanSearchResult): PlanSearchResult {
  if (!current || candidate.overlap > current.overlap) return candidate;
  if (candidate.overlap < current.overlap) return current;
  const candidateKey = `${candidate.tripletIndexes.join(".")}|${candidate.pairIndex ?? 99}`;
  const currentKey = `${current.tripletIndexes.join(".")}|${current.pairIndex ?? 99}`;
  return candidateKey < currentKey ? candidate : current;
}

function impossiblePlan(): ToitoiPlan {
  return {
    possible: false,
    shanten: Number.POSITIVE_INFINITY,
    overlap: Number.NEGATIVE_INFINITY,
    tripletIndexes: [],
    pairIndex: null,
  };
}

function cachePlan(key: string, value: ToitoiPlan): ToitoiPlan {
  planCache.set(key, value);
  return value;
}

function meldKey(melds: ToitoiMeld[]): string {
  return melds
    .map((meld) => `${meld.kind}:${meld.tiles.map(tileIndex).sort((a, b) => a - b).join(".")}`)
    .sort()
    .join(";");
}

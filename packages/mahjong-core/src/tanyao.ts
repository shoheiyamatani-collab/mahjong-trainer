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

export const TANYAO_AI_VERSION = "tanyao-ai-1.0.0";

export interface TanyaoRuleConfig {
  openTanyao: boolean;
}

export const DEFAULT_TANYAO_RULE_CONFIG: Readonly<TanyaoRuleConfig> = {
  openTanyao: true,
};

export interface TanyaoMeld {
  kind: "chi" | "pon";
  tiles: Tile[];
}

export type TanyaoShape = "STANDARD" | "CHIITOITSU";

export interface TanyaoWinClassification {
  type: "TANYAO" | "NONE";
  shape: TanyaoShape | null;
  open: boolean;
}

export interface TanyaoPlan {
  possible: boolean;
  shanten: number;
  standardShanten: number;
  chiitoitsuShanten: number;
  bestShape: TanyaoShape | null;
}

export interface TanyaoWinningTile {
  tile: Tile;
  remaining: number;
  shape: TanyaoShape;
}

export interface TanyaoEffectiveTile {
  tile: Tile;
  remaining: number;
  resultingShanten: number;
  discards: Tile[];
  improvesStandard: boolean;
  improvesChiitoitsu: boolean;
  createsSequence: boolean;
  createsPair: boolean;
  createsTriplet: boolean;
  reachesIishanten: boolean;
  reachesTenpai: boolean;
  completes: boolean;
}

export interface TanyaoProgressEvaluation {
  shanten: number;
  isPossible: boolean;
  isIishanten: boolean;
  isTenpai: boolean;
  bestShape: TanyaoShape | null;
  standardShanten: number;
  chiitoitsuShanten: number;
  winningTiles: Tile[];
  winningTileDetails: TanyaoWinningTile[];
  effectiveTiles: TanyaoEffectiveTile[];
  waitKindCount: number;
  waitLiveCount: number;
  terminalHonorCount: number;
  simpleTileCount: number;
  completedSimpleMeldCount: number;
  simpleTaatsuCount: number;
  ryanmenTaatsuCount: number;
  simplePairCount: number;
  simpleTripletCount: number;
}

export interface TanyaoDiscardEvaluation {
  index: number;
  tile: Tile;
  targetPossible: boolean;
  targetShanten: number;
  targetUkeireKinds: number;
  targetUkeireCount: number;
  terminalHonorCount: number;
  completedSimpleMeldCount: number;
  simpleTaatsuCount: number;
  ryanmenTaatsuCount: number;
  simplePairCount: number;
  simpleTripletCount: number;
  standardTargetShanten: number;
  chiitoitsuTargetShanten: number;
  bestShape: TanyaoShape | null;
  openProgressPotential: number;
  targetTenpaiWaitCount: number;
  targetTenpaiLiveCount: number;
  furitenRisk: boolean;
  normalShanten: number;
  normalUkeireCount: number;
}

export interface TanyaoCallDecision {
  call: boolean;
  reason: string;
  beforeShanten: number;
  afterShanten: number;
  beforeUkeireCount: number;
  afterUkeireCount: number;
  discardedTile: Tile | null;
  abandonedChiitoitsu: boolean;
}

const planCache = new LruCache<string, TanyaoPlan>(20_000);
const progressCache = new LruCache<string, TanyaoProgressEvaluation>(20_000);
const winCache = new LruCache<string, TanyaoWinClassification>(10_000);

export function isSimpleTileIndex(index: number): boolean {
  return index >= 0 && index < 27 && index % 9 >= 1 && index % 9 <= 7;
}

export function isTanyaoCompatibleMeld(
  meld: TanyaoMeld,
  existingMelds: TanyaoMeld[] = [],
  config: TanyaoRuleConfig = DEFAULT_TANYAO_RULE_CONFIG,
): boolean {
  return meldsAreCompatible([...existingMelds, meld], config);
}

export function classifyTanyaoWin(
  counts: Counts34,
  melds: TanyaoMeld[] = [],
  config: TanyaoRuleConfig = DEFAULT_TANYAO_RULE_CONFIG,
): TanyaoWinClassification {
  validateCounts(counts);
  const key = `${config.openTanyao ? 1 : 0}|${meldKey(melds)}|${counts.join(",")}`;
  const cached = winCache.get(key);
  if (cached) return cached;
  const none: TanyaoWinClassification = { type: "NONE", shape: null, open: melds.length > 0 };
  const expected = 14 - melds.length * 3;
  if (melds.length > 4 || sumCounts(counts) !== expected || !meldsAreCompatible(melds, config)) {
    return cacheWin(key, none);
  }
  if (counts.some((count, index) => count > 0 && !isSimpleTileIndex(index))) return cacheWin(key, none);

  const standard = normalShantenWithOpenMelds(counts, melds.length) === -1;
  const chiitoitsu = melds.length === 0 && isRestrictedChiitoitsuComplete(counts);
  if (!standard && !chiitoitsu) return cacheWin(key, none);
  return cacheWin(key, {
    type: "TANYAO",
    // A hand such as 22334455667788 can also be read as a standard hand.
    // Use the standard interpretation so mutually exclusive shape totals remain stable.
    shape: standard ? "STANDARD" : "CHIITOITSU",
    open: melds.length > 0,
  });
}

export function isTanyaoComplete(
  counts: Counts34,
  melds: TanyaoMeld[] = [],
  config: TanyaoRuleConfig = DEFAULT_TANYAO_RULE_CONFIG,
): boolean {
  return classifyTanyaoWin(counts, melds, config).type === "TANYAO";
}

export function evaluateTanyaoPlan(
  counts: Counts34,
  melds: TanyaoMeld[] = [],
  availableCounts = defaultAvailableCounts(counts, melds),
  config: TanyaoRuleConfig = DEFAULT_TANYAO_RULE_CONFIG,
): TanyaoPlan {
  validateCounts(counts);
  validateAvailableCounts(availableCounts);
  const key = `${config.openTanyao ? 1 : 0}|${meldKey(melds)}|${counts.join(",")}|${availableCounts.join(",")}`;
  const cached = planCache.get(key);
  if (cached) return cached;
  if (!meldsAreCompatible(melds, config) || sumCounts(counts) > 14 - melds.length * 3) {
    return cachePlan(key, impossiblePlan());
  }

  const restricted = restrictToSimpleTiles(counts);
  const rawStandardShanten = normalShantenWithOpenMelds(restricted, melds.length);
  const liveSimpleTileCount = availableCounts.reduce(
    (sum, count, index) => sum + (isSimpleTileIndex(index) ? count : 0),
    0,
  );
  // Detailed waits/effective tiles below validate the actual tile kinds. Here we only
  // reject a target when even the minimum number of future simple tiles is unavailable.
  const standardPossible = rawStandardShanten < 0
    || (rawStandardShanten === 0
      ? hasLiveStandardWinningDraw(restricted, availableCounts, melds.length)
      : liveSimpleTileCount >= rawStandardShanten + 1);
  const standardShanten = standardPossible ? rawStandardShanten : Number.POSITIVE_INFINITY;
  const chiitoitsuPossible = melds.length === 0 && canCompleteRestrictedChiitoitsu(restricted, availableCounts);
  const chiitoitsuShanten = chiitoitsuPossible
    ? restrictedChiitoitsuShanten(restricted)
    : Number.POSITIVE_INFINITY;
  const shanten = Math.min(standardShanten, chiitoitsuShanten);
  const bestShape = !Number.isFinite(shanten)
    ? null
    : standardShanten <= chiitoitsuShanten ? "STANDARD" : "CHIITOITSU";
  return cachePlan(key, {
    possible: bestShape != null,
    shanten,
    standardShanten,
    chiitoitsuShanten,
    bestShape,
  });
}

export function tanyaoShanten(
  counts: Counts34,
  melds: TanyaoMeld[] = [],
  availableCounts = defaultAvailableCounts(counts, melds),
  config: TanyaoRuleConfig = DEFAULT_TANYAO_RULE_CONFIG,
): number {
  return evaluateTanyaoPlan(counts, melds, availableCounts, config).shanten;
}

export function tanyaoWinningTileDetails(
  counts: Counts34,
  melds: TanyaoMeld[] = [],
  availableCounts = defaultAvailableCounts(counts, melds),
  config: TanyaoRuleConfig = DEFAULT_TANYAO_RULE_CONFIG,
): TanyaoWinningTile[] {
  validateCounts(counts);
  validateAvailableCounts(availableCounts);
  if (sumCounts(counts) !== 13 - melds.length * 3 || !meldsAreCompatible(melds, config)) return [];
  const result: TanyaoWinningTile[] = [];
  for (let index = 0; index < 34; index += 1) {
    if (!isSimpleTileIndex(index) || counts[index]! >= 4 || availableCounts[index]! <= 0) continue;
    const completed = counts.slice();
    completed[index] += 1;
    const classification = classifyTanyaoWin(completed, melds, config);
    if (classification.type === "TANYAO") {
      result.push({ tile: tileName(index), remaining: availableCounts[index]!, shape: classification.shape! });
    }
  }
  return result;
}

export function tanyaoWinningTiles(
  counts: Counts34,
  melds: TanyaoMeld[] = [],
  availableCounts = defaultAvailableCounts(counts, melds),
  config: TanyaoRuleConfig = DEFAULT_TANYAO_RULE_CONFIG,
): Tile[] {
  incrementSimulationCounter("waitCalculationCount");
  return tanyaoWinningTileDetails(counts, melds, availableCounts, config).map((item) => item.tile);
}

export function tanyaoEffectiveTiles(
  counts: Counts34,
  melds: TanyaoMeld[] = [],
  availableCounts = defaultAvailableCounts(counts, melds),
  currentShanten = evaluateTanyaoPlan(counts, melds, availableCounts).shanten,
  config: TanyaoRuleConfig = DEFAULT_TANYAO_RULE_CONFIG,
): TanyaoEffectiveTile[] {
  validateCounts(counts);
  validateAvailableCounts(availableCounts);
  if (!Number.isFinite(currentShanten)) return [];
  const before = evaluateTanyaoPlan(counts, melds, availableCounts, config);
  const result: TanyaoEffectiveTile[] = [];
  for (let drawIndex = 0; drawIndex < 34; drawIndex += 1) {
    if (!isSimpleTileIndex(drawIndex) || counts[drawIndex]! >= 4 || availableCounts[drawIndex]! <= 0) continue;
    const drawn = counts.slice();
    drawn[drawIndex] += 1;
    const completed = classifyTanyaoWin(drawn, melds, config);
    if (completed.type === "TANYAO") {
      result.push({
        tile: tileName(drawIndex),
        remaining: availableCounts[drawIndex]!,
        resultingShanten: -1,
        discards: [],
        improvesStandard: completed.shape === "STANDARD",
        improvesChiitoitsu: completed.shape === "CHIITOITSU",
        createsSequence: completesSimpleSequence(counts, drawIndex),
        createsPair: counts[drawIndex] === 1,
        createsTriplet: counts[drawIndex] === 2,
        reachesIishanten: false,
        reachesTenpai: false,
        completes: true,
      });
      continue;
    }

    let bestShanten = Number.POSITIVE_INFINITY;
    let bestStandard = Number.POSITIVE_INFINITY;
    let bestChiitoitsu = Number.POSITIVE_INFINITY;
    const discards: Tile[] = [];
    for (let discardIndex = 0; discardIndex < 34; discardIndex += 1) {
      if (drawn[discardIndex]! <= 0) continue;
      const after = drawn.slice();
      after[discardIndex] -= 1;
      const plan = evaluateTanyaoPlan(after, melds, availableCounts, config);
      if (plan.shanten < bestShanten) {
        bestShanten = plan.shanten;
        bestStandard = plan.standardShanten;
        bestChiitoitsu = plan.chiitoitsuShanten;
        discards.splice(0, discards.length, tileName(discardIndex));
      } else if (plan.shanten === bestShanten) {
        bestStandard = Math.min(bestStandard, plan.standardShanten);
        bestChiitoitsu = Math.min(bestChiitoitsu, plan.chiitoitsuShanten);
        discards.push(tileName(discardIndex));
      }
    }
    if (bestShanten >= currentShanten) continue;
    const nextAvailable = availableCounts.slice();
    nextAvailable[drawIndex] -= 1;
    const reachesLiveTenpai = bestShanten === 0 && discards.some((discard) => {
      const after = drawn.slice();
      after[tileIndex(discard)] -= 1;
      return tanyaoWinningTileDetails(after, melds, nextAvailable, config).length > 0;
    });
    const resultingShanten = bestShanten === 0 && !reachesLiveTenpai ? 1 : bestShanten;
    result.push({
      tile: tileName(drawIndex),
      remaining: availableCounts[drawIndex]!,
      resultingShanten,
      discards,
      improvesStandard: bestStandard < before.standardShanten,
      improvesChiitoitsu: bestChiitoitsu < before.chiitoitsuShanten,
      createsSequence: completesSimpleSequence(counts, drawIndex),
      createsPair: counts[drawIndex] === 1,
      createsTriplet: counts[drawIndex] === 2,
      reachesIishanten: resultingShanten === 1,
      reachesTenpai: resultingShanten === 0,
      completes: false,
    });
  }
  return result;
}

export function evaluateTanyaoProgress(
  counts: Counts34,
  melds: TanyaoMeld[] = [],
  availableCounts = defaultAvailableCounts(counts, melds),
  config: TanyaoRuleConfig = DEFAULT_TANYAO_RULE_CONFIG,
): TanyaoProgressEvaluation {
  validateCounts(counts);
  validateAvailableCounts(availableCounts);
  const key = `${config.openTanyao ? 1 : 0}|${meldKey(melds)}|${counts.join(",")}|${availableCounts.join(",")}`;
  const cached = progressCache.get(key);
  if (cached) return cached;
  incrementSimulationCounter("targetShantenCalculationCount");
  const plan = evaluateTanyaoPlan(counts, melds, availableCounts, config);
  const winningTileDetails = plan.possible
    ? tanyaoWinningTileDetails(counts, melds, availableCounts, config)
    : [];
  const isTenpai = winningTileDetails.length > 0;
  const searchShanten = isTenpai ? 0 : plan.shanten <= 0 ? 1 : plan.shanten;
  const effectiveTiles = plan.possible && searchShanten > 0 && searchShanten <= 3
    ? tanyaoEffectiveTiles(counts, melds, availableCounts, searchShanten, config)
    : [];
  const isIishanten = isTenpai || (searchShanten === 1
    && effectiveTiles.some((item) => item.reachesTenpai));
  const traits = classifySimpleShape(counts, melds);
  const evaluation: TanyaoProgressEvaluation = {
    shanten: isTenpai ? 0 : isIishanten ? 1 : searchShanten,
    isPossible: plan.possible,
    isIishanten,
    isTenpai,
    bestShape: isTenpai ? bestWinningShape(winningTileDetails) : plan.bestShape,
    standardShanten: plan.standardShanten,
    chiitoitsuShanten: plan.chiitoitsuShanten,
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

export function analyzeTanyaoDiscards(
  counts: Counts34,
  melds: TanyaoMeld[] = [],
  availableCounts = defaultAvailableCounts(counts, melds),
  ownDiscards = emptyCounts(),
  config: TanyaoRuleConfig = DEFAULT_TANYAO_RULE_CONFIG,
): TanyaoDiscardEvaluation[] {
  incrementSimulationCounter("discardEvaluationCount");
  validateCounts(counts);
  validateAvailableCounts(availableCounts);
  validateCounts(ownDiscards);
  const evaluations: TanyaoDiscardEvaluation[] = [];
  for (let index = 0; index < 34; index += 1) {
    if (counts[index]! <= 0) continue;
    const after = counts.slice();
    after[index] -= 1;
    const progress = evaluateTanyaoProgress(after, melds, availableCounts, config);
    const targets = progress.isTenpai ? progress.winningTileDetails : progress.effectiveTiles;
    const targetIndexes = targets.map((item) => tileIndex(item.tile));
    const normal = normalShantenWithOpenMelds(after, melds.length);
    evaluations.push({
      index,
      tile: tileName(index),
      targetPossible: progress.isPossible,
      targetShanten: progress.shanten,
      targetUkeireKinds: targets.length,
      targetUkeireCount: targets.reduce((sum, item) => sum + item.remaining, 0),
      terminalHonorCount: progress.terminalHonorCount,
      completedSimpleMeldCount: progress.completedSimpleMeldCount,
      simpleTaatsuCount: progress.simpleTaatsuCount,
      ryanmenTaatsuCount: progress.ryanmenTaatsuCount,
      simplePairCount: progress.simplePairCount,
      simpleTripletCount: progress.simpleTripletCount,
      standardTargetShanten: progress.standardShanten,
      chiitoitsuTargetShanten: progress.chiitoitsuShanten,
      bestShape: progress.bestShape,
      openProgressPotential: openProgressPotential(after, availableCounts),
      targetTenpaiWaitCount: progress.waitKindCount,
      targetTenpaiLiveCount: progress.waitLiveCount,
      furitenRisk: targetIndexes.some((targetIndex) => ownDiscards[targetIndex]! > 0),
      normalShanten: normal,
      normalUkeireCount: normalUkeireCount(after, melds.length, availableCounts, normal),
    });
  }
  return evaluations.sort(compareTanyaoDiscards);
}

export function selectBestTanyaoDiscard(
  counts: Counts34,
  melds: TanyaoMeld[] = [],
  availableCounts = defaultAvailableCounts(counts, melds),
  ownDiscards = emptyCounts(),
  config: TanyaoRuleConfig = DEFAULT_TANYAO_RULE_CONFIG,
): TanyaoDiscardEvaluation {
  const best = analyzeTanyaoDiscards(counts, melds, availableCounts, ownDiscards, config)[0];
  if (!best) throw new Error("A discard cannot be selected from an empty hand.");
  return best;
}

export function evaluateTanyaoCallDecision(
  beforeCounts: Counts34,
  beforeMelds: TanyaoMeld[],
  afterCallCounts: Counts34,
  calledMeld: TanyaoMeld,
  availableCounts: Counts34,
  ownDiscards = emptyCounts(),
  config: TanyaoRuleConfig = DEFAULT_TANYAO_RULE_CONFIG,
): TanyaoCallDecision {
  incrementSimulationCounter("callEvaluationCount");
  if (!isTanyaoCompatibleMeld(calledMeld, beforeMelds, config)) {
    return noCall("The called meld contains a terminal, honor, 123, or 789.");
  }
  const before = evaluateTanyaoProgress(beforeCounts, beforeMelds, availableCounts, config);
  const beforeUkeire = targetUkeireCount(before);
  const nextMelds = [...beforeMelds, calledMeld];
  const discard = selectBestTanyaoDiscard(afterCallCounts, nextMelds, availableCounts, ownDiscards, config);
  const after = afterCallCounts.slice();
  after[discard.index] -= 1;
  const progress = evaluateTanyaoProgress(after, nextMelds, availableCounts, config);
  const afterUkeire = targetUkeireCount(progress);
  const improves = progress.isPossible && progress.shanten < before.shanten;
  const meaningfullyBroadens = progress.isPossible
    && progress.shanten === before.shanten
    && afterUkeire > beforeUkeire;
  const call = improves || meaningfullyBroadens;
  return {
    call,
    reason: call
      ? improves
        ? "The call completes a simple meld and improves Tanyao shanten."
        : "The call keeps Tanyao shanten and increases live effective tiles."
      : "The call does not improve Tanyao shanten or live effective tiles enough.",
    beforeShanten: before.shanten,
    afterShanten: progress.shanten,
    beforeUkeireCount: beforeUkeire,
    afterUkeireCount: afterUkeire,
    discardedTile: discard.tile,
    abandonedChiitoitsu: before.bestShape === "CHIITOITSU" && nextMelds.length > 0,
  };
}

export function shouldTanyaoRiichi(): boolean {
  return false;
}

function compareTanyaoDiscards(left: TanyaoDiscardEvaluation, right: TanyaoDiscardEvaluation): number {
  if (left.targetPossible !== right.targetPossible) return left.targetPossible ? -1 : 1;
  if (left.targetShanten !== right.targetShanten) return left.targetShanten - right.targetShanten;
  if (left.furitenRisk !== right.furitenRisk) return left.furitenRisk ? 1 : -1;
  if (left.targetUkeireCount !== right.targetUkeireCount) return right.targetUkeireCount - left.targetUkeireCount;
  if (left.terminalHonorCount !== right.terminalHonorCount) return left.terminalHonorCount - right.terminalHonorCount;
  if (left.completedSimpleMeldCount !== right.completedSimpleMeldCount) return right.completedSimpleMeldCount - left.completedSimpleMeldCount;
  if (left.ryanmenTaatsuCount !== right.ryanmenTaatsuCount) return right.ryanmenTaatsuCount - left.ryanmenTaatsuCount;
  if (left.simpleTaatsuCount !== right.simpleTaatsuCount) return right.simpleTaatsuCount - left.simpleTaatsuCount;
  if (left.openProgressPotential !== right.openProgressPotential) return right.openProgressPotential - left.openProgressPotential;
  if (left.normalShanten !== right.normalShanten) return left.normalShanten - right.normalShanten;
  if (left.normalUkeireCount !== right.normalUkeireCount) return right.normalUkeireCount - left.normalUkeireCount;
  return left.index - right.index;
}

function classifySimpleShape(counts: Counts34, melds: TanyaoMeld[]): Pick<TanyaoProgressEvaluation,
  "terminalHonorCount" | "simpleTileCount" | "completedSimpleMeldCount" | "simpleTaatsuCount" |
  "ryanmenTaatsuCount" | "simplePairCount" | "simpleTripletCount"> {
  let simpleTaatsuCount = 0;
  let ryanmenTaatsuCount = 0;
  for (let suit = 0; suit < 3; suit += 1) {
    const base = suit * 9;
    for (let start = 1; start <= 6; start += 1) {
      if (counts[base + start]! > 0 && counts[base + start + 1]! > 0) {
        simpleTaatsuCount += 1;
        if (start >= 2 && start <= 5) ryanmenTaatsuCount += 1;
      }
    }
    for (let start = 1; start <= 5; start += 1) {
      if (counts[base + start]! > 0 && counts[base + start + 2]! > 0) simpleTaatsuCount += 1;
    }
  }
  return {
    terminalHonorCount: counts.reduce((sum, count, index) => sum + (isSimpleTileIndex(index) ? 0 : count), 0),
    simpleTileCount: counts.reduce((sum, count, index) => sum + (isSimpleTileIndex(index) ? count : 0), 0),
    completedSimpleMeldCount: melds.length + maximumCompletedSimpleMelds(counts),
    simpleTaatsuCount,
    ryanmenTaatsuCount,
    simplePairCount: counts.filter((count, index) => isSimpleTileIndex(index) && count >= 2).length,
    simpleTripletCount: counts.filter((count, index) => isSimpleTileIndex(index) && count >= 3).length,
  };
}

function maximumCompletedSimpleMelds(counts: Counts34): number {
  const restricted = restrictToSimpleTiles(counts);
  const memo = new Map<string, number>();
  const search = (state: Counts34): number => {
    const key = state.join("");
    const cached = memo.get(key);
    if (cached != null) return cached;
    let best = 0;
    for (let index = 0; index < 27; index += 1) {
      if (!isSimpleTileIndex(index)) continue;
      if (state[index]! >= 3) {
        const next = state.slice();
        next[index] -= 3;
        best = Math.max(best, 1 + search(next));
      }
      if (index % 9 >= 1 && index % 9 <= 5
        && state[index]! > 0 && state[index + 1]! > 0 && state[index + 2]! > 0) {
        const next = state.slice();
        next[index] -= 1;
        next[index + 1] -= 1;
        next[index + 2] -= 1;
        best = Math.max(best, 1 + search(next));
      }
    }
    memo.set(key, best);
    return best;
  };
  return search(restricted);
}

function completesSimpleSequence(counts: Counts34, index: number): boolean {
  if (!isSimpleTileIndex(index)) return false;
  const rank = index % 9;
  const base = index - rank;
  for (let start = Math.max(1, rank - 2); start <= Math.min(5, rank); start += 1) {
    const group = [base + start, base + start + 1, base + start + 2];
    if (group.every((candidate) => candidate === index || counts[candidate]! > 0)) return true;
  }
  return false;
}

function openProgressPotential(counts: Counts34, availableCounts: Counts34): number {
  let score = 0;
  for (let index = 0; index < 27; index += 1) {
    if (!isSimpleTileIndex(index)) continue;
    if (counts[index]! >= 2 && availableCounts[index]! > 0) score += availableCounts[index]!;
    if (counts[index]! > 0 && completesSimpleSequence(counts, index)) score += 1;
  }
  return score;
}

function normalUkeireCount(
  counts: Counts34,
  meldCount: number,
  availableCounts: Counts34,
  shanten: number,
): number {
  if (!Number.isFinite(shanten)) return 0;
  let total = 0;
  for (let index = 0; index < 34; index += 1) {
    if (counts[index]! >= 4 || availableCounts[index]! <= 0) continue;
    const next = counts.slice();
    next[index] += 1;
    if (normalShantenWithOpenMelds(next, meldCount) < shanten) total += availableCounts[index]!;
  }
  return total;
}

function hasLiveStandardWinningDraw(
  counts: Counts34,
  availableCounts: Counts34,
  meldCount: number,
): boolean {
  for (let index = 0; index < 34; index += 1) {
    if (!isSimpleTileIndex(index) || counts[index]! >= 4 || availableCounts[index]! <= 0) continue;
    const completed = counts.slice();
    completed[index] += 1;
    if (normalShantenWithOpenMelds(completed, meldCount) === -1) return true;
  }
  return false;
}

function restrictedChiitoitsuShanten(counts: Counts34): number {
  const pairs = counts.filter((count, index) => isSimpleTileIndex(index) && count >= 2).length;
  const unique = counts.filter((count, index) => isSimpleTileIndex(index) && count > 0).length;
  return 6 - pairs + Math.max(0, 7 - unique);
}

function isRestrictedChiitoitsuComplete(counts: Counts34): boolean {
  return sumCounts(counts) === 14
    && counts.filter((count, index) => isSimpleTileIndex(index) && count === 2).length === 7
    && counts.every((count, index) => count === 0 || (isSimpleTileIndex(index) && count === 2));
}

function canCompleteRestrictedChiitoitsu(counts: Counts34, availableCounts: Counts34): boolean {
  let possiblePairs = 0;
  for (let index = 0; index < 34; index += 1) {
    if (!isSimpleTileIndex(index)) continue;
    if (counts[index]! >= 2
      || (counts[index] === 1 && availableCounts[index]! >= 1)
      || (counts[index] === 0 && availableCounts[index]! >= 2)) possiblePairs += 1;
  }
  return possiblePairs >= 7;
}

function restrictToSimpleTiles(counts: Counts34): Counts34 {
  return counts.map((count, index) => isSimpleTileIndex(index) ? count : 0);
}

function meldsAreCompatible(melds: TanyaoMeld[], config: TanyaoRuleConfig): boolean {
  if (melds.length > 4 || (melds.length > 0 && !config.openTanyao)) return false;
  const physical = emptyCounts();
  for (const meld of melds) {
    const indexes = meld.tiles.map(tileIndex).sort((left, right) => left - right);
    if (indexes.length !== 3 || indexes.some((index) => !isSimpleTileIndex(index))) return false;
    const pon = meld.kind === "pon" && new Set(indexes).size === 1;
    const chi = meld.kind === "chi"
      && indexes[1] === indexes[0]! + 1
      && indexes[2] === indexes[0]! + 2
      && Math.floor(indexes[0]! / 9) === Math.floor(indexes[2]! / 9)
      && indexes[0]! % 9 >= 1
      && indexes[0]! % 9 <= 5;
    if (!pon && !chi) return false;
    for (const index of indexes) {
      physical[index] += 1;
      if (physical[index]! > 4) return false;
    }
  }
  return true;
}

function targetUkeireCount(progress: TanyaoProgressEvaluation): number {
  return progress.isTenpai
    ? progress.waitLiveCount
    : progress.effectiveTiles.reduce((sum, item) => sum + item.remaining, 0);
}

function bestWinningShape(details: TanyaoWinningTile[]): TanyaoShape | null {
  if (details.some((item) => item.shape === "STANDARD")) return "STANDARD";
  return details[0]?.shape ?? null;
}

function defaultAvailableCounts(counts: Counts34, melds: TanyaoMeld[]): Counts34 {
  const fixed = emptyCounts();
  for (const meld of melds) for (const tile of meld.tiles) fixed[tileIndex(tile)] += 1;
  return counts.map((count, index) => Math.max(0, 4 - count - fixed[index]!));
}

function validateAvailableCounts(counts: Counts34): void {
  if (counts.length !== 34 || counts.some((count) => !Number.isInteger(count) || count < 0 || count > 4)) {
    throw new Error("availableCounts must contain 34 integer values from 0 to 4.");
  }
}

function meldKey(melds: TanyaoMeld[]): string {
  return melds
    .map((meld) => `${meld.kind}:${meld.tiles.map(tileIndex).sort((left, right) => left - right).join(".")}`)
    .sort()
    .join(";");
}

function impossiblePlan(): TanyaoPlan {
  return {
    possible: false,
    shanten: Number.POSITIVE_INFINITY,
    standardShanten: Number.POSITIVE_INFINITY,
    chiitoitsuShanten: Number.POSITIVE_INFINITY,
    bestShape: null,
  };
}

function noCall(reason: string): TanyaoCallDecision {
  return {
    call: false,
    reason,
    beforeShanten: Number.POSITIVE_INFINITY,
    afterShanten: Number.POSITIVE_INFINITY,
    beforeUkeireCount: 0,
    afterUkeireCount: 0,
    discardedTile: null,
    abandonedChiitoitsu: false,
  };
}

function cachePlan(key: string, value: TanyaoPlan): TanyaoPlan {
  planCache.set(key, value);
  return value;
}

function cacheWin(key: string, value: TanyaoWinClassification): TanyaoWinClassification {
  winCache.set(key, value);
  return value;
}

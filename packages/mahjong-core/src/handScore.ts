import { calculateScore, type ScoreResult, type WinMethod } from "./scoring";
import { type Counts34, type Tile, countsToTiles, tileIndex, tileName, validateCounts } from "./tiles";

export interface YakuResult {
  name: string;
  han: number;
  isYakuman?: boolean;
}

export interface FuItem {
  label: string;
  fu: number;
}

export interface FuResult {
  totalBeforeRounding: number;
  roundedFu: number;
  items: FuItem[];
}

export interface HandScoreInput {
  counts: Counts34;
  winningTile: Tile;
  isDealer: boolean;
  winMethod: WinMethod;
  roundWind: Tile;
  seatWind: Tile;
  riichi?: boolean;
  doubleRiichi?: boolean;
  ippatsu?: boolean;
  dora?: number;
  honba?: number;
  riichiSticks?: number;
  yakumanCount?: number;
}

export interface HandScoreResult {
  score: ScoreResult;
  fu: FuResult | null;
  yaku: YakuResult[];
  decomposition: StandardHandDecomposition | null;
}

type GroupKind = "sequence" | "triplet" | "pair";

interface HandGroup {
  kind: GroupKind;
  tiles: Tile[];
}

interface StandardHandDecomposition {
  melds: HandGroup[];
  pair: HandGroup;
}

const EAST = "東" as Tile;
const SOUTH = "南" as Tile;
const WEST = "西" as Tile;
const NORTH = "北" as Tile;
const DRAGONS = new Set<Tile>(["白", "發", "中"] as Tile[]);
const WINDS = new Set<Tile>([EAST, SOUTH, WEST, NORTH]);

export function calculateHandScore(input: HandScoreInput): HandScoreResult {
  validateHandScoreInput(input);

  const yakumanCount = input.yakumanCount ?? 0;
  if (yakumanCount > 0) {
    return {
      score: calculateScore({
        han: 0,
        fu: null,
        isDealer: input.isDealer,
        winMethod: input.winMethod,
        yakumanCount,
        honba: input.honba,
        riichiSticks: input.riichiSticks
      }),
      fu: null,
      yaku: [],
      decomposition: null
    };
  }

  const kokushi = scoreKokushi(input);
  if (kokushi) return kokushi;

  const candidates: HandScoreResult[] = [];
  const chiitoitsu = scoreChiitoitsu(input);
  if (chiitoitsu) candidates.push(chiitoitsu);

  for (const decomposition of decomposeStandardHand(input.counts)) {
    try {
      candidates.push(scoreDecomposition(input, decomposition));
    } catch {
      // Other decompositions may still have valid yaku.
    }
  }

  if (candidates.length === 0) {
    throw new Error("和了形または役が見つかりません。");
  }

  return candidates.sort((a, b) => scoreRank(b) - scoreRank(a))[0]!;
}

function scoreKokushi(input: HandScoreInput): HandScoreResult | null {
  if (!isKokushi(input.counts)) return null;
  return {
    score: calculateScore({
      han: 0,
      fu: null,
      isDealer: input.isDealer,
      winMethod: input.winMethod,
      yakumanCount: 1,
      honba: input.honba,
      riichiSticks: input.riichiSticks
    }),
    fu: null,
    yaku: [{ name: "国士無双", han: 0, isYakuman: true }],
    decomposition: null
  };
}

function scoreChiitoitsu(input: HandScoreInput): HandScoreResult | null {
  if (!isChiitoitsu(input.counts)) return null;
  const yaku: YakuResult[] = [{ name: "七対子", han: 2 }, ...chiitoitsuCompatibleYaku(input.counts), ...situationalYaku(input)];
  if (input.dora) yaku.push({ name: "ドラ", han: input.dora });
  const han = yaku.reduce((sum, result) => sum + result.han, 0);
  const fu: FuResult = { totalBeforeRounding: 25, roundedFu: 25, items: [{ label: "七対子25符", fu: 25 }] };
  return {
    score: calculateScore({
      han,
      fu: fu.roundedFu,
      isDealer: input.isDealer,
      winMethod: input.winMethod,
      honba: input.honba,
      riichiSticks: input.riichiSticks
    }),
    fu,
    yaku,
    decomposition: null
  };
}

function scoreDecomposition(input: HandScoreInput, decomposition: StandardHandDecomposition): HandScoreResult {
  const yaku = [...detectStandardYaku(decomposition, input), ...situationalYaku(input)];
  if (input.dora) yaku.push({ name: "ドラ", han: input.dora });
  const han = yaku.reduce((sum, result) => sum + result.han, 0);
  if (han <= 0) throw new Error("役がありません。");
  const fu = calculateStandardFu(decomposition, input);
  return {
    score: calculateScore({
      han,
      fu: fu.roundedFu,
      isDealer: input.isDealer,
      winMethod: input.winMethod,
      honba: input.honba,
      riichiSticks: input.riichiSticks
    }),
    fu,
    yaku,
    decomposition
  };
}

function decomposeStandardHand(counts: Counts34): StandardHandDecomposition[] {
  validateCounts(counts, 14);
  const decompositions: StandardHandDecomposition[] = [];
  counts.forEach((count, pairIndex) => {
    if (count < 2) return;
    const working = counts.slice();
    working[pairIndex] -= 2;
    const pairTile = tileName(pairIndex);
    for (const melds of decomposeMelds(working, 4)) {
      decompositions.push({ melds, pair: { kind: "pair", tiles: [pairTile, pairTile] } });
    }
  });
  return uniqueDecompositions(decompositions);
}

function decomposeMelds(counts: Counts34, requiredMelds: number): HandGroup[][] {
  if (requiredMelds === 0) {
    return counts.every((count) => count === 0) ? [[]] : [];
  }
  const first = counts.findIndex((count) => count > 0);
  if (first < 0) return [];

  const results: HandGroup[][] = [];
  if (counts[first]! >= 3) {
    counts[first] -= 3;
    const tile = tileName(first);
    for (const rest of decomposeMelds(counts, requiredMelds - 1)) {
      results.push([{ kind: "triplet", tiles: [tile, tile, tile] }, ...rest]);
    }
    counts[first] += 3;
  }

  if (canStartSequence(first) && counts[first + 1]! > 0 && counts[first + 2]! > 0) {
    counts[first] -= 1;
    counts[first + 1] -= 1;
    counts[first + 2] -= 1;
    for (const rest of decomposeMelds(counts, requiredMelds - 1)) {
      results.push([{ kind: "sequence", tiles: [tileName(first), tileName(first + 1), tileName(first + 2)] }, ...rest]);
    }
    counts[first] += 1;
    counts[first + 1] += 1;
    counts[first + 2] += 1;
  }

  return results;
}

function detectStandardYaku(decomposition: StandardHandDecomposition, input: HandScoreInput): YakuResult[] {
  const yaku: YakuResult[] = [];
  const allTiles = decompositionTiles(decomposition);

  for (const group of decomposition.melds) {
    if (group.kind !== "triplet") continue;
    const tile = group.tiles[0]!;
    if (DRAGONS.has(tile)) yaku.push({ name: "役牌", han: 1 });
    if (tile === input.roundWind) yaku.push({ name: "役牌", han: 1 });
    if (tile === input.seatWind) yaku.push({ name: "役牌", han: 1 });
  }

  if (allTiles.every(isSimple)) yaku.push({ name: "断么九", han: 1 });
  if (isPinfu(decomposition, input)) yaku.push({ name: "平和", han: 1 });

  const sequencePairs = identicalSequencePairCount(decomposition.melds);
  if (sequencePairs >= 2) yaku.push({ name: "二盃口", han: 3 });
  else if (sequencePairs === 1) yaku.push({ name: "一盃口", han: 1 });

  if (hasSanshokuDoujun(decomposition.melds)) yaku.push({ name: "三色同順", han: 2 });
  if (concealedTripletCount(decomposition, input) >= 3) yaku.push({ name: "三暗刻", han: 2 });
  if (decomposition.melds.every((group) => group.kind === "triplet")) yaku.push({ name: "対々和", han: 2 });

  const flushSuit = singleNumberSuit(allTiles);
  const hasHonor = allTiles.some((tile) => tileIndex(tile) >= 27);
  if (flushSuit != null && hasHonor) yaku.push({ name: "混一色", han: 3 });
  else if (flushSuit != null) yaku.push({ name: "清一色", han: 6 });

  return yaku;
}

function calculateStandardFu(decomposition: StandardHandDecomposition, input: HandScoreInput): FuResult {
  const items: FuItem[] = [{ label: "副底20符", fu: 20 }];
  if (input.winMethod === "ron") items.push({ label: "門前ロン10符", fu: 10 });

  const pairFu = valuePairFu(decomposition.pair, input);
  if (pairFu) items.push({ label: "役牌雀頭", fu: pairFu });

  const waitFuValue = waitFu(decomposition, input.winningTile);
  if (waitFuValue) items.push({ label: "待ち符", fu: waitFuValue });

  for (const group of decomposition.melds) {
    if (group.kind !== "triplet") continue;
    const isOpenByRon = input.winMethod === "ron" && group.tiles.includes(input.winningTile) && waitFuValue === 0;
    items.push({ label: isOpenByRon ? "明刻" : "暗刻", fu: tripletFu(group.tiles[0]!, isOpenByRon) });
  }

  const pinfuShape = isPinfuShape(decomposition, input);
  if (input.winMethod === "tsumo" && !pinfuShape) items.push({ label: "ツモ2符", fu: 2 });

  const total = items.reduce((sum, item) => sum + item.fu, 0);
  let rounded = input.winMethod === "tsumo" && pinfuShape ? 20 : roundFu(total);
  if (input.winMethod === "ron" && rounded === 20) rounded = 30;
  return { totalBeforeRounding: total, roundedFu: rounded, items };
}

function situationalYaku(input: HandScoreInput): YakuResult[] {
  const yaku: YakuResult[] = [];
  if (input.doubleRiichi) yaku.push({ name: "ダブルリーチ", han: 2 });
  else if (input.riichi) yaku.push({ name: "リーチ", han: 1 });
  if (input.ippatsu) yaku.push({ name: "一発", han: 1 });
  if (input.winMethod === "tsumo") yaku.push({ name: "門前清自摸和", han: 1 });
  return yaku;
}

function chiitoitsuCompatibleYaku(counts: Counts34): YakuResult[] {
  const usedIndexes = counts.flatMap((count, index) => (count > 0 ? [index] : []));
  const yaku: YakuResult[] = [];
  if (usedIndexes.every((index) => index < 27 && index % 9 !== 0 && index % 9 !== 8)) yaku.push({ name: "断么九", han: 1 });

  const suits = new Set(usedIndexes.filter((index) => index < 27).map((index) => Math.floor(index / 9)));
  const hasHonor = usedIndexes.some((index) => index >= 27);
  if (suits.size === 1 && hasHonor) yaku.push({ name: "混一色", han: 3 });
  else if (suits.size === 1) yaku.push({ name: "清一色", han: 6 });
  return yaku;
}

function isPinfu(decomposition: StandardHandDecomposition, input: HandScoreInput): boolean {
  return isPinfuShape(decomposition, input);
}

function isPinfuShape(decomposition: StandardHandDecomposition, input: HandScoreInput): boolean {
  if (decomposition.melds.some((group) => group.kind !== "sequence")) return false;
  if (valuePairFu(decomposition.pair, input) !== 0) return false;
  return waitFu(decomposition, input.winningTile) === 0;
}

function valuePairFu(pair: HandGroup, input: HandScoreInput): number {
  const tile = pair.tiles[0]!;
  let fu = 0;
  if (DRAGONS.has(tile)) fu += 2;
  if (tile === input.roundWind) fu += 2;
  if (tile === input.seatWind) fu += 2;
  return fu;
}

function waitFu(decomposition: StandardHandDecomposition, winningTile: Tile): number {
  if (decomposition.pair.tiles[0] === winningTile) return 2;
  const winningIndex = tileIndex(winningTile);
  for (const group of decomposition.melds) {
    if (group.kind !== "sequence" || !group.tiles.includes(winningTile)) continue;
    const indexes = group.tiles.map(tileIndex);
    if (indexes[1] === winningIndex) return 2;
    if (indexes[0]! % 9 === 0 && indexes[2] === winningIndex) return 2;
    if (indexes[0]! % 9 === 6 && indexes[0] === winningIndex) return 2;
  }
  return 0;
}

function concealedTripletCount(decomposition: StandardHandDecomposition, input: HandScoreInput): number {
  return decomposition.melds.filter((group) => {
    if (group.kind !== "triplet") return false;
    if (input.winMethod === "ron" && group.tiles.includes(input.winningTile)) return false;
    return true;
  }).length;
}

function identicalSequencePairCount(groups: HandGroup[]): number {
  const counts = new Map<string, number>();
  for (const group of groups) {
    if (group.kind !== "sequence") continue;
    const key = sequenceKey(group).join(",");
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.values()].reduce((sum, count) => sum + Math.floor(count / 2), 0);
}

function hasSanshokuDoujun(groups: HandGroup[]): boolean {
  const starts = new Map<number, Set<number>>();
  for (const group of groups) {
    if (group.kind !== "sequence") continue;
    const [suit, start] = sequenceKey(group);
    if (!starts.has(start)) starts.set(start, new Set());
    starts.get(start)!.add(suit);
  }
  return [...starts.values()].some((suits) => suits.size === 3);
}

function sequenceKey(group: HandGroup): [number, number] {
  const indexes = group.tiles.map(tileIndex).sort((a, b) => a - b);
  return [Math.floor(indexes[0]! / 9), indexes[0]! % 9];
}

function decompositionTiles(decomposition: StandardHandDecomposition): Tile[] {
  return [...decomposition.melds.flatMap((group) => group.tiles), ...decomposition.pair.tiles];
}

function uniqueDecompositions(decompositions: StandardHandDecomposition[]): StandardHandDecomposition[] {
  const seen = new Set<string>();
  const unique: StandardHandDecomposition[] = [];
  for (const decomposition of decompositions) {
    const key = [
      `pair:${decomposition.pair.tiles.join("")}`,
      ...decomposition.melds.map((group) => `${group.kind}:${group.tiles.join("")}`).sort()
    ].join("|");
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push({ pair: decomposition.pair, melds: decomposition.melds.slice().sort((a, b) => a.tiles.join("").localeCompare(b.tiles.join(""))) });
  }
  return unique;
}

function scoreRank(result: HandScoreResult): number {
  return result.score.totalPoints * 100000 + result.score.han * 100 + (result.score.fu ?? 0);
}

function tripletFu(tile: Tile, isOpen: boolean): number {
  if (isTerminalOrHonor(tile)) return isOpen ? 4 : 8;
  return isOpen ? 2 : 4;
}

function isTerminalOrHonor(tile: Tile): boolean {
  const index = tileIndex(tile);
  return index >= 27 || index % 9 === 0 || index % 9 === 8;
}

function isSimple(tile: Tile): boolean {
  const index = tileIndex(tile);
  return index < 27 && index % 9 !== 0 && index % 9 !== 8;
}

function singleNumberSuit(tiles: Tile[]): number | null {
  const suits = new Set(tiles.filter((tile) => tileIndex(tile) < 27).map((tile) => Math.floor(tileIndex(tile) / 9)));
  return suits.size === 1 ? [...suits][0]! : null;
}

function isChiitoitsu(counts: Counts34): boolean {
  return counts.reduce((sum, count) => sum + count, 0) === 14 && counts.filter((count) => count === 2).length === 7;
}

function isKokushi(counts: Counts34): boolean {
  const terminalsAndHonors = new Set([0, 8, 9, 17, 18, 26, 27, 28, 29, 30, 31, 32, 33]);
  if (counts.reduce((sum, count) => sum + count, 0) !== 14) return false;
  for (const index of terminalsAndHonors) {
    if (counts[index]! === 0) return false;
  }
  return counts.every((count, index) => count === 0 || terminalsAndHonors.has(index)) && [...terminalsAndHonors].some((index) => counts[index]! === 2);
}

function canStartSequence(index: number): boolean {
  return index < 27 && index % 9 <= 6;
}

function roundFu(value: number): number {
  return Math.ceil(value / 10) * 10;
}

function validateHandScoreInput(input: HandScoreInput): void {
  validateCounts(input.counts, 14);
  if (!countsToTiles(input.counts).includes(input.winningTile)) {
    throw new Error("和了牌は手牌の中から選んでください。");
  }
  if (!WINDS.has(input.roundWind) || !WINDS.has(input.seatWind)) {
    throw new Error("場風と自風は風牌を選んでください。");
  }
  if ((input.dora ?? 0) < 0) throw new Error("ドラは0以上で入力してください。");
}

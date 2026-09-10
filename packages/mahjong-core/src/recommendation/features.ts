import { normalShanten } from "../shanten";
import { chiitoitsuShanten } from "../chiitoitsu";
import { SUITS, TILE_NAMES, tileIndex, tileName, sumCounts, type Counts34, type Tile } from "../tiles";
import { LruCache, compactCountsKey } from "../performance";
import { DEFAULT_STRATEGY_SETTINGS, type HandBlocks, type HandFeatures, type StrategySettings } from "./types";

export const TERMINAL_HONOR_INDICES = [0, 8, 9, 17, 18, 26, 27, 28, 29, 30, 31, 32, 33] as const;
export const SUIT_LABELS = ["萬子", "筒子", "索子"] as const;
const blockCache = new LruCache<string, HandBlocks>(8_000);
const effectiveTileCache = new LruCache<string, number[]>(8_000);

export function validateStrategyHand(counts: Counts34, settings: StrategySettings, total = 13): void {
  if (counts.length !== 34 || counts.some((n) => !Number.isInteger(n) || n < 0 || n > 4) || sumCounts(counts) !== total) {
    throw new Error(`配牌は各牌4枚まで、合計${total}枚で入力してください。`);
  }
  if (!["東", "南", "西", "北"].includes(settings.roundWind) || !["東", "南", "西", "北"].includes(settings.seatWind)) {
    throw new Error("場風・自風は東・南・西・北から選んでください。");
  }
  if (settings.doraIndicator != null && counts[tileIndex(settings.doraIndicator)]! >= 4) {
    throw new Error("ドラ表示牌と手牌を合わせて同じ牌が5枚になっています。");
  }
}

export function doraFromIndicator(indicator: Tile): Tile {
  const index = tileIndex(indicator);
  if (index < 27) return tileName(Math.floor(index / 9) * 9 + (index + 1) % 9);
  if (index < 31) return tileName(27 + (index - 27 + 1) % 4);
  return tileName(31 + (index - 31 + 1) % 3);
}

export function kokushiShantenForStrategy(counts: Counts34): number {
  const kinds = TERMINAL_HONOR_INDICES.filter((i) => counts[i]! > 0).length;
  const hasPair = TERMINAL_HONOR_INDICES.some((i) => counts[i]! >= 2);
  return 13 - kinds - Number(hasPair);
}

export function availableForStrategy(counts: Counts34, settings: StrategySettings): Counts34 {
  const available = counts.map((count) => 4 - count);
  if (settings.doraIndicator != null) available[tileIndex(settings.doraIndicator)] -= 1;
  return available;
}

// Select one disjoint decomposition; overlapping 234/345 seeds are never counted as two blocks.
export function extractHandBlocks(counts: Counts34): HandBlocks {
  const key = compactCountsKey(counts);
  const cached = blockCache.get(key);
  if (cached) return cached;
  const first = counts.findIndex((n) => n > 0);
  if (first < 0) return { melds: 0, sequences: 0, taatsu: 0, ryanmen: 0, kanchan: 0, penchan: 0, pairs: 0, isolated: 0 };
  const branch = (indices: number[], kind: keyof HandBlocks): HandBlocks => {
    const next = counts.slice();
    indices.forEach((i) => { next[i] -= 1; });
    const blocks = { ...extractHandBlocks(next) };
    blocks[kind] += 1;
    if (kind === "sequences") blocks.melds += 1;
    if (["ryanmen", "kanchan", "penchan", "pairs"].includes(kind)) blocks.taatsu += 1;
    return blocks;
  };
  const choices = [branch([first], "isolated")];
  if (counts[first]! >= 3) choices.push(branch([first, first, first], "melds"));
  if (counts[first]! >= 2) choices.push(branch([first, first], "pairs"));
  if (first < 27) {
    const rank = first % 9;
    if (rank <= 6 && counts[first + 1]! && counts[first + 2]!) choices.push(branch([first, first + 1, first + 2], "sequences"));
    if (rank <= 7 && counts[first + 1]!) choices.push(branch([first, first + 1], rank === 0 || rank === 7 ? "penchan" : "ryanmen"));
    if (rank <= 6 && counts[first + 2]!) choices.push(branch([first, first + 2], "kanchan"));
  }
  const strength = (b: HandBlocks) => b.melds * 100 + b.taatsu * 25 + b.ryanmen * 3 + Math.min(1, b.pairs) * 2;
  choices.sort((a, b) => strength(b) - strength(a));
  blockCache.set(key, choices[0]!);
  return choices[0]!;
}

export function extractHandFeatures(
  counts: Counts34,
  settings: StrategySettings = DEFAULT_STRATEGY_SETTINGS,
  available = availableForStrategy(counts, settings),
): HandFeatures {
  validateStrategyHand(counts, settings);
  const normal = normalShanten(counts);
  const key = compactCountsKey(counts);
  let effectiveIndices = effectiveTileCache.get(key);
  if (!effectiveIndices) {
    effectiveIndices = [];
    for (let i = 0; i < 34; i += 1) {
      if (counts[i]! >= 4) continue;
      const drawn = counts.slice();
      drawn[i] += 1;
      if (normalShanten(drawn) < normal) effectiveIndices.push(i);
    }
    effectiveTileCache.set(key, effectiveIndices);
  }
  // Cache structural improvement only; live counts vary with the indicator and hypothetical discards.
  const normalEffectiveTiles = effectiveIndices.filter((i) => available[i]! > 0).map(tileName);
  const blocks = extractHandBlocks(counts);
  const valueIndices = [...new Set([31, 32, 33, tileIndex(settings.roundWind), tileIndex(settings.seatWind)])];
  const yakuhai = valueIndices.map((i) => ({
    tile: tileName(i), count: counts[i]!, live: available[i]!,
    han: Number(i >= 31) + Number(i === tileIndex(settings.roundWind)) + Number(i === tileIndex(settings.seatWind)),
  }));
  const dora = settings.doraIndicator == null ? null : doraFromIndicator(settings.doraIndicator);
  return {
    counts: counts.slice(), normalShanten: normal, chiitoitsuShanten: chiitoitsuShanten(counts),
    kokushiShanten: kokushiShantenForStrategy(counts),
    normalEffectiveTiles, normalUkeire: normalEffectiveTiles.reduce((sum, tile) => sum + available[tileIndex(tile)]!, 0),
    pairKinds: counts.filter((n) => n >= 2).length, tripletKinds: counts.filter((n) => n >= 3).length,
    honorCount: sumCounts(counts.slice(27)),
    terminalHonorCount: TERMINAL_HONOR_INDICES.reduce<number>((sum, i) => sum + counts[i]!, 0),
    terminalHonorKinds: TERMINAL_HONOR_INDICES.filter((i) => counts[i]! > 0).length,
    terminalHonorPair: TERMINAL_HONOR_INDICES.some((i) => counts[i]! >= 2),
    suitCounts: SUITS.map((_, i) => sumCounts(counts.slice(i * 9, i * 9 + 9))),
    blocks, fiveBlockCoverage: Math.min(5, blocks.melds + blocks.taatsu),
    sanshoku: Array.from({ length: 7 }, (_, start) => {
      const tilesBySuit = SUITS.map((_, suit) => [0, 1, 2].filter((offset) => counts[suit * 9 + start + offset]! > 0).map((offset) => tileName(suit * 9 + start + offset)));
      return { start: start + 1, tilesBySuit, coverage: tilesBySuit.flat().length, completeSuitCount: tilesBySuit.filter((tiles) => tiles.length === 3).length, weakestSuitCount: Math.min(...tilesBySuit.map((tiles) => tiles.length)) };
    }),
    ittsu: SUITS.map((suit, i) => ({
      suit, tiles: TILE_NAMES.slice(i * 9, i * 9 + 9).filter((_, offset) => counts[i * 9 + offset]! > 0),
      coverage: counts.slice(i * 9, i * 9 + 9).filter((n) => n > 0).length,
      completedSequences: [0, 3, 6].filter((start) => [0, 1, 2].every((offset) => counts[i * 9 + start + offset]! > 0)).length,
    })),
    yakuhai, valuePairKinds: yakuhai.filter((seed) => seed.count === 2).length,
    valueTripletKinds: yakuhai.filter((seed) => seed.count >= 3).length,
    valueHonorCount: yakuhai.reduce((sum, seed) => sum + seed.count, 0),
    dora, doraCount: dora == null ? 0 : counts[tileIndex(dora)]!,
    outsideSeedCount: SUITS.reduce((sum, _, i) => sum + [0, 6].filter((start) => {
      const indices = [0, 1, 2].map((offset) => i * 9 + start + offset);
      return indices.filter((idx) => counts[idx]! > 0).length >= 2;
    }).length, 0),
    iipeikouSeeds: SUITS.reduce((sum, _, i) => sum + Array.from({ length: 7 }, (__, start) => [0, 1, 2].filter((offset) => counts[i * 9 + start + offset]! >= 2).length).filter((pairs) => pairs >= 2).length, 0),
  };
}

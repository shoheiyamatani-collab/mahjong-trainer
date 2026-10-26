import { analyzeDiscards, analyzeHandProgress, calculateHandScore, calculateVisibleUkeire, chiitoitsuShanten, countsToTiles, normalShantenWithOpenMelds, parseHand, tileIndex, validateCounts, type Tile } from "@mahjong-trainer/mahjong-core";
import type { StudyCase, StudyHand } from "./types";

export function publicCounts(example: StudyCase) {
  const counts = parseHand(example.visible ?? "");
  for (const river of example.rivers ?? []) for (const tile of river.tiles) counts[tileIndex(tile)]! += 1;
  validateCounts(counts);
  return counts;
}

export function knownCounts(example: StudyCase, hand: StudyHand) {
  const known = publicCounts(example);
  for (const tile of countsToTiles(parseHand(hand.tiles))) known[tileIndex(tile)]! += 1;
  for (const meld of hand.melds ?? []) for (const tile of meld.tiles) known[tileIndex(tile)]! += 1;
  validateCounts(known);
  return known;
}

export function studyDiscardRows(example: StudyCase, hand: StudyHand) {
  const counts = parseHand(hand.tiles);
  if (!hand.discards?.length) return [];
  const all = analyzeDiscards(counts, { includeTenpaiDetails: false }).map((row) => {
    const discard = row.discard;
    const after = counts.slice();
    after[tileIndex(discard)]! -= 1;
    const ukeire = calculateVisibleUkeire(counts, discard, publicCounts(example), row.ukeire);
    const furiten = hand.ownRiver && row.afterDiscardShanten === 0 ? row.ukeire.some((tile) => hand.ownRiver!.includes(tile)) : undefined;
    return { ...row, ukeire: ukeire.filter((item) => item.remaining > 0).map((item) => item.tile), ukeireTiles: ukeire.reduce((sum, item) => sum + item.remaining, 0), chiitoitsu: chiitoitsuShanten(after), furiten };
  });
  const minShanten = Math.min(...all.map((row) => row.afterDiscardShanten));
  const maxUkeire = Math.max(...all.filter((row) => row.afterDiscardShanten === minShanten).map((row) => row.ukeireTiles));
  const isMaximum = (row: (typeof all)[number]) => row.afterDiscardShanten === minShanten && row.ukeireTiles === maxUkeire;
  const selected = hand.discards.map((discard) => {
    const row = all.find((item) => item.discard === discard);
    if (!row) throw new Error(`Missing study discard: ${example.id}/${discard}`);
    return row;
  });
  if (!selected.some(isMaximum)) selected.push(all.find(isMaximum)!);
  return selected.map((row) => ({ ...row, isMaximum: isMaximum(row) }));
}

export function studyProgress(example: StudyCase, hand: StudyHand) {
  return analyzeHandProgress(parseHand(hand.tiles), hand.melds?.length ?? 0, knownCounts(example, hand));
}

export function studyScores(hand: StudyHand, winMethod: "ron" | "tsumo" = "ron") {
  if (!hand.score) return [];
  const input = hand.score;
  const counts = parseHand(hand.tiles);
  counts[tileIndex(input.winningTile)]! += 1;
  return [false, true].map((riichi) => {
    try {
      const result = calculateHandScore({ counts, winningTile: input.winningTile, isDealer: input.dealer ?? false, seatWind: input.dealer ? "東" : "南", roundWind: "東", winMethod, riichi, dora: input.dora ?? 0 });
      return { riichi, result };
    } catch (error) {
      if (error instanceof Error && error.message === "役がありません。") return { riichi, result: null };
      throw error;
    }
  });
}

export function studyShanten(hand: StudyHand) {
  return normalShantenWithOpenMelds(parseHand(hand.tiles), hand.melds?.length ?? 0);
}

export function checkerHref(hand: string) {
  return `/analysis/mahjong-tool?${new URLSearchParams({ hand: parseHand(hand).join(",") })}#checker-workspace`;
}

export const tileWords = (tiles: Tile[]) => tiles.map((tile) => tile.replace("m", "萬").replace("p", "筒").replace("s", "索")).join("・");
export const shantenWords = (value: number) => value === -1 ? "アガリ形" : value === 0 ? "テンパイ" : `${value}向聴`;

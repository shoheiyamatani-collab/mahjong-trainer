import { normalShanten } from "./shanten";
import { type Counts34, type Tile, tileIndex, tileName, validateCounts } from "./tiles";

export const GOOD_WAIT_THRESHOLD = 5;
export const SUPER_GOOD_WAIT_THRESHOLD = 9;

export interface TenpaiDetail {
  draw: Tile;
  drawTiles: number;
  winningTypes: number;
  winningTiles: number;
  winning: Tile[];
  tenpaiDiscards: Tile[];
}

export interface DiscardAnalysis {
  discard: Tile;
  afterDiscardShanten: number;
  isIishanten: boolean;
  ukeireTypes: number;
  ukeireTiles: number;
  ukeire: Tile[];
  goodShapeTypes: number;
  goodShapeTiles: number;
  goodShapeRate: number;
  superGoodShapeTypes: number;
  superGoodShapeTiles: number;
  superGoodShapeRate: number;
  tenpaiDetails: TenpaiDetail[];
}

export function analyzeDiscards(counts: Counts34): DiscardAnalysis[] {
  validateCounts(counts, 14);
  const results: DiscardAnalysis[] = [];

  counts.forEach((count, discardIndex) => {
    if (count === 0) return;

    const afterDiscard = counts.slice();
    afterDiscard[discardIndex] -= 1;
    const shanten = normalShanten(afterDiscard);
    const ukeire = calculateUkeire(afterDiscard, shanten);
    const tenpaiDetails = shanten === 1 ? calculateTenpaiDetails(afterDiscard, ukeire) : [];
    const goodShapeTiles = tenpaiDetails.filter((detail) => detail.winningTiles >= GOOD_WAIT_THRESHOLD).reduce((sum, detail) => sum + detail.drawTiles, 0);
    const superGoodShapeTiles = tenpaiDetails.filter((detail) => detail.winningTiles >= SUPER_GOOD_WAIT_THRESHOLD).reduce((sum, detail) => sum + detail.drawTiles, 0);
    const ukeireTiles = ukeire.reduce((sum, tile) => sum + 4 - afterDiscard[tileIndex(tile)]!, 0);

    results.push({
      discard: tileName(discardIndex),
      afterDiscardShanten: shanten,
      isIishanten: shanten === 1,
      ukeireTypes: ukeire.length,
      ukeireTiles,
      ukeire,
      goodShapeTypes: tenpaiDetails.filter((detail) => detail.winningTiles >= GOOD_WAIT_THRESHOLD).length,
      goodShapeTiles,
      goodShapeRate: safeRate(goodShapeTiles, ukeireTiles),
      superGoodShapeTypes: tenpaiDetails.filter((detail) => detail.winningTiles >= SUPER_GOOD_WAIT_THRESHOLD).length,
      superGoodShapeTiles,
      superGoodShapeRate: safeRate(superGoodShapeTiles, ukeireTiles),
      tenpaiDetails,
    });
  });

  return results.sort((a, b) => sortValue(b) - sortValue(a));
}

export function bestDiscardsForReview(results: DiscardAnalysis[]): DiscardAnalysis[] {
  if (results.length === 0) return [];
  const bestShanten = Math.min(...results.map((result) => result.afterDiscardShanten));
  const eligible = results.filter((result) => result.afterDiscardShanten === bestShanten);
  const bestTiles = Math.max(...eligible.map((result) => result.ukeireTiles));
  const bestGoodShape = Math.max(...eligible.filter((result) => result.ukeireTiles === bestTiles).map((result) => result.goodShapeTiles));
  return eligible.filter((result) => result.ukeireTiles === bestTiles && result.goodShapeTiles === bestGoodShape);
}

function calculateUkeire(afterDiscard: Counts34, shanten: number): Tile[] {
  const targetShanten = shanten - 1;
  const ukeire: Tile[] = [];
  for (let drawIndex = 0; drawIndex < 34; drawIndex += 1) {
    if (afterDiscard[drawIndex]! >= 4) continue;
    const drawn = afterDiscard.slice();
    drawn[drawIndex] += 1;
    if (normalShanten(drawn) <= targetShanten) {
      ukeire.push(tileName(drawIndex));
    }
  }
  return ukeire;
}

function calculateTenpaiDetails(afterDiscard: Counts34, ukeire: Tile[]): TenpaiDetail[] {
  return ukeire.map((draw) => {
    const drawIndex = tileIndex(draw);
    const drawn = afterDiscard.slice();
    drawn[drawIndex] += 1;

    let bestWinning: Tile[] = [];
    let bestDiscards: Tile[] = [];
    let bestWinningTiles = -1;

    drawn.forEach((count, discardIndex) => {
      if (count === 0) return;
      const tenpai = drawn.slice();
      tenpai[discardIndex] -= 1;
      if (normalShanten(tenpai) !== 0) return;

      const winning = calculateWinningTiles(tenpai);
      const winningTiles = winning.reduce((sum, tile) => sum + 4 - tenpai[tileIndex(tile)]!, 0);
      if (winningTiles > bestWinningTiles) {
        bestWinning = winning;
        bestDiscards = [tileName(discardIndex)];
        bestWinningTiles = winningTiles;
      } else if (winningTiles === bestWinningTiles) {
        bestDiscards.push(tileName(discardIndex));
      }
    });

    return {
      draw,
      drawTiles: 4 - afterDiscard[drawIndex]!,
      winningTypes: bestWinning.length,
      winningTiles: Math.max(bestWinningTiles, 0),
      winning: bestWinning,
      tenpaiDiscards: bestDiscards,
    };
  });
}

function calculateWinningTiles(tenpai: Counts34): Tile[] {
  const winning: Tile[] = [];
  for (let drawIndex = 0; drawIndex < 34; drawIndex += 1) {
    if (tenpai[drawIndex]! >= 4) continue;
    const won = tenpai.slice();
    won[drawIndex] += 1;
    if (normalShanten(won) === -1) {
      winning.push(tileName(drawIndex));
    }
  }
  return winning;
}

function sortValue(result: DiscardAnalysis): number {
  return -result.afterDiscardShanten * 100000 + result.ukeireTypes * 1000 + result.ukeireTiles;
}

function safeRate(numerator: number, denominator: number): number {
  return denominator === 0 ? 0 : numerator / denominator;
}

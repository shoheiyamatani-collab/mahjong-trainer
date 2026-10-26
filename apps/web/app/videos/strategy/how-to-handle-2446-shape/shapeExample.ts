import { countsToTiles, parseHand, tileIndex, type Tile } from "@mahjong-trainer/mahjong-core";

export function get2446ShapeComparison() {
  const shape = parseHand("2446m");
  return (["4m", "2m", "6m"] as Tile[]).map((discard) => {
    const remaining = shape.slice();
    remaining[tileIndex(discard)]! -= 1;
    return { discard, remaining, tiles: countsToTiles(remaining) };
  });
}

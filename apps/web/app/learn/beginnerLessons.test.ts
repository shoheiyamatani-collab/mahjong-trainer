import { analyzeDiscards, analyzeHandProgress, calculateHandScore, parseHand, TILE_NAMES, validateCounts, type Tile } from "@mahjong-trainer/mahjong-core";
import { describe, expect, it } from "vitest";
import { tileAssetName } from "../components/TileFigures";
import { learnTileFiguresBySlug } from "./tileFigureData";

const tileByAsset = new Map(TILE_NAMES.map((tile) => [tileAssetName(tile), tile]));
function tiles(assets: string[]): Tile[] {
  return assets.map((asset) => {
    const tile = tileByAsset.get(asset);
    if (!tile) throw new Error(`Unknown tile asset: ${asset}`);
    return tile;
  });
}

const figures = Object.entries(learnTileFiguresBySlug).flatMap(([slug, entries]) =>
  entries.flatMap((figure) => figure.rows.map((row) => ({ slug, ...row })))
);
const tenpaiRows = figures.filter((row) => row.resultLabel === "待ち" && row.resultTiles && row.tiles.length + (row.meld ? 3 : 0) === 13);

describe("beginner lesson tile figures", () => {
  it.each(tenpaiRows)("checks every wait for $slug / $label", (row) => {
    const hand = parseHand(tiles(row.tiles).join(""));
    const known = parseHand(tiles([...row.tiles, ...(row.meld?.tiles ?? [])]).join(""));
    const result = analyzeHandProgress(hand, row.meld ? 1 : 0, known);
    expect(result.shanten).toBe(0);
    expect(result.waits).toEqual(tiles(row.resultTiles!));
  });

  it("shows a no-yaku win shape with its open meld, not a chanta hand", () => {
    const [row, closed] = learnTileFiguresBySlug["yaku-required"]![0]!.rows;
    const meld = tiles(row!.meld!.tiles).sort();
    const counts = parseHand(tiles(row!.tiles).join(""));
    validateCounts(counts, 11);
    expect(row!.meld!.tiles[row!.meld!.calledIndex!]).toBe("pin5");
    expect(meld).toEqual(["4p", "5p", "6p"]);
    const openInput = {
      counts, melds: [{ kind: "chi", tiles: meld }], winningTile: "9m", isDealer: false,
      winMethod: "ron", roundWind: "東", seatWind: "南", dora: 1
    } as const;
    expect(() => calculateHandScore({ ...openInput, melds: [...openInput.melds] })).toThrow("役がありません。");
    const closedCounts = parseHand([...tiles(closed!.tiles), "9m"].join(""));
    const closedInput = { ...openInput, counts: closedCounts, melds: [], dora: 0 };
    expect(calculateHandScore({ ...closedInput, riichi: true }).yaku.map((yaku) => yaku.name)).toEqual(["リーチ"]);
    expect(calculateHandScore({ ...closedInput, winMethod: "tsumo" }).yaku.map((yaku) => yaku.name)).toEqual(["門前清自摸和"]);
  });

  it("passes the matching 14 tiles to the checker and distinguishes tenpai from one shanten", () => {
    const example = learnTileFiguresBySlug["basic-nanikiru"]![0]!;
    const counts = parseHand(tiles(example.rows[0]!.tiles).join(""));
    const url = new URL(example.link!.href, "https://jongfolio.com");
    expect(url.searchParams.get("hand")).toBe(counts.join(","));
    const options = analyzeDiscards(counts, { includeTenpaiDetails: false });
    expect(options.find(({ discard }) => discard === "西")).toMatchObject({
      afterDiscardShanten: 0, ukeire: tiles(example.rows[1]!.resultTiles!), ukeireTiles: 8,
    });
    expect(options.find(({ discard }) => discard === "3p")).toMatchObject({ afterDiscardShanten: 1 });
  });
});

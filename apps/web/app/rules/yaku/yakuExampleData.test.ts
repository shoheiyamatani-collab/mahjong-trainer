import { describe, expect, it } from "vitest";
import { calculateHandScore, countsToTiles, handProgressShanten, parseHand, TILE_NAMES, tileIndex, validateCounts, type HandScoreInput, type HandScoreMeld, type Tile } from "@mahjong-trainer/mahjong-core";
import { tileAssetName } from "../../components/TileFigures";
import { yakuTileExamples, type YakuTileExample } from "./yakuExampleData";

const assets = new Map(TILE_NAMES.map((tile) => [tileAssetName(tile), tile]));
function tile(asset: string): Tile {
  const result = assets.get(asset);
  if (!result) throw new Error(`Unknown tile asset: ${asset}`);
  return result;
}
function inputFor(name: string, example: YakuTileExample = yakuTileExamples[name]!): HandScoreInput {
  const melds: HandScoreMeld[] = example.blocks.filter((block) => block.meld).map((block) => ({ kind: block.meld!, tiles: block.tiles.map(tile) }));
  const concealed = [...example.blocks.filter((block) => !block.meld).flatMap((block) => block.tiles), example.winningTile];
  return {
    counts: parseHand(concealed.map(tile).join(" ")), melds, winningTile: tile(example.winningTile),
    isDealer: name === "天和", roundWind: "東", seatWind: name === "天和" ? "東" : "南",
    winMethod: ["ツモ", "海底撈月", "嶺上開花", "天和", "地和"].includes(name) ? "tsumo" : "ron",
    riichi: ["リーチ", "一発"].includes(name), ippatsu: name === "一発", doubleRiichi: name === "ダブルリーチ",
    haitei: name === "海底撈月", houtei: name === "河底撈魚", rinshan: name === "嶺上開花", chankan: name === "槍槓"
  };
}
const aliases: Record<string, string> = { タンヤオ: "断么九", ツモ: "門前清自摸和", 海底撈月: "海底摸月" };

describe("yaku index illustrations use the existing hand-score engine", () => {
  it.each(Object.entries(yakuTileExamples))("%s has legal physical tiles and a complete hand", (name, example) => {
    const input = inputFor(name, example);
    const kans = (input.melds ?? []).filter((meld) => meld.kind === "kan" || meld.kind === "ankan").length;
    const all = [...example.blocks.flatMap((block) => block.tiles), example.winningTile];
    validateCounts(parseHand(all.map(tile).join(" ")), 14 + kans);
    expect(countsToTiles(input.counts).length + (input.melds?.length ?? 0) * 3, name).toBe(14);
    expect(handProgressShanten(input.counts, input.melds?.length ?? 0), name).toBe(-1);
    if (["天和", "地和"].includes(name)) return; // Initial-deal timing is not derived from static tiles.
    const result = calculateHandScore(input);
    expect(result.yaku.map((yaku) => yaku.name), name).toContain(aliases[name] ?? name);
  });

  it("does not accidentally illustrate the big version of a small-dragon or small-wind hand", () => {
    expect(calculateHandScore(inputFor("小三元")).yaku.map((yaku) => yaku.name)).not.toContain("大三元");
    expect(calculateHandScore(inputFor("小四喜")).yaku.map((yaku) => yaku.name)).not.toContain("大四喜");
  });

  it("shows an actual fourth tile for rinshan and all three/four kans", () => {
    for (const [name, expected] of [["嶺上開花", 1], ["三槓子", 3], ["四槓子", 4]] as const) {
      const example = yakuTileExamples[name]!;
      const kans = example.blocks.filter((block) => block.meld === "kan" || block.meld === "ankan");
      expect(kans.length, name).toBe(expected);
      for (const block of kans) {
        expect(block.tiles.length).toBe(4);
        expect(new Set(block.tiles).size).toBe(1);
      }
    }
  });

  it("a robbed-kan example leaves the opponent three copies of the winning tile", () => {
    const example = yakuTileExamples.槍槓!;
    const before = parseHand(example.blocks.flatMap((block) => block.tiles).map(tile).join(" "));
    expect(before[tileIndex(tile(example.winningTile))]).toBe(0);
  });

  it("states initial-deal conditions separately from tile-shape validation", () => {
    expect(yakuTileExamples.天和!.condition).toContain("各局の親の最初の14枚");
    expect(yakuTileExamples.地和!.condition).toContain("子の第1ツモ");
    for (const name of ["天和", "地和"]) expect(yakuTileExamples[name]!.condition).toContain("チー・ポン・カンなし");
  });
});

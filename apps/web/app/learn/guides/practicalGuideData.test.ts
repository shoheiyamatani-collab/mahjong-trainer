import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { addTile, analyzeDiscards, analyzeHandProgress, calculateHandScore, calculateOrasuConditions, hasReachedOrasuTarget, parseHand, tileIndex, TILE_NAMES, validateCounts, type OrasuConditionInput, type Tile } from "@mahjong-trainer/mahjong-core";
import { tileAssetName } from "../../components/TileFigures";
import { getLearningGuide, learningGuides } from "./guideData";
import { buildGuideLibrary, filterGuideLibrary } from "./guideLibraryData";
import { fuGuideExamples, practicalGuideHands, practicalLearningGuides } from "./practicalGuideData";

const assetTiles = new Map(TILE_NAMES.map((tile) => [tileAssetName(tile), tile as Tile]));
const fromAssets = (assets: string[]) => parseHand(assets.map((asset) => {
  const tile = assetTiles.get(asset);
  if (!tile) throw new Error(`Unknown article tile asset: ${asset}`);
  return tile;
}).join(" "));
const baseScoreInput = { isDealer: false, roundWind: "東" as Tile, seatWind: "南" as Tile, dora: 0, honba: 0, riichiSticks: 0 };

describe("Practical learning guides", () => {
  it("adds all six routes to the existing searchable library", () => {
    expect(practicalLearningGuides).toHaveLength(6);
    expect(learningGuides).toHaveLength(21);
    expect(new Set(learningGuides.map((guide) => guide.slug)).size).toBe(learningGuides.length);
    const library = buildGuideLibrary(learningGuides);
    for (const guide of practicalLearningGuides) {
      expect(getLearningGuide(guide.slug)).toBe(guide);
      expect(library.find((item) => item.slug === guide.slug)?.title).toBe(guide.title);
      expect(filterGuideLibrary(library, "all", guide.title).some((item) => item.slug === guide.slug)).toBe(true);
      expect(guide.relatedSlugs.every((slug) => getLearningGuide(slug))).toBe(true);
      expect(guide.seoTitle).not.toBe("");
      expect(guide.description).not.toBe("");
      expect(guide.toolLink.href.startsWith("/")).toBe(true);
    }
  });

  it("links from existing material into the new guides", () => {
    const linked = learningGuides.filter((guide) => !practicalLearningGuides.includes(guide)).flatMap((guide) => guide.relatedSlugs);
    expect(linked).toEqual(expect.arrayContaining(practicalLearningGuides.map((guide) => guide.slug)));
  });

  it("has complete comparison tables and links to official rules", () => {
    for (const guide of practicalLearningGuides) {
      for (const section of guide.sections) {
        if (section.table) {
          expect(section.table.caption).not.toBe("");
          expect(section.table.rows.every((row) => row.length === section.table!.headers.length)).toBe(true);
        }
        for (const source of section.sources ?? []) {
          const url = new URL(source.href);
          expect(url.protocol).toBe("https:");
          expect(["tenhou.net", "m-league.jp"]).toContain(url.hostname);
        }
      }
    }
  });

  it("uses existing images, legal tile counts and full 13/14-tile practice hands", () => {
    for (const guide of practicalLearningGuides) {
      const figures = guide.figures.flatMap((figure) => figure.rows.flatMap((row) => [row.tiles, ...(row.resultTiles ? [row.resultTiles] : [])]));
      for (const assets of [...figures, ...guide.practice!.items.map((item) => item.tiles)]) {
        validateCounts(fromAssets(assets));
        for (const asset of assets) expect(existsSync(resolve(process.cwd(), "public/tiles", `${asset}-66-90-l-emb.png`))).toBe(true);
      }
      for (const item of guide.practice!.items) expect([13, 14]).toContain(item.tiles.length);
      for (const row of guide.figures.flatMap((figure) => figure.rows)) {
        if (row.label.includes("13枚")) expect(row.tiles).toHaveLength(13);
        if (row.label.includes("14枚")) expect(row.tiles).toHaveLength(14);
      }
    }
  });

  it("shows exactly the stated ryanmen and kanchan waits", () => {
    const ryanmen = analyzeHandProgress(parseHand(practicalGuideHands.ryanmen));
    expect(ryanmen.shanten).toBe(0);
    expect(ryanmen.waits).toEqual(["3m", "6m"]);
    expect(ryanmen.ukeireCount).toBe(8);
    expect(analyzeHandProgress(parseHand(practicalGuideHands.kanchan)).waits).toEqual(["4m"]);
  });

  it.each(["3m", "6m"] as Tile[])("validates dama and riichi prices for the %s wait", (winningTile) => {
    const counts = addTile(parseHand(practicalGuideHands.ryanmen), winningTile);
    const input = { ...baseScoreInput, counts, winningTile, winMethod: "ron" as const };
    expect(calculateHandScore({ ...input, riichi: false }).score.totalPoints).toBe(2000);
    expect(calculateHandScore({ ...input, riichi: true }).score.totalPoints).toBe(3900);
  });

  it("does not give an ordinary dama ron to the yaku-less kanchan", () => {
    const input = { ...baseScoreInput, counts: addTile(parseHand(practicalGuideHands.kanchan), "4m"), winningTile: "4m" as Tile, winMethod: "ron" as const };
    expect(() => calculateHandScore({ ...input, riichi: false })).toThrow("役がありません");
    expect(calculateHandScore({ ...input, riichi: true }).score.totalPoints).toBe(1300);
    expect(calculateHandScore({ ...input, riichi: false, winMethod: "tsumo" }).yaku.some((yaku) => yaku.name === "門前清自摸和")).toBe(true);
  });

  it("reduces seven theoretical tiles to four, then three, with visible counts", () => {
    const counts = parseHand(practicalGuideHands.visible);
    expect(analyzeHandProgress(counts).ukeireCount).toBe(7);
    const withVisible = (visible: string) => {
      const publicCounts = parseHand(visible);
      return counts.map((count, index) => count + publicCounts[index]!);
    };
    const known = withVisible("33m6m");
    validateCounts(known);
    const result = analyzeHandProgress(counts, 0, known);
    expect(result.ukeire).toEqual([{ tile: "3m", remaining: 1 }, { tile: "6m", remaining: 3 }]);
    expect(result.ukeireCount).toBe(4);
    expect(analyzeHandProgress(counts, 0, withVisible("333m6m")).ukeire).toEqual([{ tile: "6m", remaining: 3 }]);
  });

  it("passes the exact legal 14-tile example to the existing checker", () => {
    const guide = getLearningGuide("visible-tiles-and-ukeire")!;
    const url = new URL(guide.toolLink.href, "https://jongfolio.com");
    const counts = url.searchParams.get("hand")!.split(",").map(Number);
    validateCounts(counts, 14);
    expect(url.pathname).toBe("/analysis/mahjong-tool");
    expect(counts).toEqual(parseHand(practicalGuideHands.checker));
    const nine = analyzeDiscards(counts, { includeTenpaiDetails: false }).find((item) => item.discard === "9m")!;
    expect(nine.afterDiscardShanten).toBe(0);
    expect(nine.ukeire).toEqual(["3m", "6m"]);
    expect(nine.ukeireTiles).toBe(7);
  });

  it("keeps the defense example and visible honors within four copies", () => {
    const hand = parseHand(practicalGuideHands.defense);
    validateCounts(hand, 13);
    expect(hand[tileIndex("東")]).toBe(2);
    const bothRivers = hand.slice();
    bothRivers[tileIndex("東")]! += 2;
    validateCounts(bothRivers);
  });

  it.each(fuGuideExamples)("checks the fu breakdown and price: $label", (example) => {
    validateCounts(parseHand(example.hand), 14);
    const result = calculateHandScore({ ...baseScoreInput, counts: parseHand(example.concealed ?? example.hand), melds: example.melds, winningTile: example.winningTile, winMethod: example.winMethod, riichi: example.riichi });
    expect(result.score.han).toBe(example.han);
    expect(result.fu?.totalBeforeRounding).toBe(example.rawFu);
    expect(result.fu?.roundedFu).toBe(example.fu);
    expect(result.score.totalPoints).toBe(example.points);
  });

  it("checks direct ron, another player's ron and tsumo through the existing orasu calculator", () => {
    const input: OrasuConditionInput = { scores: { east: 32000, south: 27000, west: 22000, north: 19000 }, selfSeat: "south", dealerSeat: "east", targetRank: 1, honba: 0, riichiSticks: 0, tiePolicy: "strict" };
    const result = calculateOrasuConditions(input);
    expect(result.ron.east?.candidate.baseTotalPoints).toBe(2600);
    expect(result.ron.east?.postScores).toEqual({ east: 29400, south: 29600, west: 22000, north: 19000 });
    expect(result.ron.west?.candidate.baseTotalPoints).toBe(5200);
    expect(result.ron.west?.postScores).toEqual({ east: 32000, south: 32200, west: 16800, north: 19000 });
    expect(result.tsumo?.candidate.baseTotalPoints).toBeLessThanOrEqual(4000);
    expect(hasReachedOrasuTarget(result.tsumo!.postScores, "south", 1, "strict")).toBe(true);
    expect(hasReachedOrasuTarget({ east: 30000, south: 31000, west: 21000, north: 18000 }, "south", 1, "strict")).toBe(true);
    expect(hasReachedOrasuTarget({ east: 30000, south: 31000, west: 31000, north: 8000 }, "south", 1, "strict")).toBe(false);
    const ron = calculateHandScore({ ...baseScoreInput, counts: parseHand(fuGuideExamples[2]!.hand), winningTile: "3m", winMethod: "ron", riichi: false, dora: 1 });
    expect(ron.score.totalPoints).toBe(2600);
    expect(ron.yaku.some((yaku) => yaku.name === "リーチ")).toBe(false);
    const tsumo = calculateHandScore({ ...baseScoreInput, counts: parseHand(fuGuideExamples[2]!.hand), winningTile: "3m", winMethod: "tsumo", riichi: false, dora: 1 });
    expect(tsumo.score.totalPoints).toBe(4000);
  });
});

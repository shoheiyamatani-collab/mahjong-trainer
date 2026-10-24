import { describe, expect, it } from "vitest";
import { tileAssetName } from "../components/TileFigures";
import { getYakuArticle, yakuArticles } from "./yakuArticleData";
import { getLearningGuide } from "../learn/guides/guideData";
import { getCheckerLearningResults } from "../tools/toolLearningResults";
import {
  TILE_NAMES, addTile, analyzeHandProgress, calculateHandScore, chiitoitsuShanten,
  parseHand, validateCounts, type HandScoreInput, type Tile
} from "@mahjong-trainer/mahjong-core";

const assets = new Map(TILE_NAMES.map((tile) => [tileAssetName(tile), tile]));
function toTile(asset: string): Tile {
  const tile = assets.get(asset);
  if (!tile) throw new Error(`Unknown tile asset: ${asset}`);
  return tile;
}
function handFromFigure(tiles: string[]) {
  return parseHand(tiles.map(toTile).join(" "));
}
const base: Omit<HandScoreInput, "counts" | "winningTile"> = {
  isDealer: false, winMethod: "ron", roundWind: "東", seatWind: "南",
  riichi: false, ippatsu: false, dora: 0, honba: 0, riichiSticks: 0
};

describe("yaku article examples use the existing scoring and wait engines", () => {
  it.each(yakuArticles)("$slug has a legal complete or tenpai main illustration", (article) => {
    const row = article.figure.rows[0]!;
    const counts = handFromFigure(row.tiles);
    validateCounts(counts, row.tiles.length);
    expect([13, 14]).toContain(row.tiles.length);
    const progress = analyzeHandProgress(counts);
    expect(progress.shanten).toBe(row.tiles.length === 14 ? -1 : 0);
    if (row.tiles.length === 13 && row.resultLabel === "待ち") {
      expect(row.resultTiles!.map(toTile)).toEqual(progress.waits);
    }
  });

  it("the riichi illustration includes both 2p and 5p, not just the apparent pair wait", () => {
    const article = getYakuArticle("reach")!;
    const row = article.figure.rows[0]!;
    const counts = handFromFigure(row.tiles);
    validateCounts(counts, 13);
    const progress = analyzeHandProgress(counts);
    expect(progress.shanten).toBe(0);
    expect(progress.waits).toEqual(["2p", "5p"]);
    expect(row.resultTiles!.map(toTile)).toEqual(progress.waits);
    expect(progress.ukeireCount).toBe(6);
    for (const tile of progress.waits) {
      const result = calculateHandScore({ ...base, counts: addTile(counts, tile), winningTile: tile, riichi: true });
      expect(result.yaku.map((yaku) => yaku.name).sort()).toEqual(["平和", "リーチ", "断么九"].sort());
      expect([result.score.han, result.fu?.roundedFu, result.score.totalPoints]).toEqual([3, 30, 3900]);
    }
    expect(article.strategy!.join("")).toContain("3翻30符で3,900点");
  });

  it("the same tanyao shape loses pinfu, but not tanyao, when 234m is called", () => {
    const article = getYakuArticle("tanyao")!;
    const closed = handFromFigure(article.figure.rows[0]!.tiles);
    validateCounts(closed, 14);
    const closedResult = calculateHandScore({ ...base, counts: closed, winningTile: "6s" });
    expect(closedResult.yaku.map((yaku) => yaku.name).sort()).toEqual(["断么九", "平和"].sort());
    expect([closedResult.score.han, closedResult.fu?.roundedFu, closedResult.score.totalPoints]).toEqual([2, 30, 2000]);

    const row = article.extraFigures![0]!.rows[0]!;
    const meldTiles = row.meld!.tiles.map(toTile);
    validateCounts(handFromFigure([...row.tiles, ...row.meld!.tiles]), 14);
    const open = calculateHandScore({ ...base, counts: handFromFigure(row.tiles), winningTile: "6s", melds: [{ kind: "chi", tiles: meldTiles }] });
    expect(open.yaku.map((yaku) => yaku.name)).toEqual(["断么九"]);
    expect([open.score.han, open.fu?.roundedFu, open.score.totalPoints]).toEqual([1, 30, 1000]);
  });

  it("a white pon prevents tanyao even if all concealed tiles are simple", () => {
    const result = calculateHandScore({
      ...base, counts: parseHand("678m34555p456s"), winningTile: "6s",
      melds: [{ kind: "pon", tiles: ["白", "白", "白"] }]
    });
    expect(result.yaku.map((yaku) => yaku.name)).toEqual(["役牌"]);
  });

  it("the seven-pairs template has exactly seven distinct pairs and the displayed single wait", () => {
    const article = getYakuArticle("chiitoitsu")!;
    const counts = handFromFigure(article.figure.rows[0]!.tiles);
    validateCounts(counts, 14);
    expect(counts.filter((count) => count === 2)).toHaveLength(7);
    expect(chiitoitsuShanten(counts)).toBe(-1);
    const row = article.extraFigures![0]!.rows[0]!;
    const before = handFromFigure(row.tiles);
    validateCounts(before, 13);
    const progress = analyzeHandProgress(before);
    expect(row.resultTiles!.map(toTile)).toEqual(progress.waits);
    expect(progress.waits).toEqual(["東"]);
    expect(progress.ukeireCount).toBe(3);
  });

  it("seven pairs stays at 25 fu for ron, riichi and tsumo", () => {
    const article = getYakuArticle("chiitoitsu")!;
    const counts = handFromFigure(article.figure.rows[0]!.tiles);
    const ron = calculateHandScore({ ...base, counts, winningTile: "東" });
    const riichi = calculateHandScore({ ...base, counts, winningTile: "東", riichi: true });
    const tsumo = calculateHandScore({ ...base, counts, winningTile: "東", winMethod: "tsumo" });
    expect(ron.yaku.map((yaku) => yaku.name)).toEqual(["七対子"]);
    expect([ron.score.han, ron.fu?.roundedFu, ron.score.totalPoints]).toEqual([2, 25, 1600]);
    expect([riichi.score.han, riichi.fu?.roundedFu, riichi.score.totalPoints]).toEqual([3, 25, 3200]);
    expect([tsumo.score.han, tsumo.fu?.roundedFu, tsumo.score.totalPoints]).toEqual([3, 25, 3200]);
    expect(tsumo.score.payments.map((payment) => payment.points)).toEqual([800, 1600]);
    expect(article.strategy!.join("")).toContain("2翻25符で1,600点");
  });

  it("four identical tiles cannot be counted as two pairs", () => {
    expect(chiitoitsuShanten(parseHand("2222m5588m33p44s東東"))).not.toBe(-1);
  });

  it("the good-shape article and its linked hand reproduce the weighted result", () => {
    const guide = getLearningGuide("good-shape-rate")!;
    const example = getCheckerLearningResults()[0]!;
    const counts = handFromFigure(guide.figures[0]!.rows[0]!.tiles);
    validateCounts(counts, 14);
    const url = new URL(guide.toolLink.href, "https://jongfolio.com");
    expect(url.pathname).toBe("/analysis/mahjong-tool");
    expect(url.searchParams.get("hand")).toBe(counts.join(","));
    expect([example.ukeireTiles, example.goodShapeTiles, example.superGoodShapeTiles]).toEqual([54, 30, 18]);
    const table = guide.sections.find((section) => section.table)!.table!;
    expect(table.rows.map((row) => row[2])).toEqual(["54枚", "30 / 54 → 56%", "18 / 54 → 33%"]);
    expect(guide.takeaways.join("")).toContain("アガリ率ではなく");
  });

  it("enhanced articles retain concrete practice, rule sources and learning links", () => {
    for (const slug of ["reach", "tanyao", "chiitoitsu"]) {
      const article = getYakuArticle(slug)!;
      expect(article.practiceQuestion!.choices).toContain(article.practiceQuestion!.answer);
      expect(article.sources!.every((source) => source.href.startsWith("https://tenhou.net/"))).toBe(true);
      expect(article.compatibleYaku!.length).toBeGreaterThanOrEqual(3);
      expect(article.openExplanation).toBeTruthy();
    }
  });
});

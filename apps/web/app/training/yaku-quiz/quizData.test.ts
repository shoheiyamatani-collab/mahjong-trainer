import { describe, expect, it } from "vitest";
import { calculateHandScore, parseHand, TILE_NAMES, validateCounts, type Tile } from "@mahjong-trainer/mahjong-core";
import { tileAssetName } from "../../components/TileFigures";
import { getYakuArticle } from "../../rules/yakuArticleData";
import { yakuQuizQuestions } from "./quizData";

const tileByAsset = new Map(TILE_NAMES.map((tile) => [tileAssetName(tile), tile]));
const engineName = (name: string) => ({ タンヤオ: "断么九", ツモ: "門前清自摸和" }[name] ?? name);

describe("basic yaku quiz conditions and feedback", () => {
  it.each(yakuQuizQuestions)("$id has a legal complete hand and exactly one valid option", (question) => {
    const tiles = question.tiles.map((asset) => {
      const tile = tileByAsset.get(asset);
      if (!tile) throw new Error(`Unknown quiz tile: ${asset}`);
      return tile;
    });
    const counts = parseHand(tiles.join(" "));
    validateCounts(counts, 14);
    expect(tiles).toContain(question.condition.winningTile as Tile);
    const result = calculateHandScore({
      counts, ...question.condition, isDealer: false, roundWind: "東", seatWind: "南",
      ippatsu: false, dora: 0, honba: 0, riichiSticks: 0
    });
    const yaku = result.yaku.map((item) => item.name);
    expect(question.choices.filter((choice) => yaku.includes(engineName(choice)))).toEqual([question.answer]);
    for (const choice of question.choices.filter((choice) => choice !== question.answer)) {
      expect(question.choiceFeedback[choice]?.length).toBeGreaterThan(10);
    }
    expect(question.relatedRuleHref).toBe(`/rules/${question.id}`);
    expect(getYakuArticle(question.id)).toBeDefined();
  });

  it("keeps the original eleven targets and distinct question IDs", () => {
    expect(yakuQuizQuestions).toHaveLength(11);
    expect(new Set(yakuQuizQuestions.map((question) => question.id)).size).toBe(11);
  });
});

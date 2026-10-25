import { describe, expect, it } from "vitest";
import { calculateHandScore, calculateOrasuConditions, parseHand, TILE_NAMES, validateCounts, type Tile } from "@mahjong-trainer/mahjong-core";
import { tileAssetName } from "../../components/TileFigures";
import { getLearningGuide } from "./guideData";
import { orasuExamples } from "../../analysis/orasu-condition/orasuExamples";
import { scoreLearningExamples } from "../../tools/toolLearningExamples";

const assetToTile = new Map<string, Tile>(TILE_NAMES.map((tile) => [tileAssetName(tile), tile]));

describe("score and orasu cross-tool case study", () => {
  it("reproduces the winning hand score and all three placement routes", () => {
    const scoreExample = scoreLearningExamples.find((example) => example.id === "pinfu-ron")!;
    const orasuExample = orasuExamples.find((example) => example.id === "direct-hit")!;
    const score = calculateHandScore({ ...scoreExample.input, counts: parseHand(scoreExample.handText) });
    const standings = calculateOrasuConditions(orasuExample.input);

    expect(score.score.han).toBe(2);
    expect(score.fu?.roundedFu).toBe(30);
    expect(score.score.totalPoints).toBe(2000);
    expect(standings.ron.east?.candidate.baseTotalPoints).toBe(score.score.totalPoints);
    expect(standings.ron.east?.postScores).toEqual({ east: 30000, south: 30500, west: 22000, north: 17500 });
    expect(standings.ron.west?.candidate.baseTotalPoints).toBe(3600);
    expect(standings.tsumo?.postScores).toEqual({ east: 30800, south: 30900, west: 21400, north: 16900 });
  });

  it("publishes a legal hand diagram and links to both calculator presets", () => {
    const guide = getLearningGuide("score-orasu-case-study")!;
    const row = guide.figures[0]!.rows[0]!;
    const assets = [...row.tiles, ...(row.resultTiles ?? [])];
    const hand = parseHand(assets.map((asset) => assetToTile.get(asset) ?? asset).join(" "));

    validateCounts(hand, 14);
    expect(row.tiles).toHaveLength(13);
    expect(row.resultTiles).toHaveLength(1);
    expect(guide.figures[0]?.link?.href).toContain("/tools?example=pinfu-ron");
    expect(guide.toolLink.href).toContain("/analysis/orasu-condition?example=direct-hit");
  });
});

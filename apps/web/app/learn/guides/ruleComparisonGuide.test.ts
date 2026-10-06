import { describe, expect, it } from "vitest";
import { calculateHandScore, normalShantenWithOpenMelds, parseHand, type Tile } from "@mahjong-trainer/mahjong-core";
import { getLearningGuide, learningGuides } from "./guideData";
import { ruleComparisonGuide } from "./ruleComparisonGuide";

const assetToTile = (asset: string): Tile => {
  const suit = { man: "m", pin: "p", sou: "s" }[asset.slice(0, -1)];
  if (suit) return `${asset.at(-1)}${suit}` as Tile;
  return { ji1: "東", ji2: "南", ji3: "西", ji4: "北", ji5: "發", ji6: "白", ji7: "中" }[asset] as Tile;
};

describe("Rule comparison learning guide", () => {
  it("registers a unique static route and valid related guides", () => {
    expect(getLearningGuide(ruleComparisonGuide.slug)).toBe(ruleComparisonGuide);
    expect(new Set(learningGuides.map((guide) => guide.slug)).size).toBe(learningGuides.length);
    expect(ruleComparisonGuide.relatedSlugs.every((slug) => getLearningGuide(slug))).toBe(true);
    expect(getLearningGuide("calling-decision")?.relatedSlugs).toContain(ruleComparisonGuide.slug);
    expect(ruleComparisonGuide.toolLink.href).toBe("/analysis/orasu-condition");
  });

  it("has complete comparison tables and official source links", () => {
    const tables = ruleComparisonGuide.sections.flatMap((section) => section.table ? [section.table] : []);
    expect(tables).toHaveLength(3);
    for (const table of tables) {
      expect(table.caption).not.toBe("");
      expect(table.rows.every((row) => row.length === table.headers.length)).toBe(true);
    }
    const sources = ruleComparisonGuide.sections.flatMap((section) => section.sources ?? []);
    expect(sources.length).toBeGreaterThan(0);
    for (const source of sources) {
      const url = new URL(source.href);
      expect(url.protocol).toBe("https:");
      expect(["tenhou.net", "mahjongsoul.com", "m-league.jp"]).toContain(url.hostname);
    }
  });

  it("uses a legal 13-tile hand and a legal open 13-equivalent hand", () => {
    const [before, after] = ruleComparisonGuide.figures[0]!.rows;
    expect(before!.tiles).toHaveLength(13);
    expect(after!.tiles.length + after!.meld!.tiles.length).toBe(13);
    const allTiles = [...after!.tiles, ...after!.meld!.tiles];
    for (const tile of allTiles) expect(allTiles.filter((value) => value === tile).length).toBeLessThanOrEqual(4);
    expect(normalShantenWithOpenMelds(parseHand(before!.tiles.map(assetToTile).join(" ")), 0)).toBe(1);
    expect(normalShantenWithOpenMelds(parseHand(after!.tiles.map(assetToTile).join(" ")), 1)).toBe(0);
  });

  it("has exactly the shown waits and scores White-only ron at 1000", () => {
    const after = ruleComparisonGuide.figures[0]!.rows[1]!;
    const concealed = after.tiles.map(assetToTile);
    const counts = parseHand(concealed.join(" "));
    const waits: Tile[] = [];
    for (const winningTile of ["1s", "2s", "3s", "4s", "5s", "6s", "7s", "8s", "9s"] as Tile[]) {
      if (normalShantenWithOpenMelds(parseHand([...concealed, winningTile].join(" ")), 1) === -1) waits.push(winningTile);
    }
    expect(waits).toEqual(after.resultTiles!.map(assetToTile));
    expect(counts.reduce((sum, value) => sum + value, 0)).toBe(10);
    for (const winningTile of waits) {
      const result = calculateHandScore({ counts: parseHand([...concealed, winningTile].join(" ")), melds: [{ kind: "pon", tiles: after.meld!.tiles.map(assetToTile) }], winningTile, isDealer: false, winMethod: "ron", roundWind: "南", seatWind: "南", dora: 0, honba: 0, riichiSticks: 0 });
      expect(result.score.totalPoints).toBe(1000);
      expect(result.score.han).toBe(1);
      expect(result.fu?.roundedFu).toBe(30);
    }
  });
});

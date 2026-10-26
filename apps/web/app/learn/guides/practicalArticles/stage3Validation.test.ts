import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { countsToTiles, handProgressShanten, normalShanten, parseHand, TILE_NAMES, tileIndex, type Tile } from "@mahjong-trainer/mahjong-core";
import { practicalArticleSpecs } from "./index";
import { knownCounts, studyDiscardRows, studyProgress } from "./studyAnalysis";
import { practicalArticleApprovals } from "./reviewState";
import { getToolCatalog } from "../../../toolbox/toolCatalog";

describe("stage 3: exhaustive draw checks for all 30 practical articles", () => {
  it.each(practicalArticleSpecs)("checks all tile types in $number $slug", (article) => {
    for (const example of article.cases) {
      for (const hand of example.hands ?? []) {
        const counts = parseHand(hand.tiles);
        const known = knownCounts(example, hand);
        const meldCount = hand.melds?.length ?? 0;
        if (countsToTiles(counts).length + meldCount * 3 === 13) {
          const shanten = handProgressShanten(counts, meldCount);
          const waits: Tile[] = [];
          const ukeire: Array<{ tile: Tile; remaining: number }> = [];
          TILE_NAMES.forEach((tile, index) => {
            if (counts[index]! >= 4) return;
            const drawn = counts.slice();
            drawn[index]! += 1;
            const next = handProgressShanten(drawn, meldCount);
            if (next === -1) waits.push(tile);
            if (next < shanten && known[index]! < 4) ukeire.push({ tile, remaining: 4 - known[index]! });
          });
          expect(studyProgress(example, hand), example.id).toEqual({
            shanten, waits, ukeire, ukeireCount: ukeire.reduce((sum, item) => sum + item.remaining, 0)
          });
        }

        if (!hand.discards?.length) continue;
        expect(meldCount, example.id).toBe(0);
        const alternatives = TILE_NAMES.flatMap((discard, index) => {
          if (!counts[index]) return [];
          const after = counts.slice();
          after[index]! -= 1;
          const shanten = normalShanten(after);
          const effective = TILE_NAMES.filter((_, drawIndex) => {
            if (known[drawIndex]! >= 4) return false;
            const drawn = after.slice();
            drawn[drawIndex]! += 1;
            return normalShanten(drawn) < shanten;
          });
          return [{ discard, shanten, effective, total: effective.reduce((sum, tile) => sum + 4 - known[tileIndex(tile)]!, 0) }];
        });
        const minShanten = Math.min(...alternatives.map((row) => row.shanten));
        const maxUkeire = Math.max(...alternatives.filter((row) => row.shanten === minShanten).map((row) => row.total));
        for (const row of studyDiscardRows(example, hand)) {
          const expected = alternatives.find((candidate) => candidate.discard === row.discard)!;
          expect(row.ukeire, `${example.id}/${row.discard}: complete effective tile list`).toEqual(expected.effective);
          expect(row.ukeireTiles, example.id).toBe(expected.total);
          expect(row.afterDiscardShanten, example.id).toBe(expected.shanten);
          expect(row.isMaximum, example.id).toBe(expected.shanten === minShanten && expected.total === maxUkeire);
        }
      }
    }
  });

  if (process.env.STAGE3_AUDIT_REPORT === "true") it("exports verification coverage without approving publication", () => {
    const articles = practicalArticleSpecs.map((article) => {
      const hands = article.cases.flatMap((example) => example.hands ?? []);
      return {
        number: article.number, slug: article.slug, title: article.title,
        cases: article.cases.length, hands: hands.length,
        discardComparisons: hands.filter((hand) => hand.discards?.length).length,
        waitAssertions: hands.filter((hand) => hand.expectedWaits).length,
        scoreComparisons: hands.filter((hand) => hand.score).length,
        orasuConditions: article.cases.filter((example) => example.orasu).length,
        transitions: article.cases.reduce((sum, example) => sum + (example.transitions?.length ?? 0) + (example.branches?.length ?? 0), 0),
        publicationApproval: practicalArticleApprovals[article.slug] ?? null
      };
    });
    const catalog = getToolCatalog();
    const output = resolve("output/stage3-article-verification.json");
    mkdirSync(resolve("output"), { recursive: true });
    writeFileSync(output, JSON.stringify({ articles, tools: catalog.map(({ id, title, href, training }) => ({ id, title, href, training })) }, null, 2));
    expect(articles).toHaveLength(30);
    expect(catalog.filter((tool) => tool.training)).toHaveLength(11);
  });
});

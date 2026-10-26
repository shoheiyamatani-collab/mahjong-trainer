import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { calculateHandScore, calculateOrasuConditions, calculateOrasuDraw, evaluateRiichiLegality, parseHand, tileIndex, validateCounts } from "@mahjong-trainer/mahjong-core";
import { practicalArticleSpecs, practicalLearningGuides } from "./index";
import { publicCounts, studyDiscardRows, studyScores } from "./studyAnalysis";

const cases = practicalArticleSpecs.flatMap((article) => article.cases);
const scoredHands = cases.flatMap((example) => (example.hands ?? []).filter((hand) => hand.score).map((hand) => ({ id: example.id, hand })));
// Independently specified standard point-table expectations, not snapshots of engine output.
const expectedTsumo: Record<string, number[][]> = {
  "2000": [[3, 20, 2700, 700, 1300], [4, 20, 5200, 1300, 2600]],
  "7700": [[5, 20, 8000, 2000, 4000], [6, 20, 12000, 3000, 6000]],
  "2900": [[3, 20, 3900, 1300], [4, 20, 7800, 2600]],
  "1300": [[2, 40, 2700, 700, 1300], [3, 40, 5200, 1300, 2600]],
  "null": [[1, 30, 1100, 300, 500], [2, 30, 2000, 500, 1000]],
};

describe("stage 2 article calculation regressions", () => {
  it.each(scoredHands)("checks $id tsumo han, fu and dealer/child payments", ({ hand }) => {
    const expected = expectedTsumo[String(hand.score!.expectedRon![0])];
    expect(expected).toBeDefined();
    const results = studyScores(hand, "tsumo");
    expect(results.map(({ result }) => [result!.score.han, result!.fu!.roundedFu, result!.score.totalPoints, ...result!.score.payments.map((payment) => payment.points)])).toEqual(expected);
  });

  it("preserves the whole-wait furiten restriction even if the discarded wait is exhausted", () => {
    const original = cases.find((example) => example.id === "u04")!;
    for (const visible of ["4m", "444m"]) {
      const example = { ...original, visible };
      const hand = example.hands![0]!;
      const row = studyDiscardRows(example, hand).find((item) => item.discard === "9p")!;
      expect(row.afterDiscardShanten).toBe(0);
      expect(row.furiten).toBe(true);
      const counts = parseHand(hand.tiles);
      counts[tileIndex("9p")]! -= 1;
      expect(evaluateRiichiLegality({ counts, ownDiscards: parseHand("4m"), points: 25000, wallTilesRemaining: 20 }).furiten).toBe(true);
      expect(row.ukeire).toContain("1m");
      if (visible === "444m") expect(row.ukeire).not.toContain("4m");
    }
    for (const example of cases) for (const hand of example.hands ?? []) if (hand.ownRiver) {
      const knownPublic = publicCounts(example);
      for (const tile of hand.ownRiver) expect(knownPublic[tileIndex(tile)]).toBeGreaterThan(0);
    }
  });

  it("does not describe the tenth hand's tanyao as riichi-only", () => {
    const example = cases.find((item) => item.id === "u10")!;
    const counts = parseHand(example.hands![0]!.tiles);
    counts[tileIndex("1m")]! -= 1;
    counts[tileIndex("4p")]! += 1;
    validateCounts(counts, 14);
    const result = calculateHandScore({ counts, winningTile: "4p", isDealer: false, seatWind: "南", roundWind: "東", winMethod: "ron" });
    expect(result.yaku.some((yaku) => yaku.name === "断么九")).toBe(true);
    expect(example.situation).toContain("タンヤオ");
    expect(example.situation).not.toContain("リーチのみ");
  });

  it("counts the genbutsu 9s as public in the late-tenpai comparison", () => {
    const example = cases.find((item) => item.id === "tp02")!;
    expect(publicCounts(example)[tileIndex("9s")]).toBe(1);
    const row = studyDiscardRows(example, example.hands![0]!).find((item) => item.discard === "3p")!;
    expect(row.ukeire).toContain("9s");
    expect(row.ukeireTiles).toBe(studyDiscardRows({ ...example, visible: "44p" }, example.hands![0]!).find((item) => item.discard === "3p")!.ukeireTiles - 1);
  });

  it("checks honba, sticks, exact ties and the two draw settlements independently", () => {
    const honba = cases.find((item) => item.id === "hs01")!.orasu!;
    const ron = calculateOrasuConditions(honba).ron.east!;
    expect(ron.candidate.baseTotalPoints).toBe(1000);
    expect(ron.postScores).toEqual({ east: 30400, south: 31100, west: 22000, north: 16500 });
    const tie = cases.find((item) => item.id === "orasu-practice-02")!.orasu!;
    expect(calculateOrasuConditions(tie).ron.east!.candidate.baseTotalPoints).toBe(2000);
    expect(calculateOrasuConditions({ ...tie, tiePolicy: "strict" }).ron.east!.candidate.baseTotalPoints).toBeGreaterThan(2000);
    for (const example of cases.filter((item) => item.drawTenpaiSeats)) {
      const draw = calculateOrasuDraw(example.orasu!.scores, example.drawTenpaiSeats!);
      expect(draw.postScores.south).toBe(example.id === "et01" ? 27000 : 26000);
      expect(Object.values(draw.postScores).reduce((sum, score) => sum + score, 0)).toBe(100000);
    }
  });

  if (process.env.PRACTICAL_ARTICLE_AUDIT_REPORT === "true") it("exports the reviewed catalog for local audit without approving publication", () => {
    const output = resolve(__dirname, "../../../../../..", "output/practical-article-stage2.json");
    mkdirSync(dirname(output), { recursive: true });
    writeFileSync(output, JSON.stringify(practicalLearningGuides.map((guide) => ({ slug: guide.slug, title: guide.title, category: guide.library!.category, level: guide.library!.level, themes: guide.library!.themes, sections: guide.sections.map((section) => section.heading), caseCount: guide.sections.flatMap((section) => section.caseStudies ?? []).length, tools: [guide.toolLink, ...(guide.additionalTools ?? [])], publishedAt: guide.editorial?.publishedAt ?? null })), null, 2));
  });
});

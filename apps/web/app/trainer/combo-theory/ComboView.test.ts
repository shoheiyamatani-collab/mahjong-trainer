import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterAll, describe, expect, it, vi } from "vitest";
import { calculateTileCombos, emptyCounts } from "@mahjong-trainer/mahjong-core";
import { ComboTrainingClient } from "./ComboTrainingClient";
import { ComboExplanation } from "./ComboExplanation";
import { comboTheoryGuide } from "../../learn/guides/comboTheoryGuide";
import { buildGuideLibrary } from "../../learn/guides/guideLibraryData";
import { learningGuides } from "../../learn/guides/guideData";
vi.stubGlobal("React", React);
afterAll(() => vi.unstubAllGlobals());

describe("combo training presentation", () => {
  it("SSR renders four modes without browser APIs or answer spoilers", () => {
    const html = renderToStaticMarkup(React.createElement(ComboTrainingClient));
    for (const mode of ["コンボ数計算", "コンボ数比較", "実戦形式", "シミュレーター"]) expect(html).toContain(mode);
    expect(html).toContain("コンボ数 ≠ 放銃率");
    expect(html).not.toContain('data-correct=');
    expect(html).not.toContain("ターツと計算過程・除外理由");
    expect(html).not.toContain("localStorage");
  });
  it("shows a zeroed furiten term, its original count, tiles, and conditional shanpon", () => {
    const input = { model: "riichi" as const, visibleCounts: emptyCounts(), riichiRiver: emptyCounts() };
    input.visibleCounts[1] = 1; input.riichiRiver[1] = 1;
    const html = renderToStaticMarkup(React.createElement(ComboExplanation, { input, results: [calculateTileCombos(4, input)] }));
    expect(html).toContain("16 → 0");
    expect(html).toContain("本人の河に二萬");
    expect(html).toContain("シャンポンの相方は未指定");
    expect(html).toContain("man3-66-90-l-emb.png");
    expect(html).toContain("コンボ数は放銃率ではありません");
  });
  it("publishes the independent guide with diagrams, sources, FAQ and working links", () => {
    expect(comboTheoryGuide.figures.flatMap(figure => figure.rows).length).toBeGreaterThanOrEqual(5);
    expect(comboTheoryGuide.sections.some(section => section.heading === "FAQ")).toBe(true);
    expect(comboTheoryGuide.sections.flatMap(section => section.sources ?? []).map(source => source.href)).toContain("https://prtimes.jp/main/html/rd/p/000000556.000109856.html");
    expect(comboTheoryGuide.toolLink.href).toBe("/trainer/combo-theory");
    expect(buildGuideLibrary(learningGuides).some(guide => guide.slug === "combo-theory")).toBe(true);
    for (const slug of ["suji-defense", "kabe-defense", "genbutsu-suji-kabe"]) expect(learningGuides.find(guide => guide.slug === slug)?.relatedSlugs).toContain("combo-theory");
  });
});

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterAll, describe, expect, it, vi } from "vitest";
import { AnalysisToolPreviews } from "./AnalysisToolPreviews";

vi.stubGlobal("React", React);
afterAll(() => vi.unstubAllGlobals());

describe("compact analysis tool choices", () => {
  const html = renderToStaticMarkup(React.createElement(AnalysisToolPreviews));
  const cards = html.match(/<article\b[\s\S]*?<\/article>/g)!;

  it("keeps both destinations with one accessible link per card", () => {
    expect(cards).toHaveLength(2);
    expect(cards[0]).toContain('href="#checker-workspace"');
    expect(cards[0]).toContain('aria-label="牌理チェッカーを使う"');
    expect(cards[1]).toContain('href="/analysis/starting-hand"');
    expect(cards[1]).toContain('aria-label="配牌を分析する"');
    for (const card of cards) {
      expect(card.match(/<a\b/g)).toHaveLength(1);
      expect(card).not.toMatch(/<button\b/);
    }
  });

  it("puts the full titles before the small screenshot excerpts", () => {
    expect(cards[0]).toContain("<h3>牌理チェッカー</h3><span>14枚</span>");
    expect(cards[1]).toContain("<h3>配牌分析</h3><span>13枚</span>");
    for (const card of cards) {
      expect(card.indexOf("<h3>")).toBeLessThan(card.indexOf("<figure"));
      expect(card).toContain('loading="lazy"');
      expect(card).toContain("position:absolute");
      expect(card).toContain("toolPreviewViewport");
    }
    expect(cards[0]).toContain('src="/tool-screenshots/analysis-checker.jpg"');
    expect(cards[0]).toContain("aspect-ratio:350 / 220");
    expect(cards[1]).toContain('src="/tool-screenshots/analysis-starting-hand.jpg"');
    expect(cards[1]).toContain("aspect-ratio:320 / 200");
  });

  it("retains a concise explanation of each tool", () => {
    expect(cards[0]).toContain("シャンテン数・受け入れ枚数・良形率");
    expect(cards[1]).toContain("本線と対抗");
    expect(html).toContain('aria-labelledby="analysis-mode-heading"');
    expect(html).toContain('id="analysis-mode-heading"');
  });

  it("uses the shared analysis category rather than inline colors", () => {
    for (const card of cards) {
      expect(card).toContain('data-tone="analysis"');
      expect(card).not.toContain("--analysis-tool-accent");
    }
  });
});

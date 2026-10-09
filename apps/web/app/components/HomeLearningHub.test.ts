import React, { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterAll, afterEach, describe, expect, it, vi } from "vitest";
import { HomeLearningHub, HomeLearningPaths } from "./HomeLearningHub";

vi.stubGlobal("React", React);
afterAll(() => vi.unstubAllGlobals());

const reviewState = vi.hoisted(() => ({ mode: true }));
vi.mock("@mahjong-trainer/content-index-policy", async (importOriginal) => ({
  ...await importOriginal<Record<string, unknown>>(),
  get isAdsenseReviewMode() { return reviewState.mode; }
}));
afterEach(() => { reviewState.mode = true; });

describe("learning-first home presentation", () => {
  it("keeps the review-mode primary navigation focused on original tools", () => {
    const html = renderToStaticMarkup(createElement(HomeLearningHub));
    expect(html).toContain("計算する");
    expect(html).not.toContain("<h2>Mリーグ</h2>");
    expect(html).toContain('action="/toolbox"');
    expect(html).toContain('name="q"');
    expect(html).toContain('href="/analysis/mahjong-tool"');
    expect(html).toContain('href="/trainer/iishanten"');
    const related = renderToStaticMarkup(createElement(HomeLearningPaths));
    expect(related).toContain('href="/videos/strategy"');
    expect(related).toContain('aria-label="動画とMリーグ"');
  });

  it("restores M League and video discovery without changing their URLs", () => {
    reviewState.mode = false;
    expect(renderToStaticMarkup(createElement(HomeLearningHub))).toContain("<h2>Mリーグ</h2>");
    const related = renderToStaticMarkup(createElement(HomeLearningPaths));
    expect(related).toContain("学びを広げる");
    expect(related).toContain("<h3>動画で学ぶ</h3>");
    expect(related).toContain("<h3>Mリーグ</h3>");
    expect(related).toContain('href="/learn/guides"');
  });
});

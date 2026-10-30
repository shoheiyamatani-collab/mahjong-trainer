import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import YakuPage from "./page";
import { yakuTileExamples } from "./yakuExampleData";

describe("yaku index rendering", () => {
  it("renders the same illustrations and condition captions that are validated", () => {
    const html = renderToStaticMarkup(<YakuPage />);
    expect(html.match(/class="yakuCompactFigure"/g)?.length).toBe(Object.keys(yakuTileExamples).length);
    for (const [name, example] of Object.entries(yakuTileExamples)) {
      expect(html, name).toContain(`aria-label="${name}の牌姿例：`);
      if (example.condition) expect(html, name).toContain(`<figcaption>${example.condition}</figcaption>`);
    }
  });

  it("keeps the compact cards without restoring the removed detail buttons", () => {
    const html = renderToStaticMarkup(<YakuPage />);
    expect(html).not.toContain("もう少し詳しく見る");
    expect(html).not.toContain('class="yakuPointList"');
  });

  it("groups kan examples for readable wrapping instead of shrinking eighteen tiles into one line", () => {
    const html = renderToStaticMarkup(<YakuPage />);
    const kanExamples = Object.values(yakuTileExamples).filter((example) => example.blocks.some((block) => block.meld === "kan" || block.meld === "ankan"));
    expect(html.match(/class="yakuTileStrip yakuTileStripWithKans"/g)?.length).toBe(kanExamples.length);
    expect(html).toContain('class="yakuCompactMeld"');
  });
});

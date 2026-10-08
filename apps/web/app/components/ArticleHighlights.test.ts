import { describe, expect, it } from "vitest";
import { getArticleTextParts } from "./ArticleHighlights";
import { learningGuides } from "../learn/guides/guideData";
import { guideArticleEmphasis } from "../learn/guides/guideHighlights";

describe("article emphasis", () => {
  it("preserves unannotated text", () => {
    expect(getArticleTextParts("役と点数を比べます。")).toEqual([{ text: "役と点数を比べます。" }]);
  });

  it("highlights only the exact authored phrase, including repeated occurrences", () => {
    expect(getArticleTextParts("役なしはロン不可。役なしでもツモは可能。", [{ text: "役なし", tone: "caution" }]))
      .toEqual([{ text: "役なし", tone: "caution" }, { text: "はロン不可。" }, { text: "役なし", tone: "caution" }, { text: "でもツモは可能。" }]);
  });

  it("prefers the longest phrase at the same position without duplicating overlapping text", () => {
    const text = "ロンはできません。";
    const parts = getArticleTextParts(text, [{ text: "ロン", tone: "key" }, { text: "ロンはできません", tone: "caution" }]);
    expect(parts).toEqual([{ text: "ロンはできません", tone: "caution" }, { text: "。" }]);
    expect(parts.map((part) => part.text).join("")).toBe(text);
  });

  it("ignores missing and empty phrases and treats markup as literal text", () => {
    const text = "<script>.*</script>";
    expect(getArticleTextParts(text, [{ text: "", tone: "key" }, { text: "missing", tone: "key" }, { text: ".*", tone: "caution" }]))
      .toEqual([{ text: "<script>" }, { text: ".*", tone: "caution" }, { text: "</script>" }]);
    expect(getArticleTextParts("", [{ text: "", tone: "key" }])).toEqual([]);
  });

  it("does not reference missing guide routes", () => {
    expect(Object.keys(guideArticleEmphasis).sort()).toEqual(learningGuides.map((guide) => guide.slug).sort());
  });

  for (const guide of learningGuides) {
    it(`keeps valid emphasis and the complete text for ${guide.slug}`, () => {
      const emphasis = guideArticleEmphasis[guide.slug];
      const paragraphs = guide.sections.flatMap((section) => section.paragraphs);
      expect(emphasis.length).toBeGreaterThan(0);
      expect(new Set(emphasis.map((item) => item.text)).size).toBe(emphasis.length);
      for (const item of emphasis) {
        expect(paragraphs.some((paragraph) => paragraph.includes(item.text)), item.text).toBe(true);
      }
      for (const paragraph of paragraphs) {
        expect(getArticleTextParts(paragraph, emphasis).map((part) => part.text).join("")).toBe(paragraph);
      }
    });
  }
});

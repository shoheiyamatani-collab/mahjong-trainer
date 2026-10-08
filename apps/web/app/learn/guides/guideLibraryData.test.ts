import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { learningGuides } from "./guideData";
import { buildGuideLibrary, filterGuideLibrary, guideLibraryCategories } from "./guideLibraryData";

const library = buildGuideLibrary(learningGuides);

describe("learning guide library", () => {
  it("lists every existing article exactly once without replacing its metadata", () => {
    expect(library.map((item) => item.slug).sort()).toEqual(learningGuides.map((guide) => guide.slug).sort());
    expect(new Set(library.map((item) => item.slug)).size).toBe(library.length);
    for (const item of library) {
      const guide = learningGuides.find((candidate) => candidate.slug === item.slug)!;
      expect(item.title).toBe(guide.title);
      expect(item.description).toBe(guide.description);
    }
  });

  it("uses the existing tile image assets in every non-empty preview", () => {
    for (const item of library) {
      expect(item.preview.length).toBeGreaterThan(0);
      for (const group of item.preview) {
        expect(group.tiles.length).toBeGreaterThan(0);
        for (const tile of group.tiles) expect(existsSync(resolve(process.cwd(), "public/tiles", `${tile}-66-90-l-emb.png`))).toBe(true);
      }
    }
    expect(library.find((item) => item.slug === "score-calculation-practice")!.preview[0].tiles).toHaveLength(14);
  });

  it("filters each category and keeps all items when reset", () => {
    for (const category of guideLibraryCategories) {
      const matches = filterGuideLibrary(library, category.id, "");
      expect(matches.length).toBeGreaterThan(0);
      expect(matches.every((item) => item.category === category.id)).toBe(true);
    }
    expect(filterGuideLibrary(library, "all", " ")).toEqual(library);
  });

  it("normalizes full-width text and accepts multiple Japanese search terms", () => {
    expect(filterGuideLibrary(library, "all", "５ブロック").map((item) => item.slug)).toContain("five-block-theory");
    expect(filterGuideLibrary(library, "all", "スジ　カベ").map((item) => item.slug)).toContain("genbutsu-suji-kabe");
    expect(filterGuideLibrary(library, "all", "mリーグ").map((item) => item.slug)).toContain("rule-differences-and-calling");
  });

  it("combines search and category filters without changing the original collection", () => {
    expect(filterGuideLibrary(library, "scoring", "スジ")).toEqual([]);
    expect(filterGuideLibrary(library, "all", "見つからないテーマ")).toEqual([]);
    expect(filterGuideLibrary(library, "all", "")).toHaveLength(learningGuides.length);
  });
});

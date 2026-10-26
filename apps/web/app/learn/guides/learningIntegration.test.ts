import { describe, expect, it } from "vitest";
import { learningGuides } from "./guideData";
import { buildGuideLibrary, filterGuideLibrary, guideLibraryCategories } from "./guideLibraryData";
import { availablePracticalGuides, practicalLearningGuides, practicalArticleSpecs } from "./practicalArticles";
import { practicalCurriculum } from "./practicalArticles/curriculum";
import { practicalArticleApprovals } from "./practicalArticles/reviewState";
import { buildLearningPaths } from "./learningPathData";
import { relatedPracticeArticles } from "./learningConnections";
import { getToolCatalog } from "../../toolbox/toolCatalog";

const practicalSlugs = new Set(practicalLearningGuides.map((guide) => guide.slug));
const base = learningGuides.filter((guide) => !practicalSlugs.has(guide.slug));
const all = [...base, ...practicalLearningGuides];
const tools = getToolCatalog();

describe("practical learning integration and publication boundaries", () => {
  it("classifies all 53 existing and practical guides into five categories with levels and themes", () => {
    expect(base).toHaveLength(23);
    expect(guideLibraryCategories).toHaveLength(5);
    expect(Object.keys(practicalCurriculum)).toHaveLength(30);
    const library = buildGuideLibrary(all);
    expect(library).toHaveLength(53);
    for (const item of library) {
      expect(["初級", "中級", "上級"]).toContain(item.level);
      expect(item.themes.length).toBeGreaterThanOrEqual(2);
      expect(guideLibraryCategories.some((category) => category.id === item.category)).toBe(true);
    }
    expect(filterGuideLibrary(library, "judgment", "ダマ").map((item) => item.slug)).toContain("dama-value-situations");
    expect(filterGuideLibrary(library, "scoring", "供託").map((item) => item.slug)).toContain("honba-and-sticks-decisions");
    expect(filterGuideLibrary(library, "all", "上級 宣言牌").map((item) => item.slug)).toContain("riichi-tile-wait-candidates");
  });

  it("retains complete, non-placeholder fields and a distinct purpose for every article", () => {
    expect(new Set(practicalArticleSpecs.map((article) => article.distinction)).size).toBe(30);
    for (const guide of practicalLearningGuides) {
      for (const value of [guide.title, guide.seoTitle, guide.description, guide.lead, ...guide.takeaways]) expect(value.trim()).not.toBe("");
      expect(guide.sections.length).toBeGreaterThanOrEqual(5);
      for (const section of guide.sections) {
        expect(section.heading.trim()).not.toBe("");
        expect(section.paragraphs.some((value) => value.trim())).toBe(true);
      }
      for (const tool of [guide.toolLink, ...(guide.additionalTools ?? [])]) expect(tools.some((item) => item.href === tool.href), `${guide.slug} -> ${tool.href}`).toBe(true);
      expect(guide.relatedSlugs.every((slug) => all.some((item) => item.slug === slug))).toBe(true);
    }
  });

  it("builds three six-step paths from available articles and real tools", () => {
    const paths = buildLearningPaths(all);
    expect(paths).toHaveLength(3);
    for (const path of paths) {
      expect(path.steps).toHaveLength(6);
      expect(new Set(path.steps.map((step) => step.href)).size).toBe(6);
      expect(path.steps.at(-1)!.kind).toBe("tool");
      for (const step of path.steps) expect(step.kind === "tool" ? tools.some((tool) => tool.href === step.href) : all.some((guide) => `/learn/guides/${guide.slug}` === step.href)).toBe(true);
    }
  });

  it("does not leak unapproved articles into ordinary paths, lists, or tool backlinks", () => {
    const published = [...base, ...availablePracticalGuides(false)];
    const allowed = new Set(published.map((guide) => `/learn/guides/${guide.slug}`));
    for (const path of buildLearningPaths(published)) for (const step of path.steps) if (step.kind === "article") expect(allowed.has(step.href)).toBe(true);
    for (const tool of tools) for (const guide of relatedPracticeArticles(published, tool.href)) expect(practicalArticleApprovals[guide.slug]).toBeDefined();
    expect(buildGuideLibrary(published)).toHaveLength(23 + Object.keys(practicalArticleApprovals).length);
  });

  it("makes tool backlinks reciprocal rather than linking unrelated pages", () => {
    for (const tool of tools) {
      const guides = relatedPracticeArticles(all, tool.href);
      expect(guides.length).toBeLessThanOrEqual(4);
      for (const guide of guides) expect([guide.toolLink, ...(guide.additionalTools ?? [])].some((link) => link.href === tool.href)).toBe(true);
    }
    expect(relatedPracticeArticles(all, "/trainer/push-or-fold")[0]!.slug).toBe("borderline-push-fold");
    expect(relatedPracticeArticles(all, "/trainer/ukeire-max").map((guide) => guide.slug)).toContain("equal-ukeire-tiebreakers");
    expect(relatedPracticeArticles(all, "/trainer/chinitsu")).toEqual([]);
  });
});

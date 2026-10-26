import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { learningGuides } from "./guideData";
import { LearningPaths } from "./LearningPaths";
import { buildLearningPaths } from "./learningPathData";
import { practicalLearningGuides } from "./practicalArticles";

describe("learning path progressive enhancement", () => {
  it("includes all available route links in initial HTML without requiring JavaScript", () => {
    const guides = [...new Map([...learningGuides, ...practicalLearningGuides].map((guide) => [guide.slug, guide])).values()];
    const html = renderToStaticMarkup(<LearningPaths guides={guides} />);
    for (const path of buildLearningPaths(guides)) {
      expect(html).toContain(`id="learning-path-${path.id}"`);
      for (const step of path.steps) expect(html).toContain(`href="${step.href}"`);
    }
    expect(html.match(/<details\b/g)).toHaveLength(3);
    expect(html.match(/<summary\b/g)).toHaveLength(3);
  });

  it("does not automatically expand every route on an ordinary visit", () => {
    const html = renderToStaticMarkup(<LearningPaths guides={learningGuides} />);
    expect(html).not.toMatch(/<details[^>]*\sopen(?:=|\s|>)/);
  });
});

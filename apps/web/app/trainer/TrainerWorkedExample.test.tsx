import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { TrainerWorkedExample } from "./TrainerWorkedExample";
import { TrainerStudyGuide } from "./TrainerStudyGuide";
import { trainerDefinitions } from "./trainerCatalog";
import { trainerScoreExamples } from "./trainerScoreExamples";

describe("static, practical training lessons", () => {
  it.each(trainerDefinitions)("$slug has its own static lesson with an accessible answer", ({ slug }) => {
    const html = renderToStaticMarkup(<TrainerWorkedExample slug={slug} />);
    expect(html).toContain('id="training-worked-example"');
    expect(html).toContain("<details");
    expect(html).toContain("<summary");
    expect(html).toContain("/tiles/");
    expect(html).toContain('/about#calculation-policy');
    expect(html).not.toContain("iframe");
    expect(html).not.toContain("adsbygoogle");
  });

  it("gives every training page distinct content rather than a repeated generic lesson", () => {
    const html = trainerDefinitions.map(({ slug }) => renderToStaticMarkup(<TrainerWorkedExample slug={slug} />));
    expect(new Set(html).size).toBe(trainerDefinitions.length);
    expect(html.join("")).toContain("15枚");
    expect(html.join("")).toContain("13枚");
    expect(html.join("")).toContain("14枚");
    expect(renderToStaticMarkup(<TrainerWorkedExample slug="missing" />)).toBe("");
  });

  it("loads each score comparison through a distinct existing calculator preset route", () => {
    const html = ["score", "score-hard"].map((slug) => renderToStaticMarkup(<TrainerWorkedExample slug={slug} />)).join("");
    for (const example of trainerScoreExamples) expect(html).toContain(`/tools?example=${example.id}#score-workspace`);
    for (const points of ["1,300", "2,000", "2,600", "1,600"]) expect(html).toContain(`${points}点`);
  });

  it("keeps a full verified hand in the checker link", () => {
    const html = renderToStaticMarkup(<TrainerWorkedExample slug="iishanten" />);
    const href = html.match(/href="([^"]*\/analysis\/mahjong-tool\?hand=[^"]+)"/)?.[1];
    expect(href).toBeTruthy();
    const counts = new URL(href!, "https://jongfolio.com").searchParams.get("hand")!.split(",").map(Number);
    expect(counts).toHaveLength(34);
    expect(counts.reduce((total, count) => total + count, 0)).toBe(14);
  });

  it("the hub offers concrete practice and review, without hiding the existing catalog", () => {
    const html = renderToStaticMarkup(<TrainerStudyGuide />);
    expect(html).toContain('id="training-study-guide"');
    for (const href of ["/trainer/iishanten", "/trainer/seven-tile", "/trainer/score", "/trainer/call-or-pass", "/analysis/mahjong-tool", "/tools", "/learn/roadmap"]) expect(html).toContain(`href="${href}"`);
    expect(html).toContain("どこで結果が変わったか");
    expect(html).toContain("保証するものではありません");
  });
});

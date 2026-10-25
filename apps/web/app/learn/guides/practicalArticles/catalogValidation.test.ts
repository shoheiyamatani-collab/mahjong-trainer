import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { countsToTiles, parseHand } from "@mahjong-trainer/mahjong-core";
import { learningGuides } from "../guideData";
import { buildGuideLibrary } from "../guideLibraryData";
import { tileAssetName } from "../../../components/TileFigures";
import { availablePracticalGuides, practicalArticleManifest, practicalArticleSpecs, practicalLearningGuides } from "./index";
import { parseSharedOrasuCondition } from "../../../analysis/orasu-condition/sharedCondition";
import { practicalArticleApprovals } from "./reviewState";

const guides = [...new Map([...learningGuides, ...practicalLearningGuides].map((guide) => [guide.slug, guide])).values()];

describe("30 practical article catalog and release gating", () => {
  it("retains exactly all 30 requested themes in priority batches", () => {
    expect(practicalArticleSpecs).toHaveLength(30);
    expect(practicalArticleSpecs.map((article) => article.number).sort((a, b) => a - b)).toEqual(Array.from({ length: 30 }, (_, index) => index + 1));
    expect(new Set(practicalArticleSpecs.map((article) => article.slug)).size).toBe(30);
    expect(new Set(practicalArticleSpecs.map((article) => article.title)).size).toBe(30);
    const priorities = practicalArticleSpecs.map((article) => ({ S: 0, A: 1, B: 2 })[article.priority]);
    expect(priorities).toEqual([...priorities].sort());
    expect(practicalArticleSpecs.flatMap((article) => article.cases)).toHaveLength(77);
    for (const entry of practicalArticleManifest) expect(entry.tacticalReview).toBe(practicalArticleApprovals[entry.slug] ? "reviewed" : "editorial-review-needed");
  });

  it("keeps articles awaiting editorial approval out of normal builds", () => {
    expect(availablePracticalGuides(false).map((guide) => guide.slug)).toEqual(Object.keys(practicalArticleApprovals));
    expect(availablePracticalGuides(true)).toHaveLength(30);
    for (const guide of practicalLearningGuides) expect(guide.editorial?.publishedAt).toBe(practicalArticleApprovals[guide.slug]?.publishedAt);
  });

  it("connects every complete article to the existing library and valid destinations", () => {
    const library = buildGuideLibrary(guides);
    expect(library).toHaveLength(53);
    for (const guide of practicalLearningGuides) {
      expect(library.some((item) => item.slug === guide.slug)).toBe(true);
      expect(guide.relatedSlugs.length).toBeGreaterThanOrEqual(2);
      for (const slug of guide.relatedSlugs) expect(guides.some((item) => item.slug === slug), `${guide.slug} -> ${slug}`).toBe(true);
      for (const tool of [guide.toolLink, ...(guide.additionalTools ?? [])]) {
        const pathname = new URL(tool.href, "https://jongfolio.com").pathname;
        const concrete = new URL(`../../../${pathname.replace(/^\//, "")}/page.tsx`, import.meta.url);
        if (!existsSync(concrete)) {
          expect(pathname).toMatch(/^\/trainer\/(iishanten|ukeire-max)$/);
          expect(existsSync(new URL("../../../trainer/[slug]/page.tsx", import.meta.url))).toBe(true);
        }
      }
      const text = [guide.title, guide.description, guide.lead, ...guide.sections.flatMap((section) => section.paragraphs)].join("\n");
      expect(text).not.toMatch(/TODO|TBD|COMING SOON|ダミーテキスト/);
    }
  });

  it("uses real existing tile assets for all 91 hand snapshots and all rivers", () => {
    const cases = practicalArticleSpecs.flatMap((article) => article.cases);
    const hands = cases.flatMap((example) => example.hands ?? []);
    expect(hands).toHaveLength(91);
    const tiles = [...hands.flatMap((hand) => [...countsToTiles(parseHand(hand.tiles)), ...(hand.melds ?? []).flatMap((meld) => meld.tiles)]), ...cases.flatMap((example) => (example.rivers ?? []).flatMap((river) => river.tiles))];
    for (const tile of new Set(tiles)) expect(existsSync(new URL(`../../../../public/tiles/${tileAssetName(tile)}-66-90-l-emb.png`, import.meta.url))).toBe(true);
  });

  it("ignores malformed shared calculator inputs", () => {
    for (const query of ["", "scores=-1,1,2,3", "scores=25000,25000,25000", "scores=25000,25000,25000,25000&self=south&target=1&tie=other", "scores=25000,25000,25000,25000&self=bad&target=1&tie=strict", "scores=25000,25000,25000,25000&self=south&target=1&tie=strict&honba=999999"])
      expect(parseSharedOrasuCondition(new URLSearchParams(query))).toBeNull();
  });
});

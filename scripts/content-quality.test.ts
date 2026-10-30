import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { advancedStrategyChannel, proStrategyChannel, videoChannels } from "../apps/web/app/videos/videoData";
import { getVideoPracticeLinks } from "../apps/web/app/videos/strategy/videoPracticeLinks";
import { efficiencyChapters } from "../apps/web/app/videos/strategy/intermediate-tile-efficiency-26-rules/chapterData";
import { getCompactPoints } from "../apps/web/app/videos/strategy/VideoArticleCompactContent";
import { memorableClips, yakumanClips } from "../apps/mleague/app/clips/highlights/highlight-clips";
import { recentClips } from "../apps/mleague/app/clips/recent-clips";
import { getUkeireProgressExample } from "../apps/web/app/videos/strategy/ukeire-vs-shape-change-basics/ukeireExample";
import { validateCounts } from "../packages/mahjong-core/src/tiles";
import { analyzeDiscards, countsToTiles, normalShanten, parseHand, tileIndex } from "../packages/mahjong-core/src";
import { getBlockComparisonExample } from "../apps/web/app/videos/strategy/block-count-approach/blockExample";
import { startingLearningHands, startingLearningExampleHref } from "../apps/web/app/analysis/starting-hand/learningExampleHands";
import { startingLearningFigures } from "../apps/web/app/analysis/starting-hand/StartingHandLearningGuide";
import { tileAssetName } from "../apps/web/app/components/TileFigures";
import { get2446ShapeComparison } from "../apps/web/app/videos/strategy/how-to-handle-2446-shape/shapeExample";
import { requestedLearningGuides } from "../apps/web/app/learn/guides/requestedGuideData";

const guides = [videoChannels.strategy, advancedStrategyChannel, proStrategyChannel].flatMap((channel) => channel.guides);
const clipLists = { recentClips, yakumanClips, memorableClips };
const root = resolve(__dirname, "..");
const read = (path: string) => readFileSync(resolve(root, path), "utf8").replace(/\r\n/g, "\n");

describe("existing content quality safeguards", () => {
  it("does not present unsourced yaku occurrence rates as statistics or rankings", () => {
    const page = read("apps/web/app/rules/frequent-yaku/page.tsx");
    expect(page).not.toMatch(/出現率の目安|約\d+(?:[〜～]\d+)?%|まずは上位|item\.frequency/);
    expect(page).toContain("統計上の出現率順位ではありません");
    expect(page).toContain("覚えるときの目印");
    expect(page).toContain("item.learningCue");
  });
  it("keeps the footer wordmark readable on the platform's white background", () => {
    const css = read("apps/web/app/platform.css");
    expect(css).toContain(".platformFrame .siteFooterLogo .siteLogoTitle { color: var(--jf-ink); }");
    expect(css).toContain(".platformFrame .siteFooterLogo :is(.siteLogoSub,.siteLogoTagline) { color: var(--jf-body); }");
  });
  it("does not label a partial block completion as a guaranteed full-hand tenpai", () => {
    const figure = requestedLearningGuides.find((guide) => guide.slug === "one-shanten-ukeire")!.figures[0]!;
    expect(figure.description).toContain("手牌全体ではなく部分形");
    expect(figure.description).toContain("全13枚で確認");
    expect(figure.rows.every((row) => row.resultLabel !== "テンパイ牌")).toBe(true);
  });
  it("shows exact partial shapes without pretending they are complete hands", () => {
    const rows = get2446ShapeComparison();
    expect(rows.map((row) => row.tiles)).toEqual([["2m", "4m", "6m"], ["4m", "4m", "6m"], ["2m", "4m", "4m"]]);
    for (const row of rows) {
      validateCounts(row.remaining, 3);
      const restored = row.remaining.slice();
      restored[tileIndex(row.discard)]! += 1;
      expect(restored).toEqual(parseHand("2446m"));
    }
    const page = read("apps/web/app/videos/strategy/how-to-handle-2446-shape/page.tsx");
    expect(page).toContain("手牌14枚ではなく");
    expect(page).not.toContain("カンチャン2つを残す");
    expect(page).not.toContain("四萬切りはピンフを最大限に見る");
  });
  it("verifies all four starting-hand lesson links against the displayed 13 tiles", () => {
    expect(startingLearningFigures).toHaveLength(startingLearningHands.length);
    startingLearningHands.forEach((text, index) => {
      const hand = parseHand(text);
      validateCounts(hand, 13);
      const assets = countsToTiles(hand).map((tile) => tileAssetName(tile)).sort();
      expect(startingLearningFigures[index]!.rows[0]!.tiles.slice().sort()).toEqual(assets);
      const url = new URL(startingLearningExampleHref(index), "https://jongfolio.com");
      expect(url.searchParams.get("hand")).toBe(hand.join(","));
      expect(url.searchParams.has("autoRun")).toBe(false);
      expect(url.hash).toBe("#starting-hand-input");
    });
    expect(read("apps/web/app/analysis/starting-hand/StartingHandAnalysisClient.tsx")).toContain('id="starting-hand-input"');
  });
  it("verifies the six-block comparison using existing shanten and ukeire logic", () => {
    const example = getBlockComparisonExample();
    validateCounts(example.hand, 14);
    expect(example.choices.map((row) => row.discard)).toEqual(["9p", "2s"]);
    expect(example.choices.map((row) => [row.afterDiscardShanten, row.ukeireTypes, row.ukeireTiles])).toEqual([[1, 4, 16], [1, 4, 12]]);
    expect(example.choices.map((row) => row.ukeire)).toEqual([["1s", "4s", "6s", "9s"], ["5m", "9p", "6s", "9s"]]);
    for (const row of example.choices) {
      const after = example.hand.slice();
      after[tileIndex(row.discard)]! -= 1;
      validateCounts(after, 13);
      expect(row.afterDiscardShanten).toBe(normalShanten(after));
      expect(row).toEqual(analyzeDiscards(example.hand).find((result) => result.discard === row.discard));
      expect(row.ukeireTiles).toBe(row.ukeire.reduce((sum, tile) => sum + 4 - after[tileIndex(tile)]!, 0));
      for (const tile of row.ukeire) {
        const drawn = after.slice();
        drawn[tileIndex(tile)]! += 1;
        expect(normalShanten(drawn)).toBeLessThan(row.afterDiscardShanten);
      }
    }
    expect(new URL(example.href, "https://jongfolio.com").searchParams.get("hand")).toBe(example.hand.join(","));
    const page = read("apps/web/app/videos/strategy/block-count-approach/page.tsx");
    expect(page).toContain("6ブロックは、残す5つを比較する");
    expect(page).toContain("動画内の牌姿ではなく");
  });
  it("verifies the video's independent example through the existing checker logic", () => {
    const example = getUkeireProgressExample();
    for (const hand of [example.hand, example.progress.drawnHand, example.shapeChange.drawnHand]) validateCounts(hand, 14);
    validateCounts(example.afterDiscard, 13);
    expect([example.base.afterDiscardShanten, example.base.ukeireTypes, example.base.ukeireTiles]).toEqual([1, 16, 54]);
    expect(example.base.ukeire).toContain("2m");
    expect(example.base.ukeire).not.toContain("5p");
    expect(example.progress.result.afterDiscardShanten).toBe(0);
    expect(example.shapeChange.result.afterDiscardShanten).toBe(1);
    for (const [href, hand] of [[example.originalHref, example.hand], [example.progressHref, example.progress.drawnHand], [example.shapeChangeHref, example.shapeChange.drawnHand]] as const) {
      expect(new URL(href, "https://jongfolio.com").searchParams.get("hand")).toBe(hand.join(","));
    }
  });
  it("does not publish headings whose explanatory body is absent", () => {
    const points = [{ title: "missing" }, { title: "blank", description: " " }, { title: "complete", description: "Explanation" }];
    expect(getCompactPoints(points)).toEqual([points[2]]);
    expect(getCompactPoints([])).toEqual([]);
  });
  it("keeps all 68 video articles and their unique video IDs", () => {
    expect(guides).toHaveLength(68);
    expect(new Set(guides.map((guide) => guide.articleHref)).size).toBe(68);
    expect(new Set(guides.map((guide) => guide.youtubeId)).size).toBe(68);
    for (const guide of guides) {
      expect(guide.youtubeId).toMatch(/^[\w-]{11}$/);
      expect(guide.readingTime).toBeTruthy();
      const links = getVideoPracticeLinks(guide).links;
      expect(new Set(links.map((link) => link.href)).size).toBe(2);
      for (const link of links) expect(link.href).not.toMatch(/^\/videos\//);
    }
  });

  it("renders shared reading time and practice links before books", () => {
    const shared = read("apps/web/app/videos/strategy/VideoLessonArticle.tsx");
    expect(shared).toContain("<VideoReadingTime articleHref={articlePath}");
    expect(shared.indexOf("<VideoPracticeGateway")).toBeLessThan(shared.indexOf("{bookRecommendation}"));
    for (const guide of guides) {
      const file = `apps/web/app${guide.articleHref}/page.tsx`;
      if (!existsSync(resolve(root, file))) continue; // Dynamic lesson/pro routes use the shared renderer.
      const source = read(file);
      if (source.includes("<VideoLessonArticle")) continue;
      expect(source, file).toContain(`<VideoReadingTime articleHref="${guide.articleHref}"`);
      expect(source, file).toContain(`<VideoPracticeGateway articleHref="${guide.articleHref}"`);
      const book = source.search(/<(?:ClearRain|Hirasawa)\w+Book/);
      if (book >= 0) expect(source.indexOf("<VideoPracticeGateway"), file).toBeLessThan(book);
    }
    expect(shared).toContain('publisher: { "@type": "Organization", name: lesson.guide.publisher }');
  });

  it("distinguishes official chapters from the site's editorial checklist", () => {
    expect(efficiencyChapters).toHaveLength(8);
    expect(efficiencyChapters.map((chapter) => chapter.seconds)).toEqual([34, 169, 327, 457, 638, 818, 1102, 1263]);
    const page = read("apps/web/app/videos/strategy/intermediate-tile-efficiency-26-rules/page.tsx");
    expect(page).toContain("動画内の26項目と一対一に対応する解説ではありません");
    expect(page).not.toContain("動画の章順で見る26の判断項目");
    expect(page).toContain('{ label: "亜両面", tiles: ["man4", "man4", "man5", "man6"] }');
  });

  it("has no duplicate or mismatched video IDs within each MLeague list", () => {
    for (const [name, clips] of Object.entries(clipLists)) {
      expect(new Set(clips.map((clip) => clip.id)).size, name).toBe(clips.length);
      for (const clip of clips) {
        expect(clip.id, clip.title).toMatch(/^[\w-]{11}$/);
        const url = new URL(clip.url);
        const id = url.searchParams.get("v") ?? url.pathname.split("/").pop();
        expect(id, clip.url).toBe(clip.id);
      }
    }
  });

  it("keeps operator identity and separates publication dates from checks", () => {
    const about = read("apps/web/app/about/page.tsx");
    expect(about).toContain("運営：雀フォリオ運営");
    expect(about).toContain("動画公開日、対局日、記事更新日、資料確認日は別");
    expect(read("apps/mleague/app/clips/recent/page.tsx")).not.toContain("2026年10月18日に");
    expect(read("apps/web/app/videos/strategy/page.tsx")).not.toContain("これからまとめます");
  });

  it("keeps links to the web app outside the MLeague basePath", () => {
    const guide = read("apps/mleague/app/clips/ClipLearningGuide.tsx");
    expect(guide).toContain('<a className="text-link" href={link.href}');
    expect(guide).not.toContain('from "next/link"');
    for (const path of ["apps/mleague/app/page.tsx", "apps/mleague/app/stats/page.tsx"]) {
      expect(read(path)).not.toMatch(/<Link[^>]*href="\/(?:learn|analysis|tools)\b/);
    }
  });

  it("keeps the practice panel on a full grid row, before the book section", () => {
    expect(read("apps/web/app/videos/strategy/VideoPracticeGateway.module.css")).toContain("grid-column: 1 / -1;");
    expect(read("apps/web/app/globals.css").includes(".videoArticlePage .videoArticleBook {\n  grid-column: 1 / -1;")).toBe(true);
  });

  if (process.env.CONTENT_AUDIT_REPORT === "true") {
    it("exports an audit inventory without changing any content or index policy", () => {
      const target = resolve(root, "output/content-audit-input.json");
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, JSON.stringify({ guides, clipLists, blockExample: getBlockComparisonExample() }, null, 2));
    });
  }
});

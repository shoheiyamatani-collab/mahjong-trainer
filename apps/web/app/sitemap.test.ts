import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { shouldIncludeInSitemap } from "@mahjong-trainer/content-index-policy";
import sitemap from "./sitemap";
import { learnArticles } from "./siteData";
import { learningGuides } from "./learn/guides/guideData";
import { practicalArticleManifest } from "./learn/guides/practicalArticles";
import { standaloneTrainerDefinitions, trainerDefinitions } from "./trainer/trainerCatalog";

beforeEach(() => vi.stubEnv("SITE_URL", "https://jongfolio.com"));
afterEach(() => { vi.unstubAllEnvs(); vi.useRealTimers(); });

describe("public sitemap", () => {
  it("includes every published guide, roadmap lesson and trainer from their source data", () => {
    const urls = new Set(sitemap().map((entry) => entry.url));
    const paths = [
      ...learnArticles.map((article) => `/learn/${article.slug}`),
      ...learningGuides.map((guide) => `/learn/guides/${guide.slug}`),
      ...[...trainerDefinitions, ...standaloneTrainerDefinitions].map((trainer) => `/trainer/${trainer.slug}`),
      "/learn/roadmap", "/analysis/starting-hand/help", "/analysis/mahjong-tool/help",
      "/analysis/mahjong-tool", "/analysis/starting-hand", "/analysis/orasu-condition", "/tools", "/tools/help", "/tools/score-table"
    ];
    for (const path of paths.filter(shouldIncludeInSitemap)) expect(urls.has(`https://jongfolio.com${path}`), path).toBe(true);
    for (const article of practicalArticleManifest.filter((article) => article.release === "ready")) {
      expect(urls.has(`https://jongfolio.com/learn/guides/${article.slug}`), article.slug).toBe(true);
    }
  });

  it("excludes intentional noindex routes and the legacy redirect without changing policy", () => {
    for (const entry of sitemap()) {
      const url = new URL(entry.url);
      expect(shouldIncludeInSitemap(url.pathname)).toBe(true);
      expect(url.origin).toBe("https://jongfolio.com");
      expect(url.search + url.hash).toBe("");
      expect(url.pathname === "/" || !url.pathname.endsWith("/")).toBe(true);
    }
    const paths = sitemap().map((entry) => new URL(entry.url).pathname);
    expect(new Set(paths).size).toBe(paths.length);
    for (const path of ["/training", "/training/tedashi-reading", "/videos/strategy", "/mleague", "/analysis/starting-hand/chanta"]) {
      expect(paths).not.toContain(path);
    }
  });

  it("uses recorded publication/update history and omits dates when history is unavailable", () => {
    const entries = new Map(sitemap().map((entry) => [new URL(entry.url).pathname, entry]));
    for (const guide of learningGuides) {
      const entry = entries.get(`/learn/guides/${guide.slug}`)!;
      if (!guide.editorial) {
        expect(entry.lastModified, guide.slug).toBeUndefined();
        continue;
      }
      const dates = [guide.editorial.createdAt, guide.editorial.updatedAt, guide.editorial.publishedAt]
        .filter((date): date is string => Boolean(date));
      for (const date of dates) {
        expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10)).toBe(date);
      }
      expect(entry.lastModified, guide.slug).toBe(dates.sort().pop());
    }
    expect(entries.get("/analysis/mahjong-tool")!.lastModified).toBeUndefined();
  });

  it("does not refresh lastmod just because a build runs on another day", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-27T00:00:00Z"));
    const first = sitemap();
    vi.setSystemTime(new Date("2027-01-01T00:00:00Z"));
    expect(sitemap()).toEqual(first);
  });
});

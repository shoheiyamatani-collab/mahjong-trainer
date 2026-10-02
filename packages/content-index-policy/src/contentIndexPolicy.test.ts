import { describe, expect, it } from "vitest";
import {
  canShowAdsOnPath,
  getContentIndexStatus,
  getRobotsPolicy,
  shouldIncludeInSitemap,
  shouldIndexPath
} from "./contentIndexPolicy";

describe("content index policy", () => {
  it.each([
    "/",
    "/learn/guides/tile-efficiency-and-ukeire",
    "/analysis/mahjong-tool",
    "/tools/score-table",
    "/trainer",
    "/training/yaku-quiz",
    "/rules/yaku",
    "/about",
    "/privacy",
    "/contact"
  ])("keeps original learning, tool and system content indexable: %s", (path) => {
    expect(shouldIndexPath(path)).toBe(true);
    expect(shouldIncludeInSitemap(path)).toBe(true);
  });

  it.each([
    "/videos/strategy",
    "/videos/strategy/beginner-win-chance-basics",
    "/videos/mleague-clips",
    "/mleague",
    "/mleague/players/oi-takaharu",
    "/mleague/teams/shibuya-abemas"
  ])("keeps improvement-needed content out of search and ads: %s", (path) => {
    expect(getContentIndexStatus(path)).toBe("needs-improvement");
    expect(shouldIndexPath(path)).toBe(false);
    expect(shouldIncludeInSitemap(path)).toBe(false);
    expect(canShowAdsOnPath(path)).toBe(false);
  });

  it("treats unclassified original pages as ready", () => {
    const path = "/new-original-guide";

    expect(getContentIndexStatus(path)).toBe("ready");
    expect(getRobotsPolicy(path)).toEqual({ index: true, follow: true });
    expect(shouldIncludeInSitemap(path)).toBe(true);
    expect(canShowAdsOnPath(path)).toBe(true);
  });
});

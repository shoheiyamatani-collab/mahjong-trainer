import type { MetadataRoute } from "next";
import { learnArticles } from "./siteData";
import { getSiteUrl } from "./seoConfig";
import { siteConfig } from "./siteConfig";
import { yakuArticles } from "./rules/yakuArticleData";
import { advancedStrategyChannel, videoChannels } from "./videos/videoData";

export const dynamic = "force-static";

const staticPaths = [
  "/about",
  "/advertising",
  "/analysis/mahjong-tool",
  "/analysis/starting-hand",
  "/analysis/starting-hand/help",
  "/contact",
  "/learn",
  "/learn/roadmap",
  "/privacy",
  "/rules",
  "/rules/frequent-yaku",
  "/rules/practical-score",
  "/rules/practical-waits",
  "/rules/yaku",
  "/tools",
  "/tools/score-table",
  "/terms",
  "/trainer",
  "/training/yaku-quiz",
  ...(siteConfig.features.showMLeagueLinks ? ["/videos/mleague-clips"] : []),
  "/videos/strategy",
  "/videos/strategy/advanced",
  "/videos/strategy/advanced/calling-read",
  "/videos/strategy/beginner"
];

const analysisRoles = ["chanta", "flush", "chiitoitsu", "ikkitsuukan", "toitoi", "pinfu", "tanyao", "sanshoku", "riichi"];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const videoArticlePaths = [
    ...videoChannels.strategy.guides,
    ...(siteConfig.features.showMLeagueLinks ? videoChannels["mleague-clips"].guides : []),
    ...advancedStrategyChannel.guides
  ].flatMap((guide) => (guide.articleHref ? [guide.articleHref] : []));

  const paths = new Set([
    ...staticPaths,
    ...learnArticles.map((article) => `/learn/${article.slug}`),
    ...yakuArticles.map((article) => `/rules/${article.slug}`),
    ...analysisRoles.map((role) => `/analysis/starting-hand/${role}`),
    ...videoArticlePaths
  ]);

  return Array.from(paths).map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: path.startsWith("/videos/") ? "weekly" : "monthly",
    priority: path === "/analysis/mahjong-tool" ? 1 : path.split("/").length <= 3 ? 0.8 : 0.6
  }));
}

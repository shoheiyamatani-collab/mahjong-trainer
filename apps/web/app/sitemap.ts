import type { MetadataRoute } from "next";
import { shouldIncludeInSitemap } from "@mahjong-trainer/content-index-policy";
import { learnArticles } from "./siteData";
import { getSiteUrl } from "./seoConfig";
import { siteConfig } from "./siteConfig";
import { yakuArticles } from "./rules/yakuArticleData";
import { advancedStrategyChannel, proStrategyChannel, videoChannels } from "./videos/videoData";
import { learningGuides } from "./learn/guides/guideData";
import { isVideoArticleIndexable } from "./videos/strategy/videoSeoPolicy";
import { standaloneTrainerDefinitions, trainerDefinitions } from "./trainer/trainerCatalog";

export const dynamic = "force-static";

const isVideoStandaloneBuild = process.env.VIDEO_STANDALONE_BUILD === "true";
const isVideoSeparate = Boolean(process.env.VIDEO_STANDALONE_URL);

const videoStaticPaths = [
  "/videos/strategy",
  "/videos/strategy/advanced",
  "/videos/strategy/advanced/calling-read",
  "/videos/strategy/beginner",
  "/videos/strategy/pro"
];

const primaryStaticPaths = [
  "/",
  "/about",
  "/advertising",
  "/analysis/mahjong-tool",
  "/analysis/mahjong-tool/help",
  "/analysis/orasu-condition",
  "/analysis/starting-hand",
  "/analysis/starting-hand/help",
  "/contact",
  "/learn",
  "/learn/guides",
  "/learn/glossary",
  "/learn/roadmap",
  "/privacy",
  "/rules",
  "/rules/frequent-yaku",
  "/rules/practical-score",
  "/rules/practical-waits",
  "/rules/yaku",
  "/tools",
  "/toolbox",
  "/tools/help",
  "/tools/score-table",
  "/terms",
  "/trainer",
  ...trainerDefinitions.map(({ slug }) => `/trainer/${slug}`),
  ...standaloneTrainerDefinitions.map(({ slug }) => `/trainer/${slug}`),
  "/trainer/ukeire-max/help",
  "/training/yaku-quiz",
  "/training/tedashi-reading",
  ...(siteConfig.features.showMLeagueLinks ? ["/videos/mleague-clips"] : [])
];

const staticPaths = isVideoStandaloneBuild
  ? videoStaticPaths
  : [...primaryStaticPaths, ...(!isVideoSeparate ? videoStaticPaths : [])];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const authoredDates = new Map<string, string>(learningGuides.flatMap((guide) => {
    if (!guide.editorial) return [];
    // Publication can follow the editorial update; neither date is build time.
    const lastModified = [guide.editorial.createdAt, guide.editorial.updatedAt, guide.editorial.publishedAt]
      .filter((date): date is string => Boolean(date)).sort().pop()!;
    return [[`/learn/guides/${guide.slug}`, lastModified] as const];
  }));
  const videoArticlePaths = isVideoSeparate && !isVideoStandaloneBuild ? [] : [
    ...videoChannels.strategy.guides,
    ...(siteConfig.features.showMLeagueLinks ? videoChannels["mleague-clips"].guides : []),
    ...advancedStrategyChannel.guides,
    ...proStrategyChannel.guides
  ]
    .flatMap((guide) => (guide.articleHref ? [guide.articleHref] : []))
    .filter(isVideoArticleIndexable);

  const paths = new Set([
    ...staticPaths,
    ...(!isVideoStandaloneBuild ? learnArticles.map((article) => `/learn/${article.slug}`) : []),
    ...(!isVideoStandaloneBuild ? learningGuides.map((guide) => `/learn/guides/${guide.slug}`) : []),
    ...(!isVideoStandaloneBuild ? yakuArticles.map((article) => `/rules/${article.slug}`) : []),
    ...videoArticlePaths
  ]);

  return Array.from(paths).filter(shouldIncludeInSitemap).map((path) => ({
    url: `${siteUrl}${path}`,
    ...(authoredDates.has(path) ? { lastModified: authoredDates.get(path)! } : {}),
    changeFrequency: path.startsWith("/videos/") ? "weekly" : "monthly",
    priority: path === "/" || path === "/analysis/mahjong-tool" ? 1 : path.split("/").length <= 3 ? 0.8 : 0.6
  }));
}

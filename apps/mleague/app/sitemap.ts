import type { MetadataRoute } from "next";
import { shouldIncludeInSitemap } from "@mahjong-trainer/content-index-policy";
import { getPublishedPlayers } from "@/lib/mleague/getPlayers";
import { getPublishedTeams } from "@/lib/mleague/getTeams";
import { siteConfig } from "@/config/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "",
    "/stats",
    "/calendar",
    "/players",
    "/teams",
    "/clips",
    "/clips/recent",
    "/clips/highlights",
    "/clips/highlights/yakuman",
    "/clips/highlights/moments",
    "/policy",
  ];

  const paths = [
    ...staticPaths,
    ...getPublishedPlayers().map((player) => `/players/${player.slug}`),
    ...getPublishedTeams().map((team) => `/teams/${team.slug}`),
  ];

  return paths
    .map((path) => `${siteConfig.basePath}${path}`)
    .filter(shouldIncludeInSitemap)
    .map((fullPath) => ({
      url: `${siteConfig.siteOrigin}${fullPath}/`.replace(/\/{2,}$/, "/"),
      changeFrequency:
        fullPath === "/mleague/stats" ? "daily" : fullPath === "/mleague" ? "weekly" : "monthly",
      priority: fullPath === "/mleague" ? 0.9 : fullPath.split("/").length <= 3 ? 0.8 : 0.6,
    }));
}

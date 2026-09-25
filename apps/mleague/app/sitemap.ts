import type { MetadataRoute } from "next";
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

  return paths.map((path) => ({
    url: `${siteConfig.siteOrigin}${siteConfig.basePath}${path}`,
    changeFrequency:
      path === "/stats" ? "daily" : path === "" ? "weekly" : "monthly",
    priority: path === "" ? 0.9 : path.split("/").length <= 2 ? 0.8 : 0.6,
  }));
}

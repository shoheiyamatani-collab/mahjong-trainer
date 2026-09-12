import type { MetadataRoute } from "next";
import { getPublishedPlayers } from "@/lib/mleague/getPlayers";
import { getPublishedTeams } from "@/lib/mleague/getTeams";
import { saikouisenMembers } from "@/lib/saikouisen/members";
import { siteConfig } from "@/config/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "",
    "/players",
    "/teams",
    "/pros",
    "/clips",
    "/clips/recent",
    "/clips/highlights",
    "/policy",
    "/correction-request",
  ];

  const paths = [
    ...staticPaths,
    ...getPublishedPlayers().map((player) => `/players/${player.slug}`),
    ...getPublishedTeams().map((team) => `/teams/${team.slug}`),
    ...saikouisenMembers.map((member) => `/pros/${member.slug}`),
  ];

  return paths.map((path) => ({
    url: `${siteConfig.siteOrigin}${siteConfig.basePath}${path}`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 0.9 : path.split("/").length <= 2 ? 0.8 : 0.6,
  }));
}

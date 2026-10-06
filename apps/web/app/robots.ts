import type { MetadataRoute } from "next";
import { hasIndexablePolicyEntryWithin } from "@mahjong-trainer/content-index-policy";
import { getSiteUrl } from "./seoConfig";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  const sitemaps = [`${siteUrl}/sitemap.xml`];
  if (hasIndexablePolicyEntryWithin("/mleague")) {
    sitemaps.push(`${siteUrl}/mleague/sitemap.xml`);
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/"
    },
    sitemap: sitemaps
  };
}

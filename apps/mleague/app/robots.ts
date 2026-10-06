import type { MetadataRoute } from "next";
import { hasIndexablePolicyEntryWithin } from "@mahjong-trainer/content-index-policy";
import { siteConfig } from "@/config/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const hasIndexablePages = hasIndexablePolicyEntryWithin("/mleague");
  return {
    rules: { userAgent: "*", allow: "/mleague/" },
    ...(hasIndexablePages ? { sitemap: `${siteConfig.siteOrigin}${siteConfig.basePath}/sitemap.xml` } : {})
  };
}

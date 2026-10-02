import type { Metadata } from "next";
import { getRobotsPolicy } from "@mahjong-trainer/content-index-policy";
import { siteConfig } from "@/config/site";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const canonical = `${siteConfig.siteOrigin}${siteConfig.basePath}/players/${slug}/`;
  return { robots: getRobotsPolicy(`/mleague/players/${slug}`), alternates: { canonical }, openGraph: { url: canonical } };
}

export default function PlayerLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}

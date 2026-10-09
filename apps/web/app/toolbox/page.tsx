import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHero } from "../components/SiteSections";
import { getToolCatalog } from "./toolCatalog";
import { ToolDirectory } from "./ToolDirectory";
import { ToolDirectoryQuery } from "./ToolDirectoryQuery";
import approvedTedashi from "../training/tedashi-reading/data/approved.json";
export const metadata: Metadata = { title: "麻雀ツール・トレーニングを探す", description: "牌理チェッカー、何切る、待ち、点数計算、鳴き、押し引きなど、雀フォリオのツールを検索・分野別に選べます。", alternates: { canonical: "/toolbox" } };
export default function ToolboxPage() {
  const items = getToolCatalog(approvedTedashi.length > 0 || process.env.NODE_ENV === "development");
  return <main className="siteMain"><PageHero eyebrow="TOOLBOX" title="ツール・トレーニングを探す" description="調べたいこと、鍛えたい力から選ぶ。" /><Suspense fallback={<ToolDirectory items={items} />}><ToolDirectoryQuery items={items} /></Suspense></main>;
}

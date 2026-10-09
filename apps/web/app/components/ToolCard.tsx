import Link from "next/link";
import { ArrowRight, BookOpen, Calculator, ChartNoAxesColumnIncreasing, Eye, Shield, Target } from "lucide-react";
import { ToolPreviewImage } from "./ToolPreviewImage";
import type { ToolCatalogItem } from "../toolbox/toolCatalog";
const icons = { analysis: Calculator, learning: BookOpen, efficiency: Target, waits: Eye, scoring: Calculator, decisions: Shield };
export function ToolCard({ item }: { item: ToolCatalogItem }) {
  const Icon = icons[item.tone];
  return <article className="platformToolCard" data-tone={item.tone} data-tool={item.id}>
    <Link className="platformToolCardLink" href={item.href} aria-label={`${item.title}${item.training ? "を始める" : "を開く"}`}>
      <header className="platformToolCardHeader"><Icon aria-hidden="true" /><h3>{item.title}</h3></header>
      <div className={`platformToolCardBody${item.screenshot ? "" : " noScreenshot"}`}>
        {item.screenshot ? <ToolPreviewImage screenshot={item.screenshot} /> : null}<p>{item.description}</p>
      </div>
      <div className="platformToolCardFooter"><span className="platformDifficulty"><ChartNoAxesColumnIncreasing aria-hidden="true" />{item.level}</span><span className="platformToolCardAction">{item.training ? "トレーニング開始" : "開く"}<ArrowRight aria-hidden="true" /></span></div>
    </Link>
  </article>;
}

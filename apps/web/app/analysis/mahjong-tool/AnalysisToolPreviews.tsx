import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ToolPreviewImage } from "../../components/ToolPreviewImage";
import { getToolCatalog } from "../../toolbox/toolCatalog";

const catalog = getToolCatalog();
const analysisTools = [
  { ...catalog.find(item => item.id === "checker")!, handSize: "14枚", href: "#checker-workspace", action: "牌理チェッカーを使う", actionLabel: "比較する" },
  { ...catalog.find(item => item.id === "starting-hand")!, handSize: "13枚", action: "配牌を分析する", actionLabel: "分析する" }
];

export function AnalysisToolPreviews() {
  return (
    <section className="analysisToolChoices" aria-labelledby="analysis-mode-heading">
      <h2 id="analysis-mode-heading">調べたい内容から選ぶ</h2>
      <div className="analysisToolPreviewGrid">
        {analysisTools.map((tool) => (
          <article className="analysisToolPreview" data-tone="analysis" key={tool.title}>
            <Link className="analysisToolPreviewLink" href={tool.href} aria-label={tool.action}>
              <header className="analysisToolPreviewHeader">
                <h3>{tool.title}</h3>
                <span>{tool.handSize}</span>
              </header>
              <div className="analysisToolPreviewBody">
                <ToolPreviewImage screenshot={tool.screenshot!} />
                <p>{tool.description}</p>
              </div>
              <span className="analysisToolPreviewAction">
                {tool.actionLabel}<ArrowRight aria-hidden="true" />
              </span>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

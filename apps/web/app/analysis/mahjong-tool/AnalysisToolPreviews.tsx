import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ToolPreviewImage } from "../../components/ToolPreviewImage";

const analysisTools = [
  {
    title: "牌理チェッカー",
    summary: "14枚から、何を切るか比べる",
    description: "打牌候補ごとのシャンテン数・受け入れ枚数・良形率を比較できます。対局で迷った手牌の振り返りに。",
    href: "#checker-workspace",
    action: "牌理チェッカーを使う",
    screenshot: {
      src: "/tool-screenshots/analysis-checker.jpg",
      alt: "牌理チェッカーで打牌候補の有効牌、受け入れ枚数、良形率を比較する画面",
      width: 1217,
      height: 420
    }
  },
  {
    title: "配牌分析",
    summary: "13枚から、狙う手役を考える",
    description: "配牌に合った本線と対抗の構想を比較できます。どんな役を狙うか、次のツモで方針を変えるかを整理するときに。",
    href: "/analysis/starting-hand",
    action: "配牌を分析する",
    screenshot: {
      src: "/tool-screenshots/analysis-starting-hand.jpg",
      alt: "配牌分析で役牌速攻と門前リーチのおすすめ度と理由を比較する画面",
      width: 1144,
      height: 510
    }
  }
];

export function AnalysisToolPreviews() {
  return (
    <section className="analysisToolChoices" aria-labelledby="analysis-mode-heading">
      <h2 id="analysis-mode-heading">調べたい内容から選ぶ</h2>
      <div className="analysisToolPreviewGrid">
        {analysisTools.map((tool) => (
          <article className="analysisToolPreview" key={tool.title}>
            <ToolPreviewImage screenshot={tool.screenshot} href={tool.href} label={tool.action} />
            <p className="analysisToolPreviewSummary">{tool.summary}</p>
            <h3>{tool.title}</h3>
            <p>{tool.description}</p>
            <Link className="toolPreviewAction" href={tool.href}>
              {tool.action}<ArrowRight aria-hidden="true" />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

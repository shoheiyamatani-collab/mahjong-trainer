import type { LearningGuide } from "../guideData";
import { batch1 } from "./batch1";
import { batch2 } from "./batch2";
import { batch3 } from "./batch3";
import { batch4 } from "./batch4";
import { batch5 } from "./batch5";
import { batch6 } from "./batch6";
import type { PracticalArticleSpec } from "./types";
import { practicalArticleApprovals } from "./reviewState";
import { practicalCurriculum } from "./curriculum";
import { getToolCatalog } from "../../../toolbox/toolCatalog";

export const practicalArticleSpecs: PracticalArticleSpec[] = [...batch1, ...batch2, ...batch3, ...batch4, ...batch5, ...batch6];
export const practicalGuidesPreview = process.env.PRACTICAL_GUIDES_PREVIEW === "true";

export const practicalArticleManifest = practicalArticleSpecs.map((article) => ({
  number: article.number, priority: article.priority, slug: article.slug, title: article.title,
  purpose: article.distinction, caseCount: article.cases.length,
  calculation: "calculation-verified" as const,
  tacticalReview: practicalArticleApprovals[article.slug] ? "reviewed" : "editorial-review-needed",
  release: practicalArticleApprovals[article.slug] ? "ready" : "local-preview",
  createdAt: "2026-10-25", updatedAt: "2026-10-26"
}));

export const practicalLearningGuides: LearningGuide[] = practicalArticleSpecs.map((article) => {
  const curriculum = practicalCurriculum[article.number];
  if (!curriculum) throw new Error(`Missing practical article curriculum: ${article.number}`);
  const practice = curriculum.practice ? getToolCatalog().find((tool) => tool.id === curriculum.practice) : undefined;
  if (curriculum.practice && !practice) throw new Error(`Missing practical training: ${curriculum.practice}`);
  const tools = [...new Map([...article.tools, ...(practice ? [{ href: practice.href, label: practice.title, description: practice.description }] : [])].map((tool) => [tool.href, tool])).values()];
  return {
  slug: article.slug, title: article.title, seoTitle: `${article.title}｜牌姿で学ぶ実戦判断`, description: article.description,
  lead: article.lead, takeaways: article.points,
  sections: [
    ...article.sections,
    { heading: "具体的な局面で比べる", paragraphs: ["以下は雀フォリオ運営が学習用に構成した局面です。特記がない例は4人打ちリーチ麻雀、赤牌なし。複数の手牌を並べる箇所は、前後の変化または別々の候補として表示しています。"], caseStudies: article.cases },
    { heading: "間違えやすい考え方", paragraphs: article.mistakes },
    { heading: "次の対局で使う手順", paragraphs: article.application },
    { heading: "前提と判断の限界", paragraphs: [article.limit], sources: [{ label: "Mリーグ公式戦ルール（成立条件・点数の確認）", href: "https://m-league.jp/about/" }, { label: "天鳳公式マニュアル（ルール差の確認）", href: "https://tenhou.net/man/" }] }
  ],
  figures: [], toolLink: tools[0]!, additionalTools: tools.slice(1), relatedSlugs: article.related,
  editorial: { createdAt: "2026-10-25", updatedAt: "2026-10-26", publishedAt: practicalArticleApprovals[article.slug]?.publishedAt },
  library: { category: curriculum.category ?? article.category, keywords: article.keywords, level: curriculum.level, themes: curriculum.themes }
}; });

export function availablePracticalGuides(preview = practicalGuidesPreview) {
  return practicalLearningGuides.filter((guide) => preview || practicalArticleManifest.find((entry) => entry.slug === guide.slug)?.release === "ready");
}

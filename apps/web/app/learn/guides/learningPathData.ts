import type { LearningGuide } from "./guideData";
import { getToolCatalog } from "../../toolbox/toolCatalog";

// The caller supplies only articles allowed by the existing publication gate.
type LearningStep = { slug: string } | { tool: string };
export const learningPathDefinitions: { id: string; title: string; tone: string; steps: LearningStep[] }[] = [
  { id: "efficiency", title: "何切るを強くする", tone: "efficiency", steps: [
    { slug: "five-block-theory" }, { slug: "tile-efficiency-and-ukeire" }, { slug: "equal-ukeire-tiebreakers" },
    { slug: "dora-versus-speed" }, { slug: "take-tenpai-or-improve" }, { tool: "checker" },
  ] },
  { id: "defense", title: "守備と捨て牌読みを学ぶ", tone: "decisions", steps: [
    { slug: "genbutsu-suji-kabe" }, { slug: "riichi-tile-wait-candidates" }, { slug: "tedashi-tsumogiri-information" },
    { slug: "pair-and-taatsu-discard" }, { slug: "two-riichi-short-on-safe-tiles" }, { tool: "push-or-fold" },
  ] },
  { id: "placement", title: "点棒状況から判断する", tone: "scoring", steps: [
    { slug: "fu-calculation" }, { slug: "dealer-push-fold" }, { slug: "placement-points-and-riichi" },
    { slug: "orasu-score-conditions" }, { slug: "dama-value-situations" }, { tool: "orasu" },
  ] },
];

export function buildLearningPaths(guides: readonly LearningGuide[]) {
  const tools = getToolCatalog();
  return learningPathDefinitions.map((path) => ({
    ...path,
    steps: path.steps.flatMap<{ href: string; label: string; kind: "article" | "tool" }>((step) => {
      if ("slug" in step) {
        const guide = guides.find((item) => item.slug === step.slug);
        return guide ? [{ href: `/learn/guides/${guide.slug}`, label: guide.title, kind: "article" as const }] : [];
      }
      const tool = tools.find((item) => item.id === step.tool);
      if (!tool) throw new Error(`Missing learning path tool: ${step.tool}`);
      return [{ href: tool.href, label: tool.title, kind: "tool" as const }];
    }),
  }));
}

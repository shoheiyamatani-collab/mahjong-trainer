import type { LearningGuide } from "./guideData";

const preferredArticles: Record<string, string[]> = {
  "/analysis/mahjong-tool": ["equal-ukeire-tiebreakers", "six-to-five-block-examples", "chiitoitsu-or-standard", "ukeire-versus-practical-decisions"],
  "/analysis/orasu-condition": ["orasu-practice-ten", "honba-and-sticks-decisions", "placement-points-and-riichi", "endgame-tenpai-value"],
  "/tools": ["dealer-push-fold", "dama-value-situations", "honba-and-sticks-decisions", "riichi-borderline-decisions"],
  "/trainer/push-or-fold": ["borderline-push-fold", "two-riichi-short-on-safe-tiles", "minimize-loss-decisions", "opponent-calls-defense"],
  "/trainer/riichi-or-dama": ["riichi-borderline-decisions", "dama-value-situations", "placement-points-and-riichi", "take-tenpai-or-improve"],
};

export function relatedPracticeArticles(guides: readonly LearningGuide[], toolHref: string) {
  const preferred = preferredArticles[toolHref] ?? [];
  const order = (slug: string) => preferred.includes(slug) ? preferred.indexOf(slug) : preferred.length;
  return guides.filter((guide) => guide.library && [guide.toolLink, ...(guide.additionalTools ?? [])].some((tool) => tool.href === toolHref))
    .sort((a, b) => order(a.slug) - order(b.slug)).slice(0, 4);
}

import type { TrainingItem } from "../siteData";

export function DifficultyBadge({ difficulty }: { difficulty: TrainingItem["difficulty"] }) {
  return <span className={`difficultyBadge difficulty-${difficulty}`}>{difficulty}</span>;
}

export function ComingSoonBadge() {
  return <span className="comingSoonBadge">準備中</span>;
}

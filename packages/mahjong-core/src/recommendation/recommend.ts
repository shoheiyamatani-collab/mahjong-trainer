import { tileName, type Counts34 } from "../tiles";
import { availableForStrategy, extractHandFeatures, validateStrategyHand } from "./features";
import { evaluateStrategies, STRATEGY_RECOMMENDATION_VERSION } from "./evaluate";
import { DEFAULT_STRATEGY_SETTINGS, type PivotTile, type StrategyEvaluation, type StrategyEvidence, type StrategyRecommendation, type StrategySettings } from "./types";

export function classifyStrategies(evaluations: StrategyEvaluation[]): StrategyEvaluation[] {
  const best = evaluations[0]?.overallScore ?? 0;
  return evaluations.map((strategy, index) => ({
    ...strategy,
    tier: index === 0 ? "本線"
      : strategy.suitabilityScore < 25 || strategy.overallScore < 22 ? "追わない"
        : best - strategy.overallScore <= 9 && strategy.flexibilityScore >= 30 ? "対抗"
          : strategy.valueScore >= 75 && strategy.suitabilityScore >= 25 && strategy.overallScore < best - 12 ? "ロマン"
            : "サブ",
  }));
}

function featuredStrategies(all: StrategyEvaluation[]): StrategyEvaluation[] {
  // Show one main direction per family; retain chiitoitsu/toitoi as a useful explicit branch.
  const featured: StrategyEvaluation[] = [];
  const groups = new Set<string>();
  for (const strategy of all) {
    const group = strategy.category === "pairs" ? strategy.id : strategy.category;
    if (groups.has(group)) continue;
    if (strategy.tier === "追わない") continue;
    groups.add(group);
    featured.push(strategy);
    if (featured.length === 4) break;
  }
  const avoid = all.find((strategy) => strategy.tier === "追わない" && !groups.has(strategy.category));
  if (avoid) featured.push(avoid);
  return featured;
}

export function detectPivotTiles(
  counts: Counts34,
  settings: StrategySettings,
  evidence: StrategyEvidence = {},
): PivotTile[] {
  validateStrategyHand(counts, settings);
  const initialAvailable = availableForStrategy(counts, settings);
  // Baseline and all counterfactuals use identical static inputs and simulation evidence.
  const baseline = evaluateStrategies(extractHandFeatures(counts, settings, initialAvailable), evidence);
  const byId = new Map(baseline.map((strategy) => [strategy.id, strategy]));
  const options: PivotTile[] = [];
  for (let draw = 0; draw < 34; draw += 1) {
    if (initialAvailable[draw]! <= 0) continue;
    const drawn = counts.slice();
    drawn[draw] += 1;
    const available = initialAvailable.slice();
    available[draw] -= 1;
    let best: PivotTile | null = null;
    let bestPriority = -Infinity;
    for (let discard = 0; discard < 34; discard += 1) {
      if (drawn[discard]! === 0 || discard === draw) continue;
      const after = drawn.slice();
      after[discard] -= 1;
      const next = evaluateStrategies(extractHandFeatures(after, settings, available), evidence);
      for (const strategy of next) {
        const previous = byId.get(strategy.id)!;
        const delta = Math.round((strategy.overallScore - previous.overallScore) * 10) / 10;
        if (delta < 4 || strategy.overallScore < 38 || strategy.suitabilityScore < 35) continue;
        // A large jump from a poor baseline is not a good pivot if the existing main plan remains better.
        if (strategy.overallScore < baseline[0]!.overallScore - 4 || strategy.overallScore < next[0]!.overallScore - 9) continue;
        const priority = delta + (strategy.id !== baseline[0]?.id ? 4 : 0) + strategy.overallScore / 12;
        if (priority <= bestPriority) continue;
        bestPriority = priority;
        best = {
          tile: tileName(draw), strategyId: strategy.id, strategyName: strategy.name,
          scoreDelta: delta, recommendedDiscard: tileName(discard), remaining: initialAvailable[draw]!,
          explanation: `${tileName(discard)}を切る形で${strategy.name}を再評価できます。`,
        };
      }
    }
    if (best) options.push(best);
  }
  options.sort((a, b) => b.scoreDelta - a.scoreDelta || b.remaining - a.remaining);
  const selected: PivotTile[] = [];
  for (const option of options) {
    if (selected.some((item) => item.strategyId === option.strategyId)) continue;
    selected.push(option);
    if (selected.length === 5) break;
  }
  return selected;
}

export function recommendStartingHand(
  counts: Counts34,
  settings: StrategySettings = DEFAULT_STRATEGY_SETTINGS,
  evidence: StrategyEvidence = {},
  includePivots = true,
): StrategyRecommendation {
  const features = extractHandFeatures(counts, settings);
  const strategies = classifyStrategies(evaluateStrategies(features, evidence));
  const featured = featuredStrategies(strategies);
  const leader = strategies[0]!;
  const challenger = featured.find((strategy) => strategy.id !== leader.id && strategy.tier !== "追わない");
  const close = challenger != null && leader.overallScore - challenger.overallScore <= 4;
  const types = {
    closed: ["スピード型", "良形と受け入れを残しながら門前で進めやすい配牌"],
    yakuhai: ["役牌速攻型", "役牌の重なりから鳴いて進めるルートがある配牌"],
    sequences: ["手役型", "順子の種を生かし、三色・一通と通常手を比較できる配牌"],
    flush: ["染め手型", "色の偏りと字牌を生かして進める配牌"],
    pairs: ["対子型", "対子の増え方と鳴ける牌で方針が分かれる配牌"],
    outside: ["么九型", "端牌と字牌の組み合わせを生かせる配牌"],
    kokushi: ["役満チャンス", "么九牌の種類が多く、国士無双を比較する価値がある配牌"],
  } as const;
  const type = close ? { name: "バランス型", description: "複数の構想が拮抗し、次のツモで方針を選べる配牌" }
    : { name: types[leader.category][0], description: types[leader.category][1] };
  const pivots = includePivots ? detectPivotTiles(counts, settings, evidence) : [];
  const pivotSentence = pivots[0]
    ? `${pivots[0].tile}を引いたら、${pivots[0].strategyName}を再評価しましょう。`
    : leader.branch;
  const conclusion = [
    `${leader.name}を本線に進めるのがおすすめです。${leader.reasons[0]}`,
    challenger ? `${challenger.name}も${challenger.tier === "対抗" ? "同時に残せる対抗候補です" : "ツモ次第で再評価できます"}。` : "手役に固定する前に、通常手の進み方も確認しましょう。",
    pivotSentence,
  ].join("");
  return {
    version: STRATEGY_RECOMMENDATION_VERSION, features, strategies, featured, type, conclusion, pivots,
    closeCall: close ? `${leader.name}と${challenger.name}はおすすめ度がほぼ互角です。` : null,
    settings: { ...settings },
  };
}

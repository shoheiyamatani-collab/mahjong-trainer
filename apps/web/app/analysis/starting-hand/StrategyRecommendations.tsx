import { ArrowRight, Compass, GitBranch, Sparkles } from "lucide-react";
import type { StrategyEvaluation, StrategyRecommendation, Tile } from "@mahjong-trainer/mahjong-core";

const AXES = [
  ["speedScore", "テンパイ速度"], ["winRateScore", "アガリやすさ"], ["valueScore", "打点期待"],
  ["shapeScore", "良形期待"], ["callScore", "鳴きやすさ"], ["flexibilityScore", "柔軟性"],
  ["yakuScore", "手役成立期待"], ["suitabilityScore", "配牌適性"],
] as const;
const TIER_DESCRIPTIONS = {
  本線: "もっとも自然に進めやすい構想", 対抗: "本線と同時に残す価値がある構想",
  サブ: "ツモ次第で再評価できる構想", ロマン: "速度より高打点の可能性を残す構想", 追わない: "現時点では手役を固定しない構想",
};

export function StrategyRecommendations({ result, imageSrc, running }: {
  result: StrategyRecommendation; imageSrc: (tile: Tile) => string; running: boolean;
}) {
  const measured = result.strategies.some((strategy) => strategy.simulation);
  return (
    <section className="strategyRecommendations" aria-label="総合おすすめ構想">
      <header className="strategyConclusion">
        <div className="strategyDiagnosis"><Compass aria-hidden="true" /><strong>{result.type.name}</strong><span>{result.type.description}</span></div>
        <h2>この配牌をどう見るか</h2>
        <p>{result.conclusion}</p>
        {result.closeCall ? <p className="strategyCloseCall">{result.closeCall}</p> : null}
        <small>{measured ? "牌姿と役別シミュレーションを合わせた構想評価" : "牌姿からの初期評価"}{running ? "・確率を計算中" : ""}。おすすめ度はアガリ確率ではありません。</small>
      </header>
      <div className="strategySectionHeading"><Sparkles aria-hidden="true" /><h2>AIのおすすめ</h2></div>
      <div className="strategyCards">
        {result.featured.map((strategy) => <StrategyCard strategy={strategy} key={strategy.id} />)}
      </div>
      <section className="strategyPivotSection" aria-labelledby="pivot-heading">
        <div className="strategySectionHeading"><GitBranch aria-hidden="true" /><h2 id="pivot-heading">方針が変わるツモ</h2></div>
        <p>引いた後の打牌まで比べ、狙いを再評価する価値が高い牌です。</p>
        {result.pivots.length ? <div className="strategyPivots">{result.pivots.map((pivot) => (
          <article className="strategyPivot" key={pivot.tile}>
            <img src={imageSrc(pivot.tile)} alt={pivot.tile} width={33} height={45} />
            <ArrowRight aria-hidden="true" />
            <div><strong>{pivot.strategyName}</strong><span>おすすめ度 +{pivot.scoreDelta.toFixed(1)}</span><small>残り最大{pivot.remaining}枚</small></div>
            <div className="strategyPivotDiscard"><span>打牌候補</span><img src={imageSrc(pivot.recommendedDiscard)} alt={pivot.recommendedDiscard} width={26} height={36} /></div>
          </article>
        ))}</div> : <p>大きく構想が変わるツモは見つかりませんでした。今の本線を中心に進められます。</p>}
        <small>点数差は同じ条件で牌姿を入れ替えた評価の差です。未来の成功率を再シミュレーションした値ではありません。</small>
      </section>
      <details className="strategyAllDetails">
        <summary>各構想の詳細評価・配牌の特徴</summary>
        <dl className="strategyHandFeatures">
          <div><dt>通常手</dt><dd>{result.features.normalShanten === 0 ? "聴牌" : `${result.features.normalShanten}向聴`}</dd></div>
          <div><dt>通常手の受け入れ</dt><dd>{result.features.normalEffectiveTiles.length}種 / {result.features.normalUkeire}枚</dd></div>
          <div><dt>対子候補 / 暗刻</dt><dd>{result.features.pairKinds}種 / {result.features.tripletKinds}組</dd></div>
          <div><dt>両面 / 嵌張 / 辺張</dt><dd>{result.features.blocks.ryanmen} / {result.features.blocks.kanchan} / {result.features.blocks.penchan}組</dd></div>
          <div><dt>国士</dt><dd>{result.features.terminalHonorKinds}種 / {result.features.kokushiShanten}向聴</dd></div>
          <div><dt>ドラ</dt><dd>{result.features.doraCount}枚</dd></div>
        </dl>
        <div className="strategyDetailList">{result.strategies.map((strategy) => (
          <details key={strategy.id}>
            <summary><span>{strategy.name}</span><span>{strategy.tier} · {Math.round(strategy.overallScore)} / 100</span></summary>
            <div className="strategyAxes">{AXES.map(([key, name]) => (
              <div key={key}><label htmlFor={`${strategy.id}-${key}`}>{name}</label><meter id={`${strategy.id}-${key}`} min={0} max={100} value={strategy[key]} /><span>{Math.round(strategy[key])}</span></div>
            ))}</div>
            <p>{strategy.branch}</p>
            {strategy.commitmentPenalty > 0 ? <p>手役固定・速度低下・ドラ利用の制約による減点：{strategy.commitmentPenalty.toFixed(1)}</p> : null}
            <Evidence strategy={strategy} />
          </details>
        ))}</div>
      </details>
    </section>
  );
}

function StrategyCard({ strategy }: { strategy: StrategyEvaluation }) {
  return <article className={`strategyCard ${strategy.tier === "本線" ? "primary" : ""} ${strategy.tier === "追わない" ? "avoid" : ""}`}>
    <header><span className="strategyTier" title={TIER_DESCRIPTIONS[strategy.tier]}>{strategy.tier}</span><div className="strategyScore"><small>おすすめ度</small><strong>{Math.round(strategy.overallScore)}<small> / 100</small></strong></div></header>
    <h3>{strategy.name}</h3>
    <p className="strategyTierDescription">{TIER_DESCRIPTIONS[strategy.tier]}</p>
    <h4>おすすめ理由</h4>
    <ul>{strategy.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul>
    <details><summary>注意点と分岐</summary><ul>{strategy.cautions.map((reason) => <li key={reason}>{reason}</li>)}</ul><p>{strategy.branch}</p></details>
    <Evidence strategy={strategy} />
  </article>;
}

function Evidence({ strategy }: { strategy: StrategyEvaluation }) {
  return <div className="strategyEvidence">{strategy.simulation ? <>
    <span>参考データ：{strategy.simulation.trials.toLocaleString("ja-JP")}試行</span>
    <span>確率の精度目安：{strategy.simulation.confidence}</span>
    <span>成立アガリ率 {(strategy.simulation.winRate * 100).toFixed(1)}%（誤差目安 ±{(strategy.simulation.winRateError * 100).toFixed(1)}ポイント）</span>
    <small>同じ役を優先するAIの参考値です。個別の構想や指定した風・ドラでの確率ではありません。</small>
  </> : <span>牌姿評価：この構想単独のアガリ確率は未計測</span>}</div>;
}

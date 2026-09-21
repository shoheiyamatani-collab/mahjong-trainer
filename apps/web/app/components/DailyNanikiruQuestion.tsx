"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Lightbulb, Search } from "lucide-react";
import {
  dailyTileDisplay,
  generateDailyNanikiru,
  japanDate,
  millisecondsUntilNextJapanDate,
  type DailyNanikiruProblem,
  type Tile,
} from "@mahjong-trainer/mahjong-core";

const IMAGE_SUFFIX = "-66-90-l-emb.png";
const HONOR_IMAGE_NUMBERS = new Map<string, number>([
  ["東", 1],
  ["南", 2],
  ["西", 3],
  ["北", 4],
  ["白", 5],
  ["發", 6],
  ["中", 7],
]);

export function DailyNanikiruQuestion({ initialProblem }: { initialProblem: DailyNanikiruProblem }) {
  const [problem, setProblem] = useState(initialProblem);

  useEffect(() => {
    let timer = 0;
    const updateForJapanDate = () => {
      const date = japanDate();
      setProblem((current) => current.date === date ? current : generateDailyNanikiru(date));
      timer = window.setTimeout(updateForJapanDate, millisecondsUntilNextJapanDate() + 100);
    };
    updateForJapanDate();
    return () => window.clearTimeout(timer);
  }, []);

  const answerLabel = problem.bestDiscards.map(dailyTileDisplay).join("・");
  const answerHeading = problem.bestDiscards.length === 1
    ? `正解は${answerLabel}。`
    : `正解は${answerLabel}の${problem.bestDiscards.length}通り。`;
  const answerDetail = problem.explanation.startsWith(answerHeading)
    ? problem.explanation.slice(answerHeading.length)
    : problem.explanation;

  return (
    <section className="homeFeatureGrid homeQuestionOnly" aria-label="今日の1問">
      <article className="homeQuestionPanel">
        <div className="homePanelLabel">
          <Lightbulb aria-hidden="true" />
          <span>TODAY&apos;S QUESTION</span>
        </div>
        <h2>今日の1問</h2>
        <p className="homeQuestionLead">このイーシャンテン、最も受け入れが広い打牌はどれでしょう？</p>
        <div className="homeQuestionTiles" aria-label={problem.hand.map(dailyTileDisplay).join(" ")}>
          {problem.hand.map((tile, index) => (
            <img key={`${tile}-${index}`} src={tileImageSrc(tile)} alt="" />
          ))}
        </div>
        <div className="homeQuestionChoices" aria-label="選択肢">
          {problem.choices.map((choice) => (
            <div className="homeQuestionChoice" key={choice.discard}>
              <img src={tileImageSrc(choice.discard)} alt={dailyTileDisplay(choice.discard)} />
            </div>
          ))}
        </div>
        <details className="homeQuestionAnswer" key={problem.date}>
          <summary>答えを見る</summary>
          <div>
            <CheckCircle2 aria-hidden="true" />
            <p><strong>{answerHeading}</strong>{answerDetail}</p>
          </div>
        </details>
        <div className="homeCheckerPitch">
          <Search aria-hidden="true" />
          <div>
            <strong>「枚数」だけでは見えない、待ちの質まで分かる。</strong>
            <p>牌理チェッカーなら、受け入れ枚数に加えて良形率・超良形率・有効牌を打牌ごとに比較できます。</p>
          </div>
        </div>
        <Link className="homeCheckerCta" href={problem.checkerPath}>
          <span>
            <strong>牌理チェッカーで打牌の差を見る</strong>
            <small>この牌姿の解析結果をすぐに表示</small>
          </span>
          <ArrowRight aria-hidden="true" />
        </Link>
      </article>
    </section>
  );
}

function tileImageSrc(tile: Tile): string {
  if (tile.endsWith("m")) return `/tiles/man${tile[0]}${IMAGE_SUFFIX}`;
  if (tile.endsWith("p")) return `/tiles/pin${tile[0]}${IMAGE_SUFFIX}`;
  if (tile.endsWith("s")) return `/tiles/sou${tile[0]}${IMAGE_SUFFIX}`;
  return `/tiles/ji${HONOR_IMAGE_NUMBERS.get(tile) ?? 1}${IMAGE_SUFFIX}`;
}

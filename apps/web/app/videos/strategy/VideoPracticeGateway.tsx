"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, BarChart3, BookOpenCheck } from "lucide-react";
import { advancedStrategyChannel, videoChannels, type VideoGuide } from "../videoData";
import styles from "./VideoPracticeGateway.module.css";

type Recommendation = {
  href: string;
  label: string;
  title: string;
  description: string;
  action: string;
  tone: "practice" | "analysis";
};

const strategyGuides = [...videoChannels.strategy.guides, ...advancedStrategyChannel.guides];

export default function VideoPracticeGateway() {
  const pathname = usePathname();
  const normalizedPathname = pathname.replace(/\/$/, "");
  const guide = strategyGuides.find((item) => item.articleHref === normalizedPathname);

  if (!guide) return null;

  const recommendations = getRecommendations(guide, normalizedPathname);
  const titleId = `practice-${normalizedPathname.split("/").pop()}`;

  return (
    <aside className={styles.gateway} aria-labelledby={titleId}>
      <div className={styles.inner}>
        <header className={styles.intro}>
          <p className={styles.eyebrow}>WATCH → TRY → CHECK</p>
          <h2 id={titleId}>動画で覚えた判断を、実際に試して定着させる</h2>
          <p>{guide.focus}</p>
        </header>

        <div className={styles.links}>
          {recommendations.map((recommendation) => {
            const Icon = recommendation.tone === "practice" ? BookOpenCheck : BarChart3;

            return (
              <Link className={`${styles.link} ${styles[recommendation.tone]}`} href={recommendation.href} key={recommendation.href}>
                <span className={styles.icon} aria-hidden="true"><Icon /></span>
                <span className={styles.copy}>
                  <small>{recommendation.label}</small>
                  <strong>{recommendation.title}</strong>
                  <span>{recommendation.description}</span>
                </span>
                <span className={styles.action}>{recommendation.action}<ArrowRight aria-hidden="true" /></span>
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

function getRecommendations(guide: VideoGuide, pathname: string): [Recommendation, Recommendation] {
  const title = guide.title;
  const category = guide.category;
  const topic = `${title} ${category}`;

  if (title.includes("点数") || title.includes("符") || category.includes("点数計算")) {
    return [
      practice("/trainer#score-beginner", "点数計算問題を解く", "動画で見た点数感覚を、牌姿を使った固定問題で確認できます。"),
      analysis("/tools", "点数計算ツールで確認する", "手牌とアガリ方を入力し、役・翻・符と支払いまで確かめられます。")
    ];
  }

  if (category.includes("読み") || title.includes("読み") || title.includes("捨て牌")) {
    const practiceHref = pathname.endsWith("discard-reading-ten-question-test")
      ? "/videos/strategy/calling-to-improve-wait-quiz"
      : "/videos/strategy/discard-reading-ten-question-test";
    const practiceTitle = pathname.endsWith("discard-reading-ten-question-test")
      ? "鳴きと待ちの問題を解く"
      : "捨て牌読みの10問に挑戦する";

    return [
      practice(practiceHref, practiceTitle, "結論だけでなく、見えている情報から根拠を組み立てる練習ができます。"),
      analysis("/analysis/mahjong-tool", "自分の手牌価値を解析する", "受け入れと良形率を確認し、読みをどこまで押し引きへ反映するか考えられます。")
    ];
  }

  if (/守備|ベタオリ|押し引き|安全牌|手詰まり|回し打ち/.test(topic)) {
    const practiceHref = pathname.endsWith("betaori-practice-ten-questions")
      ? "/videos/strategy/push-fold-judgment-ten-questions"
      : "/videos/strategy/betaori-practice-ten-questions";
    const practiceTitle = pathname.endsWith("betaori-practice-ten-questions")
      ? "押し引き判断10問へ進む"
      : "ベタオリ実戦問題10問を解く";

    return [
      practice(practiceHref, practiceTitle, "現物・スジ・カベや手牌価値を見比べ、切る一枚を理由つきで選びます。"),
      analysis("/analysis/mahjong-tool", "押す価値のある手か確認する", "シャンテン数、受け入れ、良形率を見て、守備と交換する手牌価値を確かめられます。")
    ];
  }

  if (title.includes("役") || category.startsWith("役")) {
    return [
      practice("/training/yaku-quiz", "役の練習問題を解く", "牌姿から役を見つける練習で、動画で整理した知識を思い出せる形にします。"),
      analysis("/tools", "完成した手を点数計算する", "実際の手牌を入力して、成立役と翻数、最終的な点数まで確認できます。")
    ];
  }

  if (/配牌|悪配牌|弱い手/.test(topic)) {
    return [
      practice("/trainer#iishanten-nanikiru", "イーシャンテン何切るを解く", "手を進める一打を選び、受け入れの差を問題形式で確認できます。"),
      analysis("/analysis/starting-hand", "配牌から狙いを比較する", "配牌を入力し、速度と狙いやすい役の両面から方針を比べられます。")
    ];
  }

  if (/鳴き|副露/.test(topic)) {
    const practiceHref = pathname.endsWith("calling-to-improve-wait-quiz")
      ? "/trainer#seven-shape"
      : "/videos/strategy/calling-to-improve-wait-quiz";
    const practiceTitle = pathname.endsWith("calling-to-improve-wait-quiz")
      ? "7枚形で待ちを練習する"
      : "待ちを良くする何鳴く問題を解く";

    return [
      practice(practiceHref, practiceTitle, "鳴く前後の形を見比べ、待ちと受け入れがどう変わるかを確認します。"),
      analysis("/analysis/mahjong-tool", "鳴いた後の受け入れを比べる", "候補となる打牌ごとの枚数と良形率を見て、形の改善を数値で確かめられます。")
    ];
  }

  if (/待ち|多面|清一色|7枚形/.test(topic)) {
    return [
      practice("/trainer#seven-shape", "7枚形トレーニングを始める", "よく出る形を問題で反復し、待ちを見つける速度を上げます。"),
      analysis("/analysis/mahjong-tool", "牌理チェッカーで待ちを確認する", "手牌を入力して待ち牌と残り枚数を確認し、見落とした形を振り返れます。")
    ];
  }

  if (/牌効率|何切る|シャンテン|受け入れ|ターツ|孤立牌|対子|複合形|4連形/.test(topic)) {
    const isAdvanced = guide.level.includes("中級") || guide.level.includes("上級") || guide.level.includes("高難度");

    return [
      practice(
        isAdvanced ? "/trainer#ukeire-max" : "/trainer#iishanten-nanikiru",
        isAdvanced ? "受け入れMAX何切るに挑戦する" : "イーシャンテン何切るを解く",
        isAdvanced
          ? "複数の有力打牌を選び、受け入れ最大の候補を漏れなく探す練習ができます。"
          : "手を進める一打を選び、答え合わせで受け入れの違いまで確認できます。"
      ),
      analysis("/analysis/mahjong-tool", "牌理チェッカーで候補を比較する", "枚数だけでなく良形率や超良形率まで見て、動画の判断を自分の牌姿で試せます。")
    ];
  }

  return [
    practice("/trainer#iishanten-nanikiru", "実戦形式の何切るを解く", "動画で得た判断基準を使い、まず一問、自分で切る牌を選んでみましょう。"),
    analysis("/analysis/mahjong-tool", "牌理チェッカーで判断を確かめる", "シャンテン数、受け入れ、良形率を比べ、選んだ一打の根拠を深められます。")
  ];
}

function practice(href: string, title: string, description: string): Recommendation {
  return { href, title, description, label: "PRACTICE / 練習問題", action: "問題を解く", tone: "practice" };
}

function analysis(href: string, title: string, description: string): Recommendation {
  return { href, title, description, label: "ANALYSIS / 解析ツール", action: "確かめる", tone: "analysis" };
}

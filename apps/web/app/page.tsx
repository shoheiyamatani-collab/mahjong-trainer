import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  Calculator,
  CheckCircle2,
  CirclePlay,
  Lightbulb,
  Route,
  Search,
  Target
} from "lucide-react";

export const metadata: Metadata = {
  title: "雀フォリオ｜麻雀初心者のための学習・練習サイト",
  description: "麻雀初心者がルール、役、待ち、何切る、点数計算を順番に学べる麻雀学習サイトです。練習問題、解析ツール、動画解説をつなげて学べます。",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "/",
    siteName: "雀フォリオ",
    title: "雀フォリオ｜麻雀初心者のための学習・練習サイト",
    description: "麻雀を知る、学ぶ、強くなる。ルール、練習、解析、動画をつなぐ麻雀学習サイトです。"
  }
};

const portalItems = [
  {
    title: "初心者ロードマップ",
    label: "最初から学ぶ",
    description: "牌の種類から役・待ちまで、迷わない順番で基礎を身につけます。",
    href: "/learn/roadmap",
    action: "ロードマップを見る",
    tone: "green",
    icon: BookOpenCheck
  },
  {
    title: "麻雀トレーニング",
    label: "問題を解く",
    description: "待ち当て、点数計算、清一色などを、実際に手を動かして練習します。",
    href: "/trainer",
    action: "トレーニングを始める",
    tone: "orange",
    icon: Target
  },
  {
    title: "麻雀解析ツール",
    label: "牌姿を調べる",
    description: "打牌候補ごとの受け入れや、配牌から狙いやすい役を比較できます。",
    href: "/analysis/mahjong-tool",
    action: "解析ツールを使う",
    tone: "blue",
    icon: Search
  },
  {
    title: "点数計算ツール",
    label: "点数を確認する",
    description: "手牌と条件を入力して、役・翻・符とロン・ツモの支払いを確認します。",
    href: "/tools",
    action: "点数を計算する",
    tone: "red",
    icon: Calculator
  },
  {
    title: "麻雀を動画で学ぶ",
    label: "解説を見る",
    description: "初心者向けと中級者以上向けに分けた戦術動画を、記事と一緒に学べます。",
    href: "/videos/strategy",
    action: "動画記事を選ぶ",
    tone: "teal",
    icon: CirclePlay
  }
] as const;

const learningSteps = [
  { step: "01", title: "ルール", description: "牌とアガリの基本", href: "/learn/roadmap" },
  { step: "02", title: "役", description: "よく使う役から覚える", href: "/rules/frequent-yaku" },
  { step: "03", title: "待ち", description: "アガリ牌を見つける", href: "/rules/practical-waits" },
  { step: "04", title: "点数計算", description: "実戦の点数を確認する", href: "/tools/score-table" }
] as const;

const learningCycle = [
  { step: "見る・読む", description: "動画と記事で考え方を知る", href: "/videos/strategy/beginner", icon: CirclePlay },
  { step: "解く", description: "問題で自分の判断を試す", href: "/trainer", icon: Target },
  { step: "確かめる", description: "解析ツールで牌姿を比較する", href: "/analysis/mahjong-tool", icon: Search },
  { step: "戻って学ぶ", description: "迷った部分を基礎から復習する", href: "/learn/roadmap", icon: BookOpenCheck }
] as const;

const todayQuestionTiles = [
  "man2", "man3", "man4", "man3", "man4", "man5",
  "pin4", "pin5", "pin5", "pin5", "pin6",
  "sou6", "sou7", "sou8"
] as const;

export default function HomePage() {
  return (
    <main className="siteMain homePage">
      <section className="homeHero" aria-labelledby="home-title">
        <div className="homeHeroCopy">
          <div className="homeHeroBrandRow">
            <span className="siteLogoMark siteLogoMarkImage homeHeroLogo" aria-hidden="true" />
            <div>
              <p className="homeHeroEnglish">JONGFOLIO</p>
              <p className="homeHeroCategory">MAHJONG LEARNING HUB</p>
            </div>
          </div>
          <h1 id="home-title">雀フォリオ</h1>
          <p className="homeHeroTagline">麻雀を知る、学ぶ、強くなる。</p>
        </div>
        <div className="homeHeroTiles" aria-hidden="true">
          {["man1", "man2", "man3", "pin5", "pin6", "pin7", "ji7"].map((tile) => (
            <img key={tile} src={`/tiles/${tile}-66-90-l-emb.png`} alt="" />
          ))}
        </div>
      </section>

      <nav className="homeQuickNav" aria-label="雀フォリオの主要コンテンツ">
        {portalItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link href={item.href} key={item.title}>
              <Icon aria-hidden="true" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <section className="homeSection" aria-labelledby="home-entrances-title">
        <div className="homeSectionHeading">
          <p>CHOOSE YOUR START</p>
          <h2 id="home-entrances-title">目的から選ぶ</h2>
          <span>今やりたいことから、すぐに始められます。</span>
        </div>
        <div className="homePortalGrid">
          {portalItems.map((item) => {
            const Icon = item.icon;
            return (
              <article className={`homePortalCard homeTone-${item.tone}`} key={item.title}>
                <div className="homePortalTopline">
                  <span className="homePortalIcon" aria-hidden="true"><Icon /></span>
                  <span>{item.label}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <Link href={item.href}>
                  {item.action}
                  <ArrowRight aria-hidden="true" />
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <section className="homeFeatureGrid" aria-label="本日の問題と学習順">
        <article className="homeQuestionPanel">
          <div className="homePanelLabel">
            <Lightbulb aria-hidden="true" />
            <span>TODAY&apos;S QUESTION</span>
          </div>
          <h2>今日の1問</h2>
          <p className="homeQuestionLead">この14枚の手に、必ず含まれる役はどれでしょう？</p>
          <div className="homeQuestionTiles" aria-label="2萬 3萬 4萬 3萬 4萬 5萬 4筒 5筒 5筒 5筒 6筒 6索 7索 8索">
            {todayQuestionTiles.map((tile, index) => (
              <img key={`${tile}-${index}`} src={`/tiles/${tile}-66-90-l-emb.png`} alt="" />
            ))}
          </div>
          <div className="homeQuestionChoices" aria-label="選択肢">
            <span>役牌</span>
            <span>タンヤオ</span>
            <span>チャンタ</span>
          </div>
          <details className="homeQuestionAnswer">
            <summary>答えを見る</summary>
            <div>
              <CheckCircle2 aria-hidden="true" />
              <p><strong>正解はタンヤオ。</strong>すべての牌が2〜8の数牌でできており、1・9・字牌を使っていません。</p>
            </div>
          </details>
          <Link className="homeTextLink" href="/training/yaku-quiz">
            役判定クイズを続ける
            <ArrowRight aria-hidden="true" />
          </Link>
        </article>

        <section className="homeLearningPanel" aria-labelledby="home-learning-title">
          <div className="homePanelLabel">
            <Route aria-hidden="true" />
            <span>BEGINNER ROADMAP</span>
          </div>
          <h2 id="home-learning-title">初心者におすすめの学習順</h2>
          <p>点数計算は最後で大丈夫。まずはアガるために必要な順番で進みます。</p>
          <ol className="homeLearningSteps">
            {learningSteps.map((item) => (
              <li key={item.step}>
                <Link href={item.href}>
                  <span className="homeLearningNumber">STEP {item.step}</span>
                  <span className="homeLearningCopy">
                    <strong>{item.title}</strong>
                    <small>{item.description}</small>
                  </span>
                  <ArrowRight aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ol>
          <Link className="homeLearningAction" href="/learn/roadmap">
            全11STEPを見る
          </Link>
        </section>
      </section>

      <section className="homeCycleSection" aria-labelledby="home-cycle-title">
        <div className="homeCycleHeading">
          <div className="homePanelLabel">
            <Route aria-hidden="true" />
            <span>LEARNING CYCLE</span>
          </div>
          <h2 id="home-cycle-title">学んだことを、実戦の判断へ</h2>
          <p>ひとつのページで終わらず、分かるまでサイト内を行き来できます。</p>
        </div>
        <ol className="homeCycleList">
          {learningCycle.map((item, index) => {
            const Icon = item.icon;
            return (
              <li key={item.step}>
                <Link href={item.href}>
                  <span className="homeCycleNumber">{index + 1}</span>
                  <Icon aria-hidden="true" />
                  <strong>{item.step}</strong>
                  <small>{item.description}</small>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="homeSupportBand" aria-labelledby="home-support-title">
        <div>
          <p>QUICK REFERENCE</p>
          <h2 id="home-support-title">卓上で迷ったときの早見ページ</h2>
        </div>
        <nav aria-label="麻雀の早見ページ">
          <Link href="/rules/frequent-yaku">よく見る役</Link>
          <Link href="/rules/practical-waits">よく見る待ち</Link>
          <Link href="/rules/practical-score">実戦の点数計算</Link>
          <Link href="/tools/score-table">点数早見表</Link>
        </nav>
      </section>
    </main>
  );
}

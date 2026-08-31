import type { Metadata } from "next";
import Link from "next/link";
import {
  Calculator,
  CheckCircle2,
  CirclePlay,
  Lightbulb,
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
    title: "麻雀解析ツール",
    href: "/analysis/mahjong-tool",
    tone: "analysis",
    icon: Search
  },
  {
    title: "麻雀トレーニング",
    href: "/trainer",
    tone: "training",
    icon: Target
  },
  {
    title: "点数計算ツール",
    href: "/tools",
    tone: "score",
    icon: Calculator
  },
  {
    title: "麻雀を動画で学ぶ",
    href: "/videos/strategy",
    tone: "video",
    icon: CirclePlay
  }
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
        <Link className="homeHeroChecker" href="/analysis/mahjong-tool" aria-label="牌理チェッカーを使う">
          <img
            src="/tool-screenshots/ukeire-checker-hero.png"
            alt="牌理チェッカーで手牌を入力し、打牌候補と有効牌を比較している画面"
          />
        </Link>
      </section>

      <nav className="homeQuickNav" aria-label="雀フォリオの主要コンテンツ">
        {portalItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link className={`homeQuickNav-${item.tone}`} href={item.href} key={item.title}>
              <Icon aria-hidden="true" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <section className="homeFeatureGrid homeQuestionOnly" aria-label="今日の1問">
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
        </article>
      </section>
    </main>
  );
}

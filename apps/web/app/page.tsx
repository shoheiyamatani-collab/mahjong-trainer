import type { Metadata } from "next";
import { CategoryCard, InternalLinkCard, PageHero, SectionTitle } from "./components/SiteSections";

export const metadata: Metadata = {
  title: "雀フォリオ｜麻雀初心者のための学習・練習サイト",
  description: "麻雀初心者がルール、役、待ち、何切る、点数計算を順番に学べる麻雀学習サイトです。練習問題と便利ツールへすぐ進めます。",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "/",
    siteName: "雀フォリオ",
    title: "雀フォリオ｜麻雀初心者のための学習・練習サイト",
    description: "麻雀初心者がルール、役、待ち、何切る、点数計算を順番に学べる麻雀学習サイトです。"
  }
};

const learningOrder = ["ルール", "役", "待ち", "点数計算"];

export default function HomePage() {
  return (
    <main className="siteMain">
      <PageHero
        eyebrow="Mahjong Learning Hub"
        title="麻雀を、読んでから解ける場所。"
        description="はじめての人はロードマップから、慣れてきた人は何切る・待ち当て・点数計算へ。迷ったところをルールで復習しながら進めます。"
        primaryLink={{ label: "はじめて麻雀を覚える", href: "/learn" }}
        secondaryLink={{ label: "今すぐ練習する", href: "/trainer" }}
      />

      <section className="categoryGrid" aria-label="主要な入口">
        <CategoryCard
          title="はじめて麻雀を覚える"
          description="アガリ形、役、待ちまで、順番に理解できる初心者ロードマップです。"
          href="/learn"
          actionLabel="初心者ロードマップを見る"
          tone="green"
        />
        <CategoryCard
          title="今すぐ練習する"
          description="何切る、待ち当て、清一色など、手を動かして覚える問題一覧です。"
          href="/trainer"
          actionLabel="練習メニューを見る"
          tone="yellow"
        />
        <CategoryCard
          title="点数・役・待ちを調べる"
          description="点数計算や受け入れ確認など、復習に使える便利ツールをまとめています。"
          href="/tools"
          actionLabel="便利ツールを見る"
          tone="blue"
        />
      </section>

      <section className="twoColumnSection">
        <article className="todayCard">
          <p className="siteEyebrow">今日の1問</p>
          <h2>この手、何を切る？</h2>
          <p>毎日1問、何切るや待ち当てなどの問題をこの場所に掲載します。</p>
        </article>

        <section className="learningOrderPanel" aria-labelledby="learning-order-heading">
          <SectionTitle
            eyebrow="おすすめ順"
            title="初心者におすすめの学習順"
            description="点数計算は最後で大丈夫。まずはアガリまでの流れをつかみます。"
          />
          <ol className="learningOrder" id="learning-order-heading">
            {learningOrder.map((item, index) => (
              <li key={item}>
                <span className="learningStep">STEP {index + 1}</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </section>
      </section>

      <section>
        <SectionTitle title="次に進む" description="読んだあとに解く、解いたあとに調べる流れを作っています。" />
        <div className="linkCardGrid">
          <InternalLinkCard title="ルール一覧で復習する" description="リーチ、タンヤオ、役牌などの入口を確認できます。" href="/rules" />
          <InternalLinkCard title="点数計算ツールを使う" description="手牌と条件を変えながら、役・翻・符と点数を確認できます。" href="/tools" />
          <InternalLinkCard title="待ち当て問題を解く" description="基本形から清一色まで、待ちを見抜く練習に進みます。" href="/trainer" />
        </div>
      </section>
    </main>
  );
}

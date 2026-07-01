import type { Metadata } from "next";
import { CategoryCard, InternalLinkCard, PageHero, SectionTitle } from "./components/SiteSections";

export const metadata: Metadata = {
  title: "麻雀トレーナー | 初心者向けルール解説と練習問題",
  description: "麻雀初心者がルール、役、待ち、何切る、点数計算を順番に学べる麻雀学習サイトです。練習問題と便利ツールへすぐ進めます。"
};

const learningOrder = ["ルール", "役", "待ち", "何切る", "点数計算"];

export default function HomePage() {
  return (
    <main className="siteMain">
      <PageHero
        eyebrow="Mahjong Learning Hub"
        title="麻雀を、読んでから解ける場所。"
        description="はじめての人はロードマップから、慣れてきた人は何切る・待ち当て・点数計算へ。迷ったところをルールで復習しながら進めます。"
        primaryLink={{ label: "はじめて麻雀を覚える", href: "/learn" }}
        secondaryLink={{ label: "今すぐ練習する", href: "/training" }}
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
          href="/training"
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
          <p>ランダム問題への入口として準備中です。今は練習一覧から、受け入れ最大問題や待ち当てに進めます。</p>
          <a className="primaryCta" href="/training">練習問題を選ぶ</a>
        </article>

        <section className="learningOrderPanel" aria-labelledby="learning-order-heading">
          <SectionTitle
            eyebrow="おすすめ順"
            title="初心者におすすめの学習順"
            description="点数計算は最後で大丈夫。まずはアガリまでの流れをつかみます。"
          />
          <ol className="learningOrder" id="learning-order-heading">
            {learningOrder.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </section>
      </section>

      <section>
        <SectionTitle title="次に進む" description="読んだあとに解く、解いたあとに調べる流れを作っています。" />
        <div className="linkCardGrid">
          <InternalLinkCard title="ルール一覧で復習する" description="リーチ、タンヤオ、役牌などの入口を確認できます。" href="/rules" />
          <InternalLinkCard title="点数計算ツールを使う" description="既存の点数計算画面で、条件を変えながら確認できます。" href="/trainer" />
          <InternalLinkCard title="待ち当て問題を解く" description="基本形から清一色まで、待ちを見抜く練習に進みます。" href="/trainer" />
        </div>
      </section>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ComingSoonBadge } from "../../components/Badges";
import { InternalLinkCard, PageHero, SectionTitle } from "../../components/SiteSections";
import { roadmapSteps } from "../../siteData";

export const metadata: Metadata = {
  title: "麻雀 初心者ロードマップ | はじめての麻雀学習順",
  description: "麻雀初心者が、基本ルール、牌の種類、アガリ形、役、待ち、何切る、点数計算まで順番に学べるロードマップです。"
};

export default function LearnRoadmapPage() {
  return (
    <main className="siteMain">
      <PageHero
        eyebrow="Roadmap"
        title="初心者ロードマップ"
        description="各ステップから短い記事を読めます。読んだら関連する練習に進み、分からないところだけ戻って復習しましょう。"
        primaryLink={{ label: "STEP 1から読む", href: "/learn/what-is-mahjong" }}
        secondaryLink={{ label: "初めて学ぶへ戻る", href: "/learn" }}
      />

      <section id="roadmap">
        <SectionTitle title="初心者ロードマップ" description="麻雀をこれから覚える人向けに、最初に必要な順番だけに絞っています。" />
        <div className="roadmapGrid">
          {roadmapSteps.map((step) => (
            <article className="roadmapCard" key={step.step}>
              <div className="stepNumber">STEP {step.step}</div>
              <h2>{step.title}</h2>
              <p>{step.description}</p>
              <div className="roadmapActions">
                <Link className="cardButton" href={step.readHref}>読む</Link>
                {step.practice.status === "comingSoon" ? <ComingSoonBadge /> : null}
                <Link className="textLink" href={step.practice.href ?? "/trainer"}>{step.practice.label}</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle title="次の練習へ" description="ロードマップで覚えた内容を、問題とツールで確認できます。" />
        <div className="linkCardGrid">
          <InternalLinkCard title="役一覧を見る" description="リーチ、タンヤオ、役牌から順番に確認します。" href="/rules/yaku" actionLabel="役一覧へ" />
          <InternalLinkCard title="役判定クイズを解く" description="牌姿を見て、どの役が成立しているかを選ぶ練習です。" href="/training/yaku-quiz" actionLabel="クイズを解く" />
          <InternalLinkCard title="待ち当て問題を解く" description="テンパイ形から待ち牌を探す練習に進みます。" href="/trainer" actionLabel="練習を開く" />
          <InternalLinkCard title="点数早見表を見る" description="細かい計算の前に、よく出る点数を表で確認できます。" href="/tools/score-table" actionLabel="点数表を見る" />
        </div>
      </section>
    </main>
  );
}

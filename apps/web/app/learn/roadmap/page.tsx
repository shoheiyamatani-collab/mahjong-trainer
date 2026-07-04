import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, SectionTitle } from "../../components/SiteSections";
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
        description="各ステップから短い記事を読めます。まずは順番に読み進めて、分からないところだけ戻って復習しましょう。"
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
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ComingSoonBadge } from "../components/Badges";
import { InternalLinkCard, PageHero, SectionTitle } from "../components/SiteSections";
import { roadmapSteps } from "../siteData";

export const metadata: Metadata = {
  title: "麻雀初心者ロードマップ | 12ステップで基本を覚える",
  description: "麻雀初心者がルール、牌、面子、役、待ち、何切る、点数計算まで順番に学ぶためのロードマップです。"
};

export default function LearnPage() {
  return (
    <main className="siteMain">
      <PageHero
        eyebrow="Beginner Roadmap"
        title="麻雀初心者ロードマップ"
        description="完全に初めてでも、アガリの形、役、待ち、何切るの順に進めば大丈夫です。点数計算は最後に回して、まずは遊べる状態を目指します。"
        primaryLink={{ label: "練習メニューを見る", href: "/training" }}
        secondaryLink={{ label: "ルール一覧を見る", href: "/rules" }}
      />

      <section>
        <SectionTitle title="12ステップで覚える" description="各ステップから短い個別記事を読めます。読んだら関連する練習に進みましょう。" />
        <div className="roadmapGrid">
          {roadmapSteps.map((step) => (
            <article className="roadmapCard" key={step.step}>
              <div className="stepNumber">STEP {step.step}</div>
              <h2>{step.title}</h2>
              <p>{step.description}</p>
              <div className="roadmapActions">
                <Link className="cardButton" href={step.readHref}>読む</Link>
                {step.practice.status === "comingSoon" ? <ComingSoonBadge /> : null}
                <Link className="textLink" href={step.practice.href ?? "/training"}>{step.practice.label}</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle title="次の練習へ" description="ロードマップで覚えた内容を、問題とツールで確認できます。" />
        <div className="linkCardGrid">
          <InternalLinkCard title="役一覧を見る" description="リーチ、タンヤオ、役牌から順番に確認します。" href="/rules" />
          <InternalLinkCard title="待ち当て問題を解く" description="テンパイ形から待ち牌を探す練習へ進みます。" href="/trainer" />
          <InternalLinkCard title="何切る問題を解く" description="受け入れ枚数を比べる練習で、捨て牌選びに慣れます。" href="/trainer" />
          <InternalLinkCard title="点数計算ツールを使う" description="点数計算は最後に、条件を変えながらゆっくり確認します。" href="/trainer" />
        </div>
      </section>
    </main>
  );
}

import type { Metadata } from "next";
import { ComingSoonBadge } from "../components/Badges";
import { InternalLinkCard, PageHero, SectionTitle } from "../components/SiteSections";
import { ruleItems } from "../siteData";

export const metadata: Metadata = {
  title: "麻雀ルール一覧 | 基本ルール・役・待ち・点数計算",
  description: "麻雀の基本ルール、役一覧、リーチ、タンヤオ、役牌、ツモとロン、鳴き、テンパイと待ち、点数計算、符計算の入口です。"
};

export default function RulesPage() {
  return (
    <main className="siteMain">
      <PageHero
        eyebrow="Rules Library"
        title="麻雀ルール一覧"
        description="将来的な解説記事の入口です。今は一覧と準備中表示を中心に、練習問題やツールへ戻れる形にしています。"
        primaryLink={{ label: "初心者ロードマップを見る", href: "/learn" }}
        secondaryLink={{ label: "練習問題を解く", href: "/training" }}
      />

      <section>
        <SectionTitle title="ルール・知識" description="初心者が検索しやすい言葉で、記事ページの土台を並べています。" />
        <div className="rulesGrid">
          {ruleItems.map((item) => (
            <article className="ruleCard" key={item.title}>
              <div className="cardTopline">
                <h2>{item.title}</h2>
                {item.status === "comingSoon" ? <ComingSoonBadge /> : null}
              </div>
              <p>{item.description}</p>
              {item.href ? <a className="textLink" href={item.href}>読む</a> : <span className="mutedText">記事は準備中です</span>}
            </article>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle title="ルールのあとに" description="読んだ内容を、問題とツールで確認できます。" />
        <div className="linkCardGrid">
          <InternalLinkCard title="初心者ロードマップを見る" description="覚える順番に戻って、次に読む項目を確認します。" href="/learn" />
          <InternalLinkCard title="関連する練習問題を解く" description="待ち、何切る、清一色などの練習に進みます。" href="/training" />
          <InternalLinkCard title="便利ツールで確認する" description="点数や受け入れをツールで確認してから復習できます。" href="/tools" />
        </div>
      </section>
    </main>
  );
}

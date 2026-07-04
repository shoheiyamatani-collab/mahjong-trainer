import type { Metadata } from "next";
import { ComingSoonBadge } from "../components/Badges";
import { InternalLinkCard, PageHero, SectionTitle } from "../components/SiteSections";
import { ruleItems } from "../siteData";

export const metadata: Metadata = {
  title: "実践でよく使う麻雀の基本 | 役・点数計算・待ち・一向聴",
  description: "実践で頻出する麻雀の役、点数計算、待ち、一向聴の形を確認できる入口です。これが分かれば9割方問題なしを目指します。"
};

export default function RulesPage() {
  return (
    <main className="siteMain">
      <PageHero
        eyebrow="Rules Library"
        title="実践でよく使う麻雀の基本"
        description="これが分かれば実践問題なし！実践で頻出する点数計算や待ちについて、これが分かれば9割方問題なし！"
        primaryLink={{ label: "初心者ロードマップを見る", href: "/learn" }}
        secondaryLink={{ label: "練習問題を解く", href: "/trainer" }}
      />

      <section>
        <SectionTitle
          title="実践でよく使う麻雀の基本"
          description="これが分かれば実践問題なし！実践で頻出する点数計算や待ちについて、これが分かれば9割方問題なし！"
        />
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
          <InternalLinkCard title="関連する練習問題を解く" description="待ち、何切る、清一色などの練習に進みます。" href="/trainer" />
          <InternalLinkCard title="便利ツールで確認する" description="点数や受け入れをツールで確認してから復習できます。" href="/tools" />
        </div>
      </section>
    </main>
  );
}

import type { Metadata } from "next";
import { JsonLd } from "../../components/JsonLd";
import { InternalLinkCard, PageHero, SectionTitle } from "../../components/SiteSections";
import { getSiteUrl } from "../../seoConfig";
import { GlossaryIndex } from "./GlossaryIndex";
import { glossaryTerms } from "./glossaryData";

export const metadata: Metadata = {
  title: "麻雀用語辞典 | 初心者向けに読み方と意味をやさしく解説",
  description: `麻雀初心者が覚えたい${glossaryTerms.length}語を、牌・待ち・鳴き・点数・戦術に分けて解説。テンパイ、ドラ、フリテン、スジなどを読み方や別名から検索できます。`,
  alternates: { canonical: "/learn/glossary" }
};

export default function MahjongGlossaryPage() {
  const siteUrl = getSiteUrl();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "初心者向け麻雀用語辞典",
    description: "麻雀初心者が実戦や学習で目にする用語の読み方と意味をまとめた辞典です。",
    url: `${siteUrl}/learn/glossary`,
    inLanguage: "ja-JP",
    hasDefinedTerm: glossaryTerms.map((item) => ({
      "@type": "DefinedTerm",
      name: item.term,
      description: item.definition,
      url: `${siteUrl}/learn/glossary#${item.slug}`,
      inDefinedTermSet: `${siteUrl}/learn/glossary`
    }))
  };

  return (
    <main className="siteMain glossaryPage">
      <JsonLd data={structuredData} />
      <PageHero
        eyebrow="Mahjong Dictionary"
        title="麻雀用語辞典"
        description={`初心者が麻雀を学ぶときに出会う${glossaryTerms.length}語を、短く分かりやすくまとめました。分からない言葉を検索して、その場で意味を確認できます。`}
        primaryLink={{ label: "初心者ロードマップへ戻る", href: "/learn/roadmap" }}
        secondaryLink={{ label: "麻雀役一覧を見る", href: "/rules/yaku" }}
      />

      <GlossaryIndex terms={glossaryTerms} />

      <section className="glossaryNext">
        <SectionTitle title="言葉の意味が分かったら" description="役の牌姿や実際の手牌と結びつけると、用語を覚えやすくなります。" />
        <div className="linkCardGrid">
          <InternalLinkCard title="麻雀役一覧" description="リーチ、タンヤオ、役牌から役満まで、翻数と牌姿で確認します。" href="/rules/yaku" actionLabel="役を見る" />
          <InternalLinkCard title="初心者ロードマップ" description="基本ルールから点数計算まで、覚える順番に沿って学びます。" href="/learn/roadmap" actionLabel="順番に学ぶ" />
          <InternalLinkCard title="麻雀トレーニング" description="何切るや待ち当てを解き、覚えた用語を実戦の判断につなげます。" href="/trainer" actionLabel="練習する" />
        </div>
      </section>
    </main>
  );
}

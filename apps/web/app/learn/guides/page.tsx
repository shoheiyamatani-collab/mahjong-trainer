import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "../../components/JsonLd";
import { getSiteUrl } from "../../seoConfig";
import { getLearningGuide, learningGuides } from "./guideData";

export const metadata: Metadata = {
  title: "麻雀を学ぶ | 牌効率・何切る・守備・点数計算の実戦ガイド",
  description: "麻雀の5ブロック理論、待ち、何切る、スジ・カベ、鳴き、点数計算を、牌姿つきの記事で順番に学べるガイド集です。",
  alternates: { canonical: "/learn/guides" },
  openGraph: {
    type: "website",
    url: "/learn/guides",
    title: "麻雀を学ぶ | 雀フォリオ",
    description: "牌効率・何切る・守備・点数計算を、牌姿つきの記事で学べます。"
  }
};

const guideCollections = [
  {
    eyebrow: "FOUNDATION",
    title: "形の基本を覚える",
    description: "ブロック、待ち、牌効率を牌姿から理解します。",
    slugs: ["five-block-theory", "wait-shape-basics", "what-is-tile-efficiency", "wait-types"]
  },
  {
    eyebrow: "DECISION",
    title: "何切るの判断を磨く",
    description: "受け入れ、良形率、一向聴を比べる順番を身につけます。",
    slugs: ["beginner-nanikiru-mistakes", "one-shanten-ukeire", "tile-efficiency-and-ukeire", "good-shape-rate"]
  },
  {
    eyebrow: "DEFENSE",
    title: "守備と鳴きを判断する",
    description: "現物・スジ・カベの違いと、鳴く前の判断基準を整理します。",
    slugs: ["suji-defense", "kabe-defense", "genbutsu-suji-kabe", "calling-decision", "rule-differences-and-calling"]
  },
  {
    eyebrow: "PRACTICE",
    title: "問題とツールで確かめる",
    description: "点数計算20問と牌理チェッカーの活用例で、知識を実戦につなげます。",
    slugs: ["score-calculation-practice", "mahjong-checker-examples"]
  }
] as const;

export default function LearningGuidesPage() {
  const siteUrl = getSiteUrl();

  return (
    <main className="siteMain learningGuideIndexPage">
      <JsonLd data={[
        {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "麻雀を学ぶ",
          description: metadata.description,
          url: `${siteUrl}/learn/guides`,
          mainEntity: {
            "@type": "ItemList",
            itemListElement: learningGuides.map((guide, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: guide.title,
              url: `${siteUrl}/learn/guides/${guide.slug}`
            }))
          }
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "トップ", item: siteUrl },
            { "@type": "ListItem", position: 2, name: "麻雀を学ぶ", item: `${siteUrl}/learn/guides` }
          ]
        }
      ]} />

      <header className="learningGuideIndexHero">
        <nav aria-label="パンくずリスト"><Link href="/">トップ</Link><span>›</span><span>麻雀を学ぶ</span></nav>
        <p className="siteEyebrow">LEARN MAHJONG</p>
        <h1>麻雀を学ぶ</h1>
        <p>牌の形を見ながら、牌効率・何切る・守備・鳴き・点数計算を順番に学べる実戦ガイドです。分からないテーマだけ選んで読むこともできます。</p>
        <div className="learningGuideIndexSteps" aria-label="おすすめの学習順">
          <span><b>1</b>形を覚える</span>
          <span><b>2</b>候補を比べる</span>
          <span><b>3</b>問題で確かめる</span>
        </div>
      </header>

      {guideCollections.map((collection) => {
        const guides = collection.slugs.map(getLearningGuide).filter((guide) => guide !== undefined);
        return (
          <section className="learningGuideCollection" key={collection.title}>
            <div className="learningGuideCollectionHeader">
              <p className="siteEyebrow">{collection.eyebrow}</p>
              <h2>{collection.title}</h2>
              <p>{collection.description}</p>
            </div>
            <div className="learningGuideIndexGrid">
              {guides.map((guide, index) => (
                <article key={guide.slug}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{guide.title}</h3>
                  <p>{guide.description}</p>
                  <Link href={`/learn/guides/${guide.slug}`}>記事を読む</Link>
                </article>
              ))}
            </div>
          </section>
        );
      })}

      <section className="learningGuideIndexFooter">
        <p className="siteEyebrow">BEGINNER COURSE</p>
        <h2>最初から順番に覚えたい方へ</h2>
        <p>麻雀を始めたばかりなら、ルールから点数計算まで順番に進める初心者ロードマップも利用できます。</p>
        <Link href="/learn/roadmap">初心者ロードマップを見る</Link>
      </section>
    </main>
  );
}

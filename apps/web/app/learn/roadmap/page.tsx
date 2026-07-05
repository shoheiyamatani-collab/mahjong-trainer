import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, SectionTitle } from "../../components/SiteSections";
import { roadmapSteps } from "../../siteData";

const roadmapVisuals: Record<number, { label: string; tiles: string[] }> = {
  1: { label: "麻雀で使う牌の例", tiles: ["man1", "pin5", "sou7", "ji6", "man7"] },
  2: { label: "萬子・筒子・索子・字牌の例", tiles: ["man2", "man5", "pin3", "pin8", "sou4", "sou9", "ji1", "ji7"] },
  3: { label: "ツモって捨てる流れの例", tiles: ["man2", "man3", "man4", "pin6", "pin7", "pin8", "sou5", "sou6", "sou7"] },
  4: { label: "面子と雀頭の例", tiles: ["man2", "man3", "man4", "pin5", "pin5", "pin5", "sou7", "sou7"] },
  5: { label: "4面子1雀頭の例", tiles: ["man1", "man2", "man3", "pin4", "pin5", "pin6", "sou7", "sou8", "sou9", "ji7", "ji7"] },
  6: { label: "役が必要な手牌の例", tiles: ["man1", "man2", "man3", "pin1", "pin2", "pin3", "sou7", "sou8", "sou9", "ji2", "ji2"] },
  7: { label: "リーチ・タンヤオ・役牌の例", tiles: ["man2", "man3", "man4", "pin3", "pin4", "pin5", "sou6", "sou7", "sou8", "ji7", "ji7", "ji7"] },
  8: { label: "ツモとロンの待ち牌例", tiles: ["man3", "man4", "man5", "pin4", "pin5", "pin6", "sou4", "sou5", "sou6", "man7"] },
  9: { label: "鳴きで作る面子の例", tiles: ["ji7", "ji7", "ji7", "man2", "man3", "man4", "pin6", "pin7", "pin8"] },
  10: { label: "テンパイと待ちの例", tiles: ["man2", "man3", "man4", "pin3", "pin4", "pin5", "sou4", "sou5", "sou6", "man5", "man6"] },
  11: { label: "何切るで比べる手牌の例", tiles: ["man2", "man3", "man4", "pin3", "pin4", "pin5", "sou5", "sou6", "sou8", "ji1", "ji1"] },
  12: { label: "点数計算は後から覚える例", tiles: ["man2", "man3", "man4", "pin4", "pin5", "pin6", "sou6", "sou7", "sou8", "ji5", "ji5"] }
};

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
              <div className="roadmapCardBody">
                <div className="stepNumber">STEP {step.step}</div>
                <h2>{step.title}</h2>
                <p>{step.description}</p>
                <div className="roadmapActions">
                  <Link className="cardButton" href={step.readHref}>読む</Link>
                </div>
              </div>
              <RoadmapVisual step={step.step} />
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function RoadmapVisual({ step }: { step: number }) {
  const visual = roadmapVisuals[step];

  if (!visual) {
    return null;
  }

  return (
    <div className="roadmapCardVisual" aria-label={visual.label}>
      {visual.tiles.map((tile, index) => (
        <img key={`${tile}-${index}`} src={`/tiles/${tile}-66-90-l-emb.png`} alt="" />
      ))}
    </div>
  );
}

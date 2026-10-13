import type { Metadata } from "next";
import { InternalLinkCard, PageHero, SectionTitle } from "../components/SiteSections";
import { ruleItems } from "../siteData";

const ruleVisuals: Record<string, { kind: "tiles"; tiles: string[]; label: string } | { kind: "screenshot"; src: string; alt: string }> = {
  "実践でよく見る役一覧": {
    kind: "tiles",
    label: "役牌を含むアガリ形のイメージ",
    tiles: ["man2", "man3", "man4", "pin3", "pin4", "pin5", "sou6", "sou7", "sou8", "ji7", "ji7", "ji7", "man5", "man5"]
  },
  "実践でよく見る点数計算": {
    kind: "tiles",
    label: "点数計算で確認するアガリ形のイメージ",
    tiles: ["man2", "man3", "man4", "man3", "man4", "man5", "pin4", "pin5", "pin6", "sou6", "sou7", "sou8", "pin5", "pin5"]
  },
  "実践でよく見る待ち一覧": {
    kind: "tiles",
    label: "両面待ちでテンパイしている手牌のイメージ",
    tiles: ["man2", "man3", "man4", "pin3", "pin4", "pin5", "pin6", "pin7", "pin8", "sou4", "sou5", "ji7", "ji7"]
  },
  "実践でよく見る一向聴の形": {
    kind: "tiles",
    label: "一向聴で比較する手牌のイメージ",
    tiles: ["man2", "man3", "man4", "pin3", "pin4", "pin5", "sou5", "sou6", "man6", "man7", "pin8", "pin8", "ji1"]
  }
};

export const metadata: Metadata = {
  title: "実践でよく使う麻雀の基本 | 役・点数計算・待ち・一向聴",
  description: "麻雀の役、点数計算、待ち、一向聴の基本を牌姿とともに確認できます。各テーマの解説から練習問題や計算ツールへ進めます。",
  alternates: { canonical: "/rules" }
};

export default function RulesPage() {
  return (
    <main className="siteMain">
      <PageHero
        eyebrow="Rules Library"
        title="実践でよく使う麻雀の基本"
        description="役の成立条件、点数計算、待ちの形、一向聴の考え方をテーマ別に確認できます。牌姿を見ながら読み進め、練習やツールで理解を確かめましょう。"
        primaryLink={{ label: "初心者ロードマップを見る", href: "/learn" }}
        secondaryLink={{ label: "練習問題を解く", href: "/trainer" }}
      />

      <section>
        <SectionTitle
          title="テーマから選ぶ"
          description="まず知りたい内容を開き、成立条件や牌姿を確認してください。"
        />
        <div className="rulesGrid">
          {ruleItems.map((item) => (
            <article className="ruleCard" key={item.title}>
              <RuleCardVisual title={item.title} />
              <div className="cardTopline">
                <h2>{item.title}</h2>
              </div>
              <p>{item.description}</p>
              {item.href ? <a className="textLink" href={item.href}>読む</a> : null}
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

function RuleCardVisual({ title }: { title: string }) {
  const visual = ruleVisuals[title];

  if (!visual) {
    return null;
  }

  if (visual.kind === "screenshot") {
    return (
      <div className="ruleCardVisual ruleCardScreenshot">
        <img src={visual.src} alt={visual.alt} />
      </div>
    );
  }

  return (
    <div className="ruleCardVisual" aria-label={visual.label}>
      {visual.tiles.map((tile, index) => (
        <img key={`${tile}-${index}`} src={`/tiles/${tile}-66-90-l-emb.png`} alt="" />
      ))}
    </div>
  );
}

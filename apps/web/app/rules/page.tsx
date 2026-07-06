import type { Metadata } from "next";
import { ComingSoonBadge } from "../components/Badges";
import { InternalLinkCard, PageHero, SectionTitle } from "../components/SiteSections";
import { ruleItems } from "../siteData";

const ruleVisuals: Record<string, { kind: "tiles"; tiles: string[]; label: string } | { kind: "screenshot"; src: string; alt: string }> = {
  "実践でよく見る役一覧": {
    kind: "tiles",
    label: "リーチ、タンヤオ、役牌のイメージ",
    tiles: ["man2", "man3", "man4", "pin3", "pin4", "pin5", "sou6", "sou7", "sou8", "ji7", "ji7", "ji7"]
  },
  "実践でよく見る点数計算": {
    kind: "screenshot",
    src: "/tool-screenshots/score-calculator-result.png",
    alt: "点数計算ツールで点数結果を確認している画面"
  },
  "実践でよく見る待ち一覧": {
    kind: "tiles",
    label: "両面待ちと待ち牌のイメージ",
    tiles: ["man4", "man5", "man3", "man6", "pin3", "pin5", "pin4", "sou1", "sou2", "sou3"]
  },
  "実践でよく見る一向聴の形": {
    kind: "tiles",
    label: "一向聴で比較する手牌のイメージ",
    tiles: ["man2", "man3", "man4", "pin3", "pin4", "sou5", "sou6", "sou7", "ji7", "ji7", "pin8", "sou2"]
  }
};

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
              <RuleCardVisual title={item.title} />
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

import type { Metadata } from "next";
import Link from "next/link";
import { SectionTitle } from "../components/SiteSections";

export const metadata: Metadata = {
  title: "麻雀 初めて学ぶ | 初心者ロードマップ・ルール・便利ツール",
  description:
    "麻雀をこれから始める初心者向けの学習入口です。初心者ロードマップ、実践で頻出する点数計算や待ち、点数計算や何切るを確認できる麻雀便利ツールへ進めます。"
};

const roadmapTiles = ["man1", "man2", "man3", "pin4", "pin5", "pin6", "ji7"];
const rulesTiles = ["man2", "man3", "man4", "man5", "man6", "man7", "man8"];

export default function LearnPage() {
  return (
    <main className="siteMain">
      <h1 className="srOnly">初めて学ぶ</h1>
      <section>
        <SectionTitle
          title="最初に見るところ"
          description="麻雀を覚える順番が分からないときは、この3つから選んでください。読み物、ルール確認、アプリでの実践に分けています。"
        />
        <div className="learnHubStack">
          <article className="learnHubCard">
            <div>
              <p className="siteEyebrow">Roadmap</p>
              <h2>初心者ロードマップ</h2>
              <p>麻雀をこれから始める方へ向けた「何から学べばいいのか！？」を整理したページです。麻雀のいろはを順番に紹介します。</p>
            </div>
            <div className="learnHubVisual learnHubTileVisual" aria-label="順子と役牌を並べた麻雀牌の例">
              {roadmapTiles.map((tile) => (
                <img key={tile} src={`/tiles/${tile}-66-90-l-emb.png`} alt="" />
              ))}
            </div>
            <Link className="cardButton" href="/learn/roadmap">ロードマップを見る</Link>
          </article>

          <article className="learnHubCard">
            <div>
              <p className="siteEyebrow">Rules</p>
              <h2>基本的なルールを覚えたあなたへ</h2>
              <p>実践で頻出する点数計算や待ちについて、これが分かれば9割方問題なし！</p>
            </div>
            <div className="learnHubVisual learnHubTileVisual isRulesVisual" aria-label="三面待ちの形を表す麻雀牌の例">
              {rulesTiles.map((tile) => (
                <img key={tile} src={`/tiles/${tile}-66-90-l-emb.png`} alt="" />
              ))}
            </div>
            <Link className="cardButton" href="/rules">これが分かれば実践問題なし！</Link>
          </article>

          <article className="learnHubCard">
            <div>
              <p className="siteEyebrow">Tools</p>
              <h2>困った時の麻雀便利ツール</h2>
              <p>牌を入力すると自動で点数計算を確認できます。何を切ると良かったのかを比較できるツールや、麻雀上達のためのトレーニングツールもあります。</p>
            </div>
            <figure className="learnHubVisual learnHubScreenshot">
              <img src="/tool-screenshots/ukeire-checker-comparison.png" alt="牌理チェッカーで受け入れ枚数を比較している画面" />
              <figcaption>実際の手牌を見ながら、点数や受け入れを確認できます。</figcaption>
            </figure>
            <div className="learnHubLinks">
              <Link href="/trainer">アプリの解析モードを開く</Link>
              <Link href="/tools">麻雀便利ツールを見る</Link>
              <Link href="/trainer">麻雀トレーニングを見る</Link>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}

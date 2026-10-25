import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, SectionTitle } from "../components/SiteSections";

export const metadata: Metadata = {
  title: "麻雀 初めて学ぶ | 初心者ロードマップ・ルール・便利ツール",
  description:
    "麻雀をこれから学ぶ方に向けた入口です。初心者ロードマップ、役や点数計算の解説、牌理チェッカーや何切るトレーニングへ進めます。",
  alternates: { canonical: "/learn" }
};

const roadmapTiles = ["man1", "man2", "man3", "pin4", "pin5", "pin6", "ji7"];
const rulesTiles = ["man2", "man3", "man4", "man5", "man6", "man7", "man8"];

export default function LearnPage() {
  return (
    <main className="siteMain learnLandingPage">
      <PageHero
        eyebrow="LEARNING PATH"
        title="麻雀を学ぶ"
        description="ルールを覚える、実戦で使う、牌姿で練習する。知りたいテーマや今のレベルに合わせて進めます。"
      />
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
              <p>役、点数計算、待ちの基本を牌図で確認し、実戦で迷いやすい条件を整理します。</p>
            </div>
            <div className="learnHubVisual learnHubTileVisual isRulesVisual" aria-label="三面待ちの形を表す麻雀牌の例">
              {rulesTiles.map((tile) => (
                <img key={tile} src={`/tiles/${tile}-66-90-l-emb.png`} alt="" />
              ))}
            </div>
            <Link className="cardButton" href="/rules">役・点数・待ちを確認する</Link>
          </article>

          <article className="learnHubCard">
            <div>
              <p className="siteEyebrow">Tools</p>
              <h2>困った時の麻雀ツール</h2>
              <p>牌を入力すると自動で点数計算を確認できます。何を切ると良かったのかを比較できるツールや、麻雀上達のためのトレーニングツールもあります。</p>
            </div>
            <figure className="learnHubVisual learnHubScreenshot">
              <img src="/tool-screenshots/ukeire-checker-comparison.png" alt="牌理チェッカーで受け入れ枚数を比較している画面" />
              <figcaption>実際の手牌を見ながら、点数や受け入れを確認できます。</figcaption>
            </figure>
            <div className="learnHubLinks">
              <Link href="/analysis/mahjong-tool">麻雀解析ツールを開く</Link>
              <Link href="/tools">麻雀点数計算ツール🔰を開く</Link>
              <Link href="/analysis/orasu-condition">オーラス条件を計算する</Link>
              <Link href="/trainer">麻雀トレーニングを見る</Link>
            </div>
          </article>
        </div>
      </section>

      <section className="learningGuideHub">
        <SectionTitle
          title="テーマから麻雀を学ぶ"
          description="牌効率、何切る、守備、鳴き、点数計算を、牌姿つきの記事で学べるガイド集です。"
        />
        <div className="learningGuideHubCta">
          <div>
            <p className="siteEyebrow">PRACTICAL GUIDES</p>
            <h2>知りたい内容を選んで読む</h2>
            <p>5ブロック理論、待ちの形、受け入れ、スジ・カベ、鳴き判断、点数計算20問までまとめています。</p>
          </div>
          <Link href="/learn/guides">麻雀を学ぶページへ</Link>
        </div>
      </section>

      <section className="rulesLearningSequence" aria-labelledby="learn-next-step-title">
        <SectionTitle id="learn-next-step-title" title="今のつまずきから、次の一歩を選ぶ" description="最初から全部覚える必要はありません。分からないことを一つ確認し、短い練習で確かめてから対局へ戻りましょう。" />
        <ol>
          <li><span>01</span><div><h3>牌の名前やアガリ形がまだ分からない</h3><p>ロードマップで面子・雀頭・テンパイを順に学びます。用語が分からなくなったら辞典で調べ、元の教材へ戻ると読み進めやすくなります。</p><Link href="/learn/roadmap">初心者ロードマップ</Link><span aria-hidden="true">　</span><Link href="/learn/glossary">麻雀用語辞典</Link></div></li>
          <li><span>02</span><div><h3>形はできたのに、アガれる理由が分からない</h3><p>役一覧で成立条件と鳴きの可否を確認します。役判定クイズでは、完成形だけでなく門前かどうかやアガリ方も見て、一つずつ役を探します。</p><Link href="/rules/yaku">役の条件を確認</Link><span aria-hidden="true">　</span><Link href="/training/yaku-quiz">役判定クイズ</Link></div></li>
          <li><span>03</span><div><h3>何を切るか迷う</h3><p>牌効率の記事でシャンテン数と受け入れの違いを確認し、牌理チェッカーに実際の14枚を入力します。候補の枚数を比べた後、打点や安全度も別に考えます。</p><Link href="/learn/guides/what-is-tile-efficiency">牌効率の基本</Link><span aria-hidden="true">　</span><Link href="/analysis/mahjong-tool">自分の手牌で比較</Link></div></li>
          <li><span>04</span><div><h3>点数や逆転条件が分からない</h3><p>手牌のアガリ点は点数計算、順位を変えるために必要な点はオーラス条件計算で調べます。供託を含む受け取りと、相手が支払う点数を分けて確認します。</p><Link href="/tools">アガリ点を計算</Link><span aria-hidden="true">　</span><Link href="/analysis/orasu-condition">順位条件を比較</Link></div></li>
        </ol>
      </section>
    </main>
  );
}

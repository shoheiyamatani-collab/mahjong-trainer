import type { Metadata } from "next";
import Link from "next/link";
import { SectionTitle } from "../components/SiteSections";

export const metadata: Metadata = {
  title: "麻雀 初めて学ぶ | 初心者ロードマップ・ルール・便利ツール",
  description:
    "麻雀をこれから始める初心者向けの学習入口です。初心者ロードマップ、ルール一覧、点数計算や何切るを確認できる麻雀便利ツールへ進めます。"
};

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
            <Link className="cardButton" href="/learn/roadmap">ロードマップを見る</Link>
          </article>

          <article className="learnHubCard">
            <div>
              <p className="siteEyebrow">Rules</p>
              <h2>ルール一覧</h2>
              <p>麻雀の符計算、点数一覧、役、リーチ、タンヤオ、鳴きなどの確認はこちら。分からない言葉を後から調べる入口です。</p>
            </div>
            <Link className="cardButton" href="/rules">ルール一覧を見る</Link>
          </article>

          <article className="learnHubCard">
            <div>
              <p className="siteEyebrow">Tools</p>
              <h2>困った時の麻雀便利ツール</h2>
              <p>牌を入力すると自動で点数計算を確認できます。何を切ると良かったのかを比較できるツールや、麻雀上達のためのトレーニングツールもあります。</p>
            </div>
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

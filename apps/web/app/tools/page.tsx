import type { Metadata } from "next";
import Link from "next/link";
import { InternalLinkCard, PageHero, SectionTitle } from "../components/SiteSections";
import { toolItems } from "../siteData";

export const metadata: Metadata = {
  title: "麻雀便利ツール | 点数計算ツール・受け入れ枚数チェッカー",
  description: "麻雀の点数計算ツールと受け入れ枚数チェッカーの入口です。手牌、条件、打牌候補を入力して、点数や受け入れ枚数を確認できます。"
};

export default function ToolsPage() {
  return (
    <main className="siteMain">
      <PageHero
        eyebrow="Tools"
        title="麻雀便利ツール"
        description="点数を確認したいとき、何を切ると手が進みやすいか比べたいときに使う2つのツールです。実際の画面を見ながら、できることを確認できます。"
        primaryLink={{ label: "点数計算ツールを開く", href: "/trainer" }}
        secondaryLink={{ label: "受け入れを確認する", href: "/trainer" }}
      />

      <section>
        <SectionTitle title="使えるツール" description="まずはこの2つだけ覚えれば大丈夫です。点数確認と何切るの答え合わせに使えます。" />
        <div className="toolFeatureGrid">
          {toolItems.map((item) => (
            <article className="toolFeatureCard" key={item.title}>
              <div className="toolFeatureImageFrame">
                <img src={item.imageSrc} alt={item.imageAlt} />
              </div>
              <div className="toolFeatureBody">
                <p className="siteEyebrow">Mahjong Tool</p>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
                <p className="toolBeginnerNote">{item.beginnerNote}</p>
                <div className="toolCheckPanel">
                  <h3>このツールで確認できること</h3>
                  <ul>
                    {item.checks.map((check) => (
                      <li key={check}>{check}</li>
                    ))}
                  </ul>
                </div>
                {item.href ? <Link className="cardButton" href={item.href}>{item.title}を使う</Link> : <span className="cardButton disabled" aria-disabled="true">準備中</span>}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle title="ツールから学習へ" description="調べて終わりではなく、関連する練習に戻れる導線を置いています。" />
        <div className="linkCardGrid">
          <InternalLinkCard title="点数計算を覚える" description="点数は最後で大丈夫。まずはツールで結果を見ながら慣れます。" href="/learn" />
          <InternalLinkCard title="受け入れを学ぶ" description="何切るで大事な、次にうれしい牌の考え方を復習します。" href="/learn/basic-nanikiru" />
          <InternalLinkCard title="役一覧を確認する" description="点数計算で出てくる役を、牌姿つきで確認できます。" href="/rules/yaku" />
        </div>
      </section>
    </main>
  );
}

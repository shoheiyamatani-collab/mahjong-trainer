import VideoPracticeGateway from "../VideoPracticeGateway";
import { VideoReadingTime } from "../VideoReadingTime";
import type { Metadata } from "next";
import { getRobotsPolicy } from "@mahjong-trainer/content-index-policy";
import Link from "next/link";
import { HirasawaTileEfficiencyBook } from "../../../components/VideoBookRecommendation";
import { VideoArticleCompactContent } from "../VideoArticleCompactContent";
import { countsToTiles } from "@mahjong-trainer/mahjong-core";
import { TileStrip, tileAssetName } from "../../../components/TileFigures";
import { getUkeireProgressExample } from "./ukeireExample";
import exampleStyles from "../../../tools/tool-learning.module.css";

export const metadata: Metadata = {
  alternates: { canonical: "/videos/strategy/ukeire-vs-shape-change-basics" },
  robots: getRobotsPolicy("/videos/strategy/ukeire-vs-shape-change-basics"),
  title: "麻雀の受け入れとは？手変わりとの違いを初心者向けに解説",
  description: "麻雀の受け入れを『シャンテン数が進む牌』として理解し、形が良くなる手変わりとの違い、受け入れの見つけ方と練習方法を短い要点で解説します。"
};

const videoUrl = "https://www.youtube.com/watch?v=UvwfxpDK2zw";

const tileNames: Record<string, string> = {
  man1: "一萬", man2: "二萬", man3: "三萬", man4: "四萬", man5: "五萬", man6: "六萬", man7: "七萬", man8: "八萬", man9: "九萬",
  pin1: "一筒", pin2: "二筒", pin3: "三筒", pin4: "四筒", pin5: "五筒", pin6: "六筒", pin7: "七筒", pin8: "八筒", pin9: "九筒",
  sou1: "一索", sou2: "二索", sou3: "三索", sou4: "四索", sou5: "五索", sou6: "六索", sou7: "七索", sou8: "八索", sou9: "九索"
};

function TileRow({ tiles }: { tiles: string[] }) {
  return (
    <div>
      {tiles.map((tile, index) => (
        <img key={`${tile}-${index}`} src={`/tiles/${tile}-66-90-l-emb.png`} alt={tileNames[tile] ?? tile} />
      ))}
    </div>
  );
}

export default function UkeireVsShapeChangeBasicsPage() {
  const example = getUkeireProgressExample();
  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト"><Link href="/">トップ</Link><span>›</span><Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span><span>受け入れの仕組み</span></nav>
          <p className="siteEyebrow">VIDEO GUIDE / 牌効率・受け入れ</p>
          <h1>「引いたら嬉しい牌」ではない。受け入れを正しく覚えよう</h1>
          <p className="videoArticleLead">麻雀の受け入れとは、引いたときにシャンテン数が進む牌です。形が良くなる牌や打点が上がる牌も嬉しい牌ですが、それらは受け入れとは分けて考えます。</p>
          <div className="videoArticleByline"><span>紹介動画: 平澤元気麻雀ch</span><time>動画公開日 2026年7月29日</time><VideoReadingTime articleHref="/videos/strategy/ukeire-vs-shape-change-basics" /></div>
        </header>

        <div className="videoArticleEmbed">
          <iframe
            src="https://www.youtube-nocookie.com/embed/UvwfxpDK2zw"
            title="9割の初心者が勘違いしている正しい受け入れの仕組み"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen loading="lazy" />
        </div>
        <p className="videoSourceNote">動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">平澤元気麻雀chの元動画をYouTubeで見る</a></p>

        <section className="videoArticleAudience">
                  <div><p className="videoArticleSectionLabel">RECOMMENDED FOR</p><h2>この動画はこんな人に向いています</h2></div>
                  <ul>
                    <li>受け入れを「引いたら嬉しい牌」だと思っていた人</li>
                    <li>何切るの解説で「受け入れが広い」と言われても分からない人</li>
                    <li>リーチボタンが出てからテンパイに気づくことがある人</li>
                    <li>一向聴の受け入れを自分で数えられるようになりたい人</li>
                  </ul>
                </section>

        <VideoArticleCompactContent
          message={"麻雀の受け入れとは、引いたときにシャンテン数が進む牌です。"}
          points={[
            { title: "受け入れとは、シャンテン数が進む牌", description: "シャンテン数は、最低あと何手でテンパイできるかを表します。" },
            { title: "形が良くなるだけなら「手変わり」", description: "孤立した2筒の周辺を引けば形は良くなります。" },
            { title: "1種類の受け入れと、2種類の変化を同列に数えない", description: "12萬は3萬を引けば面子が完成します。" },
          ]}
        />
        <section className="videoArticleBodySection" aria-labelledby="ukeire-checker-example-title">
          <p className="videoArticleSectionLabel">JONGFOLIO / 計算で確かめる</p>
          <h2 id="ukeire-checker-example-title">同じ13枚でも、ツモで「進む」と「変わる」は違う</h2>
          <p>ここからは元動画の要約ではなく、当サイトの計算検証です。既存のチェッカー教材の14枚を使っています。動画や実対局の手牌を再現したものではありません。副露なし・通常形を対象に、場に見えている牌は入力しない条件で比較します。</p>
          <div className={exampleStyles.hand}><TileStrip tiles={countsToTiles(example.hand).map((tile) => tileAssetName(tile))} /></div>
          <p>まず1筒を切ると13枚の一向聴になり、テンパイへ進む受け入れは{example.base.ukeireTypes}種・{example.base.ukeireTiles}枚です。この同じ13枚から、次の二通りを比べます。</p>
          <table className={exampleStyles.comparisonTable}>
            <caption>1筒を切った後のツモと打牌の比較</caption>
            <thead><tr><th scope="col">ツモ → 打牌</th><th scope="col">打牌後</th><th scope="col">違い</th></tr></thead>
            <tbody>
              <tr><th scope="row">2萬 → 6索</th><td>{example.progress.result.afterDiscardShanten === 0 ? "テンパイ" : "一向聴"}</td><td>シャンテン数が進む</td></tr>
              <tr><th scope="row">5筒 → 6索</th><td>一向聴</td><td>形は変わるが、テンパイではない</td></tr>
            </tbody>
          </table>
          <p>2萬は、この一向聴からテンパイへ進む有効牌です。一方、5筒を引いて筒子が連続して見えても、6索を切った後は一向聴のままです。「形が変わったこと」と「テンパイへ一段進んだこと」を同じ受け入れとして数えないのがポイントです。比較のため打牌を6索にそろえており、5筒ツモ時の6索切りを最善打として推奨する例ではありません。</p>
          <p>この比較は速度だけを確認しています。良形変化の価値、打点、相手への安全性は別に比べる必要があり、{example.base.ukeireTiles}枚という理論枚数からツモ率やアガリ率を直接求めることはできません。</p>
          <div className="toolGuideLinks">
            <a href={example.originalHref}>元の14枚をチェッカーへ</a>
            <a href={example.progressHref}>2萬を引いた14枚を確認</a>
            <a href={example.shapeChangeHref}>5筒を引いた14枚を確認</a>
          </div>
          <p>ツールでは6索切りの行を探して進行を確認できます。見終わったら<Link href="/trainer/iishanten">イーシャンテン何切る</Link>で、引くと手が進む牌と、形だけが変わる牌を分けて練習してみましょう。</p>
        </section>
        <section className="videoArticleNext">
                  <p className="videoArticleSectionLabel">NEXT STEP</p>
                  <h2>手牌を入力して受け入れを確かめる</h2>
                  <div>
                    <Link href="/analysis/mahjong-tool">牌理チェッカーで受け入れを確認する</Link>
                    <Link href="/videos/strategy/tile-efficiency-four-rules">牌効率の4法則へ進む</Link>
                    <Link href="/videos/strategy/seven-important-shapes-to-memorize">重要な牌の形7選を覚える</Link>
                    <Link href="/trainer">何切る問題で判断を試す</Link>
                  </div>
                </section>

        <VideoPracticeGateway articleHref="/videos/strategy/ukeire-vs-shape-change-basics" />

        <HirasawaTileEfficiencyBook />


</article>
    </main>
  );
}

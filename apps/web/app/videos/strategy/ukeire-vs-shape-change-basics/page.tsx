import type { Metadata } from "next";
import Link from "next/link";
import { HirasawaTileEfficiencyBook } from "../../../components/VideoBookRecommendation";
import { VideoArticleCompactContent } from "../VideoArticleCompactContent";

export const metadata: Metadata = {
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
  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト"><Link href="/">トップ</Link><span>›</span><Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span><span>受け入れの仕組み</span></nav>
          <p className="siteEyebrow">VIDEO GUIDE / 牌効率・受け入れ</p>
          <h1>「引いたら嬉しい牌」ではない。受け入れを正しく覚えよう</h1>
          <p className="videoArticleLead">麻雀の受け入れとは、引いたときにシャンテン数が進む牌です。形が良くなる牌や打点が上がる牌も嬉しい牌ですが、それらは受け入れとは分けて考えます。</p>
          <div className="videoArticleByline"><span>紹介動画: 平澤元気麻雀ch</span><time>動画公開日 2026年7月29日</time><span>約3分で読める</span></div>
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

        <HirasawaTileEfficiencyBook />

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

</article>
    </main>
  );
}

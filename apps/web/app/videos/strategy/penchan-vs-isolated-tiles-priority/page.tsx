import type { Metadata } from "next";
import Link from "next/link";
import { VideoArticleCompactContent } from "../VideoArticleCompactContent";

export const metadata: Metadata = {
  title: "麻雀のペンチャンと孤立牌の優先順位｜残す形の判断基準",
  description: "麻雀中級者向けに、ペンチャンと孤立牌3〜7のどちらを残すか短い要点で解説。シャンテン数、最終待ち、タンヤオ、巡目から判断します。"
};

const videoUrl = "https://www.youtube.com/watch?v=BO96oiuZoBA";

const tileNames: Record<string, string> = {
  man1: "一萬", man2: "二萬", man3: "三萬", man4: "四萬", man5: "五萬",
  man6: "六萬", man7: "七萬", man8: "八萬", man9: "九萬",
  pin1: "一筒", pin2: "二筒", pin3: "三筒", pin4: "四筒", pin5: "五筒",
  pin6: "六筒", pin7: "七筒", pin8: "八筒", pin9: "九筒",
  sou1: "一索", sou2: "二索", sou3: "三索", sou4: "四索", sou5: "五索",
  sou6: "六索", sou7: "七索", sou8: "八索", sou9: "九索"
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

export default function PenchanVsIsolatedTilesPage() {
  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト">
            <Link href="/">トップ</Link><span>›</span>
            <Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span>
            <Link href="/videos/strategy/advanced">中級者以上向け</Link><span>›</span>
            <span>ペンチャンと孤立牌</span>
          </nav>
          <p className="siteEyebrow">INTERMEDIATE VIDEO GUIDE / 牌効率・ターツ比較</p>
          <h1>ペンチャンと孤立牌3〜7の優先順位</h1>
          <p className="videoArticleLead">ペンチャンは待ちとして弱い一方、あと1枚で面子になります。孤立した3〜7は両面へ育ちやすい一方、面子完成まで通常2手かかります。どちらを残すかは「弱い形か、強い形か」だけでなく、テンパイまでの距離と完成後の価値で決めます。</p>
          <div className="videoArticleByline"><span>紹介動画: 発男道場【麻雀解説ch】</span><time>動画公開日 2026年4月18日</time><span>約3分で読める</span></div>
        </header>

        <div className="videoArticleEmbed">
          <iframe
            src="https://www.youtube-nocookie.com/embed/BO96oiuZoBA"
            title="【麻雀解説】これでもう迷わない！ペンチャンと孤立牌3〜7の選択基準"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen loading="lazy" />
        </div>
        <p className="videoSourceNote">動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">発男道場【麻雀解説ch】の元動画をYouTubeで見る</a></p>

        <section className="videoArticleAudience">
                  <div><p className="videoArticleSectionLabel">RECOMMENDED FOR</p><h2>この動画はこんな人に向いています</h2></div>
                  <ul>
                    <li>ペンチャンを見つけるとすぐ外してしまう人</li>
                    <li>孤立した3〜7をどこまで残すか迷う人</li>
                    <li>テンパイ速度と最終待ちを一緒に比較したい人</li>
                    <li>タンヤオ変化を手組みに取り入れたい人</li>
                  </ul>
                </section>

        <VideoArticleCompactContent
          message={"ペンチャンは待ちとして弱い一方、あと1枚で面子になります。"}
          points={[
            { title: "最初に2つの形の役割を分ける", description: "" },
            { title: "ペンチャンを残すとテンパイしやすい", description: "一二萬は三萬を引くだけで一二三の面子になります。" },
            { title: "孤立牌3〜7を残すと良形へ育ちやすい", description: "孤立した3〜7は、左右のどちらへ伸びても両面を作れる牌が多くあります。" },
          ]}
        />

        <section className="videoArticleNext">
                  <p className="videoArticleSectionLabel">NEXT STEP</p>
                  <h2>ターツと孤立牌の価値を比べる</h2>
                  <div>
                    <Link href="/analysis/mahjong-tool">牌理チェッカーで受け入れを比較する</Link>
                    <Link href="/videos/strategy/isolated-terminal-tile-order">孤立牌1・9の優先順位を読む</Link>
                    <Link href="/videos/strategy/how-to-handle-four-consecutive-shape">4連形をどこまで残すか読む</Link>
                    <Link href="/videos/strategy/advanced">中級者以上向け動画を見る</Link>
                  </div>
                </section>

</article>
    </main>
  );
}

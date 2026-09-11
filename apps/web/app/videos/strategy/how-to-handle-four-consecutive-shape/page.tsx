import type { Metadata } from "next";
import Link from "next/link";
import { VideoArticleCompactContent } from "../VideoArticleCompactContent";

export const metadata: Metadata = {
  title: "麻雀の4連形はどこまで残す？｜崩す場面と判断基準",
  description: "麻雀中級者向けに、3456などの4連形を残す場面と崩す場面を短い要点で解説。最終待ち、巡目、ドラ、ほかのターツから判断する方法を紹介します。"
};

const videoUrl = "https://www.youtube.com/watch?v=OEy1gpsVuQo";

const tileNames: Record<string, string> = {
  man1: "一萬", man2: "二萬", man3: "三萬", man4: "四萬", man5: "五萬",
  man6: "六萬", man7: "七萬", man8: "八萬", man9: "九萬",
  pin1: "一筒", pin2: "二筒", pin3: "三筒", pin4: "四筒", pin5: "五筒",
  pin6: "六筒", pin7: "七筒", pin8: "八筒",
  sou2: "二索", sou3: "三索", sou4: "四索", sou6: "六索", sou7: "七索", sou8: "八索"
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

export default function FourConsecutiveShapePage() {
  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト">
            <Link href="/">トップ</Link><span>›</span>
            <Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span>
            <Link href="/videos/strategy/advanced">中級者以上向け</Link><span>›</span>
            <span>4連形の扱い</span>
          </nav>
          <p className="siteEyebrow">INTERMEDIATE VIDEO GUIDE / 牌効率・4連形</p>
          <h1>4連形はどこまで残す？判断の基準</h1>
          <p className="videoArticleLead">3456のように4枚が連続した4連形は、面子・両面・三面張へ育つ強い形です。ただし「強いから最後まで残す」だけでは不十分です。崩した後の待ち、巡目、打点を比べて、変化を見る時間があるかを判断します。</p>
          <div className="videoArticleByline"><span>紹介動画: 発男道場【麻雀解説ch】</span><time>動画公開日 2026年5月9日</time><span>約3分で読める</span></div>
        </header>

        <div className="videoArticleEmbed">
          <iframe
            src="https://www.youtube-nocookie.com/embed/OEy1gpsVuQo"
            title="【麻雀解説】4連形は良い形だけど…どこまで残すべきなのか？ポイントや基準を解説"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen loading="lazy" />
        </div>
        <p className="videoSourceNote">動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">発男道場【麻雀解説ch】の元動画をYouTubeで見る</a></p>

        <section className="videoArticleAudience">
                  <div><p className="videoArticleSectionLabel">RECOMMENDED FOR</p><h2>この動画はこんな人に向いています</h2></div>
                  <ul>
                    <li>4連形を見つけると無条件で残してしまう人</li>
                    <li>受け入れ最大と良形変化のどちらを優先するか迷う人</li>
                    <li>一向聴から二向聴へ戻す判断を学びたい人</li>
                    <li>巡目に応じて手組みを切り替えたい人</li>
                  </ul>
                </section>

        <VideoArticleCompactContent
          message={"3456のように4枚が連続した4連形は、面子・両面・三面張へ育つ強い形です。"}
          points={[
            { title: "4連形は「1面子＋もう1ブロック」へ育ちやすい", description: "" },
            { title: "3456から生まれる代表的な変化", description: "二筒を引いた23456は一・四・七筒、七筒を引いた34567は二・五・八筒が使える三面張の種になります。" },
            { title: "同じ4連形でも中央にあるほど変化が多い", description: "3456は左右のどちらへ伸びても強く、2345も残す価値があります。" },
          ]}
        />

        <section className="videoArticleNext">
                  <p className="videoArticleSectionLabel">NEXT STEP</p>
                  <h2>複合形と受け入れを比較する</h2>
                  <div>
                    <Link href="/analysis/mahjong-tool">牌理チェッカーで受け入れを比較する</Link>
                    <Link href="/videos/strategy/seven-meld-building-shapes">面子を作りやすい7つの形を読む</Link>
                    <Link href="/videos/strategy/four-tile-shape-vs-floating-tile">4枚形と孤立牌の比較を読む</Link>
                    <Link href="/videos/strategy/advanced">中級者以上向け動画を見る</Link>
                  </div>
                </section>

</article>
    </main>
  );
}

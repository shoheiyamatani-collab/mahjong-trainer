import type { Metadata } from "next";
import Link from "next/link";
import { VideoArticleCompactContent } from "../VideoArticleCompactContent";

export const metadata: Metadata = {
  title: "麻雀の2446は何を切る？｜複合形の扱いと判断基準",
  description: "麻雀中級者向けに、2446から2・4・6のどれを切るか短い要点で解説。ピンフ、両面変化、ポン、最終待ち、巡目による選択を比較します。"
};

const videoUrl = "https://www.youtube.com/watch?v=7XSu0hGAfeI";

const tileNames: Record<string, string> = {
  man1: "一萬", man2: "二萬", man3: "三萬", man4: "四萬", man5: "五萬", man6: "六萬", man7: "七萬", man8: "八萬",
  pin2: "二筒", pin3: "三筒", pin4: "四筒", pin5: "五筒", pin6: "六筒", pin7: "七筒",
  sou3: "三索", sou4: "四索", sou5: "五索", sou6: "六索", sou7: "七索"
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

export default function Handle2446ShapePage() {
  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト">
            <Link href="/">トップ</Link><span>›</span>
            <Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span>
            <Link href="/videos/strategy/advanced">中級者以上向け</Link><span>›</span>
            <span>2446の扱い</span>
          </nav>
          <p className="siteEyebrow">INTERMEDIATE VIDEO GUIDE / 牌効率・複合形</p>
          <h1>複合形2446は何を切る？</h1>
          <p className="videoArticleLead">二四四六萬は、リャンカンと対子が重なった4枚形です。四萬を切ってカンチャン2つを残すか、二萬を切って四萬の対子を残すか、六萬を切って中間を取るか。手牌の役と巡目によって選択が変わります。</p>
          <div className="videoArticleByline"><span>紹介動画: 発男道場【麻雀解説ch】</span><time>動画公開日 2025年9月20日</time><span>約3分で読める</span></div>
        </header>

        <div className="videoArticleEmbed">
          <iframe
            src="https://www.youtube-nocookie.com/embed/7XSu0hGAfeI"
            title="【麻雀解説】意外と知らない？2446を扱う時のポイント！"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen loading="lazy" />
        </div>
        <p className="videoSourceNote">動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">発男道場【麻雀解説ch】の元動画をYouTubeで見る</a></p>

        <section className="videoArticleAudience">
                  <div><p className="videoArticleSectionLabel">RECOMMENDED FOR</p><h2>この動画はこんな人に向いています</h2></div>
                  <ul>
                    <li>2446から何となく四萬を切っている人</li>
                    <li>ピンフと両面変化のどちらを優先するか迷う人</li>
                    <li>ポンできる対子を残す条件を知りたい人</li>
                    <li>序盤と中盤で複合形の扱いを変えたい人</li>
                  </ul>
                </section>

        <VideoArticleCompactContent
          message={"二四四六萬は、リャンカンと対子が重なった4枚形です。"}
          points={[
            { title: "2446は3つの切り方がある", description: "" },
            { title: "四萬切りはピンフを最大限に見る", description: "四萬を切ると、三萬・五萬の合計8枚で順子ができます。" },
            { title: "二萬切りは両面変化とポンを残す", description: "二萬を切れば四萬の対子が残り、四萬をポンして手を進められます。" },
          ]}
        />

        <section className="videoArticleNext">
                  <p className="videoArticleSectionLabel">NEXT STEP</p>
                  <h2>複合形を続けて比較する</h2>
                  <div>
                    <Link href="/analysis/mahjong-tool">牌理チェッカーで受け入れを比較する</Link>
                    <Link href="/videos/strategy/how-to-handle-35677">複合形35677の扱いを読む</Link>
                    <Link href="/videos/strategy/ryankan-vs-aryanmen-shape">リャンカンと亜両面を比較する</Link>
                    <Link href="/videos/strategy/advanced">中級者以上向け動画を見る</Link>
                  </div>
                </section>

</article>
    </main>
  );
}

import VideoPracticeGateway from "../VideoPracticeGateway";
import { VideoReadingTime } from "../VideoReadingTime";
import type { Metadata } from "next";
import { getRobotsPolicy } from "@mahjong-trainer/content-index-policy";
import Link from "next/link";
import { VideoArticleCompactContent } from "../VideoArticleCompactContent";
import { TileStrip, tileAssetName } from "../../../components/TileFigures";
import { get2446ShapeComparison } from "./shapeExample";
import exampleStyles from "../../../tools/tool-learning.module.css";

export const metadata: Metadata = {
  alternates: { canonical: "/videos/strategy/how-to-handle-2446-shape" },
  robots: getRobotsPolicy("/videos/strategy/how-to-handle-2446-shape"),
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
          <p className="videoArticleLead">二四四六萬は、リャンカンと対子が重なった4枚形です。四萬切りなら246萬、二萬切りなら446萬、六萬切りなら244萬が残ります。残りの手牌、役、巡目によって比較の条件が変わります。</p>
          <div className="videoArticleByline"><span>紹介動画: 発男道場【麻雀解説ch】</span><time>動画公開日 2025年9月20日</time><VideoReadingTime articleHref="/videos/strategy/how-to-handle-2446-shape" /></div>
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
            { title: "四萬切りは246萬を残す", description: "三萬なら234萬、五萬なら456萬を作れますが、246萬は4萬を共有する形です。独立したターツ2組としては数えません。" },
            { title: "二萬切りは446萬を残す", description: "4萬の対子を残せます。ただし、ポンが有利か、残る6萬を使えるかは手牌全体で比べます。" },
            { title: "六萬切りは244萬を残す", description: "こちらも4萬の対子を残します。446萬と同じとは限らず、周辺牌や打点の条件を合わせて比較します。" },
          ]}
        />

        <section className="videoArticleBodySection" aria-labelledby="shape-2446-example-title">
          <p className="videoArticleSectionLabel">JONGFOLIO / 部分形の確認</p>
          <h2 id="shape-2446-example-title">切った後の3枚を、実際に並べて比べる</h2>
          <p>ここは当サイト独自の形の確認です。動画内の局面や打ち手の意図を再現したものではありません。以下は手牌14枚ではなく、2446萬から一枚切った後に残る部分形だけを表示しています。</p>
          <table className={exampleStyles.comparisonTable}>
            <caption>2446萬から一枚切った後の部分形</caption>
            <thead><tr><th scope="col">打牌</th><th scope="col">残る3枚</th></tr></thead>
            <tbody>{get2446ShapeComparison().map((row) => <tr key={row.discard}>
              <th scope="row">{row.discard === "4m" ? "4萬" : row.discard === "2m" ? "2萬" : "6萬"}</th>
              <td><div className={exampleStyles.hand}><TileStrip tiles={row.tiles.map((tile) => tileAssetName(tile))} /></div></td>
            </tr>)}</tbody>
          </table>
          <p>246萬に3萬を引くと234萬と6萬、5萬を引くと2萬と456萬に分けられます。どちらも順子を一つ作れますが、残り一枚の使い道も必要です。また、カンチャンから順子ができることと、最終的に両面待ちで平和が成立することは別です。</p>
          <p>この4枚だけでは、手牌全体のシャンテン数・受け入れ枚数・最善打は決まりません。別に雀頭があるか、残りの面子候補がいくつあるか、鳴いた後にも役があるかを先に確認します。対局後は14枚すべてを<Link href="/analysis/mahjong-tool">牌理チェッカー</Link>に入力し、2萬・4萬・6萬切りの行を比較してください。打点や鳴く判断は<Link href="/learn/guides/calling-decision">鳴いていい手・鳴かない方がいい手</Link>で別に確認できます。</p>
        </section>

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

        <VideoPracticeGateway articleHref="/videos/strategy/how-to-handle-2446-shape" />

</article>
    </main>
  );
}

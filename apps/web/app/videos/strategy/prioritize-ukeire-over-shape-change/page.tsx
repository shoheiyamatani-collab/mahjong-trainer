import type { Metadata } from "next";
import Link from "next/link";
import { HirasawaTileEfficiencyBook } from "../../../components/VideoBookRecommendation";
import { VideoArticleCompactContent } from "../VideoArticleCompactContent";

export const metadata: Metadata = {
  title: "麻雀の受け入れと変化｜何切るで優先する牌効率の基本",
  description: "麻雀初心者向けに、シャンテン数が進む受け入れと、形だけが良くなる変化の違いを牌姿で比較し、何切るの優先順位を解説します。"
};

const videoUrl = "https://www.youtube.com/watch?v=GJ91P8Tbhh0";
const tileNames: Record<string, string> = {
  man1: "一萬", man2: "二萬", man3: "三萬", man4: "四萬", man5: "五萬", man6: "六萬", man7: "七萬", man8: "八萬", man9: "九萬",
  pin1: "一筒", pin2: "二筒", pin3: "三筒", pin4: "四筒", pin5: "五筒", pin6: "六筒", pin7: "七筒",
  sou2: "二索", sou3: "三索", sou4: "四索", sou5: "五索", sou6: "六索", ji4: "北"
};

function TileRow({ tiles }: { tiles: string[] }) {
  return (
    <div className={tiles.length >= 10 ? "videoArticleFullHand" : undefined}>
      {tiles.map((tile, index) => (
        <img key={`${tile}-${index}`} src={`/tiles/${tile}-66-90-l-emb.png`} alt={tileNames[tile]} />
      ))}
    </div>
  );
}

export default function PrioritizeUkeireOverShapeChangePage() {
  return (
    <main className="siteMain videoArticlePage ukeirePriorityPage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト"><Link href="/">トップ</Link><span>›</span><Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span><Link href="/videos/strategy/beginner">初心者向け</Link><span>›</span><span>受け入れを優先する牌効率</span></nav>
          <p className="siteEyebrow">BEGINNER VIDEO GUIDE / 牌効率</p>
          <h1>牌効率は「変化」より「受け入れ」を優先する</h1>
          <p className="videoArticleLead">良い形になりそうな牌を残したのに、なかなかテンパイしない。その原因は、すぐ手が進む「受け入れ」と、形が良くなるだけの「変化」を同じ価値で数えていることかもしれません。</p>
          <div className="videoArticleByline"><span>紹介動画: 平澤元気麻雀ch</span><time>動画公開日 2022年12月3日</time><span>約3分で読める</span></div>
        </header>

        <div className="videoArticleEmbed"><iframe src="https://www.youtube-nocookie.com/embed/GJ91P8Tbhh0" title="変化と受け入れを区別する牌効率講座" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen loading="lazy" /></div>
        <p className="videoSourceNote">動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">元動画をYouTubeで見る</a></p>

        <section className="videoArticleAudience">
                  <div><p className="videoArticleSectionLabel">RECOMMENDED FOR</p><h2>この動画はこんな人に向いています</h2></div>
                  <ul><li>良形変化を期待して孤立牌を残しすぎる人</li><li>「引いて嬉しい牌」をすべて受け入れと数えている人</li><li>両面を作ること自体が目的になっている人</li><li>何切るの枚数比較を一段深く理解したい人</li></ul>
                </section>

        <VideoArticleCompactContent
          message={"良い形になりそうな牌を残したのに、なかなかテンパイしない。"}
          points={[
            { title: "引いて嬉しい牌には2種類ある", description: "引いた後にシャンテン数が進む牌です。" },
            { title: "899萬・北北と35索を比べる", description: "この手では、完成している2面子を除くと「899萬・北北」と「35索」の比較になります。" },
            { title: "両面は「作ること」ではなく「面子を完成させやすい」から強い", description: "両面が良いのは、2種類の牌で面子が完成するからです。" },
          ]}
        />

        <HirasawaTileEfficiencyBook />

        <section className="videoArticleNext">
                  <p className="videoArticleSectionLabel">NEXT STEP</p><h2>受け入れを実際の手牌で比べる</h2>
                  <div><Link href="/videos/strategy/ukeire-vs-shape-change-basics">受け入れと手変わりの基礎を復習する</Link><Link href="/analysis/mahjong-tool">牌理チェッカーで受け入れを比較する</Link><Link href="/videos/strategy/tile-efficiency-four-rules">初心者向け牌効率の4法則へ進む</Link></div>
                </section>

</article>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { HirasawaTileEfficiencyBook } from "../../../components/VideoBookRecommendation";
import { VideoArticleCompactContent } from "../VideoArticleCompactContent";

export const metadata: Metadata = {
  title: "麻雀の牌効率を基礎から学ぶ｜初心者向け完全ガイド",
  description: "麻雀初心者向けに、シャンテン数、受け入れ、孤立牌、5ブロック理論、完全イーシャンテン・くっつき・ヘッドレスを短い要点で解説します。"
};

const videoUrl = "https://www.youtube.com/watch?v=Q05otKQCgeU";
const tileNames: Record<string, string> = {
  man1: "一萬", man2: "二萬", man3: "三萬", man4: "四萬", man5: "五萬", man6: "六萬", man7: "七萬", man8: "八萬", man9: "九萬",
  pin1: "一筒", pin2: "二筒", pin3: "三筒", pin4: "四筒", pin5: "五筒", pin6: "六筒", pin7: "七筒", pin8: "八筒", pin9: "九筒",
  sou1: "一索", sou2: "二索", sou3: "三索", sou4: "四索", sou5: "五索", sou6: "六索", sou7: "七索", sou8: "八索", sou9: "九索",
  ji1: "東", ji3: "西", ji7: "中"
};

function TileRow({ tiles }: { tiles: string[] }) {
  return (
    <div className={tiles.length >= 10 ? "videoArticleFullHand" : undefined}>
      {tiles.map((tile, index) => <img key={`${tile}-${index}`} src={`/tiles/${tile}-66-90-l-emb.png`} alt={tileNames[tile]} />)}
    </div>
  );
}

export default function TileEfficiencyCompleteBeginnerGuidePage() {
  return (
    <main className="siteMain videoArticlePage tileEfficiencyCompletePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト"><Link href="/">トップ</Link><span>›</span><Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span><Link href="/videos/strategy/beginner">初心者向け</Link><span>›</span><span>牌効率・完全入門</span></nav>
          <p className="siteEyebrow">BEGINNER VIDEO GUIDE / 牌効率総まとめ</p>
          <h1>麻雀初心者のための牌効率・完全入門</h1>
          <p className="videoArticleLead">牌効率は、手牌だけを見て、できるだけ早くテンパイへ近づくための技術です。約53分の動画を、実戦中に見る順番に沿って4段階へ整理しました。</p>
          <div className="videoArticleByline"><span>紹介動画: 平澤元気麻雀ch</span><time>動画公開日 2023年3月18日</time><span>約3分で読める</span></div>
        </header>

        <div className="videoArticleEmbed"><iframe src="https://www.youtube-nocookie.com/embed/Q05otKQCgeU" title="麻雀初心者向け牌効率の基礎を徹底解説" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen loading="lazy" /></div>
        <p className="videoSourceNote">動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">元動画をYouTubeで見る</a></p>

        <section className="videoArticleAudience">
                  <div><p className="videoArticleSectionLabel">RECOMMENDED FOR</p><h2>この動画はこんな人に向いています</h2></div>
                  <ul><li>牌効率を何から勉強すればよいか迷っている人</li><li>受け入れを毎回数えるのが難しい人</li><li>序盤とイーシャンテンで同じ切り方をしている人</li><li>完全イーシャンテンやヘッドレスを基礎から知りたい人</li></ul>
                </section>

        <VideoArticleCompactContent
          message={"牌効率は、手牌だけを見て、できるだけ早くテンパイへ近づくための技術です。"}
          points={[
            { title: "手牌の進み具合で見る場所を変える", description: "何を引けばテンパイへ一段近づくかを把握します。" },
            { title: "最初に「あと何手でテンパイか」を見る", description: "一向聴なら、受け入れを引くとテンパイになります。" },
            { title: "序盤は孤立牌の弱い順から整理する", description: "中央の牌ほど、周辺の多くの牌とターツを作れます。" },
          ]}
        />

        <HirasawaTileEfficiencyBook />

        <section className="videoArticleNext">
                  <p className="videoArticleSectionLabel">NEXT STEP</p><h2>総合講座を問題で定着させる</h2>
                  <div><Link href="/videos/strategy/tile-efficiency-four-rules">初心者向け牌効率の4法則を見る</Link><Link href="/analysis/mahjong-tool">牌理チェッカーで受け入れを確認する</Link><Link href="/trainer">何切る問題で練習する</Link></div>
                </section>

</article>
    </main>
  );
}

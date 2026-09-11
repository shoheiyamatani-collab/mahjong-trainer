import type { Metadata } from "next";
import Link from "next/link";
import { VideoArticleCompactContent } from "../VideoArticleCompactContent";

export const metadata: Metadata = {
  title: "麻雀中級者が勘違いしやすい安牌と孤立牌の判断基準",
  description: "麻雀中級者向けに、安牌を持つ基準と孤立牌を残す理由を短い要点で解説。手牌価値と4・6ブロックの違いから実戦判断を整理します。"
};

const videoUrl = "https://www.youtube.com/watch?v=QN7fXjs2PaY";

const tileNames: Record<string, string> = {
  man2: "二萬", man3: "三萬", man4: "四萬", man5: "五萬", man6: "六萬", man7: "七萬", man8: "八萬",
  pin1: "一筒", pin2: "二筒", pin3: "三筒", pin4: "四筒", pin5: "五筒", pin6: "六筒", pin7: "七筒", pin9: "九筒",
  sou2: "二索", sou3: "三索", sou4: "四索", sou5: "五索", sou6: "六索", sou7: "七索",
  ji1: "東", ji2: "南", ji5: "發"
};

function TileRow({ tiles }: { tiles: string[] }) {
  return <div>{tiles.map((tile, index) => <img key={`${tile}-${index}`} src={`/tiles/${tile}-66-90-l-emb.png`} alt={tileNames[tile] ?? tile} />)}</div>;
}

export default function SafeTileAndFloatingTileDecisionsPage() {
  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト"><Link href="/">トップ</Link><span>›</span><Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span><Link href="/videos/strategy/advanced">中級者以上向け</Link><span>›</span><span>安牌と孤立牌の基準</span></nav>
          <p className="siteEyebrow">INTERMEDIATE VIDEO GUIDE / 守備・牌効率</p>
          <h1>中級者が勘違いしやすい、安牌と孤立牌の2つの判断基準</h1>
          <p className="videoArticleLead">「先制できなそうだから安牌を持つ」「形をよくしたいから孤立牌を残す」。どちらも一見正しそうですが、判断に必要な条件が抜けています。手牌全体を見て決める方法を整理します。</p>
          <div className="videoArticleByline"><span>紹介動画: 発男道場【麻雀解説ch】</span><time>動画公開日 2026年8月8日</time><span>約3分で読める</span></div>
        </header>

        <div className="videoArticleEmbed">
          <iframe
            src="https://www.youtube-nocookie.com/embed/QN7fXjs2PaY"
            title="【麻雀解説】あなたは大丈夫？中級者が勘違いしやすい2つの重要項目"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen loading="lazy" />
        </div>
        <p className="videoSourceNote">動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">発男道場【麻雀解説ch】の元動画をYouTubeで見る</a></p>

        <section className="videoArticleAudience">
                  <div><p className="videoArticleSectionLabel">RECOMMENDED FOR</p><h2>この動画はこんな人に向いています</h2></div>
                  <ul>
                    <li>先制できなそうな手では必ず安牌を抱える人</li>
                    <li>安牌を持つとアガリ率が下がる理由を整理したい人</li>
                    <li>孤立牌を何となく残している人</li>
                    <li>ブロック数を実戦の打牌に結びつけたい人</li>
                  </ul>
                </section>

        <VideoArticleCompactContent
          message={"「先制できなそうだから安牌を持つ」「形をよくしたいから孤立牌を残す」。"}
          points={[
            { title: "最初に確認するのは、この2つ", description: "" },
            { title: "安牌は「押し返すため」に持つ", description: "安牌を持つ目的は、相手のリーチに対して必ず降りることではありません。" },
            { title: "孤立牌は「不足しているターツを作るため」に残す", description: "孤立した7索は、6索や8索などを引けば新しいターツ候補になります。" },
          ]}
        />

        <section className="videoArticleNext">
                  <p className="videoArticleSectionLabel">NEXT STEP</p>
                  <h2>手牌全体から価値を比較する</h2>
                  <div>
                    <Link href="/analysis/mahjong-tool">牌理チェッカーで受け入れを確認する</Link>
                    <Link href="/videos/strategy/four-tile-shape-vs-floating-tile">4枚形と孤立牌の比較を読む</Link>
                    <Link href="/videos/strategy/betaori-three-principles">ベタオリの考え方を復習する</Link>
                    <Link href="/videos/strategy/advanced">中級者以上向け動画を見る</Link>
                  </div>
                </section>

</article>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { VideoArticleCompactContent } from "../VideoArticleCompactContent";

export const metadata: Metadata = {
  title: "麻雀の35677は3切り？7切り？複合形の判断を短い要点で解説",
  description: "麻雀中級者向けに、35677から3を切って5677を残す基本と、7を切って3567を残す条件を、頭候補・鳴き・打点・くっつきで整理します。"
};

const videoUrl = "https://www.youtube.com/watch?v=gtyJ5zhvinE";

const tileNames: Record<string, string> = {
  pin3: "三筒",
  pin5: "五筒",
  pin6: "六筒",
  pin7: "七筒"
};

function TileRow({ tiles }: { tiles: string[] }) {
  return (
    <div>
      {tiles.map((tile, index) => (
        <img
          key={`${tile}-${index}`}
          src={`/tiles/${tile}-66-90-l-emb.png`}
          alt={tileNames[tile] ?? tile}
        />
      ))}
    </div>
  );
}

export default function HowToHandle35677Page() {
  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト">
            <Link href="/">トップ</Link><span>›</span>
            <Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span>
            <Link href="/videos/strategy/advanced">中級者以上向け</Link><span>›</span>
            <span>35677の扱い方</span>
          </nav>
          <p className="siteEyebrow">INTERMEDIATE VIDEO GUIDE / 牌効率・複合形</p>
          <h1>複合形35677は3切り？7切り？判断条件を短い要点で整理</h1>
          <p className="videoArticleLead">同じ5枚形でも、頭が必要な手と、すでに頭がある手では残したい形が変わります。3切りを基本にしながら、7切りへ変わる条件と、形をそのまま残す選択まで整理します。</p>
          <div className="videoArticleByline"><span>紹介動画: 発男道場【麻雀解説ch】</span><time>動画公開日 2025年12月13日</time><span>約3分で読める</span></div>
        </header>

        <div className="videoArticleEmbed">
          <iframe
            src="https://www.youtube-nocookie.com/embed/gtyJ5zhvinE"
            title="【麻雀解説】こういう所を曖昧にしたくない！35677の扱い方を徹底解説"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen loading="lazy" />
        </div>
        <p className="videoSourceNote">動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">発男道場【麻雀解説ch】の元動画をYouTubeで見る</a></p>

        <section className="videoArticleAudience">
                  <div><p className="videoArticleSectionLabel">RECOMMENDED FOR</p><h2>この動画はこんな人に向いています</h2></div>
                  <ul>
                    <li>35677のような複合形で手が止まる人</li>
                    <li>受け入れだけでなく頭候補も考えたい人</li>
                    <li>鳴きを含めた手順を身につけたい人</li>
                    <li>基本形と例外条件を分けて覚えたい人</li>
                  </ul>
                </section>

        <VideoArticleCompactContent
          message={"同じ5枚形でも、頭が必要な手と、すでに頭がある手では残したい形が変わります。"}
          points={[
            { title: "出発点は35677の5枚形", description: "以下は動画の判断を理解するための形を抜き出した図です。" },
            { title: "3切りと7切りで、残る役割が違う", description: "七筒の対子を頭候補として固定しながら、567の順子も見られます。" },
            { title: "別に明確な不要牌があれば、35677を崩さない", description: "手牌の中に受け入れがほとんどない不要牌が残っているなら、3筒と7筒を急いで比較する必要はありません。" },
          ]}
        />

        <section className="videoArticleNext">
                  <p className="videoArticleSectionLabel">NEXT STEP</p>
                  <h2>複合形を手牌全体で比べる</h2>
                  <div>
                    <Link href="/analysis/mahjong-tool">牌理チェッカーで受け入れを比較する</Link>
                    <Link href="/videos/strategy/four-tile-shape-vs-floating-tile">4枚形と孤立牌の比較を読む</Link>
                    <Link href="/videos/strategy/intermediate-tile-efficiency-26-rules">中級牌効率の26セオリーを読む</Link>
                    <Link href="/videos/strategy/advanced">中級者以上向け動画を見る</Link>
                  </div>
                </section>

</article>
    </main>
  );
}

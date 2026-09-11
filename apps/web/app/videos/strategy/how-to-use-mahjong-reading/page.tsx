import type { Metadata } from "next";
import Link from "next/link";
import { VideoArticleCompactContent } from "../VideoArticleCompactContent";

export const metadata: Metadata = {
  title: "麻雀の読み方｜捨て牌の違和感と例外から危険度を比べる",
  description: "麻雀中級者向けに、捨て牌読みを待ちの断定ではなく危険度比較へ使う方法を解説。確定情報、手掛かり、推測の違いを短い要点で整理します。"
};

const videoUrl = "https://www.youtube.com/watch?v=7alr7PlSN2M";

const tileNames: Record<string, string> = {
  man1: "一萬", man2: "二萬", man3: "三萬", man4: "四萬", man5: "五萬", man6: "六萬", man7: "七萬",
  pin2: "二筒", pin5: "五筒", pin6: "六筒", pin7: "七筒",
  ji1: "東", ji7: "中"
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

export default function HowToUseMahjongReadingPage() {
  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト">
            <Link href="/">トップ</Link><span>›</span>
            <Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span>
            <Link href="/videos/strategy/advanced">中級者以上向け</Link><span>›</span>
            <span>麻雀の読み方</span>
          </nav>
          <p className="siteEyebrow">INTERMEDIATE VIDEO GUIDE / 読み・情報整理</p>
          <h1>麻雀の読みは「違和感」と「例外」で考える</h1>
          <p className="videoArticleLead">読みは相手の待ちを一発で当てる技術ではありません。見えている情報から普通の手順を想像し、実際の打牌との違いを見つけ、危険度を少しずつ比較するための技術です。</p>
          <div className="videoArticleByline"><span>紹介動画: 発男道場【麻雀解説ch】</span><time>動画公開日 2026年4月4日</time><span>約3分で読める</span></div>
        </header>

        <div className="videoArticleEmbed">
          <iframe
            src="https://www.youtube-nocookie.com/embed/7alr7PlSN2M"
            title="【麻雀解説】誰でも習得可能？読みを使う時のめちゃくちゃ重要な話をします"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen loading="lazy" />
        </div>
        <p className="videoSourceNote">動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">発男道場【麻雀解説ch】の元動画をYouTubeで見る</a></p>

        <section className="videoArticleAudience">
                  <div><p className="videoArticleSectionLabel">RECOMMENDED FOR</p><h2>この動画はこんな人に向いています</h2></div>
                  <ul>
                    <li>相手の捨て牌を見ても何を考えればよいか分からない人</li>
                    <li>スジを安全牌だと思い込んでしまう人</li>
                    <li>読みの例外が多く、使うのを諦めている人</li>
                    <li>放銃後の手牌確認を上達につなげたい人</li>
                  </ul>
                </section>

        <VideoArticleCompactContent
          message={"読みは相手の待ちを一発で当てる技術ではありません。"}
          points={[
            { title: "最初に、情報の強さを3段階に分ける", description: "" },
            { title: "まず「普通ならどう切るか」を想像する", description: "読みの出発点は、相手も基本的な牌効率で手を進めていると仮定することです。" },
            { title: "捨て牌の順番から「なぜ残っていたか」を考える", description: "近い数字の牌が時間差で出たときは、後から切られた牌がそれまで何らかの役割を持っていた可能性があります。" },
          ]}
        />

        <section className="videoArticleNext">
                  <p className="videoArticleSectionLabel">NEXT STEP</p>
                  <h2>待ちの形と守備の基本をつなげる</h2>
                  <div>
                    <Link href="/rules/practical-waits">実戦でよく見る待ち一覧を確認する</Link>
                    <Link href="/videos/strategy/reach-declaration-tile-reading">リーチ宣言牌の読みを復習する</Link>
                    <Link href="/videos/strategy/suji-kabe-defense-basics">スジとカベの基本を読む</Link>
                    <Link href="/videos/strategy/advanced">中級者以上向け動画を見る</Link>
                  </div>
                </section>

</article>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { VideoArticleCompactContent } from "../VideoArticleCompactContent";

export const metadata: Metadata = {
  title: "麻雀はブロック数で打ち方が変わる｜4・5・6ブロックの牌効率",
  description: "麻雀中級者向けに、4・5・6ブロックで打牌方針をどう変えるかを短い要点で解説。ブロックを増やす、維持する、弱い形を減らす判断を整理します。"
};

const videoUrl = "https://www.youtube.com/watch?v=-DqvQsmOdew";

const tileNames: Record<string, string> = {
  man2: "二萬", man3: "三萬", man4: "四萬", man6: "六萬", man7: "七萬", man8: "八萬",
  pin2: "二筒", pin3: "三筒", pin4: "四筒", pin5: "五筒", pin6: "六筒", pin7: "七筒",
  sou2: "二索", sou3: "三索", sou4: "四索", sou5: "五索", sou6: "六索",
  ji7: "中"
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

export default function BlockCountApproachPage() {
  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト">
            <Link href="/">トップ</Link><span>›</span>
            <Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span>
            <Link href="/videos/strategy/advanced">中級者以上向け</Link><span>›</span>
            <span>ブロック別の打ち方</span>
          </nav>
          <p className="siteEyebrow">INTERMEDIATE VIDEO GUIDE / 牌効率・ブロック数</p>
          <h1>麻雀はブロック数で打ち方が変わる｜4・5・6ブロックの考え方</h1>
          <p className="videoArticleLead">ターツの強さだけを比べても、正しい打牌を選べないことがあります。まず手牌が何ブロックあるかを数え、「増やす・維持する・減らす」のどれが必要かを決めましょう。</p>
          <div className="videoArticleByline"><span>紹介動画: 発男道場【麻雀解説ch】</span><time>動画公開日 2026年4月8日</time><span>約3分で読める</span></div>
        </header>

        <div className="videoArticleEmbed">
          <iframe
            src="https://www.youtube-nocookie.com/embed/-DqvQsmOdew"
            title="【麻雀解説】麻雀はブロックの数で打ち方が変わる！ブロック別のアプローチ方法"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen loading="lazy" />
        </div>
        <p className="videoSourceNote">動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">発男道場【麻雀解説ch】の元動画をYouTubeで見る</a></p>

        <section className="videoArticleAudience">
                  <div><p className="videoArticleSectionLabel">RECOMMENDED FOR</p><h2>この動画はこんな人に向いています</h2></div>
                  <ul>
                    <li>ターツの強弱は分かるのに何切るで迷う人</li>
                    <li>5ブロック理論を実戦で使いたい人</li>
                    <li>孤立牌を残す理由を説明できるようになりたい人</li>
                    <li>6ブロックから落とす形を選べない人</li>
                  </ul>
                </section>

        <VideoArticleCompactContent
          message={"ターツの強さだけを比べても、正しい打牌を選べないことがあります。"}
          points={[
            { title: "数えた後の方針は3つだけ", description: "" },
            { title: "4ブロックは、孤立牌から5つ目を作る", description: "完成に必要な5ブロックへ1つ足りない状態です。" },
            { title: "5ブロックは、必要な形を崩さず維持する", description: "アガリに必要なブロック数がそろっています。" },
          ]}
        />

        <section className="videoArticleNext">
                  <p className="videoArticleSectionLabel">NEXT STEP</p>
                  <h2>ブロック数と受け入れを実戦で比べる</h2>
                  <div>
                    <Link href="/analysis/mahjong-tool">牌理チェッカーで受け入れを比較する</Link>
                    <Link href="/videos/strategy/intermediate-tile-efficiency-26-rules">中級牌効率の26セオリーを読む</Link>
                    <Link href="/videos/strategy/safe-tile-and-floating-tile-decisions">安牌と孤立牌の判断基準を読む</Link>
                    <Link href="/videos/strategy/advanced">中級者以上向け動画を見る</Link>
                  </div>
                </section>

</article>
    </main>
  );
}

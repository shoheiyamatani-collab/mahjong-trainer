import type { Metadata } from "next";
import Link from "next/link";
import { VideoArticleCompactContent } from "../VideoArticleCompactContent";

export const metadata: Metadata = {
  title: "麻雀の3トイツはどうさばく？対子を2組へ整理する牌効率",
  description: "麻雀中級者向けに、3トイツ形で崩す対子の選び方を短い要点で解説。5ブロック、6ブロック、鳴ける手、複合形の例外を整理します。"
};

const videoUrl = "https://www.youtube.com/watch?v=pC_TSiQBezw";

const tileNames: Record<string, string> = {
  man1: "一萬", man2: "二萬", man3: "三萬", man4: "四萬", man5: "五萬", man6: "六萬", man7: "七萬",
  pin2: "二筒", pin3: "三筒", pin4: "四筒", pin5: "五筒", pin6: "六筒", pin7: "七筒",
  sou4: "四索", sou5: "五索", sou6: "六索", sou7: "七索", sou8: "八索", sou9: "九索",
  ji5: "發", ji7: "中"
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

export default function ThreePairsShapeEfficiencyPage() {
  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト">
            <Link href="/">トップ</Link><span>›</span>
            <Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span>
            <Link href="/videos/strategy/advanced">中級者以上向け</Link><span>›</span>
            <span>3トイツのさばき方</span>
          </nav>
          <p className="siteEyebrow">INTERMEDIATE VIDEO GUIDE / 牌効率・対子</p>
          <h1>3トイツ形を効率よくさばく方法</h1>
          <p className="videoArticleLead">通常のアガリ形に必要な雀頭は1組です。対子が3組あるときは、ただ弱い対子を壊すのではなく、ブロック数と、1枚を外した後の変化を比べて整理します。</p>
          <div className="videoArticleByline"><span>紹介動画: 発男道場【麻雀解説ch】</span><time>動画公開日 2024年7月24日</time><span>約3分で読める</span></div>
        </header>

        <div className="videoArticleEmbed">
          <iframe
            src="https://www.youtube-nocookie.com/embed/pC_TSiQBezw"
            title="【麻雀解説】3トイツ形をさばく牌効率の重要ポイント"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen loading="lazy" />
        </div>
        <p className="videoSourceNote">動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">発男道場【麻雀解説ch】の元動画をYouTubeで見る</a></p>

        <section className="videoArticleAudience">
                  <div><p className="videoArticleSectionLabel">RECOMMENDED FOR</p><h2>この動画はこんな人に向いています</h2></div>
                  <ul>
                    <li>3トイツになると、どの対子を崩すか迷う人</li>
                    <li>対子をすべて残して手が重くなりやすい人</li>
                    <li>5ブロックと6ブロックの判断を使い分けたい人</li>
                    <li>鳴きを考える手で対子を残す条件を知りたい人</li>
                  </ul>
                </section>

        <VideoArticleCompactContent
          message={"通常のアガリ形に必要な雀頭は1組です。"}
          points={[
            { title: "基本は3トイツを2トイツへ整理する", description: "" },
            { title: "5ブロックでは、崩した後の両面変化を比べる", description: "必要な5ブロックがそろっている手では、対子を1枚外した後も5ブロックを維持しながら、将来の良形変化が多くなる方を選びます。" },
            { title: "6ブロックでは、切ると5ブロックになる対子を選ぶ", description: "6ブロックの手では、最終的に1ブロックが余ります。" },
          ]}
        />

        <section className="videoArticleNext">
                  <p className="videoArticleSectionLabel">NEXT STEP</p>
                  <h2>対子とブロック数を実戦で比較する</h2>
                  <div>
                    <Link href="/analysis/mahjong-tool">牌理チェッカーで受け入れを比較する</Link>
                    <Link href="/videos/strategy/block-count-approach">4・5・6ブロックの考え方を読む</Link>
                    <Link href="/videos/strategy/tile-efficiency-four-rules">牌効率の4法則を復習する</Link>
                    <Link href="/videos/strategy/advanced">中級者以上向け動画を見る</Link>
                  </div>
                </section>

</article>
    </main>
  );
}

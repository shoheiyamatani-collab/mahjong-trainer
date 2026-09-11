import type { Metadata } from "next";
import Link from "next/link";
import { VideoArticleCompactContent } from "../VideoArticleCompactContent";

export const metadata: Metadata = {
  title: "麻雀のリャンカンと亜両面｜両方ある牌姿の選び方",
  description: "麻雀中級者向けに、リャンカンと亜両面が同時にある牌姿を短い要点で解説。受け入れ枚数、良形率、雀頭候補から残す形を比較します。"
};

const videoUrl = "https://www.youtube.com/watch?v=51U41w4pn2E";

const tileNames: Record<string, string> = {
  man1: "一萬", man2: "二萬", man3: "三萬", man4: "四萬", man5: "五萬",
  pin1: "一筒", pin2: "二筒", pin3: "三筒", pin4: "四筒", pin5: "五筒",
  sou2: "二索", sou3: "三索", sou4: "四索", sou5: "五索",
  ji4: "北"
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

export default function RyankanVsAryanmenShapePage() {
  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト">
            <Link href="/">トップ</Link><span>›</span>
            <Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span>
            <Link href="/videos/strategy/advanced">中級者以上向け</Link><span>›</span>
            <span>リャンカンと亜両面</span>
          </nav>
          <p className="siteEyebrow">INTERMEDIATE VIDEO GUIDE / 牌効率・ターツ比較</p>
          <h1>リャンカンと亜両面がある牌姿の選び方</h1>
          <p className="videoArticleLead">亜両面は「両面」という名前から強く見えますが、自分で同じ牌を2枚使っているため、片側の受け入れが4枚から2枚へ減っています。リャンカンと並んだときは、名前ではなく手牌全体の受け入れを比べます。</p>
          <div className="videoArticleByline"><span>紹介動画: 発男道場【麻雀解説ch】</span><time>動画公開日 2026年1月14日</time><span>約3分で読める</span></div>
        </header>

        <div className="videoArticleEmbed">
          <iframe
            src="https://www.youtube-nocookie.com/embed/51U41w4pn2E"
            title="【麻雀解説】この選択…間違ってる人多いです…リャンカンと亜両面がある牌姿"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen loading="lazy" />
        </div>
        <p className="videoSourceNote">動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">発男道場【麻雀解説ch】の元動画をYouTubeで見る</a></p>

        <section className="videoArticleAudience">
                  <div><p className="videoArticleSectionLabel">RECOMMENDED FOR</p><h2>この動画はこんな人に向いています</h2></div>
                  <ul>
                    <li>亜両面なら必ず強いと思っている人</li>
                    <li>リャンカンと亜両面が同時にあると迷う人</li>
                    <li>受け入れ枚数と良形率を分けて考えたい人</li>
                    <li>対子を雀頭として残す条件を整理したい人</li>
                  </ul>
                </section>

        <VideoArticleCompactContent
          message={"亜両面は「両面」という名前から強く見えますが、自分で同じ牌を2枚使っているため、片側の受け入れが4枚から2枚へ減っています。"}
          points={[
            { title: "まず2つの形を見分ける", description: "" },
            { title: "リャンカンはカンチャンが2つ重なった形", description: "135なら2と4のどちらでも順子が完成します。" },
            { title: "亜両面は対子と両面が重なった4枚形", description: "2234は2と5で面子＋雀頭になります。" },
          ]}
        />

        <section className="videoArticleNext">
                  <p className="videoArticleSectionLabel">NEXT STEP</p>
                  <h2>複合形を受け入れ枚数で比べる</h2>
                  <div>
                    <Link href="/analysis/mahjong-tool">牌理チェッカーで受け入れを比較する</Link>
                    <Link href="/rules/practical-waits">実戦でよく見る待ち一覧を確認する</Link>
                    <Link href="/videos/strategy/seven-meld-building-shapes">面子を作りやすい7つの形を読む</Link>
                    <Link href="/videos/strategy/advanced">中級者以上向け動画を見る</Link>
                  </div>
                </section>

</article>
    </main>
  );
}

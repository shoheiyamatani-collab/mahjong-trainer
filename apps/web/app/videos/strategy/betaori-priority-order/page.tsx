import type { Metadata } from "next";
import Link from "next/link";
import { VideoArticleCompactContent } from "../VideoArticleCompactContent";

export const metadata: Metadata = {
  title: "麻雀のベタオリ優先順位｜スジ・ワンチャンス・無スジを比較",
  description: "麻雀中級者向けに、ベタオリで切る牌の優先順位を短い要点で解説。スジ、序盤の外側、ワンチャンス、モロひっかけ、無スジの危険度を整理します。"
};

const videoUrl = "https://www.youtube.com/watch?v=nSVatsm2P84";

const tileNames: Record<string, string> = {
  man1: "一萬", man2: "二萬", man3: "三萬", man4: "四萬", man5: "五萬", man7: "七萬", man8: "八萬",
  pin2: "二筒", pin3: "三筒", pin5: "五筒", pin7: "七筒", pin8: "八筒",
  sou2: "二索", sou3: "三索", sou5: "五索", sou6: "六索", sou7: "七索", sou8: "八索",
  ji1: "東"
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

export default function BetaoriPriorityOrderPage() {
  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト">
            <Link href="/">トップ</Link><span>›</span>
            <Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span>
            <Link href="/videos/strategy/advanced">中級者以上向け</Link><span>›</span>
            <span>ベタオリの優先順位</span>
          </nav>
          <p className="siteEyebrow">INTERMEDIATE VIDEO GUIDE / 守備・ベタオリ</p>
          <h1>ベタオリで切る牌の優先順位を整理する</h1>
          <p className="videoArticleLead">現物がなくなった後は、どの牌も同じように危険ではありません。スジ、序盤の外側、ワンチャンスなどを細かく比較し、より通りやすい牌から選ぶ手順を身につけます。</p>
          <div className="videoArticleByline"><span>紹介動画: 発男道場【麻雀解説ch】</span><time>動画公開日 2026年5月13日</time><span>約3分で読める</span></div>
        </header>

        <div className="videoArticleEmbed">
          <iframe
            src="https://www.youtube-nocookie.com/embed/nSVatsm2P84"
            title="【麻雀解説】知らないと負ける！ベタオリ要素の優先度を徹底解説"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen loading="lazy" />
        </div>
        <p className="videoSourceNote">動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">発男道場【麻雀解説ch】の元動画をYouTubeで見る</a></p>

        <section className="videoArticleAudience">
                  <div><p className="videoArticleSectionLabel">RECOMMENDED FOR</p><h2>この動画はこんな人に向いています</h2></div>
                  <ul>
                    <li>現物がなくなると何を切ればよいか分からない人</li>
                    <li>スジとワンチャンスを同じ安全度だと思っている人</li>
                    <li>同じ牌を複数持つときの切り順に迷う人</li>
                    <li>ベタオリ中の放銃をさらに減らしたい人</li>
                  </ul>
                </section>

        <VideoArticleCompactContent
          message={"現物がなくなった後は、どの牌も同じように危険ではありません。"}
          points={[
            { title: "最初は現物、その次に危険度を比較する", description: "" },
            { title: "動画で扱う危険度の目安", description: "下へ進むほど、リーチ者の両面待ちや愚形待ちへ当たる可能性を慎重に見る候補です。" },
            { title: "迷ったときの大まかな比較順", description: "動画の比較を実戦で使いやすい順に並べると、次のように整理できます。" },
          ]}
        />

        <section className="videoArticleNext">
                  <p className="videoArticleSectionLabel">NEXT STEP</p>
                  <h2>安全度の基本を守備判断へつなげる</h2>
                  <div>
                    <Link href="/videos/strategy/suji-kabe-defense-basics">スジとカベの基本を復習する</Link>
                    <Link href="/videos/strategy/betaori-three-principles">ベタオリの重要な考え方3選を読む</Link>
                    <Link href="/rules/practical-waits">実戦でよく見る待ちを確認する</Link>
                    <Link href="/videos/strategy/advanced">中級者以上向け動画を見る</Link>
                  </div>
                </section>

</article>
    </main>
  );
}

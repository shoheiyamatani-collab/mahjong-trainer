import type { Metadata } from "next";
import Link from "next/link";
import { ClearRainNanikiruBook } from "../../../components/VideoBookRecommendation";
import { VideoArticleCompactContent } from "../VideoArticleCompactContent";

export const metadata: Metadata = {
  title: "麻雀の字牌の捨て順｜攻めと守りで変わる考え方",
  description: "麻雀初心者向けに、役牌・オタ風・場に見えている枚数から字牌の捨て順を考える方法を短い要点で解説します。"
};

const videoUrl = "https://www.youtube.com/watch?v=HVNhilfOmP0";

const tileNames: Record<string, string> = {
  ji1: "東", ji2: "南", ji3: "西", ji4: "北", ji5: "白", ji6: "發", ji7: "中"
};

function TileRow({ tiles }: { tiles: string[] }) {
  return <div>{tiles.map((tile, index) => <img key={`${tile}-${index}`} src={`/tiles/${tile}-66-90-l-emb.png`} alt={tileNames[tile]} />)}</div>;
}

export default function HonorTileDiscardOrderPage() {
  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト"><Link href="/">トップ</Link><span>›</span><Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span><Link href="/videos/strategy/beginner">初心者向け</Link><span>›</span><span>字牌の捨て順</span></nav>
          <p className="siteEyebrow">BEGINNER VIDEO GUIDE / 字牌</p>
          <h1>攻守で変わる字牌の捨て順</h1>
          <p className="videoArticleLead">字牌は順子にならないため、何となく端から切りたくなります。しかし、役になる字牌とオタ風では攻撃面の価値が違い、場に見えている枚数によって守備面の価値も変わります。</p>
          <div className="videoArticleByline"><span>紹介動画: クリアレインのアトリエ【麻雀解説】</span><time>動画公開日 2026年7月4日</time><span>約3分で読める</span></div>
        </header>

        <div className="videoArticleEmbed"><iframe src="https://www.youtube-nocookie.com/embed/HVNhilfOmP0" title="初級者の99%が間違っている字牌の捨て順" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen loading="lazy" /></div>
        <p className="videoSourceNote">動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">元動画をYouTubeで見る</a></p>

        <section className="videoArticleAudience">
                  <div><p className="videoArticleSectionLabel">RECOMMENDED FOR</p><h2>この動画はこんな人に向いています</h2></div>
                  <ul><li>字牌をいつも同じ順番で切っている人</li><li>役牌とオタ風の違いが曖昧な人</li><li>攻めながら安全牌も残したい人</li><li>生牌の字牌をどこまで持つか迷う人</li></ul>
                </section>

        <VideoArticleCompactContent
          message={"字牌は順子にならないため、何となく端から切りたくなります。"}
          points={[
            { title: "最初に「役になる字牌か」を分ける", description: "白・發・中はいつでも役牌です。" },
            { title: "攻める手では、重なったときの価値を見る", description: "役牌が対子になれば、ポンして1役を確保できます。" },
            { title: "守りを考えると、後で切りやすい字牌を残す", description: "特定の相手がすでに捨てた字牌は、その相手には現物です。" },
          ]}
        />

        <ClearRainNanikiruBook />

        <section className="videoArticleNext"><p className="videoArticleSectionLabel">NEXT STEP</p><h2>役牌と手作りを続けて学ぶ</h2><div><Link href="/rules/yakuhai">役牌の条件を詳しく見る</Link><Link href="/videos/strategy/tile-efficiency-four-rules">牌効率の4法則を見る</Link><Link href="/videos/strategy/beginner">初心者向け動画へ戻る</Link></div></section>

</article>
    </main>
  );
}

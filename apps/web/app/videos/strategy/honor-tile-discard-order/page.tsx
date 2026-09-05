import type { Metadata } from "next";
import Link from "next/link";
import { ClearRainNanikiruBook } from "../../../components/VideoBookRecommendation";

export const metadata: Metadata = {
  title: "麻雀の字牌の捨て順｜攻めと守りで変わる考え方",
  description: "麻雀初心者向けに、役牌・オタ風・場に見えている枚数から字牌の捨て順を考える方法を牌図で解説します。"
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
          <div className="videoArticleByline"><span>紹介動画: クリアレインのアトリエ【麻雀解説】</span><time>動画公開日 2026年7月4日</time><span>約8分で読める</span></div>
        </header>

        <div className="videoArticleEmbed"><iframe src="https://www.youtube-nocookie.com/embed/HVNhilfOmP0" title="初級者の99%が間違っている字牌の捨て順" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div>
        <p className="videoSourceNote">動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">元動画をYouTubeで見る</a></p>

        <section className="videoArticleAudience">
          <div><p className="videoArticleSectionLabel">RECOMMENDED FOR</p><h2>この動画はこんな人に向いています</h2></div>
          <ul><li>字牌をいつも同じ順番で切っている人</li><li>役牌とオタ風の違いが曖昧な人</li><li>攻めながら安全牌も残したい人</li><li>生牌の字牌をどこまで持つか迷う人</li></ul>
        </section>

        <section className="videoArticleBodySection terminalChoiceBaseline">
          <p className="videoArticleSectionLabel">FIRST CHECK</p><h2>最初に「役になる字牌か」を分ける</h2>
          <div className="terminalChoiceComparison">
            <div className="isStrong"><span>三元牌</span><TileRow tiles={["ji5", "ji6", "ji7"]} /><b>3枚そろえば常に役</b></div>
            <div className="isStrong"><span>場風・自風</span><TileRow tiles={["ji1", "ji2"]} /><b>局と自分の席で役になる</b></div>
            <div><span>オタ風の例</span><TileRow tiles={["ji3", "ji4"]} /><b>その局では役にならない風牌</b></div>
          </div>
          <p>白・發・中はいつでも役牌です。東南西北は、場風または自風なら役牌、どちらでもなければオタ風です。同じ字牌でも、2枚目を重ねたときの攻撃価値が違います。</p>
          <div className="strategyKeyMessage"><strong>基本:</strong> 手を速く進めたいときは、役にならないオタ風から比較します。ただし、守備を意識する場面では単純にこの順番だけでは決めません。</div>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">ATTACK</p><h2>攻める手では、重なったときの価値を見る</h2>
          <div className="videoArticleTileBlocks">
            <div className="isStrong"><span>役牌が重なる</span><TileRow tiles={["ji7", "ji7"]} /></div>
            <div><span>オタ風が重なる</span><TileRow tiles={["ji4", "ji4"]} /></div>
            <div className="isWeak"><span>すでに2枚見えている</span><TileRow tiles={["ji6", "ji6"]} /></div>
          </div>
          <p>役牌が対子になれば、ポンして1役を確保できます。一方、オタ風の対子は雀頭や守備牌にはなりますが、それだけで役にはなりません。また、同じ牌がすでに場へ2枚見えているなら、残りは1枚しかなく、重なる期待は下がります。</p>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">DEFENSE</p><h2>守りを考えると、後で切りやすい字牌を残す</h2>
          <div className="videoArticleTileBlocks">
            <div className="isStrong"><span>相手がすでに切った字牌</span><TileRow tiles={["ji3"]} /></div>
            <div className="isWeak"><span>場に1枚も見えていない生牌</span><TileRow tiles={["ji7"]} /></div>
            <div><span>場に複数見えている字牌</span><TileRow tiles={["ji4", "ji4"]} /></div>
          </div>
          <p>特定の相手がすでに捨てた字牌は、その相手には現物です。反対に、場へ1枚も出ていない役牌は、誰かが対子で持っている可能性があります。手牌の速度が低いときは、将来切りやすい字牌を残す考え方も必要です。</p>
          <p className="terminalChoiceCaution"><strong>注意:</strong> 「字牌だから安全」ではありません。生牌の役牌はシャンポン・単騎待ちやポンの対象になります。</p>
        </section>

        <section className="videoArticleCaution terminalChoiceChecklist">
          <p className="videoArticleSectionLabel">CHECK ORDER</p><h2>字牌を切る前の確認順</h2>
          <ol><li><b>場風と自風を確認する</b><span>東南西北が役になるかを最初に分けます。</span></li><li><b>手牌の速さと役を見る</b><span>役牌を重ねる価値がある手かを確認します。</span></li><li><b>場に見えている枚数を数える</b><span>重なる枚数と他家が持つ可能性を比べます。</span></li><li><b>攻めるか守るかを決める</b><span>攻撃価値と将来の安全度を同時に比較します。</span></li></ol>
        </section>

        <ClearRainNanikiruBook />

        <section className="videoArticleNext"><p className="videoArticleSectionLabel">NEXT STEP</p><h2>役牌と手作りを続けて学ぶ</h2><div><Link href="/rules/yakuhai">役牌の条件を詳しく見る</Link><Link href="/videos/strategy/tile-efficiency-four-rules">牌効率の4法則を見る</Link><Link href="/videos/strategy/beginner">初心者向け動画へ戻る</Link></div></section>
      </article>
    </main>
  );
}

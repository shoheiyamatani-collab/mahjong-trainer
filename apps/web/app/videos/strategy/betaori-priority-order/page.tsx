import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "麻雀のベタオリ優先順位｜スジ・ワンチャンス・無スジを比較",
  description: "麻雀中級者向けに、ベタオリで切る牌の優先順位を牌図で解説。スジ、序盤の外側、ワンチャンス、モロひっかけ、無スジの危険度を整理します。"
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
          <div className="videoArticleByline"><span>紹介動画: 発男道場【麻雀解説ch】</span><time>動画公開日 2026年5月13日</time><span>約10分で読める</span></div>
        </header>

        <div className="videoArticleEmbed">
          <iframe
            src="https://www.youtube-nocookie.com/embed/nSVatsm2P84"
            title="【麻雀解説】知らないと負ける！ベタオリ要素の優先度を徹底解説"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
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

        <section className="videoArticleBodySection terminalChoiceBaseline">
          <p className="videoArticleSectionLabel">FIRST PRIORITY</p>
          <h2>最初は現物、その次に危険度を比較する</h2>
          <div className="terminalChoiceComparison">
            <div className="isStrong"><span>最優先</span><TileRow tiles={["ji1"]} /><b>リーチ者の現物</b></div>
            <div><span>現物がないとき</span><TileRow tiles={["pin2", "sou2", "man2"]} /><b>安全度の種類を比べる</b></div>
            <div><span>同程度なら</span><TileRow tiles={["man8", "man8"]} /><b>枚数と次巡を考える</b></div>
          </div>
          <div className="strategyKeyMessage"><strong>「同じ牌を何枚持っているか」より、まず今切る1枚の危険度を比べます。</strong>安全度が近い候補同士で初めて、次巡も安全牌が残るかを考えます。</div>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">SAFETY ORDER</p>
          <h2>動画で扱う危険度の目安</h2>
          <p>下へ進むほど、リーチ者の両面待ちや愚形待ちへ当たる可能性を慎重に見る候補です。これは一般的な比較の目安であり、河や見えている牌によって順番は変わります。</p>
          <div className="videoPrincipleList">
            <section className="videoPrinciple">
              <div className="videoPrincipleNumber">1</div>
              <div className="videoPrincipleBody"><span className="videoChapterTime">比較的通りやすい</span><h3>スジの2・8</h3><div className="videoArticleTileBlocks"><div><span>五筒が現物なら</span><TileRow tiles={["pin5"]} /></div><div className="isStrong"><span>スジ候補</span><TileRow tiles={["pin2", "pin8"]} /></div></div><p>両面待ちには当たりにくく、3・7より端に近いため、スジ候補の中でも先に比較します。</p></div>
            </section>
            <section className="videoPrinciple">
              <div className="videoPrincipleNumber">2</div>
              <div className="videoPrincipleBody"><span className="videoChapterTime">次の候補</span><h3>序盤に切られた牌の外側2・8</h3><div className="videoArticleTileBlocks"><div><span>序盤の三索</span><TileRow tiles={["sou3"]} /></div><div className="isStrong"><span>外側の候補</span><TileRow tiles={["sou2"]} /></div></div><p>序盤に3が切られているときの2などです。早い巡目に内側を手放した情報から比較しますが、確定の安全牌ではありません。</p></div>
            </section>
            <section className="videoPrinciple">
              <div className="videoPrincipleNumber">3</div>
              <div className="videoPrincipleBody"><span className="videoChapterTime">数字で差がある</span><h3>スジ・序盤外側の3・7</h3><div className="videoArticleTileBlocks"><div><span>スジの七萬</span><TileRow tiles={["man4", "man7"]} /></div><div><span>序盤の六索より外側</span><TileRow tiles={["sou6", "sou7"]} /></div></div><p>同じスジや外側でも、3・7は2・8より待ちの形が増えやすいため、少し慎重に扱います。</p></div>
            </section>
            <section className="videoPrinciple">
              <div className="videoPrincipleNumber">4</div>
              <div className="videoPrincipleBody"><span className="videoChapterTime">見えている枚数を使う</span><h3>ワンチャンス</h3><div className="videoArticleTileBlocks"><div><span>三萬が3枚見え</span><TileRow tiles={["man3", "man3", "man3"]} /></div><div><span>比較する二萬</span><TileRow tiles={["man2"]} /></div></div><p>両面を作る隣の牌が3枚見えている状態です。残り1枚を相手が持つ可能性があるため、ノーチャンスとは分けて考えます。</p></div>
            </section>
            <section className="videoPrinciple">
              <div className="videoPrincipleNumber">5</div>
              <div className="videoPrincipleBody"><span className="videoChapterTime">スジでも注意</span><h3>モロひっかけ</h3><div className="videoArticleTileBlocks"><div className="isWeak"><span>リーチ宣言牌が五萬</span><TileRow tiles={["man5"]} /></div><div><span>スジの二萬</span><TileRow tiles={["man2"]} /></div></div><p>リーチ宣言牌そのもののスジです。形を固定した結果として待ちが残ることがあり、通常のスジより危険度を上げて比較します。</p></div>
            </section>
            <section className="videoPrinciple">
              <div className="videoPrincipleNumber">6</div>
              <div className="videoPrincipleBody"><span className="videoChapterTime">最後まで慎重に</span><h3>無スジ</h3><div className="videoArticleTileBlocks"><div><span>端の無スジ</span><TileRow tiles={["man1"]} /></div><div className="isWeak"><span>2・8の無スジ</span><TileRow tiles={["pin2", "pin8"]} /></div></div><p>両面待ちを否定する材料がありません。無スジ1・9より無スジ2・8、さらに中央へ近い牌ほど複数の待ちを考える必要があります。</p></div>
            </section>
          </div>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">ROUGH GUIDE</p>
          <h2>迷ったときの大まかな比較順</h2>
          <p>動画の比較を実戦で使いやすい順に並べると、次のように整理できます。</p>
          <div className="strategyKeyMessage"><strong>スジ2・8 → 序盤外側2・8 → スジ3・7 → 序盤外側3・7 → ワンチャンス2・8 → モロひっかけ2・8 → 無スジ1・9 → ワンチャンス3・7 → モロひっかけ3・7 → 無スジ2・8</strong></div>
          <p className="terminalChoiceCaution"><strong>注意:</strong> 絶対的な安全順ではありません。場に見えている枚数、手出し・ツモ切り、リーチ宣言牌、ほかの攻撃者への安全度で前後します。</p>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">ONE CHANCE</p>
          <h2>ワンチャンスとノーチャンスを混同しない</h2>
          <div className="videoArticleTileBlocks">
            <div><span>3枚見えはワンチャンス</span><TileRow tiles={["man3", "man3", "man3"]} /></div>
            <div className="isStrong"><span>4枚見えはノーチャンス</span><TileRow tiles={["man3", "man3", "man3", "man3"]} /></div>
          </div>
          <p>ワンチャンスは残り1枚を相手が使っている可能性があります。ノーチャンスはその牌を使った両面形を作れませんが、単騎・シャンポン・カンチャンなど別の待ちは残ります。</p>
        </section>

        <section className="videoArticleCaution terminalChoiceChecklist">
          <p className="videoArticleSectionLabel">FOLDING ORDER</p>
          <h2>ベタオリ時の確認順</h2>
          <ol>
            <li><b>リーチ者の現物を探す</b><span>現物があれば、推測による安全牌より先に使います。</span></li>
            <li><b>安全度の種類を分ける</b><span>スジ、序盤外側、ワンチャンス、モロひっかけ、無スジを区別します。</span></li>
            <li><b>2・8と3・7を分ける</b><span>同じ種類でも中央へ近い牌は慎重に比較します。</span></li>
            <li><b>同程度なら枚数と次巡を見る</b><span>複数枚ある牌を残せば、次巡以降も同じ候補を使えます。</span></li>
            <li><b>複数の攻撃者に通るか確認する</b><span>一人の現物でも、別の仕掛けやリーチには安全とは限りません。</span></li>
          </ol>
        </section>

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

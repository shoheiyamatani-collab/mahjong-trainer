import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "麻雀の35677は3切り？7切り？複合形の判断を牌図で解説",
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
          <h1>複合形35677は3切り？7切り？判断条件を牌図で整理</h1>
          <p className="videoArticleLead">同じ5枚形でも、頭が必要な手と、すでに頭がある手では残したい形が変わります。3切りを基本にしながら、7切りへ変わる条件と、形をそのまま残す選択まで整理します。</p>
          <div className="videoArticleByline"><span>紹介動画: 発男道場【麻雀解説ch】</span><time>動画公開日 2025年12月13日</time><span>約9分で読める</span></div>
        </header>

        <div className="videoArticleEmbed">
          <iframe
            src="https://www.youtube-nocookie.com/embed/gtyJ5zhvinE"
            title="【麻雀解説】こういう所を曖昧にしたくない！35677の扱い方を徹底解説"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
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

        <section className="videoArticleBodySection terminalChoiceBaseline">
          <p className="videoArticleSectionLabel">BASE SHAPE</p>
          <h2>出発点は35677の5枚形</h2>
          <p>以下は動画の判断を理解するための形を抜き出した図です。実戦では残りの手牌、打点、鳴きやすさによって結論が変わります。</p>
          <div className="terminalChoiceComparison">
            <div className="isStrong"><span>比較する複合形</span><TileRow tiles={["pin3", "pin5", "pin6", "pin7", "pin7"]} /><b>3切りと7切りを比べる</b></div>
          </div>
          <div className="strategyKeyMessage"><strong>基本は3筒を切って5677を残す。</strong>ただし、すでに頭があり鳴きを考えない手では、7筒を切って3567を残す判断もあります。</div>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">COMPARE</p>
          <h2>3切りと7切りで、残る役割が違う</h2>
          <div className="videoPrincipleList">
            <section className="videoPrinciple">
              <div className="videoPrincipleNumber">3</div>
              <div className="videoPrincipleBody">
                <span className="videoChapterTime">基本の選択</span>
                <h3>3筒を切り、5677を残す</h3>
                <div className="videoArticleTileBlocks">
                  <div className="isWeak"><span>切る牌</span><TileRow tiles={["pin3"]} /></div>
                  <div className="isStrong"><span>残る形</span><TileRow tiles={["pin5", "pin6", "pin7", "pin7"]} /></div>
                </div>
                <p>七筒の対子を頭候補として固定しながら、567の順子も見られます。ほかに頭がない手や、ポンを使って進めたい手では、形の役割がはっきりします。</p>
                <div className="strategyActionBox"><b>3切りが有力な条件</b><p>ほかに頭候補がない、鳴いて進めたい、周囲の形から一盃口などの打点変化も残したい場合です。</p></div>
              </div>
            </section>

            <section className="videoPrinciple">
              <div className="videoPrincipleNumber">7</div>
              <div className="videoPrincipleBody">
                <span className="videoChapterTime">条件付きの選択</span>
                <h3>7筒を切り、3567を残す</h3>
                <div className="videoArticleTileBlocks">
                  <div className="isWeak"><span>切る牌</span><TileRow tiles={["pin7"]} /></div>
                  <div className="isStrong"><span>残る形</span><TileRow tiles={["pin3", "pin5", "pin6", "pin7"]} /></div>
                </div>
                <p>対子を1枚外す代わりに、3筒と567の連続性を残します。すでに別の対子があり、打点も足り、鳴きより門前でのくっつき変化を重視するときに候補になります。</p>
                <div className="strategyActionBox"><b>7切りへ変わる条件</b><p>別の頭候補がある、打点が十分にある、鳴きを急がない。この3条件がそろうほど3567を残す価値が上がります。</p></div>
              </div>
            </section>
          </div>
          <p className="terminalChoiceCaution"><strong>注意:</strong> 35677だけを見て毎回同じ牌を切るわけではありません。巡目、ドラ、役、場況でも判断は変わるため、ここでは基本と例外を分けて覚えましょう。</p>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">KEEP THE SHAPE</p>
          <h2>別に明確な不要牌があれば、35677を崩さない</h2>
          <p>手牌の中に受け入れがほとんどない不要牌が残っているなら、3筒と7筒を急いで比較する必要はありません。まず不要牌を切り、頭にも面子にも変化できる35677を丸ごと残します。</p>
          <div className="videoArticleTileBlocks">
            <div className="isStrong"><span>形をそのまま残す</span><TileRow tiles={["pin3", "pin5", "pin6", "pin7", "pin7"]} /></div>
          </div>
          <div className="strategyKeyMessage"><strong>「どちらを切るか」だけでなく、「今は切らない」も選択肢です。</strong>複合形を崩す前に、手牌全体から先に処理できる牌を探します。</div>
        </section>

        <section className="videoArticleCaution terminalChoiceChecklist">
          <p className="videoArticleSectionLabel">CHECK ORDER</p>
          <h2>35677で迷ったときの確認順</h2>
          <ol>
            <li><b>別の明確な不要牌はないか</b><span>あれば35677を残し、先にそちらを切ります。</span></li>
            <li><b>ほかに頭候補はあるか</b><span>なければ七筒の対子を残す3切りが有力です。</span></li>
            <li><b>鳴いて進めたい手か</b><span>ポンやチーを使うなら、頭を確保した5677が扱いやすくなります。</span></li>
            <li><b>打点は十分か</b><span>打点が足り、別の頭もあるなら、くっつきを見る7切りも比較します。</span></li>
          </ol>
        </section>

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

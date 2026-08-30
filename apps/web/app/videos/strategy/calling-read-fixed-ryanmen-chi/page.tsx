import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "麻雀の鳴き読み｜固定した両面チーから待ちを読む",
  description: "麻雀中級者向けに、固定した両面をチーした後の手出しから通りやすい両面を探す方法を牌図で解説。フォロー牌と愚形待ちの注意も紹介します。"
};

const videoUrl = "https://www.youtube.com/watch?v=OYK0xrdF2no";

const tileNames: Record<string, string> = {
  man1: "一萬", man2: "二萬", man3: "三萬", man4: "四萬", man5: "五萬", man6: "六萬", man7: "七萬", man8: "八萬",
  pin4: "四筒", pin5: "五筒", pin6: "六筒", pin7: "七筒", pin8: "八筒", pin9: "九筒",
  sou2: "二索", sou3: "三索", sou4: "四索", sou5: "五索", sou6: "六索", sou7: "七索", sou8: "八索",
  ji5: "白"
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

export default function CallingReadFixedRyanmenChiPage() {
  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト">
            <Link href="/">トップ</Link><span>›</span>
            <Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span>
            <Link href="/videos/strategy/advanced">中級者以上向け</Link><span>›</span>
            <Link href="/videos/strategy/advanced/calling-read">鳴き読み</Link><span>›</span>
            <span>固定した両面チー</span>
          </nav>
          <p className="siteEyebrow">INTERMEDIATE VIDEO GUIDE / 鳴き読み</p>
          <h1>固定した両面チーから読む待ち候補</h1>
          <p className="videoArticleLead">相手が先に両面を固定し、その両面をチーして手から数牌を切ったとき、切り順から両面待ちの候補を絞れる場合があります。ポイントは「何をチーしたか」だけでなく、両面を固定した牌とチー直後の手出しをセットで見ることです。</p>
          <div className="videoArticleByline"><span>紹介動画: 発男道場【麻雀解説ch】</span><time>動画公開日 2025年10月8日</time><span>約11分で読める</span></div>
        </header>

        <div className="videoArticleEmbed">
          <iframe
            src="https://www.youtube-nocookie.com/embed/OYK0xrdF2no"
            title="【麻雀解説】固定両面のチーに要注意！知らなきゃ損する鳴き読みポイント"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <p className="videoSourceNote">動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">発男道場【麻雀解説ch】の元動画をYouTubeで見る</a></p>

        <section className="videoArticleAudience">
          <div><p className="videoArticleSectionLabel">RECOMMENDED FOR</p><h2>この動画はこんな人に向いています</h2></div>
          <ul>
            <li>鳴いた相手の待ち候補を比較したい人</li>
            <li>固定した両面チーの意味を理解したい人</li>
            <li>手出し牌のまたぎ以外をどこまで信用できるか知りたい人</li>
            <li>両面読みと愚形読みを分けて考えたい人</li>
          </ul>
        </section>

        <section className="videoArticleBodySection terminalChoiceBaseline">
          <p className="videoArticleSectionLabel">SCENE</p>
          <h2>先に両面を固定してからチーする</h2>
          <div className="videoArticleTileBlocks">
            <div><span>固定前</span><TileRow tiles={["sou6", "sou7", "sou7"]} /></div>
            <div><span>七索を先に切る</span><TileRow tiles={["sou6", "sou7"]} /></div>
            <div className="isStrong"><span>五索をチー</span><TileRow tiles={["sou5", "sou6", "sou7"]} /></div>
            <div className="isWeak"><span>直後に七筒を手出し</span><TileRow tiles={["pin7"]} /></div>
          </div>
          <p>六七七索から七索を切ると、五・八索を受ける六七索の両面が固定されます。その後に五索をチーして五六七索を作り、手から七筒を切った場面を考えます。両面をいつ固定したかが分かることが、今回の読みの前提です。</p>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">MAIN RULE</p>
          <h2>手出し七筒のまたぎ以外の両面は通りやすくなる</h2>
          <div className="terminalChoiceComparison">
            <div className="isWeak"><span>警戒するまたぎ</span><TileRow tiles={["pin5", "pin8", "pin6", "pin9"]} /><b>五・八筒、六・九筒</b></div>
            <div className="isStrong"><span>比較的通りやすい例</span><TileRow tiles={["man3", "man6"]} /><b>別の色の両面候補</b></div>
          </div>
          <p>別の色に両面があり、それが最終待ちになる手なら、七筒を先に切って完全イーシャンテンへ取る方が自然な場面が多くなります。それなのに七索を先に切って索子の両面を固定したという手順は、七筒と無関係な両面待ちと矛盾しやすくなります。</p>
          <div className="strategyKeyMessage"><strong>覚え方:</strong> 固定した両面をチーし、無関係な数牌が手出しされたら、その手出し牌のまたぎ以外の両面は比較的通りやすい。</div>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">WHY MATAGI REMAINS</p>
          <h2>手出し牌のまたぎ両面は自然に残る</h2>
          <div className="videoArticleTileBlocks">
            <div><span>手出し牌</span><TileRow tiles={["pin7"]} /></div>
            <div className="isWeak"><span>五・八筒待ち</span><TileRow tiles={["pin6", "pin7"]} /></div>
            <div className="isWeak"><span>六・九筒待ち</span><TileRow tiles={["pin7", "pin8"]} /></div>
          </div>
          <p>六七筒または七八筒が残る形では、索子の両面を先に固定しても不自然とは言い切れません。五索をチーした後に余った七筒を切れば、そのまま五・八筒、六・九筒の両面待ちが残ります。そのため、七筒のまたぎは引き続き警戒します。</p>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">CONDITION</p>
          <h2>手出しが鳴いた面子のフォロー牌なら読めない</h2>
          <div className="videoArticleTileBlocks">
            <div><span>鳴いた面子</span><TileRow tiles={["sou5", "sou6", "sou7"]} /></div>
            <div className="isWeak"><span>同じ形のフォロー牌</span><TileRow tiles={["sou6"]} /></div>
            <div><span>無関係な数牌</span><TileRow tiles={["pin7"]} /></div>
          </div>
          <p>チー直後の手出しが六索のように鳴いた五六七索へ関係する牌なら、二度受けや食い伸ばしを整理しただけかもしれません。この場合、別の色の両面が待ちでも手順は不自然にならず、今回の読みは使えません。</p>
          <p>字牌を切った場合も「またぎ両面」という比較ができません。固定した両面チーだけを見ず、直後に何を切ったかまで確認します。</p>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">BAD WAITS</p>
          <h2>両面が薄くても愚形待ちは残る</h2>
          <div className="terminalChoiceComparison">
            <div className="isWeak"><span>カンチャン</span><TileRow tiles={["pin6", "pin8"]} /><b>七筒が当たる形</b></div>
            <div className="isWeak"><span>シャンポン</span><TileRow tiles={["pin5", "pin5"]} /><b>もう一方の対子は別の牌</b></div>
            <div className="isStrong"><span>読みで下げやすい</span><TileRow tiles={["man3", "man4"]} /><b>手順と矛盾する別色の両面</b></div>
          </div>
          <p>この読みで主に下げられるのは両面待ちです。七筒周辺のカンチャンや、五筒・九筒などを含むシャンポンは残ります。また、シャンポンのもう一方が全く別の牌なら、七筒と関係のない牌が当たることもあります。</p>
          <p className="terminalChoiceCaution"><strong>注意:</strong> 「またぎ以外だから安全」ではありません。両面、カンチャン、シャンポン、単騎を分けて危険度を比較します。</p>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">PRACTICAL SHORTCUT</p>
          <h2>早い巡目に切られた中張牌の隣を候補にする</h2>
          <div className="videoArticleTileBlocks">
            <div><span>早く切られた三索</span><TileRow tiles={["sou3"]} /></div>
            <div className="isStrong"><span>隣の中張牌</span><TileRow tiles={["sou2", "sou4"]} /></div>
            <div><span>対象外の端牌</span><TileRow tiles={["man1"]} /></div>
          </div>
          <p>愚形まで読み切るのが難しい場合は、早い巡目に切られた2〜8の牌を探し、その隣にある2〜8の牌を比較候補にします。早い段階でその牌を切っているなら、隣の牌を対子やカンチャンの一部として持っている可能性を下げられるためです。</p>
          <p>一萬のような端牌や、隣の元になった牌が1・9の場合は同じように扱いません。あくまで中張牌同士の関係として使います。</p>
        </section>

        <section className="videoArticleCaution terminalChoiceChecklist">
          <p className="videoArticleSectionLabel">CHECK ORDER</p>
          <h2>固定した両面チーを見たときの確認順</h2>
          <ol>
            <li><b>先に両面が固定されていたかを見る</b><span>切り順から、鳴く前の両面形が確定できるか確認します。</span></li>
            <li><b>チー直後の手出しを確認する</b><span>ツモ切りではなく、手の中から何を切ったかを見ます。</span></li>
            <li><b>鳴いた面子のフォロー牌かを見る</b><span>関係する牌なら今回の法則は使いません。</span></li>
            <li><b>手出し牌のまたぎを警戒する</b><span>またぎ以外の両面候補と危険度を分けます。</span></li>
            <li><b>愚形に当たらないか確認する</b><span>早い巡目の捨て牌も使い、シャンポンとカンチャンを残して考えます。</span></li>
          </ol>
        </section>

        <section className="videoArticleNext">
          <p className="videoArticleSectionLabel">NEXT STEP</p>
          <h2>鳴き読みを続けて学ぶ</h2>
          <div>
            <Link href="/videos/strategy/advanced/calling-read">鳴き読みカテゴリーを見る</Link>
            <Link href="/videos/strategy/calling-read-chi-discard-matagi">チー出しまたぎを読む3条件を見る</Link>
            <Link href="/rules/practical-waits">実戦でよく見る待ち一覧を確認する</Link>
            <Link href="/videos/strategy/advanced">中級者以上向け動画を見る</Link>
          </div>
        </section>
      </article>
    </main>
  );
}

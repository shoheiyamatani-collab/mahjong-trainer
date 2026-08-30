import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "麻雀の鳴き読み｜まず覚えたい2つの重要パターン",
  description: "麻雀中級者向けに、実戦で使いやすい鳴き読み2パターンを牌図で解説。チー出し牌、直前の安全牌、ポンの見送りから両面待ちの可能性を比較します。"
};

const videoUrl = "https://www.youtube.com/watch?v=DrQ_50D4kaY";

const tileNames: Record<string, string> = {
  man2: "二萬", man3: "三萬", man4: "四萬", man5: "五萬", man6: "六萬", man7: "七萬",
  pin1: "一筒", pin2: "二筒", pin3: "三筒", pin4: "四筒", pin5: "五筒", pin6: "六筒", pin7: "七筒", pin8: "八筒",
  sou2: "二索", sou3: "三索", sou4: "四索", sou5: "五索", sou6: "六索", sou7: "七索",
  ji2: "南"
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

export default function CallingReadTwoEssentialPatternsPage() {
  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト">
            <Link href="/">トップ</Link><span>›</span>
            <Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span>
            <Link href="/videos/strategy/advanced">中級者以上向け</Link><span>›</span>
            <Link href="/videos/strategy/advanced/calling-read">鳴き読み</Link><span>›</span>
            <span>重要2パターン</span>
          </nav>
          <p className="siteEyebrow">INTERMEDIATE VIDEO GUIDE / 鳴き読み</p>
          <h1>まず覚えたい鳴き読み2つの重要パターン</h1>
          <p className="videoArticleLead">鳴き読みは、相手の手牌を完全に当てる技術ではありません。「何を鳴き、直後に何を手から切ったか」と、それ以前の捨て牌をつなぎ、待ち候補ごとの危険度を比べる技術です。この動画から、最初に覚えやすい2つの型を整理します。</p>
          <div className="videoArticleByline"><span>紹介動画: 発男道場【麻雀解説ch】</span><time>動画公開日 2026年7月18日</time><span>約12分で読める</span></div>
        </header>

        <div className="videoArticleEmbed">
          <iframe
            src="https://www.youtube-nocookie.com/embed/DrQ_50D4kaY"
            title="【麻雀解説】鳴き読みは最低限これだけ覚えて！実戦で役立つ2つの重要パターン"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <p className="videoSourceNote">動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">発男道場【麻雀解説ch】の元動画をYouTubeで見る</a></p>

        <section className="videoArticleAudience">
          <div><p className="videoArticleSectionLabel">RECOMMENDED FOR</p><h2>この動画はこんな人に向いています</h2></div>
          <ul>
            <li>鳴いた相手へ押す牌を根拠を持って比較したい人</li>
            <li>チー出し牌の周辺をすべて危険だと思っている人</li>
            <li>手出し・ツモ切りと鳴きの順番を読む練習を始めたい人</li>
            <li>読みの例外まで含めて実戦的に学びたい人</li>
          </ul>
        </section>

        <section className="videoArticleBodySection terminalChoiceBaseline">
          <p className="videoArticleSectionLabel">START HERE</p>
          <h2>まず「チー出し」を見落とさない</h2>
          <div className="videoArticleTileBlocks">
            <div className="isStrong"><span>両面からチー</span><TileRow tiles={["man3", "man4", "man5"]} /></div>
            <div className="isWeak"><span>直後に手から切る</span><TileRow tiles={["pin3"]} /></div>
            <div><span>通常警戒するまたぎ</span><TileRow tiles={["pin1", "pin4", "pin2", "pin5"]} /></div>
          </div>
          <p>相手が三四萬から五萬をチーし、直後に三筒を手出ししたとします。一般には、三筒を切って二三筒や三四筒の両面を残した可能性があるため、一・四筒と二・五筒は警戒対象です。</p>
          <div className="strategyKeyMessage"><strong>鳴き読みの入口:</strong> チーした面子、チー直後の手出し、それ以前の捨て牌を1つの流れとして見ます。三筒だけを見て待ちを決めつけないことが大切です。</div>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">PATTERN 1</p>
          <h2>安全牌の後に、鳴きと無関係な数牌を手出しした</h2>
          <div className="videoArticleTileBlocks">
            <div className="isWeak"><span>1. 先に安全牌</span><TileRow tiles={["ji2"]} /></div>
            <div><span>2. 両面チー</span><TileRow tiles={["man3", "man4", "man5"]} /></div>
            <div className="isWeak"><span>3. 無関係な三筒を手出し</span><TileRow tiles={["pin3"]} /></div>
            <div className="isStrong"><span>比較しやすくなる別色の両面</span><TileRow tiles={["sou2", "sou5", "sou3", "sou6"]} /></div>
          </div>
          <p>両面チーの直前に南のような安全牌を手から切り、その後、鳴いた萬子と無関係な三筒を手出しした場面です。もし索子の両面を残すために三筒が不要だったなら、危険な三筒を先に切り、安全な南を手元に残す方が自然です。</p>
          <p>それでも南を先に切って三筒を後まで持ったという切り順は、三筒が直前まで手牌構成に必要だった可能性を示します。そのため、三筒のまたぎ以外にある両面待ちは比較的作りにくいと読めます。</p>
          <p className="terminalChoiceCaution"><strong>3条件:</strong> 両面チーであること、チー出しが鳴いた面子と無関係な数牌であること、直前に安全牌を手出ししていること。この3つをそろえて使います。</p>
          <p>この型をさらに詳しく確認したい場合は、<Link href="/videos/strategy/calling-read-chi-discard-matagi">チー出しまたぎを読む3つの条件</Link>で例外まで掘り下げています。</p>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">PATTERN 2</p>
          <h2>チー出し牌が直前に切られたのにポンしなかった</h2>
          <div className="videoArticleTileBlocks">
            <div><span>1. 直前に他家が切る</span><TileRow tiles={["pin3"]} /></div>
            <div className="isStrong"><span>2. 相手はポンしない</span><TileRow tiles={["pin3", "pin3"]} /></div>
            <div><span>3. 別の牌を両面チー</span><TileRow tiles={["man3", "man4", "man5"]} /></div>
            <div className="isWeak"><span>4. 三筒を手出し</span><TileRow tiles={["pin3"]} /></div>
          </div>
          <p>三筒が直前に切られたとき、相手が三筒を2枚持ち、三筒を使えばテンパイできる形なら、その場でポンする選択がありました。ところが相手はポンせず、その後に別の牌をチーして三筒を手から切っています。</p>
          <p>「使える三筒をポンしなかった」という見逃し情報から、三筒のまたぎである一・四筒、二・五筒の両面待ちは比較的薄くなります。先ほどの型とは反対に、通常は危険なチー出しまたぎを押す根拠になり得る読みです。</p>
          <div className="strategyKeyMessage"><strong>覚え方:</strong> 鳴きが入る直前の1打を見る。同じ牌をポンできたはずなのに見送ったなら、その牌を使う両面テンパイと矛盾しないか考えます。</div>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">LIMITS</p>
          <h2>両面が薄くなっても、愚形には当たり得る</h2>
          <div className="terminalChoiceComparison">
            <div className="isStrong"><span>可能性を下げやすい</span><TileRow tiles={["pin2", "pin3"]} /><b>一・四筒の両面</b></div>
            <div className="isWeak"><span>まだ残る</span><TileRow tiles={["pin2", "pin4"]} /><b>三筒のカンチャン</b></div>
            <div className="isWeak"><span>まだ残る</span><TileRow tiles={["pin3", "pin3"]} /><b>三筒のシャンポン</b></div>
          </div>
          <p>2つの読みで主に下げられるのは、切り順と矛盾する両面待ちです。カンチャンやシャンポンなら、同じ牌が当たり牌になる形が残ります。また、ヘッドレス形や二度受けなど、不要牌を先に切れない例外もあります。</p>
          <p className="terminalChoiceCaution"><strong>重要:</strong> 「通りやすい」は「安全」と同じではありません。相手の打点、自分の手牌価値、現物の有無を確認し、最後は押し引きとして判断します。</p>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">TIMING</p>
          <h2>読みが効くのは、その鳴きの直後</h2>
          <div className="videoArticleTileBlocks">
            <div className="isStrong"><span>情報が新しい</span><TileRow tiles={["man3", "man4", "man5", "pin3"]} /></div>
            <div className="isWeak"><span>その後に手出しが続く</span><TileRow tiles={["sou4", "pin7", "man6"]} /></div>
          </div>
          <p>どちらの型も、鳴いた直後の手牌を推測しています。その後に相手の手出しが増えるほど、ツモで形が変わり、当初の読みの精度は落ちます。数巡後まで同じ安全度だと思わず、新しい手出しが入るたびに判断を更新します。</p>
        </section>

        <section className="videoArticleCaution terminalChoiceChecklist">
          <p className="videoArticleSectionLabel">CHECK ORDER</p>
          <h2>実戦ではこの順番で確認する</h2>
          <ol>
            <li><b>何をどこから鳴いたかを見る</b><span>両面チーか、カンチャン・ペンチャンのチーかを分けます。</span></li>
            <li><b>鳴いた直後の手出しを覚える</b><span>ツモ切りではなく、手の中から切った牌を確認します。</span></li>
            <li><b>1つ前の手出しを見る</b><span>安全牌を先に切っていたか、同じ牌が直前に場へ出たかを探します。</span></li>
            <li><b>両面待ちだけを比較する</b><span>手順と矛盾する両面の可能性を下げます。</span></li>
            <li><b>愚形と例外を戻して考える</b><span>カンチャン、シャンポン、ヘッドレス形を残し、安全と断定しません。</span></li>
          </ol>
        </section>

        <section className="videoArticleNext">
          <p className="videoArticleSectionLabel">NEXT STEP</p>
          <h2>鳴き読みを続けて学ぶ</h2>
          <div>
            <Link href="/videos/strategy/advanced/calling-read">鳴き読みカテゴリーを見る</Link>
            <Link href="/videos/strategy/calling-read-chi-discard-matagi">チー出しまたぎの3条件を詳しく見る</Link>
            <Link href="/videos/strategy/calling-read-fixed-ryanmen-chi">固定した両面チーから待ちを読む</Link>
            <Link href="/rules/practical-waits">実戦でよく見る待ち一覧を確認する</Link>
          </div>
        </section>
      </article>
    </main>
  );
}

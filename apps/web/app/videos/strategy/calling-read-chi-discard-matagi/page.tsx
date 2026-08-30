import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "麻雀の鳴き読み｜チー出しまたぎが通りやすい3条件",
  description: "麻雀中級者向けに、チー直後の手出し牌をまたぐ両面待ちが比較的通りやすくなる3条件を牌図で解説。読みの限界と愚形への注意も紹介します。"
};

const videoUrl = "https://www.youtube.com/watch?v=3CY4e9PVNy0";

const tileNames: Record<string, string> = {
  man1: "一萬", man2: "二萬", man3: "三萬", man4: "四萬", man5: "五萬", man6: "六萬", man7: "七萬",
  pin4: "四筒", pin5: "五筒", pin6: "六筒", pin7: "七筒", pin8: "八筒", pin9: "九筒",
  sou2: "二索", sou3: "三索", sou4: "四索", sou5: "五索", sou6: "六索", sou7: "七索", sou8: "八索",
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

export default function CallingReadChiDiscardMatagiPage() {
  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト">
            <Link href="/">トップ</Link><span>›</span>
            <Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span>
            <Link href="/videos/strategy/advanced">中級者以上向け</Link><span>›</span>
            <Link href="/videos/strategy/advanced/calling-read">鳴き読み</Link><span>›</span>
            <span>チー出しまたぎ</span>
          </nav>
          <p className="siteEyebrow">INTERMEDIATE VIDEO GUIDE / 鳴き読み</p>
          <h1>チー出しまたぎを読む3つの条件</h1>
          <p className="videoArticleLead">相手がチーした直後、手の中から切った牌をまたぐスジは、一般に両面待ちの候補になります。ただし、それまでの捨て牌や鳴いた形と矛盾する場合は、両面待ちの可能性を少し下げられます。</p>
          <div className="videoArticleByline"><span>紹介動画: 発男道場【麻雀解説ch】</span><time>動画公開日 2025年3月15日</time><span>約11分で読める</span></div>
        </header>

        <div className="videoArticleEmbed">
          <iframe
            src="https://www.youtube-nocookie.com/embed/3CY4e9PVNy0"
            title="【麻雀解説】上級者だけが知ってる！チー出しまたぎが通りやすいケース3選（鳴き読み）"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <p className="videoSourceNote">動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">発男道場【麻雀解説ch】の元動画をYouTubeで見る</a></p>

        <section className="videoArticleAudience">
          <div><p className="videoArticleSectionLabel">RECOMMENDED FOR</p><h2>この動画はこんな人に向いています</h2></div>
          <ul>
            <li>副露した相手へ押す牌を比較したい人</li>
            <li>チー直後の手出しがなぜ危険か理解したい人</li>
            <li>捨て牌と鳴きの順番を読む練習を始めたい人</li>
            <li>読みを断定ではなく危険度比較に使いたい人</li>
          </ul>
        </section>

        <section className="videoArticleBodySection terminalChoiceBaseline">
          <p className="videoArticleSectionLabel">BASIC</p>
          <h2>チー出しまたぎとは</h2>
          <div className="videoArticleTileBlocks">
            <div className="isStrong"><span>チーした面子</span><TileRow tiles={["sou2", "sou3", "sou4"]} /></div>
            <div className="isWeak"><span>直後の手出し</span><TileRow tiles={["man4"]} /></div>
            <div><span>またぎの候補</span><TileRow tiles={["man2", "man5", "man3", "man6"]} /></div>
          </div>
          <p>四萬を手から切った直後なら、元の手に三四四萬または四四五萬があり、1枚の四萬を切って三四萬・四五萬の両面を残した可能性があります。そのため二・五萬、三・六萬は両面待ちの候補になります。</p>
          <div className="strategyKeyMessage"><strong>基本は「チー出しまたぎを無条件で安全とは見ない」です。</strong>ここから紹介する条件は、両面待ちの可能性を下げる材料であり、完全な安全牌に変える情報ではありません。</div>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">CASE 1</p>
          <h2>手出し牌が直前にも切られていた</h2>
          <div className="videoArticleTileBlocks">
            <div><span>直前に出た牌</span><TileRow tiles={["man4"]} /></div>
            <div><span>ポンできる形</span><TileRow tiles={["man4", "man4"]} /></div>
            <div className="isStrong"><span>見送った情報</span><TileRow tiles={["man2", "man5", "man3", "man6"]} /></div>
          </div>
          <p>相手が四萬を2枚持ち、四萬を使うことでテンパイできる形なら、直前に四萬が切られた時点でポンする選択がありました。それを見送った後にチーして四萬を手出ししたなら、四萬周辺の両面待ちはやや作りにくいと考えられます。</p>
          <p className="terminalChoiceCaution"><strong>残る危険:</strong> 二・五萬や三・六萬の両面が薄くなっても、シャンポン・カンチャンなどの愚形には当たり得ます。</p>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">CASE 2</p>
          <h2>鳴いた両面より、手出し側の両面を固定する方が自然だった</h2>
          <div className="videoArticleTileBlocks">
            <div><span>先に固定した両面</span><TileRow tiles={["sou4", "sou5"]} /></div>
            <div><span>チーした面子</span><TileRow tiles={["sou4", "sou5", "sou6"]} /></div>
            <div className="isStrong"><span>ドラを含む候補</span><TileRow tiles={["pin7", "pin8"]} /></div>
          </div>
          <p>相手が先に弱い両面を固定し、その両面をチーした後で、ドラを含む強い両面候補のそばを手出ししたとします。通常ならドラを使える強い両面を先に固定しやすいため、実際の手順との矛盾が、手出しまたぎの両面を否定する材料になります。</p>
          <p>同じ考え方は、鳴いた両面の有効牌が場に多く見え、手出し側の有効牌が十分残っている場合にも使えます。「どちらの両面を先に固定するのが自然か」を比較します。</p>
          <p className="terminalChoiceCaution"><strong>例外:</strong> 赤牌を使える形、点数状況、速度優先などにより、弱く見える両面を先に固定する手順もあります。</p>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">CASE 3</p>
          <h2>安全牌を先に切り、手出し牌がすでに2枚見えていた</h2>
          <div className="videoArticleTileBlocks">
            <div className="isWeak"><span>先に切った安全牌</span><TileRow tiles={["ji2"]} /></div>
            <div><span>後から手出し</span><TileRow tiles={["sou6", "sou6"]} /></div>
            <div className="isStrong"><span>またぎの候補</span><TileRow tiles={["sou4", "sou7", "sou5", "sou8"]} /></div>
          </div>
          <p>後から切られた六索がすでに場へ2枚見えていたなら、形として残す価値は下がっています。中盤なら、六索を先に切って安全牌の南を残す手順が自然です。それでも南を先に切ったなら、六索は両面の一部ではなかった可能性が上がります。</p>
          <p>この読みは1つ目・2つ目より根拠が弱く、相手の打ち筋や巡目に左右されます。ドラ対子のフォローや食い伸ばしを見て六索を残した可能性もあります。</p>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">LIMITS</p>
          <h2>読めるのは「両面の可能性が下がる」まで</h2>
          <div className="terminalChoiceComparison">
            <div className="isStrong"><span>比較的否定しやすい</span><TileRow tiles={["man3", "man4"]} /><b>手順と矛盾する両面</b></div>
            <div className="isWeak"><span>まだ残る</span><TileRow tiles={["man4", "man4"]} /><b>シャンポン待ち</b></div>
            <div className="isWeak"><span>まだ残る</span><TileRow tiles={["man3", "man5"]} /><b>カンチャン待ち</b></div>
          </div>
          <p>鳴き読みは待ちを当てる技術ではありません。相手が標準的な手順で打っているという前提から、候補同士の危険度を比べる技術です。現物があるなら現物を優先し、押し引き判断・打点・残り筋と合わせて使います。</p>
        </section>

        <section className="videoArticleCaution terminalChoiceChecklist">
          <p className="videoArticleSectionLabel">CHECK ORDER</p>
          <h2>チー出しを見たときの確認順</h2>
          <ol>
            <li><b>何を、どこからチーしたかを見る</b><span>鳴いた面子と手出し牌を分けて記憶します。</span></li>
            <li><b>手出し牌のまたぎスジを確認する</b><span>まず両面待ちの候補として警戒します。</span></li>
            <li><b>直前に同じ牌が切られていないか見る</b><span>ポンを見送った情報があれば、両面の可能性を下げます。</span></li>
            <li><b>固定した両面との強さを比べる</b><span>ドラ、赤牌、場に見えている枚数から手順の矛盾を探します。</span></li>
            <li><b>愚形と例外を残す</b><span>安全と断定せず、シャンポン・カンチャンや相手の打ち筋を考慮します。</span></li>
          </ol>
        </section>

        <section className="videoArticleNext">
          <p className="videoArticleSectionLabel">NEXT STEP</p>
          <h2>待ちと読みを組み合わせる</h2>
          <div>
            <Link href="/videos/strategy/advanced/calling-read">鳴き読みカテゴリーを見る</Link>
            <Link href="/rules/practical-waits">実戦でよく見る待ち一覧を確認する</Link>
            <Link href="/videos/strategy/how-to-use-mahjong-reading">麻雀の読み方を復習する</Link>
            <Link href="/videos/strategy/advanced">中級者以上向け動画を見る</Link>
          </div>
        </section>
      </article>
    </main>
  );
}

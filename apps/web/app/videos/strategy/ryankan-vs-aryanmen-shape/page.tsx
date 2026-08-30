import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "麻雀のリャンカンと亜両面｜両方ある牌姿の選び方",
  description: "麻雀中級者向けに、リャンカンと亜両面が同時にある牌姿を牌図で解説。受け入れ枚数、良形率、雀頭候補から残す形を比較します。"
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
          <div className="videoArticleByline"><span>紹介動画: 発男道場【麻雀解説ch】</span><time>動画公開日 2026年1月14日</time><span>約9分で読める</span></div>
        </header>

        <div className="videoArticleEmbed">
          <iframe
            src="https://www.youtube-nocookie.com/embed/51U41w4pn2E"
            title="【麻雀解説】この選択…間違ってる人多いです…リャンカンと亜両面がある牌姿"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
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

        <section className="videoArticleBodySection terminalChoiceBaseline">
          <p className="videoArticleSectionLabel">SHAPE BASICS</p>
          <h2>まず2つの形を見分ける</h2>
          <div className="terminalChoiceComparison">
            <div className="isStrong"><span>リャンカン</span><TileRow tiles={["man1", "man3", "man5"]} /><b>二萬・四萬の2種類待ち</b></div>
            <div><span>亜両面</span><TileRow tiles={["pin2", "pin2", "pin3", "pin4"]} /><b>二筒・五筒の2種類6枚</b></div>
          </div>
          <div className="strategyKeyMessage"><strong>どちらも2種類を受けますが、残り枚数は同じではありません。</strong>リャンカンは通常8枚、亜両面は対子側が2枚、反対側が4枚で通常6枚です。</div>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">RYANKAN</p>
          <h2>リャンカンはカンチャンが2つ重なった形</h2>
          <div className="videoArticleTileBlocks">
            <div><span>元の形</span><TileRow tiles={["man1", "man3", "man5"]} /></div>
            <div className="isStrong"><span>二萬を引く</span><TileRow tiles={["man1", "man2", "man3"]} /></div>
            <div className="isStrong"><span>四萬を引く</span><TileRow tiles={["man3", "man4", "man5"]} /></div>
          </div>
          <p>135なら2と4のどちらでも順子が完成します。2種類が各4枚残っていれば合計8枚です。片方が入った後、もう片側の牌を整理して手を進められます。</p>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">ARYANMEN</p>
          <h2>亜両面は対子と両面が重なった4枚形</h2>
          <div className="videoArticleTileBlocks">
            <div><span>元の形</span><TileRow tiles={["pin2", "pin2", "pin3", "pin4"]} /></div>
            <div><span>二筒で雀頭＋順子</span><TileRow tiles={["pin2", "pin2", "pin2", "pin3", "pin4"]} /></div>
            <div className="isStrong"><span>五筒で雀頭＋順子</span><TileRow tiles={["pin2", "pin2", "pin3", "pin4", "pin5"]} /></div>
          </div>
          <p>2234は2と5で面子＋雀頭になります。ただし二筒をすでに2枚使っているため、二筒は残り2枚です。待ちとして数える場合は二筒2枚と五筒4枚の合計6枚になります。</p>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">CORRECT COUNT</p>
          <h2>亜両面の残り枚数を正しく数える</h2>
          <p>亜両面の形は用途によって数え方が変わります。2234を「雀頭＋1面子に完成させる5枚形」として見るなら、二筒は残り2枚、五筒は4枚で最大6枚です。すでに場へ見えている牌があれば、そこからさらに減ります。</p>
          <div className="strategyKeyMessage"><strong>大事なのは名前ではなく、実際に残っている枚数です。</strong>手牌内で使っている枚数と、河・副露・ドラ表示牌に見えている枚数を引いて数えます。</div>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">WHEN BOTH EXIST</p>
          <h2>両方あるときは、まずリャンカンを残して比較する</h2>
          <div className="videoArticleTileBlocks">
            <div className="isStrong"><span>残したいリャンカン</span><TileRow tiles={["man1", "man3", "man5"]} /></div>
            <div className="isWeak"><span>整理候補の亜両面</span><TileRow tiles={["pin2", "pin2", "pin3", "pin4"]} /></div>
            <div><span>別の雀頭候補</span><TileRow tiles={["ji4", "ji4"]} /></div>
          </div>
          <p>動画の複数の実戦例では、亜両面側を整理してリャンカンを残す選択が優勢です。リャンカンは受け入れが広く、その後に良形テンパイへ進む割合も高くなりやすいためです。</p>
          <div className="strategyActionBox"><b>基本の見方</b><p>別の雀頭候補があり、役やドラの差もなければ、亜両面を過大評価せずリャンカンを残すところから比較します。</p></div>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">EXCEPTIONS</p>
          <h2>亜両面を残す条件もある</h2>
          <div className="videoPrincipleList">
            <section className="videoPrinciple">
              <div className="videoPrincipleNumber">1</div>
              <div className="videoPrincipleBody"><h3>ほかに雀頭候補がない</h3><p>亜両面内の対子を頭として使う必要が高いときは、単純な受け入れ枚数だけで崩しません。</p></div>
            </section>
            <section className="videoPrinciple">
              <div className="videoPrincipleNumber">2</div>
              <div className="videoPrincipleBody"><h3>役やドラを残せる</h3><p>三色、一盃口、ドラなどの打点差があれば、亜両面側を残す価値が上がります。</p></div>
            </section>
            <section className="videoPrinciple">
              <div className="videoPrincipleNumber">3</div>
              <div className="videoPrincipleBody"><h3>リャンカンの有効牌が薄い</h3><p>2と4が多く見えているなら、見た目の8枚受けは残っていません。実際の残り枚数を比べ直します。</p></div>
            </section>
          </div>
          <p className="terminalChoiceCaution"><strong>注意:</strong> 「リャンカンは常に亜両面より強い」という意味ではありません。動画の基本比較を出発点に、雀頭、打点、場況で結論を調整します。</p>
        </section>

        <section className="videoArticleCaution terminalChoiceChecklist">
          <p className="videoArticleSectionLabel">CHECK ORDER</p>
          <h2>両方ある牌姿での確認順</h2>
          <ol>
            <li><b>リャンカンと亜両面を正しく分ける</b><span>135はリャンカン、2234は対子を含む亜両面です。</span></li>
            <li><b>実際の残り枚数を数える</b><span>自分の手牌と場に見えている牌を4枚から引きます。</span></li>
            <li><b>ほかに雀頭候補があるか確認する</b><span>頭がなければ亜両面の対子価値が上がります。</span></li>
            <li><b>テンパイ時の待ちを比べる</b><span>受け入れだけでなく、良形テンパイになる割合も見ます。</span></li>
            <li><b>役・ドラ・鳴きで差がないか確認する</b><span>打点や速度が変わるなら、牌効率だけで決めません。</span></li>
          </ol>
        </section>

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

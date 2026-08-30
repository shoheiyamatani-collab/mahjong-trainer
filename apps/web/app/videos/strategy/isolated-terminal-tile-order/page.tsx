import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "麻雀の孤立牌1・9はどちらから切る？優先順位を動画で解説",
  description: "孤立した1・9牌の切り順を4段階で解説。1・4・7の受け入れの重複、1・5からのリャンカン変化、牌効率の知識が守備にも役立つ理由を牌図付きで紹介します。"
};

const videoUrl = "https://www.youtube.com/watch?v=vESIZaYYJL4";

type PriorityBlock = {
  label: string;
  tiles: string[];
  weak?: boolean;
  strong?: boolean;
};

type Priority = {
  number: number;
  time: string;
  title: string;
  description: string;
  href: string;
  blocks: PriorityBlock[];
};

const priorities: Priority[] = [
  {
    number: 1,
    time: "04:46",
    title: "最初に整理する候補は1・4・7、または3・6・9",
    description: "1と4と7を持っていると、1が作れる形の多くを4や7でも受けられます。受け入れが重なっているため、孤立した1の価値は低くなります。反対側では3・6・9の9も同じ考え方です。",
    href: `${videoUrl}&t=286s`,
    blocks: [
      { label: "1・4・7", tiles: ["man1", "man4", "man7"], weak: true },
      { label: "3・6・9", tiles: ["pin3", "pin6", "pin9"], weak: true }
    ]
  },
  {
    number: 2,
    time: "01:21",
    title: "次は1・4、または6・9の端牌",
    description: "1と4を持っているとき、3を引く変化は4でも活用できます。1だけを残す意味が薄くなるため、ほかに純粋な孤立牌があれば、こちらの端牌から整理しやすくなります。",
    href: `${videoUrl}&t=81s`,
    blocks: [
      { label: "1・4", tiles: ["sou1", "sou4"], weak: true },
      { label: "6・9", tiles: ["man6", "man9"], weak: true }
    ]
  },
  {
    number: 3,
    time: "03:52",
    title: "周囲に5がない、純粋な孤立1・9",
    description: "近くに使える牌がなく、5もない1・9は変化が限られます。ただし、受け入れが完全に重複している1・4・7の端牌よりは、独立した変化を持っています。",
    href: `${videoUrl}&t=232s`,
    blocks: [
      { label: "孤立した1", tiles: ["pin1"] },
      { label: "孤立した9", tiles: ["sou9"] }
    ]
  },
  {
    number: 4,
    time: "02:59",
    title: "最後まで残したいのは5と組み合わさる1・9",
    description: "1と5を持っていると、3を引いて1・3・5のリャンカンへ変化します。5と9なら7を引く形です。一見離れていても、間の牌を引いたときに強い受け入れが生まれます。",
    href: `${videoUrl}&t=179s`,
    blocks: [
      { label: "1・5", tiles: ["man1", "man5"], strong: true },
      { label: "3を引く", tiles: ["man1", "man3", "man5"], strong: true },
      { label: "5・9", tiles: ["pin5", "pin9"], strong: true }
    ]
  }
];

const tileNames: Record<string, string> = {
  man1: "一萬", man3: "三萬", man4: "四萬", man5: "五萬", man6: "六萬", man7: "七萬", man9: "九萬",
  pin1: "一筒", pin3: "三筒", pin5: "五筒", pin6: "六筒", pin9: "九筒",
  sou1: "一索", sou4: "四索", sou9: "九索"
};

export default function IsolatedTerminalTileOrderArticlePage() {
  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト"><Link href="/">トップ</Link><span>›</span><Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span><span>孤立牌の切り順</span></nav>
          <p className="siteEyebrow">VIDEO GUIDE / 牌効率・孤立牌</p>
          <h1>1・9、なんとなく切っていませんか？</h1>
          <p className="videoArticleLead">孤立した端牌はどれも弱そうに見えますが、手牌にある4・5・6などとの関係で価値が変わります。1・9牌を切る優先順位と、その知識が守備にもつながる理由を解説します。</p>
          <div className="videoArticleByline"><span>紹介動画: 発男道場【麻雀解説ch】</span><time>動画公開日 2024年2月7日</time><span>約7分で読める</span></div>
        </header>

        <div className="videoArticleEmbed">
          <iframe
            src="https://www.youtube-nocookie.com/embed/vESIZaYYJL4"
            title="【麻雀解説】意外と大事！孤立牌の切り順（初心者向け）"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <p className="videoSourceNote">動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">発男道場【麻雀解説ch】の元動画をYouTubeで見る</a></p>

        <section className="videoArticleAudience">
          <div>
            <p className="videoArticleSectionLabel">RECOMMENDED FOR</p>
            <h2>この動画はこんな人に向いています</h2>
          </div>
          <ul>
            <li>手牌に1や9があったら、深く考えずに切っている人</li>
            <li>孤立牌が複数あるとき、どれから切るか迷う人</li>
            <li>受け入れが「被る」とはどういうことか知りたい人</li>
            <li>牌効率を覚え、次に押し引きや守備へ進みたい人</li>
          </ul>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">OVERVIEW</p>
          <h2>同じ1・9でも、周囲の牌で価値が変わる</h2>
          <p>孤立牌とは、手牌の中で周囲につながる牌がなく、ひとまず単独に見える牌です。1や9は順子に使える範囲が狭いため切られやすい牌ですが、すべてを同じ価値として扱うと、将来の良い変化まで逃してしまいます。</p>
          <p>比べるポイントは、ほかの牌と受け入れが重複しているか、間の牌を引いたときに強い形へ変化するかです。動画では、不要なものから残したいものまでを4段階で整理しています。</p>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">DISCARD PRIORITY</p>
          <h2>孤立した1・9を切る優先順位</h2>
          <p className="videoDiagramNote">上から順に「先に切りやすい形」です。牌図は関係する牌だけを示した簡略例で、実戦では役・ドラ・巡目も合わせて判断します。</p>
          <div className="videoPrincipleList">
            {priorities.map((priority) => (
              <section key={priority.number} className="videoPrinciple">
                <div className="videoPrincipleNumber">{priority.number}</div>
                <div className="videoPrincipleBody">
                  <span className="videoChapterTime">{priority.time} から</span>
                  <h3>{priority.title}</h3>
                  <p>{priority.description}</p>
                  <div className="videoArticleTileBlocks">
                    {priority.blocks.map((block, index) => (
                      <div className={block.weak ? "isWeak" : block.strong ? "isStrong" : ""} key={`${priority.number}-${index}`}>
                        <span>{block.label}</span>
                        <div>{block.tiles.map((tile, tileIndex) => <img key={`${tile}-${tileIndex}`} src={`/tiles/${tile}-66-90-l-emb.png`} alt={tileNames[tile] ?? tile} />)}</div>
                      </div>
                    ))}
                  </div>
                  <a href={priority.href} target="_blank" rel="noopener noreferrer">この形を動画の該当箇所から見る</a>
                </div>
              </section>
            ))}
          </div>
        </section>

        <section className="videoArticleBodySection videoDefenseBridge">
          <p className="videoArticleSectionLabel">FROM EFFICIENCY TO DEFENSE</p>
          <h2>この法則は、後で守備を学ぶときにも役立つ</h2>
          <div className="videoPracticeSteps">
            <div><b>攻撃価値</b><h3>手放す損を比べられる</h3><p>どの端牌が手作りに必要か分かると、守備牌を残すために何を整理できるか判断しやすくなります。</p></div>
            <div><b>押し引き</b><h3>速度と安全を比べられる</h3><p>手を進める価値が低い牌なら、将来の安全度を意識した持ち方へ切り替える余地が見えます。</p></div>
            <div><b>捨て牌読み</b><h3>切った理由を考えられる</h3><p>受け入れの重複を知ると、相手が序盤に端牌を切る理由を形のつながりから考える土台になります。</p></div>
          </div>
          <p>守備では「その牌が安全か」と「残すことで自分の手がどれだけ遅くなるか」を比べます。孤立牌の優劣を知っていると、牌効率をほとんど落とさずに安全牌候補を持てる場面と、大きく受け入れを失う場面を区別しやすくなります。</p>
        </section>

        <section className="videoArticleCaution">
          <p className="videoArticleSectionLabel">IMPORTANT</p>
          <h2>1・9だから安全、とは限りません</h2>
          <p>端牌は中張牌より当たりにくい場面もありますが、相手の捨て牌や場に見えている枚数を確認せず、安全牌と決めつけることはできません。また、相手の早い1切りだけで待ちを断定することもできません。</p>
          <p>まずは自分の手牌で孤立牌の価値を正しく比べ、その後に現物、スジ、壁などの守備知識を重ねていきましょう。</p>
        </section>

        <section className="videoArticleNext">
          <p className="videoArticleSectionLabel">NEXT STEP</p>
          <h2>動画を見たあとに試してみる</h2>
          <div>
            <Link href="/videos/strategy/tile-efficiency-four-rules">牌効率の4法則を復習する</Link>
            <Link href="/videos/strategy/tile-efficiency-essential-theory-quiz">全16問の何切る動画で優先順位を試す</Link>
            <Link href="/videos/strategy/suji-kabe-defense-basics">次にスジとカベで守備を学ぶ</Link>
            <Link href="/analysis/mahjong-tool">受け入れ枚数チェッカーで一打を比較する</Link>
          </div>
        </section>
      </article>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "麻雀初心者が覚えたい牌効率の4法則 | 動画の見どころを解説",
  description: "発男道場の初心者向け牌効率動画を紹介。対子候補をいくつ残すか、6ブロックをどう5ブロックへ整理するかを、向いている人と注意点も含めて解説します。"
};

const videoUrl = "https://www.youtube.com/watch?v=q3LPfokscno";

const principles = [
  {
    number: 1,
    title: "対子候補が3組なら、2組へ整理する",
    description: "対子が3組ある形は、すべてを抱えるより1組をほぐした方が、順子や両面へ変化する余地を作りやすくなります。どの対子を崩すかは、周囲の牌とのつながりまで見て選びます。",
    href: `${videoUrl}&t=106s`,
    blocks: [
      { label: "対子", tiles: ["man2", "man2"] },
      { label: "対子", tiles: ["pin5", "pin5"] },
      { label: "整理候補", tiles: ["sou7", "sou7"], weak: true }
    ]
  },
  {
    number: 2,
    title: "対子候補が2組なら、1組に減らさない",
    description: "対子が2組あれば、一方が刻子になっても、もう一方を雀頭として使えます。雀頭候補を失って手牌が不安定になるのを避ける、初心者が覚えやすい基準です。",
    href: `${videoUrl}&t=496s`,
    blocks: [
      { label: "雀頭候補", tiles: ["ji5", "ji5"] },
      { label: "刻子候補", tiles: ["man5", "man5"] }
    ]
  },
  {
    number: 3,
    title: "6ブロックなら、弱い形から5ブロックへ絞る",
    description: "基本のアガリ形は4面子1雀頭なので、手牌は5ブロックで完成します。6ブロックあるときは、ペンチャンやカンチャンなど受け入れの狭い候補を比較し、不要な1ブロックを早めに整理します。",
    href: `${videoUrl}&t=772s`,
    blocks: [
      { label: "1", tiles: ["man1", "man2", "man3"] },
      { label: "2", tiles: ["man4", "man5"] },
      { label: "3", tiles: ["pin3", "pin4", "pin5"] },
      { label: "4", tiles: ["sou6", "sou7"] },
      { label: "5", tiles: ["sou8", "sou8"] },
      { label: "弱い候補", tiles: ["pin1", "pin2"], weak: true }
    ]
  },
  {
    number: 4,
    title: "5ブロックあるなら、4ブロックへ減らさない",
    description: "必要な5ブロックが見えているのに塔子を丸ごと外すと、もう一度ブロックを作り直す必要が生まれます。受け入れを比べながら、完成に必要な5つの候補を保ちます。",
    href: `${videoUrl}&t=1135s`,
    blocks: [
      { label: "1", tiles: ["man1", "man2", "man3"] },
      { label: "2", tiles: ["man4", "man5"] },
      { label: "3", tiles: ["pin3", "pin4", "pin5"] },
      { label: "4", tiles: ["sou6", "sou7"] },
      { label: "5", tiles: ["sou8", "sou8"] }
    ]
  }
];

const tileNames: Record<string, string> = {
  man1: "一萬", man2: "二萬", man3: "三萬", man4: "四萬", man5: "五萬",
  pin1: "一筒", pin2: "二筒", pin3: "三筒", pin4: "四筒", pin5: "五筒",
  sou6: "六索", sou7: "七索", sou8: "八索", ji5: "發"
};

export default function TileEfficiencyVideoArticlePage() {
  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト"><Link href="/">トップ</Link><span>›</span><Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span><span>牌効率</span></nav>
          <p className="siteEyebrow">VIDEO GUIDE / 牌効率</p>
          <h1>麻雀初心者が覚えたい牌効率の4法則</h1>
          <p className="videoArticleLead">何切るで迷ったときに、対子候補とブロック数を数えて手牌を整理する考え方を学べる動画です。動画の内容と、見る前に知っておきたいポイントを初心者向けにまとめます。</p>
          <div className="videoArticleByline"><span>紹介動画: 発男道場【麻雀解説ch】</span><time>動画公開日 2024年1月9日</time><span>約7分で読める</span></div>
        </header>

        <div className="videoArticleEmbed">
          <iframe
            src="https://www.youtube-nocookie.com/embed/q3LPfokscno"
            title="【麻雀解説】覚えると勝ち組！牌効率の法則（初心者向け）"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <p className="videoSourceNote">動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">発男道場【麻雀解説ch】の元動画をYouTubeで見る</a></p>

        <aside className="videoArticleSidebar">
          <section className="videoArticleAudience">
            <div>
              <p className="videoArticleSectionLabel">RECOMMENDED FOR</p>
              <h2>この動画はこんな人に向いています</h2>
            </div>
            <ul>
              <li>基本ルールは分かるけれど、毎巡どの牌を切るか迷う人</li>
              <li>対子を残しすぎたり、雀頭候補をなくしたりしやすい人</li>
              <li>5ブロック、6ブロックという見方をまだ使えていない人</li>
              <li>何切る問題へ進む前に、判断の基準をひとつ持ちたい人</li>
            </ul>
          </section>

          <section className="videoArticleHighlights">
            <h2>動画の見どころ</h2>
            <ol>
              <li><span>01</span><div><strong>対子を残す数が分かる</strong><p>3対子と2対子で、整理の考え方が変わる理由を学びます。</p></div></li>
              <li><span>02</span><div><strong>5ブロックで手牌を見る</strong><p>アガリに必要な部品を数え、余った形を見つけます。</p></div></li>
              <li><span>03</span><div><strong>弱い形を比較できる</strong><p>受け入れの狭い候補から整理する順番を確認します。</p></div></li>
            </ol>
          </section>
        </aside>

        <section className="videoArticleHandPreview">
          <h2>牌図で確認</h2>
          <div>
            <div className="videoArticleHandTiles">
              {["man2", "man3", "man4", "man5", "man6", "pin3", "pin4", "pin5", "sou4", "sou5", "sou6", "ji6", "ji6"].map((tile, index) => (
                <img key={`${tile}-${index}`} src={`/tiles/${tile}-66-90-l-emb.png`} alt="" />
              ))}
            </div>
            <span>打</span>
            <img src="/tiles/man6-66-90-l-emb.png" alt="六萬" />
          </div>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">OVERVIEW</p>
          <h2>動画で学べること</h2>
          <p>中心となる考え方は、手牌を「対子候補」と「ブロック」に分けて数えることです。完成に必要な5ブロックを保ちながら、余った候補や弱い候補を整理すると、テンパイへ進む牌の種類を増やしやすくなります。</p>
          <p>特に大切なのは、対子が2組ある形をすぐ1組に減らさないことと、6ブロックあるときに弱い1ブロックを選ぶことです。牌の名前を暗記するのではなく、手牌全体の部品数を数える習慣を作れます。</p>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">FOUR PRINCIPLES</p>
          <h2>初心者が覚えたい4つの基準</h2>
          <p className="videoDiagramNote">牌図は考え方を示すための簡略例です。実戦では周囲の牌、役、ドラ、安全度も合わせて判断します。</p>
          <div className="videoPrincipleList">
            {principles.map((principle) => (
              <section key={principle.number} className="videoPrinciple">
                <div className="videoPrincipleNumber">{principle.number}</div>
                <div className="videoPrincipleBody">
                  <h3>{principle.title}</h3>
                  <p>{principle.description}</p>
                  <div className="videoArticleTileBlocks">
                    {principle.blocks.map((block, index) => (
                      <div className={block.weak ? "isWeak" : ""} key={`${principle.number}-${index}`}>
                        <span>{block.label}</span>
                        <div>{block.tiles.map((tile, tileIndex) => <img key={`${tile}-${tileIndex}`} src={`/tiles/${tile}-66-90-l-emb.png`} alt={tileNames[tile] ?? tile} />)}</div>
                      </div>
                    ))}
                  </div>
                  <a href={principle.href} target="_blank" rel="noopener noreferrer">この法則を動画の該当箇所から見る</a>
                </div>
              </section>
            ))}
          </div>
        </section>

        <section className="videoArticleCaution">
          <p className="videoArticleSectionLabel">IMPORTANT</p>
          <h2>牌効率は「最速」を考える基準です</h2>
          <p>この4法則は、テンパイまでの速さと受け入れを考えるための基本です。ただし、実戦の打牌は牌効率だけでは決まりません。役を残したい場面、ドラを使いたい場面、相手のリーチに安全牌を残したい場面では、別の選択が有力になることがあります。</p>
          <p>まず4法則を基本形として覚え、その後に打点・守備・局面を重ねていくと理解しやすくなります。</p>
        </section>

        <section className="videoArticleNext">
          <p className="videoArticleSectionLabel">NEXT STEP</p>
          <h2>動画を見たあとに試してみる</h2>
          <div>
            <Link href="/videos/strategy/tile-efficiency-essential-theory-quiz">全16問の何切る動画で理解度を試す</Link>
            <Link href="/trainer">何切る問題でブロック数を数える</Link>
            <Link href="/analysis/mahjong-tool">受け入れ枚数チェッカーで比較する</Link>
            <Link href="/rules/practical-waits">待ちの形を牌図で復習する</Link>
          </div>
        </section>
      </article>
    </main>
  );
}

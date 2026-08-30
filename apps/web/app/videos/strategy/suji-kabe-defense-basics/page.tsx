import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "麻雀で安牌がないときは？スジとカベの安全牌の探し方",
  description: "現物がないときに当たりにくい牌を探すスジとカベを初心者向けに解説。1・4・7のスジ、ノーチャンスとワンチャンス、過信できない待ちを牌図で紹介します。"
};

const videoUrl = "https://www.youtube.com/watch?v=q5XfdejdsE8";

type DefenseFigureBlock = {
  label: string;
  tiles: string[];
  weak?: boolean;
  strong?: boolean;
};

type DefenseChapter = {
  number: number;
  time: string;
  title: string;
  description: string;
  href: string;
  blocks: DefenseFigureBlock[];
};

const defenseChapters: DefenseChapter[] = [
  {
    number: 1,
    time: "01:10",
    title: "最初に両面待ちの形を確認する",
    description: "スジとカベは、相手の両面待ちに当たりにくい牌を探す考え方です。たとえば2・3なら1と4、5・6なら4と7がアガリ牌になります。まずこの組み合わせが土台です。",
    href: `${videoUrl}&t=70s`,
    blocks: [
      { label: "2・3の両面", tiles: ["man2", "man3"] },
      { label: "待ち", tiles: ["man1", "man4"], strong: true },
      { label: "5・6の両面", tiles: ["pin5", "pin6"] },
      { label: "待ち", tiles: ["pin4", "pin7"], strong: true }
    ]
  },
  {
    number: 2,
    time: "01:54",
    title: "捨て牌からスジを探す",
    description: "相手が4萬を捨てていれば、フリテンのため2・3待ちの1萬と5・6待ちの7萬ではロンできません。この1・4・7の関係がスジです。ただし否定できるのは両面待ちだけです。",
    href: `${videoUrl}&t=114s`,
    blocks: [
      { label: "相手の捨て牌", tiles: ["man4"], weak: true },
      { label: "スジ候補", tiles: ["man1", "man7"], strong: true }
    ]
  },
  {
    number: 3,
    time: "03:52",
    title: "3本のスジをセットで覚える",
    description: "数牌のスジは1・4・7、2・5・8、3・6・9の3本です。相手の捨て牌に中央の4・5・6があれば、同じスジの外側を候補として比較できます。萬子・筒子・索子は別々に見ます。",
    href: `${videoUrl}&t=232s`,
    blocks: [
      { label: "スジ1", tiles: ["man1", "man4", "man7"] },
      { label: "スジ2", tiles: ["pin2", "pin5", "pin8"] },
      { label: "スジ3", tiles: ["sou3", "sou6", "sou9"] }
    ]
  },
  {
    number: 4,
    time: "05:35",
    title: "4枚見えのカベから外側を探す",
    description: "同じ3が4枚すべて見えていれば、相手は2・3や3・4の両面塔子を持てません。そのため外側の1・2は両面待ちに当たりにくくなります。7が4枚見えなら、外側の8・9を同じように考えます。",
    href: `${videoUrl}&t=335s`,
    blocks: [
      { label: "3が4枚見え", tiles: ["pin3", "pin3", "pin3", "pin3"], weak: true },
      { label: "外側の候補", tiles: ["pin1", "pin2"], strong: true },
      { label: "7が4枚見え", tiles: ["sou7", "sou7", "sou7", "sou7"], weak: true },
      { label: "外側の候補", tiles: ["sou8", "sou9"], strong: true }
    ]
  },
  {
    number: 5,
    time: "09:33",
    title: "ノーチャンスとワンチャンスを分ける",
    description: "4枚すべて見えている状態がノーチャンス、3枚見えている状態がワンチャンスです。ワンチャンスは残り1枚を相手が持っている可能性があるため、ノーチャンスより信頼度が下がります。特に終盤は過信できません。",
    href: `${videoUrl}&t=573s`,
    blocks: [
      { label: "ノーチャンス", tiles: ["man3", "man3", "man3", "man3"], strong: true },
      { label: "ワンチャンス", tiles: ["sou7", "sou7", "sou7"], weak: true }
    ]
  }
];

const tileNames: Record<string, string> = {
  man1: "一萬", man2: "二萬", man3: "三萬", man4: "四萬", man7: "七萬",
  pin1: "一筒", pin2: "二筒", pin3: "三筒", pin4: "四筒", pin5: "五筒", pin6: "六筒", pin7: "七筒", pin8: "八筒",
  sou3: "三索", sou6: "六索", sou7: "七索", sou8: "八索", sou9: "九索"
};

export default function SujiKabeDefenseBasicsArticlePage() {
  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト"><Link href="/">トップ</Link><span>›</span><Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span><span>スジとカベ</span></nav>
          <p className="siteEyebrow">VIDEO GUIDE / 守備・安全牌</p>
          <h1>安牌がないとき、何を切ればいい？</h1>
          <p className="videoArticleLead">現物が手元にない場面でも、すべての牌が同じ危険度とは限りません。相手の捨て牌から見る「スジ」と、見えている枚数から見る「カベ」を使い、比較的当たりにくい牌を探す方法を紹介します。</p>
          <div className="videoArticleByline"><span>紹介動画: 発男道場【麻雀解説ch】</span><time>動画公開日 2023年9月29日</time><span>約8分で読める</span></div>
        </header>

        <div className="videoArticleEmbed">
          <iframe
            src="https://www.youtube-nocookie.com/embed/q5XfdejdsE8"
            title="【麻雀解説】スジとカベを使った安牌の探し方（初心者向け）"
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
            <li>相手のリーチに対して現物がなく、何を切ればよいか分からない人</li>
            <li>スジという言葉は知っているけれど、理由を説明できない人</li>
            <li>カベ、ノーチャンス、ワンチャンスの違いを整理したい人</li>
            <li>放銃を減らすために、守備の判断材料を増やしたい人</li>
          </ul>
        </section>

        <section className="videoArticleBodySection videoDefenseBridge">
          <p className="videoArticleSectionLabel">WHEN YOU HAVE NO GENBUTSU</p>
          <h2>現物がないときの考える順番</h2>
          <div className="videoPracticeSteps">
            <div><b>STEP 1</b><h3>捨て牌からスジを見る</h3><p>1・4・7、2・5・8、3・6・9の関係から、両面待ちを否定できる候補を探します。</p></div>
            <div><b>STEP 2</b><h3>見えている枚数でカベを見る</h3><p>同じ牌が3枚または4枚見えていないか数え、外側の牌を候補として比較します。</p></div>
          </div>
          <p>スジとカベは「絶対に安全な牌」を作る魔法ではありません。候補が複数あるときに危険度を比較し、より当たりにくい牌を選ぶための材料です。</p>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">CHAPTER GUIDE</p>
          <h2>スジとカベを牌図で理解する</h2>
          <p className="videoDiagramNote">赤い枠は判断の根拠として見えている牌、緑の枠は比較的当たりにくくなる候補です。どちらも完全な安全牌とは限りません。</p>
          <div className="videoPrincipleList">
            {defenseChapters.map((chapter) => (
              <section key={chapter.number} className="videoPrinciple">
                <div className="videoPrincipleNumber">{chapter.number}</div>
                <div className="videoPrincipleBody">
                  <span className="videoChapterTime">{chapter.time} から</span>
                  <h3>{chapter.title}</h3>
                  <p>{chapter.description}</p>
                  <div className="videoArticleTileBlocks">
                    {chapter.blocks.map((block, index) => (
                      <div className={block.weak ? "isWeak" : block.strong ? "isStrong" : ""} key={`${chapter.number}-${index}`}>
                        <span>{block.label}</span>
                        <div>{block.tiles.map((tile, tileIndex) => <img key={`${tile}-${tileIndex}`} src={`/tiles/${tile}-66-90-l-emb.png`} alt={tileNames[tile] ?? tile} />)}</div>
                      </div>
                    ))}
                  </div>
                  <a href={chapter.href} target="_blank" rel="noopener noreferrer">この解説を動画の該当箇所から見る</a>
                </div>
              </section>
            ))}
          </div>
        </section>

        <section className="videoArticleCaution videoDefenseWarning">
          <p className="videoArticleSectionLabel">IMPORTANT</p>
          <h2>スジとカベが通用するのは両面待ちへの読み</h2>
          <p>スジはフリテンを利用して両面待ちを否定する考え方です。カベも、必要な牌が残っていないことから両面待ちを作りにくいと判断します。そのため、カンチャン、ペンチャン、単騎、シャンポンなどには当たる可能性があります。</p>
          <p>「スジだから安全」「ノーチャンスだから絶対に通る」と断定せず、現物、相手の捨て牌、見えている枚数、巡目を合わせて比較してください。適切に使えば、根拠なく危険牌を選ぶ場面を減らす助けになります。</p>
        </section>

        <section className="videoArticleNext">
          <p className="videoArticleSectionLabel">NEXT STEP</p>
          <h2>動画を見たあとに復習する</h2>
          <div>
            <Link href="/rules/practical-waits">両面・カンチャン・シャンポン待ちを牌図で見る</Link>
            <Link href="/videos/strategy/isolated-terminal-tile-order">孤立した1・9の価値を復習する</Link>
            <Link href="/videos/strategy/reach-declaration-tile-reading">次にリーチ宣言牌からの読みを学ぶ</Link>
            <Link href="/videos/strategy/tile-efficiency-essential-theory-quiz">何切る16問で手牌判断を練習する</Link>
          </div>
        </section>
      </article>
    </main>
  );
}

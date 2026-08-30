import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "麻雀初心者が覚えたい重要な形7選 | 牌効率を牌図で解説",
  description: "麻雀初心者が先に覚えたい四連形、中ぶくれ、両面カンチャン、完全イーシャンテンなど7つの重要形を、動画と牌図で分かりやすく解説します。"
};

const videoUrl = "https://www.youtube.com/watch?v=BkzUkNwDXjY";

const tileNames: Record<string, string> = {
  man2: "二萬", man3: "三萬", man4: "四萬", man5: "五萬", man6: "六萬", man7: "七萬", man8: "八萬",
  pin2: "二筒", pin3: "三筒", pin4: "四筒", pin5: "五筒", pin6: "六筒", pin7: "七筒", pin8: "八筒",
  sou2: "二索", sou3: "三索", sou4: "四索", sou5: "五索", sou6: "六索", sou7: "七索", sou8: "八索"
};

type Shape = {
  number: number;
  name: string;
  notation: string;
  tiles: string[];
  drawTiles: string[];
  explanation: string;
  action: string;
};

const shapes: Shape[] = [
  {
    number: 1,
    name: "四連形",
    notation: "4567",
    tiles: ["man4", "man5", "man6", "man7"],
    drawTiles: ["man3", "man8"],
    explanation: "数字が4枚連続した形です。完成した順子を含みながら、その両側に両面を作れるため、面子候補が足りない手で特に強く働きます。",
    action: "456だけを完成面子として固定せず、7まで含めた4枚で残します。"
  },
  {
    number: 2,
    name: "中ぶくれ",
    notation: "3445",
    tiles: ["man3", "man4", "man4", "man5"],
    drawTiles: ["man2", "man6"],
    explanation: "順子の中央が重なった形です。2や6を引くと両面を含む形になりやすく、孤立した4を1枚持つより良形へ育ちやすいのが特徴です。",
    action: "重なった4を余り牌だと思わず、両面を作るための大切な1枚として残します。"
  },
  {
    number: 3,
    name: "面子の一つ外側にある牌",
    notation: "4678",
    tiles: ["man4", "man6", "man7", "man8"],
    drawTiles: ["man5"],
    explanation: "678の完成面子から一つ離れた4も、5を引けば45678になります。3・6・9の三面待ちへつながる変化を持つため、普通の孤立牌より価値があります。",
    action: "完成面子の近くにある牌は、間の牌を引いた形を想像してから切ります。"
  },
  {
    number: 4,
    name: "両面カンチャン",
    notation: "24567",
    tiles: ["pin2", "pin4", "pin5", "pin6", "pin7"],
    drawTiles: ["pin3", "pin8"],
    explanation: "24のカンチャンと67の両面が、456の面子を介して重なった形です。3なら234と567、8なら24を残して678を作れます。",
    action: "両面だけを見て2を切らず、カンチャンの受け入れも一緒に残します。"
  },
  {
    number: 5,
    name: "飛び対子が3組ある形",
    notation: "446688",
    tiles: ["sou4", "sou4", "sou6", "sou6", "sou8", "sou8"],
    drawTiles: ["sou5", "sou7"],
    explanation: "一つ飛びの対子が3組並ぶ形です。中央の6を1枚切って44688にすると、4・5・7・8を受けられる形に整理できます。",
    action: "113355や557799でも、まず中央の対子から1枚外す考え方を覚えます。"
  },
  {
    number: 6,
    name: "4枚の愚形は3枚に整理する",
    notation: "4468",
    tiles: ["pin4", "pin4", "pin6", "pin8"],
    drawTiles: ["pin4", "pin5"],
    explanation: "弱い形が4枚連なっているときは、すべてを残すより3枚に整理した方が、別のターツと合わせた受け入れが広くなる場合があります。",
    action: "4468なら8を切って446を残し、対子とカンチャンの両方を使えるようにします。"
  },
  {
    number: 7,
    name: "完全イーシャンテン",
    notation: "両面2組＋対子2組",
    tiles: ["man4", "man5", "pin4", "pin5", "sou3", "sou3", "sou7", "sou7"],
    drawTiles: ["man3", "man6", "pin3", "pin6", "sou3", "sou7"],
    explanation: "両面ターツ2組と対子2組を持つ、テンパイ受け入れが広いイーシャンテンです。両面だけでなく、対子が刻子になるツモでもテンパイできます。",
    action: "対子をすぐ1組に決めず、両面とシャンポンの受け入れを両方残します。"
  }
];

function TileRow({ tiles }: { tiles: string[] }) {
  return (
    <div>
      {tiles.map((tile, index) => (
        <img key={`${tile}-${index}`} src={`/tiles/${tile}-66-90-l-emb.png`} alt={tileNames[tile] ?? tile} />
      ))}
    </div>
  );
}

export default function SevenImportantShapesToMemorizePage() {
  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト"><Link href="/">トップ</Link><span>›</span><Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span><span>初心者が覚えたい重要形7選</span></nav>
          <p className="siteEyebrow">VIDEO GUIDE / 牌効率・重要形</p>
          <h1>初心者が先に覚えたい、勝ちにつながる重要な牌の形7選</h1>
          <p className="videoArticleLead">何を切るか迷う時間を減らしたいなら、よく出る強い形を先に覚えるのが近道です。動画で紹介される7形を、牌画像と「残す理由」に分けて確認します。</p>
          <div className="videoArticleByline"><span>紹介動画: 平澤元気麻雀ch</span><time>動画公開日 2022年3月2日</time><span>約10分で読める</span></div>
        </header>

        <div className="videoArticleEmbed">
          <iframe
            src="https://www.youtube-nocookie.com/embed/BkzUkNwDXjY"
            title="初心者が丸暗記するだけで勝てるようになる重要形7選"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <p className="videoSourceNote">動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">平澤元気麻雀chの元動画をYouTubeで見る</a></p>

        <section className="videoArticleAudience">
          <div><p className="videoArticleSectionLabel">RECOMMENDED FOR</p><h2>この動画はこんな人に向いています</h2></div>
          <ul>
            <li>牌のつながりを見ても、どれが強い形か分からない人</li>
            <li>完成した面子の近くにある牌をすぐ切ってしまう人</li>
            <li>何切るで受け入れの広い選択をできるようになりたい人</li>
            <li>完全イーシャンテンを牌図から見つけたい人</li>
          </ul>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">FIRST POINT</p>
          <h2>形を覚えると「次に何を引きたいか」が見える</h2>
          <p>牌効率は難しい計算から始めなくても大丈夫です。よく出る形と、その形が受け入れる牌をセットで覚えると、アガリへ近づく打牌を選びやすくなります。</p>
          <div className="strategyKeyMessage"><strong>最初は四連形と中ぶくれから。</strong>対局中にこの2つを見つけて残せるだけでも、両面を作れる回数が増えていきます。</div>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">SEVEN SHAPES</p>
          <h2>牌図で覚える7つの重要形</h2>
          <div className="videoPrincipleList">
            {shapes.map((shape) => (
              <section key={shape.number} className="videoPrinciple meldShapePattern">
                <div className="videoPrincipleNumber">{shape.number}</div>
                <div className="videoPrincipleBody">
                  <h3>{shape.name}<span className="meldShapeNotation">{shape.notation}</span></h3>
                  <p>{shape.explanation}</p>
                  <div className="videoArticleTileBlocks meldShapeTileBlocks">
                    <div className="isStrong"><span>残したい形</span><TileRow tiles={shape.tiles} /></div>
                    <div><span>主な受け入れ</span><TileRow tiles={shape.drawTiles} /></div>
                  </div>
                  <div className="strategyActionBox"><b>打つときの要点</b><p>{shape.action}</p></div>
                </div>
              </section>
            ))}
          </div>
        </section>

        <section className="videoArticleCaution">
          <p className="videoArticleSectionLabel">CAUTION</p>
          <h2>形だけで打牌を決めない</h2>
          <p>重要形は受け入れを広くする基本ですが、ドラ、役、残り枚数、巡目によって優先順位は変わります。まず形を見つけ、その後に打点と場況を比べる順番で使いましょう。</p>
        </section>

        <section className="videoArticleNext">
          <p className="videoArticleSectionLabel">NEXT STEP</p>
          <h2>覚えた形を実際の手牌で試す</h2>
          <div>
            <Link href="/analysis/mahjong-tool">牌理チェッカーで受け入れを比べる</Link>
            <Link href="/videos/strategy/tile-efficiency-four-rules">牌効率の4法則を復習する</Link>
            <Link href="/videos/strategy/seven-strong-shapes-for-winning">別の強い形7選も見る</Link>
            <Link href="/videos/strategy/tile-efficiency-essential-theory-quiz">何切る問題で理解を確認する</Link>
          </div>
        </section>
      </article>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ClearRainNanikiruBook } from "../../../components/VideoBookRecommendation";

export const metadata: Metadata = {
  title: "麻雀で面子を作りやすい形7選 | 四連形・中ぶくれ・リャンカンを牌図で解説",
  description: "麻雀初心者が覚えたい、四連形、中ぶくれ、亜両面、リャンカンなど面子へ発展しやすい7つの形を動画と牌図で解説します。"
};

const videoUrl = "https://www.youtube.com/watch?v=56xlttqbiOY";

const tileNames: Record<string, string> = {
  man1: "一萬", man2: "二萬", man3: "三萬", man4: "四萬", man5: "五萬", man6: "六萬", man7: "七萬", man8: "八萬"
};

type MeldPattern = {
  number: number;
  time: string;
  name: string;
  notation: string;
  tiles: string[];
  usefulTiles: string[];
  summary: string;
  example: string;
  point: string;
};

const patterns: MeldPattern[] = [
  {
    number: 1,
    time: "01:01",
    name: "四連形",
    notation: "3456",
    tiles: ["man3", "man4", "man5", "man6"],
    usefulTiles: ["man2", "man7"],
    summary: "数字が4つ連続した形です。すでに順子を1つ含みながら、34・45・56という複数の両面候補も持っています。",
    example: "2を引けば234＋56、7を引けば34＋567のように、完成面子を残しながら次の面子候補を作れます。",
    point: "手牌の中で見つけたら、単なる完成面子として3枚だけ抜き出さず、4枚セットで価値を見ます。"
  },
  {
    number: 2,
    time: "03:56",
    name: "中ぶくれ",
    notation: "4556",
    tiles: ["man4", "man5", "man5", "man6"],
    usefulTiles: ["man3", "man7"],
    summary: "順子の真ん中が重なった形です。45と56の両面候補を持ち、中央の5は対子としても使えます。",
    example: "3を引けば345、7を引けば567を作れます。4・5・6を引いたときにも対子や刻子の変化が生まれます。",
    point: "中央の重なりを余り牌だと思って、5をすぐ1枚切らないことが大切です。"
  },
  {
    number: 3,
    time: "05:30",
    name: "完成面子＋1つ離れた牌",
    notation: "2456",
    tiles: ["man2", "man4", "man5", "man6"],
    usefulTiles: ["man3"],
    summary: "456の完成面子から1つ離れた2がある形です。離れて見える2も、3を引くと二つの面子候補をつなぐ重要牌になります。",
    example: "3を引くと234＋56になり、完成面子を1つ増やしながら両面も残せます。",
    point: "面子の近くにある牌は、孤立牌として切る前に『間の1枚を引いた変化』を確認します。"
  },
  {
    number: 4,
    time: "07:22",
    name: "亜両面",
    notation: "445",
    tiles: ["man4", "man4", "man5"],
    usefulTiles: ["man3", "man4", "man6"],
    summary: "対子の44と両面の45が重なった形です。雀頭候補としても面子候補としても使えるため、見た目以上に柔軟です。",
    example: "3・6で順子が完成し、4なら刻子になります。待ちの形として現れると3・6待ちの亜両面になります。",
    point: "『44が雀頭だから5は不要』と決めつけず、対子と両面の両方として見ます。"
  },
  {
    number: 5,
    time: "10:05",
    name: "リャンカン",
    notation: "246",
    tiles: ["man2", "man4", "man6"],
    usefulTiles: ["man3", "man5"],
    summary: "カンチャンが二つ重なった形です。1枚のカンチャンよりも、面子を完成させる牌が2種類あります。",
    example: "3を引けば234、5を引けば456が完成します。どちらを引いても1面子を作れます。",
    point: "246から真ん中の4を切ると、二つあった受け入れを同時に失います。形のまま残すのが基本です。"
  },
  {
    number: 6,
    time: "10:55",
    name: "離れリャンカン",
    notation: "134568",
    tiles: ["man1", "man3", "man4", "man5", "man6", "man8"],
    usefulTiles: ["man2", "man7"],
    summary: "13と68の二つのカンチャンが、中央の456を挟んで離れている複合形です。",
    example: "2を引けば123＋456、7を引けば345＋678を作れます。離れた両端が、中央の面子と連動しています。",
    point: "完成面子の456だけを先に固定せず、両端まで含めた6枚で受け入れを見ます。"
  },
  {
    number: 7,
    time: "11:49",
    name: "両面カンチャン",
    notation: "134556",
    tiles: ["man1", "man3", "man4", "man5", "man5", "man6"],
    usefulTiles: ["man2", "man4", "man7"],
    summary: "13のカンチャン、345の順子、56の両面が重なって見える複合形です。",
    example: "2なら123＋456、4や7なら345ともう一つの順子候補を作れます。離れて見える1にも役割があります。",
    point: "1をただの浮き牌として切る前に、2を引いたとき二つの面子ができることを確認します。"
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

export default function SevenMeldBuildingShapesArticlePage() {
  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト"><Link href="/">トップ</Link><span>›</span><Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span><span>面子を作りやすい形7選</span></nav>
          <p className="siteEyebrow">VIDEO GUIDE / 牌効率・複合形</p>
          <h1>覚えておくと得をする、面子を作りやすい7つの形</h1>
          <p className="videoArticleLead">手牌の中にある「伸びる形」を見つけられると、面子を作る速度が上がります。四連形や中ぶくれから、少し複雑な両面カンチャンまで、何を引くと形がよくなるかを牌図で確認します。</p>
          <div className="videoArticleByline"><span>紹介動画: クリアレインのアトリエ【麻雀解説】</span><time>動画公開日 2023年7月29日</time><span>約10分で読める</span></div>
        </header>

        <div className="videoArticleEmbed">
          <iframe
            src="https://www.youtube-nocookie.com/embed/56xlttqbiOY"
            title="【麻雀】初心者が絶対に覚えるべきメンツを作りやすい重要な形【7選】"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <p className="videoSourceNote">動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">クリアレインのアトリエ【麻雀解説】の元動画をYouTubeで見る</a></p>

        <section className="videoArticleAudience">
          <div>
            <p className="videoArticleSectionLabel">RECOMMENDED FOR</p>
            <h2>この動画はこんな人に向いています</h2>
          </div>
          <ul>
            <li>面子になっていない牌を、どれから切ればよいか迷う人</li>
            <li>完成した順子の近くにある牌を、すぐ切ってしまう人</li>
            <li>リャンカンや亜両面などの複合形を覚えたい人</li>
            <li>受け入れ枚数を増やして、テンパイ速度を上げたい人</li>
          </ul>
        </section>

        <section className="videoArticleBodySection meldShapeIntro">
          <p className="videoArticleSectionLabel">HOW TO READ</p>
          <h2>数字ではなく、間隔と重なりを見る</h2>
          <p><strong>3456と4567は、数字が違っても同じ四連形です。</strong>萬子・筒子・索子のどれでも考え方は同じです。まずは牌が連続しているか、1つ飛びか、同じ牌が重なっているかを見ます。</p>
          <div className="strategyKeyMessage"><strong>全部を一度に暗記しなくて大丈夫です。</strong>最初は四連形・中ぶくれ・リャンカンの3つを探し、慣れてから6枚の複合形へ進みましょう。</div>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">SEVEN PATTERNS</p>
          <h2>牌図で覚える、面子を作りやすい7つの形</h2>
          <div className="videoPrincipleList">
            {patterns.map((pattern) => (
              <section key={pattern.number} className="videoPrinciple meldShapePattern">
                <div className="videoPrincipleNumber">{pattern.number}</div>
                <div className="videoPrincipleBody">
                  <span className="videoChapterTime">{pattern.time} から</span>
                  <h3>{pattern.name}<span className="meldShapeNotation">{pattern.notation}</span></h3>
                  <p>{pattern.summary}</p>
                  <div className="videoArticleTileBlocks meldShapeTileBlocks">
                    <div className="isStrong"><span>覚える形</span><TileRow tiles={pattern.tiles} /></div>
                    <div><span>特に注目する牌</span><TileRow tiles={pattern.usefulTiles} /></div>
                  </div>
                  <div className="strategyActionBox"><b>どう変化する？</b><p>{pattern.example}</p></div>
                  <p className="meldShapePoint"><strong>見るポイント:</strong> {pattern.point}</p>
                  <a href={`${videoUrl}&t=${Number(pattern.time.split(":")[0]) * 60 + Number(pattern.time.split(":")[1])}s`} target="_blank" rel="noopener noreferrer">この形を動画の該当箇所から見る</a>
                </div>
              </section>
            ))}
          </div>
        </section>

        <section className="videoArticleCaution meldShapePracticeBox">
          <p className="videoArticleSectionLabel">PRACTICE</p>
          <h2>対局中は「引いた後」を1回だけ想像する</h2>
          <p>形を見つけたら、すべての受け入れを数える必要はありません。「この形に3を引いたらどうなる？」と、次の1枚だけを想像します。完成面子と両面が同時に残るなら、価値の高い形です。</p>
          <p>慣れてきたら牌理チェッカーへ同じ形を入力し、どの打牌が受け入れを残せるか比較すると覚えやすくなります。</p>
        </section>

        <ClearRainNanikiruBook />

        <section className="videoArticleNext">
          <p className="videoArticleSectionLabel">NEXT STEP</p>
          <h2>受け入れを実際に比較する</h2>
          <div>
            <Link href="/analysis/mahjong-tool">牌理チェッカーで受け入れを比べる</Link>
            <Link href="/videos/strategy/tile-efficiency-four-rules">牌効率の4法則を動画で学ぶ</Link>
            <Link href="/videos/strategy/tile-efficiency-essential-theory-quiz">何切る問題で重要セオリーを試す</Link>
            <Link href="/trainer">麻雀トレーニングへ進む</Link>
          </div>
        </section>
      </article>
    </main>
  );
}

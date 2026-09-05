import type { Metadata } from "next";
import Link from "next/link";
import { ClearRainNanikiruBook } from "../../../components/VideoBookRecommendation";

export const metadata: Metadata = {
  title: "麻雀初心者が覚えたい強い形7選 | アガリ率を上げる牌効率",
  description: "麻雀初心者向けに、四連形、中ぶくれ、一枚飛び、リャンカン、離れリャンカン、カンチャン対子、両面カンチャンを動画と牌図で解説します。"
};

const videoUrl = "https://www.youtube.com/watch?v=_wZjkrqSeoA";

const tileNames: Record<string, string> = {
  man1: "一萬", man2: "二萬", man3: "三萬", man4: "四萬", man5: "五萬",
  man6: "六萬", man7: "七萬", man8: "八萬"
};

type StrongShape = {
  number: number;
  time: string;
  name: string;
  notation: string;
  tiles: string[];
  keyTiles: string[];
  description: string;
  change: string;
  recognition: string;
};

const strongShapes: StrongShape[] = [
  {
    number: 1,
    time: "0:44",
    name: "四連形",
    notation: "4567",
    tiles: ["man4", "man5", "man6", "man7"],
    keyTiles: ["man3", "man8"],
    description: "数字が4つ連続した形です。完成した順子だけでなく、その両側に次の面子候補を残せます。",
    change: "3を引けば345＋67、8を引けば45＋678の形になり、面子を残しながら両面を作れます。",
    recognition: "完成した順子を見つけたら、その左右に連続する牌が1枚ないかまで確認します。"
  },
  {
    number: 2,
    time: "3:08",
    name: "中ぶくれ",
    notation: "4556",
    tiles: ["man4", "man5", "man5", "man6"],
    keyTiles: ["man3", "man7"],
    description: "順子の中央が1枚重なった形です。中央の5は対子になり、45と56はそれぞれ両面候補になります。",
    change: "3なら345＋56、7なら45＋567へ変化します。中央の重なりを余り牌だと思わないことが大切です。",
    recognition: "『連続する3枚＋真ん中と同じ牌』を見つけたら、中ぶくれとして4枚まとめて見ます。"
  },
  {
    number: 3,
    time: "5:15",
    name: "一枚飛び",
    notation: "3567",
    tiles: ["man3", "man5", "man6", "man7"],
    keyTiles: ["man4", "man8"],
    description: "完成面子の近くに、数字が1つ空いて牌がある形です。離れた3も、孤立牌より広い変化を持ちます。",
    change: "4を引くと34567となり、2・5・8へ伸びる形が見えます。8なら567を残しながら3の変化を待てます。",
    recognition: "完成面子の隣だけでなく、1つ飛ばした位置まで見てから孤立牌を選びます。"
  },
  {
    number: 4,
    time: "7:20",
    name: "リャンカン",
    notation: "135",
    tiles: ["man1", "man3", "man5"],
    keyTiles: ["man2", "man4"],
    description: "カンチャンが二つ重なった3枚形です。普通のカンチャンより、面子を完成させる牌が1種類多くあります。",
    change: "2を引けば123、4を引けば345が完成します。真ん中の3を先に切ると両方の受け入れを失います。",
    recognition: "奇数が一つおきに3枚並んだら、二つのカンチャンが重なっていると考えます。"
  },
  {
    number: 5,
    time: "10:15",
    name: "離れリャンカン",
    notation: "134568",
    tiles: ["man1", "man3", "man4", "man5", "man6", "man8"],
    keyTiles: ["man2", "man7"],
    description: "中央の456を挟んで、13と68のカンチャンが離れている6枚の複合形です。",
    change: "2なら123＋456、7なら345＋678を作れます。中央の順子だけで切り分けると両端の受けを見落とします。",
    recognition: "完成面子の左右にカンチャンがないか、6枚を横につないで確認します。"
  },
  {
    number: 6,
    time: "11:45",
    name: "カンチャン対子",
    notation: "134566",
    tiles: ["man1", "man3", "man4", "man5", "man6", "man6"],
    keyTiles: ["man2", "man6"],
    description: "カンチャンと対子が、完成面子の近くで組み合わさった形です。見た目より多くの完成ルートがあります。",
    change: "2なら123＋456、6なら345＋666を作れます。端の1を急いで切る前に、2の受けを確認します。",
    recognition: "完成面子の横にカンチャンがあり、同じ牌が重なっていたら対子の変化まで見ます。"
  },
  {
    number: 7,
    time: "13:12",
    name: "両面カンチャン",
    notation: "13456",
    tiles: ["man1", "man3", "man4", "man5", "man6"],
    keyTiles: ["man2", "man4", "man7"],
    description: "13のカンチャンと56の両面が、345の順子を通してつながっている形です。",
    change: "2なら123＋456が一度に完成します。4は対子を作り、7は567を完成させながら13のカンチャンを残します。",
    recognition: "順子の両側にターツが見えるときは、5枚全体で受け入れを探します。"
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

function secondsFromTime(time: string) {
  const [minutes, seconds] = time.split(":").map(Number);
  return minutes * 60 + seconds;
}

export default function SevenStrongShapesForWinningArticlePage() {
  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト"><Link href="/">トップ</Link><span>›</span><Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span><span>強い形7選</span></nav>
          <p className="siteEyebrow">VIDEO GUIDE / 牌効率・強い形</p>
          <h1>面白いほどアガリやすくなる、初心者が覚えたい強い形7選</h1>
          <p className="videoArticleLead">牌を1枚ずつ見るのではなく、伸びやすい形のまとまりとして見ると、手牌を進める速度が変わります。動画で紹介される7つの形を、実際の牌画像と「次に何を引くとよいか」で整理します。</p>
          <div className="videoArticleByline"><span>紹介動画: クリアレインのアトリエ【麻雀解説】</span><time>動画公開日 2026年5月30日</time><span>約10分で読める</span></div>
        </header>

        <div className="videoArticleEmbed">
          <iframe
            src="https://www.youtube-nocookie.com/embed/_wZjkrqSeoA"
            title="【麻雀】面白いほどあがれる！初心者が絶対に覚えるべき強い形7選"
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
            <li>順子が完成すると、近くの牌をすぐ切ってしまう人</li>
            <li>孤立牌と伸びる牌の違いを見分けたい人</li>
            <li>カンチャンを残すか迷うことが多い人</li>
            <li>何切るで受け入れの広い形を選べるようになりたい人</li>
          </ul>
        </section>

        <section className="videoArticleBodySection meldShapeIntro">
          <p className="videoArticleSectionLabel">FIRST STEP</p>
          <h2>最初は3つだけ探せれば十分です</h2>
          <p>動画内でも、覚える量が多いと感じたら<strong>四連形・中ぶくれ・一枚飛び</strong>を先に覚える方法が案内されています。この3つは見た目が分かりやすく、手牌の中でも頻繁に現れます。</p>
          <div className="strategyKeyMessage"><strong>牌を切る前に、完成面子の前後をもう一度見る。</strong>これだけでも、伸びる形を崩すミスを減らせます。</div>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">SEVEN SHAPES</p>
          <h2>動画の順番で覚える、アガリにつながる7つの形</h2>
          <div className="videoPrincipleList">
            {strongShapes.map((shape) => (
              <section key={shape.number} className="videoPrinciple meldShapePattern">
                <div className="videoPrincipleNumber">{shape.number}</div>
                <div className="videoPrincipleBody">
                  <span className="videoChapterTime">{shape.time} から</span>
                  <h3>{shape.name}<span className="meldShapeNotation">{shape.notation}</span></h3>
                  <p>{shape.description}</p>
                  <div className="videoArticleTileBlocks meldShapeTileBlocks">
                    <div className="isStrong"><span>覚える形</span><TileRow tiles={shape.tiles} /></div>
                    <div><span>注目する牌</span><TileRow tiles={shape.keyTiles} /></div>
                  </div>
                  <div className="strategyActionBox"><b>何を引くと強くなる？</b><p>{shape.change}</p></div>
                  <p className="meldShapePoint"><strong>対局中の見つけ方:</strong> {shape.recognition}</p>
                  <a href={`${videoUrl}&t=${secondsFromTime(shape.time)}s`} target="_blank" rel="noopener noreferrer">{shape.name}を動画の該当箇所から見る</a>
                </div>
              </section>
            ))}
          </div>
        </section>

        <section className="videoArticleCaution meldShapePracticeBox">
          <p className="videoArticleSectionLabel">HOW TO PRACTICE</p>
          <h2>形を見つけたら、引いた後の2組を作ってみる</h2>
          <p>受け入れ枚数をすべて暗算する必要はありません。たとえば4567なら、3を加えて「345＋67」、8を加えて「45＋678」と、手牌を二つの組に分けてみます。</p>
          <p>牌理チェッカーへ形を含む手牌を入力すると、残した場合と崩した場合の受け入れを比較できます。動画で覚えた形を実際に動かすと、対局中にも見つけやすくなります。</p>
        </section>

        <ClearRainNanikiruBook />

        <section className="videoArticleNext">
          <p className="videoArticleSectionLabel">NEXT STEP</p>
          <h2>牌を動かして、強い形を自分のものにする</h2>
          <div>
            <Link href="/analysis/mahjong-tool">牌理チェッカーで受け入れを比較する</Link>
            <Link href="/videos/strategy/seven-meld-building-shapes">7つの複合形をさらに詳しく読む</Link>
            <Link href="/videos/strategy/tile-efficiency-four-rules">牌効率の4法則を動画で学ぶ</Link>
            <Link href="/trainer">麻雀トレーニングで試す</Link>
          </div>
        </section>
      </article>
    </main>
  );
}

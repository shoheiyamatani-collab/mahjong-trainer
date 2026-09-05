import type { Metadata } from "next";
import Link from "next/link";
import { ClearRainBasicTheoryBook } from "../../../components/VideoBookRecommendation";

export const metadata: Metadata = {
  title: "麻雀初心者が基本役の次に覚えたい10役 | 打点を伸ばす役を牌姿で解説",
  description: "アガれるようになった麻雀初心者へ向けて、一盃口・三色同順・一気通貫・対々和・混一色・清一色・混全帯么九・純全帯么九・三暗刻・七対子を動画と14枚の牌姿で紹介します。"
};

const videoUrl = "https://www.youtube.com/watch?v=XOTTtJaRGQs";

const tileNames: Record<string, string> = {
  man1: "一萬", man2: "二萬", man3: "三萬", man4: "四萬", man5: "五萬", man6: "六萬", man7: "七萬", man8: "八萬", man9: "九萬",
  pin1: "一筒", pin2: "二筒", pin3: "三筒", pin4: "四筒", pin5: "五筒", pin6: "六筒", pin7: "七筒", pin8: "八筒", pin9: "九筒",
  sou1: "一索", sou2: "二索", sou3: "三索", sou4: "四索", sou5: "五索", sou6: "六索", sou7: "七索", sou8: "八索", sou9: "九索",
  ji1: "東", ji2: "南", ji3: "西", ji4: "北", ji5: "白", ji6: "發", ji7: "中"
};

type TileGroup = {
  tiles: string[];
  target?: boolean;
  open?: boolean;
};

type YakuGuide = {
  number: number;
  time: string;
  name: string;
  reading: string;
  han: string;
  openRule: string;
  condition: string;
  eye: string;
  groups: TileGroup[];
  winningTile: string;
  winningTarget?: boolean;
  wholeTarget?: boolean;
};

const yakuGuides: YakuGuide[] = [
  {
    number: 1,
    time: "0:55",
    name: "一盃口",
    reading: "イーペーコー",
    han: "1翻",
    openRule: "門前のみ",
    condition: "同じ種類・同じ数字の順子を2組作ります。二三四・二三四のように、同じ並びが重なっているかを探します。",
    eye: "同じ色の中に、同じ3枚の並びが2回ある",
    groups: [
      { tiles: ["man2", "man3", "man4"], target: true },
      { tiles: ["man2", "man3", "man4"], target: true },
      { tiles: ["pin4", "pin5", "pin6"] },
      { tiles: ["sou7", "sou8", "sou9"] },
      { tiles: ["ji1"] }
    ],
    winningTile: "ji1"
  },
  {
    number: 2,
    time: "1:34",
    name: "三色同順",
    reading: "サンショクドウジュン",
    han: "門前2翻・副露1翻",
    openRule: "鳴いても成立",
    condition: "萬子・筒子・索子の3種類で、同じ数字の順子を作ります。例では三四五を3色そろえています。",
    eye: "1色で順子ができたら、残り2色にも同じ数字がないか見る",
    groups: [
      { tiles: ["man3", "man4", "man5"], target: true },
      { tiles: ["pin3", "pin4", "pin5"], target: true },
      { tiles: ["sou3", "sou4"], target: true },
      { tiles: ["man7", "man8", "man9"] },
      { tiles: ["ji1", "ji1"] }
    ],
    winningTile: "sou5",
    winningTarget: true
  },
  {
    number: 3,
    time: "2:05",
    name: "一気通貫",
    reading: "イッキツウカン",
    han: "門前2翻・副露1翻",
    openRule: "鳴いても成立",
    condition: "1種類の数牌で123・456・789をそろえます。手牌に同じ色の端から端までが多いときに狙えます。",
    eye: "同じ色に123・456・789のどれがあり、どれが足りないかを見る",
    groups: [
      { tiles: ["man1", "man2", "man3"], target: true },
      { tiles: ["man4", "man5", "man6"], target: true },
      { tiles: ["man7", "man8"], target: true },
      { tiles: ["pin2", "pin3", "pin4"] },
      { tiles: ["ji1", "ji1"] }
    ],
    winningTile: "man9",
    winningTarget: true
  },
  {
    number: 4,
    time: "2:37",
    name: "対々和",
    reading: "トイトイ",
    han: "2翻",
    openRule: "鳴いても成立",
    condition: "4つの面子をすべて刻子にします。対子が多く、ポンしても役が残る手で狙いやすい役です。",
    eye: "順子よりも、同じ牌2枚の対子が複数ある手を意識する",
    groups: [
      { tiles: ["man2", "man2", "man2"], target: true },
      { tiles: ["pin5", "pin5", "pin5"], target: true },
      { tiles: ["sou8", "sou8", "sou8"], target: true },
      { tiles: ["ji7", "ji7", "ji7"], target: true, open: true },
      { tiles: ["ji1"] }
    ],
    winningTile: "ji1"
  },
  {
    number: 5,
    time: "3:05",
    name: "混一色",
    reading: "ホンイツ",
    han: "門前3翻・副露2翻",
    openRule: "鳴いても成立",
    condition: "萬子・筒子・索子のうち1種類だけと、字牌で手を作ります。色が偏った配牌で打点を上げやすい役です。",
    eye: "数牌が1種類に寄り、字牌も対子や刻子として使えそうかを見る",
    groups: [
      { tiles: ["man1", "man2", "man3"], target: true },
      { tiles: ["man3", "man4", "man5"], target: true },
      { tiles: ["man7", "man7", "man7"], target: true },
      { tiles: ["ji7", "ji7", "ji7"], target: true, open: true },
      { tiles: ["ji1"], target: true }
    ],
    winningTile: "ji1",
    winningTarget: true,
    wholeTarget: true
  },
  {
    number: 6,
    time: "3:31",
    name: "清一色",
    reading: "チンイツ",
    han: "門前6翻・副露5翻",
    openRule: "鳴いても成立",
    condition: "字牌を使わず、萬子・筒子・索子のうち1種類だけで手を作ります。高打点ですが、待ちが複雑になりやすい役です。",
    eye: "手牌の大半が同じ色なら、他の色と字牌を整理できるか考える",
    groups: [
      { tiles: ["man1", "man2", "man3"], target: true },
      { tiles: ["man3", "man4", "man5"], target: true },
      { tiles: ["man6", "man7", "man8"], target: true },
      { tiles: ["man9", "man9", "man9"], target: true },
      { tiles: ["man5"], target: true }
    ],
    winningTile: "man5",
    winningTarget: true,
    wholeTarget: true
  },
  {
    number: 7,
    time: "4:08",
    name: "混全帯么九",
    reading: "チャンタ",
    han: "門前2翻・副露1翻",
    openRule: "鳴いても成立",
    condition: "4面子と雀頭のすべてに、1・9・字牌のどれかを含めます。順子が少なくとも1組必要です。",
    eye: "完成した5つの組を見て、すべてに端の牌か字牌が入っているか確認する",
    groups: [
      { tiles: ["man1", "man2", "man3"], target: true },
      { tiles: ["pin7", "pin8", "pin9"], target: true },
      { tiles: ["sou1", "sou1", "sou1"], target: true },
      { tiles: ["sou9", "sou9", "sou9"], target: true },
      { tiles: ["ji1"], target: true }
    ],
    winningTile: "ji1",
    winningTarget: true,
    wholeTarget: true
  },
  {
    number: 8,
    time: "4:47",
    name: "純全帯么九",
    reading: "ジュンチャン",
    han: "門前3翻・副露2翻",
    openRule: "鳴いても成立",
    condition: "チャンタから字牌をなくし、4面子と雀頭のすべてに1か9を含めます。こちらも順子が少なくとも1組必要です。",
    eye: "チャンタの形が見えたら、字牌を使わず数牌だけで完成できるか考える",
    groups: [
      { tiles: ["man1", "man2", "man3"], target: true },
      { tiles: ["man7", "man8", "man9"], target: true },
      { tiles: ["pin1", "pin2", "pin3"], target: true },
      { tiles: ["sou9", "sou9", "sou9"], target: true },
      { tiles: ["pin1"], target: true }
    ],
    winningTile: "pin1",
    winningTarget: true,
    wholeTarget: true
  },
  {
    number: 9,
    time: "5:18",
    name: "三暗刻",
    reading: "サンアンコウ",
    han: "2翻",
    openRule: "3組は鳴かずに作る",
    condition: "自分で集めた刻子を3組作ります。ほかの1面子を鳴いても成立しますが、対象の3刻子は暗刻である必要があります。",
    eye: "手牌の中に同じ牌3枚が増えてきたら、暗刻が何組あるか数える",
    groups: [
      { tiles: ["man2", "man2", "man2"], target: true },
      { tiles: ["pin5", "pin5", "pin5"], target: true },
      { tiles: ["sou8", "sou8", "sou8"], target: true },
      { tiles: ["man3", "man4", "man5"] },
      { tiles: ["ji1"] }
    ],
    winningTile: "ji1"
  },
  {
    number: 10,
    time: "6:42",
    name: "七対子",
    reading: "チートイツ",
    han: "2翻・25符固定",
    openRule: "門前のみ",
    condition: "異なる対子を7組そろえる、4面子1雀頭とは別のアガリ形です。対子が多い手から狙えます。",
    eye: "配牌や序盤で対子が4組以上あり、刻子より対子のまま残したい形かを見る",
    groups: [
      { tiles: ["man1", "man1"], target: true },
      { tiles: ["man3", "man3"], target: true },
      { tiles: ["pin5", "pin5"], target: true },
      { tiles: ["pin7", "pin7"], target: true },
      { tiles: ["sou2", "sou2"], target: true },
      { tiles: ["sou6", "sou6"], target: true },
      { tiles: ["ji7"], target: true }
    ],
    winningTile: "ji7",
    winningTarget: true,
    wholeTarget: true
  }
];

function Tile({ tile }: { tile: string }) {
  return <img src={`/tiles/${tile}-66-90-l-emb.png`} alt={tileNames[tile] ?? tile} />;
}

function YakuHand({ guide }: { guide: YakuGuide }) {
  return (
    <div className={`scoringYakuHand${guide.wholeTarget ? " isWholeTarget" : ""}`} aria-label={`${guide.name}の14枚の牌姿`}>
      <div className="scoringYakuConcealed">
        {guide.groups.map((group, groupIndex) => (
          <div
            key={`${guide.name}-${groupIndex}`}
            className={`scoringYakuTileGroup${group.target ? " isTarget" : ""}${group.open ? " isOpen" : ""}`}
          >
            {group.open && <span className="scoringYakuOpenLabel">副露</span>}
            {group.tiles.map((tile, tileIndex) => <Tile key={`${tile}-${tileIndex}`} tile={tile} />)}
          </div>
        ))}
      </div>
      <span className="scoringYakuPlus">＋</span>
      <div className={`scoringYakuWinning${guide.winningTarget ? " isTarget" : ""}`}>
        <span>アガリ牌</span>
        <Tile tile={guide.winningTile} />
      </div>
    </div>
  );
}

export default function ImportantYakuForHigherScoresArticlePage() {
  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト"><Link href="/">トップ</Link><span>›</span><Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span><span>基本役の次に覚えたい10役</span></nav>
          <p className="siteEyebrow">VIDEO GUIDE / 役・打点</p>
          <h1>アガれるようになった次に覚えたい、打点を伸ばす10役</h1>
          <p className="videoArticleLead">リーチ・タンヤオ・役牌でアガれるようになったら、次は手牌の中にある「役の種」を見つける段階です。9分27秒の動画と14枚の牌姿を使い、実戦で狙いを持って手を進めるための10役を確認します。</p>
          <div className="videoArticleByline"><span>紹介動画: クリアレインのアトリエ【麻雀解説】</span><time>動画公開日 2022年1月22日</time><span>約12分で読める</span></div>
        </header>

        <div className="videoArticleEmbed">
          <iframe
            src="https://www.youtube-nocookie.com/embed/XOTTtJaRGQs"
            title="【麻雀】基本役を覚えた初心者が次に覚えるべき役【10選】"
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
            <li>基本のアガリ方とリーチ・タンヤオ・役牌を覚えた人</li>
            <li>毎回リーチだけになり、手牌からほかの役を見つけられない人</li>
            <li>速さを大きく落とさず、1翻・2翻を上乗せしたい人</li>
            <li>鳴くと翻数が下がる役、鳴くと消える役を整理したい人</li>
          </ul>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">FIRST STEP</p>
          <h2>役は完成してから探すのではなく、途中の手牌で気づく</h2>
          <p>10役を一度に暗記する必要はありません。順子が似ている、同じ色に偏っている、対子や刻子が多い、1・9が面子に絡んでいる。この4つの特徴に気づければ、狙える役の候補をかなり絞れます。</p>
          <div className="strategyKeyMessage"><strong>大切なのは、役のために無理な牌を残すことではありません。</strong>自然にそろいそうな役へ寄せ、アガリやすさを大きく落とさず打点を上乗せすることです。</div>
          <div className="scoringYakuSignals" aria-label="役を見つける4つの手がかり">
            <div><b>順子を見る</b><span>一盃口・三色同順・一気通貫</span></div>
            <div><b>刻子と色を見る</b><span>対々和・混一色・清一色・三暗刻</span></div>
            <div><b>1・9を見る</b><span>チャンタ・ジュンチャン</span></div>
            <div><b>対子を見る</b><span>七対子</span></div>
          </div>
        </section>

        <section className="videoArticleBodySection scoringYakuSection">
          <p className="videoArticleSectionLabel">TEN YAKU</p>
          <h2>14枚の牌姿で覚える、次の10役</h2>
          <p className="scoringYakuLegend"><span></span>緑の枠が役の成立に注目する部分です。右端のアガリ牌を加えて14枚になります。</p>
          <div className="scoringYakuGrid">
            {yakuGuides.map((guide) => {
              const seconds = guide.time.split(":").reduce((total, value) => total * 60 + Number(value), 0);
              return (
                <section key={guide.number} className="scoringYakuCard">
                  <header>
                    <span className="scoringYakuNumber">{guide.number}</span>
                    <div><p>{guide.reading}</p><h3>{guide.name}</h3></div>
                    <div className="scoringYakuBadges"><span>{guide.han}</span><span>{guide.openRule}</span></div>
                  </header>
                  <p>{guide.condition}</p>
                  <YakuHand guide={guide} />
                  <div className="meldShapePoint"><strong>見るポイント:</strong> {guide.eye}</div>
                  <a href={`${videoUrl}&t=${seconds}s`} target="_blank" rel="noopener noreferrer">{guide.time}から動画で確認する</a>
                </section>
              );
            })}
          </div>
        </section>

        <section className="videoArticleCaution scoringYakuCaution">
          <p className="videoArticleSectionLabel">IMPORTANT</p>
          <h2>鳴く前に、翻数が下がるか・役が消えるかを確認する</h2>
          <p>一盃口と七対子は門前だけの役なので、鳴くと成立しません。三色同順・一気通貫・混一色・清一色・チャンタ・ジュンチャンは鳴いても成立しますが、1翻下がります。対々和は鳴いても2翻のままです。</p>
          <p>三暗刻は、役の対象になる3つの刻子を自分で集める必要があります。ほかの1面子を鳴くことはできますが、暗刻にしたい組をポンしないようにします。</p>
        </section>

        <section className="videoArticleBodySection scoringYakuPractice">
          <p className="videoArticleSectionLabel">PRACTICE</p>
          <h2>次の対局では、1局に1つだけ役の種を探す</h2>
          <p>最初は「三色があるか」「同じ色に寄っているか」のどちらか1つを見るだけで十分です。全部を追うより、1つの視点を繰り返したほうが実戦で早く見つけられるようになります。</p>
          <div className="strategyActionBox"><b>おすすめの順番</b><p>一盃口・三色同順・一気通貫 → 対々和・七対子 → 混一色・清一色 → チャンタ・ジュンチャン・三暗刻の順で牌姿に慣れましょう。</p></div>
          <p>ここに載せた牌姿は役の形を見つけるための一例です。複数の役が重なる場合もあるため、実際の翻数は役一覧や役判定問題で確認してください。</p>
        </section>

        <section className="videoArticleNext">
          <p className="videoArticleSectionLabel">NEXT STEP</p>
          <h2>役を牌姿で復習して、問題で見つける</h2>
          <div>
            <Link href="/rules/yaku">すべての役を14枚の牌姿で確認する</Link>
            <Link href="/rules/frequent-yaku">実戦でよく見る役を先に覚える</Link>
            <Link href="/training/yaku-quiz">役判定クイズで見つける練習をする</Link>
            <Link href="/videos/strategy">ほかの麻雀戦術動画を見る</Link>
          </div>
        </section>
        <ClearRainBasicTheoryBook
          heading="役を覚えたら、打点と速度を比べて選ぶ"
          description="役を作るだけでなく、手を遅くしすぎずに打点を伸ばす考え方が実戦では大切です。手作り、鳴き、押し引きをつないで、役を生かす判断を学べます。"
        />
      </article>
    </main>
  );
}

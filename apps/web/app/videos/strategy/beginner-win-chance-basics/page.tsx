import type { Metadata } from "next";
import Link from "next/link";
import { ClearRainBasicTheoryBook } from "../../../components/VideoBookRecommendation";

export const metadata: Metadata = {
  title: "麻雀初心者が上級者に勝つ確率を上げる4つの基本 | 実戦判断の入門",
  description: "麻雀初心者が先に覚えたい、手作りの速度と打点、押し引き、リーチ判断、鳴き判断の基本を動画と牌図で解説します。"
};

const videoUrl = "https://www.youtube.com/watch?v=Rgs6FHdKXvU";

const tileNames: Record<string, string> = {
  man2: "二萬", man3: "三萬", man4: "四萬", man5: "五萬", man6: "六萬", man7: "七萬",
  pin2: "二筒", pin3: "三筒", pin4: "四筒", pin5: "五筒", pin6: "六筒", pin7: "七筒",
  sou2: "二索", sou3: "三索", sou4: "四索", sou5: "五索", sou6: "六索", sou7: "七索", sou8: "八索", sou9: "九索",
  ji5: "發", ji7: "中"
};

type WinChanceBlock = {
  label: string;
  tiles: string[];
  strong?: boolean;
};

type WinChancePrinciple = {
  number: number;
  time: string;
  title: string;
  summary: string;
  action: string;
  caution: string;
  href: string;
  blocks: WinChanceBlock[];
};

const principles: WinChancePrinciple[] = [
  {
    number: 1,
    time: "00:55",
    title: "速さだけ、打点だけに寄せすぎない",
    summary: "アガリやすさだけを求めると安い手が増え、打点だけを求めるとテンパイが遠くなります。配牌から役を決め打ちせず、手が進む牌を残しながら打点の種も見ます。",
    action: "まず両面や連続形を残す。ドラ・赤牌・役牌など、手を遅くしすぎず使える打点の種を確認する。",
    caution: "混一色などを狙う価値がある手もあります。大切なのは、毎回同じ役へ向かわず、速度をどれほど落とすかまで比べることです。",
    href: `${videoUrl}&t=55s`,
    blocks: [
      { label: "進みやすい両面", tiles: ["man2", "man3", "pin4", "pin5", "sou6", "sou7"], strong: true },
      { label: "打点の種", tiles: ["ji5", "ji5", "ji7"], strong: false }
    ]
  },
  {
    number: 2,
    time: "03:20",
    title: "相手のリーチに、ノーテンのまま無理をしない",
    summary: "相手が先にリーチしたとき、自分がまだノーテンなら勝負は不利になりやすい状態です。上級者に勝とうとして毎回押すより、まず降りる基準を持つ方が大きな失点を減らせます。",
    action: "ノーテンなら降りることを基本にする。テンパイしているときは、待ち・打点・安全度を比べて押すか決める。",
    caution: "局面、点棒状況、親番、手牌価値によって例外があります。これは迷ったときの初心者向けの出発点です。",
    href: `${videoUrl}&t=200s`,
    blocks: [
      { label: "まだノーテン", tiles: ["man2", "man3", "pin5", "pin6", "sou3", "sou5"], strong: false },
      { label: "相手のリーチ後は安全牌から", tiles: ["ji7"], strong: true }
    ]
  },
  {
    number: 3,
    time: "05:10",
    title: "門前でテンパイしたら、まずリーチを候補にする",
    summary: "初心者のうちは、明確なダマテン理由がなければリーチを基本候補にすると判断が安定します。1翻がつくだけでなく、相手へプレッシャーを与え、ノーテンの相手を降ろす効果もあります。",
    action: "門前テンパイを確認したら、役の有無と待ちを確認する。ダマテンにする理由がなければリーチする。",
    caution: "すでに十分な打点がある、待ち替えを狙う、終盤で状況が特殊など、ダマテンがよい場面もあります。",
    href: `${videoUrl}&t=310s`,
    blocks: [
      { label: "面子", tiles: ["man2", "man3", "man4"] },
      { label: "面子", tiles: ["man3", "man4", "man5"] },
      { label: "面子", tiles: ["pin4", "pin5", "pin6"] },
      { label: "両面", tiles: ["sou7", "sou8"] },
      { label: "雀頭", tiles: ["pin5", "pin5"] },
      { label: "待ち", tiles: ["sou6", "sou9"], strong: true }
    ]
  },
  {
    number: 4,
    time: "06:45",
    title: "鳴く前に、手の速さと打点を2軸で見る",
    summary: "鳴きは手を進めますが、リーチができなくなり、役や打点が減ることがあります。『鳴けるから鳴く』ではなく、今の手が速いか遅いか、高いか安いかを先に分類します。",
    action: "特に『遅くて安い手』は鳴かず、手牌価値が上がる変化を残す。速い手や打点が十分な手は、鳴いてアガリへ近づける選択を検討する。",
    caution: "役牌を鳴いてアガれる権利を確保したい手や、局を流したい点棒状況などでは判断が変わります。",
    href: `${videoUrl}&t=405s`,
    blocks: [
      { label: "鳴く前に役を確認", tiles: ["ji5", "ji5"] },
      { label: "ポンできる牌", tiles: ["ji5"], strong: true }
    ]
  }
];

export default function BeginnerWinChanceBasicsArticlePage() {
  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト"><Link href="/">トップ</Link><span>›</span><Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span><span>上級者と戦うための基本</span></nav>
          <p className="siteEyebrow">VIDEO GUIDE / 実戦判断・勝ち方</p>
          <h1>初心者でも、判断の基準があれば上級者と戦える</h1>
          <p className="videoArticleLead">麻雀は短い勝負なら、初心者が上級者に勝つこともあるゲームです。その勝機を無駄にしないために、手作り・押し引き・リーチ・鳴きで先に持っておきたい判断基準を紹介します。</p>
          <div className="videoArticleByline"><span>紹介動画: クリアレインのアトリエ【麻雀解説】</span><time>動画公開日 2023年4月8日</time><span>約9分で読める</span></div>
        </header>

        <div className="videoArticleEmbed">
          <iframe
            src="https://www.youtube-nocookie.com/embed/Rgs6FHdKXvU"
            title="【麻雀】もっと早く知りたかった！初心者でも上級者に勝てる打ち方"
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
            <li>ルールは覚えたけれど、対局中の判断に自信がない人</li>
            <li>強い相手だと、必要以上に押したり消極的になったりする人</li>
            <li>リーチや鳴きを、その場の気分で決めている人</li>
            <li>麻雀を学ぶ順番を整理したい人</li>
          </ul>
        </section>

        <section className="videoArticleBodySection winChancePremise">
          <p className="videoArticleSectionLabel">FIRST PREMISE</p>
          <h2>運があるからこそ、基本判断で差を小さくできる</h2>
          <p>一局・半荘のような短い勝負では、配牌やツモの差が結果を大きく動かします。だから初心者にも勝機があります。ただし、運が来たときに手を遅くしすぎる、不要な放銃をする、アガれる手をリーチしないと、その勝機を自分で減らしてしまいます。</p>
          <p className="strategyKeyMessage"><strong>目標は「毎回勝つ」ではなく、迷ったときの大きなミスを減らすこと。</strong>4つの基準を持つと、格上相手でも自分の手をきちんと戦わせやすくなります。</p>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">FOUR BASICS</p>
          <h2>先に覚えたい4つの実戦判断</h2>
          <div className="videoPrincipleList">
            {principles.map((principle) => (
              <section key={principle.number} className="videoPrinciple winChancePrinciple">
                <div className="videoPrincipleNumber">{principle.number}</div>
                <div className="videoPrincipleBody">
                  <span className="videoChapterTime">{principle.time} から</span>
                  <h3>{principle.title}</h3>
                  <p>{principle.summary}</p>
                  <div className="strategyActionBox"><b>対局中の基準</b><p>{principle.action}</p></div>
                  <div className="videoArticleTileBlocks">
                    {principle.blocks.map((block, index) => (
                      <div className={block.strong ? "isStrong" : ""} key={`${principle.number}-${index}`}>
                        <span>{block.label}</span>
                        <div>{block.tiles.map((tile, tileIndex) => <img key={`${tile}-${tileIndex}`} src={`/tiles/${tile}-66-90-l-emb.png`} alt={tileNames[tile] ?? tile} />)}</div>
                      </div>
                    ))}
                  </div>
                  {principle.number === 4 ? (
                    <div className="callDecisionMatrix" aria-label="鳴き判断の目安">
                      <div className="callDecisionAxis">打点が高い</div>
                      <div className="isConsider"><b>遅くて高い</b><span>鳴きを検討</span></div>
                      <div className="isGo"><b>速くて高い</b><span>鳴いて進めやすい</span></div>
                      <div className="callDecisionAxis">打点が安い</div>
                      <div className="isStop"><b>遅くて安い</b><span>基本は鳴かない</span></div>
                      <div className="isConsider"><b>速くて安い</b><span>局面により鳴く</span></div>
                    </div>
                  ) : null}
                  <p className="reachReadingCaution">※ {principle.caution}</p>
                  <a href={principle.href} target="_blank" rel="noopener noreferrer">この判断を動画の該当箇所から見る</a>
                </div>
              </section>
            ))}
          </div>
        </section>

        <section className="videoArticleCaution winChancePracticeBox">
          <p className="videoArticleSectionLabel">PRACTICE</p>
          <h2>次の対局では、4つ全部を完璧にしなくていい</h2>
          <p>まずは「相手がリーチしたら、自分がテンパイか確認する」だけでも十分です。慣れたら、門前テンパイでリーチを候補にする、鳴く前に速さと打点を言葉にする、と1つずつ増やします。</p>
          <p>勝敗ではなく、決めた基準を使えたかを振り返りましょう。正しい判断でも負ける局はありますが、同じ判断を積み重ねるほど長期の成績は安定しやすくなります。</p>
        </section>

        <ClearRainBasicTheoryBook />

        <section className="videoArticleNext">
          <p className="videoArticleSectionLabel">NEXT STEP</p>
          <h2>4つの判断を個別に深める</h2>
          <div>
            <Link href="/videos/strategy/tile-efficiency-four-rules">牌効率の4法則で手作りを学ぶ</Link>
            <Link href="/videos/strategy/betaori-three-principles">ベタオリの基本判断を学ぶ</Link>
            <Link href="/videos/strategy/common-bad-habits-self-check">自分の打ち方の癖を確認する</Link>
            <Link href="/learn/calling">鳴きの基本を復習する</Link>
            <Link href="/trainer">麻雀トレーニングで判断を試す</Link>
          </div>
        </section>
      </article>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "麻雀の受け入れと変化｜何切るで優先する牌効率の基本",
  description: "麻雀初心者向けに、シャンテン数が進む受け入れと、形だけが良くなる変化の違いを牌姿で比較し、何切るの優先順位を解説します。"
};

const videoUrl = "https://www.youtube.com/watch?v=GJ91P8Tbhh0";
const tileNames: Record<string, string> = {
  man1: "一萬", man2: "二萬", man3: "三萬", man4: "四萬", man5: "五萬", man6: "六萬", man7: "七萬", man8: "八萬", man9: "九萬",
  pin1: "一筒", pin2: "二筒", pin3: "三筒", pin4: "四筒", pin5: "五筒", pin6: "六筒", pin7: "七筒",
  sou2: "二索", sou3: "三索", sou4: "四索", sou5: "五索", sou6: "六索", ji4: "北"
};

function TileRow({ tiles }: { tiles: string[] }) {
  return (
    <div className={tiles.length >= 10 ? "videoArticleFullHand" : undefined}>
      {tiles.map((tile, index) => (
        <img key={`${tile}-${index}`} src={`/tiles/${tile}-66-90-l-emb.png`} alt={tileNames[tile]} />
      ))}
    </div>
  );
}

export default function PrioritizeUkeireOverShapeChangePage() {
  return (
    <main className="siteMain videoArticlePage ukeirePriorityPage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト"><Link href="/">トップ</Link><span>›</span><Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span><Link href="/videos/strategy/beginner">初心者向け</Link><span>›</span><span>受け入れを優先する牌効率</span></nav>
          <p className="siteEyebrow">BEGINNER VIDEO GUIDE / 牌効率</p>
          <h1>牌効率は「変化」より「受け入れ」を優先する</h1>
          <p className="videoArticleLead">良い形になりそうな牌を残したのに、なかなかテンパイしない。その原因は、すぐ手が進む「受け入れ」と、形が良くなるだけの「変化」を同じ価値で数えていることかもしれません。</p>
          <div className="videoArticleByline"><span>紹介動画: 平澤元気麻雀ch</span><time>動画公開日 2022年12月3日</time><span>約9分で読める</span></div>
        </header>

        <div className="videoArticleEmbed"><iframe src="https://www.youtube-nocookie.com/embed/GJ91P8Tbhh0" title="変化と受け入れを区別する牌効率講座" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div>
        <p className="videoSourceNote">動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">元動画をYouTubeで見る</a></p>

        <section className="videoArticleAudience">
          <div><p className="videoArticleSectionLabel">RECOMMENDED FOR</p><h2>この動画はこんな人に向いています</h2></div>
          <ul><li>良形変化を期待して孤立牌を残しすぎる人</li><li>「引いて嬉しい牌」をすべて受け入れと数えている人</li><li>両面を作ること自体が目的になっている人</li><li>何切るの枚数比較を一段深く理解したい人</li></ul>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">TWO TYPES</p><h2>引いて嬉しい牌には2種類ある</h2>
          <div className="videoPrincipleList">
            <div className="videoPrinciple"><span className="videoPrincipleNumber">1</span><div className="videoPrincipleBody"><h3>受け入れ</h3><p>引いた後にシャンテン数が進む牌です。一向聴なら、引いてテンパイになる牌を指します。</p></div></div>
            <div className="videoPrinciple"><span className="videoPrincipleNumber">2</span><div className="videoPrincipleBody"><h3>変化</h3><p>シャンテン数は同じままでも、カンチャンが両面になるなど、次の受け入れや待ちを良くする牌です。</p></div></div>
          </div>
          <div className="strategyKeyMessage"><strong>初心者の基本:</strong> まず受け入れ枚数が多くなる打牌を選び、その差が小さいときに変化や打点を比べます。</div>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">PRACTICAL HAND</p><h2>899萬・北北と35索を比べる</h2>
          <div className="videoArticleTileBlocks">
            <div className="fullHandBlock"><span>比較する13枚の形</span><TileRow tiles={["pin1", "pin2", "pin3", "pin4", "pin5", "pin6", "man8", "man9", "man9", "ji4", "ji4", "sou3", "sou5"]} /></div>
            <div className="isStrong"><span>899萬・北北</span><TileRow tiles={["man8", "man9", "man9", "ji4", "ji4"]} /></div>
            <div className="isWeak"><span>35索</span><TileRow tiles={["sou3", "sou5"]} /></div>
          </div>
          <p>この手では、完成している2面子を除くと「899萬・北北」と「35索」の比較になります。35索は良形へ変わる可能性が目につきますが、先に直接の受け入れを数えます。</p>
          <div className="terminalChoiceComparison">
            <div className="isStrong"><span>899萬・北北の受け入れ</span><TileRow tiles={["man7", "man9", "ji4"]} /><b>七萬4枚＋九萬2枚＋北2枚＝8枚</b></div>
            <div><span>35索の受け入れ</span><TileRow tiles={["sou4"]} /><b>四索4枚</b></div>
            <div><span>35索の良形変化</span><TileRow tiles={["sou2", "sou6"]} /><b>二索・六索は嬉しいが、まだテンパイしない</b></div>
          </div>
          <p>二索や六索を引けば両面を作れます。しかし、それは次に面子を作りやすくする変化です。今すぐテンパイへ進む8枚を減らしてまで、変化を優先しないのが基本になります。</p>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">WHY RYANMEN IS GOOD</p><h2>両面は「作ること」ではなく「面子を完成させやすい」から強い</h2>
          <div className="videoArticleTileBlocks">
            <div className="isStrong"><span>両面56筒</span><TileRow tiles={["pin5", "pin6"]} /></div>
            <div className="isStrong"><span>四筒・七筒で面子</span><TileRow tiles={["pin4", "pin7"]} /></div>
            <div className="isWeak"><span>カンチャン46萬</span><TileRow tiles={["man4", "man6"]} /></div>
            <div><span>五萬だけで面子</span><TileRow tiles={["man5"]} /></div>
          </div>
          <p>両面が良いのは、2種類の牌で面子が完成するからです。両面を新しく作るために、すでに多くある「今すぐ面子やテンパイへ進む牌」を減らしては、目的と手段が逆になります。</p>
          <div className="strategyActionBox"><strong>最終目標を忘れない</strong><p>麻雀の目的は両面をたくさん持つことではなく、4面子1雀頭のアガリ形を早く完成させることです。</p></div>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">THREE STEPS</p><h2>何切るではこの順番で比べる</h2>
          <div className="videoPrincipleList">
            <div className="videoPrinciple"><span className="videoPrincipleNumber">1</span><div className="videoPrincipleBody"><h3>現在のシャンテン数を確認する</h3><p>一向聴なのか二向聴なのかが分からないと、受け入れを正しく数えられません。</p></div></div>
            <div className="videoPrinciple"><span className="videoPrincipleNumber">2</span><div className="videoPrincipleBody"><h3>シャンテン数が進む牌だけを数える</h3><p>変化の牌をいったん外し、直接進む種類と残り枚数を打牌ごとに比べます。</p></div></div>
            <div className="videoPrinciple"><span className="videoPrincipleNumber">3</span><div className="videoPrincipleBody"><h3>受け入れ差の後に形と打点を見る</h3><p>枚数が近いときに、両面変化、役、ドラ、安全度などを加えて判断します。</p></div></div>
          </div>
        </section>

        <section className="videoArticleCaution">
          <p className="videoArticleSectionLabel">ADVANCED EXCEPTION</p><h2>受け入れより打点や待ちを優先する例外もある</h2>
          <p>愚形のリーチのみを避けてタンヤオや平和を狙う場面では、受け入れを少し減らして良形変化を残すことがあります。ただし、これは直接の受け入れを把握したうえで、打点や待ちの価値を上乗せする応用判断です。</p>
          <p>初心者のうちは例外を先に真似せず、「受け入れを最大にするなら何を切るか」を説明できるようにしてから進めば十分です。</p>
        </section>

        <section className="videoArticleNext">
          <p className="videoArticleSectionLabel">NEXT STEP</p><h2>受け入れを実際の手牌で比べる</h2>
          <div><Link href="/videos/strategy/ukeire-vs-shape-change-basics">受け入れと手変わりの基礎を復習する</Link><Link href="/analysis/mahjong-tool">牌理チェッカーで受け入れを比較する</Link><Link href="/videos/strategy/tile-efficiency-four-rules">初心者向け牌効率の4法則へ進む</Link></div>
        </section>
      </article>
    </main>
  );
}

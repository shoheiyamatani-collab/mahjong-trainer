import VideoPracticeGateway from "../VideoPracticeGateway";
import { VideoReadingTime } from "../VideoReadingTime";
import type { Metadata } from "next";
import { getRobotsPolicy } from "@mahjong-trainer/content-index-policy";
import Link from "next/link";
import { VideoArticleCompactContent } from "../VideoArticleCompactContent";
import { TileStrip } from "../../../components/TileFigures";
import { getPairReviewExample } from "../videoReviewExamples";
import reviewStyles from "../video-review.module.css";

export const metadata: Metadata = {
  alternates: { canonical: "/videos/strategy/tile-efficiency-four-rules" },
  robots: getRobotsPolicy("/videos/strategy/tile-efficiency-four-rules"),
  title: "麻雀初心者が覚えたい牌効率の4法則 | 動画の見どころを解説",
  description: "発男道場の初心者向け牌効率動画を紹介。対子候補をいくつ残すか、6ブロックをどう5ブロックへ整理するかを、向いている人と注意点も含めて解説します。"
};

const videoUrl = "https://www.youtube.com/watch?v=q3LPfokscno";

const principles = [
  {
    number: 1,
    title: "対子が3組なら、残す2組を比べる",
    description: "通常形で順子を作るときの目安です。周囲とのつながりを見て、ほぐす候補を比べます。七対子や対々和を狙う手まで、対子を減らすと決めつけません。",
    href: `${videoUrl}&t=106s`,
    blocks: [
      { label: "対子", tiles: ["man2", "man2"] },
      { label: "対子", tiles: ["pin5", "pin5"] },
      { label: "整理候補", tiles: ["sou7", "sou7"], weak: true }
    ]
  },
  {
    number: 2,
    title: "対子が2組なら、雀頭の残り方を見る",
    description: "片方が刻子になった後も、もう片方を雀頭に使えるのが利点です。ただし、順子との重なりや残り枚数を見ずに、すべての対子を固定するという意味ではありません。",
    href: `${videoUrl}&t=496s`,
    blocks: [
      { label: "雀頭候補", tiles: ["ji5", "ji5"] },
      { label: "刻子候補", tiles: ["man5", "man5"] }
    ]
  },
  {
    number: 3,
    title: "6ブロックなら、余る候補を比べる",
    description: "完成に使うのは4面子と雀頭です。候補が余ったら、どれを残すと受け入れが広いかを比較します。ブロックの名前だけでなく、打牌後のシャンテン数も確認します。",
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
    title: "5ブロックなら、必要な候補を守る",
    description: "必要な候補を外すと、作り直しが必要になる場合があります。これは速度を考える基準であり、守備や打点のために形を変える選択まで否定するものではありません。",
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
  const example = getPairReviewExample();
  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト"><Link href="/">トップ</Link><span>›</span><Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span><span>牌効率</span></nav>
          <p className="siteEyebrow">VIDEO GUIDE / 牌効率</p>
          <h1>麻雀初心者が覚えたい牌効率の4法則</h1>
          <p className="videoArticleLead">何切るで迷ったときに、対子候補とブロック数を数えて手牌を整理する考え方を学べる動画です。動画の内容と、見る前に知っておきたいポイントを初心者向けにまとめます。</p>
          <div className="videoArticleByline"><span>紹介動画: 発男道場【麻雀解説ch】</span><time>動画公開日 2024年1月9日</time><VideoReadingTime articleHref="/videos/strategy/tile-efficiency-four-rules" /></div>
        </header>

        <div className="videoArticleEmbed">
          <iframe
            src="https://www.youtube-nocookie.com/embed/q3LPfokscno"
            title="【麻雀解説】覚えると勝ち組！牌効率の法則（初心者向け）"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen loading="lazy" />
        </div>
        <p className="videoSourceNote">動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">発男道場【麻雀解説ch】の元動画をYouTubeで見る</a></p>

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

        <VideoArticleCompactContent
          message={"何切るで迷ったときに、対子候補とブロック数を数えて手牌を整理する考え方を学べる動画です。"}
          points={[
            { title: "動画で学べること", description: "中心となる考え方は、手牌を「対子候補」と「ブロック」に分けて数えることです。" },
            { title: "初心者が覚えたい4つの基準", description: "対子の数とブロック数を使うと、切る候補を整理しやすくなります。" },
            { title: "牌効率は「最速」を考える基準です", description: "この4法則は、テンパイまでの速さと受け入れを考えるための基本です。" },
          ]}
        />

        <section className="videoArticleBodySection" aria-labelledby="four-rules-review-title">
          <h2 id="four-rules-review-title">4つのテーマを、使う条件と一緒に確認する</h2>
          <p>元動画の公式説明欄で確認した4テーマです。下の説明は雀フォリオが補足した使い方で、すべての局面に通用する絶対的な正解ではありません。時刻のリンクから元の章も確認できます。</p>
          <div className="videoPrincipleList">{principles.map((principle) => (
            <section className="videoPrinciple" key={principle.number}>
              <div className="videoPrincipleNumber">{principle.number}</div>
              <div className="videoPrincipleBody"><h3>{principle.title}</h3><p>{principle.description}</p><a href={principle.href} target="_blank" rel="noopener noreferrer">元動画の該当章へ</a></div>
            </section>
          ))}</div>
        </section>

        <section className="videoArticleBodySection" aria-labelledby="pair-review-title">
          <p className="videoArticleSectionLabel">JONGFOLIO / 独自の比較教材</p>
          <h2 id="pair-review-title">対子を残すだけでは、受け入れが狭くなる例</h2>
          <p>次の14枚は動画の牌姿ではなく、雀フォリオが検証した教材です。副露なし・通常形の進行を対象に、場に見えている牌を入れずに比較します。</p>
          <div className={reviewStyles.hand}><TileStrip tiles={example.tiles} /></div>
          <p>123萬・456筒・88萬・99筒・67索・東東と分けると、面子2組、対子3組、両面候補1組です。9筒を切って対子をほぐす案と、6索を切って対子3組を残す案を比べます。</p>
          <table className={reviewStyles.table}>
            <caption>同じ14枚から切った直後の比較</caption>
            <thead><tr><th scope="col">打牌</th><th scope="col">進行</th><th scope="col">受け入れ</th></tr></thead>
            <tbody>{example.choices.map((row) => <tr key={row.discard}><th scope="row">{row.discard === "9p" ? "9筒" : "6索"}</th><td>{row.afterDiscardShanten}シャンテン</td><td>{row.ukeireTypes}種・{row.ukeireTiles}枚</td></tr>)}</tbody>
          </table>
          <p>9筒切りでは8萬・東が各2枚、5索・8索が各4枚で計12枚。6索切りでは8萬・9筒・東が各2枚で計6枚です。同じ一向聴でも、次の一枚でテンパイする範囲が違います。</p>
          <p>これは二候補の比較であり、9筒をどの状況でも切るという結論ではありません。東の役牌価値、他家のリーチ、公開牌、七対子・国士無双や将来の手変わりは別に確認します。受け入れ枚数を和了率や期待値として読むこともできません。</p>
          <div className="toolGuideLinks"><a href={example.href}>この14枚を牌理チェッカーで比較する</a><Link href="/learn/guides/five-block-theory">5ブロック理論の詳しい解説</Link></div>
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

        <VideoPracticeGateway articleHref="/videos/strategy/tile-efficiency-four-rules" />

</article>
    </main>
  );
}

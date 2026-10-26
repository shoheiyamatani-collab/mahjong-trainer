import VideoPracticeGateway from "../VideoPracticeGateway";
import { VideoReadingTime } from "../VideoReadingTime";
import type { Metadata } from "next";
import { getRobotsPolicy } from "@mahjong-trainer/content-index-policy";
import Link from "next/link";
import { VideoArticleCompactContent } from "../VideoArticleCompactContent";
import { countsToTiles } from "@mahjong-trainer/mahjong-core";
import { TileStrip, tileAssetName } from "../../../components/TileFigures";
import { getBlockComparisonExample } from "./blockExample";
import exampleStyles from "../../../tools/tool-learning.module.css";

export const metadata: Metadata = {
  alternates: { canonical: "/videos/strategy/block-count-approach" },
  robots: getRobotsPolicy("/videos/strategy/block-count-approach"),
  title: "麻雀はブロック数で打ち方が変わる｜4・5・6ブロックの牌効率",
  description: "麻雀中級者向けに、4・5・6ブロックで打牌方針をどう変えるかを短い要点で解説。ブロックを増やす、維持する、弱い形を減らす判断を整理します。"
};

const videoUrl = "https://www.youtube.com/watch?v=-DqvQsmOdew";

const tileNames: Record<string, string> = {
  man2: "二萬", man3: "三萬", man4: "四萬", man6: "六萬", man7: "七萬", man8: "八萬",
  pin2: "二筒", pin3: "三筒", pin4: "四筒", pin5: "五筒", pin6: "六筒", pin7: "七筒",
  sou2: "二索", sou3: "三索", sou4: "四索", sou5: "五索", sou6: "六索",
  ji7: "中"
};

function TileRow({ tiles }: { tiles: string[] }) {
  return (
    <div>
      {tiles.map((tile, index) => (
        <img key={`${tile}-${index}`} src={`/tiles/${tile}-66-90-l-emb.png`} alt={tileNames[tile] ?? tile} />
      ))}
    </div>
  );
}

export default function BlockCountApproachPage() {
  const example = getBlockComparisonExample();
  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト">
            <Link href="/">トップ</Link><span>›</span>
            <Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span>
            <Link href="/videos/strategy/advanced">中級者以上向け</Link><span>›</span>
            <span>ブロック別の打ち方</span>
          </nav>
          <p className="siteEyebrow">INTERMEDIATE VIDEO GUIDE / 牌効率・ブロック数</p>
          <h1>麻雀はブロック数で打ち方が変わる｜4・5・6ブロックの考え方</h1>
          <p className="videoArticleLead">ターツの強さだけを比べても、正しい打牌を選べないことがあります。まず手牌が何ブロックあるかを数え、「増やす・維持する・減らす」のどれが必要かを決めましょう。</p>
          <div className="videoArticleByline"><span>紹介動画: 発男道場【麻雀解説ch】</span><time>動画公開日 2026年4月8日</time><VideoReadingTime articleHref="/videos/strategy/block-count-approach" /></div>
        </header>

        <div className="videoArticleEmbed">
          <iframe
            src="https://www.youtube-nocookie.com/embed/-DqvQsmOdew"
            title="【麻雀解説】麻雀はブロックの数で打ち方が変わる！ブロック別のアプローチ方法"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen loading="lazy" />
        </div>
        <p className="videoSourceNote">動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">発男道場【麻雀解説ch】の元動画をYouTubeで見る</a></p>

        <section className="videoArticleAudience">
                  <div><p className="videoArticleSectionLabel">RECOMMENDED FOR</p><h2>この動画はこんな人に向いています</h2></div>
                  <ul>
                    <li>ターツの強弱は分かるのに何切るで迷う人</li>
                    <li>5ブロック理論を実戦で使いたい人</li>
                    <li>孤立牌を残す理由を説明できるようになりたい人</li>
                    <li>6ブロックから落とす形を選べない人</li>
                  </ul>
                </section>

        <VideoArticleCompactContent
          message={"ターツの強さだけを比べても、正しい打牌を選べないことがあります。"}
          points={[
            { title: "4ブロックは、孤立牌から5つ目を作る", description: "完成に必要な5ブロックへ1つ足りない状態です。" },
            { title: "5ブロックは、必要な形を崩さず維持する", description: "アガリに必要なブロック数がそろっています。" },
            { title: "6ブロックは、残す5つを比較する", description: "面子やターツなどの候補が多いときは、弱い候補を外す案を比べます。数だけで決めず、雀頭の確保と受け入れも確認します。" },
          ]}
        />

        <section className="videoArticleBodySection" aria-labelledby="block-example-title">
          <p className="videoArticleSectionLabel">JONGFOLIO / 独自の比較教材</p>
          <h2 id="block-example-title">6ブロックあるとき、何を比べればよい？</h2>
          <p>以下は動画内の牌姿ではなく、当サイトが比較用に用意した14枚です。副露なし・通常形・場に見えている牌を入力しない条件で、既存の牌理チェッカーの計算を使います。</p>
          <div className={exampleStyles.hand}><TileStrip tiles={countsToTiles(example.hand).map((tile) => tileAssetName(tile))} /></div>
          <p>123萬・55萬・456筒・99筒・23索・78索と分けると、面子が2組、対子が2組、両面ターツが2組の6ブロック候補です。完成形は4面子と雀頭の5組なので、すべての候補をそのまま完成させる必要はありません。</p>
          <table className={exampleStyles.comparisonTable}>
            <caption>同じ14枚から一枚切った直後の比較</caption>
            <thead><tr><th scope="col">打牌</th><th scope="col">打牌後</th><th scope="col">受け入れ</th></tr></thead>
            <tbody>{example.choices.map((row) => <tr key={row.discard}>
              <th scope="row">{row.discard === "9p" ? "9筒" : "2索"}</th>
              <td>{row.afterDiscardShanten}シャンテン</td>
              <td>{row.ukeireTypes}種・{row.ukeireTiles}枚</td>
            </tr>)}</tbody>
          </table>
          <p>9筒切りの受け入れは1・4・6・9索の各4枚です。2索切りでは5萬と9筒が各2枚、6索と9索が各4枚になります。両面候補を残すか、対子を残すかによる差を、枚数の内訳から確認できます。</p>
          <p>9筒切りは99筒の対子を、2索切りは23索の両面候補を外し始める一打です。どちらも一枚切っただけなので、残る9筒や3索はまだ手牌にあります。「6ブロックだから対子を切る」と暗記せず、打牌後のシャンテン数と受け入れの違いまで確かめましょう。</p>
          <p>枚数は打牌後の手牌だけを除いた理論値で、公開牌による補正はしていません。七対子・国士無双はこの比較の対象外で、打点・守備・ドラ・今後の良形変化も、この二つの数字だけでは決まりません。</p>
          <div className="toolGuideLinks">
            <a href={example.href}>この14枚を牌理チェッカーで比較する</a>
            <Link href="/learn/guides/five-block-theory">5ブロック理論の解説へ</Link>
          </div>
        </section>

        <section className="videoArticleNext">
                  <p className="videoArticleSectionLabel">NEXT STEP</p>
                  <h2>ブロック数と受け入れを実戦で比べる</h2>
                  <div>
                    <Link href="/analysis/mahjong-tool">牌理チェッカーで受け入れを比較する</Link>
                    <Link href="/videos/strategy/intermediate-tile-efficiency-26-rules">中級牌効率の26セオリーを読む</Link>
                    <Link href="/videos/strategy/safe-tile-and-floating-tile-decisions">安牌と孤立牌の判断基準を読む</Link>
                    <Link href="/videos/strategy/advanced">中級者以上向け動画を見る</Link>
                  </div>
                </section>

        <VideoPracticeGateway articleHref="/videos/strategy/block-count-approach" />

</article>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { VideoArticleCompactContent } from "../VideoArticleCompactContent";

export const metadata: Metadata = {
  title: "全16問で学ぶ麻雀の何切る・牌効率セオリー | 動画解説",
  description: "発男道場の何切る問題16問を紹介。5ブロック理論、対子、二度受け、孤立牌、4連形など、脱初心者に必要な牌効率の見方と動画の活用法を解説します。"
};

const videoUrl = "https://www.youtube.com/watch?v=55ZkWcsgpcs";

const chapters = [
  {
    number: 1,
    time: "00:34",
    title: "まずはブロック数と対子を数える",
    description: "第1問・第2問は、アガリに必要な5ブロックをどう残すか、対子が2組ある形をなぜ大切にするかを確認します。牌を1枚ずつ見る前に、手牌全体を部品へ分ける練習です。",
    href: `${videoUrl}&t=34s`,
    blocks: [
      { label: "面子", tiles: ["man2", "man3", "man4"] },
      { label: "塔子", tiles: ["pin4", "pin5"] },
      { label: "対子1", tiles: ["sou6", "sou6"] },
      { label: "対子2", tiles: ["ji5", "ji5"] }
    ]
  },
  {
    number: 2,
    time: "03:51",
    title: "3対子と飛び対子を整理する",
    description: "第3問から第5問では、対子が3組あるときに、どの組をほぐすかを考えます。44・66・88のような飛び対子は、周囲の牌とのつながりを比べることがポイントです。",
    href: `${videoUrl}&t=231s`,
    blocks: [
      { label: "対子", tiles: ["man4", "man4"] },
      { label: "対子", tiles: ["man6", "man6"] },
      { label: "対子", tiles: ["man8", "man8"] }
    ]
  },
  {
    number: 3,
    time: "08:41",
    title: "二度受けを見つけて受け入れの重複を減らす",
    description: "第6問・第7問は、連続形の中で雀頭を固定する判断と二度受けがテーマです。複数の塔子が同じ牌を必要としていないかを見ると、見た目より狭い形に気づけます。",
    href: `${videoUrl}&t=521s`,
    blocks: [
      { label: "2・5受け", tiles: ["man3", "man4"] },
      { label: "5・8受け", tiles: ["man6", "man7"] },
      { label: "5が重複", tiles: ["man5"], weak: true }
    ]
  },
  {
    number: 4,
    time: "11:18",
    title: "孤立牌とくっつき形の強さを比べる",
    description: "第8問から第11問では、孤立牌を切る順番と、牌がくっついた後の形を比較します。動画では、4連形、中膨れ、亜両面の順に変化の広さを見ていきます。",
    href: `${videoUrl}&t=678s`,
    blocks: [
      { label: "4連形", tiles: ["pin3", "pin4", "pin5", "pin6"] },
      { label: "中膨れ", tiles: ["sou2", "sou3", "sou3", "sou4"] },
      { label: "亜両面", tiles: ["man5", "man6", "man7", "man7"] }
    ]
  },
  {
    number: 5,
    time: "16:32",
    title: "端牌、手役、ドラまで判断材料を広げる",
    description: "第12問から第16問は、両面カンチャンや裏目のフォロー、手役、ドラのスライドまで扱います。最速テンパイだけでなく、打点や変化も含めて一打を選ぶ仕上げの問題です。",
    href: `${videoUrl}&t=992s`,
    blocks: [
      { label: "完成面子", tiles: ["sou2", "sou3", "sou4"] },
      { label: "5へスライド", tiles: ["sou3", "sou4", "sou5"] },
      { label: "ドラを使い切る", tiles: ["sou5"] }
    ]
  }
];

const tileNames: Record<string, string> = {
  man2: "二萬", man3: "三萬", man4: "四萬", man5: "五萬", man6: "六萬", man7: "七萬", man8: "八萬",
  pin3: "三筒", pin4: "四筒", pin5: "五筒", pin6: "六筒",
  sou2: "二索", sou3: "三索", sou4: "四索", sou5: "五索", sou6: "六索", ji5: "發"
};

export default function TileEfficiencyTheoryQuizArticlePage() {
  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト"><Link href="/">トップ</Link><span>›</span><Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span><span>何切る・牌効率</span></nav>
          <p className="siteEyebrow">VIDEO GUIDE / 何切る・牌効率</p>
          <h1>全16問で学ぶ、脱初心者の何切るセオリー</h1>
          <p className="videoArticleLead">牌効率の重要な考え方を、問題を解きながら確認できる動画です。見るだけで終わらせず、自分で一打を選び、答えの理由まで比べるための見どころをまとめます。</p>
          <div className="videoArticleByline"><span>紹介動画: 発男道場【麻雀解説ch】</span><time>動画公開日 2024年10月5日</time><span>約3分で読める</span></div>
        </header>

        <div className="videoArticleEmbed">
          <iframe
            src="https://www.youtube-nocookie.com/embed/55ZkWcsgpcs"
            title="【全16問】脱初心者に必要な何切るのセオリーを問題形式で解説"
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
                    <li>基本の牌効率は読んだけれど、実際の手牌で使えるか試したい人</li>
                    <li>何切る問題で正解を見ても、理由をうまく説明できない人</li>
                    <li>対子を残す基準や二度受け、孤立牌の切り順で迷う人</li>
                    <li>感覚だけでなく、ブロック数を根拠に一打を選びたい人</li>
                  </ul>
                </section>

        <VideoArticleCompactContent
          message={"牌効率の重要な考え方を、問題を解きながら確認できる動画です。"}
          points={[
            { title: "問題が出たら、答えの前で一度止める", description: "牌姿が出たら動画を止め、まず切る牌を1枚選びます。" },
            { title: "16問で確認する5つの重要テーマ", description: "問題ごとに、正解だけでなく切る理由まで確認するのがポイントです。" },
            { title: "正解の牌より「なぜ切るか」を覚える", description: "何切る問題は、同じ牌姿でもドラ、巡目、点数状況、相手の仕掛けによって実戦の選択が変わることがあります。" },
          ]}
        />

        <section className="videoArticleNext">
                  <p className="videoArticleSectionLabel">NEXT STEP</p>
                  <h2>動画の前後に取り組む</h2>
                  <div>
                    <Link href="/videos/strategy/tile-efficiency-four-rules">先に牌効率の4法則を復習する</Link>
                    <Link href="/videos/strategy/isolated-terminal-tile-order">孤立した1・9の切り順を詳しく見る</Link>
                    <Link href="/trainer">何切る問題で同じ考え方を試す</Link>
                    <Link href="/analysis/mahjong-tool">受け入れ枚数チェッカーで一打を比較する</Link>
                  </div>
                </section>

</article>
    </main>
  );
}

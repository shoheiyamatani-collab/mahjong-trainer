import type { Metadata } from "next";
import Link from "next/link";
import { ClearRainBasicTheoryBook } from "../../../components/VideoBookRecommendation";
import { VideoArticleCompactContent } from "../VideoArticleCompactContent";

export const metadata: Metadata = {
  title: "麻雀の点数計算を簡単に覚える方法 | 20・30・40符の見分け方",
  description: "符計算をすべて暗記する前に、門前ツモ・門前ロン・鳴きを20符、30符、40符へ分類する方法を動画と短い要点で解説。親子・翻数・点数表の見方も紹介します。"
};

const videoUrl = "https://www.youtube.com/watch?v=_b8l94mF8P0";

const shortcutRows = [
  { win: "門前ツモ", shape: "平和の形", fu: "20符", note: "平和ツモは20符として見る" },
  { win: "門前ツモ", shape: "平和ではない", fu: "30符", note: "まず30符の列を確認する" },
  { win: "門前ロン", shape: "平和", fu: "30符", note: "門前ロン10符が加わる" },
  { win: "門前ロン", shape: "平和ではない", fu: "40符", note: "よく出る目安として40符を見る" },
  { win: "鳴いた手", shape: "順子中心", fu: "30符", note: "最低30符として点数表を見る" }
];

const tileNames: Record<string, string> = {
  man2: "二萬", man3: "三萬", man4: "四萬", man5: "五萬",
  pin3: "三筒", pin4: "四筒", pin5: "五筒", pin6: "六筒",
  sou3: "三索", sou4: "四索", sou5: "五索", sou6: "六索", sou7: "七索", sou8: "八索", sou9: "九索",
  ji5: "發"
};

type ScoreExampleBlock = {
  label: string;
  tiles: string[];
  weak?: boolean;
  strong?: boolean;
};

type ScoreExample = {
  number: number;
  title: string;
  description: string;
  result: string;
  blocks: ScoreExampleBlock[];
};

const examples: ScoreExample[] = [
  {
    number: 1,
    title: "門前の平和ロンは30符から見る",
    description: "すべて順子、役牌ではない雀頭、両面待ちの平和をロンした形です。門前ロンの10符が加わるため、30符の列を使います。",
    result: "子の2翻なら2000点、3翻なら3900点",
    blocks: [
      { label: "順子", tiles: ["man2", "man3", "man4"] },
      { label: "順子", tiles: ["man3", "man4", "man5"] },
      { label: "順子", tiles: ["pin4", "pin5", "pin6"] },
      { label: "両面", tiles: ["sou7", "sou8"] },
      { label: "雀頭", tiles: ["pin5", "pin5"] },
      { label: "ロン牌", tiles: ["sou6"], strong: true }
    ]
  },
  {
    number: 2,
    title: "同じ平和でもツモなら20符",
    description: "平和を自分でツモった場合は、平和ツモの特例で20符です。動画では、ロンかツモかを最初に分けることで迷いにくくしています。",
    result: "子の2翻ツモなら400・700、3翻なら700・1300",
    blocks: [
      { label: "平和の両面", tiles: ["sou7", "sou8"] },
      { label: "ツモ牌", tiles: ["sou9"], strong: true },
      { label: "確認", tiles: ["pin3", "pin4", "pin5"] }
    ]
  },
  {
    number: 3,
    title: "平和ではない門前ロンは、まず40符を見る",
    description: "役牌の雀頭、カンチャン待ち、刻子などがあると平和にはなりません。よく出る形は40符の列から確認し、符が多くなる部品が目立つときだけ詳しく計算します。",
    result: "子の2翻なら2600点、3翻なら5200点",
    blocks: [
      { label: "役牌の雀頭", tiles: ["ji5", "ji5"], weak: true },
      { label: "カンチャン", tiles: ["sou3", "sou5"], weak: true },
      { label: "アガリ牌", tiles: ["sou4"], strong: true }
    ]
  }
];

export default function EasyScoreCalculationWithoutFuArticlePage() {
  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト"><Link href="/">トップ</Link><span>›</span><Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span><span>簡単な点数計算</span></nav>
          <p className="siteEyebrow">VIDEO GUIDE / 点数計算・符</p>
          <h1>点数計算は、よく出る形から覚えればいい</h1>
          <p className="videoArticleLead">点数計算は、すべての符を最初から暗記しなくても始められます。親か子か、ロンかツモか、何翻かを確認し、よく出る20・30・40符の形を点数表へ当てはめる方法を紹介します。</p>
          <div className="videoArticleByline"><span>紹介動画: クリアレインのアトリエ【麻雀解説】</span><time>動画公開日 2020年6月20日</time><span>約3分で読める</span></div>
        </header>

        <div className="videoArticleEmbed">
          <iframe
            src="https://www.youtube-nocookie.com/embed/_b8l94mF8P0"
            title="【麻雀】点数計算が誰でも一瞬でできる簡単な方法【符計算しない】"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen loading="lazy" />
        </div>
        <p className="videoSourceNote">動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">クリアレインのアトリエ【麻雀解説】の元動画をYouTubeで見る</a></p>

        <section className="videoArticleAudience">
                  <div>
                    <p className="videoArticleSectionLabel">RECOMMENDED FOR</p>
                    <h2>この動画はこんな人に向いています</h2>
                  </div>
                  <ul>
                    <li>役と翻数は少し分かるけれど、点数表の引き方が分からない人</li>
                    <li>符計算という言葉を聞いただけで難しく感じてしまう人</li>
                    <li>まず実戦でよく出る点数から覚えたい人</li>
                    <li>点数計算ツールの結果を自分でも確認できるようになりたい人</li>
                  </ul>
                </section>

        <VideoArticleCompactContent
          message={"点数計算は、すべての符を最初から暗記しなくても始められます。"}
          points={[
            { title: "点数表を見る前に確認する4つ", description: "親のアガリは、同じ翻・符でも子より高くなります。" },
            { title: "よく出る形を20・30・40符へ分ける", description: "本来の符は、基本20符にアガり方、面子、雀頭、待ちの符を加えて求めます。" },
            { title: "よく出る3パターンを見分ける", description: "" },
          ]}
        />

        <ClearRainBasicTheoryBook
                  heading="点数計算を覚えた次に、実戦判断を広げる"
                  description="点数を確認できるようになったら、その手を速く進めるか、守るか、リーチや鳴きをどう選ぶかまで考えられるようになります。初級者がつまずきやすい判断を一冊で整理できます。"
                />

        <section className="videoArticleNext">
                  <p className="videoArticleSectionLabel">NEXT STEP</p>
                  <h2>点数表とツールで答え合わせする</h2>
                  <div>
                    <Link href="/tools/score-table">初心者向け点数早見表を見る</Link>
                    <Link href="/rules/practical-score">実戦でよく見る点数計算を牌図で学ぶ</Link>
                    <Link href="/tools">麻雀点数計算ツールを使う</Link>
                    <Link href="/rules/yaku">役一覧で翻数を確認する</Link>
                  </div>
                </section>

</article>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ClearRainBasicTheoryBook } from "../../../components/VideoBookRecommendation";
import { VideoArticleCompactContent } from "../VideoArticleCompactContent";

export const metadata: Metadata = {
  title: "麻雀の点数計算問題10問｜初心者向け実戦練習",
  description: "平和のロン・ツモ、副露、七対子、満貫、40符・50符など、実戦でよく出る麻雀の点数計算を問題形式で学びます。"
};

const videoUrl = "https://www.youtube.com/watch?v=pDTj3jixyY4";
const tileNames: Record<string, string> = {
  man1: "一萬", man2: "二萬", man3: "三萬", man4: "四萬", man5: "五萬", man6: "六萬", man7: "七萬", man8: "八萬", man9: "九萬",
  pin2: "二筒", pin3: "三筒", pin4: "四筒", pin5: "五筒", pin6: "六筒", pin7: "七筒", pin8: "八筒",
  sou2: "二索", sou3: "三索", sou4: "四索", sou5: "五索", sou6: "六索", sou7: "七索", sou8: "八索", ji5: "白"
};

function TileRow({ tiles }: { tiles: string[] }) {
  return <div>{tiles.map((tile, index) => <img key={`${tile}-${index}`} src={`/tiles/${tile}-66-90-l-emb.png`} alt={tileNames[tile]} />)}</div>;
}

export default function PracticalScoreCalculationQuizPage() {
  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト"><Link href="/">トップ</Link><span>›</span><Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span><Link href="/videos/strategy/beginner">初心者向け</Link><span>›</span><span>点数計算問題</span></nav>
          <p className="siteEyebrow">BEGINNER VIDEO GUIDE / 点数計算</p>
          <h1>実戦でよく出る点数計算問題10問</h1>
          <p className="videoArticleLead">点数計算は、すべての符を最初から暗記しなくても練習できます。この動画では、よく出る形を「翻数」と「アガリ方・手牌の状態」に分け、点数表を選ぶ流れを10問で確認します。</p>
          <div className="videoArticleByline"><span>紹介動画: クリアレインのアトリエ【麻雀解説】</span><time>動画公開日 2026年5月16日</time><span>約3分で読める</span></div>
        </header>

        <div className="videoArticleEmbed"><iframe src="https://www.youtube-nocookie.com/embed/pDTj3jixyY4" title="実戦でよく出る点数計算問題10問" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen loading="lazy" /></div>
        <p className="videoSourceNote">動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">元動画をYouTubeで見る</a></p>

        <section className="videoArticleAudience"><div><p className="videoArticleSectionLabel">RECOMMENDED FOR</p><h2>この動画はこんな人に向いています</h2></div><ul><li>点数表のどの欄を見るか迷う人</li><li>平和ロンと平和ツモを区別したい人</li><li>副露・七対子・満貫をまとめて練習したい人</li><li>オーラスで必要な点数を自分で考えたい人</li></ul></section>

        <VideoArticleCompactContent
          message={"点数計算は、すべての符を最初から暗記しなくても練習できます。"}
          points={[
            { title: "最初は2段階で点数表を選ぶ", description: "リーチ・ツモ・平和・タンヤオ・役牌・ドラなどを合計します。" },
            { title: "平和はロン30符・ツモ20符から見る", description: "子のツモ点は「子が払う点 / 親が払う点」の順に読みます。" },
            { title: "平和なし・副露・七対子を分ける", description: "動画では、平和なしの門前ツモ・ロン、副露したツモ・ロン、七対子を順番に出題します。" },
          ]}
        />

        <ClearRainBasicTheoryBook
                  heading="点数を分かった上で、実戦の選択を磨く"
                  description="点数計算を使えるようになると、打点を追うか、速度を優先するか、守備に回るかをより具体的に比べられます。初級者の実戦判断をまとめて復習できる一冊です。"
                />

        <section className="videoArticleNext"><p className="videoArticleSectionLabel">NEXT STEP</p><h2>点数表を使って復習する</h2><div><Link href="/videos/strategy/easy-score-calculation-without-fu">簡単な点数計算方法を復習する</Link><Link href="/tools/score-table">初心者向け点数早見表を見る</Link><Link href="/rules/practical-score">実戦でよく見る点数計算を見る</Link></div></section>

</article>
    </main>
  );
}

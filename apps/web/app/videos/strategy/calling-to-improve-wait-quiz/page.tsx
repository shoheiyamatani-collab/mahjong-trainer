import type { Metadata } from "next";
import Link from "next/link";
import { ClearRainBasicTheoryBook } from "../../../components/VideoBookRecommendation";
import { VideoArticleCompactContent } from "../VideoArticleCompactContent";

export const metadata: Metadata = {
  title: "麻雀の何鳴く問題｜待ちを良くするチー・ポン10問",
  description: "麻雀初心者向けに、テンパイ後のチー・ポンでカンチャンや単騎を両面・多面待ちへ変える考え方を短い要点で解説します。"
};

const videoUrl = "https://www.youtube.com/watch?v=7Cy92lt82N8";
const tileNames: Record<string, string> = {
  man1: "一萬", man2: "二萬", man3: "三萬", man4: "四萬", man5: "五萬", man6: "六萬", man7: "七萬", man8: "八萬",
  pin2: "二筒", pin3: "三筒", pin4: "四筒", pin5: "五筒", pin6: "六筒", pin7: "七筒",
  sou2: "二索", sou3: "三索", sou4: "四索", sou5: "五索", sou6: "六索", sou7: "七索", sou8: "八索"
};

function TileRow({ tiles }: { tiles: string[] }) {
  return <div>{tiles.map((tile, index) => <img key={`${tile}-${index}`} src={`/tiles/${tile}-66-90-l-emb.png`} alt={tileNames[tile]} />)}</div>;
}

export default function CallingToImproveWaitQuizPage() {
  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト"><Link href="/">トップ</Link><span>›</span><Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span><Link href="/videos/strategy/beginner">初心者向け</Link><span>›</span><span>待ちを良くする何鳴く</span></nav>
          <p className="siteEyebrow">BEGINNER VIDEO GUIDE / 何鳴く</p>
          <h1>待ちを良くする何鳴く問題10問</h1>
          <p className="videoArticleLead">テンパイした後でも、別の牌をチー・ポンすることで、カンチャンや単騎を両面・多面待ちへ変えられる場合があります。動画を止めて「何を鳴き、何を切るか」を考える問題です。</p>
          <div className="videoArticleByline"><span>紹介動画: クリアレインのアトリエ【麻雀解説】</span><time>動画公開日 2026年8月8日</time><span>約3分で読める</span></div>
        </header>

        <div className="videoArticleEmbed"><iframe src="https://www.youtube-nocookie.com/embed/7Cy92lt82N8" title="待ちが良くなる何鳴く問題10問" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen loading="lazy" /></div>
        <p className="videoSourceNote">動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">元動画をYouTubeで見る</a></p>

        <section className="videoArticleAudience"><div><p className="videoArticleSectionLabel">RECOMMENDED FOR</p><h2>この動画はこんな人に向いています</h2></div><ul><li>テンパイしたら手を動かさなくなる人</li><li>チー・ポン後の待ち変化を見落とす人</li><li>複合形を複数の面子に分けて見たい人</li><li>7枚形や多面待ちへ進みたい人</li></ul></section>

        <VideoArticleCompactContent
          message={"テンパイした後でも、別の牌をチー・ポンすることで、カンチャンや単騎を両面・多面待ちへ変えられる場合があります。"}
          points={[
            { title: "まず現在の待ちに近い牌を見る", description: "待ちに関係する牌を鳴くと、残った部分の分け方が変わります。" },
            { title: "複合形は1通りだけで見ない", description: "同じ牌が面子・対子・ターツの複数の役割を持つ形では、1組を鳴いて取り出すと別の待ちが現れます。" },
            { title: "単騎が2つの面子をつないでいる形に注目", description: "単騎待ちの手で2つの順子が連結している場合、その連結部分に関係する牌を鳴くと、残った牌が両面・ノベタンなどへ変わることがあります。" },
          ]}
        />

        <ClearRainBasicTheoryBook
                  heading="鳴き判断を、実戦の基準へ広げる"
                  description="待ちを良くする鳴きだけでなく、速度・打点・守備を合わせて鳴くか決める考え方を整理できます。動画の問題で得た気づきを、実戦の判断へつなげたい人に向く一冊です。"
                />

        <section className="videoArticleNext"><p className="videoArticleSectionLabel">NEXT STEP</p><h2>鳴いた後の判断へ進む</h2><div><Link href="/videos/strategy/after-calling-tenpai">鳴いてテンパイした後の思考を見る</Link><Link href="/rules/practical-waits">実戦でよく見る待ち一覧を確認する</Link><Link href="/trainer">7枚形トレーニングへ進む</Link></div></section>

</article>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { HirasawaTileEfficiencyBook } from "../../../components/VideoBookRecommendation";
import { VideoArticleCompactContent } from "../VideoArticleCompactContent";

export const metadata: Metadata = {
  title: "麻雀初心者がやってはいけない何切る3選｜シャンテン数の基本",
  description: "麻雀初心者向けに、唯一の対子、完成面子、孤立牌があるときのターツを切るとシャンテン数が戻る理由を牌姿で解説します。"
};

const videoUrl = "https://www.youtube.com/watch?v=dIuGoO2CGtI";
const tileNames: Record<string, string> = {
  man1: "一萬", man2: "二萬", man3: "三萬", man4: "四萬", man5: "五萬", man6: "六萬", man7: "七萬",
  pin1: "一筒", pin2: "二筒", pin3: "三筒", pin4: "四筒", pin5: "五筒", pin6: "六筒", pin7: "七筒", pin8: "八筒", pin9: "九筒",
  sou3: "三索", sou4: "四索", sou5: "五索", sou6: "六索", ji3: "西", ji4: "北"
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

export default function ThreeShantenMistakesBeginnersAvoidPage() {
  return (
    <main className="siteMain videoArticlePage shantenMistakesPage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト"><Link href="/">トップ</Link><span>›</span><Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span><Link href="/videos/strategy/beginner">初心者向け</Link><span>›</span><span>シャンテン数を戻さない3原則</span></nav>
          <p className="siteEyebrow">BEGINNER VIDEO GUIDE / シャンテン数</p>
          <h1>初心者がやってはいけない3つの何切る</h1>
          <p className="videoArticleLead">高い役や安全牌を意識する前に、まずアガリから遠ざかる一打を避けることが大切です。この動画は、シャンテン数が分からなくても使える3つのチェックポイントを問題形式で解説しています。</p>
          <div className="videoArticleByline"><span>紹介動画: 平澤元気麻雀ch</span><time>動画公開日 2022年11月30日</time><span>約3分で読める</span></div>
        </header>

        <div className="videoArticleEmbed"><iframe src="https://www.youtube-nocookie.com/embed/dIuGoO2CGtI" title="麻雀初心者が避けたい3つの何切る" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen loading="lazy" /></div>
        <p className="videoSourceNote">動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">元動画をYouTubeで見る</a></p>

        <section className="videoArticleAudience">
                  <div><p className="videoArticleSectionLabel">RECOMMENDED FOR</p><h2>この動画はこんな人に向いています</h2></div>
                  <ul><li>両面なら何でも残した方がよいと思っている人</li><li>役を狙って完成した面子を壊してしまう人</li><li>安全牌を残すためにターツを切ることが多い人</li><li>自分の手が何シャンテンかまだ数えにくい人</li></ul>
                </section>

        <VideoArticleCompactContent
          message={"高い役や安全牌を意識する前に、まずアガリから遠ざかる一打を避けることが大切です。"}
          points={[
            { title: "シャンテン数を戻す打牌を避ける", description: "雀頭の候補がなくなり、もう一度同じ牌を重ねる手間が増えます。" },
            { title: "唯一の対子は雀頭の予約席", description: "アガリには4面子だけでなく、同じ牌2枚の雀頭が必要です。" },
            { title: "役のために完成面子を壊さない", description: "一色手が見えても、完成した面子を壊さなければ作れない役は、初心者のうちは無理に追わない方が安定します。" },
          ]}
        />

        <HirasawaTileEfficiencyBook />

        <section className="videoArticleNext">
                  <p className="videoArticleSectionLabel">NEXT STEP</p><h2>受け入れの考え方へ進む</h2>
                  <div><Link href="/videos/strategy/ukeire-vs-shape-change-basics">受け入れと手変わりの違いを覚える</Link><Link href="/videos/strategy/prioritize-ukeire-over-shape-change">変化より受け入れを優先する理由を見る</Link><Link href="/trainer">何切る問題で確認する</Link></div>
                </section>

</article>
    </main>
  );
}

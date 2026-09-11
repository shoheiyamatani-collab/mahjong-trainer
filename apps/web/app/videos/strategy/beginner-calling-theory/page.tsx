import type { Metadata } from "next";
import Link from "next/link";
import { HirasawaTileEfficiencyBook } from "../../../components/VideoBookRecommendation";
import { VideoArticleCompactContent } from "../VideoArticleCompactContent";

export const metadata: Metadata = {
  title: "麻雀初心者の鳴き方｜まず覚えたいポン・チーの3基準",
  description: "麻雀初心者向けに、役牌、役がある愚形、鳴けばテンパイの3場面でポン・チーする考え方を実戦的な牌姿で解説します。"
};

const videoUrl = "https://www.youtube.com/watch?v=KkjFCbiGrY0";
const tileNames: Record<string, string> = {
  man1: "一萬", man2: "二萬", man3: "三萬", man4: "四萬", man5: "五萬", man6: "六萬", man9: "九萬",
  pin3: "三筒", pin4: "四筒", pin5: "五筒", pin6: "六筒", pin7: "七筒", pin8: "八筒",
  sou2: "二索", sou3: "三索", sou4: "四索", sou5: "五索", sou6: "六索", sou7: "七索", sou9: "九索",
  ji7: "中"
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

export default function BeginnerCallingTheoryPage() {
  return (
    <main className="siteMain videoArticlePage beginnerCallingTheoryPage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト">
            <Link href="/">トップ</Link><span>›</span>
            <Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span>
            <Link href="/videos/strategy/beginner">初心者向け</Link><span>›</span>
            <span>鳴きの3つのセオリー</span>
          </nav>
          <p className="siteEyebrow">BEGINNER VIDEO GUIDE / ポン・チー</p>
          <h1>初心者がまず覚えたい、鳴きの3つのセオリー</h1>
          <p className="videoArticleLead">鳴くと手は早く進みますが、リーチができなくなり、守りに使える牌も減ります。この動画は、細かな例外を覚える前に使える「まずはこの3場面で鳴いてみる」という基準を解説しています。</p>
          <div className="videoArticleByline"><span>紹介動画: 平澤元気麻雀ch</span><time>動画公開日 2021年3月3日</time><span>約3分で読める</span></div>
        </header>

        <div className="videoArticleEmbed"><iframe src="https://www.youtube-nocookie.com/embed/KkjFCbiGrY0" title="初心者でも暗記すれば70点が取れる鳴きのセオリー" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen loading="lazy" /></div>
        <p className="videoSourceNote">動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">元動画をYouTubeで見る</a></p>

        <section className="videoArticleAudience">
                  <div><p className="videoArticleSectionLabel">RECOMMENDED FOR</p><h2>この動画はこんな人に向いています</h2></div>
                  <ul><li>ポン・チーしてよい場面が分からない人</li><li>鳴かずに受けて、手が間に合わないことが多い人</li><li>鳴いた後に役がなくなるのが不安な人</li><li>細かな例外より先に、簡単な判断軸が欲しい人</li></ul>
                </section>

        <VideoArticleCompactContent
          message={"鳴くと手は早く進みますが、リーチができなくなり、守りに使える牌も減ります。"}
          points={[
            { title: "最初は3つの場面を見分ける", description: "中・白・發、自風・場風を3枚組にすると役が確定し、その後はチーやポンを使って手を進められます。" },
            { title: "役牌は1枚目からポンを考える", description: "中をポンすると役がひとつ確定します。" },
            { title: "役が確定していれば、苦しい形を鳴く", description: "両面は通常2種類の牌で完成しますが、カンチャンやペンチャンは1種類です。" },
          ]}
        />

        <HirasawaTileEfficiencyBook
                  heading="鳴き判断の前に、手作りの基本を固める"
                  description="鳴きで速度を生かすには、鳴く前の手牌がどれだけ進んでいるかを見極めることが大切です。受け入れとブロックの考え方を、何切る問題で確かめられます。"
                />

        <section className="videoArticleNext">
                  <p className="videoArticleSectionLabel">NEXT STEP</p><h2>問題形式で鳴きを練習する</h2>
                  <div><Link href="/videos/strategy/calling-to-improve-wait-quiz">待ちを良くする何鳴く問題10問へ</Link><Link href="/videos/strategy/after-calling-tenpai">鳴いてテンパイした後の判断を見る</Link><Link href="/learn/calling">ポン・チー・カンの基本を復習する</Link></div>
                </section>

</article>
    </main>
  );
}

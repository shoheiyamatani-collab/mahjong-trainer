import type { Metadata } from "next";
import Link from "next/link";
import { HirasawaTileEfficiencyBook } from "../../../components/VideoBookRecommendation";
import { VideoArticleCompactContent } from "../VideoArticleCompactContent";

export const metadata: Metadata = {
  title: "麻雀の副露率は何％が正解？初心者向け鳴きの考え方",
  description: "麻雀の副露率に唯一の正解がない理由と、ポン・チーによる速度、打点、守備の変化を牌図で比較し、牌譜から鳴きを改善する方法を解説します。"
};

const videoUrl = "https://www.youtube.com/watch?v=Fm-GacaIVIc";

const tileNames: Record<string, string> = {
  man1: "一萬", man2: "二萬", man3: "三萬", man4: "四萬", man5: "五萬", man6: "六萬", man7: "七萬", man8: "八萬", man9: "九萬",
  pin1: "一筒", pin2: "二筒", pin3: "三筒", pin4: "四筒", pin5: "五筒", pin6: "六筒", pin7: "七筒", pin8: "八筒", pin9: "九筒",
  sou1: "一索", sou2: "二索", sou3: "三索", sou4: "四索", sou5: "五索", sou6: "六索", sou7: "七索", sou8: "八索", sou9: "九索",
  ji5: "白", ji6: "發", ji7: "中"
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

export default function HowToReadFuuroRatePage() {
  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト"><Link href="/">トップ</Link><span>›</span><Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span><span>副露率の考え方</span></nav>
          <p className="siteEyebrow">VIDEO GUIDE / 鳴き・成績分析</p>
          <h1>副露率だけで「鳴きすぎ」を判断しない</h1>
          <p className="videoArticleLead">ネット麻雀の成績画面には副露率が表示されます。しかし、強い人にもよく鳴く人と門前を重視する人がいます。大切なのは割合を合わせることではなく、一つひとつの鳴きが得だったかを考えることです。</p>
          <div className="videoArticleByline"><span>紹介動画: 平澤元気麻雀ch</span><time>動画公開日 2019年6月21日</time><span>約3分で読める</span></div>
        </header>

        <div className="videoArticleEmbed">
          <iframe
            src="https://www.youtube-nocookie.com/embed/Fm-GacaIVIc"
            title="強くなるための数値の考え方と副露率"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen loading="lazy" />
        </div>
        <p className="videoSourceNote">動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">平澤元気麻雀chの元動画をYouTubeで見る</a></p>

        <section className="videoArticleAudience">
                  <div><p className="videoArticleSectionLabel">RECOMMENDED FOR</p><h2>この動画はこんな人に向いています</h2></div>
                  <ul>
                    <li>自分の副露率を見て、鳴きすぎか不安になった人</li>
                    <li>強い人と同じ副露率にすれば勝てると思っていた人</li>
                    <li>ポン・チーの速さと、打点・守備の差を整理したい人</li>
                    <li>成績画面を上達へどう使えばよいか知りたい人</li>
                  </ul>
                </section>

        <VideoArticleCompactContent
          message={"ネット麻雀の成績画面には副露率が表示されます。"}
          points={[
            { title: "副露率は「鳴いた局の割合」", description: "副露率は、打った局のうちポン・チー・明槓をした局がどれくらいあったかを表す数字です。" },
            { title: "鳴きと門前には、それぞれ長所がある", description: "他家の捨て牌を使えるため、テンパイやアガリへ近づきやすくなります。" },
            { title: "副露率に唯一の正解がない4つの理由", description: "" },
          ]}
        />

        <HirasawaTileEfficiencyBook
                  heading="鳴きの振り返りを、手作りの基準から始める"
                  description="副露率の数字だけで鳴きの良し悪しは決まりません。鳴く前後で手牌がどれだけ進むかを、受け入れとブロックの視点から確認できます。"
                />

        <section className="videoArticleNext">
                  <p className="videoArticleSectionLabel">NEXT STEP</p>
                  <h2>鳴きの条件と実戦判断を確認する</h2>
                  <div>
                    <Link href="/learn/calling">鳴きの基本を復習する</Link>
                    <Link href="/videos/strategy/calling-to-improve-wait-quiz">何鳴く問題で待ちを比較する</Link>
                    <Link href="/videos/strategy/after-calling-tenpai">鳴いた後の手変わりを学ぶ</Link>
                    <Link href="/trainer">実戦問題で判断を試す</Link>
                  </div>
                </section>

</article>
    </main>
  );
}

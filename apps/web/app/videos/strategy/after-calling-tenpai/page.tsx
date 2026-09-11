import type { Metadata } from "next";
import Link from "next/link";
import { VideoArticleCompactContent } from "../VideoArticleCompactContent";

export const metadata: Metadata = {
  title: "麻雀は鳴いてテンパイした後も手を良くできる",
  description: "副露してテンパイした後、さらにチー・ポンして打点を上げたり、カンチャンを両面へ変えたりする方法を短い要点で解説します。"
};

const videoUrl = "https://www.youtube.com/watch?v=E6kwxNECnXI";
const tileNames: Record<string, string> = {
  man1: "一萬", man2: "二萬", man3: "三萬", man4: "四萬", man5: "五萬", man6: "六萬", man7: "七萬", man8: "八萬", man9: "九萬",
  pin2: "二筒", pin3: "三筒", pin4: "四筒", pin5: "五筒", pin6: "六筒", pin7: "七筒", pin8: "八筒",
  sou2: "二索", sou3: "三索", sou4: "四索", sou5: "五索", sou6: "六索", sou7: "七索", ji7: "中"
};

function TileRow({ tiles }: { tiles: string[] }) {
  return <div>{tiles.map((tile, index) => <img key={`${tile}-${index}`} src={`/tiles/${tile}-66-90-l-emb.png`} alt={tileNames[tile]} />)}</div>;
}

export default function AfterCallingTenpaiPage() {
  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト"><Link href="/">トップ</Link><span>›</span><Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span><Link href="/videos/strategy/beginner">初心者向け</Link><span>›</span><span>鳴いてテンパイした後</span></nav>
          <p className="siteEyebrow">BEGINNER VIDEO GUIDE / 副露後の手作り</p>
          <h1>鳴いてテンパイした後も手を良くする</h1>
          <p className="videoArticleLead">テンパイすると、あとは待ち牌をツモるかロンするだけだと思いがちです。鳴いている手では、さらにチー・ポンして打点を上げたり、待ちを広げたりできる場合があります。</p>
          <div className="videoArticleByline"><span>紹介動画: 発男道場【麻雀解説ch】</span><time>動画公開日 2024年6月1日</time><span>約3分で読める</span></div>
        </header>

        <div className="videoArticleEmbed"><iframe src="https://www.youtube-nocookie.com/embed/E6kwxNECnXI" title="鳴いて聴牌した後の重要な思考" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen loading="lazy" /></div>
        <p className="videoSourceNote">動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">元動画をYouTubeで見る</a></p>

        <section className="videoArticleAudience"><div><p className="videoArticleSectionLabel">RECOMMENDED FOR</p><h2>この動画はこんな人に向いています</h2></div><ul><li>鳴いてテンパイしたら手を止めてしまう人</li><li>安い手を少しでも高くしたい人</li><li>カンチャンやシャンポンを良形へ変えたい人</li><li>食い替えなど鳴きの注意点も知りたい人</li></ul></section>

        <VideoArticleCompactContent
          message={"テンパイすると、あとは待ち牌をツモるかロンするだけだと思いがちです。"}
          points={[
            { title: "探すのは「打点アップ」と「待ち改善」", description: "すでに役のあるテンパイでも、別の牌を鳴いて手牌を組み直せます。" },
            { title: "鳴き直して役や赤牌を加える", description: "役牌などでアガリ役がすでにあるなら、別の順子を鳴き直して一気通貫や三色同順を完成させられる場合があります。" },
            { title: "愚形を両面・多面待ちへ変える", description: "カンチャン・単騎・シャンポンの近くにある牌を鳴くと、残った牌が両面になることがあります。" },
          ]}
        />

        <section className="videoArticleNext"><p className="videoArticleSectionLabel">NEXT STEP</p><h2>鳴きと待ちを練習する</h2><div><Link href="/videos/strategy/calling-to-improve-wait-quiz">待ちを良くする何鳴く問題を解く</Link><Link href="/rules/practical-waits">待ち一覧を確認する</Link><Link href="/analysis/mahjong-tool">牌理チェッカーで待ちを比べる</Link></div></section>

</article>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { HirasawaTileEfficiencyBook } from "../../../components/VideoBookRecommendation";
import { VideoArticleCompactContent } from "../VideoArticleCompactContent";

export const metadata: Metadata = {
  title: "麻雀の役を簡単に覚える方法 | 初心者向け4グループ分類",
  description: "麻雀の役を丸暗記せず、使う牌の種類、面子の形、見た目の規則性、アガり方という4グループに分けて覚える方法を短い要点で解説します。"
};

const videoUrl = "https://www.youtube.com/watch?v=-5MwWWHqvWI";

const tileNames: Record<string, string> = {
  man1: "一萬", man2: "二萬", man3: "三萬", man4: "四萬", man5: "五萬", man6: "六萬", man7: "七萬", man8: "八萬", man9: "九萬",
  pin1: "一筒", pin2: "二筒", pin3: "三筒", pin4: "四筒", pin5: "五筒", pin6: "六筒", pin7: "七筒", pin8: "八筒", pin9: "九筒",
  sou1: "一索", sou2: "二索", sou3: "三索", sou4: "四索", sou5: "五索", sou6: "六索", sou7: "七索", sou8: "八索", sou9: "九索",
  ji1: "東", ji2: "南", ji3: "西", ji4: "北", ji5: "白", ji6: "發", ji7: "中"
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

export default function YakuGroupingMemoryGuidePage() {
  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト"><Link href="/">トップ</Link><span>›</span><Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span><span>役を簡単に覚える方法</span></nav>
          <p className="siteEyebrow">VIDEO GUIDE / 役・覚え方</p>
          <h1>麻雀の役は丸暗記しない。4つのグループで覚えよう</h1>
          <p className="videoArticleLead">役一覧を見て「こんなに覚えられない」と感じても大丈夫です。最初はリーチ・タンヤオ・役牌だけでも遊べます。そのうえで、似た役を同じ仲間として整理すると、名前と条件が自然につながります。</p>
          <div className="videoArticleByline"><span>紹介動画: 平澤元気麻雀ch</span><time>動画公開日 2023年6月16日</time><span>約3分で読める</span></div>
        </header>

        <div className="videoArticleEmbed">
          <iframe
            src="https://www.youtube-nocookie.com/embed/-5MwWWHqvWI"
            title="麻雀の役が簡単に頭に入る覚え方のイメージ"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen loading="lazy" />
        </div>
        <p className="videoSourceNote">動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">平澤元気麻雀chの元動画をYouTubeで見る</a></p>

        <section className="videoArticleAudience">
                  <div><p className="videoArticleSectionLabel">RECOMMENDED FOR</p><h2>この動画はこんな人に向いています</h2></div>
                  <ul>
                    <li>役一覧を見ても数が多すぎて覚えられない人</li>
                    <li>リーチ・タンヤオ・役牌の次に何を覚えるか迷う人</li>
                    <li>混一色と清一色、チャンタと純チャンを混同する人</li>
                    <li>役の条件を牌姿から見つけられるようになりたい人</li>
                  </ul>
                </section>

        <VideoArticleCompactContent
          message={"役一覧を見て「こんなに覚えられない」と感じても大丈夫です。"}
          points={[
            { title: "全部覚えなくても麻雀は始められる", description: "動画では、役を「同じグループの牌や形を集めたときにもらえるボーナス」と考えます。" },
            { title: "使う牌の種類で覚える", description: "数牌と字牌、一色と複数色、2〜8と1・9・字牌という範囲に分けます。" },
            { title: "面子の形で覚える", description: "順子、刻子、対子のどれを集めているかを見る方法です。" },
          ]}
        />

        <HirasawaTileEfficiencyBook
                  heading="役を覚えたら、アガリやすい手作りへ"
                  description="役を暗記した次は、役の種を残しながらテンパイへ近づく手作りが大切です。受け入れやブロックの考え方を、何切る問題と一緒に基礎から確認できます。"
                />

        <section className="videoArticleNext">
                  <p className="videoArticleSectionLabel">NEXT STEP</p>
                  <h2>グループを役一覧の牌姿と結びつける</h2>
                  <div>
                    <Link href="/rules/yaku">すべての役を牌姿で確認する</Link>
                    <Link href="/rules/frequent-yaku">実戦でよく見る役から覚える</Link>
                    <Link href="/learn/yaku-required">アガるための役について復習する</Link>
                    <Link href="/training/yaku-quiz">役判定クイズで確認する</Link>
                  </div>
                </section>

</article>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ClearRainBasicTheoryBook } from "../../../components/VideoBookRecommendation";

export const metadata: Metadata = {
  title: "麻雀初心者が上級者に勝つ確率を上げる4つの基本 | 実戦判断の入門",
  description: "麻雀初心者が対局で迷いにくくなる、手作り・押し引き・リーチ・鳴きの4つの判断基準を動画と短い要点で紹介します。"
};

const videoUrl = "https://www.youtube.com/watch?v=Rgs6FHdKXvU";

const takeaways = [
  {
    title: "手作りは、速さと打点の両方を見る",
    summary: "アガリやすさだけ、打点だけに寄せず、手を進めながら打点の種も残します。"
  },
  {
    title: "相手のリーチに無理をしない",
    summary: "まだテンパイしていないなら、押し続けずに降りることを基本にします。"
  },
  {
    title: "門前テンパイはリーチを基本候補にする",
    summary: "特別な理由がなければ、初心者はリーチを基準にすると判断が安定します。"
  },
  {
    title: "鳴く前に、速さと打点を確認する",
    summary: "鳴けるから鳴くのではなく、手が本当に良くなるかを一度考えます。"
  }
];

export default function BeginnerWinChanceBasicsArticlePage() {
  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト">
            <Link href="/">トップ</Link>
            <span>›</span>
            <Link href="/videos/strategy">麻雀を動画で学ぶ</Link>
            <span>›</span>
            <span>上級者と戦うための基本</span>
          </nav>
          <p className="siteEyebrow">VIDEO GUIDE / 実戦判断・勝ち方</p>
          <h1>初心者でも、判断の基準があれば上級者と戦える</h1>
          <p className="videoArticleLead">
            手作り・押し引き・リーチ・鳴きで、初心者が先に持っておきたい4つの判断基準を紹介する動画です。
          </p>
          <div className="videoArticleByline">
            <span>紹介動画: クリアレインのアトリエ【麻雀解説】</span>
            <time>動画公開日 2023年4月8日</time>
            <span>約3分で読める</span>
          </div>
        </header>

        <div className="videoArticleEmbed">
          <iframe
            src="https://www.youtube-nocookie.com/embed/Rgs6FHdKXvU"
            title="【麻雀】もっと早く知りたかった！初心者でも上級者に勝てる打ち方"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        </div>
        <p className="videoSourceNote">
          動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">クリアレインのアトリエ【麻雀解説】の元動画をYouTubeで見る</a>
        </p>

        <section className="videoArticleAudience">
          <div>
            <p className="videoArticleSectionLabel">RECOMMENDED FOR</p>
            <h2>この動画はこんな人に向いています</h2>
          </div>
          <ul>
            <li>ルールは覚えたけれど、対局中の判断に自信がない人</li>
            <li>相手が強いと、必要以上に押したり消極的になったりする人</li>
            <li>リーチや鳴きを、その場の感覚だけで決めている人</li>
          </ul>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">MESSAGE</p>
          <h2>この動画が伝えようとしていること</h2>
          <p>
            麻雀は運の影響があるため、初心者にも上級者へ勝つチャンスがあります。そのチャンスを生かすには、難しい戦術をたくさん覚えるより、迷ったときに戻れる基本の判断基準を持つことが大切です。
          </p>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">SUMMARY</p>
          <h2>動画の内容を簡潔にまとめると</h2>
          <div className="videoPrincipleList">
            {takeaways.map((takeaway, index) => (
              <section className="videoPrinciple" key={takeaway.title}>
                <div className="videoPrincipleNumber">{index + 1}</div>
                <div className="videoPrincipleBody">
                  <h3>{takeaway.title}</h3>
                  <p>{takeaway.summary}</p>
                </div>
              </section>
            ))}
          </div>
        </section>

        <section className="videoArticleCaution">
          <p className="videoArticleSectionLabel">ONE POINT</p>
          <h2>まずは一つだけ意識すれば十分</h2>
          <p>
            4つを一度に完璧にする必要はありません。次の対局では、迷った場面でこのうち一つを思い出すことから始めましょう。
          </p>
        </section>

        <ClearRainBasicTheoryBook />
      </article>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { VideoArticleCompactContent } from "../VideoArticleCompactContent";

export const metadata: Metadata = {
  title: "麻雀の鳴き読み｜チー出しまたぎが通りやすい3条件",
  description: "麻雀中級者向けに、チー直後の手出し牌をまたぐ両面待ちが比較的通りやすくなる3条件を短い要点で解説。読みの限界と愚形への注意も紹介します。"
};

const videoUrl = "https://www.youtube.com/watch?v=3CY4e9PVNy0";

const tileNames: Record<string, string> = {
  man1: "一萬", man2: "二萬", man3: "三萬", man4: "四萬", man5: "五萬", man6: "六萬", man7: "七萬",
  pin4: "四筒", pin5: "五筒", pin6: "六筒", pin7: "七筒", pin8: "八筒", pin9: "九筒",
  sou2: "二索", sou3: "三索", sou4: "四索", sou5: "五索", sou6: "六索", sou7: "七索", sou8: "八索",
  ji2: "南"
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

export default function CallingReadChiDiscardMatagiPage() {
  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト">
            <Link href="/">トップ</Link><span>›</span>
            <Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span>
            <Link href="/videos/strategy/advanced">中級者以上向け</Link><span>›</span>
            <Link href="/videos/strategy/advanced/calling-read">鳴き読み</Link><span>›</span>
            <span>チー出しまたぎ</span>
          </nav>
          <p className="siteEyebrow">INTERMEDIATE VIDEO GUIDE / 鳴き読み</p>
          <h1>チー出しまたぎを読む3つの条件</h1>
          <p className="videoArticleLead">相手がチーした直後、手の中から切った牌をまたぐスジは、一般に両面待ちの候補になります。ただし、それまでの捨て牌や鳴いた形と矛盾する場合は、両面待ちの可能性を少し下げられます。</p>
          <div className="videoArticleByline"><span>紹介動画: 発男道場【麻雀解説ch】</span><time>動画公開日 2025年3月15日</time><span>約3分で読める</span></div>
        </header>

        <div className="videoArticleEmbed">
          <iframe
            src="https://www.youtube-nocookie.com/embed/3CY4e9PVNy0"
            title="【麻雀解説】上級者だけが知ってる！チー出しまたぎが通りやすいケース3選（鳴き読み）"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen loading="lazy" />
        </div>
        <p className="videoSourceNote">動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">発男道場【麻雀解説ch】の元動画をYouTubeで見る</a></p>

        <section className="videoArticleAudience">
                  <div><p className="videoArticleSectionLabel">RECOMMENDED FOR</p><h2>この動画はこんな人に向いています</h2></div>
                  <ul>
                    <li>副露した相手へ押す牌を比較したい人</li>
                    <li>チー直後の手出しがなぜ危険か理解したい人</li>
                    <li>捨て牌と鳴きの順番を読む練習を始めたい人</li>
                    <li>読みを断定ではなく危険度比較に使いたい人</li>
                  </ul>
                </section>

        <VideoArticleCompactContent
          message={"相手がチーした直後、手の中から切った牌をまたぐスジは、一般に両面待ちの候補になります。"}
          points={[
            { title: "チー出しまたぎとは", description: "四萬を手から切った直後なら、元の手に三四四萬または四四五萬があり、1枚の四萬を切って三四萬・四五萬の両面を残した可能性があります。" },
            { title: "手出し牌が直前にも切られていた", description: "相手が四萬を2枚持ち、四萬を使うことでテンパイできる形なら、直前に四萬が切られた時点でポンする選択がありました。" },
            { title: "鳴いた両面より、手出し側の両面を固定する方が自然だった", description: "相手が先に弱い両面を固定し、その両面をチーした後で、ドラを含む強い両面候補のそばを手出ししたとします。" },
          ]}
        />

        <section className="videoArticleNext">
                  <p className="videoArticleSectionLabel">NEXT STEP</p>
                  <h2>待ちと読みを組み合わせる</h2>
                  <div>
                    <Link href="/videos/strategy/advanced/calling-read">鳴き読みカテゴリーを見る</Link>
                    <Link href="/rules/practical-waits">実戦でよく見る待ち一覧を確認する</Link>
                    <Link href="/videos/strategy/how-to-use-mahjong-reading">麻雀の読み方を復習する</Link>
                    <Link href="/videos/strategy/advanced">中級者以上向け動画を見る</Link>
                  </div>
                </section>

</article>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { VideoArticleCompactContent } from "../VideoArticleCompactContent";

export const metadata: Metadata = {
  title: "麻雀の鳴き読み｜まず覚えたい2つの重要パターン",
  description: "麻雀中級者向けに、実戦で使いやすい鳴き読み2パターンを短い要点で解説。チー出し牌、直前の安全牌、ポンの見送りから両面待ちの可能性を比較します。"
};

const videoUrl = "https://www.youtube.com/watch?v=DrQ_50D4kaY";

const tileNames: Record<string, string> = {
  man2: "二萬", man3: "三萬", man4: "四萬", man5: "五萬", man6: "六萬", man7: "七萬",
  pin1: "一筒", pin2: "二筒", pin3: "三筒", pin4: "四筒", pin5: "五筒", pin6: "六筒", pin7: "七筒", pin8: "八筒",
  sou2: "二索", sou3: "三索", sou4: "四索", sou5: "五索", sou6: "六索", sou7: "七索",
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

export default function CallingReadTwoEssentialPatternsPage() {
  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト">
            <Link href="/">トップ</Link><span>›</span>
            <Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span>
            <Link href="/videos/strategy/advanced">中級者以上向け</Link><span>›</span>
            <Link href="/videos/strategy/advanced/calling-read">鳴き読み</Link><span>›</span>
            <span>重要2パターン</span>
          </nav>
          <p className="siteEyebrow">INTERMEDIATE VIDEO GUIDE / 鳴き読み</p>
          <h1>まず覚えたい鳴き読み2つの重要パターン</h1>
          <p className="videoArticleLead">鳴き読みは、相手の手牌を完全に当てる技術ではありません。「何を鳴き、直後に何を手から切ったか」と、それ以前の捨て牌をつなぎ、待ち候補ごとの危険度を比べる技術です。この動画から、最初に覚えやすい2つの型を整理します。</p>
          <div className="videoArticleByline"><span>紹介動画: 発男道場【麻雀解説ch】</span><time>動画公開日 2026年7月18日</time><span>約3分で読める</span></div>
        </header>

        <div className="videoArticleEmbed">
          <iframe
            src="https://www.youtube-nocookie.com/embed/DrQ_50D4kaY"
            title="【麻雀解説】鳴き読みは最低限これだけ覚えて！実戦で役立つ2つの重要パターン"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen loading="lazy" />
        </div>
        <p className="videoSourceNote">動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">発男道場【麻雀解説ch】の元動画をYouTubeで見る</a></p>

        <section className="videoArticleAudience">
                  <div><p className="videoArticleSectionLabel">RECOMMENDED FOR</p><h2>この動画はこんな人に向いています</h2></div>
                  <ul>
                    <li>鳴いた相手へ押す牌を根拠を持って比較したい人</li>
                    <li>チー出し牌の周辺をすべて危険だと思っている人</li>
                    <li>手出し・ツモ切りと鳴きの順番を読む練習を始めたい人</li>
                    <li>読みの例外まで含めて実戦的に学びたい人</li>
                  </ul>
                </section>

        <VideoArticleCompactContent
          message={"鳴き読みは、相手の手牌を完全に当てる技術ではありません。"}
          points={[
            { title: "まず「チー出し」を見落とさない", description: "相手が三四萬から五萬をチーし、直後に三筒を手出ししたとします。" },
            { title: "安全牌の後に、鳴きと無関係な数牌を手出しした", description: "両面チーの直前に南のような安全牌を手から切り、その後、鳴いた萬子と無関係な三筒を手出しした場面です。" },
            { title: "チー出し牌が直前に切られたのにポンしなかった", description: "三筒が直前に切られたとき、相手が三筒を2枚持ち、三筒を使えばテンパイできる形なら、その場でポンする選択がありました。" },
          ]}
        />

        <section className="videoArticleNext">
                  <p className="videoArticleSectionLabel">NEXT STEP</p>
                  <h2>鳴き読みを続けて学ぶ</h2>
                  <div>
                    <Link href="/videos/strategy/advanced/calling-read">鳴き読みカテゴリーを見る</Link>
                    <Link href="/videos/strategy/calling-read-chi-discard-matagi">チー出しまたぎの3条件を詳しく見る</Link>
                    <Link href="/videos/strategy/calling-read-fixed-ryanmen-chi">固定した両面チーから待ちを読む</Link>
                    <Link href="/rules/practical-waits">実戦でよく見る待ち一覧を確認する</Link>
                  </div>
                </section>

</article>
    </main>
  );
}

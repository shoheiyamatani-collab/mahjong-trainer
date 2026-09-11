import type { Metadata } from "next";
import Link from "next/link";
import { VideoArticleCompactContent } from "../VideoArticleCompactContent";

export const metadata: Metadata = {
  title: "麻雀の鳴き読み｜固定した両面チーから待ちを読む",
  description: "麻雀中級者向けに、固定した両面をチーした後の手出しから通りやすい両面を探す方法を短い要点で解説。フォロー牌と愚形待ちの注意も紹介します。"
};

const videoUrl = "https://www.youtube.com/watch?v=OYK0xrdF2no";

const tileNames: Record<string, string> = {
  man1: "一萬", man2: "二萬", man3: "三萬", man4: "四萬", man5: "五萬", man6: "六萬", man7: "七萬", man8: "八萬",
  pin4: "四筒", pin5: "五筒", pin6: "六筒", pin7: "七筒", pin8: "八筒", pin9: "九筒",
  sou2: "二索", sou3: "三索", sou4: "四索", sou5: "五索", sou6: "六索", sou7: "七索", sou8: "八索",
  ji5: "白"
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

export default function CallingReadFixedRyanmenChiPage() {
  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト">
            <Link href="/">トップ</Link><span>›</span>
            <Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span>
            <Link href="/videos/strategy/advanced">中級者以上向け</Link><span>›</span>
            <Link href="/videos/strategy/advanced/calling-read">鳴き読み</Link><span>›</span>
            <span>固定した両面チー</span>
          </nav>
          <p className="siteEyebrow">INTERMEDIATE VIDEO GUIDE / 鳴き読み</p>
          <h1>固定した両面チーから読む待ち候補</h1>
          <p className="videoArticleLead">相手が先に両面を固定し、その両面をチーして手から数牌を切ったとき、切り順から両面待ちの候補を絞れる場合があります。ポイントは「何をチーしたか」だけでなく、両面を固定した牌とチー直後の手出しをセットで見ることです。</p>
          <div className="videoArticleByline"><span>紹介動画: 発男道場【麻雀解説ch】</span><time>動画公開日 2025年10月8日</time><span>約3分で読める</span></div>
        </header>

        <div className="videoArticleEmbed">
          <iframe
            src="https://www.youtube-nocookie.com/embed/OYK0xrdF2no"
            title="【麻雀解説】固定両面のチーに要注意！知らなきゃ損する鳴き読みポイント"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen loading="lazy" />
        </div>
        <p className="videoSourceNote">動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">発男道場【麻雀解説ch】の元動画をYouTubeで見る</a></p>

        <section className="videoArticleAudience">
                  <div><p className="videoArticleSectionLabel">RECOMMENDED FOR</p><h2>この動画はこんな人に向いています</h2></div>
                  <ul>
                    <li>鳴いた相手の待ち候補を比較したい人</li>
                    <li>固定した両面チーの意味を理解したい人</li>
                    <li>手出し牌のまたぎ以外をどこまで信用できるか知りたい人</li>
                    <li>両面読みと愚形読みを分けて考えたい人</li>
                  </ul>
                </section>

        <VideoArticleCompactContent
          message={"相手が先に両面を固定し、その両面をチーして手から数牌を切ったとき、切り順から両面待ちの候補を絞れる場合があります。"}
          points={[
            { title: "先に両面を固定してからチーする", description: "六七七索から七索を切ると、五・八索を受ける六七索の両面が固定されます。" },
            { title: "手出し七筒のまたぎ以外の両面は通りやすくなる", description: "別の色に両面があり、それが最終待ちになる手なら、七筒を先に切って完全イーシャンテンへ取る方が自然な場面が多くなります。" },
            { title: "手出し牌のまたぎ両面は自然に残る", description: "六七筒または七八筒が残る形では、索子の両面を先に固定しても不自然とは言い切れません。" },
          ]}
        />

        <section className="videoArticleNext">
                  <p className="videoArticleSectionLabel">NEXT STEP</p>
                  <h2>鳴き読みを続けて学ぶ</h2>
                  <div>
                    <Link href="/videos/strategy/advanced/calling-read">鳴き読みカテゴリーを見る</Link>
                    <Link href="/videos/strategy/calling-read-chi-discard-matagi">チー出しまたぎを読む3条件を見る</Link>
                    <Link href="/rules/practical-waits">実戦でよく見る待ち一覧を確認する</Link>
                    <Link href="/videos/strategy/advanced">中級者以上向け動画を見る</Link>
                  </div>
                </section>

</article>
    </main>
  );
}

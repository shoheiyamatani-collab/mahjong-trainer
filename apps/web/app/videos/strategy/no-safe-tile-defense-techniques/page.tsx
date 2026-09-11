import type { Metadata } from "next";
import Link from "next/link";
import { HirasawaDefenseBook } from "../../../components/VideoBookRecommendation";
import { VideoArticleCompactContent } from "../VideoArticleCompactContent";

export const metadata: Metadata = {
  title: "現物がないときのベタオリ | 麻雀初心者の放銃を減らす方法",
  description: "相手のリーチに現物がないとき、対子・暗刻を使って切る危険牌の種類を抑える方法と、序盤に切られた牌の外側を比較する守備の考え方を短い要点で解説します。"
};

const videoUrl = "https://www.youtube.com/watch?v=nzHCKuMuUJE";

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

export default function NoSafeTileDefenseTechniquesPage() {
  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト"><Link href="/">トップ</Link><span>›</span><Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span><span>現物がないときのベタオリ</span></nav>
          <p className="siteEyebrow">VIDEO GUIDE / 守備・手詰まり</p>
          <h1>現物がなくても押さない。放銃を減らすベタオリの考え方</h1>
          <p className="videoArticleLead">リーチを受けたのに現物が1枚もないと、「もう押すしかない」と考えがちです。しかし、完全に安全な牌がなくても危険度を比べ、数巡しのぐ打ち方はあります。</p>
          <div className="videoArticleByline"><span>紹介動画: 平澤元気麻雀ch</span><time>動画公開日 2019年7月18日</time><span>約3分で読める</span></div>
        </header>

        <div className="videoArticleEmbed">
          <iframe
            src="https://www.youtube-nocookie.com/embed/nzHCKuMuUJE"
            title="99％の初心者が知らない麻雀で振り込みを減らすテクニック"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen loading="lazy" />
        </div>
        <p className="videoSourceNote">動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">平澤元気麻雀chの元動画をYouTubeで見る</a></p>

        <section className="videoArticleAudience">
                  <div><p className="videoArticleSectionLabel">RECOMMENDED FOR</p><h2>この動画はこんな人に向いています</h2></div>
                  <ul>
                    <li>現物がないと、降りるのを諦めて押してしまう人</li>
                    <li>ベタオリ中に毎巡違う危険牌を切ってしまう人</li>
                    <li>対子や暗刻を守備に使う考え方を知りたい人</li>
                    <li>序盤の捨て牌から比較的ましな候補を探したい人</li>
                  </ul>
                </section>

        <VideoArticleCompactContent
          message={"リーチを受けたのに現物が1枚もないと、「もう押すしかない」と考えがちです。"}
          points={[
            { title: "最初に「押すか、降りるか」を決める", description: "現物がないことは、押してよい理由にはなりません。" },
            { title: "異なる危険牌を何種類も切らない", description: "安全度が同程度なら、毎巡違う牌を切るより、同じ牌の対子や暗刻を落とす方が危険判定の回数を抑えられます。" },
            { title: "対子・暗刻は数巡しのぐ候補になる", description: "同じ牌を2枚または3枚持っていると、その1種類を通すだけで複数巡をしのげます。" },
          ]}
        />

        <HirasawaDefenseBook />

        <section className="videoArticleNext">
                  <p className="videoArticleSectionLabel">NEXT STEP</p>
                  <h2>守備の基本と組み合わせる</h2>
                  <div>
                    <Link href="/videos/strategy/suji-kabe-defense-basics">スジとカベの基本を復習する</Link>
                    <Link href="/videos/strategy/betaori-three-principles">ベタオリの重要な考え方3選を見る</Link>
                    <Link href="/rules/practical-waits">待ちの形から危険度を考える</Link>
                    <Link href="/trainer">実戦問題で判断を練習する</Link>
                  </div>
                </section>

</article>
    </main>
  );
}

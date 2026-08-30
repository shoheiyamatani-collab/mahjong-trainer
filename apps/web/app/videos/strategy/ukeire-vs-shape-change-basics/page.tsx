import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "麻雀の受け入れとは？手変わりとの違いを初心者向けに解説",
  description: "麻雀の受け入れを『シャンテン数が進む牌』として理解し、形が良くなる手変わりとの違い、受け入れの見つけ方と練習方法を牌図で解説します。"
};

const videoUrl = "https://www.youtube.com/watch?v=UvwfxpDK2zw";

const tileNames: Record<string, string> = {
  man1: "一萬", man2: "二萬", man3: "三萬", man4: "四萬", man5: "五萬", man6: "六萬", man7: "七萬", man8: "八萬", man9: "九萬",
  pin1: "一筒", pin2: "二筒", pin3: "三筒", pin4: "四筒", pin5: "五筒", pin6: "六筒", pin7: "七筒", pin8: "八筒", pin9: "九筒",
  sou1: "一索", sou2: "二索", sou3: "三索", sou4: "四索", sou5: "五索", sou6: "六索", sou7: "七索", sou8: "八索", sou9: "九索"
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

export default function UkeireVsShapeChangeBasicsPage() {
  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト"><Link href="/">トップ</Link><span>›</span><Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span><span>受け入れの仕組み</span></nav>
          <p className="siteEyebrow">VIDEO GUIDE / 牌効率・受け入れ</p>
          <h1>「引いたら嬉しい牌」ではない。受け入れを正しく覚えよう</h1>
          <p className="videoArticleLead">麻雀の受け入れとは、引いたときにシャンテン数が進む牌です。形が良くなる牌や打点が上がる牌も嬉しい牌ですが、それらは受け入れとは分けて考えます。</p>
          <div className="videoArticleByline"><span>紹介動画: 平澤元気麻雀ch</span><time>動画公開日 2026年7月29日</time><span>約12分で読める</span></div>
        </header>

        <div className="videoArticleEmbed">
          <iframe
            src="https://www.youtube-nocookie.com/embed/UvwfxpDK2zw"
            title="9割の初心者が勘違いしている正しい受け入れの仕組み"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <p className="videoSourceNote">動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">平澤元気麻雀chの元動画をYouTubeで見る</a></p>

        <section className="videoArticleAudience">
          <div><p className="videoArticleSectionLabel">RECOMMENDED FOR</p><h2>この動画はこんな人に向いています</h2></div>
          <ul>
            <li>受け入れを「引いたら嬉しい牌」だと思っていた人</li>
            <li>何切るの解説で「受け入れが広い」と言われても分からない人</li>
            <li>リーチボタンが出てからテンパイに気づくことがある人</li>
            <li>一向聴の受け入れを自分で数えられるようになりたい人</li>
          </ul>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">DEFINITION</p>
          <h2>受け入れとは、シャンテン数が進む牌</h2>
          <p>シャンテン数は、最低あと何手でテンパイできるかを表します。一向聴の手がテンパイになる牌、二向聴の手が一向聴になる牌が受け入れです。</p>
          <div className="strategyKeyMessage"><strong>判断は一つだけです。</strong>その牌を引き、不要牌を1枚切った後に、元の手よりシャンテン数が進んでいるかを確認します。</div>
          <div className="videoArticleTileBlocks">
            <div><span>一向聴の13枚</span><TileRow tiles={["man1", "man2", "man3", "man5", "man5", "pin3", "pin4", "pin5", "pin2", "sou4", "sou5", "sou7", "sou8"]} /></div>
            <div className="isStrong"><span>テンパイへ進める主な牌</span><TileRow tiles={["sou3", "sou6", "sou9"]} /></div>
          </div>
          <p>この例では、索子の45と78のどちらかを面子にできる3・6・9索が受け入れです。引いた後に孤立した2筒を切るとテンパイします。</p>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">CHANGE</p>
          <h2>形が良くなるだけなら「手変わり」</h2>
          <p>孤立した2筒の周辺を引けば形は良くなります。しかし、索子の面子候補が完成していないため、シャンテン数は一向聴のままです。このような牌は受け入れではなく、より良い形への変化として分けます。</p>
          <div className="videoArticleTileBlocks">
            <div><span>孤立した2筒</span><TileRow tiles={["pin2"]} /></div>
            <div><span>1・3筒でターツへ変化</span><TileRow tiles={["pin1", "pin3"]} /></div>
            <div className="isWeak"><span>嬉しくてもシャンテン数は同じ</span><TileRow tiles={["pin1", "pin2", "pin2", "pin3"]} /></div>
          </div>
          <div className="strategyActionBox"><b>区別する理由</b><p>受け入れは今すぐ一段階進む牌、手変わりは次の受け入れを増やしたり、待ちや打点を良くしたりする牌です。価値が同じではありません。</p></div>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">DIRECT PROGRESS</p>
          <h2>1種類の受け入れと、2種類の変化を同列に数えない</h2>
          <p>12萬は3萬を引けば面子が完成します。一方、孤立した3索は2索・4索のどちらを引いても、できるのはターツまでです。種類が2つあっても、さらにもう1枚引かなければ面子になりません。</p>
          <div className="videoArticleTileBlocks">
            <div className="isStrong"><span>3萬で面子が完成</span><TileRow tiles={["man1", "man2", "man3"]} /></div>
            <div><span>2索・4索ではターツになる</span><TileRow tiles={["sou2", "sou3", "sou3", "sou4"]} /></div>
          </div>
          <p>「嬉しい牌が何種類あるか」だけを数えると、この進み方の差を見落とします。まず受け入れを比べ、その後に良形変化や打点を比べます。</p>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">HAND STRUCTURE</p>
          <h2>孤立牌から面子になるまでを3段階で見る</h2>
          <p>受け入れが分からなくなったら、牌の成長段階へ戻ります。孤立牌に1枚つながってターツまたは対子になり、さらに1枚加わって面子になります。</p>
          <div className="videoArticleTileBlocks">
            <div><span>孤立牌</span><TileRow tiles={["pin5"]} /></div>
            <div><span>ターツ・対子</span><TileRow tiles={["pin5", "pin6", "pin5", "pin5"]} /></div>
            <div className="isStrong"><span>順子・刻子</span><TileRow tiles={["pin4", "pin5", "pin6", "pin5", "pin5", "pin5"]} /></div>
          </div>
          <div className="strategyActionBox"><b>完成形</b><p>最終目標は4面子1雀頭です。すでに面子候補が足りている手では、孤立牌に牌がくっついても候補が入れ替わるだけで、シャンテン数が進まないことがあります。</p></div>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">PRACTICE</p>
          <h2>リーチボタンが出る前に受け入れを予測する</h2>
          <ol>
            <li><strong>テンパイ・一向聴・二向聴以下の3段階を見分ける</strong></li>
            <li><strong>一向聴なら、何を引くとテンパイするか全部探す</strong></li>
            <li><strong>ネット麻雀では、リーチボタンが出る前に待ちを予測する</strong></li>
            <li><strong>予想外の牌でボタンが出たら、牌姿を分解して理由を確認する</strong></li>
          </ol>
          <p>鳴いた後も、牌へカーソルを合わせて待ち表示を見る前に「何を切れば何待ちになるか」を考えると、受け入れを見抜く力が育ちます。</p>
        </section>

        <section className="videoArticleCaution">
          <p className="videoArticleSectionLabel">CAUTION</p>
          <h2>受け入れが最大なら必ず正解、ではない</h2>
          <p>実戦では、打点、役、待ちの良さ、安全度も比較します。ただし、それらを比べるためにも、まず各打牌の受け入れを正しく把握することが土台になります。</p>
        </section>

        <section className="videoArticleNext">
          <p className="videoArticleSectionLabel">NEXT STEP</p>
          <h2>手牌を入力して受け入れを確かめる</h2>
          <div>
            <Link href="/analysis/mahjong-tool">牌理チェッカーで受け入れを確認する</Link>
            <Link href="/videos/strategy/tile-efficiency-four-rules">牌効率の4法則へ進む</Link>
            <Link href="/videos/strategy/seven-important-shapes-to-memorize">重要な牌の形7選を覚える</Link>
            <Link href="/trainer">何切る問題で判断を試す</Link>
          </div>
        </section>
      </article>
    </main>
  );
}

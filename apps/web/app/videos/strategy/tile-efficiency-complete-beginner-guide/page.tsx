import type { Metadata } from "next";
import Link from "next/link";
import { HirasawaTileEfficiencyBook } from "../../../components/VideoBookRecommendation";

export const metadata: Metadata = {
  title: "麻雀の牌効率を基礎から学ぶ｜初心者向け完全ガイド",
  description: "麻雀初心者向けに、シャンテン数、受け入れ、孤立牌、5ブロック理論、完全イーシャンテン・くっつき・ヘッドレスを牌図で解説します。"
};

const videoUrl = "https://www.youtube.com/watch?v=Q05otKQCgeU";
const tileNames: Record<string, string> = {
  man1: "一萬", man2: "二萬", man3: "三萬", man4: "四萬", man5: "五萬", man6: "六萬", man7: "七萬", man8: "八萬", man9: "九萬",
  pin1: "一筒", pin2: "二筒", pin3: "三筒", pin4: "四筒", pin5: "五筒", pin6: "六筒", pin7: "七筒", pin8: "八筒", pin9: "九筒",
  sou1: "一索", sou2: "二索", sou3: "三索", sou4: "四索", sou5: "五索", sou6: "六索", sou7: "七索", sou8: "八索", sou9: "九索",
  ji1: "東", ji3: "西", ji7: "中"
};

function TileRow({ tiles }: { tiles: string[] }) {
  return (
    <div className={tiles.length >= 10 ? "videoArticleFullHand" : undefined}>
      {tiles.map((tile, index) => <img key={`${tile}-${index}`} src={`/tiles/${tile}-66-90-l-emb.png`} alt={tileNames[tile]} />)}
    </div>
  );
}

export default function TileEfficiencyCompleteBeginnerGuidePage() {
  return (
    <main className="siteMain videoArticlePage tileEfficiencyCompletePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト"><Link href="/">トップ</Link><span>›</span><Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span><Link href="/videos/strategy/beginner">初心者向け</Link><span>›</span><span>牌効率・完全入門</span></nav>
          <p className="siteEyebrow">BEGINNER VIDEO GUIDE / 牌効率総まとめ</p>
          <h1>麻雀初心者のための牌効率・完全入門</h1>
          <p className="videoArticleLead">牌効率は、手牌だけを見て、できるだけ早くテンパイへ近づくための技術です。約53分の動画を、実戦中に見る順番に沿って4段階へ整理しました。</p>
          <div className="videoArticleByline"><span>紹介動画: 平澤元気麻雀ch</span><time>動画公開日 2023年3月18日</time><span>約15分で読める</span></div>
        </header>

        <div className="videoArticleEmbed"><iframe src="https://www.youtube-nocookie.com/embed/Q05otKQCgeU" title="麻雀初心者向け牌効率の基礎を徹底解説" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div>
        <p className="videoSourceNote">動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">元動画をYouTubeで見る</a></p>

        <section className="videoArticleAudience">
          <div><p className="videoArticleSectionLabel">RECOMMENDED FOR</p><h2>この動画はこんな人に向いています</h2></div>
          <ul><li>牌効率を何から勉強すればよいか迷っている人</li><li>受け入れを毎回数えるのが難しい人</li><li>序盤とイーシャンテンで同じ切り方をしている人</li><li>完全イーシャンテンやヘッドレスを基礎から知りたい人</li></ul>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">LEARNING MAP</p><h2>手牌の進み具合で見る場所を変える</h2>
          <div className="videoPrincipleList">
            <div className="videoPrinciple"><span className="videoPrincipleNumber">1</span><div className="videoPrincipleBody"><h3>シャンテン数と受け入れ</h3><p>何を引けばテンパイへ一段近づくかを把握します。</p></div></div>
            <div className="videoPrinciple"><span className="videoPrincipleNumber">2</span><div className="videoPrincipleBody"><h3>序盤は孤立牌を整理</h3><p>つながりの弱い字牌・1・9・2・8から順に候補を絞ります。</p></div></div>
            <div className="videoPrinciple"><span className="videoPrincipleNumber">3</span><div className="videoPrincipleBody"><h3>孤立牌が消えたらブロック数</h3><p>6ブロックなら、弱い候補をひとつ外して5ブロックにします。</p></div></div>
            <div className="videoPrinciple"><span className="videoPrincipleNumber">4</span><div className="videoPrincipleBody"><h3>イーシャンテンは形を見分ける</h3><p>完全形・くっつき・ヘッドレスの強みを使って受け入れを広げます。</p></div></div>
          </div>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">STEP 1 / SHANTEN</p><h2>最初に「あと何手でテンパイか」を見る</h2>
          <div className="videoArticleTileBlocks">
            <div className="fullHandBlock"><span>一向聴の13枚例</span><TileRow tiles={["man1", "man2", "man3", "pin3", "pin4", "pin5", "sou3", "sou4", "sou6", "sou7", "man8", "man8", "ji3"]} /></div>
            <div className="isStrong"><span>面子を完成させる受け入れ</span><TileRow tiles={["sou2", "sou5", "sou8"]} /></div>
            <div><span>不要な孤立牌</span><TileRow tiles={["ji3"]} /></div>
          </div>
          <p>一向聴なら、受け入れを引くとテンパイになります。まずシャンテン数が進む牌を見分け、形が少し良くなるだけの手変わりとは分けて考えます。</p>
          <div className="strategyKeyMessage"><strong>最初の目標:</strong> 打点や細かな場況はいったん後にして、手牌だけならどの打牌が最速テンパイに近づくかを説明できるようにします。</div>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">STEP 2 / ISOLATED TILES</p><h2>序盤は孤立牌の弱い順から整理する</h2>
          <div className="terminalChoiceComparison">
            <div className="isWeak"><span>先に整理</span><TileRow tiles={["ji3", "ji7"]} /><b>役にならない字牌</b></div>
            <div><span>次の候補</span><TileRow tiles={["man1", "pin9"]} /><b>1・9</b></div>
            <div><span>少し残したい</span><TileRow tiles={["sou2", "pin8"]} /><b>2・8</b></div>
            <div className="isStrong"><span>つながりやすい</span><TileRow tiles={["man3", "pin5", "sou7"]} /><b>3〜7</b></div>
          </div>
          <p>中央の牌ほど、周辺の多くの牌とターツを作れます。ただし、すでにある順子の近くに孤立牌がつながっていると、四連形や中ぶくれとして受け入れが増えるため、単純な数字順だけで切りません。</p>
          <div className="videoArticleTileBlocks"><div className="isStrong"><span>四連形</span><TileRow tiles={["man3", "man4", "man5", "man6"]} /></div><div className="isStrong"><span>中ぶくれ</span><TileRow tiles={["pin2", "pin3", "pin3", "pin4"]} /></div><div className="isStrong"><span>一枚飛び</span><TileRow tiles={["sou3", "sou4", "sou5", "sou7"]} /></div></div>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">STEP 3 / FIVE BLOCKS</p><h2>孤立牌がなくなったら5ブロックに整える</h2>
          <p>アガリに必要なのは4面子1雀頭なので、手牌には最終的に5つのブロックが必要です。6ブロックある手は、完成しにくい候補をひとつ外します。</p>
          <div className="videoArticleTileBlocks">
            <div className="isStrong"><span>完成面子</span><TileRow tiles={["man1", "man2", "man3"]} /></div>
            <div className="isStrong"><span>両面</span><TileRow tiles={["pin4", "pin5"]} /></div>
            <div><span>カンチャン</span><TileRow tiles={["sou2", "sou4"]} /></div>
            <div className="isWeak"><span>ペンチャン</span><TileRow tiles={["man8", "man9"]} /></div>
            <div><span>対子</span><TileRow tiles={["pin8", "pin8"]} /></div>
            <div><span>もうひとつの対子</span><TileRow tiles={["ji1", "ji1"]} /></div>
          </div>
          <p>完成面子を壊さず、両面を優先し、カンチャン・ペンチャン・余っている対子を比較します。6ブロックのまま引っ張ると、次に良い牌を引いてもどこかを切る必要があり、手が進みにくくなります。</p>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">STEP 4 / STRONG ONE-AWAY SHAPES</p><h2>強いイーシャンテンを3種類覚える</h2>
          <div className="terminalChoiceComparison">
            <div className="isStrong"><span>完全イーシャンテンの核</span><TileRow tiles={["man3", "man4", "pin6", "pin7", "sou5", "sou5"]} /><b>両面2組と対子を残す</b></div>
            <div><span>くっつきイーシャンテン</span><TileRow tiles={["man4", "pin5"]} /><b>中央の孤立牌へのくっつきを待つ</b></div>
            <div><span>ヘッドレス</span><TileRow tiles={["man3", "man4", "pin6", "pin7", "sou3", "sou4"]} /><b>雀頭がない代わりに受け入れが広い</b></div>
          </div>
          <p>完全イーシャンテンは両面とシャンポンの受け入れを持つ安定形です。くっつきは強い孤立牌、ヘッドレスは暗刻や連続形と組み合わさると、広い受け入れと良い待ちを両立しやすくなります。</p>
          <div className="videoArticleCaution"><strong>形の名前だけで切らない</strong><p>ヘッドレスが強いのは、雀頭候補を作りやすい暗刻・連続形などがある場合です。形の前提を確認せず、対子を何でも切るのはシャンテン戻しにつながります。</p></div>
        </section>

        <section className="videoArticleCaution terminalChoiceChecklist">
          <p className="videoArticleSectionLabel">PRACTICE ROUTINE</p><h2>実戦で迷ったときの確認順</h2>
          <ol><li><b>シャンテン数を戻さない</b><span>唯一の対子・完成面子を先に守ります。</span></li><li><b>孤立牌が残っているか</b><span>残っていれば、つながりの弱い牌から整理します。</span></li><li><b>5ブロックか6ブロックか</b><span>6ブロックなら弱い候補をひとつ外します。</span></li><li><b>イーシャンテンの型を確認する</b><span>完全形・くっつき・ヘッドレスのどれに近いかを見ます。</span></li></ol>
        </section>

        <HirasawaTileEfficiencyBook />

        <section className="videoArticleNext">
          <p className="videoArticleSectionLabel">NEXT STEP</p><h2>総合講座を問題で定着させる</h2>
          <div><Link href="/videos/strategy/tile-efficiency-four-rules">初心者向け牌効率の4法則を見る</Link><Link href="/analysis/mahjong-tool">牌理チェッカーで受け入れを確認する</Link><Link href="/trainer">何切る問題で練習する</Link></div>
        </section>
      </article>
    </main>
  );
}

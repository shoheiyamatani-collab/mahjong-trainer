import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "麻雀は鳴いてテンパイした後も手を良くできる",
  description: "副露してテンパイした後、さらにチー・ポンして打点を上げたり、カンチャンを両面へ変えたりする方法を牌図で解説します。"
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
          <div className="videoArticleByline"><span>紹介動画: 発男道場【麻雀解説ch】</span><time>動画公開日 2024年6月1日</time><span>約9分で読める</span></div>
        </header>

        <div className="videoArticleEmbed"><iframe src="https://www.youtube-nocookie.com/embed/E6kwxNECnXI" title="鳴いて聴牌した後の重要な思考" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div>
        <p className="videoSourceNote">動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">元動画をYouTubeで見る</a></p>

        <section className="videoArticleAudience"><div><p className="videoArticleSectionLabel">RECOMMENDED FOR</p><h2>この動画はこんな人に向いています</h2></div><ul><li>鳴いてテンパイしたら手を止めてしまう人</li><li>安い手を少しでも高くしたい人</li><li>カンチャンやシャンポンを良形へ変えたい人</li><li>食い替えなど鳴きの注意点も知りたい人</li></ul></section>

        <section className="videoArticleBodySection terminalChoiceBaseline">
          <p className="videoArticleSectionLabel">TWO GOALS</p><h2>探すのは「打点アップ」と「待ち改善」</h2>
          <div className="terminalChoiceComparison"><div className="isStrong"><span>打点を上げる</span><TileRow tiles={["man1", "man2", "man3", "man7", "man8", "man9"]} /><b>一気通貫などの役を加える</b></div><div className="isStrong"><span>待ちを広げる</span><TileRow tiles={["pin3", "pin5", "pin6", "pin7"]} /><b>カンチャンから両面へ</b></div></div>
          <p>すでに役のあるテンパイでも、別の牌を鳴いて手牌を組み直せます。動画では、三色同順・一気通貫・赤牌などで打点を上げるケースと、待ちの種類や枚数を改善するケースを分けて解説しています。</p>
          <div className="strategyKeyMessage"><strong>テンパイ後の習慣:</strong> 鳴ける牌が出たら「今の待ちより高くなるか、広くなるか」を一度確認してから見送ります。</div>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">SCORE UP</p><h2>鳴き直して役や赤牌を加える</h2>
          <div className="videoArticleTileBlocks"><div><span>役牌で1役を確保</span><TileRow tiles={["ji7", "ji7", "ji7"]} /></div><div><span>一気通貫の種</span><TileRow tiles={["man1", "man2", "man3", "man4", "man5", "man6", "man7", "man8", "man9"]} /></div><div className="isStrong"><span>三色同順の種</span><TileRow tiles={["man3", "man4", "man5", "pin3", "pin4", "pin5", "sou3", "sou4", "sou5"]} /></div></div>
          <p>役牌などでアガリ役がすでにあるなら、別の順子を鳴き直して一気通貫や三色同順を完成させられる場合があります。赤5を含む面子へ入れ替えられるなら、役が増えなくても打点が上がります。</p>
          <p className="terminalChoiceCaution"><strong>確認:</strong> 鳴いたことで元の役が消えないか、食い下がりで翻数がどう変わるかを確認します。</p>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">WAIT UP</p><h2>愚形を両面・多面待ちへ変える</h2>
          <div className="terminalChoiceComparison"><div className="isWeak"><span>現在のカンチャン</span><TileRow tiles={["man1", "man3"]} /><b>二萬だけを待つ</b></div><div className="isStrong"><span>鳴いた後の両面候補</span><TileRow tiles={["man3", "man4"]} /><b>二・五萬を待つ</b></div><div className="isStrong"><span>シャンポンから両面へ</span><TileRow tiles={["sou2", "sou2", "sou3", "sou4"]} /><b>関連牌を鳴いて再構成</b></div></div>
          <p>カンチャン・単騎・シャンポンの近くにある牌を鳴くと、残った牌が両面になることがあります。形が良くなるかだけでなく、鳴いた牌と場に見えている牌を除いた実際の待ち枚数で比べます。</p>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">TRADEOFF</p><h2>待ちが変わるだけなら、本当に得かを比べる</h2>
          <div className="videoArticleTileBlocks"><div><span>今の待ち</span><TileRow tiles={["pin2", "pin5"]} /></div><div><span>鳴いた後の待ち</span><TileRow tiles={["pin4", "pin7"]} /></div><div className="isWeak"><span>場に多く見えている</span><TileRow tiles={["pin4", "pin4", "pin7"]} /></div></div>
          <p>両面から別の両面へ変わるだけなら、見た目だけでは優劣を決められません。残り枚数、山にいそうか、危険牌を切る必要があるか、打点が下がらないかまで比較します。</p>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">RULE CHECK</p><h2>食い替えとフリテンに注意する</h2>
          <div className="videoArticleTileBlocks"><div className="isWeak"><span>同じ順子を入れ替える鳴き</span><TileRow tiles={["man3", "man4", "man5", "man5"]} /></div><div className="isWeak"><span>自分の捨て牌に待ち牌</span><TileRow tiles={["sou2", "sou5"]} /></div></div>
          <p>鳴いた牌と同じ牌や、同じ順子を作る牌を直後に切る食い替えは、多くのルールで禁止されています。また、待ちを変えた結果、自分の捨て牌に新しい待ち牌があればフリテンになります。</p>
        </section>

        <section className="videoArticleCaution terminalChoiceChecklist"><p className="videoArticleSectionLabel">CHECK ORDER</p><h2>鳴く前の確認順</h2><ol><li><b>アガリ役が残るか</b><span>鳴き直して役なしにならないか確認します。</span></li><li><b>打点が上がるか</b><span>役・ドラ・赤牌の変化を比べます。</span></li><li><b>待ち枚数が増えるか</b><span>場に見えている枚数も差し引きます。</span></li><li><b>危険牌を切らないか</b><span>手を良くする代わりに放銃リスクが上がらないか見ます。</span></li><li><b>食い替え・フリテンを確認する</b><span>ルール上アガれる形か最後に確認します。</span></li></ol></section>

        <section className="videoArticleNext"><p className="videoArticleSectionLabel">NEXT STEP</p><h2>鳴きと待ちを練習する</h2><div><Link href="/videos/strategy/calling-to-improve-wait-quiz">待ちを良くする何鳴く問題を解く</Link><Link href="/rules/practical-waits">待ち一覧を確認する</Link><Link href="/analysis/mahjong-tool">牌理チェッカーで待ちを比べる</Link></div></section>
      </article>
    </main>
  );
}

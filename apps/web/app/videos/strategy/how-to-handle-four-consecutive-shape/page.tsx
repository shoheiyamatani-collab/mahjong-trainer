import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "麻雀の4連形はどこまで残す？｜崩す場面と判断基準",
  description: "麻雀中級者向けに、3456などの4連形を残す場面と崩す場面を牌図で解説。最終待ち、巡目、ドラ、ほかのターツから判断する方法を紹介します。"
};

const videoUrl = "https://www.youtube.com/watch?v=OEy1gpsVuQo";

const tileNames: Record<string, string> = {
  man1: "一萬", man2: "二萬", man3: "三萬", man4: "四萬", man5: "五萬",
  man6: "六萬", man7: "七萬", man8: "八萬", man9: "九萬",
  pin1: "一筒", pin2: "二筒", pin3: "三筒", pin4: "四筒", pin5: "五筒",
  pin6: "六筒", pin7: "七筒", pin8: "八筒",
  sou2: "二索", sou3: "三索", sou4: "四索", sou6: "六索", sou7: "七索", sou8: "八索"
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

export default function FourConsecutiveShapePage() {
  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト">
            <Link href="/">トップ</Link><span>›</span>
            <Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span>
            <Link href="/videos/strategy/advanced">中級者以上向け</Link><span>›</span>
            <span>4連形の扱い</span>
          </nav>
          <p className="siteEyebrow">INTERMEDIATE VIDEO GUIDE / 牌効率・4連形</p>
          <h1>4連形はどこまで残す？判断の基準</h1>
          <p className="videoArticleLead">3456のように4枚が連続した4連形は、面子・両面・三面張へ育つ強い形です。ただし「強いから最後まで残す」だけでは不十分です。崩した後の待ち、巡目、打点を比べて、変化を見る時間があるかを判断します。</p>
          <div className="videoArticleByline"><span>紹介動画: 発男道場【麻雀解説ch】</span><time>動画公開日 2026年5月9日</time><span>約11分で読める</span></div>
        </header>

        <div className="videoArticleEmbed">
          <iframe
            src="https://www.youtube-nocookie.com/embed/OEy1gpsVuQo"
            title="【麻雀解説】4連形は良い形だけど…どこまで残すべきなのか？ポイントや基準を解説"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <p className="videoSourceNote">動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">発男道場【麻雀解説ch】の元動画をYouTubeで見る</a></p>

        <section className="videoArticleAudience">
          <div><p className="videoArticleSectionLabel">RECOMMENDED FOR</p><h2>この動画はこんな人に向いています</h2></div>
          <ul>
            <li>4連形を見つけると無条件で残してしまう人</li>
            <li>受け入れ最大と良形変化のどちらを優先するか迷う人</li>
            <li>一向聴から二向聴へ戻す判断を学びたい人</li>
            <li>巡目に応じて手組みを切り替えたい人</li>
          </ul>
        </section>

        <section className="videoArticleBodySection terminalChoiceBaseline">
          <p className="videoArticleSectionLabel">SHAPE BASICS</p>
          <h2>4連形は「1面子＋もう1ブロック」へ育ちやすい</h2>
          <div className="terminalChoiceComparison">
            <div className="isStrong"><span>基本の4連形</span><TileRow tiles={["pin3", "pin4", "pin5", "pin6"]} /><b>三・四・五・六筒が連続</b></div>
            <div><span>ノベタンとして使う</span><TileRow tiles={["man3", "man4", "man5", "man6"]} /><b>雀頭がなければ三萬・六萬</b></div>
          </div>
          <div className="strategyKeyMessage"><strong>4連形は待ちの名前ではなく、手作りの途中にある変化の大きい形です。</strong>雀頭がないときはノベタンとして使え、牌を1枚引けば両面や三面張を含む複合形へ伸びます。</div>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">WHY IT IS STRONG</p>
          <h2>3456から生まれる代表的な変化</h2>
          <div className="videoArticleTileBlocks">
            <div><span>元の形</span><TileRow tiles={["pin3", "pin4", "pin5", "pin6"]} /></div>
            <div className="isStrong"><span>二筒を引く</span><TileRow tiles={["pin2", "pin3", "pin4", "pin5", "pin6"]} /></div>
            <div className="isStrong"><span>七筒を引く</span><TileRow tiles={["pin3", "pin4", "pin5", "pin6", "pin7"]} /></div>
            <div><span>三筒を引く</span><TileRow tiles={["pin3", "pin3", "pin4", "pin5", "pin6"]} /></div>
          </div>
          <p>二筒を引いた23456は一・四・七筒、七筒を引いた34567は二・五・八筒が使える三面張の種になります。三筒や六筒を重ねれば、1面子と雀頭候補として使えます。四筒や五筒を引いても、1面子と両面を作れるのが強みです。</p>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">SHAPE VALUE</p>
          <h2>同じ4連形でも中央にあるほど変化が多い</h2>
          <div className="terminalChoiceComparison">
            <div className="isStrong"><span>中央の4連形</span><TileRow tiles={["man3", "man4", "man5", "man6"]} /><b>両側へ三面張変化がある</b></div>
            <div><span>端寄りの4連形</span><TileRow tiles={["man2", "man3", "man4", "man5"]} /><b>十分強いが、中央より変化は少ない</b></div>
            <div className="isWeak"><span>端の連続形</span><TileRow tiles={["man1", "man2", "man3", "man4"]} /><b>一二三が面子なら四萬のくっつきに近い</b></div>
          </div>
          <p>3456は左右のどちらへ伸びても強く、2345も残す価値があります。一方、1234は一二三がすでに面子として完成しているため、四萬のくっつきとして見る場面が増えます。「4枚連続」という見た目だけで同じ価値だと考えないことが大切です。</p>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">KEEP IT</p>
          <h2>序盤で最終待ちが愚形に固定されるなら4連形を残す</h2>
          <div className="videoArticleTileBlocks">
            <div className="isStrong"><span>変化を見たい4連形</span><TileRow tiles={["pin3", "pin4", "pin5", "pin6"]} /></div>
            <div className="isWeak"><span>残っている愚形</span><TileRow tiles={["sou7", "sou9"]} /></div>
            <div><span>弱い待ちの例</span><TileRow tiles={["man2", "man4"]} /></div>
          </div>
          <p>4連形を崩せば一向聴を維持できても、どの有効牌を引いてもカンチャンやペンチャンにしかならないことがあります。序盤なら、瞬間の受け入れを少し減らしたり、二向聴へ戻したりしても、4連形の良形変化を残す価値があります。</p>
          <div className="strategyActionBox"><b>動画の重要な基準</b><p>「先にテンパイできるか」だけでなく、「テンパイしたときに良い待ちになるか」を比べます。愚形テンパイしか見えないほど、4連形の価値は上がります。</p></div>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">BREAK IT</p>
          <h2>良形受けが十分なら4連形を崩す選択もある</h2>
          <div className="videoArticleTileBlocks">
            <div><span>4連形</span><TileRow tiles={["pin3", "pin4", "pin5", "pin6"]} /></div>
            <div className="isStrong"><span>すでにある両面</span><TileRow tiles={["man6", "man7"]} /></div>
            <div><span>ほかのターツ</span><TileRow tiles={["sou2", "sou4"]} /></div>
          </div>
          <p>ほかに両面があり、4連形を崩しても良形テンパイへ進む受け入れが十分に残るなら、4連形だけを特別扱いしません。特に中盤以降は、将来の変化を待つ時間が減るため、今あるテンパイ受け入れを優先しやすくなります。</p>
          <p className="terminalChoiceCaution"><strong>注意:</strong> カンチャンや対子が複合した部分との比較は繊細です。崩した後の良形受けが何枚残るか、先切りによって待ちの出やすさが変わるかまで確認します。</p>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">ROUND AND VALUE</p>
          <h2>巡目と打点で「変化を待てる時間」が変わる</h2>
          <div className="videoPrincipleList">
            <section className="videoPrinciple">
              <div className="videoPrincipleNumber">1</div>
              <div className="videoPrincipleBody"><h3>序盤は4連形を育てやすい</h3><p>5巡目前後なら良形変化を待つ余裕があります。瞬間の受け入れだけで崩さず、最終形を良くする選択を比べます。</p></div>
            </section>
            <section className="videoPrinciple">
              <div className="videoPrincipleNumber">2</div>
              <div className="videoPrincipleBody"><h3>中盤以降はテンパイ速度を上げる</h3><p>10巡目前後になると、形の変化を待つ価値は下がります。シャンテン数と今ある受け入れを優先する場面が増えます。</p></div>
            </section>
            <section className="videoPrinciple">
              <div className="videoPrincipleNumber">3</div>
              <div className="videoPrincipleBody"><h3>高打点なら愚形テンパイにも価値がある</h3><p>ドラを多く持つ手は、愚形でも先にテンパイする価値が上がります。打点が十分なら4連形を崩す判断も候補です。</p></div>
            </section>
          </div>
        </section>

        <section className="videoArticleCaution terminalChoiceChecklist">
          <p className="videoArticleSectionLabel">CHECK ORDER</p>
          <h2>4連形を残すか迷ったときの確認順</h2>
          <ol>
            <li><b>現在のシャンテン数を見る</b><span>4連形を残すと一向聴を維持できるのか、二向聴へ戻るのか確認します。</span></li>
            <li><b>崩した後の最終待ちを見る</b><span>受け入れが広くても、すべて愚形テンパイなら価値を低く見ます。</span></li>
            <li><b>4連形の位置を見る</b><span>3456、2345、1234の順に変化の量を比較します。</span></li>
            <li><b>巡目を見る</b><span>序盤は変化、中盤以降はテンパイ速度を優先しやすくなります。</span></li>
            <li><b>ドラと場に見えている牌を見る</b><span>打点と有効牌の残り枚数によって、基本判断を調整します。</span></li>
          </ol>
        </section>

        <section className="videoArticleNext">
          <p className="videoArticleSectionLabel">NEXT STEP</p>
          <h2>複合形と受け入れを比較する</h2>
          <div>
            <Link href="/analysis/mahjong-tool">牌理チェッカーで受け入れを比較する</Link>
            <Link href="/videos/strategy/seven-meld-building-shapes">面子を作りやすい7つの形を読む</Link>
            <Link href="/videos/strategy/four-tile-shape-vs-floating-tile">4枚形と孤立牌の比較を読む</Link>
            <Link href="/videos/strategy/advanced">中級者以上向け動画を見る</Link>
          </div>
        </section>
      </article>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "麻雀の役を簡単に覚える方法 | 初心者向け4グループ分類",
  description: "麻雀の役を丸暗記せず、使う牌の種類、面子の形、見た目の規則性、アガり方という4グループに分けて覚える方法を牌図付きで解説します。"
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
          <div className="videoArticleByline"><span>紹介動画: 平澤元気麻雀ch</span><time>動画公開日 2023年6月16日</time><span>約11分で読める</span></div>
        </header>

        <div className="videoArticleEmbed">
          <iframe
            src="https://www.youtube-nocookie.com/embed/-5MwWWHqvWI"
            title="麻雀の役が簡単に頭に入る覚え方のイメージ"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
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

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">START HERE</p>
          <h2>全部覚えなくても麻雀は始められる</h2>
          <p>動画では、役を「同じグループの牌や形を集めたときにもらえるボーナス」と考えます。まずリーチ・タンヤオ・役牌を覚え、対局で見かけた役を少しずつ追加すれば十分です。</p>
          <div className="strategyKeyMessage"><strong>役名より先にイメージを持ちましょう。</strong>「2〜8だけ」「一色だけ」「同じ牌の組だけ」のように見た目で分類できれば、知らない役も後から覚えやすくなります。</div>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">GROUP 1</p>
          <h2>使う牌の種類で覚える</h2>
          <p>数牌と字牌、一色と複数色、2〜8と1・9・字牌という範囲に分けます。使える牌の範囲が狭いほど、一般に作るのが難しくなります。</p>
          <div className="videoArticleTileBlocks">
            <div className="isStrong"><span>2〜8だけならタンヤオ</span><TileRow tiles={["man2", "man3", "man4", "pin4", "pin5", "pin6", "sou6", "sou7", "sou8"]} /></div>
            <div><span>1・9・字牌はヤオチュー牌</span><TileRow tiles={["man1", "man9", "pin1", "pin9", "sou1", "sou9", "ji1", "ji5", "ji6", "ji7"]} /></div>
          </div>
          <div className="videoPrincipleList">
            <section className="videoPrinciple"><div className="videoPrincipleNumber">A</div><div className="videoPrincipleBody"><h3>混一色と清一色</h3><p>一種類の数牌に字牌が混ざれば混一色、字牌もなく一種類の数牌だけなら清一色です。「混ざる」と「混ざらない」を対にして覚えます。</p><TileRow tiles={["man1", "man2", "man3", "man4", "man5", "man6", "ji5", "ji5", "ji5"]} /></div></section>
            <section className="videoPrinciple"><div className="videoPrincipleNumber">B</div><div className="videoPrincipleBody"><h3>チャンタと純チャン</h3><p>すべての面子と雀頭に1・9・字牌が絡むのがチャンタ。そこから字牌を除き、数牌の1・9だけを使うのが純チャンです。</p><TileRow tiles={["man1", "man2", "man3", "pin7", "pin8", "pin9", "ji7", "ji7", "ji7"]} /></div></section>
          </div>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">GROUP 2</p>
          <h2>面子の形で覚える</h2>
          <p>順子、刻子、対子のどれを集めているかを見る方法です。形がそろっているほど、対応する役を見つけやすくなります。</p>
          <div className="videoArticleTileBlocks">
            <div><span>順子</span><TileRow tiles={["man2", "man3", "man4"]} /></div>
            <div className="isStrong"><span>刻子</span><TileRow tiles={["pin7", "pin7", "pin7"]} /></div>
            <div><span>対子</span><TileRow tiles={["sou3", "sou3", "sou6", "sou6", "ji5", "ji5"]} /></div>
          </div>
          <ul>
            <li><strong>刻子を4組作る:</strong> 対々和。門前で刻子を3組作れば三暗刻、4組なら四暗刻へつながります。</li>
            <li><strong>対子を7組作る:</strong> 七対子。通常の4面子1雀頭とは別のアガリ形です。</li>
            <li><strong>順子中心で符が付かない形にする:</strong> 平和。門前、両面待ち、役牌ではない雀頭などの条件も確認します。</li>
          </ul>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">GROUP 3</p>
          <h2>見た目の規則性で覚える</h2>
          <p>同じ数字、同じ順子、1から9までの並びなど、見た目に意味がある役です。牌を並べると条件をそのまま確認できます。</p>
          <div className="videoArticleTileBlocks">
            <div className="isStrong"><span>三色同順: 3・4・5を三色で</span><TileRow tiles={["man3", "man4", "man5", "pin3", "pin4", "pin5", "sou3", "sou4", "sou5"]} /></div>
            <div><span>一気通貫: 同じ色で1〜9</span><TileRow tiles={["man1", "man2", "man3", "man4", "man5", "man6", "man7", "man8", "man9"]} /></div>
            <div><span>一盃口: 同じ順子を2組</span><TileRow tiles={["pin3", "pin4", "pin5", "pin3", "pin4", "pin5"]} /></div>
          </div>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">GROUP 4</p>
          <h2>アガり方で覚える</h2>
          <p>牌の形ではなく、どうアガったかで付く役もあります。門前で自分のツモ牌によりアガる門前ツモ、リーチ後の一発、海底・河底などがこの仲間です。</p>
          <div className="strategyActionBox"><b>覚え方</b><p>手牌を見て探す役と、アガった瞬間に決まる役を分けましょう。偶然付く役を最初から狙いすぎる必要はありません。</p></div>
        </section>

        <section className="videoArticleCaution">
          <p className="videoArticleSectionLabel">CAUTION</p>
          <h2>平和は「順子だけ」では完成しない</h2>
          <p>順子中心の役として覚えると分かりやすい一方、実際には門前、両面待ち、役牌ではない雀頭、符が付かない面子という条件があります。詳しい条件は役一覧の牌姿で確認しましょう。</p>
        </section>

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

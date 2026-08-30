import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "麻雀の副露率は何％が正解？初心者向け鳴きの考え方",
  description: "麻雀の副露率に唯一の正解がない理由と、ポン・チーによる速度、打点、守備の変化を牌図で比較し、牌譜から鳴きを改善する方法を解説します。"
};

const videoUrl = "https://www.youtube.com/watch?v=Fm-GacaIVIc";

const tileNames: Record<string, string> = {
  man1: "一萬", man2: "二萬", man3: "三萬", man4: "四萬", man5: "五萬", man6: "六萬", man7: "七萬", man8: "八萬", man9: "九萬",
  pin1: "一筒", pin2: "二筒", pin3: "三筒", pin4: "四筒", pin5: "五筒", pin6: "六筒", pin7: "七筒", pin8: "八筒", pin9: "九筒",
  sou1: "一索", sou2: "二索", sou3: "三索", sou4: "四索", sou5: "五索", sou6: "六索", sou7: "七索", sou8: "八索", sou9: "九索",
  ji5: "白", ji6: "發", ji7: "中"
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

export default function HowToReadFuuroRatePage() {
  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト"><Link href="/">トップ</Link><span>›</span><Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span><span>副露率の考え方</span></nav>
          <p className="siteEyebrow">VIDEO GUIDE / 鳴き・成績分析</p>
          <h1>副露率だけで「鳴きすぎ」を判断しない</h1>
          <p className="videoArticleLead">ネット麻雀の成績画面には副露率が表示されます。しかし、強い人にもよく鳴く人と門前を重視する人がいます。大切なのは割合を合わせることではなく、一つひとつの鳴きが得だったかを考えることです。</p>
          <div className="videoArticleByline"><span>紹介動画: 平澤元気麻雀ch</span><time>動画公開日 2019年6月21日</time><span>約10分で読める</span></div>
        </header>

        <div className="videoArticleEmbed">
          <iframe
            src="https://www.youtube-nocookie.com/embed/Fm-GacaIVIc"
            title="強くなるための数値の考え方と副露率"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <p className="videoSourceNote">動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">平澤元気麻雀chの元動画をYouTubeで見る</a></p>

        <section className="videoArticleAudience">
          <div><p className="videoArticleSectionLabel">RECOMMENDED FOR</p><h2>この動画はこんな人に向いています</h2></div>
          <ul>
            <li>自分の副露率を見て、鳴きすぎか不安になった人</li>
            <li>強い人と同じ副露率にすれば勝てると思っていた人</li>
            <li>ポン・チーの速さと、打点・守備の差を整理したい人</li>
            <li>成績画面を上達へどう使えばよいか知りたい人</li>
          </ul>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">DEFINITION</p>
          <h2>副露率は「鳴いた局の割合」</h2>
          <p>副露率は、打った局のうちポン・チー・明槓をした局がどれくらいあったかを表す数字です。10局のうち3局で鳴けば、おおよそ30％になります。</p>
          <div className="strategyKeyMessage"><strong>副露率は結果の集計です。</strong>その30％の鳴きが正しかったか、鳴かなかった70％が正しかったかまでは、数字だけでは分かりません。</div>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">OPEN OR CLOSED</p>
          <h2>鳴きと門前には、それぞれ長所がある</h2>
          <div className="videoArticleTileBlocks">
            <div className="isStrong"><span>鳴く前の手牌</span><TileRow tiles={["man1", "man2", "man3", "man4", "man5", "man6", "pin4", "pin5", "sou5", "sou5", "ji5", "ji5", "pin9"]} /></div>
            <div><span>白をポンして打9筒</span><TileRow tiles={["man1", "man2", "man3", "man4", "man5", "man6", "pin4", "pin5", "sou5", "sou5", "ji5", "ji5", "ji5"]} /></div>
          </div>
          <div className="videoPrincipleList">
            <section className="videoPrinciple"><div className="videoPrincipleNumber">鳴</div><div className="videoPrincipleBody"><h3>鳴くと速度が上がる</h3><p>他家の捨て牌を使えるため、テンパイやアガリへ近づきやすくなります。役牌のポンなど、鳴いても役が確定する手は初心者にも使いやすい形です。</p></div></section>
            <section className="videoPrinciple"><div className="videoPrincipleNumber">門</div><div className="videoPrincipleBody"><h3>門前は打点と守備を残しやすい</h3><p>リーチや門前役を狙え、手牌が13枚あるため安全牌も持ちやすくなります。一方で、鳴くよりアガリまで時間がかかります。</p></div></section>
          </div>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">NO SINGLE ANSWER</p>
          <h2>副露率に唯一の正解がない4つの理由</h2>
          <ol>
            <li><strong>鳴いても鳴かなくても期待値が近い局面がある:</strong> 微差の選択が積み重なると、副露率だけは大きく変わります。</li>
            <li><strong>鳴いてもアガれなかった局が多く含まれる:</strong> 副露率だけでは、鳴きが結果へどれだけ影響したか分かりません。</li>
            <li><strong>相手の読みや守備力で鳴きの効果が変わる:</strong> 待ちや役を読まれて止められる卓では、仕掛けの価値が下がる場合があります。</li>
            <li><strong>門前型には高い守備力が必要:</strong> 鳴かずにアガれなかった局で、きちんと放銃を避けられるかが成績を左右します。</li>
          </ol>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">ROUGH GUIDE</p>
          <h2>30〜40％は目標ではなく、確認の目安</h2>
          <p>動画では、初中級者が大きく偏っていないかを見る範囲として、30〜40％程度が紹介されています。ただし、この範囲へ数字を合わせれば強くなるという意味ではありません。</p>
          <div className="videoArticleTileBlocks">
            <div><span>門前寄り</span><strong>約30％</strong></div>
            <div className="isStrong"><span>幅のある目安</span><strong>30〜40％</strong></div>
            <div><span>副露寄り</span><strong>約40％</strong></div>
          </div>
          <p>強い打ち手でも、門前寄りなら25％前後、副露寄りなら45％前後になることがあります。数字は打ち方の特徴であり、単独の成績表ではありません。</p>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">REVIEW</p>
          <h2>副露率ではなく、牌譜の鳴きを一つずつ見る</h2>
          <ol>
            <li><strong>鳴くとシャンテン数が進んだか</strong></li>
            <li><strong>鳴いた後もアガれる役が残っているか</strong></li>
            <li><strong>打点を下げる代わりに十分速くなったか</strong></li>
            <li><strong>鳴いた後の待ちと守備力はどう変わったか</strong></li>
            <li><strong>巡目と点数状況に合った鳴きだったか</strong></li>
          </ol>
          <div className="strategyActionBox"><b>改善方法</b><p>成績画面で割合を見た後は、実際の牌譜を開きます。「あと3％鳴く」ではなく、「この白はポンする」「このカンチャンは鳴かない」と具体的な判断を直します。</p></div>
        </section>

        <section className="videoArticleCaution">
          <p className="videoArticleSectionLabel">CAUTION</p>
          <h2>数字だけで打ち方を変えない</h2>
          <p>副露率が低いから無理に鳴く、副露率が高いから鳴ける役牌を見送る、といった調整は逆効果になることがあります。局面ごとの判断を改善した結果として、副露率が変わる順番が自然です。</p>
        </section>

        <section className="videoArticleNext">
          <p className="videoArticleSectionLabel">NEXT STEP</p>
          <h2>鳴きの条件と実戦判断を確認する</h2>
          <div>
            <Link href="/learn/calling">鳴きの基本を復習する</Link>
            <Link href="/videos/strategy/calling-to-improve-wait-quiz">何鳴く問題で待ちを比較する</Link>
            <Link href="/videos/strategy/after-calling-tenpai">鳴いた後の手変わりを学ぶ</Link>
            <Link href="/trainer">実戦問題で判断を試す</Link>
          </div>
        </section>
      </article>
    </main>
  );
}

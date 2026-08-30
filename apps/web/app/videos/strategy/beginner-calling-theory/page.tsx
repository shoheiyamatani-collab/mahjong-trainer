import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "麻雀初心者の鳴き方｜まず覚えたいポン・チーの3基準",
  description: "麻雀初心者向けに、役牌、役がある愚形、鳴けばテンパイの3場面でポン・チーする考え方を実戦的な牌姿で解説します。"
};

const videoUrl = "https://www.youtube.com/watch?v=KkjFCbiGrY0";
const tileNames: Record<string, string> = {
  man1: "一萬", man2: "二萬", man3: "三萬", man4: "四萬", man5: "五萬", man6: "六萬", man9: "九萬",
  pin3: "三筒", pin4: "四筒", pin5: "五筒", pin6: "六筒", pin7: "七筒", pin8: "八筒",
  sou2: "二索", sou3: "三索", sou4: "四索", sou5: "五索", sou6: "六索", sou7: "七索", sou9: "九索",
  ji7: "中"
};

function TileRow({ tiles }: { tiles: string[] }) {
  return (
    <div className={tiles.length >= 10 ? "videoArticleFullHand" : undefined}>
      {tiles.map((tile, index) => (
        <img key={`${tile}-${index}`} src={`/tiles/${tile}-66-90-l-emb.png`} alt={tileNames[tile]} />
      ))}
    </div>
  );
}

export default function BeginnerCallingTheoryPage() {
  return (
    <main className="siteMain videoArticlePage beginnerCallingTheoryPage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト">
            <Link href="/">トップ</Link><span>›</span>
            <Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span>
            <Link href="/videos/strategy/beginner">初心者向け</Link><span>›</span>
            <span>鳴きの3つのセオリー</span>
          </nav>
          <p className="siteEyebrow">BEGINNER VIDEO GUIDE / ポン・チー</p>
          <h1>初心者がまず覚えたい、鳴きの3つのセオリー</h1>
          <p className="videoArticleLead">鳴くと手は早く進みますが、リーチができなくなり、守りに使える牌も減ります。この動画は、細かな例外を覚える前に使える「まずはこの3場面で鳴いてみる」という基準を解説しています。</p>
          <div className="videoArticleByline"><span>紹介動画: 平澤元気麻雀ch</span><time>動画公開日 2021年3月3日</time><span>約9分で読める</span></div>
        </header>

        <div className="videoArticleEmbed"><iframe src="https://www.youtube-nocookie.com/embed/KkjFCbiGrY0" title="初心者でも暗記すれば70点が取れる鳴きのセオリー" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div>
        <p className="videoSourceNote">動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">元動画をYouTubeで見る</a></p>

        <section className="videoArticleAudience">
          <div><p className="videoArticleSectionLabel">RECOMMENDED FOR</p><h2>この動画はこんな人に向いています</h2></div>
          <ul><li>ポン・チーしてよい場面が分からない人</li><li>鳴かずに受けて、手が間に合わないことが多い人</li><li>鳴いた後に役がなくなるのが不安な人</li><li>細かな例外より先に、簡単な判断軸が欲しい人</li></ul>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">THREE RULES</p><h2>最初は3つの場面を見分ける</h2>
          <div className="videoPrincipleList">
            <div className="videoPrinciple"><span className="videoPrincipleNumber">1</span><div className="videoPrincipleBody"><h3>役牌の対子はポン</h3><p>中・白・發、自風・場風を3枚組にすると役が確定し、その後はチーやポンを使って手を進められます。</p></div></div>
            <div className="videoPrinciple"><span className="videoPrincipleNumber">2</span><div className="videoPrincipleBody"><h3>役がある手の愚形は鳴く</h3><p>カンチャン・ペンチャン・シャンポンは受け入れが少なめです。役が残るなら、鳴いて苦しい部分を先に完成させます。</p></div></div>
            <div className="videoPrinciple"><span className="videoPrincipleNumber">3</span><div className="videoPrincipleBody"><h3>鳴けばテンパイなら鳴く</h3><p>イーシャンテンとテンパイには大きな差があります。まずアガリ牌を待てる状態まで進めることを優先します。</p></div></div>
          </div>
          <div className="strategyKeyMessage"><strong>大前提:</strong> 鳴く前に「鳴いた後も役が残るか」を確認します。役が分からない手で鳴くと、形が完成してもアガれないことがあります。</div>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">RULE 1 / YAKUHAI</p><h2>役牌は1枚目からポンを考える</h2>
          <div className="videoArticleTileBlocks">
            <div className="fullHandBlock"><span>鳴く前の13枚</span><TileRow tiles={["man1", "man2", "man3", "man4", "man5", "man6", "pin4", "pin5", "sou3", "sou4", "sou5", "ji7", "ji7"]} /></div>
            <div className="isStrong"><span>中が出たらポン</span><TileRow tiles={["ji7", "ji7", "ji7"]} /></div>
          </div>
          <p>中をポンすると役がひとつ確定します。残りのカンチャンや両面も鳴けるため、門前のまま進めるよりアガリまでの速度を上げやすくなります。</p>
          <p>1枚目を見送ると、残る中はあと1枚です。その1枚が誰かの手の中や王牌にあれば、もうポンできません。初心者のうちは、役牌の対子を持っているなら1枚目からポンする基準が分かりやすいです。</p>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">RULE 2 / BAD SHAPE</p><h2>役が確定していれば、苦しい形を鳴く</h2>
          <div className="videoArticleTileBlocks">
            <div className="isStrong"><span>役は中で確定</span><TileRow tiles={["ji7", "ji7", "ji7"]} /></div>
            <div className="isWeak"><span>カンチャン</span><TileRow tiles={["pin3", "pin5"]} /></div>
            <div className="isWeak"><span>ペンチャン</span><TileRow tiles={["sou2", "sou3"]} /></div>
            <div className="isWeak"><span>シャンポン</span><TileRow tiles={["man9", "man9", "sou9", "sou9"]} /></div>
          </div>
          <p>両面は通常2種類の牌で完成しますが、カンチャンやペンチャンは1種類です。待っている牌を1枚見送る影響が大きいため、役牌などで役が確定しているなら、チー・ポンで先に完成させる考え方が使えます。</p>
          <div className="videoArticleCaution"><strong>鳴いた結果、別の良い形を壊さないかも確認</strong><p>手牌に必要なブロックが多すぎると、カンチャンをチーした代わりに両面を捨てる場合があります。鳴いた3枚だけでなく、鳴いた後に何を切るかまで決めてから声をかけます。</p></div>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">RULE 3 / TENPAI</p><h2>鳴けばテンパイなら、まずテンパイを取る</h2>
          <div className="videoArticleTileBlocks">
            <div className="fullHandBlock"><span>鳴く前の13枚・イーシャンテン</span><TileRow tiles={["man1", "man2", "man3", "man4", "man5", "man6", "pin4", "pin5", "sou3", "sou4", "ji7", "ji7", "sou9"]} /></div>
            <div className="isStrong"><span>三筒をチー</span><TileRow tiles={["pin3", "pin4", "pin5"]} /></div>
            <div className="isStrong"><span>六筒をチー</span><TileRow tiles={["pin4", "pin5", "pin6"]} /></div>
            <div className="isStrong"><span>九索を切って二索・五索待ち</span><TileRow tiles={["sou3", "sou4"]} /></div>
          </div>
          <p>三筒か六筒をチーして九索を切れば、二索・五索を待つテンパイです。イーシャンテンでは有効牌を引いてもまだアガれませんが、テンパイなら次の有効牌でアガれます。</p>
          <p>門前でリーチを狙った方が高くなる手もあります。それでも最初は、アガれたはずの手を逃さないために「鳴けばテンパイ」を速度重視で選ぶと、判断が安定します。</p>
        </section>

        <section className="videoArticleCaution terminalChoiceChecklist">
          <p className="videoArticleSectionLabel">BEFORE CALLING</p><h2>「ポン・チー」と言う前の3秒確認</h2>
          <ol><li><b>鳴いた後も役があるか</b><span>役牌、タンヤオなど、アガリに使う役をひとつ言葉にします。</span></li><li><b>どの形が完成するか</b><span>役牌、カンチャンなど、鳴く対象を確認します。</span></li><li><b>鳴いた後に何を切るか</b><span>切る牌まで決めて、テンパイや残りの形を崩さないようにします。</span></li></ol>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">IMPORTANT NOTE</p><h2>この3基準は出発点。慣れたら例外を考える</h2>
          <p>巡目が遅い、手がまだバラバラ、安全牌がなくなる、門前なら高い手になるといった場面では、3基準に当てはまっても見送ることがあります。動画が伝えるのは絶対の正解ではなく、初心者が最初の判断を作るための基準です。</p>
          <div className="strategyActionBox"><strong>まず身につける順番</strong><p>最初は速度を上げる鳴きを経験し、次に打点と守備を比べます。鳴いた後にリーチを受けた局も、どの牌が安全だったか振り返る材料になります。</p></div>
        </section>

        <section className="videoArticleNext">
          <p className="videoArticleSectionLabel">NEXT STEP</p><h2>問題形式で鳴きを練習する</h2>
          <div><Link href="/videos/strategy/calling-to-improve-wait-quiz">待ちを良くする何鳴く問題10問へ</Link><Link href="/videos/strategy/after-calling-tenpai">鳴いてテンパイした後の判断を見る</Link><Link href="/learn/calling">ポン・チー・カンの基本を復習する</Link></div>
        </section>
      </article>
    </main>
  );
}

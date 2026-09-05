import type { Metadata } from "next";
import Link from "next/link";
import { ClearRainBasicTheoryBook } from "../../../components/VideoBookRecommendation";

export const metadata: Metadata = {
  title: "麻雀の何鳴く問題｜待ちを良くするチー・ポン10問",
  description: "麻雀初心者向けに、テンパイ後のチー・ポンでカンチャンや単騎を両面・多面待ちへ変える考え方を牌図で解説します。"
};

const videoUrl = "https://www.youtube.com/watch?v=7Cy92lt82N8";
const tileNames: Record<string, string> = {
  man1: "一萬", man2: "二萬", man3: "三萬", man4: "四萬", man5: "五萬", man6: "六萬", man7: "七萬", man8: "八萬",
  pin2: "二筒", pin3: "三筒", pin4: "四筒", pin5: "五筒", pin6: "六筒", pin7: "七筒",
  sou2: "二索", sou3: "三索", sou4: "四索", sou5: "五索", sou6: "六索", sou7: "七索", sou8: "八索"
};

function TileRow({ tiles }: { tiles: string[] }) {
  return <div>{tiles.map((tile, index) => <img key={`${tile}-${index}`} src={`/tiles/${tile}-66-90-l-emb.png`} alt={tileNames[tile]} />)}</div>;
}

export default function CallingToImproveWaitQuizPage() {
  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト"><Link href="/">トップ</Link><span>›</span><Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span><Link href="/videos/strategy/beginner">初心者向け</Link><span>›</span><span>待ちを良くする何鳴く</span></nav>
          <p className="siteEyebrow">BEGINNER VIDEO GUIDE / 何鳴く</p>
          <h1>待ちを良くする何鳴く問題10問</h1>
          <p className="videoArticleLead">テンパイした後でも、別の牌をチー・ポンすることで、カンチャンや単騎を両面・多面待ちへ変えられる場合があります。動画を止めて「何を鳴き、何を切るか」を考える問題です。</p>
          <div className="videoArticleByline"><span>紹介動画: クリアレインのアトリエ【麻雀解説】</span><time>動画公開日 2026年8月8日</time><span>約10分で読める</span></div>
        </header>

        <div className="videoArticleEmbed"><iframe src="https://www.youtube-nocookie.com/embed/7Cy92lt82N8" title="待ちが良くなる何鳴く問題10問" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div>
        <p className="videoSourceNote">動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">元動画をYouTubeで見る</a></p>

        <section className="videoArticleAudience"><div><p className="videoArticleSectionLabel">RECOMMENDED FOR</p><h2>この動画はこんな人に向いています</h2></div><ul><li>テンパイしたら手を動かさなくなる人</li><li>チー・ポン後の待ち変化を見落とす人</li><li>複合形を複数の面子に分けて見たい人</li><li>7枚形や多面待ちへ進みたい人</li></ul></section>

        <section className="videoArticleBodySection terminalChoiceBaseline">
          <p className="videoArticleSectionLabel">FIRST RULE</p><h2>まず現在の待ちに近い牌を見る</h2>
          <div className="videoArticleTileBlocks">
            <div className="isWeak"><span>カンチャンの例</span><TileRow tiles={["pin3", "pin5"]} /></div>
            <div><span>周辺まで広げて見る</span><TileRow tiles={["pin3", "pin5", "pin6", "pin7"]} /></div>
            <div className="isStrong"><span>鳴いた後の両面候補</span><TileRow tiles={["pin5", "pin6"]} /></div>
          </div>
          <p>待ちに関係する牌を鳴くと、残った部分の分け方が変わります。動画では、カンチャン・シャンポン・単騎などの待ちから、両面や三面待ちへ変えられる牌を10問で探します。</p>
          <div className="strategyKeyMessage"><strong>考える順番:</strong> 現在の待ちを確認し、その待ちの周辺にある牌をチー・ポンした後、残りの形をもう一度分解します。</div>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">MULTIPLE VIEWS</p><h2>複合形は1通りだけで見ない</h2>
          <div className="terminalChoiceComparison">
            <div><span>三五六七の形</span><TileRow tiles={["pin3", "pin5", "pin6", "pin7"]} /><b>カンチャンと両面が重なる</b></div>
            <div><span>五六六六の形</span><TileRow tiles={["man5", "man6", "man6", "man6"]} /><b>両面・対子・刻子で見られる</b></div>
            <div><span>二三四四五六の形</span><TileRow tiles={["sou2", "sou3", "sou4", "sou4", "sou5", "sou6"]} /><b>2つの順子が連結している</b></div>
          </div>
          <p>同じ牌が面子・対子・ターツの複数の役割を持つ形では、1組を鳴いて取り出すと別の待ちが現れます。「完成している面子だから触らない」と決めず、違う区切り方を試します。</p>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">TANKI</p><h2>単騎が2つの面子をつないでいる形に注目</h2>
          <div className="videoArticleTileBlocks"><div><span>連結した2面子</span><TileRow tiles={["pin2", "pin3", "pin4", "pin4", "pin5", "pin6"]} /></div><div className="isWeak"><span>現在の単騎</span><TileRow tiles={["sou7"]} /></div><div className="isStrong"><span>関連牌を鳴いて再構成</span><TileRow tiles={["pin1", "pin3", "pin4", "pin5", "pin7"]} /></div></div>
          <p>単騎待ちの手で2つの順子が連結している場合、その連結部分に関係する牌を鳴くと、残った牌が両面・ノベタンなどへ変わることがあります。動画後半ほど多面待ちの知識が必要になります。</p>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">COUNT</p><h2>形の名前だけでなく、実際の残り枚数を数える</h2>
          <div className="terminalChoiceComparison"><div className="isWeak"><span>カンチャン</span><TileRow tiles={["sou4", "sou6"]} /><b>通常4枚受け</b></div><div className="isStrong"><span>両面</span><TileRow tiles={["sou5", "sou6"]} /><b>通常8枚受け</b></div><div><span>場に見えている牌</span><TileRow tiles={["sou4", "sou4", "sou7"]} /><b>見えている枚数を引く</b></div></div>
          <p>両面へ変わっても、待ち牌が場に多く見えていれば実際の残り枚数は少なくなります。鳴く前と後で、待ちの種類と残り枚数の両方を比べます。</p>
        </section>

        <section className="videoArticleCaution terminalChoiceChecklist"><p className="videoArticleSectionLabel">QUIZ ROUTINE</p><h2>問題を解くときの4ステップ</h2><ol><li><b>現在の待ちを全部挙げる</b><span>単騎や複合待ちも見落とさないようにします。</span></li><li><b>待ちの近くで鳴ける牌を探す</b><span>チーとポンを分けて確認します。</span></li><li><b>鳴いた3枚を外して再分解する</b><span>残った牌から新しい待ちを探します。</span></li><li><b>待ちの残り枚数を比較する</b><span>場に見えている牌も引いて判断します。</span></li></ol></section>

        <section className="videoArticleNext"><p className="videoArticleSectionLabel">NEXT STEP</p><h2>鳴いた後の判断へ進む</h2><div><Link href="/videos/strategy/after-calling-tenpai">鳴いてテンパイした後の思考を見る</Link><Link href="/rules/practical-waits">実戦でよく見る待ち一覧を確認する</Link><Link href="/trainer">7枚形トレーニングへ進む</Link></div></section>
        <ClearRainBasicTheoryBook
          heading="鳴き判断を、実戦の基準へ広げる"
          description="待ちを良くする鳴きだけでなく、速度・打点・守備を合わせて鳴くか決める考え方を整理できます。動画の問題で得た気づきを、実戦の判断へつなげたい人に向く一冊です。"
        />
      </article>
    </main>
  );
}

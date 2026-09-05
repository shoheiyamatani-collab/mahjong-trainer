import type { Metadata } from "next";
import Link from "next/link";
import { ClearRainBasicTheoryBook } from "../../../components/VideoBookRecommendation";

export const metadata: Metadata = {
  title: "麻雀の点数計算問題10問｜初心者向け実戦練習",
  description: "平和のロン・ツモ、副露、七対子、満貫、40符・50符など、実戦でよく出る麻雀の点数計算を問題形式で学びます。"
};

const videoUrl = "https://www.youtube.com/watch?v=pDTj3jixyY4";
const tileNames: Record<string, string> = {
  man1: "一萬", man2: "二萬", man3: "三萬", man4: "四萬", man5: "五萬", man6: "六萬", man7: "七萬", man8: "八萬", man9: "九萬",
  pin2: "二筒", pin3: "三筒", pin4: "四筒", pin5: "五筒", pin6: "六筒", pin7: "七筒", pin8: "八筒",
  sou2: "二索", sou3: "三索", sou4: "四索", sou5: "五索", sou6: "六索", sou7: "七索", sou8: "八索", ji5: "白"
};

function TileRow({ tiles }: { tiles: string[] }) {
  return <div>{tiles.map((tile, index) => <img key={`${tile}-${index}`} src={`/tiles/${tile}-66-90-l-emb.png`} alt={tileNames[tile]} />)}</div>;
}

export default function PracticalScoreCalculationQuizPage() {
  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト"><Link href="/">トップ</Link><span>›</span><Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span><Link href="/videos/strategy/beginner">初心者向け</Link><span>›</span><span>点数計算問題</span></nav>
          <p className="siteEyebrow">BEGINNER VIDEO GUIDE / 点数計算</p>
          <h1>実戦でよく出る点数計算問題10問</h1>
          <p className="videoArticleLead">点数計算は、すべての符を最初から暗記しなくても練習できます。この動画では、よく出る形を「翻数」と「アガリ方・手牌の状態」に分け、点数表を選ぶ流れを10問で確認します。</p>
          <div className="videoArticleByline"><span>紹介動画: クリアレインのアトリエ【麻雀解説】</span><time>動画公開日 2026年5月16日</time><span>約10分で読める</span></div>
        </header>

        <div className="videoArticleEmbed"><iframe src="https://www.youtube-nocookie.com/embed/pDTj3jixyY4" title="実戦でよく出る点数計算問題10問" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div>
        <p className="videoSourceNote">動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">元動画をYouTubeで見る</a></p>

        <section className="videoArticleAudience"><div><p className="videoArticleSectionLabel">RECOMMENDED FOR</p><h2>この動画はこんな人に向いています</h2></div><ul><li>点数表のどの欄を見るか迷う人</li><li>平和ロンと平和ツモを区別したい人</li><li>副露・七対子・満貫をまとめて練習したい人</li><li>オーラスで必要な点数を自分で考えたい人</li></ul></section>

        <section className="videoArticleBodySection terminalChoiceBaseline">
          <p className="videoArticleSectionLabel">TWO STEPS</p><h2>最初は2段階で点数表を選ぶ</h2>
          <div className="videoPracticeSteps"><div><b>STEP 1</b><h3>翻数を数える</h3><p>リーチ・ツモ・平和・タンヤオ・役牌・ドラなどを合計します。</p></div><div><b>STEP 2</b><h3>アガリ方と手牌を見る</h3><p>ロンかツモか、門前か副露か、平和があるかを確認します。</p></div></div>
          <div className="strategyKeyMessage"><strong>初心者の目標:</strong> 平和ロン30符、平和ツモ20符、平和なし、副露、七対子の5種類を先に見分けます。</div>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">PINFU</p><h2>平和はロン30符・ツモ20符から見る</h2>
          <div className="videoArticleTileBlocks"><div><span>13枚の手牌</span><TileRow tiles={["man1", "man2", "man3", "man4", "man5", "man6", "pin2", "pin3", "pin4", "pin5", "pin5", "sou6", "sou7"]} /></div><div className="isStrong"><span>八索でアガリ</span><TileRow tiles={["sou8"]} /></div></div>
          <div className="terminalChoiceComparison"><div><span>リーチ・平和のロン</span><b>2翻30符 = 2000点</b></div><div className="isStrong"><span>リーチ・ツモ・平和</span><b>3翻20符 = 700 / 1300</b></div></div>
          <p>子のツモ点は「子が払う点 / 親が払う点」の順に読みます。700 / 1300なら、子2人が700点、親が1300点を支払います。</p>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">COMMON GROUPS</p><h2>平和なし・副露・七対子を分ける</h2>
          <div className="terminalChoiceComparison"><div><span>門前・平和なし</span><b>ツモ3翻なら1000 / 2000の例</b></div><div><span>副露した手</span><b>ロン3翻なら3900点の例</b></div><div><span>七対子</span><b>25符固定の専用欄を見る</b></div></div>
          <p>動画では、平和なしの門前ツモ・ロン、副露したツモ・ロン、七対子を順番に出題します。七対子は25符固定なので、通常の30符・40符表と混ぜずに覚えます。</p>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">LIMIT HAND</p><h2>5翻以上は満貫以上の欄を見る</h2>
          <div className="terminalChoiceComparison"><div className="isStrong"><span>5翻</span><b>満貫・子ロン8000点</b></div><div><span>6〜7翻</span><b>跳満</b></div><div><span>8〜10翻</span><b>倍満</b></div></div>
          <p>満貫以上では、基本的に符を細かく数えず、翻数から点数を決めます。10問の中にも5翻の満貫問題があり、通常の表から満貫表へ切り替える練習ができます。</p>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">FU EXCEPTIONS</p><h2>最後に40符・50符へ進む</h2>
          <div className="videoArticleTileBlocks"><div><span>白の暗刻</span><TileRow tiles={["ji5", "ji5", "ji5"]} /></div><div><span>カンチャン待ち</span><TileRow tiles={["man2", "man4"]} /></div><div><span>門前ロン</span><TileRow tiles={["pin3"]} /></div></div>
          <p>暗刻、カンチャン待ち、門前ロンなどが重なると40符・50符になる場合があります。動画の終盤では、40符3翻ツモの1300 / 2600、50符2翻ロンの3200点まで扱います。</p>
          <p className="terminalChoiceCaution"><strong>焦らなくてOK:</strong> 最初から符を全部暗記せず、よく出る20・30符を固めてから40・50符を加えます。</p>
        </section>

        <section className="videoArticleCaution terminalChoiceChecklist"><p className="videoArticleSectionLabel">QUIZ ROUTINE</p><h2>1問ごとの確認順</h2><ol><li><b>親か子かを見る</b><span>この動画の問題は子を想定しています。</span></li><li><b>翻数を数える</b><span>役とドラを重複なく合計します。</span></li><li><b>ロン・ツモと門前・副露を分ける</b><span>点数表の種類を決めます。</span></li><li><b>平和・七対子・満貫を確認する</b><span>専用の欄へ切り替えます。</span></li><li><b>必要な問題だけ符を数える</b><span>暗刻や待ちの符を足します。</span></li></ol></section>

        <section className="videoArticleNext"><p className="videoArticleSectionLabel">NEXT STEP</p><h2>点数表を使って復習する</h2><div><Link href="/videos/strategy/easy-score-calculation-without-fu">簡単な点数計算方法を復習する</Link><Link href="/tools/score-table">初心者向け点数早見表を見る</Link><Link href="/rules/practical-score">実戦でよく見る点数計算を見る</Link></div></section>
        <ClearRainBasicTheoryBook
          heading="点数を分かった上で、実戦の選択を磨く"
          description="点数計算を使えるようになると、打点を追うか、速度を優先するか、守備に回るかをより具体的に比べられます。初級者の実戦判断をまとめて復習できる一冊です。"
        />
      </article>
    </main>
  );
}

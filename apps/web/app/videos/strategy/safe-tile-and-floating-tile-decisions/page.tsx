import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "麻雀中級者が勘違いしやすい安牌と孤立牌の判断基準",
  description: "麻雀中級者向けに、安牌を持つ基準と孤立牌を残す理由を牌図で解説。手牌価値と4・6ブロックの違いから実戦判断を整理します。"
};

const videoUrl = "https://www.youtube.com/watch?v=QN7fXjs2PaY";

const tileNames: Record<string, string> = {
  man2: "二萬", man3: "三萬", man4: "四萬", man5: "五萬", man6: "六萬", man7: "七萬", man8: "八萬",
  pin1: "一筒", pin2: "二筒", pin3: "三筒", pin4: "四筒", pin5: "五筒", pin6: "六筒", pin7: "七筒", pin9: "九筒",
  sou2: "二索", sou3: "三索", sou4: "四索", sou5: "五索", sou6: "六索", sou7: "七索",
  ji1: "東", ji2: "南", ji5: "發"
};

function TileRow({ tiles }: { tiles: string[] }) {
  return <div>{tiles.map((tile, index) => <img key={`${tile}-${index}`} src={`/tiles/${tile}-66-90-l-emb.png`} alt={tileNames[tile] ?? tile} />)}</div>;
}

export default function SafeTileAndFloatingTileDecisionsPage() {
  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト"><Link href="/">トップ</Link><span>›</span><Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span><Link href="/videos/strategy/advanced">中級者以上向け</Link><span>›</span><span>安牌と孤立牌の基準</span></nav>
          <p className="siteEyebrow">INTERMEDIATE VIDEO GUIDE / 守備・牌効率</p>
          <h1>中級者が勘違いしやすい、安牌と孤立牌の2つの判断基準</h1>
          <p className="videoArticleLead">「先制できなそうだから安牌を持つ」「形をよくしたいから孤立牌を残す」。どちらも一見正しそうですが、判断に必要な条件が抜けています。手牌全体を見て決める方法を整理します。</p>
          <div className="videoArticleByline"><span>紹介動画: 発男道場【麻雀解説ch】</span><time>動画公開日 2026年8月8日</time><span>約9分で読める</span></div>
        </header>

        <div className="videoArticleEmbed">
          <iframe
            src="https://www.youtube-nocookie.com/embed/QN7fXjs2PaY"
            title="【麻雀解説】あなたは大丈夫？中級者が勘違いしやすい2つの重要項目"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <p className="videoSourceNote">動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">発男道場【麻雀解説ch】の元動画をYouTubeで見る</a></p>

        <section className="videoArticleAudience">
          <div><p className="videoArticleSectionLabel">RECOMMENDED FOR</p><h2>この動画はこんな人に向いています</h2></div>
          <ul>
            <li>先制できなそうな手では必ず安牌を抱える人</li>
            <li>安牌を持つとアガリ率が下がる理由を整理したい人</li>
            <li>孤立牌を何となく残している人</li>
            <li>ブロック数を実戦の打牌に結びつけたい人</li>
          </ul>
        </section>

        <section className="videoArticleBodySection terminalChoiceBaseline">
          <p className="videoArticleSectionLabel">TWO QUESTIONS</p>
          <h2>最初に確認するのは、この2つ</h2>
          <div className="terminalChoiceComparison">
            <div className="isStrong"><span>安牌を持つ前に</span><TileRow tiles={["ji2"]} /><b>この手で押し返したいか？</b></div>
            <div><span>孤立牌を残す前に</span><TileRow tiles={["sou7"]} /><b>5つ目のブロックが必要か？</b></div>
          </div>
          <div className="strategyKeyMessage"><strong>「先制できそうか」「形がよくなりそうか」だけでは決めません。</strong>安牌は手牌価値、孤立牌はブロック数と結びつけて考えます。</div>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">POINT 1 / 0:40</p>
          <h2>安牌は「押し返すため」に持つ</h2>
          <p>安牌を持つ目的は、相手のリーチに対して必ず降りることではありません。高い手や良形の手を進めながら一度安全にしのぎ、次の有効牌で押し返す選択肢を残すことです。</p>
          <div className="videoPrincipleList">
            <section className="videoPrinciple">
              <div className="videoPrincipleNumber">1</div>
              <div className="videoPrincipleBody">
                <span className="videoChapterTime">手牌価値が高い</span>
                <h3>簡単に諦めたくない手なら、安牌を持つ価値がある</h3>
                <p>役牌やドラがあり、相手からリーチが来ても押し返したい手です。目一杯に受け入れを広げるより、南などの安牌を1枚持つ価値が上がります。</p>
                <div className="videoArticleTileBlocks">
                  <div className="isStrong"><span>高い手の牌姿例</span><TileRow tiles={["man2", "man3", "man4", "man6", "man7", "pin2", "pin3", "pin4", "sou5", "sou5", "ji5", "ji5", "ji5"]} /></div>
                  <div><span>手元に残す安牌</span><TileRow tiles={["ji2"]} /></div>
                </div>
                <div className="strategyActionBox"><b>判断</b><p>高打点・良形など、押す価値が高い手では安牌を抱え、リーチ後も進行できる余地を作ります。</p></div>
              </div>
            </section>

            <section className="videoPrinciple">
              <div className="videoPrincipleNumber">2</div>
              <div className="videoPrincipleBody">
                <span className="videoChapterTime">手牌価値が低い</span>
                <h3>先制されたらすぐ降りる手では、安牌を先に切る</h3>
                <p>打点が低く、待ちも弱く、リーチを受けたら無理をしない手です。今から安牌を抱えて受け入れを狭めるより、リーチが来るまでは目一杯に進めます。</p>
                <div className="videoArticleTileBlocks">
                  <div><span>低い手の牌姿例</span><TileRow tiles={["man2", "man3", "man4", "man6", "man8", "pin2", "pin3", "pin4", "sou3", "sou4", "sou5", "ji1", "ji1"]} /></div>
                  <div className="isWeak"><span>先に処理する安牌</span><TileRow tiles={["ji2"]} /></div>
                </div>
                <div className="strategyActionBox"><b>判断</b><p>リーチ後に押し返さない手なら、安牌を持つために現在のアガリ率を下げないことを優先します。</p></div>
              </div>
            </section>
          </div>
          <p className="terminalChoiceCaution"><strong>注意:</strong> 牌姿例は動画の判断基準を伝えるための代表例です。実戦では点棒状況、巡目、親子、場に見えている牌でも結論が変わります。</p>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">POINT 2 / 6:12</p>
          <h2>孤立牌は「不足しているターツを作るため」に残す</h2>
          <p>孤立した7索は、6索や8索などを引けば新しいターツ候補になります。しかし、すでに必要なブロックが足りているなら、新しい候補を増やす価値は小さくなります。</p>
          <div className="videoPrincipleList">
            <section className="videoPrinciple">
              <div className="videoPrincipleNumber">4</div>
              <div className="videoPrincipleBody">
                <span className="videoChapterTime">4ブロック</span>
                <h3>ターツが1つ足りないなら、孤立牌を残す</h3>
                <div className="videoArticleTileBlocks">
                  <div><span>面子</span><TileRow tiles={["man2", "man3", "man4"]} /></div>
                  <div><span>ターツ</span><TileRow tiles={["pin2", "pin3"]} /></div>
                  <div><span>ターツ</span><TileRow tiles={["sou5", "sou6"]} /></div>
                  <div><span>対子</span><TileRow tiles={["man8", "man8"]} /></div>
                  <div className="isStrong"><span>5つ目を作る孤立牌</span><TileRow tiles={["sou7"]} /></div>
                </div>
                <div className="strategyActionBox"><b>七索を残す</b><p>4ブロックでは完成に必要な5ブロック目がありません。七索へのくっつきで新しいターツを作る価値があります。</p></div>
              </div>
            </section>

            <section className="videoPrinciple">
              <div className="videoPrincipleNumber">6</div>
              <div className="videoPrincipleBody">
                <span className="videoChapterTime">6ブロック</span>
                <h3>ターツが余っているなら、孤立牌の優先度は下がる</h3>
                <div className="videoArticleTileBlocks">
                  <div><span>1</span><TileRow tiles={["man2", "man3"]} /></div>
                  <div><span>2</span><TileRow tiles={["man5", "man6"]} /></div>
                  <div><span>3</span><TileRow tiles={["pin2", "pin3"]} /></div>
                  <div><span>4</span><TileRow tiles={["pin6", "pin7"]} /></div>
                  <div><span>5</span><TileRow tiles={["sou2", "sou3"]} /></div>
                  <div><span>6</span><TileRow tiles={["sou5", "sou5"]} /></div>
                  <div className="isWeak"><span>余分な孤立牌</span><TileRow tiles={["sou7"]} /></div>
                </div>
                <div className="strategyActionBox"><b>七索を先に処理する</b><p>すでに6ブロックあり、最終的には1ブロック落とします。さらに新しいターツを作るより、今ある候補を比較して5つへ整理します。</p></div>
              </div>
            </section>
          </div>
        </section>

        <section className="videoArticleCaution terminalChoiceChecklist">
          <p className="videoArticleSectionLabel">CHECK ORDER</p>
          <h2>迷ったときの確認順</h2>
          <ol>
            <li><b>この手は押し返したい価値があるか</b><span>打点、待ち、親子、点棒状況を見てから安牌を決めます。</span></li>
            <li><b>先制されたら本当に降りるか</b><span>すぐ降りる手なら、それまでは受け入れを狭めない選択があります。</span></li>
            <li><b>現在のブロックはいくつか</b><span>4ブロックなら孤立牌、6ブロックなら既存のターツ整理を優先します。</span></li>
            <li><b>ドラや場況で牌の価値が変わらないか</b><span>ドラの孤立牌や場に安い色は、基本より残す価値が上がります。</span></li>
          </ol>
        </section>

        <section className="videoArticleNext">
          <p className="videoArticleSectionLabel">NEXT STEP</p>
          <h2>手牌全体から価値を比較する</h2>
          <div>
            <Link href="/analysis/mahjong-tool">牌理チェッカーで受け入れを確認する</Link>
            <Link href="/videos/strategy/four-tile-shape-vs-floating-tile">4枚形と孤立牌の比較を読む</Link>
            <Link href="/videos/strategy/betaori-three-principles">ベタオリの考え方を復習する</Link>
            <Link href="/videos/strategy/advanced">中級者以上向け動画を見る</Link>
          </div>
        </section>
      </article>
    </main>
  );
}

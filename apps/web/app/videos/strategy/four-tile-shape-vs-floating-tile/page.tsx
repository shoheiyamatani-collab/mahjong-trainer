import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "麻雀は1シャンテンに取る？4枚形と孤立牌の比較を牌図で解説",
  description: "麻雀中級者向けに、2457・3568・2356・2458・2568の4枚形と孤立牌を比較。一向聴維持と二向聴戻しの判断を牌図で解説します。"
};

const videoUrl = "https://www.youtube.com/watch?v=ugikTxXHVP4";

const tileNames: Record<string, string> = {
  pin2: "二筒", pin3: "三筒", pin4: "四筒", pin5: "五筒", pin6: "六筒", pin7: "七筒", pin8: "八筒",
  sou3: "三索", sou4: "四索", sou5: "五索", sou6: "六索"
};

function TileRow({ tiles }: { tiles: string[] }) {
  return <div>{tiles.map((tile, index) => <img key={`${tile}-${index}`} src={`/tiles/${tile}-66-90-l-emb.png`} alt={tileNames[tile] ?? tile} />)}</div>;
}

type ShapeExample = {
  number: number;
  shape: string;
  tiles: string[];
  decision: "return" | "keep";
  title: string;
  reason: string;
  checkpoint: string;
};

const shapeExamples: ShapeExample[] = [
  {
    number: 1,
    shape: "2457",
    tiles: ["pin2", "pin4", "pin5", "pin7"],
    decision: "return",
    title: "良形変化を狙い、二向聴戻しを検討",
    reason: "4枚形をそのまま残しても、次のテンパイが愚形になりやすい形です。孤立した3索へくっつく変化を残し、良形一向聴を作る価値があります。",
    checkpoint: "一向聴という近さより、テンパイ後の待ちが固定される弱さを確認します。"
  },
  {
    number: 2,
    shape: "3568",
    tiles: ["pin3", "pin5", "pin6", "pin8"],
    decision: "return",
    title: "愚形テンパイ濃厚なら、孤立牌を残す",
    reason: "例1と同じく、現状の4枚だけでは良形テンパイへ進みにくい形です。序盤ならシャンテン数を一つ戻し、3索から両面を作る変化を優先できます。",
    checkpoint: "巡目が浅く、孤立牌にくっつく時間があるかも判断材料です。"
  },
  {
    number: 3,
    shape: "2356",
    tiles: ["pin2", "pin3", "pin5", "pin6"],
    decision: "keep",
    title: "孤立牌の変化が十分でなければ一向聴を維持",
    reason: "愚形が残る可能性はあっても、3索へくっつけば必ず良形になるわけではありません。二向聴へ戻す見返りが小さいため、素直に一向聴を取る判断が有力です。",
    checkpoint: "戻した後に本当に良形率が上がるのかを確認し、雰囲気だけでシャンテンを戻さないようにします。"
  },
  {
    number: 4,
    shape: "2458",
    tiles: ["pin2", "pin4", "pin5", "pin8"],
    decision: "keep",
    title: "両面テンパイの受けがあるなら一向聴を維持",
    reason: "引く牌によっては4枚形から両面テンパイへ進めます。良形になるルートが残っているため、3索を切って一向聴を維持する価値が高くなります。",
    checkpoint: "すべてが愚形になる形と、一部でも両面になる形を分けて考えます。"
  },
  {
    number: 5,
    shape: "2568",
    tiles: ["pin2", "pin5", "pin6", "pin8"],
    decision: "keep",
    title: "良形テンパイの可能性を残して一向聴を取る",
    reason: "この形にも両面テンパイへ進む引きがあります。孤立牌を残して二向聴へ戻すより、現在の受け入れを生かして先にテンパイを目指します。",
    checkpoint: "4枚形の数字だけを暗記せず、どの牌でどの待ちになるかを一手先まで分解します。"
  }
];

export default function FourTileShapeVsFloatingTileArticlePage() {
  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト"><Link href="/">トップ</Link><span>›</span><Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span><Link href="/videos/strategy/advanced">中級者以上向け</Link><span>›</span><span>4枚形と孤立牌</span></nav>
          <p className="siteEyebrow">INTERMEDIATE VIDEO GUIDE / 牌効率・シャンテン戻し</p>
          <h1>素直に1シャンテンを取る？4枚形と孤立牌の比較</h1>
          <p className="videoArticleLead">一向聴はテンパイまであと1枚ですが、次に必ず悪い待ちになるなら急ぐ価値は下がります。4枚形を維持するか、孤立牌を残して二向聴へ戻すかを5つの形で比較します。</p>
          <div className="videoArticleByline"><span>紹介動画: 発男道場【麻雀解説ch】</span><time>動画公開日 2026年8月12日</time><span>約9分で読める</span></div>
        </header>

        <div className="videoArticleEmbed">
          <iframe
            src="https://www.youtube-nocookie.com/embed/ugikTxXHVP4"
            title="【麻雀解説】素直に1シャンテン取っていいの？意外と知らない…4枚形と孤立牌の比較"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <p className="videoSourceNote">動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">発男道場【麻雀解説ch】の元動画をYouTubeで見る</a></p>

        <section className="videoArticleAudience">
          <div><p className="videoArticleSectionLabel">RECOMMENDED FOR</p><h2>この動画はこんな人に向いています</h2></div>
          <ul>
            <li>何があってもシャンテン数を進める打牌を選んでしまう人</li>
            <li>愚形テンパイと二向聴戻しのどちらがよいか迷う人</li>
            <li>4枚形を見たときの両面変化を整理したい人</li>
            <li>巡目やドラを含めて手牌の速度を判断したい人</li>
          </ul>
        </section>

        <section className="videoArticleBodySection shapeVsFloatBaseline">
          <p className="videoArticleSectionLabel">BASIC DECISION</p>
          <h2>見るのはシャンテン数ではなく「次の待ち」</h2>
          <div className="shapeVsFloatDecision">
            <div className="isReturn"><span>二向聴へ戻す</span><b>愚形テンパイが濃厚</b><p>孤立牌から良形を作る見返りが大きいとき。</p></div>
            <div className="isKeep"><span>一向聴を維持</span><b>両面テンパイの受けがある</b><p>現在の形から良形へ進むルートが残るとき。</p></div>
          </div>
          <p>二向聴戻しは、ただテンパイを遠ざける打ち方ではありません。テンパイ速度を一度落とし、最終的なアガリやすさを上げる選択です。</p>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">FIVE SHAPES</p>
          <h2>牌図で比べる5つの4枚形</h2>
          <div className="shapeVsFloatExamples">
            {shapeExamples.map((example) => (
              <section key={example.number} className={`shapeVsFloatExample is-${example.decision}`}>
                <header><span>例 {example.number}</span><strong>{example.decision === 'return' ? '二向聴戻しを検討' : '一向聴を維持'}</strong></header>
                <h3>{example.shape}と孤立3索を比較</h3>
                <div className="shapeVsFloatTiles">
                  <div><span>4枚形</span><TileRow tiles={example.tiles} /></div>
                  <b>VS</b>
                  <div><span>孤立牌</span><TileRow tiles={["sou3"]} /></div>
                </div>
                <h4>{example.title}</h4>
                <p>{example.reason}</p>
                <div className="shapeVsFloatCheckpoint"><strong>見るポイント</strong><span>{example.checkpoint}</span></div>
              </section>
            ))}
          </div>
        </section>

        <section className="videoArticleCaution shapeVsFloatConditions">
          <p className="videoArticleSectionLabel">CONDITIONS</p>
          <h2>形以外で判断が変わる2つの条件</h2>
          <div>
            <section><span>孤立牌の価値</span><h3>ドラや四連形に関係するなら残しやすい</h3><div className="videoArticleTileBlocks"><div className="isStrong"><span>強い孤立牌候補</span><TileRow tiles={["sou3", "sou4", "sou5", "sou6"]} /></div></div><p>孤立牌がドラ、または四連形など強い形の一部なら、二向聴へ戻す見返りが大きくなります。</p></section>
            <section><span>巡目</span><h3>巡目が深いほど一向聴を優先する</h3><p>序盤は変化を待てますが、9巡目前後など中盤以降はテンパイを逃す損失が大きくなります。同じ牌姿でも、巡目が深ければ一向聴維持へ寄せます。</p></section>
          </div>
        </section>

        <section className="videoArticleCaution shapeVsFloatChecklist">
          <p className="videoArticleSectionLabel">CHECK ORDER</p>
          <h2>迷ったときの確認順</h2>
          <ol>
            <li><b>現状から両面テンパイになる牌はあるか</b><span>あるなら一向聴維持の価値が上がります。</span></li>
            <li><b>孤立牌へくっつけば本当に良形になるか</b><span>変化の量だけでなく、変化後の質を確認します。</span></li>
            <li><b>孤立牌はドラや強い形に関係するか</b><span>打点や発展性が高ければ二向聴戻しを選びやすくなります。</span></li>
            <li><b>変化を待てる巡目か</b><span>巡目が深いほど、現在の一向聴を維持します。</span></li>
          </ol>
        </section>

        <section className="videoArticleNext">
          <p className="videoArticleSectionLabel">NEXT STEP</p>
          <h2>5つの形を実際に比較する</h2>
          <div>
            <Link href="/analysis/mahjong-tool">牌理チェッカーで受け入れを確認する</Link>
            <Link href="/videos/strategy/intermediate-tile-efficiency-26-rules">牌効率26のセオリーを読む</Link>
            <Link href="/videos/strategy/seven-strong-shapes-for-winning">強い形7選を復習する</Link>
            <Link href="/videos/strategy/advanced">中級者以上向け動画を見る</Link>
          </div>
        </section>
      </article>
    </main>
  );
}

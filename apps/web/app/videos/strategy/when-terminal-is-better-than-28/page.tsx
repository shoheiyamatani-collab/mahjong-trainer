import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "麻雀の孤立牌1・9と2・8はどちらを残す？価値が逆転する3ケース",
  description: "麻雀中級者向けに、孤立牌の2・8より1・9を残すケースを解説。安全度、鳴き、1345・13455の複合形を牌図で比較します。"
};

const videoUrl = "https://www.youtube.com/watch?v=mah_grITelQ";

const tileNames: Record<string, string> = {
  man1: "一萬", man2: "二萬", man3: "三萬", man4: "四萬", man5: "五萬", man6: "六萬", man7: "七萬", man8: "八萬", man9: "九萬",
  pin2: "二筒", pin3: "三筒", pin4: "四筒", pin5: "五筒", pin6: "六筒", pin7: "七筒",
  sou2: "二索", sou3: "三索", sou4: "四索", sou5: "五索", sou6: "六索", sou7: "七索", ji7: "中"
};

function TileRow({ tiles }: { tiles: string[] }) {
  return <div>{tiles.map((tile, index) => <img key={`${tile}-${index}`} src={`/tiles/${tile}-66-90-l-emb.png`} alt={tileNames[tile] ?? tile} />)}</div>;
}

type ChoiceCase = {
  number: number;
  time: string;
  title: string;
  summary: string;
  keep: string[];
  keepLabel: string;
  compare: string[];
  compareLabel: string;
  reason: string;
  caution: string;
};

const choiceCases: ChoiceCase[] = [
  {
    number: 1,
    time: "1:03",
    title: "好形が十分なら、安全度の高い1・9を残す",
    summary: "両面が複数あり、手牌の速度に不安が少ない一向聴では、さらに変化を増やすより将来の安全牌候補を持つ価値が上がります。",
    keep: ["man1", "man9"],
    keepLabel: "残す候補",
    compare: ["man2", "man8"],
    compareLabel: "先に処理する候補",
    reason: "2・8はカンチャン待ちにも当たり得ます。1・9は当たり方が比較的限られるため、形が足りているなら2・8を先に処理し、1・9を後の守備に残します。",
    caution: "カンチャンなどの弱い形が残る手では、2・8の両面変化が必要です。手牌の完成度を先に確認します。"
  },
  {
    number: 2,
    time: "3:15",
    title: "鳴いて進める手では、1345の1が働く",
    summary: "門前の単純な孤立牌比較だけでなく、上家からチーできる牌まで含めると、1を残す価値が変わります。",
    keep: ["man1", "man3", "man4", "man5"],
    keepLabel: "鳴きに使える形",
    compare: ["man2"],
    compareLabel: "孤立した2",
    reason: "1345は2をチーして123＋45へ分けるなど、他家の打牌を使って形を固定できます。鳴ける手では、自摸だけを数えた比較より1の価値が高くなります。",
    caution: "門前でタンヤオを狙う手や、鳴いても役が残らない手では評価が変わります。先にアガリ役を確認します。"
  },
  {
    number: 3,
    time: "6:25",
    title: "13455は対子があるため、1を含めた変化が強い",
    summary: "1345に5の対子が加わると、順子候補と雀頭候補が重なり、1を残したときの有効な変化が増えます。",
    keep: ["man1", "man3", "man4", "man5", "man5"],
    keepLabel: "残したい複合形",
    compare: ["man2"],
    compareLabel: "比較する孤立牌",
    reason: "内側の牌を引いた後も、両面と5の対子を残しやすい形です。単純に1より2が内側だから強いと判断せず、5枚全体を一つの複合形として見ます。",
    caution: "タンヤオが確定する、打点が大きく変わるなどの条件があれば、役と受け入れをもう一度比較します。"
  }
];

function secondsFromTime(time: string) {
  const [minutes, seconds] = time.split(":").map(Number);
  return minutes * 60 + seconds;
}

export default function WhenTerminalIsBetterThan28ArticlePage() {
  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト"><Link href="/">トップ</Link><span>›</span><Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span><Link href="/videos/strategy/advanced">中級者以上向け</Link><span>›</span><span>孤立牌1・9と2・8</span></nav>
          <p className="siteEyebrow">INTERMEDIATE VIDEO GUIDE / 牌効率・孤立牌</p>
          <h1>孤立牌の2・8より、1・9を残した方がよい3つのケース</h1>
          <p className="videoArticleLead">基本の牌効率では、1・9より2・8の方が多くの牌とつながります。しかし手牌が十分に整っているとき、鳴いて進めるとき、複合形があるときは評価が逆転します。</p>
          <div className="videoArticleByline"><span>紹介動画: 発男道場【麻雀解説ch】</span><time>動画公開日 2025年2月22日</time><span>約8分で読める</span></div>
        </header>

        <div className="videoArticleEmbed">
          <iframe
            src="https://www.youtube-nocookie.com/embed/mah_grITelQ"
            title="【麻雀解説】孤立牌28より孤立牌19を残した方がいいケース"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <p className="videoSourceNote">動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">発男道場【麻雀解説ch】の元動画をYouTubeで見る</a></p>

        <section className="videoArticleAudience">
          <div><p className="videoArticleSectionLabel">RECOMMENDED FOR</p><h2>この動画はこんな人に向いています</h2></div>
          <ul>
            <li>孤立牌はいつも1・9から切っている人</li>
            <li>受け入れ枚数が多い牌だけを残してしまう人</li>
            <li>牌効率と守備力を同時に比べたい人</li>
            <li>鳴きを含めた受け入れを考えたい人</li>
          </ul>
        </section>

        <section className="videoArticleBodySection terminalChoiceBaseline">
          <p className="videoArticleSectionLabel">BASIC RULE</p>
          <h2>基本は2・8の方が1・9より強い</h2>
          <p>孤立した2は1・2・3・4、孤立した1は1・2・3とのつながりを持ちます。何も条件がなければ、内側の2・8を残す方が面子候補を作りやすくなります。</p>
          <div className="terminalChoiceComparison">
            <div className="isStrong"><span>基本的に残す</span><TileRow tiles={["man2", "man8"]} /><b>変化が広い</b></div>
            <div><span>基本的に先に切る</span><TileRow tiles={["man1", "man9"]} /><b>変化が限られる</b></div>
          </div>
          <div className="strategyKeyMessage"><strong>今回のポイントは「基本を覆す条件」です。</strong>まず通常の優劣を知り、そのうえで手牌全体と場況から例外を選びます。</div>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">THREE CASES</p>
          <h2>1・9の価値が逆転する3ケース</h2>
          <div className="videoPrincipleList terminalChoiceCases">
            {choiceCases.map((choice) => (
              <section key={choice.number} className="videoPrinciple terminalChoiceCase">
                <div className="videoPrincipleNumber">{choice.number}</div>
                <div className="videoPrincipleBody">
                  <span className="videoChapterTime">{choice.time} から</span>
                  <h3>{choice.title}</h3>
                  <p>{choice.summary}</p>
                  <div className="videoArticleTileBlocks terminalChoiceTiles">
                    <div className="isStrong"><span>{choice.keepLabel}</span><TileRow tiles={choice.keep} /></div>
                    <div className="isWeak"><span>{choice.compareLabel}</span><TileRow tiles={choice.compare} /></div>
                  </div>
                  <div className="strategyActionBox"><b>なぜ1・9を残す？</b><p>{choice.reason}</p></div>
                  <p className="terminalChoiceCaution"><strong>判断が変わる条件:</strong> {choice.caution}</p>
                  <a href={`${videoUrl}&t=${secondsFromTime(choice.time)}s`} target="_blank" rel="noopener noreferrer">このケースを動画の該当箇所から見る</a>
                </div>
              </section>
            ))}
          </div>
        </section>

        <section className="videoArticleCaution terminalChoiceChecklist">
          <p className="videoArticleSectionLabel">CHECK ORDER</p>
          <h2>孤立牌を選ぶ前に確認する順番</h2>
          <ol>
            <li><b>手牌の形は足りているか</b><span>好形が十分なら安全度を上げる余裕があります。</span></li>
            <li><b>鳴いても役が残るか</b><span>鳴けるなら自摸以外の受け入れも比較します。</span></li>
            <li><b>周囲に複合形がないか</b><span>1345や13455は、1枚ずつ切り離さず全体で見ます。</span></li>
            <li><b>打点が変わらないか</b><span>タンヤオなど、役の有無と打点差を最後に確認します。</span></li>
          </ol>
        </section>

        <section className="videoArticleNext">
          <p className="videoArticleSectionLabel">NEXT STEP</p>
          <h2>受け入れと安全度を実際に比較する</h2>
          <div>
            <Link href="/analysis/mahjong-tool">牌理チェッカーで1・2を比較する</Link>
            <Link href="/videos/strategy/intermediate-tile-efficiency-26-rules">牌効率26のセオリーへ戻る</Link>
            <Link href="/videos/strategy/isolated-terminal-tile-order">孤立牌1・9の切り順を復習する</Link>
            <Link href="/videos/strategy/advanced">中級者以上向け動画を見る</Link>
          </div>
        </section>
      </article>
    </main>
  );
}

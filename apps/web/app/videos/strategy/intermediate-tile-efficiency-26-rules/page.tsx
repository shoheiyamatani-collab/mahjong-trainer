import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "麻雀中級者向け何切る | 牌効率を高める26のセオリー",
  description: "麻雀中級者向けに、打点判断、5ブロック理論、孤立牌、二度受け、対子選択、ドラのスライドなど、何切るで使う26の牌効率セオリーを動画と牌図で整理します。"
};

const videoUrl = "https://www.youtube.com/watch?v=7zl8NwudR5g";

const tileNames: Record<string, string> = {
  man1: "一萬", man2: "二萬", man3: "三萬", man4: "四萬", man5: "五萬", man6: "六萬", man7: "七萬", man8: "八萬", man9: "九萬",
  pin2: "二筒", pin3: "三筒", pin4: "四筒", pin5: "五筒", pin6: "六筒", pin7: "七筒", pin8: "八筒",
  sou2: "二索", sou3: "三索", sou4: "四索", sou5: "五索", sou6: "六索", sou7: "七索", ji7: "中"
};

type TheoryGroup = {
  number: number;
  time: string;
  title: string;
  lead: string;
  rules: string[];
  figure?: {
    label: string;
    groups: { label: string; tiles: string[]; tone?: "strong" | "weak" }[];
    note: string;
  };
};

const theoryGroups: TheoryGroup[] = [
  {
    number: 1,
    time: "0:34",
    title: "手役と打点の判断",
    lead: "受け入れ枚数だけでなく、完成したときの価値まで比較します。",
    rules: [
      "複数の役が見えるときは、まず打点の高いルートを比較する",
      "二つの三色が狙えるときは、両方に関係する複合形の扱いを見る",
      "三色と一気通貫で迷ったら、必要な確定牌が少なく変化に強い方を確認する"
    ],
    figure: {
      label: "三色同順の種",
      groups: [
        { label: "萬子", tiles: ["man2", "man3", "man4"], tone: "strong" },
        { label: "筒子", tiles: ["pin2", "pin3", "pin4"], tone: "strong" },
        { label: "索子", tiles: ["sou2", "sou3", "sou4"], tone: "strong" }
      ],
      note: "役の種が重なったときは、完成に必要な牌の種類と最終打点をセットで比べます。"
    }
  },
  {
    number: 2,
    time: "2:49",
    title: "5ブロックを基準に手牌を整理する",
    lead: "4面子1雀頭へ向かうため、現在の手牌が何ブロックかを最初に数えます。",
    rules: [
      "5ブロックなら、強い両面や完成面子を軸に手を進める",
      "6ブロックなら、受け入れと変化が最も弱いブロックを外す",
      "6ブロックがすべて強い形なら、すぐ固定せず場況との比較も残す",
      "3対子は1組が余りやすいため、どの対子をほぐすか比較する"
    ],
    figure: {
      label: "6ブロックの例",
      groups: [
        { label: "両面", tiles: ["man2", "man3"], tone: "strong" },
        { label: "両面", tiles: ["man6", "man7"], tone: "strong" },
        { label: "両面", tiles: ["pin3", "pin4"], tone: "strong" },
        { label: "両面", tiles: ["sou4", "sou5"], tone: "strong" },
        { label: "対子", tiles: ["ji7", "ji7"] },
        { label: "弱い候補", tiles: ["pin7", "pin8"], tone: "weak" }
      ],
      note: "ブロックが6つなら、単体の強さだけでなく二度受けや役・打点への関係まで見て1つ外します。"
    }
  },
  {
    number: 3,
    time: "5:27",
    title: "孤立牌とくっつきの価値を比べる",
    lead: "同じ孤立牌でも、完成面子との距離や引いた後の形で価値が変わります。",
    rules: [
      "孤立した2・8とペンチャンでは、1手で面子になるペンチャンを基準に比較する",
      "1345の1は単純な端牌ではなく、面子の近くにあるくっつきとして見る",
      "四連形・中ぶくれ・亜両面は、受け入れと両面変化の質まで比較する"
    ],
    figure: {
      label: "くっつきの代表形",
      groups: [
        { label: "四連形", tiles: ["man4", "man5", "man6", "man7"], tone: "strong" },
        { label: "中ぶくれ", tiles: ["man4", "man5", "man5", "man6"], tone: "strong" },
        { label: "亜両面", tiles: ["man4", "man4", "man5"] }
      ],
      note: "見た目が似ていても、引いた後に両面が何種類できるかで評価が変わります。"
    }
  },
  {
    number: 4,
    time: "10:38",
    title: "二度受けを減らしてターツを選ぶ",
    lead: "受け入れの種類が重なっている形は、見た目ほど広くありません。",
    rules: [
      "ターツ同士で同じ牌を待つ二度受けがあれば、重複を解消する",
      "孤立牌を残した後の両面変化が二度受けになるか確認する",
      "カンチャンへ変化したとき、四連形などの連続形が残る方を選ぶ",
      "ペンチャン同士も、カンチャン変化後の連続形まで比較する",
      "24のカンチャンは両面変化が限られるため、弱い候補として見る",
      "同じカンチャンなら、両面変化後に二度受けとなる方を外す",
      "完成面子に接するカンチャンは、多面待ちへ伸びる変化を見落とさない"
    ],
    figure: {
      label: "3萬の二度受け",
      groups: [
        { label: "ペン3萬", tiles: ["man1", "man2"], tone: "weak" },
        { label: "3・6萬", tiles: ["man4", "man5"], tone: "strong" },
        { label: "リャンカン", tiles: ["man1", "man3", "man5"] }
      ],
      note: "12と45はどちらも3を使います。単純な待ちの合計ではなく、重複を除いた実際の受け入れを見ます。"
    }
  },
  {
    number: 5,
    time: "13:38",
    title: "テンパイ・対子選択で裏目まで比較する",
    lead: "何を切っても受け入れが減る場面では、裏目を引いた後に手牌が機能するかを見ます。",
    rules: [
      "対子選択では、残した後に両面カンチャンができる形を確認する",
      "3対子から1組を外すときは、端寄りの対子を候補にする",
      "くっつき一向聴では、受け入れが重なる二間の渡りを残しすぎない",
      "どの打牌にもロスがあるなら、裏目を引いた後の復活ルートを比べる",
      "連続形があるときの面子固定と、ないときの雀頭固定を使い分ける",
      "端牌を比べるときは、切った後にペンチャン部分が残るかを見る",
      "飛び対子は、受け入れを重ねる中央部分の処理を動画の形で確認する"
    ]
  },
  {
    number: 6,
    time: "18:22",
    title: "ドラのスライドと字牌の場況を見る",
    lead: "速度だけで差がつかないときは、将来の打点と鳴かれる危険まで判断材料にします。",
    rules: [
      "将来ドラを引いたとき、筋の牌と入れ替えられるスライド形を残す",
      "オタ風は下家に鳴かれる影響を考え、席順と場況を見て切り順を決める"
    ],
    figure: {
      label: "スライドを考える連続形",
      groups: [
        { label: "連続形", tiles: ["man3", "man4", "man5", "man6"], tone: "strong" },
        { label: "ドラ候補", tiles: ["man6"] }
      ],
      note: "現在の受け入れだけでなく、ドラを引いた後もテンパイや好形を維持できるかを確認します。"
    }
  }
];

function TileRow({ tiles }: { tiles: string[] }) {
  return <div>{tiles.map((tile, index) => <img key={`${tile}-${index}`} src={`/tiles/${tile}-66-90-l-emb.png`} alt={tileNames[tile] ?? tile} />)}</div>;
}

function secondsFromTime(time: string) {
  const [minutes, seconds] = time.split(":").map(Number);
  return minutes * 60 + seconds;
}

export default function IntermediateTileEfficiencyArticlePage() {
  let ruleNumber = 0;

  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト"><Link href="/">トップ</Link><span>›</span><Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span><Link href="/videos/strategy/advanced">中級者以上向け</Link><span>›</span><span>牌効率26のセオリー</span></nav>
          <p className="siteEyebrow">INTERMEDIATE VIDEO GUIDE / 牌効率・何切る</p>
          <h1>中級レベルの何切るに必要な、牌効率26のセオリー</h1>
          <p className="videoArticleLead">中級者の何切るは、受け入れ枚数だけでは決まりません。打点、ブロック数、二度受け、裏目の損失、守備、ドラまで同時に比べるための26項目を、動画の順番で整理します。</p>
          <div className="videoArticleByline"><span>紹介動画: 発男道場【麻雀解説ch】</span><time>動画公開日 2025年2月26日</time><span>約13分で読める</span></div>
        </header>

        <div className="videoArticleEmbed">
          <iframe
            src="https://www.youtube-nocookie.com/embed/7zl8NwudR5g"
            title="【麻雀解説】この1本で中級レベルの牌効率が身に付く！26個の知識を集約化"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <p className="videoSourceNote">動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">発男道場【麻雀解説ch】の元動画をYouTubeで見る</a></p>

        <section className="videoArticleAudience">
          <div><p className="videoArticleSectionLabel">RECOMMENDED FOR</p><h2>この動画はこんな人に向いています</h2></div>
          <ul>
            <li>基本的な牌効率は分かるが、候補が2枚まで絞られると迷う人</li>
            <li>受け入れ枚数が同じ打牌の優劣を説明できるようになりたい人</li>
            <li>打点や守備を含めて何切るを考えたい人</li>
            <li>自分の判断基準を26項目で点検したい人</li>
          </ul>
        </section>

        <section className="videoArticleBodySection advancedTheoryIntro">
          <p className="videoArticleSectionLabel">HOW TO USE</p>
          <h2>26項目を丸暗記せず、6つの比較軸で覚える</h2>
          <div className="advancedTheoryAxes">
            {['打点', 'ブロック', '変化', '二度受け', '裏目', '場況'].map((axis, index) => <span key={axis}><b>{index + 1}</b>{axis}</span>)}
          </div>
          <p>何切るで迷ったら、まず5ブロックを数え、次に受け入れの重複を外し、最後に打点・守備・裏目を比べます。すべてを毎回確認するのではなく、候補が残ったときの比較表として使いましょう。</p>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">26 RULES</p>
          <h2>動画の章順で確認する26のセオリー</h2>
          <div className="videoPrincipleList advancedTheoryList">
            {theoryGroups.map((group) => (
              <section key={group.number} className="videoPrinciple advancedTheoryGroup">
                <div className="videoPrincipleNumber">{group.number}</div>
                <div className="videoPrincipleBody">
                  <span className="videoChapterTime">{group.time} から</span>
                  <h3>{group.title}</h3>
                  <p>{group.lead}</p>
                  <ol className="advancedTheoryRules">
                    {group.rules.map((rule) => {
                      ruleNumber += 1;
                      return <li key={rule}><span>{ruleNumber}</span><p>{rule}</p></li>;
                    })}
                  </ol>
                  {group.figure ? (
                    <figure className="advancedTheoryFigure">
                      <figcaption>{group.figure.label}</figcaption>
                      <div className="videoArticleTileBlocks">
                        {group.figure.groups.map((tileGroup) => (
                          <div key={tileGroup.label} className={tileGroup.tone === 'strong' ? 'isStrong' : tileGroup.tone === 'weak' ? 'isWeak' : undefined}>
                            <span>{tileGroup.label}</span><TileRow tiles={tileGroup.tiles} />
                          </div>
                        ))}
                      </div>
                      <p>{group.figure.note}</p>
                    </figure>
                  ) : null}
                  <a href={`${videoUrl}&t=${secondsFromTime(group.time)}s`} target="_blank" rel="noopener noreferrer">{group.title}を動画の該当箇所から見る</a>
                </div>
              </section>
            ))}
          </div>
        </section>

        <section className="videoArticleCaution advancedTheoryCaution">
          <p className="videoArticleSectionLabel">IMPORTANT</p>
          <h2>セオリーは候補を比べる基準であり、絶対の答えではありません</h2>
          <p>巡目、点数状況、ドラ、他家の仕掛け、残り枚数によって最善打は変わります。まず牌効率の基準で候補を絞り、最後にその局の条件で補正するのが中級者の考え方です。</p>
          <div className="strategyKeyMessage"><strong>受け入れ → 打点 → 守備 → 裏目の順に比較する。</strong>自分の答えに理由を一つ足せるだけでも、何切るの精度は上がります。</div>
        </section>

        <section className="videoArticleNext">
          <p className="videoArticleSectionLabel">NEXT STEP</p>
          <h2>実際の牌姿で判断を確かめる</h2>
          <div>
            <Link href="/analysis/mahjong-tool">牌理チェッカーで受け入れを比較する</Link>
            <Link href="/trainer">高難易度の何切る問題を解く</Link>
            <Link href="/videos/strategy/seven-strong-shapes-for-winning">強い形7選を牌図で復習する</Link>
            <Link href="/videos/strategy/advanced">中級者以上向け動画へ戻る</Link>
          </div>
        </section>
      </article>
    </main>
  );
}

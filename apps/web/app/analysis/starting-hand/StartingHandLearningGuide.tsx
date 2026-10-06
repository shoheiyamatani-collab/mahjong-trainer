import Link from "next/link";
import { ArticleTileFigures } from "../../components/TileFigures";

const examples = [
  {
    title: "三色を追うか、リーチへ進むか",
    description: "三色の種が見えても、すべてを固定すると手が遅くなることがあります。",
    badges: ["三色", "速度"],
    rows: [{ label: "配牌例", tiles: ["man2", "man3", "pin2", "pin3", "sou2", "sou3", "man7", "man8", "pin6", "pin7", "sou9", "ji1", "ji5"], note: "候補は三色ですが、まず両面候補の多さと孤立牌の働きを比較します。" }]
  },
  {
    title: "混一色へ寄せる分岐",
    description: "一種類の数牌と字牌が多い配牌では、染め手と通常手の速度を比べます。",
    badges: ["混一色", "鳴き"],
    rows: [{ label: "配牌例", tiles: ["sou1", "sou2", "sou3", "sou5", "sou7", "sou8", "sou9", "ji1", "ji1", "ji5", "ji6", "man4", "pin7"], note: "索子と字牌を残す価値は高い一方、孤立した他色をいつ外すかは巡目と鳴きやすさで変わります。" }]
  },
  {
    title: "七対子と面子手を両方見る",
    description: "対子が多い配牌でも、順子を作りやすい連続形があれば面子手を残します。",
    badges: ["七対子", "面子手"],
    rows: [{ label: "配牌例", tiles: ["man2", "man2", "man3", "man4", "pin5", "pin5", "pin6", "sou7", "sou7", "sou8", "ji2", "ji2", "ji6"], note: "対子は4組ありますが、2萬3萬4萬や5筒6筒の連続形もあるため、序盤から七対子だけに決めません。" }]
  },
  {
    title: "役牌と門前リーチの速度比較",
    description: "役牌対子は仕掛けやすさ、門前形は良形リーチへの伸びを評価します。",
    badges: ["役牌", "リーチ"],
    rows: [{ label: "配牌例", tiles: ["man3", "man4", "man6", "man7", "pin2", "pin3", "pin8", "sou4", "sou5", "sou6", "ji5", "ji5", "ji3"], note: "發を鳴く本線を持ちながら、両面候補を壊さず門前で進む可能性も残します。" }]
  }
];

const analyses = [
  { title: "三色の種がある配牌", candidates: "三色同順 / 門前リーチ", reason: "同じ数字の両面候補が3色にあり、手役の種があります。ただし必要牌が多い段階では、三色に固定せず良形ターツの完成を優先します。", tradeoff: "三色を残すと打点候補が増えますが、弱い牌を抱えて速度を落とすことがあります。ツモで2組以上の形がまとまった時点で本線を更新します。" },
  { title: "一色に寄った配牌", candidates: "混一色 / 役牌速攻 / 通常手", reason: "同色牌と字牌が十分あり、鳴いて役を確保しやすい形です。孤立した他色が強い中張牌なら、最初の数巡は変化を残す選択もあります。", tradeoff: "染め手は打点と鳴きやすさが魅力ですが、他家に狙いが伝わりやすくなります。字牌が重なる、同色の牌を引く、他色がつながる、といったツモで方針を見直します。" },
  { title: "対子が多い配牌", candidates: "七対子 / 面子手", reason: "対子4組は七対子の候補ですが、連続した数牌は順子へ変わる力があります。対子の数だけで決めず、両面がいくつ作れそうかを見ます。", tradeoff: "七対子は鳴けず単騎待ちになる一方、使いにくい牌も対子として生かせます。対子が増えれば七対子、連続形が伸びれば面子手へ寄せます。" },
  { title: "役牌対子がある配牌", candidates: "役牌を鳴く / 門前リーチ", reason: "役牌を鳴けば1役を確保して速度を上げられます。門前側に良形候補が多いなら、序盤は鳴かずリーチと打点変化を見る余地もあります。", tradeoff: "仕掛けると守備牌が減り、打点もリーチに比べて低くなりやすい点がデメリットです。巡目、役牌の残り枚数、ドラ、親子で判断を変えます。" }
];

export function StartingHandLearningGuide() {
  return (
    <article className="startingHandLearningGuide">
      <section className="toolGuideSection" aria-labelledby="starting-guide-title">
        <p className="siteEyebrow">HOW TO READ A STARTING HAND</p>
        <h2 id="starting-guide-title">配牌分析で分かること</h2>
        <p>配牌だけで最終的な役を決めるのではなく、今見えている候補と、次のツモで方針がどう変わるかを整理するツールです。表示される順位は固定の正解ではなく、複数の狙いを同じ条件で比較するための目安として使います。</p>
        <ul className="trainerSkillList">
          <li>配牌から本線と予備の構想を見つける</li>
          <li>速度、打点、鳴きやすさの長所と短所を比べる</li>
          <li>次のツモで方針を変える条件を先に考える</li>
        </ul>
      </section>

      <section className="toolGuideSection" aria-labelledby="starting-checkpoints-title">
        <h2 id="starting-checkpoints-title">配牌で最初に見るポイント</h2>
        <div className="toolGuideColumns">
          <section>
            <h3>シャンテン数と面子候補</h3>
            <p>完成面子、両面ターツ、カンチャン、対子を数え、5ブロックを作れそうか見ます。手役候補より先に、アガリまでのおおよその距離を確認します。</p>
          </section>
          <section>
            <h3>対子と字牌・役牌</h3>
            <p>対子が多ければ七対子、役牌対子があれば鳴いて進む手が候補になります。孤立字牌は場風・自風・三元牌か、すでに何枚見えているかで価値が変わります。</p>
          </section>
          <section>
            <h3>色の偏りと手役の種</h3>
            <p>一色の数牌と字牌が多ければ混一色、同じ数字のターツが3色にあれば三色を検討できます。ただし種が見えるだけで固定せず、必要牌の多さも比べます。</p>
          </section>
          <section>
            <h3>ドラと速度のバランス</h3>
            <p>ドラやドラ周辺は打点と変化を作りますが、残すためにシャンテン数を大きく戻すとは限りません。役が遠い配牌では、無理に役を追わず良形リーチへ進む方針も本線になります。</p>
          </section>
        </div>
      </section>

      <ArticleTileFigures figures={examples} />

      <section className="toolGuideSection" aria-labelledby="starting-examples-title">
        <h2 id="starting-examples-title">4つの配牌で見る構想の立て方</h2>
        <div className="startingExampleGrid">
          {analyses.map((item) => (
            <article key={item.title}>
              <h3>{item.title}</h3>
              <p className="startingExampleCandidates">比較候補：{item.candidates}</p>
              <p>{item.reason}</p>
              <p><strong>メリット・デメリット：</strong>{item.tradeoff}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="toolGuideSection">
        <h2>数値を実戦へつなげる手順</h2>
        <ol className="toolGuideSteps">
          <li><strong>候補を二つ持つ。</strong> 最初から一つの役に決めず、本線と予備を言葉にします。</li>
          <li><strong>次の分岐を決める。</strong> どの牌を引けば本線を強め、どの牌なら方針を変えるかを確認します。</li>
          <li><strong>数巡ごとに更新する。</strong> 鳴ける牌、ドラ、場風・自風、他家の速度を加え、配牌時の構想に固執しません。</li>
        </ol>
        <p>シミュレーションは指定した条件と試行回数にもとづく比較です。実戦の山、他家の手牌、押し引き、局収支を完全に再現するものではありません。僅差の候補は順位だけで断定せず、各指標と牌姿の伸びを合わせて確認してください。</p>
      </section>

      <nav className="analysisMethodLinks toolGuideLinks" aria-label="配牌分析に関連する学習">
        <Link href="/learn/guides/five-block-theory">5ブロック理論を学ぶ</Link>
        <Link href="/learn/guides/what-is-tile-efficiency">牌効率とは何か</Link>
        <Link href="/learn/guides/calling-decision">鳴いていい手を考える</Link>
        <Link href="/analysis/mahjong-tool">14枚を牌理チェッカーで比較する</Link>
      </nav>
    </article>
  );
}

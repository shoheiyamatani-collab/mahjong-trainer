import { calculateOrasuConditions, countsToTiles, formatOrasuCandidate, parseHand, removeTile } from "@mahjong-trainer/mahjong-core";
import { tileAssetName } from "../../components/TileFigures";
import { orasuExamples } from "../../analysis/orasu-condition/orasuExamples";
import { getScoreLearningResults } from "../../tools/toolLearningResults";
import type { LearningGuide } from "./guideData";

const scoreExample = getScoreLearningResults().find((example) => example.id === "pinfu-ron");
const standingsExample = orasuExamples.find((example) => example.id === "direct-hit");

if (!scoreExample || !standingsExample) {
  throw new Error("Missing verified score and orasu examples for the cross-tool case study.");
}

const standings = calculateOrasuConditions(standingsExample.input);
const directRon = standings.ron.east;
const sideRon = standings.ron.west;
const tsumo = standings.tsumo;

if (!directRon || !sideRon || !tsumo) {
  throw new Error("The cross-tool case study requires direct-ron, side-ron, and tsumo routes.");
}

const winningTile = scoreExample.input.winningTile;
const completeHand = parseHand(scoreExample.handText);
const concealedBeforeWin = removeTile(completeHand, winningTile);
const handTiles = countsToTiles(concealedBeforeWin).map((tile) => tileAssetName(tile));
const winningTileAsset = tileAssetName(winningTile);
const practiceTiles = countsToTiles(completeHand).map((tile) => tileAssetName(tile));
const score = scoreExample.result;
const points = (value: number) => value.toLocaleString("ja-JP");
const rankAfter = (route: typeof directRon) => route.postRanking.find((row) => row.seat === "south")?.rank;
const routeRow = (label: string, route: typeof directRon) => [
  label,
  formatOrasuCandidate(route.candidate),
  points(route.postScores.south),
  points(route.postScores.east),
  String(rankAfter(route)) + "着"
];

export const scoreOrasuCaseStudy: LearningGuide = {
  slug: "score-orasu-case-study",
  title: "アガリ点とオーラス条件を照合する実例",
  seoTitle: "麻雀のオーラス逆転条件を実例で確認｜アガリ点と直撃・ツモの違い",
  description: "点数計算ツールで確かめた2,000点のアガリを、オーラス条件計算で検証。トップからの直撃、脇からのロン、ツモで着順がどう変わるかを同じ点棒状況で比較します。",
  lead: "手の点数を計算できても、その点数で何着になれるかは別の確認が必要です。雀フォリオの点数計算とオーラス条件計算を同じ局面に当てはめ、アガリ点と順位変動を順番に照合します。",
  takeaways: [
    "点数計算は手のアガリ点、オーラス計算は精算後の順位を調べる",
    "この牌姿は" + score.score.han + "翻" + (score.fu?.roundedFu ?? 0) + "符で" + points(score.score.totalPoints) + "点のロンになる",
    "同じ点数でも、誰からロンするかで着順結果が変わる"
  ],
  sections: [
    {
      heading: "1. まず牌姿からアガリ点を確かめる",
      paragraphs: [
        "例題は門前の" + scoreExample.handText + "。東場の南家が" + winningTile + "でロンし、リーチあり・ドラなし・本場なし・供託なしとします。計算器の結果は" + score.yaku.map((yaku) => yaku.name + yaku.han + "翻").join("・") + "、合計" + score.score.han + "翻" + (score.fu?.roundedFu ?? 0) + "符、" + points(score.score.totalPoints) + "点です。",
        "これは完成した手牌に対する点数です。この金額だけでは、オーラスでトップになるかまでは分かりません。次に、同じ局面の点棒状況へ計算結果を当てはめます。"
      ],
      table: {
        caption: "点数計算ツールで検証した入力条件",
        headers: ["項目", "設定・結果"],
        rows: [
          ["手牌", scoreExample.handText],
          ["和了条件", "南家・東場・門前ロン・リーチあり"],
          ["役と符", score.yaku.map((yaku) => yaku.name + yaku.han + "翻").join("・") + " / " + (score.fu?.roundedFu ?? 0) + "符"],
          ["アガリ点", points(score.score.totalPoints) + "点"]
        ]
      }
    },
    {
      heading: "2. トップからの直撃なら2,000点で逆転する",
      paragraphs: [
        "点棒は東家" + points(standingsExample.input.scores.east) + "点、南家（自分）" + points(standingsExample.input.scores.south) + "点、西家" + points(standingsExample.input.scores.west) + "点、北家" + points(standingsExample.input.scores.north) + "点。目標は同点未達のトップ、本場と供託はありません。",
        "点数計算で出た" + points(score.score.totalPoints) + "点をトップの東家からロンすると、南家は" + points(directRon.postScores.south) + "点、東家は" + points(directRon.postScores.east) + "点となり、南家が" + rankAfter(directRon) + "着に上がります。ロンでは自分の加点と放銃者の減点が同時に起きるためです。"
      ],
      table: {
        caption: "オーラス条件計算で確認した最小ルートと精算後の点棒",
        headers: ["アガリ方", "最低条件", "南家（自分）", "東家（現在トップ）", "南家の順位"],
        rows: [
          routeRow("東家からロン", directRon),
          routeRow("西家からロン", sideRon),
          ["ツモ", formatOrasuCandidate(tsumo.candidate), points(tsumo.postScores.south), points(tsumo.postScores.east), String(tsumo.postRanking.find((row) => row.seat === "south")?.rank) + "着"]
        ]
      }
    },
    {
      heading: "3. 脇からのロンとツモは別の条件になる",
      paragraphs: [
        "同じ" + points(score.score.totalPoints) + "点でも、西家からのロンでは南家が" + points(standingsExample.input.scores.south + score.score.totalPoints) + "点に増えるだけで、東家の" + points(standingsExample.input.scores.east) + "点を超えません。オーラス計算では西家からの最低条件は" + formatOrasuCandidate(sideRon.candidate) + "と表示されます。",
        "ツモは3人からの支払いを受けるため、計算器の最小条件は" + formatOrasuCandidate(tsumo.candidate) + "です。精算後は南家" + points(tsumo.postScores.south) + "点、東家" + points(tsumo.postScores.east) + "点となります。点数計算で出した手の点数と、順位計算で必要な点数は役割が違うので、同じ数値として扱わないようにします。"
      ]
    },
    {
      heading: "4. 実戦では二つの計算をこの順番で使う",
      paragraphs: [
        "先に自分の手牌・和了牌・親子・ロンツモからアガリ点を確かめます。次に現在の点棒、目標順位、本場、供託をオーラス条件計算へ入れ、直撃相手ごととツモの条件を比較します。",
        "この例では、東家からの2,000点ロンはトップに届きますが、脇からの同じ点数では届きません。実戦ではさらに、その役と待ちが成立するか、アガリ牌が残っていそうか、鳴くことで条件を満たせるかを別に判断します。計算結果はアガリやすさや押し引きの正解を示すものではありません。"
      ],
      bullets: [
        "点数計算で、手牌から成立する役・翻・符を確認",
        "オーラス計算で、ロン相手ごと・ツモごとの着順を確認",
        "最後に、役の確定・待ち・守備・対局ルールを加えて判断"
      ]
    }
  ],
  figures: [
    {
      title: "計算例の和了牌姿",
      description: "和了前の13枚に、最後にロンした牌を加えると14枚の完成形になります。",
      badges: ["門前", score.score.han + "翻" + (score.fu?.roundedFu ?? 0) + "符"],
      rows: [{ label: "和了前の13枚", tiles: handTiles, resultLabel: "ロン牌", resultTiles: [winningTileAsset], tone: "answer", note: "この条件で点数計算すると、リーチ・平和の2,000点です。" }],
      link: { href: "/tools?example=pinfu-ron#score-workspace", label: "同じ牌姿を点数計算ツールに読み込む" }
    }
  ],
  toolLink: {
    href: "/analysis/orasu-condition?example=direct-hit#orasu-calculator",
    label: "オーラス条件計算で同じ点棒状況を試す",
    description: "東家32,000点、南家28,500点の設定を読み込み、直撃・脇ロン・ツモの条件を変更して比べられます。"
  },
  relatedSlugs: ["orasu-score-conditions", "score-calculation-practice", "fu-calculation"],
  practice: {
    heading: "確認問題：2,000点ロンなら誰からでもトップ？",
    description: "東家32,000点、南家28,500点で同点未達のトップを目指します。牌姿の点数は2,000点です。",
    items: [{
      prompt: "西家から2,000点ロンした場合、トップに届く？",
      tiles: practiceTiles,
      conditions: "東家32,000点・南家28,500点・本場0・供託0。",
      answer: "届かない。南家30,500点で、東家32,000点のままです。",
      explanation: "同じ2,000点でも、東家からの直撃なら南家が" + points(directRon.postScores.south) + "点、東家が" + points(directRon.postScores.east) + "点となり逆転します。放銃者の点数も変わることを、オーラス条件計算で確かめましょう。"
    }]
  }
};

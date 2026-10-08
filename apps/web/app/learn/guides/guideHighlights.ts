import type { ArticleEmphasis } from "../../components/ArticleHighlights";

// Author-selected phrases; keep article text and emphasis separate.
export const guideArticleEmphasis: Record<string, ArticleEmphasis[]> = {
  "tile-efficiency-and-ukeire": [
    { text: "いきなり受け入れ枚数だけを見ないこと", tone: "caution" },
    { text: "実戦では場に見えている牌も差し引きます", tone: "key" },
    { text: "牌効率は答えを固定するものではなく、判断の出発点です", tone: "key" }
  ],
  "good-shape-rate": [
    { text: "次に受け入れ枚数で速度を比べ、差が小さいときに良形率を見る", tone: "key" },
    { text: "打点や安全度までは表しません", tone: "caution" }
  ],
  "wait-types": [
    { text: "自分で各2枚を使っているため最大4枚です", tone: "key" },
    { text: "一つの分け方だけで待ちを決めると、三面待ちやノベタンを見落とします", tone: "caution" }
  ],
  "mahjong-checker-examples": [
    { text: "解析する前に、自分なら何を切るかを一つか二つ決めます", tone: "key" },
    { text: "数字だけで終わらせず", tone: "caution" },
    { text: "牌理上の候補を確認した後に、局面の条件を足してください", tone: "key" }
  ],
  "five-block-theory": [
    { text: "基本のアガリ形は4面子1雀頭です", tone: "key" },
    { text: "どこか一つを外さないと4面子1雀頭に収まりません", tone: "caution" },
    { text: "ブロック数を確認してから受け入れを数えます", tone: "key" }
  ],
  "wait-shape-basics": [
    { text: "同じ牌を自分で使っていたり河に見えていたりすれば残り枚数は減ります", tone: "caution" },
    { text: "7索8索は6索と9索を受ける両面です", tone: "key" }
  ],
  "beginner-nanikiru-mistakes": [
    { text: "見た目ではなく、次に何を引くと進むかで判断します", tone: "key" },
    { text: "リーチを受けた後まで受け入れ枚数だけで切ると、放銃の危険が高まります", tone: "caution" }
  ],
  "suji-defense": [
    { text: "スジが否定するのは主に両面待ちです", tone: "key" },
    { text: "安全と断定せず、他の候補との比較に使います", tone: "caution" }
  ],
  "kabe-defense": [
    { text: "単騎、シャンポン、七対子などは別に残ります", tone: "caution" },
    { text: "自分の手牌に見えている牌も数えます", tone: "key" }
  ],
  "genbutsu-suji-kabe": [
    { text: "現物は全員に安全とは限りません", tone: "caution" },
    { text: "相手ごとに安全牌を確認します", tone: "key" }
  ],
  "calling-decision": [
    { text: "鳴いた後も役があり、シャンテン数が進むなら有力です", tone: "key" },
    { text: "アガリ役がなくなることがあります", tone: "caution" }
  ],
  "score-calculation-practice": [
    { text: "子のツモは親の支払いと子の支払いを分けて", tone: "key" },
    { text: "本場、供託、積み棒はこの20問には含めません", tone: "caution" }
  ],
  "what-is-tile-efficiency": [
    { text: "まずシャンテン数を悪化させない候補を残します", tone: "key" },
    { text: "距離と幅を混ぜないこと", tone: "caution" }
  ],
  "one-shanten-ukeire": [
    { text: "同じ牌が複数の部分に効いても1種類として数えます", tone: "caution" },
    { text: "枚数差が小さいときは、両面以上でテンパイする割合を比べます", tone: "key" }
  ],
  "rule-differences-and-calling": [
    { text: "この局面で自分は何を達成したいか", tone: "key" },
    { text: "鳴いてアガれば必ず残り局数が1局減るわけではありません", tone: "caution" },
    { text: "鳴きに必要なのは、副露率の目標ではなく局面ごとの理由です", tone: "key" }
  ],
  "furiten-basics": [
    { text: "ドラだけではアガリ役になりません", tone: "caution" },
    { text: "6萬だけでなく3萬でもロンできません", tone: "caution" },
    { text: "リーチ後の見逃しは、次の自分の手番が来ても解消しません", tone: "caution" },
    { text: "待ちが変わるたびに自分の河を見直す", tone: "key" }
  ],
  "betaori-basics": [
    { text: "1人の現物であっても別の人に当たる可能性は残ります", tone: "caution" },
    { text: "次巡の選択肢を残せるか", tone: "key" },
    { text: "両方の河にある牌を優先して探します", tone: "key" }
  ],
  "riichi-or-dama": [
    { text: "ダマで役がなければ通常のロンはできません", tone: "caution" },
    { text: "ドラがあっても役の代わりにはなりません", tone: "caution" },
    { text: "リーチすると通常の手牌の組み替えやオリはできなくなります", tone: "caution" },
    { text: "ダマの打点で足りるかを先に確認します", tone: "key" }
  ],
  "visible-tiles-and-ukeire": [
    { text: "『両面だから必ず8枚』ではありません", tone: "caution" },
    { text: "二重計上になります", tone: "caution" },
    { text: "『4枚見えていない』から『山に4枚ある』とは言えません", tone: "caution" },
    { text: "今回の公開牌の減算は自分で補ってください", tone: "key" }
  ],
  "orasu-score-conditions": [
    { text: "自分が2600点増え、相手が2600点減るため、点差は5200点動きます", tone: "key" },
    { text: "これは同点であり、『必ずトップになる』とは言えません", tone: "caution" },
    { text: "点数の条件を満たすことと、そのアガリで対局が終わることは分けて確認します", tone: "key" }
  ],
  "fu-calculation": [
    { text: "平和ツモは20符", tone: "key" },
    { text: "七対子は25符固定", tone: "key" },
    { text: "その刻子は符計算では明刻です", tone: "caution" },
    { text: "完成した14枚だけでは、待ちの符やロンで完成した刻子を確定できません", tone: "caution" }
  ]
};

import type { ArticleEmphasis } from "../../components/ArticleHighlights";

// Author-selected phrases; keep article text and emphasis separate.
export const guideArticleEmphasis: Record<string, ArticleEmphasis[]> = {
  "combo-theory": [
    { text: "32コンボは32%を意味しません", tone: "caution" },
    { text: "他家の河を本人のフリテンとして使ってはいけません", tone: "caution" },
    { text: "別の対子が成立するかは不明です", tone: "caution" },
    { text: "同じ指標で比べます", tone: "key" }
  ],
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
    { text: "鳴かれた捨て牌は副露牌に含めて一度だけ登録します", tone: "key" }
  ],
  "orasu-score-conditions": [
    { text: "自分が2600点増え、相手が2600点減るため、点差は5200点動きます", tone: "key" },
    { text: "これは同点であり、『必ずトップになる』とは言えません", tone: "caution" },
    { text: "点数の条件を満たすことと、そのアガリで対局が終わることは分けて確認します", tone: "key" }
  ],
  "score-orasu-case-study": [
    { text: "同じ点数でも、誰からロンするかで着順結果が変わります", tone: "key" },
    { text: "点数計算で出した手の点数と、順位計算で必要な点数は役割が違う", tone: "caution" },
    { text: "計算結果はアガリやすさや押し引きの正解を示すものではありません", tone: "caution" }
  ],
  "fu-calculation": [
    { text: "平和ツモは20符", tone: "key" },
    { text: "七対子は25符固定", tone: "key" },
    { text: "その刻子は符計算では明刻です", tone: "caution" },
    { text: "完成した14枚だけでは、待ちの符やロンで完成した刻子を確定できません", tone: "caution" }
  ],
  "ukeire-versus-practical-decisions": [{ text: "アガリまでの速さ、点数、他家への安全度は別の情報", tone: "caution" }],
  "isolated-tile-priorities": [{ text: "手牌全体の受け入れは単独の枚数の足し算になりません", tone: "caution" }],
  "equal-ukeire-tiebreakers": [{ text: "13枚全体の待ちを再確認してください", tone: "key" }],
  "dora-versus-speed": [{ text: "ドラの枚数を足す前に、通常手の構造を確認します", tone: "key" }],
  "six-to-five-block-examples": [{ text: "最初に決めたブロック分けで受け入れを固定しないでください", tone: "caution" }],
  "chiitoitsu-or-standard": [{ text: "表の受け入れは通常手専用で、七対子を含む最大枚数ではありません", tone: "caution" }],
  "weak-starting-hand-branches": [{ text: "この手順が必ずアガリへつながるという意味ではありません", tone: "caution" }],
  "take-tenpai-or-improve": [{ text: "残すターツ、欲しいツモ、その後の打牌を一組で確認します", tone: "key" }],
  "riichi-borderline-decisions": [{ text: "リーチで相手がどう動くか、どれだけアガりやすいかはこの点数表からは決まりません", tone: "caution" }],
  "when-to-depart-from-efficiency": [{ text: "最速候補を知ったうえで、安全な一打、必要打点、流局時の条件を優先する", tone: "key" }],
  "tedashi-tsumogiri-information": [{ text: "空切りでは、牌の種類構成が変わらない場合もあります", tone: "caution" }],
  "riichi-tile-wait-candidates": [{ text: "候補を作れることは、その待ちが多いという統計上の根拠にはなりません", tone: "caution" }],
  "suji-traps": [{ text: "除外した待ちと残る待ちをセットで言えるようにします", tone: "key" }],
  "early-and-late-riichi": [{ text: "同じ牌が早い巡だから危険、遅い巡だから安全と決まるわけではありません", tone: "caution" }],
  "two-riichi-short-on-safe-tiles": [{ text: "『現物あり』とまとめず相手ごとに確認します", tone: "key" }],
  "pair-and-taatsu-discard": [{ text: "河には切った牌しか見えず、その間に引いた牌は通常分かりません", tone: "caution" }],
  "midgame-dora-discard": [{ text: "ドラを切った瞬間だけを根拠に押し引きまで決めない", tone: "caution" }],
  "discard-order-hand-changes": [{ text: "前者の答え合わせと、後者の推測を混ぜない", tone: "key" }],
  "borderline-push-fold": [{ text: "どの条件が変わったら方針を変えるかを決めておく", tone: "key" }],
  "deceptively-safe-tiles": [{ text: "序盤の捨て牌を手牌の固定写真のように扱わず", tone: "caution" }],
  "top-place-five-mistakes": [{ text: "『トップなら押してはいけない』という意味ではありません", tone: "caution" }],
  "last-place-attack": [{ text: "今の手から作れる打点と失点の負担を比較します", tone: "key" }],
  "orasu-practice-ten": [{ text: "今の手牌で実現できる点数とは限りません", tone: "caution" }],
  "dealer-push-fold": [{ text: "押して放銃する方が常に得になるわけではありません", tone: "caution" }],
  "honba-and-sticks-decisions": [{ text: "放銃者がその場でさらに1,000点払うわけではありません", tone: "caution" }],
  "placement-points-and-riichi": [{ text: "特定サービスの現行ルールを代弁するものではありません", tone: "caution" }],
  "dama-value-situations": [{ text: "前者は攻撃の改善、後者は守備への切り替え", tone: "key" }],
  "endgame-tenpai-value": [{ text: "受け取り額だけで押しを決めないでください", tone: "caution" }],
  "opponent-calls-defense": [{ text: "鳴いた牌と河に残る牌は二重に数えません", tone: "key" }],
  "minimize-loss-decisions": [{ text: "局全体で失点しない保証ではありません", tone: "caution" }]
};

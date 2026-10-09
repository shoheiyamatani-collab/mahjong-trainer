import type { CallDifficulty } from "../call-or-pass/callModel";
import { makePushFoldQuestion, type PushFoldSpec } from "./pushFoldFactory";

const shapes = {
  ryanmen: { hand: "45m234678p45677s", drawn: "5p", push: "5p", fold: ["7s"], shanten: 0, valuePlan: "門前のタンヤオ・平和。リーチする枝では1翻を加えます。" },
  triplet: { hand: "45m234678p45666s", drawn: "5p", push: "5p", fold: ["4p"], shanten: 0, valuePlan: "タンヤオ・平和の形。6索のドラ3を残す条件では高打点になります。" },
  kanchan: { hand: "35m23445688p789s", drawn: "5p", push: "5p", fold: ["8p"], shanten: 0, valuePlan: "4萬のカンチャン。通常のダマロン役はなく、門前ツモまたはリーチが必要です。" },
  pairs: { hand: "1144m2277p338s北北", drawn: "5p", push: "5p", fold: ["1m"], shanten: 0, valuePlan: "8索単騎の七対子。25符で、リーチ・ドラの有無を分けます。" },
  one: { hand: "234m45p68p456s77s東", drawn: "5p", push: "東", fold: ["7s"], shanten: 1, valuePlan: "未完成の手。タンヤオなどは候補であり、まだアガリ役・最終点数は確定しません。" },
  two: { hand: "234m45p68p57s11s東北", drawn: "8m", push: "北", fold: ["1s"], shanten: 2, valuePlan: "2シャンテンの未完成手。ドラがあっても、完成時の役と点数は別に必要です。" },
  open: { hand: "45m234p45677s", drawn: "5p", push: "5p", fold: ["7s"], shanten: 0, selfMeld: { tiles: "白白白", kind: "pon", from: "東" }, valuePlan: "白のポンで役牌を確保。鳴いているのでリーチはできません。" },
  noYaku: { hand: "45m234p78988s", drawn: "5p", push: "5p", fold: ["8s"], shanten: 0, selfMeld: { tiles: "123p", kind: "chi", from: "東" }, valuePlan: "鳴いた役なしテンパイ。通常のロンもツモもできず、ドラだけではアガれません。" },
  pairsOne: { hand: "1144m2277p38s北北白", drawn: "6m", push: "白", fold: ["1m"], shanten: 1, valuePlan: "七対子1シャンテン。現在の対子数と公開枚数を確認し、完成後の打点を確定値とは扱いません。" },
  wall: { hand: "45m234678s45677p", drawn: "2p", push: "2p", fold: ["7p"], shanten: 0, valuePlan: "門前のタンヤオ・平和。押す牌2筒の安全情報と、手の打点は別々に比較します。" }
} satisfies Record<string, Partial<PushFoldSpec>>;

type CaseOptions = Pick<PushFoldSpec, "title" | "action" | "turn" | "reason"> & Partial<Omit<PushFoldSpec, "id" | "difficulty">>;
function lesson(level: CallDifficulty, id: number, shape: keyof typeof shapes, options: CaseOptions): PushFoldSpec {
  const base = shapes[shape];
  const spec = {
    id: `push-fold-${level}-${String(id).padStart(2, "0")}`, difficulty: level, category: "value",
    context: "他家の攻撃を受けた、ツモ直後・打牌前の局面です。自分は未リーチ。他家の隠れた手牌は不明です。",
    change: "同じ形でも、待ちの見えていない枚数、必要な着順、次の危険牌によって判断を見直します。",
    ...base, ...options
  } as PushFoldSpec;
  return spec;
}

// Fixed, authored comparisons. Only public information is used in the recommendation.
export const pushFoldSpecs: PushFoldSpec[] = [
  lesson("beginner", 1, "ryanmen", { title: "良形テンパイとドラ2", action: "push", turn: 7, indicator: "6s", riichi: true, reason: "リーチする枝は良形の満貫テンパイ。まだアガリを狙う時間があり、今回は平場で手を進める価値を優先します。", change: "大きなトップ目や残り枚数が減った条件なら、同じ満貫でも守備の価値を見直します。" }),
  lesson("beginner", 2, "two", { title: "中盤の2シャンテン", action: "fold", turn: 10, category: "distance", reason: "アガリまで複数の進行が必要で、今押す北も現物ではありません。今回は役・打点も未確定なので、現物の1索から守備を優先します。", change: "良形テンパイまで進んでいた場合は、アガリの機会を取りに行く価値が増します。" }),
  lesson("beginner", 3, "ryanmen", { title: "現物でテンパイを保てる", action: "push", turn: 8, category: "defense", riverFacts: { 東: "5p" }, reason: "5筒は攻撃者の現物で、切ってもテンパイを保てます。この一打は手を崩さず継続します。ただし次の危険牌まで押すと決めたわけではありません。", change: "次に現物でない牌を引いたら、テンパイ維持と守備を改めて比較します。" }),
  lesson("beginner", 4, "one", { title: "終盤の1シャンテン", action: "fold", turn: 16, category: "endgame", reason: "まだテンパイまで進める必要があり、残りのツモも少ない局面です。未確定の打点のために現物でない東を押さず、現物の7索からオリる方針を取ります。" }),
  lesson("beginner", 5, "triplet", { title: "ドラ3の良形テンパイ", action: "push", turn: 8, indicator: "5s", reason: "ダマでもドラ3を残した満貫の良形です。平場の中盤でアガリを目指す価値が高く、今回は5筒を押してテンパイを保つ方針です。", change: "複数攻撃や大きな着順リードが加われば、満貫だけを理由に押し続けません。" }),
  lesson("beginner", 6, "kanchan", { title: "役なしのカンチャン", action: "fold", turn: 15, category: "shape", reason: "ダマでは通常のロン役がなく、待ちは4萬だけです。終盤に新たな危険牌を押すより、8筒の現物から守備へ切り替える方針です。" }),
  lesson("beginner", 7, "open", { title: "役牌とドラ3のテンパイ", action: "push", turn: 8, indicator: "中", redHand: ["5m"], reason: "白の役牌にドラ3と赤を残す満貫テンパイです。役がある鳴き手としてアガリを狙う価値があり、今回は両面を保って押します。" }),
  lesson("beginner", 8, "noYaku", { title: "鳴いた後のアガリ役", action: "fold", turn: 10, category: "value", reason: "形はテンパイですが、役なしの副露手です。通常のアガリを見込んだ押し返しとは扱わず、現物の8索から守備を取ります。", change: "タンヤオや役牌を確保できる別の鳴き手なら、同じテンパイでもアガリ価値が変わります。" }),
  lesson("beginner", 9, "ryanmen", { title: "自分が親の高打点", action: "push", turn: 7, seat: "東", indicator: "6s", riichi: true, reason: "自分が親で、ドラ2の良形をリーチする枝です。高い支払いと親の継続を狙う価値を、この平場では優先します。" }),
  lesson("beginner", 10, "two", { title: "親リーチと遠い手", action: "fold", turn: 13, category: "attacks", reason: "親の攻撃に対し、こちらは2シャンテンです。自分の役と点数も未確定で、今の北には現物の根拠がありません。1索から守備を続ける方針です。" }),
  lesson("beginner", 11, "ryanmen", { title: "低打点でも安全に継続", action: "push", turn: 10, riverFacts: { 東: "5p" }, category: "defense", reason: "押す5筒がリーチ者の現物なので、この一打で手を壊す必要はありません。低打点の手でも、安全な打牌でテンパイを維持する選択はあります。" }),
  lesson("beginner", 12, "pairsOne", { title: "七対子の1シャンテン", action: "fold", turn: 14, category: "distance", reason: "まだ対子を増やしてテンパイする必要があり、完成点数も確定しません。終盤の親リーチに対し、現物の1萬から守備を優先します。" }),
  lesson("beginner", 13, "open", { title: "白の役と安全な5筒", action: "push", turn: 9, riverFacts: { 東: "5p" }, category: "defense", reason: "白の役があり、5筒は攻撃者の現物です。この一打は安全にテンパイを保ちます。リーチしていないので、次の危険牌ではオリる自由もあります。" }),
  lesson("beginner", 14, "one", { title: "1シャンテンで必要な進行", action: "fold", turn: 14, category: "distance", reason: "有効牌を引いてからアガリを待つ必要があり、今の手はまだテンパイではありません。今回は手役と打点が未確定なので、7索から守備へ移ります。" }),
  lesson("beginner", 15, "triplet", { title: "高打点と残り巡目", action: "push", turn: 6, indicator: "5s", reason: "満貫の両面テンパイを早い巡目で取っています。残りの機会と打点を活かす目的で、この平場では押す方針を取ります。" }),
  lesson("beginner", 16, "noYaku", { title: "ドラがあっても役は必要", action: "fold", turn: 12, indicator: "7s", reason: "8索のドラがあっても、役なしの副露手は通常アガれません。ドラだけを確定したアガリ打点のように扱わず、現物の8索からオリます。" }),
  lesson("beginner", 17, "ryanmen", { title: "子リーチに安全な一打", action: "push", turn: 9, attackSeats: ["西"], riverFacts: { 西: "5p" }, category: "defense", reason: "西家のリーチに対して5筒が現物で、手の形も保てます。親子だけで決める前に、この一打に安全の根拠があることを確認します。" }),
  lesson("beginner", 18, "two", { title: "終盤に現物を2枚持つ", action: "fold", turn: 16, category: "endgame", reason: "1索を対子で持ち、攻撃者の現物として使えます。2シャンテンのアガリを追うより、次の手番にも現物を残せる守備を選びます。" }),
  lesson("beginner", 19, "ryanmen", { title: "赤を残した良形", action: "push", turn: 7, indicator: "6s", redHand: ["5m"], reason: "赤とドラ2を残す良形テンパイです。平場の早い巡目でアガリを取りに行くため、今回は押す方針を選びます。" }),
  lesson("beginner", 20, "kanchan", { title: "終盤に手を固定するか", action: "fold", turn: 16, category: "endgame", reason: "役なしのカンチャンで、リーチには以後オリられない制約もあります。残りの機会が少ないため、今回は8筒の現物から守備を優先します。" }),

  lesson("intermediate", 1, "kanchan", { title: "愚形に赤とドラ2", action: "push", turn: 8, indicator: "7p", redHand: ["5p"], riichi: true, strength: "lean_push", alternative: true, category: "shape", reason: "カンチャンの狭さは残りますが、リーチ・ドラ2・赤を含む満貫を狙えます。今回は打点を優先する押し寄り。待ちの狭さを重く見る守備も妥当です。" }),
  lesson("intermediate", 2, "kanchan", { title: "同じ愚形でもドラなし", action: "fold", turn: 12, strength: "lean_fold", alternative: true, category: "shape", reason: "リーチしても基本の打点は低く、4萬だけの待ちです。今回は親リーチへの守備寄りですが、残り枚数と押す牌の根拠を見て押す判断も比較します。" }),
  lesson("intermediate", 3, "ryanmen", { title: "5筒がスジになっている", action: "push", turn: 8, indicator: "6s", riichi: true, riverFacts: { 東: "28p" }, category: "defense", strength: "lean_push", alternative: true, reason: "2筒・8筒の両方が河にあるため、5筒はスジの情報があります。満貫の良形を進める押し寄りですが、カンチャンや単騎まで安全にはなりません。" }),
  lesson("intermediate", 4, "one", { title: "スジがあっても1シャンテン", action: "fold", turn: 13, push: "5p", riverFacts: { 東: "28p" }, category: "defense", strength: "lean_fold", alternative: true, reason: "5筒にスジの情報があっても、現物ではありません。こちらは1シャンテンなので、今回は手を進める価値より守備を優先するオリ寄りです。" }),
  lesson("intermediate", 5, "wall", { title: "3筒が4枚見えている", action: "push", turn: 8, riverFacts: { 東: "3333p" }, indicator: "6p", category: "defense", strength: "lean_push", alternative: true, reason: "3筒の4枚見えは2筒を使う該当両面経路を消します。打点のあるテンパイを保つ押し寄りですが、2筒単騎やシャンポンは否定できません。" }),
  lesson("intermediate", 6, "wall", { title: "3筒は3枚見え", action: "fold", turn: 13, riverFacts: { 東: "333p" }, category: "defense", strength: "lean_fold", alternative: true, reason: "3枚見えには残り1枚を相手が持つ余地があります。低打点のテンパイで親リーチを受けた今回は、ワンチャンスだけを過信せず守備寄りにします。" }),
  lesson("intermediate", 7, "ryanmen", { title: "2人のリーチと共通現物", action: "push", turn: 9, attackSeats: ["東", "西"], riverFacts: { 東: "5p", 西: "5p" }, category: "attacks", reason: "5筒は両方のリーチ者の現物で、切ってもテンパイを保てます。この一打は両者への安全と形を両立します。次の牌でも両者を確認し直します。" }),
  lesson("intermediate", 8, "ryanmen", { title: "Aには現物、Bには？", action: "fold", turn: 13, attackSeats: ["東", "西"], riverFacts: { 東: "5p" }, category: "attacks", strength: "lean_fold", alternative: true, reason: "5筒は東家の現物でも、西家には同じ保証がありません。今回は低打点で2人の攻撃に対し、共通現物の7索からオリる方針を優先します。" }),
  lesson("intermediate", 9, "one", { title: "役牌のある2副露の相手", action: "fold", turn: 12, openAttacker: "東", category: "attacks", strength: "lean_fold", alternative: true, reason: "相手は中の役と2副露を公開していますが、テンパイは未確定です。こちらの未完成手の価値も未確定なので、今回は現物の7索から守備寄りにします。" }),
  lesson("intermediate", 10, "triplet", { title: "副露相手と満貫テンパイ", action: "push", turn: 8, openAttacker: "東", indicator: "5s", category: "attacks", strength: "lean_push", alternative: true, reason: "相手の副露は攻撃の材料ですが、テンパイ・最終打点は分かりません。こちらは満貫の良形で、今回は自分の確定したアガリ価値を活かす押し寄りです。" }),
  lesson("intermediate", 11, "pairs", { title: "七対子の単騎とドラ2", action: "push", turn: 8, indicator: "6p", riichi: true, category: "shape", strength: "lean_push", alternative: true, reason: "七対子・ドラ2をリーチする枝は満貫になります。単騎の狭さと引き換えに打点を取りに行く押し寄り。良形と同じアガリやすさではないため守備も比較します。" }),
  lesson("intermediate", 12, "pairs", { title: "低打点の七対子単騎", action: "fold", turn: 14, category: "shape", strength: "lean_fold", alternative: true, reason: "七対子のダマは低打点で、8索単騎です。終盤の親リーチに対しては、今回は現物の1萬からオリる柔軟性を優先します。" }),
  lesson("intermediate", 13, "ryanmen", { title: "フリテンの両面", action: "fold", turn: 12, riverFacts: { 南: "3m" }, category: "shape", reason: "3萬を自分で捨てているので、6萬でもロンできません。役があってもロン機会は失われているため、今回は現物から守備へ切り替えます。" }),
  lesson("intermediate", 14, "ryanmen", { title: "待ちの公開枚数が増えた", action: "fold", turn: 14, riverFacts: { 西: "333m66m" }, category: "shape", strength: "lean_fold", alternative: true, reason: "形は両面でも、公開牌により見えていない待ち枚数が減っています。親リーチへの低打点の押し返しとしては、今回は守備寄りです。" }),
  lesson("intermediate", 15, "open", { title: "副露した自分の守備", action: "push", turn: 10, riverFacts: { 東: "5p" }, category: "defense", reason: "白の役付きテンパイを、現物の5筒で維持できます。自分が副露していても、全ての牌を押す必要はなく、安全な一打と次の守備を分けます。" }),
  lesson("intermediate", 16, "noYaku", { title: "役なし形とノーテン支払い", action: "fold", turn: 15, category: "endgame", strength: "lean_fold", alternative: true, reason: "役なしでも形のテンパイを維持する流局価値はありますが、アガリの利益とは別です。今回は現物でない5筒を押すより守備寄り。流局の支払いは他家のテンパイ条件ごとに比較します。" }),
  lesson("intermediate", 17, "ryanmen", { title: "子の攻撃へ親が押す", action: "push", turn: 9, seat: "東", indicator: "6s", riichi: true, category: "value", strength: "lean_push", alternative: true, reason: "自分が親で、高打点の良形を進める価値があります。親の連荘も含めて押し寄りですが、親だからすべての危険牌を押すという意味ではありません。" }),
  lesson("intermediate", 18, "two", { title: "ドラが多い遠い手", action: "fold", turn: 12, indicator: "9s", category: "distance", reason: "1索のドラがあっても、2シャンテンからは何度も進行が必要です。完成する役と点数を確定できないため、今回は1索の現物から守備を優先します。" }),
  lesson("intermediate", 19, "ryanmen", { title: "中央牌の片側だけのスジ", action: "fold", turn: 13, drawn: "4p", push: "4p", riverFacts: { 東: "1p" }, category: "defense", strength: "lean_fold", alternative: true, reason: "1筒だけでは4筒の両側の両面経路を否定できません。7筒側の情報がないため、中央牌を完全なスジとして扱わず、今回は守備寄りです。" }),
  lesson("intermediate", 20, "triplet", { title: "高打点と複数攻撃", action: "fold", turn: 14, indicator: "5s", attackSeats: ["東", "西"], category: "attacks", strength: "debatable", alternative: true, reason: "満貫の良形は押す理由ですが、2人の攻撃も大きな負担です。今回は守備寄りを紹介しますが、打点と残り枚数を重視する押しも許容し、正答率には含めません。" }),

  lesson("advanced", 1, "ryanmen", { title: "南4局・大きなトップ", action: "fold", turn: 12, round: "南", roundNumber: 4, scores: [20000, 44000, 20000, 16000], category: "conditions", context: "自分はトップ。今局のアガリ点を増やすより、大きな失点を避けてリードを守る目的です。親のアガリ・テンパイは連荘として扱います。", reason: "低打点の良形を維持する利益より、トップのリードを失うリスクを重く見ます。共通現物からオリる方針です。親の連荘があるので、オリれば必ず半荘が終わるとは扱いません。" }),
  lesson("advanced", 2, "triplet", { title: "南4局・満貫で順位を狙う", action: "push", turn: 10, indicator: "5s", round: "南", roundNumber: 4, scores: [33000, 17000, 23000, 27000], target: 3, category: "conditions", reason: "満貫の良形で、着順を上げるためのアガリを狙えます。誰からのロンかで到達順位が変わるため、今回は条件を満たすアガリ機会を取りに行きます。" }),
  lesson("advanced", 3, "ryanmen", { title: "安い直撃でも3着へ", action: "push", turn: 10, round: "南", roundNumber: 4, scores: [36000, 20000, 21000, 23000], target: 3, category: "conditions", strength: "lean_push", alternative: true, reason: "低打点でも、3着との点差を逆転するアガリに価値があります。オーラスの点棒を実際に動かして比較する押し寄りですが、宣言牌の危険と他家のアガリも別に考えます。" }),
  lesson("advanced", 4, "two", { title: "ラス目でも遠い手", action: "fold", turn: 15, round: "南", roundNumber: 4, scores: [33000, 12000, 26000, 29000], target: 3, category: "conditions", strength: "lean_fold", alternative: true, reason: "ラスだから必ず押すとはしません。今回は2シャンテンで打点も未確定。オリても順位が上がる保証はありませんが、アガリを作る距離と放銃負担を比較して守備寄りにします。" }),
  lesson("advanced", 5, "triplet", { title: "高打点でもトップ維持", action: "fold", turn: 14, indicator: "5s", round: "南", roundNumber: 4, scores: [18000, 48000, 18000, 16000], attackSeats: ["東", "西"], category: "conditions", strength: "lean_fold", alternative: true, reason: "満貫の良形は押す材料ですが、今回は大きなトップで複数攻撃を受けています。追加点よりリードを守るオリ寄り。満貫ならいつでも押すという暗記にはしません。" }),
  lesson("advanced", 6, "ryanmen", { title: "親番でアガリと連荘", action: "push", turn: 10, seat: "東", round: "南", roundNumber: 4, scores: [20000, 25000, 28000, 27000], target: 3, indicator: "6s", riichi: true, category: "conditions", strength: "lean_push", alternative: true, reason: "親の高打点テンパイでは、アガリの点数と連荘の価値を考えます。今回は着順を上げるため押し寄り。親アガリで即終了する設定ではありません。" }),
  lesson("advanced", 7, "ryanmen", { title: "2着維持の安全な一打", action: "push", turn: 13, round: "南", roundNumber: 4, scores: [41000, 31000, 16000, 12000], riverFacts: { 東: "5p" }, category: "defense", reason: "5筒は現物で、切ってもテンパイを維持できます。2着維持を目的にしても、安全にアガリを待つ一打は可能です。今後の危険牌まで勝負する約束ではありません。" }),
  lesson("advanced", 8, "one", { title: "終盤の1シャンテンと2着", action: "fold", turn: 16, round: "南", roundNumber: 4, scores: [41000, 31000, 16000, 12000], category: "conditions", reason: "2着のリードを守りたい局面で、こちらはまだ1シャンテンです。残りの機会を考えると、未確定のアガリを追うより現物から守備を取る方針を優先します。" }),
  lesson("advanced", 9, "ryanmen", { title: "形式テンパイを現物で維持", action: "push", turn: 17, riverFacts: { 東: "5p" }, category: "endgame", reason: "現物の5筒でテンパイを維持でき、流局時の支払いにも意味があります。今回は安全な一打で継続します。ノーテン罰符の差は他家のテンパイ人数で変わります。" }),
  lesson("advanced", 10, "noYaku", { title: "役なし形の終盤押し引き", action: "fold", turn: 17, category: "endgame", strength: "debatable", alternative: true, reason: "役なしの形テンパイには流局の価値がありますが、通常のアガリはできません。今回は守備を推奨しつつ、ノーテン支払いと危険牌の比較で押す考えも許容します。" }),
  lesson("advanced", 11, "ryanmen", { title: "Aのスジ、Bの無筋", action: "fold", turn: 13, indicator: "6s", attackSeats: ["東", "西"], riverFacts: { 東: "28p" }, category: "attacks", strength: "debatable", alternative: true, reason: "東家にスジの5筒でも、西家には同じ根拠がありません。高打点を押す考えと複数攻撃への守備を比べる問題として扱い、一つの客観的最適解とはしません。" }),
  lesson("advanced", 12, "open", { title: "役付き副露と着順条件", action: "push", turn: 10, indicator: "中", redHand: ["5m"], round: "南", roundNumber: 4, scores: [35000, 18000, 22000, 25000], target: 3, category: "conditions", strength: "lean_push", alternative: true, reason: "自分は役と満貫を確保した副露テンパイです。必要な着順へ届くアガリを比較し、今回は押し寄り。どこからのロンでも同じ順位になるとは扱いません。" }),
  lesson("advanced", 13, "pairs", { title: "単騎・赤なし・大きなトップ", action: "fold", turn: 14, round: "南", roundNumber: 4, scores: [21000, 44000, 18000, 17000], category: "conditions", reason: "低打点の七対子単騎で、トップのリードがあります。今回はアガリ点を追加するより、現物の1萬から放銃回避を優先します。" }),
  lesson("advanced", 14, "kanchan", { title: "オーラスの高打点カンチャン", action: "push", turn: 11, indicator: "7p", redHand: ["5p"], riichi: true, round: "南", roundNumber: 4, scores: [32000, 16000, 24000, 28000], target: 3, category: "conditions", strength: "debatable", alternative: true, reason: "着順を上げるには打点が必要で、リーチする枝は満貫です。一方でカンチャンと親リーチの負担もあり、押す・オリるの両方を許容して理由を比較します。" }),
  lesson("advanced", 15, "triplet", { title: "2人の現物で高打点を維持", action: "push", turn: 12, indicator: "5s", attackSeats: ["東", "西"], riverFacts: { 東: "5p", 西: "5p" }, category: "attacks", reason: "この5筒は両リーチ者の現物です。満貫テンパイを安全な一打で維持できるため継続します。次に共通現物がなくなったら、再び押し引きを判断します。" }),
  lesson("advanced", 16, "one", { title: "2人の攻撃に未完成手", action: "fold", turn: 14, attackSeats: ["東", "西"], category: "attacks", reason: "1シャンテンの未確定打点に対し、2人の攻撃があります。今回は両者への現物となる7索から守備を優先します。" }),
  lesson("advanced", 17, "wall", { title: "カベとオーラスの打点", action: "push", turn: 11, riverFacts: { 東: "3333p" }, indicator: "6p", round: "南", roundNumber: 4, scores: [32000, 18000, 24000, 26000], target: 3, category: "defense", strength: "debatable", alternative: true, reason: "4枚見えは2筒の該当両面経路を否定する材料ですが、安全の保証ではありません。着順を上げるアガリ価値との比較で押し寄りを紹介し、守備の別解も許容します。" }),
  lesson("advanced", 18, "ryanmen", { title: "本場を含む低打点", action: "fold", turn: 15, honba: 2, round: "南", roundNumber: 4, scores: [26000, 35000, 23000, 16000], category: "conditions", strength: "lean_fold", alternative: true, reason: "本場でアガリ点は増えますが、放銃時の支払いも増えます。今回はトップ維持と終盤の守備を重視するオリ寄りで、本場だけを押す理由にはしません。" }),
  lesson("advanced", 19, "ryanmen", { title: "供託と自分のリーチ棒", action: "push", turn: 10, attackSeats: ["東", "西"], indicator: "6s", riichi: true, round: "南", roundNumber: 4, scores: [32000, 19000, 23000, 26000], target: 3, category: "conditions", strength: "debatable", alternative: true, reason: "既存の供託はアガった人が受け取ります。自分がリーチしてアガれば自分の棒も戻るため、点数から毎回1000点を差し引きません。高打点を狙う押しと複数攻撃への守備を比較します。" }),
  lesson("advanced", 20, "pairsOne", { title: "終盤の安全牌を残す", action: "fold", turn: 15, round: "南", roundNumber: 4, scores: [30000, 33000, 21000, 16000], category: "endgame", reason: "まだ七対子の1シャンテンで、白を押してからも進行が必要です。現物の1萬を対子で使えるため、今回はトップを守る目的で守備を優先します。" })
];

export function buildPushFoldCorpus() { return pushFoldSpecs.map(makePushFoldQuestion); }

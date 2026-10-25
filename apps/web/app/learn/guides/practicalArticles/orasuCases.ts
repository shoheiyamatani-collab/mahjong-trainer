import type { OrasuConditionInput, OrasuScores, OrasuTargetRank } from "@mahjong-trainer/mahjong-core";
import type { StudyCase } from "./types";

const input = (scores: OrasuScores, targetRank: OrasuTargetRank = 1, changes: Partial<OrasuConditionInput> = {}): OrasuConditionInput => ({ scores, selfSeat: "south", dealerSeat: "east", targetRank, honba: 0, riichiSticks: 0, tiePolicy: "strict", ...changes });
const makeCase = (number: number, title: string, condition: OrasuConditionInput, focus: string, alternative: string, conclusion: string): StudyCase => ({
  id: `orasu-practice-${String(number).padStart(2, "0")}`, title,
  situation: "南4局。点棒はリーチ棒を出した後の現在値。アガリ精算直後に目標順位へ届く条件を考える。", orasu: condition,
  options: [{ label: "直撃する場合", reason: focus }, { label: "別の相手・ツモの場合", reason: alternative }], conclusion
});

export const orasuPracticeCases: StudyCase[] = [
  { ...makeCase(1, "トップと3,500点差", input({ east: 32000, south: 28500, west: 22000, north: 17500 }), "東家からのロンは自分の加点とトップの減点が同時に起きる。必要点は点差の半分を超える基本点から探す。", "西家・北家からのロンではトップは減らない。ツモでは親と子の支払額が異なる。", "同じトップ目標でも、直撃、他家からのロン、ツモを別々に計算する。"), hands: [{ label: "この問題で2,000点ロンを作れる13枚", tiles: "45m234678p45677s", expectedWaits: ["3m", "6m"], score: { winningTile: "3m", expectedRon: [2000, 3900] } }] },
  makeCase(2, "4,000点差・同点を認める", input({ east: 32000, south: 28000, west: 22500, north: 17500 }, 1, { tiePolicy: "allow" }), "2,000点を東家からロンすると30,000点同士になる。同点で達成する設定なら条件を満たす。", "同点未達へ切り替えると2,000点では足りない。実際の起家優先規定は別に確認する。", "同点を含む目標と、相手を上回る目標を同じ条件表にしない。"),
  makeCase(3, "自分が親の逆転条件", input({ east: 28500, south: 32000, west: 22000, north: 17500 }, 1, { selfSeat: "east" }), "子の南家からの直撃は点差を両側から縮める。親の基本ロン点の候補から最低点を探す。", "親のツモは全員同額。南家の減点を含めた差の縮み方を確認する。", "親は子と同じ翻符でも点数が違う。子の条件を流用しない。"),
  makeCase(4, "4着から2着を目指す", input({ east: 45000, south: 10000, west: 30000, north: 15000 }, 2), "2着の西家を直撃すると、その相手の失点も順位に効く。満貫8,000点では18,000対22,000で届かない。", "トップの東家からアガっても西家は30,000点のまま。『誰からでも同じ』ではない。", "3着を抜くだけでは2着条件を満たさない。全員の精算後の順位で判定する。"),
  makeCase(5, "まずラスを抜ける", input({ east: 40000, south: 14000, west: 29500, north: 16500 }, 3), "3着の北家からの直撃は2,500点差を両側から縮める。小さなアガリでも届く可能性がある。", "親からのロンでは北家は減らない。ツモは北家の支払いを含めて判断する。", "ラス回避が目的なら、トップ条件を追いすぎてアガリを逃さない。"),
  makeCase(6, "大差のラスからトップへ", input({ east: 45000, south: 8000, west: 30000, north: 17000 }), "トップからの直撃でも、大きな打点が必要。表で必要な基本点を先に確認する。", "他家からのロンはトップの持ち点を減らせない。ツモも支払い分まで含める。", "条件計算は必要点を示すだけで、その手牌から作れる打点やアガリやすさを保証しない。"),
  makeCase(7, "2本場・供託1本の3,500点差", input({ east: 32000, south: 28500, west: 22000, north: 16500 }, 1, { honba: 2, riichiSticks: 1 }), "東家から1,000点をロンすると本場込み1,600点を移動し、さらに供託1,000点が自分に入る。", "供託は放銃者の追加失点ではない。他家からのロンやツモの条件を同じ式にしない。", "東家30,400点、自分31,100点で逆転。本場は両側、供託は自分の加点だけに効く。"),
  makeCase(8, "僅差から2着以内へ", input({ east: 26000, south: 24500, west: 25000, north: 24500 }, 2), "西家を抜くには、その相手からの小さな直撃でもよい。北家との同点順位にも注意する。", "東家を直撃しても西家が残る。最終的に自分より上の相手が何人いるかを数える。", "一人を抜けばよいと決める前に、同点者を含めて順位を数え直す。"),
  makeCase(9, "供託3本を含むトップ条件", input({ east: 34000, south: 27000, west: 21000, north: 15000 }, 1, { riichiSticks: 3 }), "3本の供託はアガリ時に3,000点加点。直撃相手の失点とは分ける。", "ツモでも供託を受け取る。供託があるからといって特定の相手だけからアガる必要があるとは限らない。", "点棒合計は97,000点、場に供託3,000点。リーチ前の点棒にさらに供託を足す二重計上を避ける。"),
  makeCase(10, "西家からトップへ・親の支払い差", input({ east: 26000, south: 25000, west: 24500, north: 24500 }, 1, { selfSeat: "west" }), "トップの親を直撃する場合と、南家を直撃する場合で上回る相手が違う。", "子のツモでは親の支払いが大きい。わずかな点差ではこの差が順位に効く。", "同じ点差でも誰が親かを変えて条件を比べる。支払いの合計だけで判定しない。")
];

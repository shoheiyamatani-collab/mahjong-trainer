import type { ToolPreviewScreenshot } from "../components/ToolPreviewImage";
export const trainerPresentation: Record<string, { summary: string; crop: NonNullable<ToolPreviewScreenshot["crop"]> }> = {
  "ukeire-max": { summary: "打牌ごとの有効牌を比べ、受け入れ最大の一打を選びます。", crop: { x: 14, y: 42, width: 160, height: 100 } },
  iishanten: { summary: "テンパイまであと一歩。受け入れと良形を比べる何切るです。", crop: { x: 15, y: 145, width: 160, height: 100 } },
  "seven-tile": { summary: "7枚の複合形から、すべての待ち牌を選びます。", crop: { x: 10, y: 130, width: 180, height: 112.5 } },
  chinitsu: { summary: "清一色の13枚を分解し、多面待ちを見つけます。", crop: { x: 10, y: 12, width: 160, height: 100 } },
  score: { summary: "翻・符を数え、親子とロン・ツモの点数を答えます。", crop: { x: 10, y: 44, width: 200, height: 125 } },
  "score-hard": { summary: "カン・高符・複雑な待ちを含む点数計算に挑戦します。", crop: { x: 10, y: 108, width: 200, height: 125 } },
  "call-or-pass": { summary: "ポン・チー・スルーを選び、役・速度・打点を比べます。", crop: { x: 135, y: 737, width: 260, height: 162.5 } },
  "riichi-or-dama": { summary: "待ち・打点・点棒状況から、リーチかダマかを判断します。", crop: { x: 125, y: 730, width: 256, height: 160 } },
  "push-or-fold": { summary: "手牌価値と相手の河を見て、押すかオリるかを判断します。", crop: { x: 25, y: 335, width: 256, height: 160 } },
  "tedashi-reading": { summary: "手出し・ツモ切りから、牌譜上の手牌変化を読みます。", crop: { x: 0, y: 50, width: 288, height: 180 } }
};

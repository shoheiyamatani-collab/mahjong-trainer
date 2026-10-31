// Fixed teaching examples, not reconstructed scenes from the linked videos.
export const clipScoreExample = {
  scores: { east: 32000, south: 28500, west: 22000, north: 17500 },
  selfSeat: "south", dealerSeat: "east", targetRank: 1, honba: 0, riichiSticks: 0, tiePolicy: "strict",
  rows: [
    { label: "東家から2,000点ロン", method: "ron", fromSeat: "east", south: 30500, east: 30000, reachesTarget: true },
    { label: "西家から2,000点ロン", method: "ron", fromSeat: "west", south: 30500, east: 32000, reachesTarget: false },
    { label: "500 / 1,000点ツモ", method: "tsumo", fromSeat: null, south: 30500, east: 31000, reachesTarget: false }
  ],
  href: "/analysis/orasu-condition?example=direct-hit#orasu-calculator"
} as const;

export const clipSuuankouExample = {
  hand: "222m555p777s白白中中",
  winningTile: "中",
  groups: [
    { asset: "man2", name: "二萬", count: 3 },
    { asset: "pin5", name: "五筒", count: 3 },
    { asset: "sou7", name: "七索", count: 3 },
    { asset: "ji6", name: "白", count: 2 },
    { asset: "ji7", name: "中", count: 2 }
  ],
  ronYaku: ["三暗刻", "対々和", "役牌"],
  tsumoYaku: ["四暗刻"]
} as const;

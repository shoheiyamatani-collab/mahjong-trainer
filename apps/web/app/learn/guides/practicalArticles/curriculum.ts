type CurriculumEntry = {
  level: "初級" | "中級" | "上級";
  themes: [string, string];
  category?: "judgment";
  practice?: "iishanten" | "ukeire-max" | "score" | "seven-tile";
};

export const practicalCurriculum: Record<number, CurriculumEntry> = {
  1: { level: "中級", themes: ["受け入れ", "局面の目的"], practice: "iishanten" },
  2: { level: "中級", themes: ["孤立牌", "くっつき"], practice: "iishanten" },
  3: { level: "中級", themes: ["同率比較", "最終待ち"], practice: "ukeire-max" },
  4: { level: "中級", themes: ["ドラ", "必要打点"], practice: "iishanten" },
  5: { level: "中級", themes: ["5ブロック", "余剰ターツ"], practice: "iishanten" },
  6: { level: "中級", themes: ["七対子", "通常手"], practice: "iishanten" },
  7: { level: "初級", themes: ["配牌", "構想の更新"], practice: "iishanten" },
  8: { level: "中級", themes: ["テンパイ", "良形変化"], category: "judgment", practice: "seven-tile" },
  9: { level: "中級", themes: ["リーチ", "ダマ"], category: "judgment" },
  10: { level: "中級", themes: ["速度の代償", "着順条件"] },
  11: { level: "中級", themes: ["手出し", "確定と推測"] },
  12: { level: "上級", themes: ["宣言牌", "待ち候補"] },
  13: { level: "中級", themes: ["スジ", "縦待ち"] },
  14: { level: "中級", themes: ["巡目", "押し引き"] },
  15: { level: "上級", themes: ["2軒リーチ", "共通現物"] },
  16: { level: "中級", themes: ["ターツ落とし", "時系列"] },
  17: { level: "上級", themes: ["ドラ切り", "複数の候補"] },
  18: { level: "上級", themes: ["最終手出し", "手牌変化"] },
  19: { level: "上級", themes: ["押し引き", "方針の切り替え"], category: "judgment" },
  20: { level: "中級", themes: ["カベ", "残る待ち"] },
  21: { level: "中級", themes: ["トップ維持", "直撃"] },
  22: { level: "中級", themes: ["ラス回避", "目標順位"] },
  23: { level: "中級", themes: ["オーラス", "点差の精算"], practice: "score" },
  24: { level: "中級", themes: ["親子", "連荘"] },
  25: { level: "初級", themes: ["本場", "供託"] },
  26: { level: "上級", themes: ["順位点", "リーチ棒"] },
  27: { level: "中級", themes: ["ダマ", "待ちの変更"], category: "judgment" },
  28: { level: "中級", themes: ["流局", "ノーテン罰符"] },
  29: { level: "中級", themes: ["副露", "進行度"] },
  30: { level: "中級", themes: ["撤退計画", "現物の枚数"] },
};

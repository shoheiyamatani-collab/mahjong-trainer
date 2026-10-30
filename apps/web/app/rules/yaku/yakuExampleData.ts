import type { HandScoreMeldKind } from "@mahjong-trainer/mahjong-core";

export type YakuTileBlock = {
  label?: string;
  tiles: string[];
  highlight?: boolean;
  meld?: HandScoreMeldKind;
};

export type YakuTileExample = {
  blocks: YakuTileBlock[];
  winningTile: string;
  condition?: string;
};

export const yakuTileExamples: Record<string, YakuTileExample> = {
  リーチ: {
    blocks: [
      { tiles: ["man2", "man3", "man4"] },
      { tiles: ["pin3", "pin4", "pin5"] },
      { tiles: ["sou6", "sou7", "sou8"] },
      { label: "両面待ち", tiles: ["man6", "man7"], highlight: true },
      { tiles: ["pin5", "pin5"] }
    ],
    winningTile: "man8"
  },
  タンヤオ: {
    blocks: [
      { label: "2〜8だけ", tiles: ["man2", "man3", "man4"], highlight: true },
      { label: "2〜8だけ", tiles: ["pin3", "pin4", "pin5"], highlight: true },
      { label: "2〜8だけ", tiles: ["sou6", "sou7", "sou8"], highlight: true },
      { label: "2〜8だけ", tiles: ["man6", "man7"], highlight: true },
      { label: "2〜8だけ", tiles: ["pin5", "pin5"], highlight: true }
    ],
    winningTile: "man8"
  },
  役牌: {
    blocks: [
      { tiles: ["man2", "man3", "man4"] },
      { tiles: ["pin3", "pin4", "pin5"] },
      { tiles: ["sou6", "sou7", "sou8"] },
      { tiles: ["man5", "man5"] },
      { label: "中を3枚", tiles: ["ji7", "ji7"], highlight: true }
    ],
    winningTile: "ji7"
  },
  ツモ: {
    blocks: [
      { tiles: ["man2", "man3", "man4"] },
      { tiles: ["pin3", "pin4", "pin5"] },
      { tiles: ["sou6", "sou7", "sou8"] },
      { label: "自分で引く", tiles: ["man6", "man7"], highlight: true },
      { tiles: ["pin5", "pin5"] }
    ],
    winningTile: "man8"
  },
  平和: {
    blocks: [
      { label: "順子", tiles: ["man2", "man3", "man4"], highlight: true },
      { label: "順子", tiles: ["pin3", "pin4", "pin5"], highlight: true },
      { label: "順子", tiles: ["sou4", "sou5", "sou6"], highlight: true },
      { label: "両面待ち", tiles: ["man6", "man7"], highlight: true },
      { tiles: ["pin2", "pin2"] }
    ],
    winningTile: "man8"
  },
  七対子: {
    blocks: [
      { label: "対子", tiles: ["man2", "man2"], highlight: true },
      { label: "対子", tiles: ["man5", "man5"], highlight: true },
      { label: "対子", tiles: ["pin3", "pin3"], highlight: true },
      { label: "対子", tiles: ["pin6", "pin6"], highlight: true },
      { label: "対子", tiles: ["sou4", "sou4"], highlight: true },
      { label: "対子", tiles: ["ji1", "ji1"], highlight: true },
      { label: "7組目", tiles: ["ji7"], highlight: true }
    ],
    winningTile: "ji7"
  },
  一盃口: {
    blocks: [
      { label: "同じ順子", tiles: ["man2", "man3", "man4"], highlight: true },
      { label: "同じ順子", tiles: ["man2", "man3", "man4"], highlight: true },
      { tiles: ["pin5", "pin6", "pin7"] },
      { tiles: ["sou6", "sou7"] },
      { tiles: ["pin5", "pin5"] }
    ],
    winningTile: "sou8"
  },
  混一色: {
    blocks: [
      { label: "萬子", tiles: ["man2", "man3", "man4"], highlight: true },
      { label: "萬子", tiles: ["man6", "man7", "man8"], highlight: true },
      { label: "字牌", tiles: ["ji1", "ji1", "ji1"], highlight: true },
      { label: "字牌", tiles: ["ji7", "ji7"], highlight: true },
      { label: "萬子", tiles: ["man5", "man5"], highlight: true }
    ],
    winningTile: "ji7"
  },
  清一色: {
    blocks: [
      { label: "萬子だけ", tiles: ["man1", "man2", "man3"], highlight: true },
      { label: "萬子だけ", tiles: ["man2", "man3", "man4"], highlight: true },
      { label: "萬子だけ", tiles: ["man5", "man6", "man7"], highlight: true },
      { label: "萬子だけ", tiles: ["man7", "man8"], highlight: true },
      { label: "萬子だけ", tiles: ["man9", "man9"], highlight: true }
    ],
    winningTile: "man6"
  },
  対々和: {
    blocks: [
      { label: "刻子", tiles: ["man2", "man2", "man2"], highlight: true },
      { label: "刻子", tiles: ["pin5", "pin5", "pin5"], highlight: true },
      { label: "刻子", tiles: ["sou7", "sou7", "sou7"], highlight: true },
      { label: "刻子", tiles: ["ji7", "ji7"], highlight: true },
      { tiles: ["man5", "man5"] }
    ],
    winningTile: "ji7"
  },
  三色同順: {
    blocks: [
      { label: "萬子345", tiles: ["man3", "man4", "man5"], highlight: true },
      { label: "筒子345", tiles: ["pin3", "pin4", "pin5"], highlight: true },
      { label: "索子345", tiles: ["sou3", "sou4", "sou5"], highlight: true },
      { tiles: ["ji7", "ji7"] },
      { tiles: ["man5", "man5"] }
    ],
    winningTile: "ji7"
  },
  一発: {
    blocks: [
      { tiles: ["man2", "man3", "man4"] },
      { tiles: ["pin3", "pin4", "pin5"] },
      { tiles: ["sou6", "sou7", "sou8"] },
      { label: "リーチ後すぐ", tiles: ["man6", "man7"], highlight: true },
      { tiles: ["pin5", "pin5"] }
    ],
    winningTile: "man8"
  },
  ダブルリーチ: {
    blocks: [
      { tiles: ["man2", "man3", "man4"] },
      { tiles: ["pin3", "pin4", "pin5"] },
      { tiles: ["sou6", "sou7", "sou8"] },
      { label: "最初から待ち", tiles: ["man6", "man7"], highlight: true },
      { tiles: ["pin5", "pin5"] }
    ],
    winningTile: "man8"
  },
  海底撈月: {
    blocks: [
      { tiles: ["man2", "man3", "man4"] },
      { tiles: ["pin3", "pin4", "pin5"] },
      { tiles: ["sou6", "sou7", "sou8"] },
      { label: "最後のツモ", tiles: ["man6", "man7"], highlight: true },
      { tiles: ["pin5", "pin5"] }
    ],
    winningTile: "man8"
  },
  河底撈魚: {
    blocks: [
      { tiles: ["man2", "man3", "man4"] },
      { tiles: ["pin3", "pin4", "pin5"] },
      { tiles: ["sou6", "sou7", "sou8"] },
      { label: "最後の捨て牌", tiles: ["man6", "man7"], highlight: true },
      { tiles: ["pin5", "pin5"] }
    ],
    winningTile: "man8"
  },
  嶺上開花: {
    blocks: [
      { label: "中のカン", tiles: ["ji7", "ji7", "ji7", "ji7"], highlight: true, meld: "kan" },
      { tiles: ["man2", "man3", "man4"] },
      { tiles: ["pin3", "pin4", "pin5"] },
      { tiles: ["sou6", "sou7"] },
      { tiles: ["man5", "man5"] }
    ],
    winningTile: "sou8",
    condition: "中のカン後、嶺上牌の八索でツモ（実牌15枚）"
  },
  槍槓: {
    blocks: [
      { label: "五萬待ち", tiles: ["man4", "man6"], highlight: true },
      { tiles: ["man2", "man3", "man4"] },
      { tiles: ["pin3", "pin4", "pin5"] },
      { tiles: ["sou6", "sou7", "sou8"] },
      { tiles: ["ji7", "ji7"] }
    ],
    winningTile: "man5",
    condition: "他家の五萬の加槓をロン。自分は五萬を持っていない例"
  },
  一気通貫: {
    blocks: [
      { label: "123", tiles: ["man1", "man2", "man3"], highlight: true },
      { label: "456", tiles: ["man4", "man5", "man6"], highlight: true },
      { label: "789", tiles: ["man7", "man8", "man9"], highlight: true },
      { tiles: ["ji7", "ji7"] },
      { tiles: ["pin5", "pin5"] }
    ],
    winningTile: "ji7"
  },
  混全帯么九: {
    blocks: [
      { label: "端牌", tiles: ["man1", "man2", "man3"], highlight: true },
      { label: "端牌", tiles: ["pin7", "pin8", "pin9"], highlight: true },
      { label: "字牌", tiles: ["ji7", "ji7", "ji7"], highlight: true },
      { label: "端牌", tiles: ["sou7", "sou8", "sou9"], highlight: true },
      { label: "端牌", tiles: ["man9"], highlight: true }
    ],
    winningTile: "man9"
  },
  純全帯么九: {
    blocks: [
      { label: "端牌", tiles: ["man1", "man2", "man3"], highlight: true },
      { label: "端牌", tiles: ["pin7", "pin8", "pin9"], highlight: true },
      { label: "端牌", tiles: ["sou1", "sou2", "sou3"], highlight: true },
      { label: "端牌", tiles: ["man7", "man8", "man9"], highlight: true },
      { label: "端牌", tiles: ["sou9"], highlight: true }
    ],
    winningTile: "sou9"
  },
  二盃口: {
    blocks: [
      { label: "同じ順子", tiles: ["man2", "man3", "man4"], highlight: true },
      { label: "同じ順子", tiles: ["man2", "man3", "man4"], highlight: true },
      { label: "同じ順子", tiles: ["pin5", "pin6", "pin7"], highlight: true },
      { label: "同じ順子", tiles: ["pin5", "pin6"], highlight: true },
      { tiles: ["sou5", "sou5"] }
    ],
    winningTile: "pin7"
  },
  三暗刻: {
    blocks: [
      { label: "暗刻", tiles: ["man2", "man2", "man2"], highlight: true },
      { label: "暗刻", tiles: ["pin5", "pin5", "pin5"], highlight: true },
      { label: "暗刻", tiles: ["sou7", "sou7", "sou7"], highlight: true },
      { tiles: ["man3", "man4"] },
      { tiles: ["pin9", "pin9"] }
    ],
    winningTile: "man5"
  },
  三色同刻: {
    blocks: [
      { label: "萬子5", tiles: ["man5", "man5", "man5"], highlight: true },
      { label: "筒子5", tiles: ["pin5", "pin5", "pin5"], highlight: true },
      { label: "索子5", tiles: ["sou5", "sou5", "sou5"], highlight: true },
      { tiles: ["man2", "man3", "man4"] },
      { tiles: ["ji7"] }
    ],
    winningTile: "ji7"
  },
  三槓子: {
    blocks: [
      { label: "カン", tiles: ["man2", "man2", "man2", "man2"], highlight: true, meld: "kan" },
      { label: "カン", tiles: ["pin5", "pin5", "pin5", "pin5"], highlight: true, meld: "kan" },
      { label: "カン", tiles: ["sou7", "sou7", "sou7", "sou7"], highlight: true, meld: "kan" },
      { tiles: ["man3", "man4", "man5"] },
      { tiles: ["ji7"] }
    ],
    winningTile: "ji7",
    condition: "カン3組・順子1組・雀頭で完成（実牌17枚）"
  },
  小三元: {
    blocks: [
      { label: "白", tiles: ["ji6", "ji6", "ji6"], highlight: true },
      { label: "發", tiles: ["ji5", "ji5", "ji5"], highlight: true },
      { label: "中の対子", tiles: ["ji7", "ji7"], highlight: true },
      { tiles: ["man2", "man3", "man4"] },
      { tiles: ["pin6", "pin7"] }
    ],
    winningTile: "pin8",
    condition: "白・發が刻子、中が雀頭。八筒でアガリ"
  },
  混老頭: {
    blocks: [
      { label: "1・9・字牌", tiles: ["man1", "man1", "man1"], highlight: true },
      { label: "1・9・字牌", tiles: ["pin9", "pin9", "pin9"], highlight: true },
      { label: "1・9・字牌", tiles: ["ji1", "ji1", "ji1"], highlight: true },
      { label: "1・9・字牌", tiles: ["ji7", "ji7"], highlight: true },
      { label: "1・9・字牌", tiles: ["sou9", "sou9"], highlight: true }
    ],
    winningTile: "sou9"
  },
  国士無双: {
    blocks: [
      { label: "13種", tiles: ["man1", "man9", "pin1", "pin9", "sou1", "sou9"], highlight: true },
      { label: "13種", tiles: ["ji1", "ji2", "ji3", "ji4", "ji6", "ji5", "ji7"], highlight: true }
    ],
    winningTile: "ji7"
  },
  四暗刻: {
    blocks: [
      { label: "暗刻", tiles: ["man2", "man2", "man2"], highlight: true },
      { label: "暗刻", tiles: ["pin5", "pin5", "pin5"], highlight: true },
      { label: "暗刻", tiles: ["sou7", "sou7", "sou7"], highlight: true },
      { label: "暗刻", tiles: ["ji7", "ji7", "ji7"], highlight: true },
      { tiles: ["man5"] }
    ],
    winningTile: "man5"
  },
  大三元: {
    blocks: [
      { label: "白", tiles: ["ji6", "ji6", "ji6"], highlight: true },
      { label: "發", tiles: ["ji5", "ji5", "ji5"], highlight: true },
      { label: "中", tiles: ["ji7", "ji7"], highlight: true },
      { tiles: ["man2", "man3", "man4"] },
      { tiles: ["pin5", "pin5"] }
    ],
    winningTile: "ji7"
  },
  小四喜: {
    blocks: [
      { label: "東", tiles: ["ji1", "ji1", "ji1"], highlight: true },
      { label: "南", tiles: ["ji2", "ji2", "ji2"], highlight: true },
      { label: "西", tiles: ["ji3", "ji3", "ji3"], highlight: true },
      { label: "北の対子", tiles: ["ji4", "ji4"], highlight: true },
      { tiles: ["man5", "man6"] }
    ],
    winningTile: "man7",
    condition: "東・南・西が刻子、北が雀頭。七萬でアガリ"
  },
  大四喜: {
    blocks: [
      { label: "東", tiles: ["ji1", "ji1", "ji1"], highlight: true },
      { label: "南", tiles: ["ji2", "ji2", "ji2"], highlight: true },
      { label: "西", tiles: ["ji3", "ji3", "ji3"], highlight: true },
      { label: "北", tiles: ["ji4", "ji4"], highlight: true },
      { tiles: ["man5", "man5"] }
    ],
    winningTile: "ji4"
  },
  字一色: {
    blocks: [
      { label: "字牌だけ", tiles: ["ji1", "ji1", "ji1"], highlight: true },
      { label: "字牌だけ", tiles: ["ji2", "ji2", "ji2"], highlight: true },
      { label: "字牌だけ", tiles: ["ji6", "ji6", "ji6"], highlight: true },
      { label: "字牌だけ", tiles: ["ji7", "ji7"], highlight: true },
      { label: "字牌だけ", tiles: ["ji5", "ji5"], highlight: true }
    ],
    winningTile: "ji7"
  },
  緑一色: {
    blocks: [
      { label: "緑の牌", tiles: ["sou2", "sou2", "sou2"], highlight: true },
      { label: "緑の牌", tiles: ["sou3", "sou3", "sou3"], highlight: true },
      { label: "緑の牌", tiles: ["sou4", "sou4", "sou4"], highlight: true },
      { label: "緑の牌", tiles: ["sou6", "sou6", "sou6"], highlight: true },
      { label: "緑の牌", tiles: ["ji5"], highlight: true }
    ],
    winningTile: "ji5"
  },
  清老頭: {
    blocks: [
      { label: "1・9だけ", tiles: ["man1", "man1", "man1"], highlight: true },
      { label: "1・9だけ", tiles: ["pin9", "pin9", "pin9"], highlight: true },
      { label: "1・9だけ", tiles: ["sou1", "sou1", "sou1"], highlight: true },
      { label: "1・9だけ", tiles: ["man9", "man9"], highlight: true },
      { label: "1・9だけ", tiles: ["sou9", "sou9"], highlight: true }
    ],
    winningTile: "man9"
  },
  四槓子: {
    blocks: [
      { label: "カン", tiles: ["man2", "man2", "man2", "man2"], highlight: true, meld: "kan" },
      { label: "カン", tiles: ["pin5", "pin5", "pin5", "pin5"], highlight: true, meld: "kan" },
      { label: "カン", tiles: ["sou7", "sou7", "sou7", "sou7"], highlight: true, meld: "kan" },
      { label: "カン", tiles: ["ji7", "ji7", "ji7", "ji7"], highlight: true, meld: "kan" },
      { tiles: ["man5"] }
    ],
    winningTile: "man5",
    condition: "カン4組と雀頭で完成（実牌18枚）"
  },
  九蓮宝燈: {
    blocks: [
      { label: "111", tiles: ["man1", "man1", "man1"], highlight: true },
      { label: "234", tiles: ["man2", "man3", "man4"], highlight: true },
      { label: "567", tiles: ["man5", "man6", "man7"], highlight: true },
      { label: "8999", tiles: ["man8", "man9", "man9", "man9"], highlight: true }
    ],
    winningTile: "man5"
  },
  天和: {
    blocks: [
      { label: "配牌で完成", tiles: ["man2", "man3", "man4"], highlight: true },
      { label: "配牌で完成", tiles: ["pin3", "pin4", "pin5"], highlight: true },
      { label: "配牌で完成", tiles: ["sou6", "sou7", "sou8"], highlight: true },
      { label: "配牌で完成", tiles: ["ji7", "ji7", "ji7"], highlight: true },
      { label: "配牌で完成", tiles: ["man5"], highlight: true }
    ],
    winningTile: "man5",
    condition: "各局の親の最初の14枚で完成。チー・ポン・カンなし"
  },
  地和: {
    blocks: [
      { label: "最初のツモ", tiles: ["man2", "man3", "man4"], highlight: true },
      { label: "最初のツモ", tiles: ["pin3", "pin4", "pin5"], highlight: true },
      { label: "最初のツモ", tiles: ["sou6", "sou7", "sou8"], highlight: true },
      { label: "最初のツモ", tiles: ["ji7", "ji7", "ji7"], highlight: true },
      { label: "最初のツモ", tiles: ["man5"], highlight: true }
    ],
    winningTile: "man5",
    condition: "子の第1ツモで完成。それまでにチー・ポン・カンなし"
  }
};

import type { Metadata } from "next";
import Link from "next/link";
import { InternalLinkCard, PageHero, SectionTitle } from "../../components/SiteSections";
import { yakuArticles } from "../yakuArticleData";

export const metadata: Metadata = {
  title: "麻雀 役一覧 | 初心者向けに牌図つきで解説",
  description: "麻雀の標準的な役を、リーチ、タンヤオ、役牌、平和、七対子、混一色、清一色、役満まで牌図つきで解説します。"
};

type YakuItem = {
  name: string;
  kana: string;
  han: string;
  closedOnly?: boolean;
  openNote: string;
  beginnerPriority: "まず覚える" | "次に覚える" | "慣れたら";
  summary: string;
  tiles: string[];
  tileLabel: string;
  point: string;
  caution: string;
  href?: string;
};

type YakuTileBlock = {
  label?: string;
  tiles: string[];
  highlight?: boolean;
};

type YakuTileExample = {
  blocks: YakuTileBlock[];
  winningTile: string;
};

const firstYaku: YakuItem[] = [
  {
    name: "リーチ",
    kana: "立直",
    han: "1翻",
    closedOnly: true,
    openNote: "鳴いたら不可",
    beginnerPriority: "まず覚える",
    summary: "鳴いていない状態でテンパイしたときに宣言できる役です。初心者が一番使いやすい役のひとつです。",
    tiles: ["man6", "man7", "man8", "pin5"],
    tileLabel: "あと1枚でアガれる形",
    point: "あと1枚でアガれる形になったら、リーチを宣言できます。",
    caution: "ポン・チー・カンで鳴いているとリーチできません。",
    href: "/learn/reach-tanyao-yakuhai"
  },
  {
    name: "タンヤオ",
    kana: "断么九",
    han: "1翻",
    openNote: "鳴いても可",
    beginnerPriority: "まず覚える",
    summary: "2から8の数牌だけで作る役です。1・9・字牌を使わないので、見た目で判断しやすい役です。",
    tiles: ["man2", "man3", "man4", "pin3", "pin4", "pin5", "sou6", "sou7", "sou8"],
    tileLabel: "2〜8だけで作る",
    point: "手牌に1・9・字牌が入っていないかを見ます。",
    caution: "ルールによっては鳴きタンを採用しない場合があります。最初に確認しましょう。",
    href: "/learn/reach-tanyao-yakuhai"
  },
  {
    name: "役牌",
    kana: "やくはい",
    han: "1翻",
    openNote: "鳴いても可",
    beginnerPriority: "まず覚える",
    summary: "白・發・中、または場風・自風を3枚そろえる役です。鳴いても役が残るので初心者向きです。",
    tiles: ["ji6", "ji6", "ji6", "ji5", "ji5", "ji5", "ji7", "ji7", "ji7"],
    tileLabel: "白・發・中を3枚",
    point: "同じ役牌が3枚あるかを見ます。この例では中が3枚あります。",
    caution: "東南西北は、場風か自風でないと役牌にならないことがあります。",
    href: "/learn/reach-tanyao-yakuhai"
  },
  {
    name: "ツモ",
    kana: "門前清自摸和",
    han: "1翻",
    closedOnly: true,
    openNote: "鳴いたら不可",
    beginnerPriority: "まず覚える",
    summary: "鳴いていない状態で、自分で引いた牌でアガる役です。リーチと一緒に出ることも多いです。",
    tiles: ["man5", "man5", "pin5"],
    tileLabel: "最後の1枚を自分で引く",
    point: "最後の牌を自分で引いてアガるとツモです。",
    caution: "鳴いている場合は、門前ツモの役はつきません。",
    href: "/learn/tsumo-and-ron"
  }
];

const nextYaku: YakuItem[] = [
  {
    name: "平和",
    kana: "ピンフ",
    han: "1翻",
    closedOnly: true,
    openNote: "鳴いたら不可",
    beginnerPriority: "次に覚える",
    summary: "すべて順子で、雀頭が役牌ではなく、待ちが両面のときにつく役です。条件は少し細かいですが頻出です。",
    tiles: ["man2", "man3", "man4", "pin3", "pin4", "pin5", "sou4", "sou5", "sou6", "pin2", "pin2"],
    tileLabel: "順子中心のきれいな形",
    point: "刻子がなく、順子4つと雀頭でできているかを見ます。",
    caution: "雀頭が役牌だったり、カンチャン待ち・ペンチャン待ちだと平和になりません。",
    href: "/tools/score-table"
  },
  {
    name: "七対子",
    kana: "チートイツ",
    han: "2翻",
    closedOnly: true,
    openNote: "鳴いたら不可",
    beginnerPriority: "次に覚える",
    summary: "同じ牌2枚のペアを7組作る特殊な役です。4面子1雀頭ではない例外形として覚えます。",
    tiles: ["man2", "man2", "man5", "man5", "pin3", "pin3", "sou4", "sou4", "ji1", "ji1"],
    tileLabel: "ペアを7組集める",
    point: "ペアが7組あるかを見ます。面子に分けなくてよい役です。",
    caution: "同じ牌4枚を2組分のペアとして数える扱いは通常しません。",
    href: "/tools/score-table"
  },
  {
    name: "一盃口",
    kana: "イーペーコー",
    han: "1翻",
    closedOnly: true,
    openNote: "鳴いたら不可",
    beginnerPriority: "次に覚える",
    summary: "同じ種類・同じ数字並びの順子を2組作る役です。リーチや平和と一緒に出ることがあります。",
    tiles: ["man2", "man3", "man4", "man2", "man3", "man4"],
    tileLabel: "同じ順子が2組",
    point: "同じ順子が2組あるかを見ます。この例では二三四萬が2組あります。",
    caution: "鳴くと一盃口は役として数えません。"
  },
  {
    name: "混一色",
    kana: "ホンイツ",
    han: "3翻 / 鳴き2翻",
    openNote: "鳴くと1翻下がる",
    beginnerPriority: "慣れたら",
    summary: "1種類の数牌と字牌だけで作る役です。見た目が分かりやすく、役牌と一緒になることも多いです。",
    tiles: ["man2", "man3", "man4", "man6", "man7", "man8", "ji1", "ji1", "ji1", "ji7", "ji7", "ji7"],
    tileLabel: "1種類の数牌と字牌",
    point: "萬子だけ、筒子だけ、索子だけのどれか1種類と字牌だけになっているかを見ます。",
    caution: "別の種類の数牌が混ざると混一色ではありません。"
  }
];

const laterYaku: YakuItem[] = [
  {
    name: "清一色",
    kana: "チンイツ",
    han: "6翻 / 鳴き5翻",
    openNote: "鳴くと1翻下がる",
    beginnerPriority: "慣れたら",
    summary: "1種類の数牌だけで作る高い役です。待ちが複雑になりやすいので、慣れてからで大丈夫です。",
    tiles: ["man1", "man2", "man3", "man4", "man5", "man6", "man7", "man8", "man9"],
    tileLabel: "1種類の数牌だけ",
    point: "萬子・筒子・索子のどれか1種類だけで手ができているかを見ます。",
    caution: "字牌が入ると清一色ではなく、混一色になります。"
  },
  {
    name: "対々和",
    kana: "トイトイ",
    han: "2翻",
    openNote: "鳴いても可",
    beginnerPriority: "慣れたら",
    summary: "刻子を4つ作る役です。ポンを使って進めやすい一方、待ちが単騎になりやすいです。",
    tiles: ["man2", "man2", "man2", "pin5", "pin5", "pin5", "sou7", "sou7", "sou7", "ji7", "ji7", "ji7"],
    tileLabel: "刻子を4つ",
    point: "順子がなく、同じ牌3枚の刻子が4つあるかを見ます。",
    caution: "ポンしすぎると守りにくくなるので、初心者は役牌とセットで考えると分かりやすいです。"
  },
  {
    name: "三色同順",
    kana: "サンショク",
    han: "2翻 / 鳴き1翻",
    openNote: "鳴くと1翻下がる",
    beginnerPriority: "慣れたら",
    summary: "萬子・筒子・索子で同じ数字並びの順子を作る役です。見つけられると手作りが楽しくなります。",
    tiles: ["man2", "man3", "man4", "pin2", "pin3", "pin4", "sou2", "sou3", "sou4"],
    tileLabel: "同じ数字並びを3種類",
    point: "同じ数字の順子が3種類そろっているかを見ます。この例では二三四が3種類あります。",
    caution: "数字が1つでもずれると三色同順にはなりません。"
  }
];

const situationalYaku: YakuItem[] = [
  {
    name: "一発",
    kana: "イッパツ",
    han: "1翻",
    closedOnly: true,
    openNote: "鳴いたら不可",
    beginnerPriority: "慣れたら",
    summary: "リーチ後、誰も鳴かないまま自分の次のツモまでにアガるとつく役です。リーチのおまけとして覚えます。",
    tiles: ["man6", "man7", "man8", "pin5"],
    tileLabel: "リーチ直後のアガリ",
    point: "リーチしてから1巡以内にアガったかを見ます。",
    caution: "途中でポン・チー・カンが入ると一発は消えます。"
  },
  {
    name: "ダブルリーチ",
    kana: "ダブルリーチ",
    han: "2翻",
    closedOnly: true,
    openNote: "鳴いたら不可",
    beginnerPriority: "慣れたら",
    summary: "配牌直後の最初の番で、すでにテンパイしていてリーチする役です。かなり珍しい役です。",
    tiles: ["man6", "man7", "man8", "pin5"],
    tileLabel: "最初の番でテンパイ",
    point: "自分の最初の捨て牌でリーチできる状態かを見ます。",
    caution: "自分の番までに誰かが鳴くと、ダブルリーチにならない扱いが一般的です。"
  },
  {
    name: "海底撈月",
    kana: "ハイテイ",
    han: "1翻",
    openNote: "鳴いても可",
    beginnerPriority: "慣れたら",
    summary: "その局の最後のツモ牌でアガる役です。形ではなく、アガったタイミングで決まります。",
    tiles: ["man5", "man5", "pin5"],
    tileLabel: "最後のツモでアガリ",
    point: "山の最後のツモ牌でツモアガリしたかを見ます。",
    caution: "最後の捨て牌でロンした場合は、海底ではなく河底です。"
  },
  {
    name: "河底撈魚",
    kana: "ホウテイ",
    han: "1翻",
    openNote: "鳴いても可",
    beginnerPriority: "慣れたら",
    summary: "その局の最後の捨て牌でロンする役です。終盤だけに出るタイミング役です。",
    tiles: ["man5", "pin5"],
    tileLabel: "最後の捨て牌でロン",
    point: "最後に捨てられた牌でロンしたかを見ます。",
    caution: "最後のツモで自分がアガった場合は、河底ではなく海底です。"
  },
  {
    name: "嶺上開花",
    kana: "リンシャンカイホウ",
    han: "1翻",
    openNote: "鳴いても可",
    beginnerPriority: "慣れたら",
    summary: "カンをしたあとに引く嶺上牌でツモアガリする役です。カンが絡むため最初は後回しで大丈夫です。",
    tiles: ["ji7", "ji7", "ji7", "ji7", "man5"],
    tileLabel: "カン後のツモ",
    point: "カンのあとに引いた牌でアガったかを見ます。",
    caution: "カンは場況を大きく変えるので、初心者は無理に狙わなくて大丈夫です。"
  },
  {
    name: "槍槓",
    kana: "チャンカン",
    han: "1翻",
    openNote: "鳴いても可",
    beginnerPriority: "慣れたら",
    summary: "相手が加槓しようとした牌でロンする役です。かなり珍しいタイミング役です。",
    tiles: ["man5", "man5", "man5", "man5"],
    tileLabel: "加槓牌をロン",
    point: "相手がポンからカンにしようとした牌が、自分のアガリ牌かを見ます。",
    caution: "暗槓には基本的に槍槓できません。例外は国士無双などルール確認が必要です。"
  }
];

const openAndShapeYaku: YakuItem[] = [
  {
    name: "一気通貫",
    kana: "イッツー",
    han: "2翻 / 鳴き1翻",
    openNote: "鳴くと1翻下がる",
    beginnerPriority: "慣れたら",
    summary: "同じ種類で123・456・789の順子をそろえる役です。一色に寄った手で見つけやすい役です。",
    tiles: ["man1", "man2", "man3", "man4", "man5", "man6", "man7", "man8", "man9"],
    tileLabel: "同じ種類で1〜9",
    point: "同じ種類で123、456、789がそろっているかを見ます。",
    caution: "違う種類が混ざると一気通貫ではありません。鳴くと1翻に下がります。"
  },
  {
    name: "混全帯么九",
    kana: "チャンタ",
    han: "2翻 / 鳴き1翻",
    openNote: "鳴くと1翻下がる",
    beginnerPriority: "慣れたら",
    summary: "すべての面子と雀頭に、1・9・字牌が関わる役です。端の牌が多い手で意識します。",
    tiles: ["man1", "man2", "man3", "pin7", "pin8", "pin9", "ji7", "ji7", "ji7", "man1", "man1"],
    tileLabel: "全部に1・9・字牌が関わる",
    point: "各面子と雀頭に、1・9・字牌が入っているかを見ます。",
    caution: "1・9・字牌がない面子が1つでもあるとチャンタではありません。"
  },
  {
    name: "純全帯么九",
    kana: "ジュンチャン",
    han: "3翻 / 鳴き2翻",
    openNote: "鳴くと1翻下がる",
    beginnerPriority: "慣れたら",
    summary: "すべての面子と雀頭に1・9が関わり、字牌を使わない役です。チャンタより条件が厳しい役です。",
    tiles: ["man1", "man2", "man3", "pin7", "pin8", "pin9", "sou1", "sou2", "sou3", "man9", "man9"],
    tileLabel: "字牌なしの端牌手",
    point: "すべての組に1・9が入り、字牌がないかを見ます。",
    caution: "字牌が入ると純チャンではなくチャンタ側になります。"
  },
  {
    name: "二盃口",
    kana: "リャンペーコー",
    han: "3翻",
    closedOnly: true,
    openNote: "鳴いたら不可",
    beginnerPriority: "慣れたら",
    summary: "一盃口が2組ある役です。七対子のようにも見えますが、順子2組×2として見る役です。",
    tiles: ["man2", "man3", "man4", "man2", "man3", "man4", "pin5", "pin6", "pin7", "pin5", "pin6", "pin7"],
    tileLabel: "同じ順子2組が2セット",
    point: "同じ順子2組が、別々に2セットあるかを見ます。",
    caution: "鳴くと二盃口は成立しません。七対子とは同時に数えません。"
  },
  {
    name: "三暗刻",
    kana: "サンアンコウ",
    han: "2翻",
    openNote: "鳴いても可",
    beginnerPriority: "慣れたら",
    summary: "暗刻を3つ作る役です。ポンした刻子は暗刻に数えないので、見た目より条件確認が必要です。",
    tiles: ["man2", "man2", "man2", "pin5", "pin5", "pin5", "sou7", "sou7", "sou7"],
    tileLabel: "暗刻が3つ",
    point: "自分でそろえた同じ牌3枚の組が3つあるかを見ます。",
    caution: "ポンで作った刻子は暗刻ではありません。ロンで完成した刻子も扱いに注意します。"
  },
  {
    name: "三色同刻",
    kana: "サンショクドウコウ",
    han: "2翻",
    openNote: "鳴いても可",
    beginnerPriority: "慣れたら",
    summary: "萬子・筒子・索子で同じ数字の刻子を作る役です。かなり珍しい役です。",
    tiles: ["man5", "man5", "man5", "pin5", "pin5", "pin5", "sou5", "sou5", "sou5"],
    tileLabel: "同じ数字の刻子を3種類",
    point: "同じ数字の刻子が萬子・筒子・索子でそろっているかを見ます。",
    caution: "順子で同じ数字並びを作る三色同順とは別の役です。"
  },
  {
    name: "三槓子",
    kana: "サンカンツ",
    han: "2翻",
    openNote: "鳴いても可",
    beginnerPriority: "慣れたら",
    summary: "カンを3つ作る役です。かなり珍しく、カンで場が荒れやすいので初心者は無理に狙いません。",
    tiles: ["man2", "man2", "man2", "man2", "pin5", "pin5", "pin5", "pin5", "sou7", "sou7", "sou7", "sou7"],
    tileLabel: "槓子が3つ",
    point: "同じ牌4枚のカンが3組あるかを見ます。",
    caution: "カンはドラが増えるので、相手の手も高くなる可能性があります。"
  },
  {
    name: "小三元",
    kana: "ショウサンゲン",
    han: "2翻",
    openNote: "鳴いても可",
    beginnerPriority: "慣れたら",
    summary: "白・發・中のうち2種類を刻子、残り1種類を雀頭にする役です。役牌も一緒につきやすい形です。",
    tiles: ["ji6", "ji6", "ji6", "ji5", "ji5", "ji5", "ji7", "ji7"],
    tileLabel: "三元牌2刻子＋1雀頭",
    point: "白・發・中のうち、2つが3枚組、1つが2枚組かを見ます。",
    caution: "三元牌3種類すべてが刻子になると、大三元という役満です。"
  },
  {
    name: "混老頭",
    kana: "ホンロウトウ",
    han: "2翻",
    openNote: "鳴いても可",
    beginnerPriority: "慣れたら",
    summary: "1・9・字牌だけで作る役です。七対子または対々和と一緒になる形が多いです。",
    tiles: ["man1", "man1", "man1", "pin9", "pin9", "pin9", "ji1", "ji1", "ji1", "ji7", "ji7"],
    tileLabel: "1・9・字牌だけ",
    point: "手牌が1・9・字牌だけでできているかを見ます。",
    caution: "2〜8の数牌が1枚でも入ると混老頭ではありません。"
  }
];

const yakumanYaku: YakuItem[] = [
  {
    name: "国士無双",
    kana: "コクシムソウ",
    han: "役満",
    closedOnly: true,
    openNote: "鳴いたら不可",
    beginnerPriority: "慣れたら",
    summary: "1・9・字牌13種類をすべて集め、そのうち1種類を対子にする特殊な役満です。",
    tiles: ["man1", "man9", "pin1", "pin9", "sou1", "sou9", "ji1", "ji2", "ji3", "ji4", "ji6", "ji5", "ji7"],
    tileLabel: "端牌と字牌13種類",
    point: "1・9・字牌が全種類そろっているかを見ます。",
    caution: "通常の4面子1雀頭とは違う特殊形です。鳴くことはできません。"
  },
  {
    name: "四暗刻",
    kana: "スーアンコウ",
    han: "役満",
    closedOnly: true,
    openNote: "鳴いたら不可",
    beginnerPriority: "慣れたら",
    summary: "暗刻を4つ作る役満です。ポンを使わず、自力で刻子をそろえる必要があります。",
    tiles: ["man2", "man2", "man2", "pin5", "pin5", "pin5", "sou7", "sou7", "sou7", "ji7", "ji7", "ji7"],
    tileLabel: "暗刻が4つ",
    point: "ポンしていない刻子が4つあるかを見ます。",
    caution: "ロンで4つ目の刻子を完成させる形は、単騎待ち以外だと四暗刻にならない点に注意します。"
  },
  {
    name: "大三元",
    kana: "ダイサンゲン",
    han: "役満",
    openNote: "鳴いても可",
    beginnerPriority: "慣れたら",
    summary: "白・發・中をすべて刻子にする役満です。鳴いても成立するため、相手にも警戒されやすい役です。",
    tiles: ["ji6", "ji6", "ji6", "ji5", "ji5", "ji5", "ji7", "ji7", "ji7"],
    tileLabel: "白・發・中を全部3枚",
    point: "三元牌3種類がすべて刻子になっているかを見ます。",
    caution: "三元牌を2種類鳴いた時点で、相手にかなり警戒されます。"
  },
  {
    name: "小四喜",
    kana: "ショウスーシー",
    han: "役満",
    openNote: "鳴いても可",
    beginnerPriority: "慣れたら",
    summary: "東南西北のうち3種類を刻子、残り1種類を雀頭にする役満です。",
    tiles: ["ji1", "ji1", "ji1", "ji2", "ji2", "ji2", "ji3", "ji3", "ji3", "ji4", "ji4"],
    tileLabel: "風牌3刻子＋1雀頭",
    point: "風牌4種類のうち、3つが3枚組、1つが2枚組かを見ます。",
    caution: "風牌4種類すべてが刻子になると大四喜です。"
  },
  {
    name: "大四喜",
    kana: "ダイスーシー",
    han: "役満",
    openNote: "鳴いても可",
    beginnerPriority: "慣れたら",
    summary: "東南西北をすべて刻子にする役満です。ルールによってはダブル役満扱いもあります。",
    tiles: ["ji1", "ji1", "ji1", "ji2", "ji2", "ji2", "ji3", "ji3", "ji3", "ji4", "ji4", "ji4"],
    tileLabel: "風牌4種類を全部3枚",
    point: "東南西北がすべて刻子になっているかを見ます。",
    caution: "ダブル役満にするかはルール差があるので確認します。"
  },
  {
    name: "字一色",
    kana: "ツーイーソー",
    han: "役満",
    openNote: "鳴いても可",
    beginnerPriority: "慣れたら",
    summary: "字牌だけで作る役満です。風牌と三元牌だけで手を完成させます。",
    tiles: ["ji1", "ji1", "ji1", "ji2", "ji2", "ji2", "ji6", "ji6", "ji6", "ji7", "ji7"],
    tileLabel: "字牌だけ",
    point: "数牌が1枚もなく、字牌だけでできているかを見ます。",
    caution: "1・9の数牌が入ると字一色ではありません。"
  },
  {
    name: "緑一色",
    kana: "リューイーソー",
    han: "役満",
    openNote: "鳴いても可",
    beginnerPriority: "慣れたら",
    summary: "緑色の牌だけで作る役満です。使える牌が限られるため、かなり珍しい役です。",
    tiles: ["sou2", "sou3", "sou4", "sou6", "sou8", "ji5", "ji5", "ji5"],
    tileLabel: "緑の牌だけ",
    point: "二索・三索・四索・六索・八索・發だけでできているかを見ます。",
    caution: "一索・五索・七索・九索は緑一色に使えません。"
  },
  {
    name: "清老頭",
    kana: "チンロウトウ",
    han: "役満",
    openNote: "鳴いても可",
    beginnerPriority: "慣れたら",
    summary: "1と9の数牌だけで作る役満です。字牌を使う混老頭よりさらに条件が厳しい役です。",
    tiles: ["man1", "man1", "man1", "pin9", "pin9", "pin9", "sou1", "sou1", "sou1", "man9", "man9"],
    tileLabel: "1・9の数牌だけ",
    point: "1と9の数牌だけでできているかを見ます。",
    caution: "字牌が入ると清老頭ではありません。"
  },
  {
    name: "四槓子",
    kana: "スーカンツ",
    han: "役満",
    openNote: "鳴いても可",
    beginnerPriority: "慣れたら",
    summary: "カンを4つ作る役満です。非常に珍しく、実戦で見る機会はかなり少ない役です。",
    tiles: ["man2", "man2", "man2", "man2", "pin5", "pin5", "pin5", "pin5", "sou7", "sou7", "sou7", "sou7"],
    tileLabel: "槓子が4つ",
    point: "4つのカンを作っているかを見ます。",
    caution: "四槓流れの扱いなど、卓のルール確認が必要です。"
  },
  {
    name: "九蓮宝燈",
    kana: "チューレンポウトウ",
    han: "役満",
    closedOnly: true,
    openNote: "鳴いたら不可",
    beginnerPriority: "慣れたら",
    summary: "同じ種類の数牌で1112345678999を含む形を作る役満です。門前限定の非常に珍しい役です。",
    tiles: ["man1", "man1", "man1", "man2", "man3", "man4", "man5", "man6", "man7", "man8", "man9", "man9", "man9"],
    tileLabel: "同じ種類で1112345678999",
    point: "同じ種類の数牌だけで、九蓮の基本形があるかを見ます。",
    caution: "鳴くと九蓮宝燈にはなりません。純正九蓮をダブル役満にするかはルール差があります。"
  },
  {
    name: "天和",
    kana: "テンホウ",
    han: "役満",
    closedOnly: true,
    openNote: "配牌限定",
    beginnerPriority: "慣れたら",
    summary: "親が配牌時点でアガっている役満です。狙うものではなく、起きたら特別な役です。",
    tiles: ["man2", "man3", "man4", "pin3", "pin4", "pin5", "sou6", "sou7", "sou8", "ji7", "ji7", "ji7", "man5", "man5"],
    tileLabel: "親の配牌で完成",
    point: "親の最初の14枚で、すでにアガリ形と役があるかを見ます。",
    caution: "ゲーム開始時限定です。途中で作る役ではありません。"
  },
  {
    name: "地和",
    kana: "チーホウ",
    han: "役満",
    closedOnly: true,
    openNote: "鳴いたら不可",
    beginnerPriority: "慣れたら",
    summary: "子が最初のツモでアガる役満です。自分の最初のツモまでに鳴きが入らないことが条件です。",
    tiles: ["man2", "man3", "man4", "pin3", "pin4", "pin5", "sou6", "sou7", "sou8", "ji7", "ji7", "ji7", "man5"],
    tileLabel: "子の最初のツモ",
    point: "子の第一ツモでアガったかを見ます。",
    caution: "自分の第一ツモ前に誰かが鳴くと地和にならない扱いが一般的です。"
  }
];

const yakuGroups = [
  {
    title: "まず覚える役",
    description: "ゲームを始めるなら、最初はこの4つからで十分です。",
    tone: "first",
    items: firstYaku
  },
  {
    title: "次に覚える役",
    description: "基本に慣れたら、よく出る形を少しずつ増やします。",
    tone: "next",
    items: nextYaku
  },
  {
    title: "慣れたら覚える役",
    description: "高い手や少し複雑な手です。最初から全部覚えなくて大丈夫です。",
    tone: "later",
    items: laterYaku
  },
  {
    title: "タイミングでつく役",
    description: "牌の形より、リーチ後・最後の牌・カン後など、アガった状況で決まる役です。",
    tone: "later",
    items: situationalYaku
  },
  {
    title: "鳴きや形で覚える役",
    description: "食い下がりや刻子系など、基本に慣れてから覚えるとよい役です。",
    tone: "later",
    items: openAndShapeYaku
  },
  {
    title: "役満",
    description: "非常に高い特別な役です。最初は名前と形だけ眺めるくらいで十分です。",
    tone: "yakuman",
    items: yakumanYaku
  }
];

const yakuArticleHrefByName = new Map(yakuArticles.map((article) => [article.name, `/rules/${article.slug}`]));

const yakuTileExamples: Record<string, YakuTileExample> = {
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
      { label: "カン後", tiles: ["ji7", "ji7", "ji7"], highlight: true },
      { tiles: ["man2", "man3", "man4"] },
      { tiles: ["pin3", "pin4", "pin5"] },
      { tiles: ["sou6", "sou7"] },
      { tiles: ["man5", "man5"] }
    ],
    winningTile: "sou8"
  },
  槍槓: {
    blocks: [
      { label: "加槓をロン", tiles: ["man5", "man5"], highlight: true },
      { tiles: ["man2", "man3", "man4"] },
      { tiles: ["pin3", "pin4", "pin5"] },
      { tiles: ["sou6", "sou7", "sou8"] },
      { tiles: ["ji7", "ji7"] }
    ],
    winningTile: "man5"
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
      { label: "カン", tiles: ["man2", "man2", "man2", "man2"], highlight: true },
      { label: "カン", tiles: ["pin5", "pin5", "pin5", "pin5"], highlight: true },
      { label: "カン", tiles: ["sou7", "sou7", "sou7", "sou7"], highlight: true },
      { tiles: ["ji7"] }
    ],
    winningTile: "ji7"
  },
  小三元: {
    blocks: [
      { label: "白", tiles: ["ji6", "ji6", "ji6"], highlight: true },
      { label: "發", tiles: ["ji5", "ji5", "ji5"], highlight: true },
      { label: "中の対子", tiles: ["ji7", "ji7"], highlight: true },
      { tiles: ["man2", "man3", "man4"] },
      { tiles: ["pin5", "pin5"] }
    ],
    winningTile: "ji7"
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
      { tiles: ["man5", "man5"] }
    ],
    winningTile: "ji4"
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
      { label: "カン", tiles: ["man2", "man2", "man2", "man2"], highlight: true },
      { label: "カン", tiles: ["pin5", "pin5", "pin5", "pin5"], highlight: true },
      { label: "カン", tiles: ["sou7", "sou7", "sou7", "sou7"], highlight: true },
      { label: "4つ目のカン待ち", tiles: ["ji7"], highlight: true }
    ],
    winningTile: "ji7"
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
    winningTile: "man5"
  },
  地和: {
    blocks: [
      { label: "最初のツモ", tiles: ["man2", "man3", "man4"], highlight: true },
      { label: "最初のツモ", tiles: ["pin3", "pin4", "pin5"], highlight: true },
      { label: "最初のツモ", tiles: ["sou6", "sou7", "sou8"], highlight: true },
      { label: "最初のツモ", tiles: ["ji7", "ji7", "ji7"], highlight: true },
      { label: "最初のツモ", tiles: ["man5"], highlight: true }
    ],
    winningTile: "man5"
  }
};

export default function YakuPage() {
  return (
    <main className="siteMain yakuGuidePage">
      <PageHero
        eyebrow="Yaku Guide"
        title="麻雀 役一覧"
        description="初心者が先に覚えたい役から、慣れたら覚える役、役満まで牌の形で確認できます。最初はリーチ・タンヤオ・役牌・ツモから覚えれば大丈夫です。"
        primaryLink={{ label: "初心者ロードマップへ戻る", href: "/learn" }}
        secondaryLink={{ label: "役を練習する", href: "/trainer" }}
      />

      <section className="yakuIntro">
        <SectionTitle title="役はアガるための条件" description="麻雀は形が完成していても、役が1つ以上ないとアガれません。牌図を見ながら、どこが役になっているかを確認しましょう。" />
        <div className="yakuRuleGrid">
          <article>
            <h2>最初は全部覚えない</h2>
            <p>リーチ、タンヤオ、役牌、ツモの4つだけでもかなり遊べます。複雑な役はあとから足していきます。</p>
          </article>
          <article>
            <h2>鳴ける役かを見る</h2>
            <p>リーチや平和は鳴くと使えません。役牌やタンヤオは鳴いても使えることが多いので、初心者向きです。</p>
          </article>
          <article>
            <h2>牌の形で覚える</h2>
            <p>役名を丸暗記するより、「1・9・字牌がない」「同じ字牌が3枚ある」のように見た目で覚えます。</p>
          </article>
        </div>
      </section>

      {yakuGroups.map((group) => (
        <section className={`yakuGroupSection yakuGroup-${group.tone}`} key={group.title}>
          <SectionTitle title={group.title} description={group.description} />
          <div className="yakuCardGrid">
            {group.items.map((item) => (
              <YakuCard item={item} key={item.name} />
            ))}
          </div>
        </section>
      ))}

      <section>
        <SectionTitle title="役を覚えたら" description="読んだだけで終わらせず、練習問題や点数表で確認すると定着しやすくなります。" />
        <div className="linkCardGrid">
          <InternalLinkCard title="リーチ・タンヤオ・役牌を復習する" description="最初に覚える3つの役をロードマップ記事で確認します。" href="/learn/reach-tanyao-yakuhai" />
          <InternalLinkCard title="実戦問題で練習する" description="何切るや待ち当てで、役が見える手を増やしていきます。" href="/trainer" />
          <InternalLinkCard title="点数表を見る" description="平和や七対子の点数は、早見表で確認できます。" href="/tools/score-table" />
        </div>
      </section>
    </main>
  );
}

function YakuCard({ item }: { item: YakuItem }) {
  const openClass = item.openNote.includes("不可") ? "open-ng" : item.openNote.includes("下がる") ? "open-down" : item.openNote.includes("限定") ? "open-special" : "open-ok";
  const priorityClass = item.beginnerPriority === "まず覚える" ? "priority-first" : item.beginnerPriority === "次に覚える" ? "priority-next" : "priority-later";
  const tileExample = yakuTileExamples[item.name];

  return (
    <article className="yakuCard">
      <div className="yakuCardHeader">
        <div>
          <p className="yakuKana">{item.kana}</p>
          <h2>{item.name}</h2>
        </div>
        <div className="yakuBadges">
          <span className="badge-han">{item.han}</span>
          <span className={openClass}>{item.openNote}</span>
          <span className={priorityClass}>{item.beginnerPriority}</span>
        </div>
      </div>
      <p className="yakuSummary">{item.summary}</p>
      <div className="yakuTileExample">
        <span>{item.tileLabel}</span>
        {tileExample ? (
          <div className="yakuHandFigure" aria-label={`${item.name}の14枚の牌姿例`}>
            <div className="yakuHandTiles">
              {tileExample.blocks.map((block, blockIndex) => (
                <div className={`yakuTileBlock${block.highlight ? " isHighlighted" : ""}`} key={`${item.name}-block-${blockIndex}`}>
                  {block.label ? <span className="yakuTileBlockLabel">{block.label}</span> : null}
                  <div className="yakuTileBlockTiles">
                    {block.tiles.map((tile, tileIndex) => (
                      <img key={`${item.name}-${blockIndex}-${tile}-${tileIndex}`} src={`/tiles/${tile}-66-90-l-emb.png`} alt="" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="yakuWinningTile">
              <span>アガリ牌</span>
              <img src={`/tiles/${tileExample.winningTile}-66-90-l-emb.png`} alt="" />
            </div>
          </div>
        ) : (
          <div className="yakuTileStrip" aria-label={`${item.name}の牌例`}>
            {item.tiles.map((tile, index) => (
              <img key={`${item.name}-${tile}-${index}`} src={`/tiles/${tile}-66-90-l-emb.png`} alt="" />
            ))}
          </div>
        )}
      </div>
      <dl className="yakuPointList">
        <div className="yakuPointItem yakuPoint-focus">
          <dt>見るポイント</dt>
          <dd>{item.point}</dd>
        </div>
        <div className="yakuPointItem yakuPoint-caution">
          <dt>※ 注意</dt>
          <dd>{item.caution}</dd>
        </div>
      </dl>
      <Link className="textLink" href={yakuArticleHrefByName.get(item.name) ?? item.href ?? "/rules/yaku"}>{item.name}をもう少し詳しく見る</Link>
    </article>
  );
}

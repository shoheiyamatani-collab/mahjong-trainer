import type { LearningGuide } from "./guideData";

export const guideLibraryCategories = [
  { id: "foundation", label: "形の基本" },
  { id: "decision", label: "何切る" },
  { id: "defense", label: "守備・鳴き" },
  { id: "scoring", label: "点数計算" }
] as const;

export type GuideLibraryCategory = typeof guideLibraryCategories[number]["id"];
export type GuideLibraryFilter = "all" | GuideLibraryCategory;
type PreviewTone = "neutral" | "blue" | "green";
type PreviewSource = {
  label: string;
  tone?: PreviewTone;
  arrowBefore?: boolean;
} & (
  | { kind?: "figure"; row: number; figure?: number; result?: boolean; slice?: [number, number] }
  | { kind: "practice"; item: number }
);
type LibraryDefinition = { slug: string; category: GuideLibraryCategory; keywords: string; preview: PreviewSource[] };

// Thumbnail tiles come from the article itself, so its diagrams stay the source of truth.
const libraryDefinitions: LibraryDefinition[] = [
  { slug: "five-block-theory", category: "foundation", keywords: "五ブロック 面子 メンツ ターツ 雀頭 対子", preview: [
    { row: 4, label: "対子" }, { row: 0, label: "順子", tone: "blue" }, { row: 1, label: "刻子", tone: "green" }, { row: 2, label: "ターツ" }
  ] },
  { slug: "wait-shape-basics", category: "foundation", keywords: "リャンメン カンチャン ペンチャン ターツ", preview: [
    { row: 0, label: "両面" }, { row: 1, label: "カンチャン", tone: "blue" }, { row: 2, label: "ペンチャン" }
  ] },
  { slug: "what-is-tile-efficiency", category: "decision", keywords: "牌理 有効牌 シャンテン 受け入れ", preview: [
    { row: 0, label: "両面", tone: "blue" }, { row: 0, result: true, label: "受け入れ", tone: "green", arrowBefore: true }
  ] },
  { slug: "one-shanten-ukeire", category: "decision", keywords: "一向聴 イーシャンテン テンパイ くっつき ヘッドレス", preview: [
    { row: 0, label: "両面", tone: "blue" }, { row: 1, label: "カンチャン" }, { row: 2, label: "対子", tone: "green" }
  ] },
  { slug: "suji-defense", category: "defense", keywords: "スジ 筋 安全牌 リーチ 放銃", preview: [
    { row: 0, label: "河" }, { row: 0, result: true, label: "両面のスジ", tone: "blue", arrowBefore: true }
  ] },
  { slug: "kabe-defense", category: "defense", keywords: "カベ 壁 ノーチャンス ワンチャンス 守備", preview: [
    { row: 0, label: "4枚見え", tone: "blue" }, { row: 0, result: true, label: "外側の候補", tone: "green", arrowBefore: true }
  ] },
  { slug: "beginner-nanikiru-mistakes", category: "decision", keywords: "何切る なにきる ミス 初心者 雀頭 ブロック", preview: [
    { row: 0, label: "完成面子" }, { row: 1, label: "雀頭", tone: "blue" }, { row: 2, label: "両面", tone: "green" }
  ] },
  { slug: "good-shape-rate", category: "decision", keywords: "良形 良系 良形率 リャンメン 愚形 超良形", preview: [
    { row: 0, label: "両面", tone: "green" }, { row: 1, label: "カンチャン", tone: "blue" }
  ] },
  { slug: "wait-types", category: "foundation", keywords: "何待ち テンパイ 単騎 シャンポン リャンメン", preview: [
    { row: 0, label: "両面", tone: "blue" }, { row: 3, label: "シャンポン" }, { row: 4, label: "単騎", tone: "green" }
  ] },
  { slug: "calling-decision", category: "defense", keywords: "鳴く 鳴かない ポン チー 副露 タンヤオ 役牌", preview: [
    { row: 0, label: "役牌の対子", tone: "green" }, { row: 0, result: true, label: "出た牌", arrowBefore: true }, { row: 2, label: "役なし注意" }
  ] },
  { slug: "genbutsu-suji-kabe", category: "defense", keywords: "現物 ゲンブツ スジ 筋 カベ 壁 ベタオリ 安全度", preview: [
    { row: 0, label: "現物", tone: "green" }, { row: 1, result: true, label: "スジ", tone: "blue" }, { row: 2, label: "カベ" }
  ] },
  { slug: "tile-efficiency-and-ukeire", category: "decision", keywords: "受け入れ ウケイレ 有効牌 枚数 牌理 シャンテン", preview: [
    { row: 0, label: "両面", tone: "blue" }, { row: 0, result: true, label: "最大8枚", tone: "green", arrowBefore: true }
  ] },
  { slug: "score-calculation-practice", category: "scoring", keywords: "符 翻 ハン ロン ツモ 点数 満貫 練習", preview: [
    { kind: "practice", item: 0, label: "点数計算の練習牌姿" }
  ] },
  { slug: "mahjong-checker-examples", category: "decision", keywords: "牌理チェッカー 解析 ツール 受け入れ 良形率", preview: [
    { row: 1, label: "入力する形", tone: "blue" }, { row: 1, result: true, label: "有効牌を比較", tone: "green", arrowBefore: true }
  ] },
  { slug: "rule-differences-and-calling", category: "defense", keywords: "天鳳 雀魂 Mリーグ ラス回避 順位 ルール 鳴き", preview: [
    { row: 0, slice: [10, 12], label: "白の対子" }, { row: 1, result: true, label: "両面待ち", tone: "green", arrowBefore: true }
  ] },
  { slug: "furiten-basics", category: "foundation", keywords: "振聴 フリテン ロンできない 同巡 見逃し", preview: [
    { row: 0, result: true, label: "両面待ち", tone: "blue" }, { row: 1, label: "自分の河", arrowBefore: true }
  ] },
  { slug: "betaori-basics", category: "defense", keywords: "ベタオリ 安全牌 現物 リーチ 放銃回避 守備", preview: [
    { row: 0, slice: [11, 13], label: "手牌の東", tone: "green" }, { row: 1, result: true, label: "相手の現物", arrowBefore: true }
  ] },
  { slug: "riichi-or-dama", category: "decision", keywords: "立直 リーチ ダマ ダマテン 打点 手変わり", preview: [
    { row: 0, slice: [0, 2], label: "待ちを確認", tone: "blue" }, { row: 0, result: true, label: "アガリ牌", tone: "green", arrowBefore: true }
  ] },
  { slug: "visible-tiles-and-ukeire", category: "decision", keywords: "見えている牌 公開牌 残り枚数 河 副露 二重計上", preview: [
    { row: 0, result: true, label: "待ち", tone: "blue" }, { row: 1, label: "公開牌を差し引く", arrowBefore: true }
  ] },
  { slug: "orasu-score-conditions", category: "scoring", keywords: "オーラス 逆転 条件 直撃 ツモ 点棒 順位", preview: [
    { row: 0, slice: [0, 3], label: "暗刻", tone: "blue" }, { row: 1, label: "2600点のロン", tone: "green", arrowBefore: true }
  ] },
  { slug: "fu-calculation", category: "scoring", keywords: "符計算 20符 25符 30符 40符 明刻 暗刻 切り上げ", preview: [
    { row: 2, slice: [0, 3], label: "暗刻4符", tone: "blue" }, { figure: 1, row: 0, label: "カンチャン2符" }
  ] }
];

export type GuideLibraryItem = {
  slug: string;
  title: string;
  description: string;
  category: GuideLibraryCategory;
  keywords: string;
  preview: { label: string; tiles: string[]; tone: PreviewTone; arrowBefore: boolean }[];
};

export function buildGuideLibrary(guides: readonly LearningGuide[]): GuideLibraryItem[] {
  return libraryDefinitions.map((definition) => {
    const guide = guides.find((item) => item.slug === definition.slug);
    if (!guide) throw new Error(`Missing learning guide: ${definition.slug}`);
    return {
      slug: guide.slug,
      title: guide.title,
      description: guide.description,
      category: definition.category,
      keywords: `${definition.keywords} ${guide.takeaways.join(" ")}`,
      preview: definition.preview.map((source) => {
        const row = source.kind !== "practice" ? guide.figures[source.figure ?? 0]?.rows[source.row] : undefined;
        const originalTiles = source.kind === "practice" ? guide.practice?.items[source.item]?.tiles : source.result ? row?.resultTiles : row?.tiles;
        if (!originalTiles?.length) throw new Error(`Missing preview tiles: ${guide.slug}`);
        const tiles = source.kind !== "practice" && source.slice ? originalTiles.slice(...source.slice) : [...originalTiles];
        return { label: source.label, tiles, tone: source.tone ?? "neutral", arrowBefore: source.arrowBefore ?? false };
      })
    };
  });
}

export function filterGuideLibrary(items: readonly GuideLibraryItem[], category: GuideLibraryFilter, query: string): GuideLibraryItem[] {
  const normalize = (text: string) => text.normalize("NFKC").toLowerCase();
  const terms = normalize(query).trim().split(/\s+/u).filter(Boolean);
  return items.filter((item) => {
    if (category !== "all" && item.category !== category) return false;
    const label = guideLibraryCategories.find((candidate) => candidate.id === item.category)!.label;
    const searchable = normalize(`${item.title} ${item.description} ${label} ${item.keywords}`);
    return terms.every((term) => searchable.includes(term));
  });
}

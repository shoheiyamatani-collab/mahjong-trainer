import { trainerDefinitions, standaloneTrainerDefinitions } from "../trainer/trainerCatalog";
import { trainerPresentation } from "../trainer/trainerPresentation";
import type { ToolPreviewScreenshot } from "../components/ToolPreviewImage";

export type ToolTone = "analysis" | "learning" | "efficiency" | "waits" | "scoring" | "decisions";
export type ToolCatalogItem = { id: string; title: string; href: string; description: string; category: string; tone: ToolTone; level: string; training: boolean; keywords: string[]; screenshot?: ToolPreviewScreenshot };
export const trainingTone = { 牌効率: "efficiency", 待ち: "waits", 点数計算: "scoring", 実戦判断: "decisions" } as const;
const keywords: Record<string, string[]> = {
  "combo-theory": ["コンボ", "危険牌", "守備", "スジ", "カベ", "フリテン", "組み合わせ", "シミュレーター"],
  "ukeire-max": ["何切る", "牌効率", "受け入れ", "有効牌", "MAX"],
  iishanten: ["何切る", "イーシャンテン", "一向聴", "受け入れ", "牌理"],
  "seven-tile": ["何待ち", "待ち読み", "多面待ち", "7枚"],
  chinitsu: ["何待ち", "清一色", "チンイツ", "多面待ち"],
  score: ["点数", "符計算", "翻", "ロン", "ツモ"],
  "score-hard": ["点数", "符計算", "高符", "カン", "HARD"],
  "call-or-pass": ["鳴き", "鳴く", "ポン", "チー", "スルー", "副露"],
  "riichi-or-dama": ["リーチ", "ダマ", "黙聴", "実戦判断"],
  "push-or-fold": ["押し引き", "安全牌", "守備", "放銃", "押す", "オリる", "期待値"]
};
export function getToolCatalog(includeTedashi = false): ToolCatalogItem[] {
  const trainers: ToolCatalogItem[] = [...trainerDefinitions, ...standaloneTrainerDefinitions].map(item => ({
    id: item.slug, title: item.title, href: `/trainer/${item.slug}`, category: item.category, tone: trainingTone[item.category], level: item.level, training: true,
    description: trainerPresentation[item.slug]?.summary ?? item.description, keywords: keywords[item.slug] ?? [],
    screenshot: { ...item.screenshot, crop: trainerPresentation[item.slug]?.crop }
  }));
  return [
    { id: "checker", title: "牌理チェッカー", href: "/analysis/mahjong-tool", description: "切る牌ごとのシャンテン数・受け入れ枚数・良形率を比較。", category: "解析・計算", tone: "analysis", level: "初級〜上級", training: false, keywords: ["牌理", "牌効率", "何切る", "有効牌", "受け入れ", "良形率"], screenshot: { src: "/tool-screenshots/analysis-checker.jpg", alt: "牌理チェッカーの打牌比較", width: 1217, height: 420, crop: { x: 8, y: 52, width: 350, height: 220 } } },
    { id: "starting-hand", title: "配牌分析", href: "/analysis/starting-hand", description: "13枚の配牌から、狙う手役の本線と対抗を比較。", category: "解析・計算", tone: "analysis", level: "中級〜上級", training: false, keywords: ["配牌", "手役", "シミュレーション", "何狙う", "ホンイツ"], screenshot: { src: "/tool-screenshots/analysis-starting-hand.jpg", alt: "配牌分析の構想比較", width: 1144, height: 510, crop: { x: 0, y: 308, width: 320, height: 200 } } },
    { id: "calculator", title: "点数計算ツール", href: "/tools", description: "手牌と条件から、役・翻・符・支払う点数を確認。", category: "解析・計算", tone: "analysis", level: "初級〜上級", training: false, keywords: ["点数", "符計算", "ドラ", "ロン", "ツモ", "役"], screenshot: { src: "/tool-screenshots/score-calculator-result.png", alt: "点数計算の結果", width: 520, height: 210, crop: { x: 10, y: 5, width: 300, height: 187.5 } } },
    { id: "orasu", title: "オーラス条件計算", href: "/analysis/orasu-condition", description: "点棒状況から、目標順位に必要なロン・ツモの条件を比較。", category: "解析・計算", tone: "analysis", level: "中級〜上級", training: false, keywords: ["オーラス", "順位", "逆転", "条件", "点数", "直撃"] },
    { id: "score-table", title: "点数早見表", href: "/tools/score-table", description: "親子・ロン・ツモの点数を、符と翻からすばやく確認。", category: "解析・計算", tone: "analysis", level: "初心者", training: false, keywords: ["点数", "符計算", "早見表", "満貫", "翻"] },
    ...trainers,
    { id: "yaku-quiz", title: "役判定クイズ", href: "/training/yaku-quiz", description: "牌姿の役を選び、鳴きや成立条件も確認。", category: "役とルール", tone: "learning", level: "初心者", training: true, keywords: ["役", "タンヤオ", "役牌", "ルール"] },
    ...(includeTedashi ? [{ id: "tedashi-reading", title: "手出し読みトレーニング", href: "/training/tedashi-reading", description: trainerPresentation["tedashi-reading"]!.summary, category: "実戦判断", tone: "decisions" as const, level: "中級者", training: true, keywords: ["手出し", "ツモ切り", "河", "捨て牌"], screenshot: { src: "/tool-screenshots/tedashi-reading.jpg", alt: "手出し読みの問題画面", width: 1144, height: 539, crop: trainerPresentation["tedashi-reading"]!.crop } }] : [])
  ];
}
export function filterTools(items: ToolCatalogItem[], query: string, category = "all") {
  const words = query.normalize("NFKC").toLocaleLowerCase("ja").trim().split(/\s+/).filter(Boolean);
  return items.filter(item => (category === "all" || (category === "analysis" ? !item.training : item.tone === category)) && words.every(word => [item.title, item.description, item.category, ...item.keywords].join(" ").normalize("NFKC").toLocaleLowerCase("ja").includes(word)));
}

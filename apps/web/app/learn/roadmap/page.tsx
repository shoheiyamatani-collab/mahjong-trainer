import type { Metadata } from "next";
import { learnArticles } from "../../siteData";
import { RoadmapLearningBoard } from "./RoadmapLearningBoard";

type RoadmapVisual = {
  label: string;
  groups: { label: string; tiles: string[] }[];
};

const roadmapVisuals: Record<number, RoadmapVisual> = {
  1: {
    label: "4つの面子と雀頭をそろえた基本のアガリ形",
    groups: [{ label: "完成した14枚", tiles: ["man1", "man2", "man3", "man4", "man5", "man6", "pin2", "pin3", "pin4", "sou7", "sou8", "sou9", "ji7", "ji7"] }]
  },
  2: {
    label: "萬子・筒子・索子・字牌の4種類",
    groups: [
      { label: "萬子", tiles: ["man1", "man5", "man9"] },
      { label: "筒子", tiles: ["pin1", "pin5", "pin9"] },
      { label: "索子", tiles: ["sou1", "sou5", "sou9"] },
      { label: "字牌", tiles: ["ji1", "ji2", "ji3", "ji4", "ji6", "ji5", "ji7"] }
    ]
  },
  3: {
    label: "手牌13枚に1枚ツモり、不要な1枚を捨てる",
    groups: [
      { label: "手牌13枚", tiles: ["man1", "man2", "man3", "man4", "man5", "man6", "pin2", "pin3", "pin4", "sou6", "sou7", "sou8", "ji7"] },
      { label: "ツモ牌", tiles: ["pin5"] }
    ]
  },
  4: {
    label: "順子・刻子が面子、同じ牌2枚が雀頭",
    groups: [
      { label: "順子", tiles: ["man2", "man3", "man4"] },
      { label: "刻子", tiles: ["ji1", "ji1", "ji1"] },
      { label: "雀頭", tiles: ["pin5", "pin5"] }
    ]
  },
  5: {
    label: "4面子1雀頭で作る14枚の基本形",
    groups: [{ label: "4面子 ＋ 1雀頭", tiles: ["man1", "man2", "man3", "man4", "man5", "man6", "pin2", "pin3", "pin4", "sou7", "sou8", "sou9", "ji7", "ji7"] }]
  },
  6: {
    label: "2から8の数牌だけで作ったタンヤオの例",
    groups: [{ label: "役あり：タンヤオ", tiles: ["man2", "man3", "man4", "man4", "man5", "man6", "pin2", "pin3", "pin4", "sou6", "sou7", "sou8", "pin5", "pin5"] }]
  },
  7: {
    label: "最後の5筒を自分で引けばツモ、相手から出ればロン",
    groups: [
      { label: "待っている13枚", tiles: ["man1", "man2", "man3", "man4", "man5", "man6", "pin2", "pin3", "pin4", "sou7", "sou8", "sou9", "pin5"] },
      { label: "ツモ・ロン牌", tiles: ["pin5"] }
    ]
  },
  8: {
    label: "白をポンして、鳴いたあとにも役牌を残す例",
    groups: [
      { label: "ポンした白", tiles: ["ji6", "ji6", "ji6"] },
      { label: "残りの手牌", tiles: ["man2", "man3", "man4", "man4", "man5", "man6", "pin6", "pin7", "pin8", "ji7", "ji7"] }
    ]
  },
  9: {
    label: "2萬から6萬の連続形で、1萬・4萬・7萬を待つテンパイ",
    groups: [
      { label: "テンパイの13枚", tiles: ["man2", "man3", "man4", "man5", "man6", "pin2", "pin3", "pin4", "sou6", "sou7", "sou8", "ji7", "ji7"] },
      { label: "一四七待ち", tiles: ["man1", "man4", "man7"] }
    ]
  },
  10: {
    label: "つながった数牌を残し、孤立した東を切る何切る例",
    groups: [
      { label: "残したい13枚", tiles: ["man1", "man2", "man3", "man3", "man4", "man5", "pin4", "pin5", "pin6", "sou6", "sou7", "ji7", "ji7"] },
      { label: "切る候補", tiles: ["ji1"] }
    ]
  },
  11: {
    label: "完成した手牌を見ながら点数計算を確認する",
    groups: [{ label: "役牌・白のある完成形", tiles: ["man1", "man2", "man3", "man4", "man5", "man6", "pin7", "pin8", "pin9", "ji6", "ji6", "ji6", "ji7", "ji7"] }]
  }
};

export const metadata: Metadata = {
  title: "麻雀 初心者ロードマップ | はじめての麻雀学習順",
  description: "麻雀初心者が、基本ルール、牌の種類、アガリ形、役、待ち、何切る、点数計算まで順番に学べるロードマップです。"
};

export default function LearnRoadmapPage() {
  const steps = learnArticles.map((article) => {
    const visual = roadmapVisuals[article.step];

    return {
      step: article.step,
      title: article.title,
      description: article.description,
      href: `/learn/${article.slug}`,
      learnPoints: article.learnPoints,
      tiles: visual?.groups.flatMap((group) => group.tiles) ?? [],
      tileGroups: visual?.groups ?? [],
      visualLabel: visual?.label ?? `${article.title}の牌例`
    };
  });

  return (
    <main className="siteMain learningRoadmapPage roadmapBoardPage">
      <RoadmapLearningBoard steps={steps} />
    </main>
  );
}

type RoadmapChapter = { number: number; title: string; steps: number[] };

export const roadmapChapters: readonly RoadmapChapter[] = [
  { number: 1, title: "基本を知る", steps: [1, 2, 3] },
  { number: 2, title: "アガリを覚える", steps: [4, 5, 6] },
  { number: 3, title: "実戦で使う", steps: [7, 8, 9] },
  { number: 4, title: "次へ進む", steps: [10, 11] }
];

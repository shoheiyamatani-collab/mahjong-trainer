import type { ResolvedConfig, ShortsProblem } from "./types.js";

export function youtubeTitle(problem: ShortsProblem): string {
  const label = problem.type === "nani-kiru" ? "毎日何切る" : "毎日何待ち";
  const question = problem.type === "nani-kiru" ? "あなたなら何を切る？" : "この清一色、何待ち？";
  const hashtags = problem.type === "nani-kiru" ? "#麻雀 #何切る #雀フォリオ" : "#麻雀 #何待ち #雀フォリオ";
  return `【${label} #${String(problem.sequence).padStart(3, "0")}】${question} ${hashtags}`;
}

export function youtubeDescription(problem: ShortsProblem, config: ResolvedConfig): string {
  const toolName = problem.type === "nani-kiru" ? "雀フォリオ 牌理チェッカー" : "雀フォリオ 清一色トレーニング";
  const prompt = problem.type === "nani-kiru" ? "受け入れを詳しく比較する" : "もっと清一色の待ちを解く";
  const hashtags = problem.type === "nani-kiru" ? "#麻雀 #何切る #雀フォリオ #Shorts" : "#麻雀 #何待ち #清一色 #雀フォリオ #Shorts";
  return [
    `${problem.date} ${problem.id}`,
    "",
    `${prompt}なら、チャンネルのプロフィール先頭リンクから：`,
    toolName,
    "リンクが見つからない場合は「雀フォリオ」で検索してください。",
    `URL（コピー用） ${problem.toolUrl}`,
    "",
    "ナレーション",
    config.youtube.credit,
    "",
    hashtags
  ].join("\n");
}

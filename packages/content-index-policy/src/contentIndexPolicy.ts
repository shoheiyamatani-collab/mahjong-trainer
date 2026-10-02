export type ContentIndexStatus = "always-index" | "ready" | "needs-improvement" | "system";

export type ContentIndexPolicyRule = {
  path: string;
  match: "exact" | "prefix";
  status: ContentIndexStatus;
  reason: string;
};

export const isAdsenseReviewMode = process.env.ADSENSE_REVIEW_MODE === "true";

/**
 * INDEX / NOINDEX decisions live here. Exact rules win over prefix rules, so an
 * improved article can move back to search by adding an exact `ready` rule above
 * its broader `needs-improvement` section.
 */
export const contentIndexPolicy: readonly ContentIndexPolicyRule[] = [
  { path: "/", match: "exact", status: "always-index", reason: "JONGFOLIOの入口" },
  { path: "/learn", match: "prefix", status: "always-index", reason: "独自制作の麻雀学習教材" },
  { path: "/analysis", match: "prefix", status: "always-index", reason: "独自制作の解析ツール" },
  { path: "/tools", match: "prefix", status: "always-index", reason: "独自制作の点数計算ツール" },
  { path: "/trainer", match: "prefix", status: "always-index", reason: "独自制作の麻雀トレーニング" },
  { path: "/training", match: "prefix", status: "always-index", reason: "独自制作の練習問題" },
  { path: "/rules", match: "prefix", status: "always-index", reason: "独自制作のルール・役解説" },

  { path: "/about", match: "exact", status: "system", reason: "運営情報" },
  { path: "/privacy", match: "exact", status: "system", reason: "プライバシーポリシー" },
  { path: "/contact", match: "exact", status: "system", reason: "お問い合わせ" },
  { path: "/terms", match: "exact", status: "system", reason: "利用規約" },
  { path: "/advertising", match: "exact", status: "system", reason: "広告・アフィリエイト方針" },

  { path: "/videos/strategy", match: "prefix", status: "needs-improvement", reason: "第三者動画への依存度を下げる改善待ち" },
  { path: "/videos/mleague-clips", match: "prefix", status: "needs-improvement", reason: "第三者動画を主素材とするため改善待ち" },
  { path: "/mleague", match: "prefix", status: "needs-improvement", reason: "公式・第三者情報に独自分析を追加する改善待ち" }
] as const;

function normalizePath(path: string): string {
  const pathname = path.split(/[?#]/, 1)[0] || "/";
  if (pathname === "/") return pathname;
  return `/${pathname.replace(/^\/+|\/+$/g, "")}`;
}

function matchesRule(path: string, rule: ContentIndexPolicyRule): boolean {
  if (rule.match === "exact") return path === rule.path;
  return path === rule.path || path.startsWith(`${rule.path}/`);
}

export function getContentIndexPolicy(path: string): ContentIndexPolicyRule {
  const normalizedPath = normalizePath(path);
  const exact = contentIndexPolicy.find((rule) => rule.match === "exact" && matchesRule(normalizedPath, rule));
  if (exact) return exact;

  const prefix = contentIndexPolicy
    .filter((rule) => rule.match === "prefix" && matchesRule(normalizedPath, rule))
    .sort((a, b) => b.path.length - a.path.length)[0];

  return prefix ?? {
    path: normalizedPath,
    match: "exact",
    status: "ready",
    reason: "未指定の既存ページは公開可能として扱う"
  };
}

export function getContentIndexStatus(path: string): ContentIndexStatus {
  return getContentIndexPolicy(path).status;
}

export function shouldIndexPath(path: string): boolean {
  return getContentIndexStatus(path) !== "needs-improvement";
}

export function shouldIncludeInSitemap(path: string): boolean {
  return shouldIndexPath(path);
}

export function getRobotsPolicy(path: string) {
  return shouldIndexPath(path)
    ? { index: true as const, follow: true as const }
    : { index: false as const, follow: true as const };
}

export function canShowAdsOnPath(path: string): boolean {
  const status = getContentIndexStatus(path);
  return status === "always-index" || status === "ready";
}

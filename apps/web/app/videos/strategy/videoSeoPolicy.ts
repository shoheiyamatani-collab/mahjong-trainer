import policy from "./videoSeoPolicy.json";

const ARTICLE_PREFIX = "/videos/strategy/";

export const indexedVideoArticlePaths = policy.indexedArticleSlugs.map((slug) => `${ARTICLE_PREFIX}${slug}`);
export const indexableVideoHubPaths = policy.indexableHubPaths;

const indexedPathSet = new Set(indexedVideoArticlePaths);

export function isVideoArticleIndexable(path: string): boolean {
  const normalizedPath = path.replace(/\/$/, "");
  return indexedPathSet.has(normalizedPath);
}

import { shouldIndexPath } from "@mahjong-trainer/content-index-policy";

export function isVideoArticleIndexable(path: string): boolean {
  return shouldIndexPath(path);
}

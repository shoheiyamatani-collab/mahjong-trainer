import { getVideoGuideByArticleHref } from "../videoData";

export function VideoReadingTime({ articleHref }: { articleHref: string }) {
  const readingTime = getVideoGuideByArticleHref(articleHref)?.readingTime;
  return readingTime ? <span>{readingTime}</span> : null;
}

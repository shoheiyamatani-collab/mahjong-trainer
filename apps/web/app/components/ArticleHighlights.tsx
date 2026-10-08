export type ArticleEmphasis = { text: string; tone: "key" | "caution" };
export type ArticleTextPart = { text: string; tone?: ArticleEmphasis["tone"] };

export function getArticleTextParts(text: string, emphasis: ArticleEmphasis[] = []): ArticleTextPart[] {
  const parts: ArticleTextPart[] = [];
  let cursor = 0;
  while (cursor < text.length) {
    const next = emphasis
      .filter((item) => item.text.length > 0)
      .map((item) => ({ ...item, index: text.indexOf(item.text, cursor) }))
      .filter((item) => item.index >= 0)
      .sort((a, b) => a.index - b.index || b.text.length - a.text.length)[0];
    if (!next) {
      parts.push({ text: text.slice(cursor) });
      break;
    }
    if (next.index > cursor) parts.push({ text: text.slice(cursor, next.index) });
    parts.push({ text: next.text, tone: next.tone });
    cursor = next.index + next.text.length;
  }
  return parts;
}

export function ArticleText({ text, emphasis }: { text: string; emphasis?: ArticleEmphasis[] }) {
  return <>{getArticleTextParts(text, emphasis).map((part, index) => part.tone
    ? <strong className={`articleEmphasis articleEmphasis--${part.tone}`} key={index}>{part.text}</strong>
    : part.text)}</>;
}

export function ArticleTakeaways({ items }: { items: string[] }) {
  return <section className="articleTakeaways">
    <h2>まず押さえたいポイント</h2>
    <ol>{items.map((item, index) => <li key={item}>
      <span className="articleTakeawayNumber" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
      <strong>{item}</strong>
    </li>)}</ol>
  </section>;
}

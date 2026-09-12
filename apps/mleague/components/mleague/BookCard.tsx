import { getSafeExternalUrl } from "@/lib/mleague/safeUrl";
import {
  getAmazonBookCoverUrl,
  getAmazonBookLink,
  getRakutenBookLink,
} from "@/lib/mleague/affiliateLinks";
import type { PlayerBook } from "@/types/mleague";
import { BookCover } from "./BookCover";

const roleLabels: Record<PlayerBook["role"], string> = {
  author: "著者",
  coauthor: "共著",
  supervisor: "監修",
  subject: "被写体",
  original_author: "原作",
  unspecified: "役割未確認",
};

const contributorLabels: Record<PlayerBook["role"], string> = {
  author: "共著者",
  coauthor: "共著者",
  supervisor: "関係者",
  subject: "撮影",
  original_author: "作画",
  unspecified: "関係者",
};

function BookLink({
  href,
  label,
  store,
  sponsored = false,
}: {
  href?: string | null;
  label: string;
  store: "amazon" | "rakuten";
  sponsored?: boolean;
}) {
  const safeUrl = getSafeExternalUrl(href || undefined);
  if (!safeUrl) return null;

  return (
    <a
      className={`button-secondary book-affiliate-link book-affiliate-link-${store}`}
      href={safeUrl}
      target="_blank"
      rel={sponsored ? "sponsored noopener noreferrer" : "noopener noreferrer"}
    >
      <span className="book-store-mark" aria-hidden="true">
        {store === "amazon" ? "a" : "R"}
      </span>
      <span>{label}</span>
      {sponsored ? <span className="book-pr-label">PR</span> : null}
      <span className="sr-only">
        （{sponsored ? "広告リンク・" : ""}新しいタブで開きます）
      </span>
    </a>
  );
}

export function BookCard({ book }: { book: PlayerBook }) {
  const coverImageUrl =
    getSafeExternalUrl(book.coverImageUrl || undefined) ||
    getAmazonBookCoverUrl(book);
  const isbnSuffix = book.isbn13?.replace(/-/g, "").slice(-4);
  const amazonLink = getAmazonBookLink(book);
  const rakutenLink = getRakutenBookLink(book);
  const hasRetailLink = Boolean(amazonLink.href || rakutenLink.href);

  return (
    <article className="book-card">
      <div className="book-cover">
        <BookCover
          src={coverImageUrl}
          title={book.title}
          isbnSuffix={isbnSuffix}
          linkHref={amazonLink.href}
          sponsored={amazonLink.sponsored}
        />
      </div>
      <div className="book-card-body">
        <div>
          <span className="book-role">{roleLabels[book.role]}</span>
          <h3>{book.title}</h3>
        </div>
        {book.coauthors?.length ? (
          <dl className="book-meta">
            <div>
              <dt>{contributorLabels[book.role]}</dt>
              <dd>{book.coauthors.join("、")}</dd>
            </div>
          </dl>
        ) : null}
        {book.description ? <p>{book.description}</p> : null}
        {hasRetailLink ? (
          <div className="book-affiliate-links">
            <BookLink
              href={amazonLink.href}
              label="Amazonで購入"
              store="amazon"
              sponsored={amazonLink.sponsored}
            />
            <BookLink
              href={rakutenLink.href}
              label="楽天ブックスで購入"
              store="rakuten"
              sponsored={rakutenLink.sponsored}
            />
          </div>
        ) : null}
      </div>
    </article>
  );
}

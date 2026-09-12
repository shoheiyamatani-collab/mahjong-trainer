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

function formatReleaseDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (day) return `${year}年${month}月${day}日`;
  if (month) return `${year}年${month}月`;
  return `${year}年`;
}

export function BookCard({ book }: { book: PlayerBook }) {
  const coverImageUrl =
    getSafeExternalUrl(book.coverImageUrl || undefined) ||
    getAmazonBookCoverUrl(book);
  const publisherUrl = getSafeExternalUrl(book.publisherUrl || undefined);
  const isbnSuffix = book.isbn13?.replace(/-/g, "").slice(-4);
  const amazonLink = getAmazonBookLink(book);
  const rakutenLink = getRakutenBookLink(book);
  const hasRetailLink = Boolean(amazonLink.href || rakutenLink.href);
  const hasAffiliateLink = amazonLink.sponsored || rakutenLink.sponsored;

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
        <dl className="book-meta">
          {book.coauthors?.length ? (
            <div>
              <dt>{contributorLabels[book.role]}</dt>
              <dd>{book.coauthors.join("、")}</dd>
            </div>
          ) : null}
          {book.publisher ? (
            <div>
              <dt>出版社</dt>
              <dd>
                {publisherUrl ? (
                  <a
                    className="text-link"
                    href={publisherUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {book.publisher}
                  </a>
                ) : (
                  book.publisher
                )}
              </dd>
            </div>
          ) : null}
          {book.releaseDate ? (
            <div>
              <dt>発売日</dt>
              <dd>{formatReleaseDate(book.releaseDate)}</dd>
            </div>
          ) : book.releaseYear ? (
            <div>
              <dt>発売年</dt>
              <dd>{book.releaseYear}年</dd>
            </div>
          ) : null}
          {book.isbn13 ? (
            <div>
              <dt>ISBN</dt>
              <dd>{book.isbn13}</dd>
            </div>
          ) : null}
        </dl>
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
            {hasAffiliateLink ? (
              <p className="book-affiliate-disclosure">
                商品リンクにはアフィリエイト広告が含まれます。
                {amazonLink.sponsored
                  ? " Amazonのアソシエイトとして、当サイトは適格販売により収入を得ています。"
                  : ""}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}

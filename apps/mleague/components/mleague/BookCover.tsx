"use client";

import { useState } from "react";

type BookCoverProps = {
  src: string | null;
  title: string;
  isbnSuffix?: string;
  linkHref?: string | null;
  sponsored?: boolean;
};

export function BookCover({
  src,
  title,
  isbnSuffix,
  linkHref,
  sponsored = false,
}: BookCoverProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = Boolean(src && src !== failedSrc);

  if (!showImage) {
    return (
      <div className="book-cover-placeholder" aria-label="書影未登録">
        <strong>{title}</strong>
        <span>書籍</span>
        <small>{isbnSuffix ? `ISBN …${isbnSuffix}` : "ISBNなし"}</small>
      </div>
    );
  }

  const image = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="book-cover-image"
      src={src || undefined}
      alt={`${title}の書影`}
      loading="lazy"
      decoding="async"
      onError={() => setFailedSrc(src)}
    />
  );

  if (!linkHref) return image;

  return (
    <a
      className="book-cover-link"
      href={linkHref}
      target="_blank"
      rel={sponsored ? "sponsored noopener noreferrer" : "noopener noreferrer"}
      aria-label={`${title}をAmazonで見る${sponsored ? "（広告リンク）" : ""}`}
    >
      {image}
    </a>
  );
}

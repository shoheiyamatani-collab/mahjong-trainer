import { getSafeExternalUrl } from "@/lib/mleague/safeUrl";
import type { PlayerBook } from "@/types/mleague";

export type BookStoreLink = {
  href: string | null;
  sponsored: boolean;
};

function normalizeIsbn(value?: string | null) {
  return value?.replace(/[^0-9X]/gi, "").toUpperCase() || null;
}

function isbn13ToIsbn10(value?: string | null) {
  const isbn = normalizeIsbn(value);
  if (!isbn || !/^978\d{10}$/.test(isbn)) return null;

  const body = isbn.slice(3, 12);
  const weightedSum = [...body].reduce(
    (sum, digit, index) => sum + Number(digit) * (10 - index),
    0,
  );
  const remainder = (11 - (weightedSum % 11)) % 11;
  const checkDigit = remainder === 10 ? "X" : String(remainder);

  return `${body}${checkDigit}`;
}

function getAmazonAsin(book: PlayerBook) {
  const amazonUrl = getSafeExternalUrl(book.amazonUrl || undefined);

  if (amazonUrl) {
    try {
      const url = new URL(amazonUrl);
      const match = url.pathname.match(
        /\/(?:dp|gp\/product)\/([A-Z0-9]{10})(?:[/?]|$)/i,
      );
      if (match) return match[1].toUpperCase();
    } catch {
      // Fall back to ISBN when a stored URL cannot be parsed.
    }
  }

  return isbn13ToIsbn10(book.isbn13);
}

export function getAmazonBookCoverUrl(book: PlayerBook) {
  const asin = getAmazonAsin(book);
  return asin
    ? `https://images-na.ssl-images-amazon.com/images/P/${asin}.09.LZZZZZZZ.jpg`
    : null;
}

function getAmazonAssociateTag() {
  const tag = process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG?.trim();
  return tag && /^[A-Za-z0-9-]{1,64}$/.test(tag) ? tag : null;
}

function getRakutenAffiliateId() {
  const id = process.env.NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID?.trim();
  return id && /^[A-Za-z0-9._-]{1,128}$/.test(id) ? id : null;
}

export function getAmazonBookLink(book: PlayerBook): BookStoreLink {
  const explicitAffiliateUrl = getSafeExternalUrl(
    book.amazonAffiliateUrl || undefined,
  );
  if (explicitAffiliateUrl) {
    return { href: explicitAffiliateUrl, sponsored: true };
  }

  const asin = getAmazonAsin(book);
  const associateTag = getAmazonAssociateTag();
  if (asin && associateTag) {
    return {
      href: `https://www.amazon.co.jp/dp/${asin}/ref=nosim?tag=${encodeURIComponent(associateTag)}`,
      sponsored: true,
    };
  }

  const regularUrl = getSafeExternalUrl(book.amazonUrl || undefined);
  return {
    href: regularUrl || (asin ? `https://www.amazon.co.jp/dp/${asin}` : null),
    sponsored: false,
  };
}

export function getRakutenBookLink(book: PlayerBook): BookStoreLink {
  const explicitAffiliateUrl = getSafeExternalUrl(
    book.rakutenAffiliateUrl || undefined,
  );
  if (explicitAffiliateUrl) {
    return { href: explicitAffiliateUrl, sponsored: true };
  }

  const regularUrl = getSafeExternalUrl(book.rakutenUrl || undefined);
  const isbn = normalizeIsbn(book.isbn13);
  const destinationUrl =
    regularUrl ||
    (isbn
      ? `https://books.rakuten.co.jp/search?sitem=${encodeURIComponent(isbn)}`
      : null);
  const affiliateId = getRakutenAffiliateId();
  if (destinationUrl && affiliateId) {
    const encodedUrl = encodeURIComponent(destinationUrl);
    return {
      href: `https://hb.afl.rakuten.co.jp/hgc/${encodeURIComponent(affiliateId)}/?pc=${encodedUrl}&m=${encodedUrl}`,
      sponsored: true,
    };
  }
  return { href: destinationUrl, sponsored: false };
}

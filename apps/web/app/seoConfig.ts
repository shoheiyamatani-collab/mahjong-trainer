const DEFAULT_SITE_URL = "https://jongfolio.com";

export function getSiteUrl(): string {
  const configuredUrl = process.env.SITE_URL?.trim();
  if (!configuredUrl) return DEFAULT_SITE_URL;

  try {
    const url = new URL(configuredUrl);
    if (url.protocol !== "https:" && url.protocol !== "http:") return DEFAULT_SITE_URL;
    return `${url.origin}${url.pathname.replace(/\/+$/, "")}`;
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export function getVideoSiteHref(path: string): string {
  const configuredUrl = process.env.VIDEO_STANDALONE_URL?.trim();
  if (!configuredUrl) return path;

  try {
    const url = new URL(configuredUrl);
    if (url.protocol !== "https:") return path;
    return `${url.origin}${path.startsWith("/") ? path : `/${path}`}`;
  } catch {
    return path;
  }
}

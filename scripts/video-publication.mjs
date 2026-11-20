export function videoStandaloneOrigin(value = process.env.VIDEO_STANDALONE_URL) {
  if (!value) return null;

  const url = new URL(value);
  if (url.href !== `${url.origin}/` || url.protocol !== "https:" || !/^[a-z0-9-]+\.pages\.dev$/.test(url.hostname) || url.port) {
    throw new Error("VIDEO_STANDALONE_URL must be the HTTPS production origin of the dedicated Pages project.");
  }
  return url.origin;
}

export function videoMigrationRedirects(origin) {
  return [
    `/videos ${origin}/videos/strategy 301`,
    `/videos/ ${origin}/videos/strategy 301`,
    `/videos/strategy ${origin}/videos/strategy 301`,
    `/videos/strategy/ ${origin}/videos/strategy 301`,
    `/videos/strategy/* ${origin}/videos/strategy/:splat 301`
  ].join("\n");
}

export function collectPrimarySiteLinks(html, videoOrigin) {
  const paths = new Set();
  const localAssetPrefixes = ["/_next/", "/brand/", "/fonts/", "/images/", "/tiles/", "/score-tables/", "/tool-screenshots/"];

  for (const match of html.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["'][^>]*>/gi)) {
    const href = match[1].replaceAll("&amp;", "&").trim();
    if (!href.startsWith("/") || href.startsWith("//")) continue;

    let pathname;
    try {
      pathname = new URL(href, videoOrigin).pathname;
    } catch {
      continue;
    }
    if (pathname === "/" || pathname === "/videos/strategy" || pathname.startsWith("/videos/strategy/")) continue;
    if (pathname === "/videos/mleague-clips" || pathname.startsWith("/videos/mleague-clips/")) continue;
    if (localAssetPrefixes.some((prefix) => pathname.startsWith(prefix))) continue;
    paths.add(pathname);
  }

  return [...paths].sort();
}

export function primarySiteRedirects(paths, origin) {
  const routes = new Set();
  for (const pathname of paths) {
    routes.add(pathname);
    if (pathname !== "/") routes.add(pathname.endsWith("/") ? pathname.slice(0, -1) : `${pathname}/`);
  }
  return [...routes].sort().map((pathname) => `${pathname} ${origin}${pathname} 302`).join("\n");
}

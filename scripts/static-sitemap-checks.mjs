export function sitemapCoverageErrors(pages, sitemapUrls, siteOrigin) {
  const listed = new Set(sitemapUrls);
  const missing = new Set();
  for (const page of pages) {
    if (page.noindex || !page.canonical || ["/404", "/_not-found", "/mleague/404"].includes(page.route)) continue;
    let canonical;
    try {
      canonical = new URL(page.canonical);
    } catch {
      continue; // Metadata validity is checked separately.
    }
    const canonicalPath = canonical.pathname.replace(/\/$/, "") || "/";
    // Aliases canonicalized to another route are not independent search pages.
    if (canonical.origin !== siteOrigin || canonicalPath !== page.route) continue;
    if (!listed.has(canonical.href)) missing.add(canonical.href);
  }
  return [...missing].sort().map((url) => `検索対象の静的HTMLがサイトマップにありません: ${url}`);
}

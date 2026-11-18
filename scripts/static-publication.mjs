export function canonicalRouteRedirects(canonicalUrls, expectedOrigin) {
  const origin = new URL(expectedOrigin).origin;
  const aliases = new Map();
  const canonicalPaths = new Set();

  for (const value of canonicalUrls) {
    const canonical = new URL(value);
    if (canonical.origin !== origin || canonical.search || canonical.hash) {
      throw new Error(`Expected a clean canonical URL on ${origin}: ${value}`);
    }
    canonicalPaths.add(canonical.pathname);
  }

  for (const value of canonicalUrls) {
    const pathname = new URL(value).pathname;
    if (pathname === "/") continue;
    const alias = pathname.endsWith("/") ? pathname.slice(0, -1) : `${pathname}/`;
    if (canonicalPaths.has(alias)) {
      throw new Error(`Conflicting canonical routes for ${alias} and ${pathname}`);
    }
    const previousTarget = aliases.get(alias);
    if (previousTarget && previousTarget !== pathname) {
      throw new Error(`Conflicting canonical routes for ${alias}: ${previousTarget} and ${pathname}`);
    }
    aliases.set(alias, pathname);
  }

  return [...aliases]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([alias, canonical]) => `${alias} ${canonical} 301`)
    .join("\n");
}

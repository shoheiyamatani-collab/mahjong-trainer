import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = path.join(repositoryRoot, "apps", "web", "out");
const sitemapPath = path.join(outputRoot, "sitemap.xml");
const publicationPolicyPath = path.join(repositoryRoot, "packages", "content-index-policy", "src", "publicationPolicy.json");
const siteOrigin = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://jongfolio.com").origin;
const isReviewMode = process.env.ADSENSE_REVIEW_MODE === "true";
const errors = [];
const checkedReferences = new Set();
let outputFilePaths = new Set();
let reviewModeNoindexRoutePrefixes = [];

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectFiles(entryPath));
    else if (entry.isFile()) files.push(entryPath);
  }

  return files;
}

async function checkReferencesInBatches(references, batchSize = 128) {
  const uniqueReferences = [...references];
  for (let index = 0; index < uniqueReferences.length; index += batchSize) {
    const batch = uniqueReferences.slice(index, index + batchSize);
    const results = await Promise.all(batch.map(async (reference) => {
      const resolved = await resolveStaticReference(reference);
      return resolved && !resolved.exists ? reference : null;
    }));
    for (const missing of results) {
      if (missing) errors.push(`内部リンクまたはアセットの出力がありません: ${missing}`);
    }
  }
}

function stripTags(value) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function getMetaContent(html, name) {
  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    const tag = match[0];
    const metaName = tag.match(/\bname=["']([^"']+)["']/i)?.[1];
    if (metaName?.toLowerCase() !== name.toLowerCase()) continue;
    return tag.match(/\bcontent=["']([^"']*)["']/i)?.[1] ?? "";
  }
  return "";
}

function getCanonicalHref(html) {
  for (const match of html.matchAll(/<link\b[^>]*>/gi)) {
    const tag = match[0];
    const rel = tag.match(/\brel=["']([^"']+)["']/i)?.[1]?.toLowerCase().split(/\s+/) ?? [];
    if (!rel.includes("canonical")) continue;
    return tag.match(/\bhref=["']([^"']+)["']/i)?.[1] ?? "";
  }
  return "";
}

function htmlPathForUrl(pathname) {
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    return null;
  }

  const relativePath = decodedPath.replace(/^\/+/, "");
  const candidates = path.extname(relativePath)
    ? [path.join(outputRoot, relativePath)]
    : [path.join(outputRoot, relativePath, "index.html"), path.join(outputRoot, `${relativePath}.html`)];

  for (const candidate of candidates) {
    const relative = path.relative(outputRoot, candidate);
    if (relative.startsWith("..") || path.isAbsolute(relative)) continue;
    if (outputFilePaths.has(relative.replaceAll("\\", "/"))) return candidate;
  }
  return null;
}

function resolveStaticReference(rawValue) {
  const value = rawValue.replaceAll("&amp;", "&").trim();
  if (!value || value.startsWith("#") || value.startsWith("data:") || value.startsWith("blob:") || value.startsWith("javascript:")) return null;

  let url;
  try {
    url = new URL(value, siteOrigin);
  } catch {
    return null;
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  if (url.origin !== siteOrigin) return null;

  const candidate = htmlPathForUrl(url.pathname);
  if (!candidate) return { value, exists: false };
  return { value, exists: true };
}

try {
  const [sitemapXml, htmlFiles, publicationPolicyJson] = await Promise.all([
    readFile(sitemapPath, "utf8"),
    collectFiles(outputRoot),
    readFile(publicationPolicyPath, "utf8")
  ]);
  reviewModeNoindexRoutePrefixes = JSON.parse(publicationPolicyJson).reviewModeNoindexRoutePrefixes;
  outputFilePaths = new Set(htmlFiles.map((file) => path.relative(outputRoot, file).replaceAll("\\", "/")));
  const sitemapUrls = [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/gi)].map((match) => match[1]);
  if (sitemapUrls.length === 0) errors.push("sitemap.xml にURLがありません。");

  const sitemapPaths = new Set();
  for (const sitemapUrl of sitemapUrls) {
    let url;
    try {
      url = new URL(sitemapUrl);
    } catch {
      errors.push(`不正なサイトマップURL: ${sitemapUrl}`);
      continue;
    }

    const normalizedPath = url.pathname.replace(/\/$/, "") || "/";
    if (sitemapPaths.has(normalizedPath)) errors.push(`サイトマップに重複URLがあります: ${normalizedPath}`);
    sitemapPaths.add(normalizedPath);
    const htmlPath = htmlPathForUrl(url.pathname);
    if (!htmlPath) {
      errors.push(`サイトマップURLの静的HTMLがありません: ${url.pathname}`);
      continue;
    }

    const html = await readFile(htmlPath, "utf8");
    const title = stripTags(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "");
    const h1 = stripTags(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? "");
    const description = getMetaContent(html, "description").trim();
    const robots = `${getMetaContent(html, "robots")} ${getMetaContent(html, "googlebot")}`;
    const canonicalHref = getCanonicalHref(html);

    if (!title) errors.push(`title がありません: ${url.pathname}`);
    if (!h1) errors.push(`H1 がありません: ${url.pathname}`);
    if (!description) errors.push(`description がありません: ${url.pathname}`);
    if (/\bnoindex\b/i.test(robots)) errors.push(`noindexページがサイトマップに含まれています: ${url.pathname}`);
    if (!canonicalHref) {
      errors.push(`canonical がありません: ${url.pathname}`);
    } else {
      const canonical = new URL(canonicalHref, siteOrigin);
      if (canonical.origin !== siteOrigin || canonical.pathname.replace(/\/$/, "") !== normalizedPath.replace(/\/$/, "")) {
        errors.push(`canonical がサイトマップURLと一致しません: ${url.pathname} -> ${canonical.href}`);
      }
    }
  }

  if (isReviewMode) {
    for (const prefix of reviewModeNoindexRoutePrefixes) {
      const normalizedPrefix = prefix.replace(/^\/+|\/+$/g, "");
      const routeHtmlFiles = htmlFiles.filter((file) => {
        const relative = path.relative(outputRoot, file).replaceAll("\\", "/");
        return relative.endsWith(".html") && relative.startsWith(`${normalizedPrefix}/`);
      });
      if (routeHtmlFiles.length === 0) {
        errors.push(`審査モード対象のページが静的出力にありません: ${prefix}`);
        continue;
      }
      for (const htmlFile of routeHtmlFiles) {
        const html = await readFile(htmlFile, "utf8");
        const robots = `${getMetaContent(html, "robots")} ${getMetaContent(html, "googlebot")}`;
        if (!/\bnoindex\b/i.test(robots)) {
          errors.push(`審査モード対象ページにnoindexがありません: ${path.relative(outputRoot, htmlFile)}`);
        }
      }
      const sitemapEntries = [...sitemapPaths].filter((pathname) =>
        pathname === prefix || pathname.startsWith(`${prefix.replace(/\/$/, "")}/`)
      );
      if (sitemapEntries.length) errors.push(`審査モード対象ページがサイトマップに含まれています: ${sitemapEntries.join(", ")}`);
    }
  }

  const roadmapHtmlPath = htmlPathForUrl("/learn/roadmap");
  if (roadmapHtmlPath) {
    const roadmapHtml = await readFile(roadmapHtmlPath, "utf8");
    const roadmapEntries = [...roadmapHtml.matchAll(/data-roadmap-step=["'](\d+)["']/g)].map((match) => Number(match[1]));
    const missingSteps = Array.from({ length: 11 }, (_, index) => index + 1).filter((step) => !roadmapEntries.includes(step));
    if (missingSteps.length) errors.push(`初心者ロードマップの静的HTMLに学習ステップがありません: ${missingSteps.join(", ")}`);
  } else {
    errors.push("初心者ロードマップの静的HTMLがありません。");
  }

  const references = new Set();
  const htmlPages = htmlFiles.filter((file) => file.endsWith(".html"));
  for (let index = 0; index < htmlPages.length; index += 48) {
    const pages = htmlPages.slice(index, index + 48);
    const pageReferences = await Promise.all(pages.map(async (htmlFile) => {
      const html = await readFile(htmlFile, "utf8");
      const pagePath = path.relative(outputRoot, htmlFile).replaceAll("\\", "/");
      // Verification must not depend on an ad-serving script on every route.
      if (getMetaContent(html, "google-adsense-account") !== "ca-pub-7962600450986425") {
        errors.push(`AdSense所有権確認メタタグがありません: ${pagePath}`);
      }
      if (/<script\b[^>]*\bsrc=["'][^"']*\/adsbygoogle\.js\b/i.test(html)) {
        errors.push(`配信停止中の広告スクリプトが出力されています: ${pagePath}`);
      }
      const localReferences = [];
      for (const match of html.matchAll(/\b(?:href|src)=["']([^"']+)["']/gi)) {
        const value = match[1].replaceAll("&amp;", "&").trim();
        if (!value || value.startsWith("#") || value.startsWith("data:") || value.startsWith("blob:") || value.startsWith("javascript:")) continue;
        try {
          const url = new URL(value, siteOrigin);
          if ((url.protocol === "http:" || url.protocol === "https:") && url.origin === siteOrigin) {
            localReferences.push(url.pathname);
          }
        } catch {
          continue;
        }
      }
      return localReferences;
    }));
    for (const pageReferenceList of pageReferences) {
      for (const reference of pageReferenceList) references.add(reference);
    }
  }
  for (const reference of references) checkedReferences.add(reference);
  await checkReferencesInBatches(references);

  const adsTxt = await readFile(path.join(outputRoot, "ads.txt"), "utf8");
  if (!/^google\.com,\s*pub-7962600450986425,\s*DIRECT,\s*f08c47fec0942fa0\s*$/m.test(adsTxt)) {
    errors.push("ads.txt のパブリッシャー情報が一致しません。");
  }

  if (errors.length) {
    console.error(`静的出力チェック失敗 (${errors.length}件)`);
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
  } else {
    console.log(`静的出力チェック成功: サイトマップ${sitemapUrls.length}URL、内部参照${checkedReferences.size}件を確認しました。`);
  }
} catch (error) {
  if (error?.code === "ENOENT") {
    console.error("静的出力が見つかりません。先にCF_PAGES=1で pnpm build を実行してください。");
    process.exitCode = 1;
  } else {
    throw error;
  }
}

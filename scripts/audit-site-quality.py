"""Read-only inventory of exported pages; findings require editorial review."""
import json
import sys
from collections import Counter, defaultdict, deque
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit
from urllib.request import Request, urlopen, build_opener, HTTPRedirectHandler
from urllib.error import HTTPError, URLError
from urllib.robotparser import RobotFileParser
from xml.etree import ElementTree

from importlib.util import module_from_spec, spec_from_file_location

ROOT = Path(__file__).resolve().parent.parent
spec = spec_from_file_location("video_audit", ROOT / "scripts/audit-existing-content.py")
parser = module_from_spec(spec)
spec.loader.exec_module(parser)
OUTPUT = ROOT / "apps/web/out"
ORIGIN = "https://jongfolio.com"
ERROR_ROUTES = {"/404", "/_not-found", "/mleague/404"}
PRIORITY_PATHS = (
    "/analysis/starting-hand/help", "/learn/basic-nanikiru", "/learn/draw-and-discard",
    "/learn/guides/good-shape-rate", "/learn/guides/one-shanten-ukeire",
    "/learn/guides/rule-differences-and-calling", "/learn/guides/wait-types", "/learn/roadmap",
)


class RedirectTrace(HTTPRedirectHandler):
    def __init__(self):
        super().__init__()
        self.redirects = []

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        self.redirects.append({"from": req.full_url, "status": code, "to": newurl})
        return super().redirect_request(req, fp, code, msg, headers, newurl)


def canonical_url(value):
    url = urlsplit(value)
    return url._replace(path=url.path or "/").geturl()


def inventory(output=OUTPUT):
    files = {}
    for file in output.rglob("*.html"):
        relative = file.relative_to(output).as_posix()
        if relative.startswith("_next/"):
            continue
        route = "/" + (relative[:-11] if relative.endswith("/index.html") else relative[:-5])
        route = route.rstrip("/") or "/"
        if route == "/index":
            route = "/"
        if route not in files or file.name == "index.html":
            files[route] = file
    pages = {}
    for route, file in sorted(files.items()):
        tree = parser.Tree(file.read_text(encoding="utf-8"))
        nodes = list(tree.root.walk())
        main = next((n for n in nodes if n.tag == "main"), tree.root)
        body = list(main.walk())
        meta = lambda name: [n.attrs.get("content", "") for n in nodes if n.tag == "meta" and n.attrs.get("name") == name]
        ads = [n.attrs.get("src", "") for n in nodes if n.tag == "script" and "pagead2.googlesyndication.com/pagead/js/adsbygoogle.js" in n.attrs.get("src", "")]
        structured_types, structured_errors = [], []
        for node in nodes:
            if node.tag != "script" or node.attrs.get("type") != "application/ld+json":
                continue
            try:
                data = json.loads("".join(child for child in node.children if isinstance(child, str)))
                items = data if isinstance(data, list) else [data]
                for item in items:
                    if not isinstance(item, dict):
                        structured_errors.append("JSON-LD item is not an object")
                    else:
                        structured_types.append(item.get("@type", "@graph" if "@graph" in item else "unspecified"))
            except (ValueError, TypeError) as error:
                structured_errors.append(str(error))
        pages[route] = {
            "file": file.relative_to(output).as_posix(),
            "title": [n.text() for n in nodes if n.tag == "title"],
            "description": meta("description"),
            "canonical": [n.attrs.get("href", "") for n in nodes if n.tag == "link" and n.attrs.get("rel") == "canonical"],
            "robots": meta("robots") + meta("googlebot"),
            "h1": [n.text() for n in body if n.tag == "h1"],
            "mainCharacters": len("".join(main.text().split())),
            "headings": [n.text() for n in body if n.tag in ("h2", "h3")],
            "ids": sorted({n.attrs["id"] for n in nodes if n.attrs.get("id")}),
            "links": sorted({n.attrs["href"] for n in nodes if n.tag == "a" and n.attrs.get("href")}),
            "adsenseScripts": len(ads),
            "adsenseAccounts": meta("google-adsense-account"),
            "externalScripts": sorted({n.attrs["src"] for n in nodes if n.tag == "script" and urlsplit(n.attrs.get("src", "")).netloc}),
            "imageSources": sorted({n.attrs["src"] for n in body if n.tag == "img" and n.attrs.get("src")}),
            "openGraph": {n.attrs["property"]: n.attrs.get("content", "") for n in nodes if n.tag == "meta" and n.attrs.get("property", "").startswith("og:")},
            "structuredTypes": structured_types,
            "structuredErrors": structured_errors,
            "unfinishedCandidates": [n.text() for n in body if n.tag == "p" and any(word in n.text().lower() for word in ("coming soon", "準備中", "作成中", "後日公開", "ダミーテキスト"))],
        }
    return pages


def analyze(pages, sitemap_paths):
    missing_links, missing_fragments, metadata_errors = [], [], []
    sitemap_errors = []
    for route, page in pages.items():
        if route in ("/404", "/_not-found", "/mleague/404"):
            continue
        for href in page["links"]:
            url = urlsplit(urljoin(ORIGIN + route + "/", href))
            if url.scheme not in ("http", "https") or url.netloc != "jongfolio.com":
                continue
            target = unquote(url.path).rstrip("/") or "/"
            if target not in pages:
                if not (OUTPUT / target.lstrip("/")).is_file():
                    missing_links.append({"route": route, "href": href})
            elif url.fragment and unquote(url.fragment) not in pages[target]["ids"]:
                missing_fragments.append({"route": route, "href": href})
        if not page["title"] or not page["description"] or not page["canonical"]:
            metadata_errors.append({"route": route, "reason": "missing title/description/canonical"})
        elif len(page["canonical"]) != 1 or urlsplit(page["canonical"][0]).netloc != "jongfolio.com" or urlsplit(page["canonical"][0]).path.rstrip("/") != route.rstrip("/"):
            metadata_errors.append({"route": route, "reason": "canonical differs (may be intentional alias)", "canonical": page["canonical"]})
        if page["adsenseScripts"] > 1:
            metadata_errors.append({"route": route, "reason": "duplicate AdSense loader"})
        if len(page.get("adsenseAccounts", [])) > 1:
            metadata_errors.append({"route": route, "reason": "duplicate AdSense verification metadata"})
        if page.get("structuredErrors"):
            metadata_errors.append({"route": route, "reason": "invalid JSON-LD", "errors": page["structuredErrors"]})
    for route in sitemap_paths:
        if route not in pages:
            sitemap_errors.append({"route": route, "reason": "missing export"})
        elif any("noindex" in value for value in pages[route]["robots"]):
            sitemap_errors.append({"route": route, "reason": "noindex in sitemap"})
    duplicates = defaultdict(list)
    for route, page in pages.items():
        duplicates[tuple(page["title"])].append(route)
    return {
        "missingLinks": missing_links,
        "missingFragmentCandidates": missing_fragments,
        "metadataCandidates": metadata_errors,
        "sitemapErrors": sitemap_errors,
        "duplicateTitleCandidates": [routes for routes in duplicates.values() if len(routes) > 1],
    }


def analyze_discovery(pages, sitemap_urls, robots_text):
    """Compare both directions and follow actual HTML links, not JS interactions."""
    listed = set(sitemap_urls)
    indexable = set()
    graph = {route: set() for route in pages if route not in ERROR_ROUTES}
    incoming = defaultdict(set)
    robots = RobotFileParser()
    robots.parse(robots_text.splitlines())
    for route, page in pages.items():
        if route in ERROR_ROUTES:
            continue
        canonical = [canonical_url(value) for value in page["canonical"]]
        if canonical == [ORIGIN + route] and not any("noindex" in value.lower().replace(",", " ").split() for value in page["robots"]):
            indexable.add(route)
        for href in page["links"]:
            url = urlsplit(urljoin(ORIGIN + route, href))
            if url.scheme not in ("http", "https") or url.netloc != "jongfolio.com":
                continue
            target = unquote(url.path).rstrip("/") or "/"
            if target in graph and target != route:
                graph[route].add(target)
                incoming[target].add(route)
    depths = {"/": 0} if "/" in graph else {}
    queue = deque(depths)
    while queue:
        source = queue.popleft()
        for target in sorted(graph[source]):
            if target not in depths:
                depths[target] = depths[source] + 1
                queue.append(target)
    priority = {}
    for route in PRIORITY_PATHS:
        page = pages.get(route)
        priority[route] = None if page is None else {
            "canonical": page["canonical"], "robots": page["robots"],
            "mainCharacters": page["mainCharacters"], "inSitemap": ORIGIN + route in listed,
            "crawlAllowed": robots.can_fetch("Googlebot", ORIGIN + route),
            "depthFromHome": depths.get(route), "incomingPages": sorted(incoming[route]),
        }
    canonical_mismatches = []
    for url in sitemap_urls:
        route = unquote(urlsplit(url).path).rstrip("/") or "/"
        if route in pages and [canonical_url(value) for value in pages[route]["canonical"]] != [canonical_url(url)]:
            canonical_mismatches.append(url)
    return {
        "indexableRoutes": sorted(indexable),
        "missingFromSitemap": sorted(route for route in indexable if ORIGIN + route not in listed),
        "nonCanonicalSitemapUrls": sorted(canonical_mismatches),
        "orphanIndexableRoutes": sorted(route for route in indexable - {"/"} if not incoming[route]),
        "unreachableIndexableRoutes": sorted(indexable - depths.keys()),
        "blockedIndexableRoutes": sorted(route for route in indexable if not robots.can_fetch("Googlebot", ORIGIN + route)),
        "maxIndexableDepth": max((depths[route] for route in indexable if route in depths), default=None),
        "priorityPages": priority,
    }


def main():
    pages = inventory()
    sitemap = ElementTree.parse(OUTPUT / "sitemap.xml")
    sitemap_urls = [n.text for n in sitemap.iter() if n.tag.endswith("}loc") or n.tag == "loc"]
    sitemap_paths = [(urlsplit(url).path.rstrip("/") or "/") for url in sitemap_urls]
    findings = analyze(pages, sitemap_paths)
    discovery = analyze_discovery(pages, sitemap_urls, (OUTPUT / "robots.txt").read_text(encoding="utf-8"))
    summary = {"exportedRoutes": len(pages), "sitemapRoutes": len(sitemap_paths),
               "routeGroups": dict(Counter(route.split("/")[1] or "home" for route in pages)),
               "unfinishedCandidates": sum(bool(p["unfinishedCandidates"]) for p in pages.values()),
               **{key: len(value) for key, value in findings.items()}}
    result = {"summary": summary, "findings": findings, "discovery": discovery, "pages": pages,
              "note": "Counts describe the actual export, not Google index coverage or content quality. Fragment candidates may be client-rendered; verify before editing."}
    target = ROOT / "output/site-quality-inventory.json"
    target.parent.mkdir(exist_ok=True)
    target.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(summary, ensure_ascii=False))
    if "--live" in sys.argv:
        routes = ["/", "/videos/strategy", "/videos/strategy/beginner-win-chance-basics",
                  "/videos/strategy/when-not-to-follow-tile-efficiency",
                  "/videos/strategy/intermediate-tile-efficiency-26-rules",
                  "/mleague/clips/highlights", "/analysis/starting-hand", "/learn/guides",
                  "/analysis/mahjong-tool", "/analysis/orasu-condition", "/tools", "/trainer", "/learn/roadmap",
                  "/about", "/contact", "/privacy", "/terms", "/advertising", "/mleague/policy"]
        routes = list(dict.fromkeys(routes + list(PRIORITY_PATHS) + ["/training"]))
        checks = []
        requests = [(item, "JongfolioQualityAudit/1.0") for route in routes for item in ([route, route + "/"] if route != "/" else [route])]
        requests += [(route, "JongfolioQualityAudit/1.0") for route in ["/robots.txt", "/sitemap.xml", "/ads.txt", "/index.txt", "/learn/guides/index.txt", "/learn/guides.html", "/quality-audit-missing-page-20261026/"]]
        requests += [("/", agent) for agent in ["Mediapartners-Google", "Google-Display-Ads-Bot", "Googlebot"]]
        # Use the production sitemap, not preview URLs, for the additional live checks.
        try:
            with urlopen(Request(ORIGIN + "/sitemap.xml", headers={"User-Agent": "JongfolioQualityAudit/1.0"}), timeout=25) as response:
                live_sitemap = ElementTree.fromstring(response.read())
            known = {route for route, _ in requests}
            for node in live_sitemap.iter():
                if not (node.tag.endswith("}loc") or node.tag == "loc"):
                    continue
                url = urlsplit(node.text)
                if url.netloc == "jongfolio.com" and url.path not in known:
                    requests.append((url.path or "/", "JongfolioQualityAudit/1.0"))
                    known.add(url.path)
        except (HTTPError, URLError, TimeoutError, ElementTree.ParseError) as error:
            checks.append({"route": "/sitemap.xml", "status": None, "unconfirmed": str(error)})
        for route, agent in requests:
            trace = RedirectTrace()
            try:
                with build_opener(trace).open(Request(ORIGIN + route, headers={"User-Agent": agent}), timeout=25) as response:
                    raw = response.read().decode("utf-8")
                    nodes = list(parser.Tree(raw).root.walk()) if "text/html" in response.headers.get("Content-Type", "") else []
                    checks.append({"route": route, "status": response.status, "finalUrl": response.url,
                                   "redirects": trace.redirects,
                                   "userAgent": agent, "userAgentProbeOnly": agent != "JongfolioQualityAudit/1.0",
                                   "contentType": response.headers.get("Content-Type"),
                                   "xRobotsTag": response.headers.get("X-Robots-Tag"),
                                   "setsCookie": bool(response.headers.get("Set-Cookie")),
                                   "title": [n.text() for n in nodes if n.tag == "title"],
                                   "h1": [n.text() for n in nodes if n.tag == "h1"],
                                   "mainCharacters": next((len("".join(n.text().split())) for n in nodes if n.tag == "main"), None),
                                   "canonical": [n.attrs.get("href") for n in nodes if n.tag == "link" and n.attrs.get("rel") == "canonical"],
                                   "robots": [n.attrs.get("content") for n in nodes if n.tag == "meta" and n.attrs.get("name") == "robots"],
                                   "description": [n.attrs.get("content") for n in nodes if n.tag == "meta" and n.attrs.get("name") == "description"],
                                   "adsenseAccounts": [n.attrs.get("content") for n in nodes if n.tag == "meta" and n.attrs.get("name") == "google-adsense-account"],
                                   "externalScripts": sorted({n.attrs["src"] for n in nodes if n.tag == "script" and urlsplit(n.attrs.get("src", "")).netloc}),
                                   "guideCards": sum(n.tag == "h2" and n.attrs.get("id", "").startswith("guide-title-") for n in nodes),
                                   "empty26Heading": "動画の章順で確認する26のセオリー" in raw,
                                   "sitemapUrls": [n.text for n in ElementTree.fromstring(raw).iter() if n.tag.endswith("}loc") or n.tag == "loc"] if route == "/sitemap.xml" else None,
                                   "robotsText": raw if route == "/robots.txt" else None,
                                   "adsText": raw if route == "/ads.txt" else None})
            except HTTPError as error:
                checks.append({"route": route, "status": error.code, "finalUrl": error.url, "redirects": trace.redirects})
            except (URLError, TimeoutError) as error:
                checks.append({"route": route, "status": None, "unconfirmed": str(error)})
        (ROOT / "output/site-quality-live.json").write_text(json.dumps(checks, ensure_ascii=False, indent=2), encoding="utf-8")
        print(json.dumps({"liveRequests": len(checks), "statuses": dict(Counter(str(c["status"]) for c in checks)), "unconfirmed": [c for c in checks if c["status"] is None]}, ensure_ascii=False))


if __name__ == "__main__":
    main()

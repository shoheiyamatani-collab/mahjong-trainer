"""Check existing practical article export boundaries; never approves publication.

Generate output/practical-article-stage2.json with PRACTICAL_ARTICLE_AUDIT_REPORT=true
pnpm exec vitest run apps/web/app/learn/guides/practicalArticles/stage2Validation.test.ts.
Run after a completed build: python scripts/audit-practical-export.py --mode preview|normal.
"""
import argparse
import json
from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path
from urllib.parse import urlsplit
from xml.etree import ElementTree

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / "apps/web/out"
spec = spec_from_file_location("content_audit", ROOT / "scripts/audit-existing-content.py")
parser = module_from_spec(spec)
spec.loader.exec_module(parser)


def inspect_article(article, mode, sitemap):
    route = "/learn/guides/" + article["slug"]
    file = OUTPUT / route.lstrip("/") / "index.html"
    expected = mode == "preview" or bool(article["publishedAt"])
    errors = []
    if file.exists() != expected or (route in sitemap) != expected:
        errors.append(f"{route}: route or sitemap differs from publication gate")
    if not expected and (OUTPUT / f"{route.lstrip('/')}.html").exists():
        errors.append(f"{route}: flat export of unapproved article")
    if not expected or not file.exists():
        return {"route": route, "expected": expected, "errors": errors}
    nodes = list(parser.Tree(file.read_text(encoding="utf-8")).root.walk())
    h1 = [node.text() for node in nodes if node.tag == "h1"]
    canonical = [node.attrs.get("href") for node in nodes if node.tag == "link" and node.attrs.get("rel") == "canonical"]
    descriptions = [node.attrs.get("content") for node in nodes if node.tag == "meta" and node.attrs.get("name") == "description"]
    robots = [node.attrs.get("content", "") for node in nodes if node.tag == "meta" and node.attrs.get("name") == "robots"]
    cases = sum(node.tag == "section" and node.attrs.get("id", "").startswith("case-") for node in nodes)
    hands = sum(node.tag == "div" and "handScroll" in node.attrs.get("class", "") for node in nodes)
    if h1 != [article["title"]] or canonical != ["https://jongfolio.com" + route]:
        errors.append(f"{route}: H1 or canonical mismatch")
    if len(descriptions) != 1 or not descriptions[0] or any("noindex" in value for value in robots):
        errors.append(f"{route}: description or existing learning index policy mismatch")
    if cases != article["caseCount"]:
        errors.append(f"{route}: expected {article['caseCount']} initial-HTML cases, found {cases}")
    structured = []
    for node in nodes:
        if node.tag == "script" and node.attrs.get("type") == "application/ld+json":
            data = json.loads("".join(child for child in node.children if isinstance(child, str)))
            structured.extend(data if isinstance(data, list) else [data])
    article_data = [item for item in structured if item.get("@type") == "Article"]
    if len(article_data) != 1 or article_data[0].get("datePublished") != article["publishedAt"]:
        errors.append(f"{route}: Article publication date differs from approval")
    for node in nodes:
        if node.tag == "img" and node.attrs.get("src", "").startswith("/tiles/"):
            if not (OUTPUT / node.attrs["src"].lstrip("/")).is_file():
                errors.append(f"{route}: missing tile {node.attrs['src']}")
    return {"route": route, "expected": expected, "cases": cases, "hands": hands, "errors": errors}


def main():
    args = argparse.ArgumentParser()
    args.add_argument("--mode", choices=("preview", "normal"), required=True)
    mode = args.parse_args().mode
    catalog = json.loads((ROOT / "output/practical-article-stage2.json").read_text(encoding="utf-8"))
    sitemap = {urlsplit(node.text).path.rstrip("/") for node in ElementTree.parse(OUTPUT / "sitemap.xml").iter() if node.tag.endswith("}loc")}
    results = [inspect_article(article, mode, sitemap) for article in catalog]
    errors = [error for item in results for error in item["errors"]]
    forbidden = {item["route"] for item in results if not item["expected"]}
    if forbidden:
        for file in OUTPUT.rglob("*.html"):
            for node in parser.Tree(file.read_text(encoding="utf-8")).root.walk():
                target = urlsplit(node.attrs.get("href", ""))
                if node.tag == "a" and target.netloc in ("", "jongfolio.com") and target.path.rstrip("/") in forbidden:
                    errors.append(f"{file.relative_to(OUTPUT)}: link to unapproved article")
    summary = {"mode": mode, "articles": len(results), "included": sum(item["expected"] for item in results), "cases": sum(item.get("cases", 0) for item in results), "hands": sum(item.get("hands", 0) for item in results), "errors": errors}
    (ROOT / f"output/practical-export-{mode}.json").write_text(json.dumps({"summary": summary, "articles": results}, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(summary, ensure_ascii=False))
    if errors:
        raise SystemExit(1)


if __name__ == "__main__":
    main()

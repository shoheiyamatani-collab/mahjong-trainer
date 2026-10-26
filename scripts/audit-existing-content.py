"""Inspect exported HTML; never changes publication or index decisions.

First run CONTENT_AUDIT_REPORT=true pnpm exec vitest run scripts/content-quality.test.ts.
"""
import json
import sys
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


class Node:
    def __init__(self, tag="root", attrs=()):
        self.tag, self.attrs, self.children = tag, dict(attrs), []
        self.parent = None

    def walk(self):
        yield self
        for child in self.children:
            if isinstance(child, Node):
                yield from child.walk()

    def text(self, exclude=False):
        classes = self.attrs.get("class", "").split()
        if self.tag in ("script", "style", "nav", "header") or (exclude and (
            "videoArticleBook" in classes or "data-video-practice" in self.attrs
        )):
            return ""
        return " ".join(child.text(exclude) if isinstance(child, Node) else child for child in self.children).strip()


class Tree(HTMLParser):
    VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}

    def __init__(self, html):
        super().__init__(convert_charrefs=True)
        self.root = Node()
        self.stack = [self.root]
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        node = Node(tag, attrs)
        node.parent = self.stack[-1]
        self.stack[-1].children.append(node)
        if tag not in self.VOID:
            self.stack.append(node)

    def handle_endtag(self, tag):
        for index in range(len(self.stack) - 1, 0, -1):
            if self.stack[index].tag == tag:
                del self.stack[index:]
                break

    def handle_data(self, data):
        self.stack[-1].children.append(data)


def inspect(guide):
    route = guide["articleHref"]
    file = ROOT / "apps/web/out" / route.lstrip("/") / "index.html"
    tree = Tree(file.read_text(encoding="utf-8"))
    nodes = list(tree.root.walk())
    article = next(node for node in nodes if node.tag == "article")
    body = list(article.walk())
    paragraphs = [node.text() for node in body if node.tag == "p" and len(node.text()) >= 35]
    core = article.text(exclude=True)
    # Flag a heading only if its containing section has no text beyond labels/headings.
    empty = []
    for heading in body:
        if heading.tag == "h3" and "videoPrincipleBody" in heading.parent.attrs.get("class", ""):
            siblings = [child for child in heading.parent.children if isinstance(child, Node) and child is not heading]
            if not any(child.text() for child in siblings):
                empty.append(heading.text())
    for section in body:
        if section.tag != "section":
            continue
        headings = [node.text() for node in section.children if isinstance(node, Node) and node.tag in ("h2", "h3")]
        payload = [node for node in section.children if isinstance(node, Node) and node.tag not in ("h2", "h3")]
        meaningful = [node for node in payload if node.tag != "p" or "videoArticleSectionLabel" not in node.attrs.get("class", "")]
        if headings and not any(node.text() or any(c.tag in ("img", "iframe", "a") for c in node.walk()) for node in meaningful):
            empty.extend(headings)
    return {
        "route": route, "title": guide["title"], "youtubeId": guide["youtubeId"],
        "coreCharacters": len("".join(core.split())), "coreText": core,
        "headings": [node.text() for node in body if node.tag in ("h2", "h3")],
        "paragraphs": paragraphs, "emptyHeadings": empty,
        "tileImages": sum(node.tag == "img" and "/tiles/" in node.attrs.get("src", "") for node in body),
        "internalLinks": sorted(set(node.attrs["href"] for node in body if node.tag == "a" and node.attrs.get("href", "").startswith("/"))),
        "practiceGateway": any("data-video-practice" in node.attrs for node in body),
        "robots": [node.attrs.get("content") for node in nodes if node.tag == "meta" and node.attrs.get("name") == "robots"],
        "canonical": [node.attrs.get("href") for node in nodes if node.tag == "link" and node.attrs.get("rel") == "canonical"],
        "iframe": [node.attrs for node in body if node.tag == "iframe"],
        "readingTime": guide["readingTime"],
        "readingTimePresent": guide["readingTime"] in file.read_text(encoding="utf-8")
    }


def main():
    inventory = json.loads((ROOT / "output/content-audit-input.json").read_text(encoding="utf-8"))
    articles = [inspect(guide) for guide in inventory["guides"]]
    counts = Counter(paragraph for article in articles for paragraph in set(article["paragraphs"]))
    for article in articles:
        article["repeatedParagraphs"] = [{"count": counts[p], "text": p} for p in article["paragraphs"] if counts[p] >= 4]
    result = {"articles": articles, "note": "Metrics are audit aids, not automatic A/B/C or noindex decisions."}
    target = ROOT / "output/existing-video-audit.json"
    target.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    errors = []
    for article in articles:
        route = article["route"]
        if article["emptyHeadings"] or not article["practiceGateway"] or not article["readingTimePresent"]:
            errors.append(f"{route}: missing content, reading time or practice links")
        if [url.rstrip("/") for url in article["canonical"]] != [f"https://jongfolio.com{route}"]:
            errors.append(f"{route}: unexpected canonical")
        if not article["robots"] or not all({"noindex", "follow"}.issubset({part.strip().lower() for part in robots.split(",")}) for robots in article["robots"]):
            errors.append(f"{route}: existing video noindex policy changed")
        if len(article["iframe"]) != 1:
            errors.append(f"{route}: expected one video iframe")
        for frame in article["iframe"]:
            if (frame.get("src") != f"https://www.youtube-nocookie.com/embed/{article['youtubeId']}"
                    or not frame.get("title") or frame.get("loading") != "lazy" or "allowfullscreen" not in frame):
                errors.append(f"{route}: invalid video embed")
    print(json.dumps({"articles": len(articles), "emptyHeadings": sum(len(a["emptyHeadings"]) for a in articles),
                      "practiceGateways": sum(a["practiceGateway"] for a in articles),
                      "missingReadingTimes": [a["route"] for a in articles if not a["readingTimePresent"]],
                      "errors": errors}, ensure_ascii=False))
    if "--check" in sys.argv and errors:
        raise SystemExit(1)


if __name__ == "__main__":
    main()

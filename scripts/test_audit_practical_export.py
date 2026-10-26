import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location("practical_export", Path(__file__).with_name("audit-practical-export.py"))
audit = importlib.util.module_from_spec(spec)
spec.loader.exec_module(audit)


class PracticalExportTests(unittest.TestCase):
    article = {"slug": "test-article", "title": "Test article", "publishedAt": None, "caseCount": 1}
    route = "/learn/guides/test-article"

    def html(self, published=None):
        data = {"@type": "Article"}
        if published:
            data["datePublished"] = published
        return ('<title>Test article</title><meta name="description" content="Description">'
                '<link rel="canonical" href="https://jongfolio.com/learn/guides/test-article">'
                f'<script type="application/ld+json">{json.dumps(data)}</script>'
                '<main><h1>Test article</h1><section id="case-test">Example</section>'
                '<div class="studyCases_handScroll_test">Hand</div></main>')

    def inspect(self, mode, html=None, sitemap=None, flat=False):
        with tempfile.TemporaryDirectory() as folder, patch.object(audit, "OUTPUT", Path(folder)):
            if html is not None:
                file = Path(folder) / ("learn/guides/test-article.html" if flat else "learn/guides/test-article/index.html")
                file.parent.mkdir(parents=True)
                file.write_text(html, encoding="utf-8")
            return audit.inspect_article(self.article, mode, set(sitemap or []))

    def test_preview_requires_initial_html_cases_and_metadata(self):
        result = self.inspect("preview", self.html(), [self.route])
        self.assertEqual(result["errors"], [])
        self.assertEqual((result["cases"], result["hands"]), (1, 1))

    def test_normal_build_excludes_unapproved_route(self):
        self.assertEqual(self.inspect("normal")["errors"], [])
        self.assertTrue(self.inspect("normal", self.html())["errors"])

    def test_normal_build_detects_flat_export_and_sitemap_leaks(self):
        self.assertTrue(self.inspect("normal", self.html(), flat=True)["errors"])
        self.assertTrue(self.inspect("normal", sitemap=[self.route])["errors"])

    def test_does_not_accept_an_unapproved_publication_date(self):
        errors = self.inspect("preview", self.html("2026-10-26"), [self.route])["errors"]
        self.assertTrue(any("publication date" in error for error in errors))

    def test_detects_missing_case_or_wrong_canonical(self):
        html = self.html().replace('id="case-test"', 'id="wrong"').replace('href="https://jongfolio.com/learn/guides/test-article"', 'href="https://jongfolio.com/"')
        errors = self.inspect("preview", html, [self.route])["errors"]
        self.assertEqual(len(errors), 2)


if __name__ == "__main__":
    unittest.main()

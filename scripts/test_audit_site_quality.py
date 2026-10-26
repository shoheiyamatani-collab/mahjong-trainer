import importlib.util
from pathlib import Path
import tempfile
import unittest

spec = importlib.util.spec_from_file_location("site_quality", Path(__file__).with_name("audit-site-quality.py"))
audit = importlib.util.module_from_spec(spec)
spec.loader.exec_module(audit)


def page(route="/", **values):
    return {"title": [route], "description": ["Description"], "canonical": [audit.ORIGIN + route],
            "robots": ["index, follow"], "ids": [], "links": [], "adsenseScripts": 1, **values}


class SiteQualityAuditTests(unittest.TestCase):
    def test_deduplicates_flat_and_directory_exports(self):
        with tempfile.TemporaryDirectory() as folder:
            output = Path(folder)
            (output / "demo").mkdir()
            html = '<title>Demo</title><main><h1>Demo</h1><p>Body</p></main>'
            (output / "demo.html").write_text(html, encoding="utf-8")
            (output / "demo/index.html").write_text(html, encoding="utf-8")
            result = audit.inventory(output)
            self.assertEqual(list(result), ["/demo"])
            self.assertEqual(result["/demo"]["file"], "demo/index.html")

    def test_reports_real_missing_links_but_ignores_external_links(self):
        findings = audit.analyze({"/": page(links=["/missing-quality-test/", "https://example.com/missing"])}, ["/"])
        self.assertEqual(findings["missingLinks"], [{"route": "/", "href": "/missing-quality-test/"}])

    def test_anchor_absence_is_a_candidate_not_a_route_error(self):
        findings = audit.analyze({"/": page(links=["/target#client-only"]), "/target": page("/target")}, ["/"])
        self.assertEqual(findings["missingLinks"], [])
        self.assertEqual(len(findings["missingFragmentCandidates"]), 1)

    def test_accepts_existing_encoded_anchor(self):
        findings = audit.analyze({"/": page(links=["/#%E4%BE%8B"], ids=["例"])}, ["/"])
        self.assertEqual(findings["missingFragmentCandidates"], [])

    def test_noindex_cannot_enter_sitemap(self):
        findings = audit.analyze({"/": page(robots=["noindex, follow"])}, ["/"])
        self.assertEqual(findings["sitemapErrors"], [{"route": "/", "reason": "noindex in sitemap"}])

    def test_reports_alias_canonical_without_misclassifying_it_as_broken_link(self):
        findings = audit.analyze({"/training": page("/training", canonical=[audit.ORIGIN + "/trainer"])}, [])
        self.assertEqual(len(findings["metadataCandidates"]), 1)
        self.assertEqual(findings["missingLinks"], [])

    def test_duplicate_adsense_loader_is_reported(self):
        findings = audit.analyze({"/": page(adsenseScripts=2)}, ["/"])
        self.assertEqual(findings["metadataCandidates"][0]["reason"], "duplicate AdSense loader")

    def test_error_page_is_not_treated_as_unfinished_content(self):
        self.assertEqual(audit.analyze({"/mleague/404": page(canonical=[])}, [])["metadataCandidates"], [])

    def test_duplicate_verification_meta_is_reported(self):
        findings = audit.analyze({"/": page(adsenseAccounts=["ca-pub-test", "ca-pub-test"])}, ["/"])
        self.assertEqual(findings["metadataCandidates"][0]["reason"], "duplicate AdSense verification metadata")

    def test_invalid_jsonld_is_reported(self):
        findings = audit.analyze({"/": page(structuredErrors=["invalid JSON"])}, ["/"])
        self.assertEqual(findings["metadataCandidates"][0]["reason"], "invalid JSON-LD")

    def test_reads_structured_data_and_ogp_without_treating_scripts_as_body(self):
        with tempfile.TemporaryDirectory() as folder:
            output = Path(folder)
            (output / "index.html").write_text('<title>Home</title><meta property="og:title" content="Home"><script type="application/ld+json">[{"@type":"WebSite"}]</script><main><h1>Home</h1></main>', encoding="utf-8")
            result = audit.inventory(output)["/"]
            self.assertEqual(result["structuredTypes"], ["WebSite"])
            self.assertEqual(result["structuredErrors"], [])
            self.assertEqual(result["openGraph"]["og:title"], "Home")


if __name__ == "__main__":
    unittest.main()

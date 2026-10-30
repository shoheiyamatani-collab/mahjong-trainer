import importlib.util
from pathlib import Path
import tempfile
import unittest

spec = importlib.util.spec_from_file_location("site_quality", Path(__file__).with_name("audit-site-quality.py"))
audit = importlib.util.module_from_spec(spec)
spec.loader.exec_module(audit)


def page(route="/", **values):
    return {"title": [route], "description": ["Description"], "canonical": [audit.ORIGIN + route],
            "robots": ["index, follow"], "ids": [], "links": [], "adsenseScripts": 1, "mainCharacters": 100, **values}


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

    def discovery(self, pages, sitemap=None, robots="User-agent: *\nAllow: /"):
        return audit.analyze_discovery(pages, sitemap or [], robots)

    def test_reverse_coverage_finds_an_exported_but_unlisted_article(self):
        result = self.discovery({"/": page(links=["/new"]), "/new": page("/new")}, [audit.ORIGIN + "/"])
        self.assertEqual(result["missingFromSitemap"], ["/new"])

    def test_detects_orphans_separately_from_sitemap_presence(self):
        result = self.discovery({"/": page(), "/new": page("/new")}, [audit.ORIGIN + "/new"])
        self.assertEqual(result["orphanIndexableRoutes"], ["/new"])
        self.assertEqual(result["unreachableIndexableRoutes"], ["/new"])

    def test_link_graph_ignores_external_and_self_links_but_follows_query_links(self):
        result = self.discovery({"/": page(links=["/#top", "https://example.com/new", "/new/?sample=1"]), "/new": page("/new")})
        self.assertEqual(result["orphanIndexableRoutes"], [])
        self.assertEqual(result["maxIndexableDepth"], 1)

    def test_noindex_and_aliases_are_not_missing_sitemap_entries(self):
        result = self.discovery({"/404": page("/404"), "/training": page("/training", canonical=[audit.ORIGIN + "/trainer"]), "/mleague": page("/mleague", robots=["NOINDEX, follow"])})
        self.assertEqual(result["missingFromSitemap"], [])

    def test_a_second_noindex_directive_takes_precedence(self):
        result = self.discovery({"/": page(robots=["index, follow", "noindex"])})
        self.assertEqual(result["indexableRoutes"], [])

    def test_robots_block_is_not_mistaken_for_an_indexing_delay(self):
        result = self.discovery({"/new": page("/new")}, robots="User-agent: *\nDisallow: /new")
        self.assertEqual(result["blockedIndexableRoutes"], ["/new"])

    def test_canonical_and_sitemap_must_agree_while_empty_root_path_equals_slash(self):
        result = self.discovery({"/": page(), "/new": page("/new")}, [audit.ORIGIN, audit.ORIGIN + "/new/"])
        self.assertEqual(result["nonCanonicalSitemapUrls"], [audit.ORIGIN + "/new/"])
        self.assertEqual(self.discovery({"/": page(canonical=[audit.ORIGIN])}, [audit.ORIGIN + "/"])["missingFromSitemap"], [])

    def test_priority_page_contains_initial_html_and_incoming_link_evidence(self):
        route = audit.PRIORITY_PATHS[0]
        result = self.discovery({"/": page(links=[route]), route: page(route)}, [audit.ORIGIN + route])
        self.assertEqual(result["priorityPages"][route]["incomingPages"], ["/"])
        self.assertEqual(result["priorityPages"][route]["depthFromHome"], 1)
        self.assertTrue(result["priorityPages"][route]["crawlAllowed"])
        self.assertTrue(result["priorityPages"][route]["inSitemap"])

    def test_googlebot_specific_noindex_is_collected(self):
        with tempfile.TemporaryDirectory() as folder:
            output = Path(folder)
            (output / "index.html").write_text('<meta name="robots" content="index"><meta name="googlebot" content="noindex">', encoding="utf-8")
            self.assertEqual(audit.inventory(output)["/"]["robots"], ["index", "noindex"])


if __name__ == "__main__":
    unittest.main()

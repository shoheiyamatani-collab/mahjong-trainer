import assert from "node:assert/strict";
import { test } from "node:test";
import { sitemapCoverageErrors } from "./static-sitemap-checks.mjs";

const origin = "https://jongfolio.com";
const page = (route, values = {}) => ({ route, canonical: origin + route, noindex: false, ...values });

test("detects a newly exported article missing from the sitemap", () => {
  assert.deepEqual(sitemapCoverageErrors([page("/learn/new")], [], origin), [
    `検索対象の静的HTMLがサイトマップにありません: ${origin}/learn/new`
  ]);
});
test("does not demand noindex pages, error pages or canonical aliases", () => {
  assert.deepEqual(sitemapCoverageErrors([
    page("/mleague", { noindex: true }), page("/404"),
    page("/training", { canonical: origin + "/trainer" })
  ], [], origin), []);
});
test("deduplicates flat and directory HTML copies", () => {
  assert.equal(sitemapCoverageErrors([page("/learn/new"), page("/learn/new")], [], origin).length, 1);
});
test("uses exact canonical URLs including slash normalization", () => {
  assert.equal(sitemapCoverageErrors([page("/learn/new")], [origin + "/learn/new/"], origin).length, 1);
  assert.deepEqual(sitemapCoverageErrors([page("/learn/new"), page("/")], [origin + "/learn/new", origin + "/"], origin), []);
});
test("does not make an invalid or external canonical an implicit index target", () => {
  assert.deepEqual(sitemapCoverageErrors([page("/demo", { canonical: "invalid" }), page("/other", { canonical: "https://example.com/other" })], [], origin), []);
});

import assert from "node:assert/strict";
import test from "node:test";
import { migrationRedirects, standaloneOrigin } from "./mleague-publication.mjs";

test("standalone URL must be a Pages HTTPS origin with no path", () => {
  assert.equal(standaloneOrigin(""), null);
  assert.equal(standaloneOrigin("https://jongfolio-mleague.pages.dev/"), "https://jongfolio-mleague.pages.dev");
  for (const url of ["http://example.pages.dev", "https://jongfolio.com", "https://example.pages.dev/mleague", "https://example.pages.dev/?x=1"]) {
    assert.throws(() => standaloneOrigin(url));
  }
});

test("legacy profile URLs keep their paths and the clips landing has an explicit replacement", () => {
  const rules = migrationRedirects("https://example.pages.dev").split("\n");
  assert.deepEqual(rules, [
    "/mleague https://example.pages.dev/mleague/ 301",
    "/mleague/* https://example.pages.dev/mleague/:splat 301",
    "/videos/mleague-clips https://example.pages.dev/mleague/clips/ 301",
    "/videos/mleague-clips/ https://example.pages.dev/mleague/clips/ 301",
  ]);
});

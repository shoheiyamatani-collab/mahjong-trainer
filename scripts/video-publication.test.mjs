import assert from "node:assert/strict";
import test from "node:test";
import { collectPrimarySiteLinks, primarySiteRedirects, videoMigrationRedirects, videoStandaloneOrigin } from "./video-publication.mjs";

test("standalone URL must be a HTTPS Pages origin", () => {
  assert.equal(videoStandaloneOrigin(""), null);
  assert.equal(videoStandaloneOrigin("https://jongfolio-videos.pages.dev/"), "https://jongfolio-videos.pages.dev");
  for (const url of ["http://example.pages.dev", "https://jongfolio.com", "https://example.pages.dev/videos", "https://example.pages.dev/?x=1"]) {
    assert.throws(() => videoStandaloneOrigin(url));
  }
});

test("old video routes keep their path and redirect to the dedicated origin", () => {
  assert.deepEqual(videoMigrationRedirects("https://jongfolio-videos.pages.dev").split("\n"), [
    "/videos/strategy https://jongfolio-videos.pages.dev/videos/strategy 301",
    "/videos/strategy/ https://jongfolio-videos.pages.dev/videos/strategy 301",
    "/videos/strategy/* https://jongfolio-videos.pages.dev/videos/strategy/:splat 301"
  ]);
});

test("standalone video links stay local while tool and learning links return to the main site", () => {
  const html = `<a href="/videos/strategy">Videos</a><a href="/videos/strategy/a">Article</a><a href="/trainer/push-or-fold">Training</a><a href="/learn/guides?from=video">Learn</a><img src="/tiles/man1.png">`;
  const paths = collectPrimarySiteLinks(html, "https://jongfolio-videos.pages.dev");
  assert.deepEqual(paths, ["/learn/guides", "/trainer/push-or-fold"]);
  assert.equal(primarySiteRedirects(paths, "https://jongfolio.com"), [
    "/learn/guides https://jongfolio.com/learn/guides 302",
    "/learn/guides/ https://jongfolio.com/learn/guides/ 302",
    "/trainer/push-or-fold https://jongfolio.com/trainer/push-or-fold 302",
    "/trainer/push-or-fold/ https://jongfolio.com/trainer/push-or-fold/ 302"
  ].join("\n"));
});

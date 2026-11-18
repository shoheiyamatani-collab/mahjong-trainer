import { describe, expect, it } from "vitest";
import { canonicalRouteRedirects } from "./static-publication.mjs";

describe("canonicalRouteRedirects", () => {
  it("redirects the non-canonical slash form to each sitemap route", () => {
    expect(canonicalRouteRedirects([
      "https://jongfolio.com/",
      "https://jongfolio.com/about",
      "https://jongfolio.com/learn/guides/",
      "https://jongfolio.com/learn/guides/first"
    ], "https://jongfolio.com")).toBe([
      "/about/ /about 301",
      "/learn/guides /learn/guides/ 301",
      "/learn/guides/first/ /learn/guides/first 301"
    ].join("\n"));
  });

  it("rejects cross-origin, query, and conflicting canonical URLs", () => {
    expect(() => canonicalRouteRedirects(["https://elsewhere.example/about"], "https://jongfolio.com")).toThrow();
    expect(() => canonicalRouteRedirects(["https://jongfolio.com/about?from=home"], "https://jongfolio.com")).toThrow();
    expect(() => canonicalRouteRedirects([
      "https://jongfolio.com/about",
      "https://jongfolio.com/about/"
    ], "https://jongfolio.com")).toThrow("Conflicting canonical routes");
  });
});

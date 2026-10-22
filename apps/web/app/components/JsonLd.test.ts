import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { JsonLd } from "./JsonLd";
import { JsonLd as MLeagueJsonLd } from "../../../mleague/components/JsonLd";

describe.each([
  { name: "learning site", Component: JsonLd },
  { name: "M League site", Component: MLeagueJsonLd }
])("$name structured data security", ({ Component }) => {
  it("escapes script-breaking content without changing the structured data", () => {
    const data = { "@type": "Article", name: '</script><script>alert("example")</script>', description: '<img src=x onerror="alert(1)">' };
    const html = renderToStaticMarkup(createElement(Component, { data }));
    expect(html.match(/<script\b/g)).toHaveLength(1);
    expect(html.match(/<\/script>/g)).toHaveLength(1);
    expect(html).not.toContain("<img");
    const content = html.match(/<script[^>]*>(.*)<\/script>/)![1];
    expect(JSON.parse(content)).toEqual(data);
    expect(content).toContain("\\u003c");
  });
});

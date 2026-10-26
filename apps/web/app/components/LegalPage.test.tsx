import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LegalPage } from "./LegalPage";
import { legalConfig } from "../legalConfig";
import PrivacyPage from "../privacy/page";

describe("legal policy dates and storage transparency", () => {
  it("keeps existing dates unless a page explicitly provides its own update date", () => {
    const common = { title: "Policy", eyebrow: "Policy", description: "Description", showDates: true, children: <p>Body</p> };
    expect(renderToStaticMarkup(<LegalPage {...common} />)).toContain(legalConfig.lastUpdatedDate);
    const updated = renderToStaticMarkup(<LegalPage {...common} updatedDate="2026年10月26日" />);
    expect(updated).toContain("2026年10月26日");
    expect(updated).toContain(legalConfig.establishedDate);
    expect(updated).not.toContain(legalConfig.lastUpdatedDate);
  });

  it("distinguishes local-only records and verification from active ad serving", () => {
    const html = renderToStaticMarkup(<PrivacyPage />);
    expect(html).toContain("localStorage");
    expect(html).toContain("サーバーへ自動送信する機能はありません");
    expect(html).toContain("AdSenseの広告は表示していません");
    expect(html).toContain("Cloudflare Web Analytics");
    expect(html).toContain("https://developers.cloudflare.com/web-analytics/data-metrics/data-origin-and-collection/");
    expect(html).toContain("2026年10月26日");
    expect(html).not.toContain("adsbygoogle");
  });
});

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LegalPage } from "./LegalPage";
import { legalConfig } from "../legalConfig";
import AboutPage from "../about/page";
import AdvertisingPage from "../advertising/page";
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
    expect(html).toContain("2026年11月20日");
    expect(html).toContain("移動先の利用条件とプライバシーポリシー");
    expect(html).not.toContain("adsbygoogle");
  });

  it("describes the main site's advertising without promoting migrated content", () => {
    const html = renderToStaticMarkup(<AdvertisingPage />);
    expect(html).toContain("AdSenseの広告は表示していません");
    expect(html).toContain("Amazonのアソシエイトとして、雀フォリオは適格販売により収入を得ています。");
    expect(html).toContain("リンクの近くに広告であることを明示");
    expect(html).toContain('href="/privacy"');
    expect(html).not.toMatch(/<h2>(?:書籍紹介について|YouTube動画とアフィリエイト)<\/h2>/);
  });

  it("distinguishes source attribution from the services on separate sites", () => {
    const html = renderToStaticMarkup(<AboutPage />);
    expect(html).toContain("雀フォリオ運営");
    expect(html).toContain("公式情報や外部資料を参照する際");
    expect(html).toContain("Mリーグ情報とYouTube動画の紹介は、雀フォリオ本体とは別のサイトで提供しています");
  });
});

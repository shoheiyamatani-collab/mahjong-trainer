import type { Metadata, Viewport } from "next";
import { getRobotsPolicy } from "@mahjong-trainer/content-index-policy";
import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { siteConfig } from "@/config/site";
import "./globals.css";
import "../../../shared/ui/design-tokens.css";
import "./platform.css";
import { PlatformFrame } from "../../web/app/components/SiteNavigation";

const description =
  "Mリーグの対局情報、チーム成績、所属選手のプロフィール、公式情報へのリンクを確認できる雀フォリオ内の非公式情報ページです。";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteOrigin),
  title: {
    default: siteConfig.name,
    template: `%s｜${siteConfig.name}`,
  },
  description,
  applicationName: "雀フォリオ",
  authors: [{ name: "雀フォリオ", url: siteConfig.parentUrl }],
  creator: "雀フォリオ",
  publisher: "雀フォリオ",
  robots: getRobotsPolicy("/mleague"),
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description,
    url: siteConfig.homeUrl,
    images: [{ url: `${siteConfig.basePath}/og.png`, width: 1200, height: 630, alt: "雀フォリオ Mリーグ" }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description,
    images: [`${siteConfig.basePath}/og.png`],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${siteConfig.parentUrl}/#organization`,
      name: siteConfig.parentName,
      alternateName: "JONGFOLIO",
      url: siteConfig.parentUrl,
    },
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${siteConfig.homeUrl}/#collection`,
      name: siteConfig.name,
      description,
      url: siteConfig.homeUrl,
      inLanguage: "ja-JP",
      isPartOf: { "@id": `${siteConfig.parentUrl}/#website` },
      publisher: { "@id": `${siteConfig.parentUrl}/#organization` },
    },
  ];

  return (
    <html lang="ja">
      <head>
        <meta name="google-adsense-account" content="ca-pub-7962600450986425" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7962600450986425"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <JsonLd data={structuredData} />
        <PlatformFrame mleague>
        <SiteHeader />
        <div id="platform-main" tabIndex={-1} />
        {children}
        <SiteFooter />
        </PlatformFrame>
      </body>
    </html>
  );
}

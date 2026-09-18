import type { Metadata, Viewport } from "next";
import { JsonLd } from "./components/JsonLd";
import { Footer, Header } from "./components/SiteChrome";
import { getSiteUrl } from "./seoConfig";
import { siteConfig } from "./siteConfig";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  applicationName: siteConfig.brand.name,
  title: {
    default: siteConfig.brand.name,
    template: `%s | ${siteConfig.brand.name}`
  },
  description: "麻雀初心者向けのルール解説、練習問題、牌理解析、点数計算、動画記事をつなぐ麻雀総合サイトです。",
  authors: [{ name: siteConfig.brand.name, url: "/about" }],
  creator: siteConfig.brand.name,
  publisher: siteConfig.brand.name,
  category: "麻雀学習",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: siteConfig.brand.name,
    title: siteConfig.brand.name,
    description: siteConfig.brand.tagline
  },
  twitter: {
    card: "summary",
    title: siteConfig.brand.name,
    description: siteConfig.brand.tagline
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const siteUrl = getSiteUrl();
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: siteConfig.brand.name,
      alternateName: siteConfig.brand.englishName,
      url: siteUrl,
      slogan: siteConfig.brand.tagline
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: siteConfig.brand.name,
      alternateName: siteConfig.brand.englishName,
      url: siteUrl,
      inLanguage: "ja-JP",
      publisher: { "@id": `${siteUrl}/#organization` }
    }
  ];

  return (
    <html lang="ja">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7962600450986425"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <JsonLd data={structuredData} />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}

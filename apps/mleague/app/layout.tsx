import type { Metadata, Viewport } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { siteConfig } from "@/config/site";
import "./globals.css";

const description =
  "Mリーグの対局情報と、所属選手のプロフィールを確認できる非公式情報サイトです。";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteOrigin),
  title: {
    default: siteConfig.name,
    template: `%s｜${siteConfig.name}`,
  },
  description,
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description,
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
        <a className="skip-link" href="#main-content">
          本文へ移動
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Footer, Header } from "./components/SiteChrome";
import { getSiteUrl } from "./seoConfig";
import { siteConfig } from "./siteConfig";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: siteConfig.brand.name,
    template: `%s | ${siteConfig.brand.name}`
  },
  description: "麻雀初心者向けのルール解説、練習問題、牌理解析、点数計算、動画記事をつなぐ麻雀総合サイトです。"
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}

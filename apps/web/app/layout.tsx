import type { Metadata, Viewport } from "next";
import { Footer, Header } from "./components/SiteChrome";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "麻雀トレーナー",
    template: "%s | 麻雀トレーナー"
  },
  description: "麻雀初心者向けのルール解説、練習問題、点数計算ツールをつなぐ学習サイトです。"
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

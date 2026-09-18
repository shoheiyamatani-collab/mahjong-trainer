import type { Metadata } from "next";
import { VideoChannelPage } from "../../VideoChannelPage";
import { proStrategyChannel } from "../../videoData";

export const metadata: Metadata = {
  title: "麻雀上級者向け動画 | プロの思考を実戦解説で学ぶ",
  description: "発男道場の麻雀実戦解説から、プロ本人が一半荘を打ちながら話す手組み、読み、押し引きの思考を紹介します。",
  alternates: { canonical: "/videos/strategy/pro" },
  openGraph: {
    type: "website",
    url: "/videos/strategy/pro",
    siteName: "雀フォリオ",
    title: "麻雀上級者向け動画 | プロの思考を実戦解説で学ぶ",
    description: "一打の結論だけではなく、プロが何を見てどう比較したのかを一半荘の実戦解説から学べます。"
  }
};

export default function ProStrategyVideoPage() {
  return <VideoChannelPage channel={proStrategyChannel} strategyAudience="pro" />;
}

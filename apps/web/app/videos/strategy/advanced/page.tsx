import type { Metadata } from "next";
import { VideoChannelPage } from "../../VideoChannelPage";
import { advancedStrategyChannel } from "../../videoData";

export const metadata: Metadata = {
  title: "麻雀中級者以上向け動画 | 実戦判断を深く学ぶ",
  description: "麻雀中級者以上へ向けた牌効率、押し引き、読み、手順比較の動画記事を掲載するページです。"
};

export default function AdvancedStrategyVideoPage() {
  return <VideoChannelPage channel={advancedStrategyChannel} strategyAudience="advanced" />;
}

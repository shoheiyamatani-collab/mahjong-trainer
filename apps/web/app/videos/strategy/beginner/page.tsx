import type { Metadata } from "next";
import { VideoChannelPage } from "../../VideoChannelPage";
import { videoChannels } from "../../videoData";

export const metadata: Metadata = {
  title: "麻雀初心者向け動画 | 牌効率・何切る・守備を学ぶ",
  description: "麻雀初心者向けに、牌効率、何切る、役、点数計算、押し引き、守備を学べるYouTube動画を短い解説記事と一緒に紹介します。"
};

export default function BeginnerStrategyVideoPage() {
  return <VideoChannelPage channel={videoChannels.strategy} strategyAudience="beginner" />;
}

import type { Metadata } from "next";
import { VideoChannelPage } from "../../../VideoChannelPage";
import { advancedStrategyChannel } from "../../../videoData";

export const metadata: Metadata = {
  title: "麻雀の鳴き読み動画 | チー・ポン後の手順を読む",
  description: "麻雀中級者以上へ向けた鳴き読み動画の記事一覧。チーやポンの後に切られた牌と手順から、待ちの可能性を比較します。"
};

const callingReadChannel = {
  ...advancedStrategyChannel,
  eyebrow: "CALLING READ VIDEO LESSONS",
  title: "鳴き読みを動画で学ぶ",
  description: "チー・ポンした牌、鳴いた直後の手出し、場に見えている牌を組み合わせ、相手の待ちを断定せずに比較する考え方を学びます。",
  heroTiles: ["sou2", "sou3", "sou4", "man3", "man4", "man5"],
  guides: advancedStrategyChannel.guides.filter((guide) => guide.category === "鳴き読み")
};

export default function CallingReadVideoPage() {
  return <VideoChannelPage channel={callingReadChannel} strategyAudience="advanced" />;
}

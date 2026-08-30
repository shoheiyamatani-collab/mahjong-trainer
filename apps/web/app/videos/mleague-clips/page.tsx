import type { Metadata } from "next";
import { VideoChannelPage } from "../VideoChannelPage";
import { videoChannels } from "../videoData";

export const metadata: Metadata = {
  title: "Mリーグ厳選切り抜きを見る | 名局・選手の判断を解説",
  description: "Mリーグの厳選動画を、注目する局面、選手の判断、初心者向けの見どころと一緒に紹介する麻雀動画メディアです。"
};

export default function MLeagueClipsPage() {
  return <VideoChannelPage channel={videoChannels["mleague-clips"]} />;
}

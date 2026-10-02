import type { Metadata } from "next";
import { getRobotsPolicy } from "@mahjong-trainer/content-index-policy";

export const metadata: Metadata = {
  robots: getRobotsPolicy("/videos/mleague-clips")
};

export default function MLeagueClipLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}

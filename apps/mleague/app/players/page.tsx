import type { Metadata } from "next";
import { TeamPlayerLinks } from "@/components/mleague/TeamPlayerLinks";
import { UnofficialNotice } from "@/components/mleague/UnofficialNotice";
import { getTeamsWithCurrentPlayers } from "@/lib/mleague/getTeams";

export const metadata: Metadata = {
  title: "Mリーグ選手名鑑｜チーム別の選手一覧",
  description:
    "Mリーグで活動する麻雀プロを、所属チームごとに確認できる非公式選手名鑑です。",
};

export default function PlayersPage() {
  return (
    <main id="main-content" className="page-shell">
      <header className="page-header directory-page-header">
        <h1 className="page-title">選手一覧</h1>
        <p className="page-lead">
          現在の所属チームごとに、Mリーグ選手を確認できます。
        </p>
      </header>
      <UnofficialNotice />
      <TeamPlayerLinks teams={getTeamsWithCurrentPlayers()} />
    </main>
  );
}

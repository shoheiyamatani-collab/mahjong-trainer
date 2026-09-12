import type { Metadata } from "next";
import { TeamCard } from "@/components/mleague/TeamCard";
import { UnofficialNotice } from "@/components/mleague/UnofficialNotice";
import { getTeamsWithCurrentPlayers } from "@/lib/mleague/getTeams";

export const metadata: Metadata = {
  title: "チーム一覧｜Mリーグ選手名鑑",
  description: "Mリーグ参加チームと現在の所属選手を確認できる非公式一覧です。",
};

export default function TeamsPage() {
  const teams = getTeamsWithCurrentPlayers();

  return (
    <main id="main-content" className="page-shell">
      <header className="page-header">
        <span className="eyebrow">TEAM INDEX</span>
        <h1 className="page-title">チーム一覧</h1>
        <p className="page-lead">
          シーズン別所属履歴から、現在掲載中の所属選手を表示しています。
        </p>
      </header>
      <UnofficialNotice />
      <section className="section card-grid" aria-label="チーム一覧">
        {teams.map((team, index) => (
          <TeamCard
            key={team.id}
            team={team}
            players={team.currentPlayers}
            index={index}
          />
        ))}
      </section>
    </main>
  );
}

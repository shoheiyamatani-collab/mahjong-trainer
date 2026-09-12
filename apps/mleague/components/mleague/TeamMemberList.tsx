import Link from "next/link";
import { siteConfig } from "@/config/site";
import { isCurrentMembership } from "@/lib/mleague/getPlayers";
import type { Player, TeamMembership } from "@/types/mleague";

type TeamMemberListProps = {
  players: Player[];
  memberships: TeamMembership[];
};

export function TeamMemberList({ players, memberships }: TeamMemberListProps) {
  const currentIds = new Set(
    memberships.filter(isCurrentMembership).map((item) => item.playerId),
  );
  const pastIds = new Set(
    memberships.filter((item) => !isCurrentMembership(item)).map((item) => item.playerId),
  );
  const currentPlayers = players.filter((player) => currentIds.has(player.id));
  const pastPlayers = players.filter((player) => pastIds.has(player.id));

  return (
    <div className="two-column">
      <section className="content-card">
        <h2>現在所属している選手</h2>
        {currentPlayers.length ? (
          <ul className="member-list">
            {currentPlayers.map((player) => (
              <li key={player.id}>
                <Link
                  className="text-link"
                  href={`${siteConfig.routes.players}/${player.slug}`}
                >
                  {player.displayName}
                </Link>
                <span className="verified-date"> — {player.nameKana}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>確認済みデータはありません。</p>
        )}
      </section>
      <section className="content-card">
        <h2>過去に所属していた選手</h2>
        {pastPlayers.length ? (
          <ul className="member-list">
            {pastPlayers.map((player) => (
              <li key={player.id}>{player.displayName}</li>
            ))}
          </ul>
        ) : (
          <p>現在の掲載データには該当者がいません。</p>
        )}
      </section>
    </div>
  );
}

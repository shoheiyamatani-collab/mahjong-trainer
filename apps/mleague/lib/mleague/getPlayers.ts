import { memberships } from "@/data/mleague/memberships";
import { players } from "@/data/mleague/players";
import { teams } from "@/data/mleague/teams";
import type { PlayerListItem, TeamMembership } from "@/types/mleague";

export function getPublishedPlayers() {
  return players.filter((player) => player.publicationStatus === "published");
}

export function isCurrentMembership(membership: TeamMembership) {
  return membership.status === "active" || !membership.endSeason;
}

export function getCurrentMembership(playerId: string) {
  return memberships.find(
    (membership) =>
      membership.playerId === playerId && isCurrentMembership(membership),
  );
}

export function getPlayersWithCurrentTeams(): PlayerListItem[] {
  return getPublishedPlayers().map((player) => {
    const currentMembership = getCurrentMembership(player.id);
    const currentTeam = currentMembership
      ? teams.find((team) => team.id === currentMembership.teamId)
      : undefined;

    return {
      ...player,
      currentTeam: currentTeam
        ? { id: currentTeam.id, slug: currentTeam.slug, name: currentTeam.name }
        : undefined,
    };
  });
}

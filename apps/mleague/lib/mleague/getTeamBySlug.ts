import { memberships } from "@/data/mleague/memberships";
import { players } from "@/data/mleague/players";
import { teams } from "@/data/mleague/teams";

export function getTeamBySlug(slug: string) {
  const team = teams.find(
    (item) => item.slug === slug && item.publicationStatus === "published",
  );

  if (!team) return undefined;

  const teamMemberships = memberships.filter(
    (membership) => membership.teamId === team.id,
  );
  const playerIds = new Set(teamMemberships.map((membership) => membership.playerId));

  return {
    team,
    memberships: teamMemberships,
    players: players.filter(
      (player) =>
        playerIds.has(player.id) && player.publicationStatus === "published",
    ),
  };
}

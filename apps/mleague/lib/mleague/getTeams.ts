import { memberships } from "@/data/mleague/memberships";
import { players } from "@/data/mleague/players";
import { teams } from "@/data/mleague/teams";
import { isCurrentMembership } from "./getPlayers";

export function getPublishedTeams() {
  return teams.filter((team) => team.publicationStatus === "published");
}

export function getTeamsWithCurrentPlayers() {
  return getPublishedTeams().map((team) => {
    const playerIds = memberships
      .filter(
        (membership) =>
          membership.teamId === team.id && isCurrentMembership(membership),
      )
      .map((membership) => membership.playerId);

    return {
      ...team,
      currentPlayers: players.filter(
        (player) =>
          playerIds.includes(player.id) && player.publicationStatus === "published",
      ),
    };
  });
}

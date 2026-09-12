import { memberships } from "@/data/mleague/memberships";
import {
  playerCareerStats,
  seasonResults,
} from "@/data/mleague/seasonResults";
import { players } from "@/data/mleague/players";
import { playerBooksByPlayerId } from "@/data/mleague/books";

export function getPlayerBySlug(slug: string) {
  const player = players.find(
    (item) => item.slug === slug && item.publicationStatus === "published",
  );

  if (!player) return undefined;

  return {
    player,
    memberships: memberships.filter((item) => item.playerId === player.id),
    careerStats: playerCareerStats.find((item) => item.playerId === player.id),
    seasonResults: seasonResults.filter((item) => item.playerId === player.id),
    books: playerBooksByPlayerId[player.id] || [],
  };
}

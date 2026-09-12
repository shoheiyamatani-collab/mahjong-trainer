import type { PlayerListItem } from "@/types/mleague";
import { PlayerCard } from "./PlayerCard";

type PlayerListProps = {
  players: PlayerListItem[];
};

export function PlayerList({ players }: PlayerListProps) {
  return (
    <>
      <div className="results-summary">
        <strong>選手一覧</strong>
        <span className="verified-date">掲載中 {players.length}名</span>
      </div>
      <ul className="card-grid" aria-label="選手一覧">
        {players.map((player) => (
          <li key={player.id}>
            <PlayerCard player={player} />
          </li>
        ))}
      </ul>
    </>
  );
}

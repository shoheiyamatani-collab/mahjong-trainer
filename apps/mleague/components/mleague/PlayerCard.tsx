import Link from "next/link";
import { siteConfig } from "@/config/site";
import { formatVerifiedDate } from "@/lib/mleague/formatDate";
import type { PlayerListItem } from "@/types/mleague";
import { PlayerAvatar } from "./PlayerAvatar";

export function PlayerCard({ player }: { player: PlayerListItem }) {
  return (
    <Link
      className="player-card-link"
      href={`${siteConfig.routes.players}/${player.slug}`}
      aria-label={`${player.name}選手の詳細を見る`}
    >
      <article className="player-card">
        <div className="player-card-top">
          <PlayerAvatar name={player.name} />
          <div>
            <p className="player-name-kana">{player.nameKana}</p>
            <h2>{player.displayName}</h2>
          </div>
        </div>
        <dl className="player-meta">
          <div className="meta-row">
            <dt>現在のチーム</dt>
            <dd>{player.currentTeam?.name || "未確認"}</dd>
          </div>
          <div className="meta-row">
            <dt>所属団体</dt>
            <dd>{player.proAssociation || "未確認"}</dd>
          </div>
          <div className="meta-row">
            <dt>Mリーグ加入</dt>
            <dd>{player.mLeagueDebutSeason || "未確認"}</dd>
          </div>
        </dl>
        <div className="card-footer">
          <span className="verified-date">
            確認 {formatVerifiedDate(player.lastVerifiedAt)}
          </span>
          <span className="card-cta">詳細を見る →</span>
        </div>
      </article>
    </Link>
  );
}

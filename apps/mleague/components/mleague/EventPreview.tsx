import Link from "next/link";
import { siteConfig } from "@/config/site";
import type { PlayerEvent } from "@/types/mleague";

export function EventPreview({ events }: { events: PlayerEvent[] }) {
  if (events.length === 0) {
    return (
      <div className="empty-state">
        <span className="eyebrow">OFFICIAL SOURCES ONLY</span>
        <h2>選手に会えるイベント情報</h2>
        <p>
          現在、掲載基準を満たすイベント情報はありません。選手本人、店舗、チーム、所属団体、主催者の公式発表を確認できる情報だけを掲載します。
        </p>
        <Link className="text-link" href={siteConfig.routes.policy}>
          掲載方針を確認する
        </Link>
      </div>
    );
  }

  return (
    <ul className="card-grid">
      {events.map((event) => (
        <li className="content-card" key={event.id}>
          <h2>{event.title}</h2>
          <p>{event.startAt}</p>
        </li>
      ))}
    </ul>
  );
}

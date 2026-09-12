import Link from "next/link";
import { siteConfig } from "@/config/site";
import type { PlayerEvent } from "@/types/mleague";

export function EventPreview({ events }: { events: PlayerEvent[] }) {
  if (events.length === 0) {
    return (
      <div className="empty-state">
        <span className="eyebrow">準備中</span>
        <h2>選手に会えるイベント情報</h2>
        <p>
          一般向けに事前告知された公式イベントだけを掲載するため、確認フローを整備しています。
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

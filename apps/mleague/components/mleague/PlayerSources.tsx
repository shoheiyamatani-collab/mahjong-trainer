import { ExternalLink } from "@/components/ExternalLink";
import { formatVerifiedDate } from "@/lib/mleague/formatDate";
import type { Source } from "@/types/mleague";

export function PlayerSources({ sources }: { sources: Source[] }) {
  return (
    <section className="content-card content-section" aria-labelledby="sources-title">
      <h2 id="sources-title">出典</h2>
      <p>
        掲載内容は以下の公開情報を確認し、自サイト向けの表現に要約しています。
      </p>
      <ul className="source-list">
        {sources.map((source) => (
          <li key={`${source.url}-${source.checkedAt}`}>
            <ExternalLink className="text-link" href={source.url}>
              {source.label}
            </ExternalLink>{" "}
            <span className="verified-date">
              最終確認 {formatVerifiedDate(source.checkedAt)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

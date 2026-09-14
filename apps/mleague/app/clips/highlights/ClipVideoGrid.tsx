import { ExternalLink } from "@/components/ExternalLink";
import type { HighlightClip } from "./highlight-clips";

type ClipVideoGridProps = {
  clips: readonly HighlightClip[];
  ariaLabel: string;
  numberLabel: string;
};

export function ClipVideoGrid({ clips, ariaLabel, numberLabel }: ClipVideoGridProps) {
  return (
    <section className="clip-video-grid" aria-label={ariaLabel}>
      {clips.map((clip, index) => (
        <article className="clip-video-card" key={clip.id}>
          <ExternalLink className="clip-thumbnail-link" href={clip.url}>
            <span className="clip-thumbnail">
              <img
                src={`https://i.ytimg.com/vi/${clip.id}/hqdefault.jpg`}
                alt=""
                loading="lazy"
                decoding="async"
              />
              <span className="clip-play-mark" aria-hidden="true">
                ▶
              </span>
              {clip.isShort ? <span className="clip-short-label">SHORTS</span> : null}
            </span>
          </ExternalLink>
          <div className="clip-video-body">
            <div className="clip-video-meta">
              <span className="clip-video-number">
                {numberLabel} {String(index + 1).padStart(2, "0")}
              </span>
              <span className="clip-video-tag">{clip.tag}</span>
            </div>
            <h2>
              <ExternalLink href={clip.url}>{clip.title}</ExternalLink>
            </h2>
            {clip.date || clip.competition ? (
              <p className="clip-video-context">
                {[clip.date, clip.competition].filter(Boolean).join(" / ")}
              </p>
            ) : null}
            <p>{clip.channel}</p>
            <ExternalLink className="clip-watch-link" href={clip.url}>
              YouTubeで見る <span aria-hidden="true">→</span>
            </ExternalLink>
          </div>
        </article>
      ))}
    </section>
  );
}

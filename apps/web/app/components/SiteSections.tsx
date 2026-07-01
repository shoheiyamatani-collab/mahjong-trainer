import Link from "next/link";
import { ComingSoonBadge, DifficultyBadge } from "./Badges";
import type { CardStatus, LinkTarget, TrainingItem } from "../siteData";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryLink?: LinkTarget;
  secondaryLink?: LinkTarget;
};

export function PageHero({ eyebrow, title, description, primaryLink, secondaryLink }: PageHeroProps) {
  return (
    <section className="pageHero">
      <div className="pageHeroText">
        <p className="siteEyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div className="heroTileBand" aria-hidden="true">
        {["man1", "pin9", "sou5", "ji5", "man7"].map((tile) => (
          <img key={tile} src={`/tiles/${tile}-66-90-l-emb.png`} alt="" />
        ))}
      </div>
      {(primaryLink?.href || secondaryLink?.href) ? (
        <div className="heroActions">
          {primaryLink?.href ? <Link className="primaryCta" href={primaryLink.href}>{primaryLink.label}</Link> : null}
          {secondaryLink?.href ? <Link className="secondaryCta" href={secondaryLink.href}>{secondaryLink.label}</Link> : null}
        </div>
      ) : null}
    </section>
  );
}

export function SectionTitle({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <div className="sectionTitle">
      {eyebrow ? <p className="siteEyebrow">{eyebrow}</p> : null}
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  );
}

export function CategoryCard({
  title,
  description,
  href,
  actionLabel,
  status = "available",
  tone = "green"
}: {
  title: string;
  description: string;
  href?: string;
  actionLabel: string;
  status?: CardStatus;
  tone?: "green" | "red" | "yellow" | "blue";
}) {
  return (
    <article className={`categoryCard tone-${tone}`}>
      <div className="cardTopline">
        <h3>{title}</h3>
        {status === "comingSoon" ? <ComingSoonBadge /> : null}
      </div>
      <p>{description}</p>
      {href ? (
        <Link className="cardButton" href={href}>{actionLabel}</Link>
      ) : (
        <span className="cardButton disabled" aria-disabled="true">{actionLabel}</span>
      )}
    </article>
  );
}

export function InternalLinkCard({
  title,
  description,
  href,
  status = "available",
  actionLabel = "進む"
}: {
  title: string;
  description: string;
  href?: string;
  status?: CardStatus;
  actionLabel?: string;
}) {
  return (
    <article className="internalLinkCard">
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      {status === "comingSoon" ? <ComingSoonBadge /> : null}
      {href ? <Link href={href}>{actionLabel}</Link> : <span aria-disabled="true">準備中</span>}
    </article>
  );
}

export function TrainingCard({ item }: { item: TrainingItem }) {
  return (
    <article className="trainingCard">
      <div className="cardTopline">
        <h3>{item.title}</h3>
        <div className="badgeRow">
          <DifficultyBadge difficulty={item.difficulty} />
          {item.status === "comingSoon" ? <ComingSoonBadge /> : null}
        </div>
      </div>
      <dl className="cardFacts">
        <div>
          <dt>対象者</dt>
          <dd>{item.target}</dd>
        </div>
        <div>
          <dt>鍛えられること</dt>
          <dd>{item.focus}</dd>
        </div>
      </dl>
      {item.href ? (
        <Link className="cardButton" href={item.href}>{item.title}を始める</Link>
      ) : (
        <span className="cardButton disabled" aria-disabled="true">準備中</span>
      )}
    </article>
  );
}

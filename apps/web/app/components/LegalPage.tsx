import type { ReactNode } from "react";
import { legalConfig } from "../legalConfig";

type LegalPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  showDates?: boolean;
};

export function LegalPage({ eyebrow, title, description, children, showDates = false }: LegalPageProps) {
  return (
    <main className="siteMain legalPage">
      <header className="legalPageHeader">
        <p className="siteEyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </header>
      <article className="legalDocument">
        {children}
        {showDates ? (
          <dl className="legalDates">
            <div>
              <dt>制定日</dt>
              <dd>{legalConfig.establishedDate}</dd>
            </div>
            <div>
              <dt>最終更新日</dt>
              <dd>{legalConfig.lastUpdatedDate}</dd>
            </div>
          </dl>
        ) : null}
      </article>
    </main>
  );
}

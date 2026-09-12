import type { ReactNode } from "react";
import { getSafeExternalUrl } from "@/lib/mleague/safeUrl";

type ExternalLinkProps = {
  href?: string;
  children: ReactNode;
  className?: string;
};

export function ExternalLink({ href, children, className = "" }: ExternalLinkProps) {
  const safeUrl = getSafeExternalUrl(href);

  if (!safeUrl) return <span>{children}</span>;

  return (
    <a
      className={`external-link ${className}`.trim()}
      href={safeUrl}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      <span className="sr-only">（新しいタブで開きます）</span>
    </a>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Calculator, Search, SquarePlay, Target } from "lucide-react";

type SiteNavIcon = "analysis" | "training" | "score" | "rules" | "video";

export type SiteNavItem = {
  label: string;
  href: string;
  activePrefixes?: string[];
  external?: boolean;
  icon?: SiteNavIcon;
  kind?: "primary" | "utility";
  tone?: "analysis" | "training";
  visible?: boolean;
};

const navIcons = {
  analysis: Search,
  training: Target,
  score: Calculator,
  rules: BookOpen,
  video: SquarePlay,
} as const;

export function SiteNavigation({ items }: { items: SiteNavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="siteNav" aria-label="サイトナビゲーション">
      {items.filter((item) => item.visible !== false).map((item) => {
        const Icon = item.icon ? navIcons[item.icon] : null;
        const classNames = [
          "siteNavLink",
          `siteNavLink--${item.kind ?? "utility"}`,
          item.tone ? `siteNavLink--${item.tone}` : "",
        ];
        const content = (
          <>
            {Icon ? <Icon className="siteNavIcon" aria-hidden="true" strokeWidth={2.4} /> : null}
            <span>{item.label}</span>
          </>
        );

        if (item.external) {
          return (
            <a className={classNames.join(" ")} key={item.href} href={item.href} target="_blank" rel="noopener noreferrer">
              {content}
            </a>
          );
        }

        const activePrefixes = item.activePrefixes ?? [item.href];
        const active = activePrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
        if (active) classNames.push("isActive");
        return (
          <Link className={classNames.join(" ")} aria-current={active ? "page" : undefined} key={item.href} href={item.href}>
            {content}
          </Link>
        );
      })}
    </nav>
  );
}

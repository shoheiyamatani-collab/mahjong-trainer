"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function LearningPathDisclosure({ id, className, tone, children }: { id: string; className: string; tone: string; children: ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    function revealLinkedPath() {
      if (window.location.hash !== `#${id}` || !ref.current) return;
      ref.current.open = true;
      ref.current.scrollIntoView({ block: "start" });
    }
    revealLinkedPath();
    window.addEventListener("hashchange", revealLinkedPath);
    return () => window.removeEventListener("hashchange", revealLinkedPath);
  }, [id]);

  return <details ref={ref} id={id} className={className} data-tone={tone}>{children}</details>;
}

import type { ReactNode } from "react";
import VideoPracticeGateway from "./VideoPracticeGateway";

export default function StrategyLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <VideoPracticeGateway />
    </>
  );
}

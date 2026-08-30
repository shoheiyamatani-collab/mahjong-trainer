import type { Metadata } from "next";
import { Suspense } from "react";
import { StartingHandAnalysisClient } from "./StartingHandAnalysisClient";
import { StartingHandQueryClient } from "./StartingHandQueryClient";

export const metadata: Metadata = {
  title: "手役何狙う？チェッカー | 配牌分析",
  description: "13枚の配牌から7つの手役とリーチ戦略を独立シミュレーションし、実戦テンパイスコアを比較します。",
};

export default function StartingHandAnalysisPage() {
  return (
    <Suspense fallback={<StartingHandAnalysisClient />}>
      <StartingHandQueryClient />
    </Suspense>
  );
}

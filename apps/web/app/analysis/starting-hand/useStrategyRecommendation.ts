"use client";

import { useEffect, useState } from "react";
import {
  recommendStartingHand, sumCounts,
  type Counts34, type StrategySettings, type StrategyEvidence, type StrategyRecommendation,
} from "@mahjong-trainer/mahjong-core";

export interface RecommendationRequest { counts: Counts34; settings: StrategySettings; evidence: StrategyEvidence }
export type RecommendationResponse = { result: StrategyRecommendation } | { error: string };
const EMPTY_EVIDENCE: StrategyEvidence = {};

export function useStrategyRecommendation(counts: Counts34, settings: StrategySettings, evidence = EMPTY_EVIDENCE, enabled = true) {
  const [result, setResult] = useState<StrategyRecommendation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  useEffect(() => {
    setResult(null);
    setError(null);
    if (!enabled || sumCounts(counts) !== 13) { setPending(false); return; }
    setPending(true);
    let disposed = false;
    let worker: Worker | undefined;
    const finish = (response: RecommendationResponse) => {
      if (disposed) return;
      if ("result" in response) setResult(response.result);
      else setError(response.error);
      setPending(false);
    };
    const fallback = () => {
      if (disposed) return;
      try { finish({ result: recommendStartingHand(counts, settings, evidence) }); }
      catch (caught) { finish({ error: caught instanceof Error ? caught.message : "構想の評価に失敗しました。" }); }
    };
    const timer = window.setTimeout(() => {
      try {
        worker = new Worker(new URL("./recommendation.worker.ts", import.meta.url));
        worker.onmessage = (event: MessageEvent<RecommendationResponse>) => { finish(event.data); worker?.terminate(); };
        worker.onerror = () => { worker?.terminate(); fallback(); };
        worker.postMessage({ counts, settings, evidence } satisfies RecommendationRequest);
      } catch { fallback(); }
    }, 150);
    return () => { disposed = true; window.clearTimeout(timer); worker?.terminate(); };
  }, [counts, settings, evidence, enabled]);
  return { recommendation: result, recommendationError: error, recommendationPending: pending };
}

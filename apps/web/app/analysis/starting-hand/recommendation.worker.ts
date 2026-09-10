import { recommendStartingHand } from "@mahjong-trainer/mahjong-core";
import type { RecommendationRequest, RecommendationResponse } from "./useStrategyRecommendation";

const scope = self as unknown as {
  onmessage: (event: MessageEvent<RecommendationRequest>) => void;
  postMessage: (response: RecommendationResponse) => void;
};
scope.onmessage = ({ data }) => {
  try {
    scope.postMessage({ result: recommendStartingHand(data.counts, data.settings, data.evidence) });
  } catch (error) {
    scope.postMessage({ error: error instanceof Error ? error.message : "構想の評価に失敗しました。" });
  }
};

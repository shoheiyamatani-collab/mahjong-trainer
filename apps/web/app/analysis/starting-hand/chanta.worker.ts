import {
  createRoleSimulationSession,
  diffSimulationCounters,
  getSimulationCounterSnapshot,
  type Counts34,
} from "@mahjong-trainer/mahjong-core";

import type {
  RunSimulationWorkerRequest,
  SimulationPerformanceMetrics,
  SimulationWorkerRequest,
  SimulationWorkerResponse,
} from "./simulationWorkerProtocol";

const workerScope = self as unknown as {
  onmessage: ((event: MessageEvent<SimulationWorkerRequest>) => void) | null;
  postMessage: (message: SimulationWorkerResponse) => void;
};

const queue: RunSimulationWorkerRequest[] = [];
const cancelledAnalyses = new Set<string>();
let processing = false;

workerScope.onmessage = (event) => {
  if (event.data.type === "CANCEL") {
    cancelledAnalyses.add(event.data.analysisId);
    for (let index = queue.length - 1; index >= 0; index -= 1) {
      if (queue[index]?.analysisId === event.data.analysisId) queue.splice(index, 1);
    }
    return;
  }
  cancelledAnalyses.delete(event.data.analysisId);
  queue.push(event.data);
  void processQueue();
};

async function processQueue(): Promise<void> {
  if (processing) return;
  processing = true;
  while (queue.length > 0) {
    const request = queue.shift();
    if (request) await runRequest(request);
  }
  processing = false;
}

async function runRequest(request: RunSimulationWorkerRequest): Promise<void> {
  const startedAt = performance.now();
  const initialCompleted = request.checkpoint?.completedTrials ?? 0;
  const countersBefore = getSimulationCounterSnapshot();
  let progressMessageCount = 0;
  let lastReportedTrials = initialCompleted;

  try {
    const session = createRoleSimulationSession(
      {
        initialHand: Array.from(request.initialHand) as Counts34,
        trials: request.targetTrials,
        seed: request.seed,
        debug: request.debug,
      },
      request.roleId,
      request.checkpoint,
    );

    while (session.completedTrials < request.targetTrials) {
      if (cancelledAnalyses.has(request.analysisId)) {
        cancelledAnalyses.delete(request.analysisId);
        post({ type: "CANCELLED", analysisId: request.analysisId, taskId: request.taskId, roleId: request.roleId });
        return;
      }
      session.runBatch(Math.min(request.batchSize, request.targetTrials - session.completedTrials));
      if (
        session.completedTrials >= request.targetTrials
        || session.completedTrials - lastReportedTrials >= request.progressInterval
      ) {
        lastReportedTrials = session.completedTrials;
        progressMessageCount += 1;
        post({
          type: "PROGRESS",
          analysisId: request.analysisId,
          taskId: request.taskId,
          roleId: request.roleId,
          completedTrials: session.completedTrials,
          targetTrials: request.targetTrials,
        });
      }
      await yieldToWorkerEventLoop();
    }

    const result = session.getResult();
    const checkpoint = session.createCheckpoint();
    if (!result || !checkpoint) throw new Error("Simulation completed without a result.");
    const countersAfter = getSimulationCounterSnapshot();
    const counterDelta = diffSimulationCounters(countersBefore, countersAfter);
    counterDelta.peakCacheEntryCount = countersAfter.peakCacheEntryCount;
    const durationMs = performance.now() - startedAt;
    const completedThisRequest = Math.max(0, session.completedTrials - initialCompleted);
    const metrics: SimulationPerformanceMetrics = {
      ...counterDelta,
      durationMs,
      completedTrials: completedThisRequest,
      averageTrialDurationMs: completedThisRequest > 0 ? durationMs / completedThisRequest : 0,
      cacheHitRate: ratio(counterDelta.cacheHitCount, counterDelta.cacheHitCount + counterDelta.cacheMissCount),
      progressMessageCount,
    };
    post({
      type: "RESULT",
      analysisId: request.analysisId,
      taskId: request.taskId,
      roleId: request.roleId,
      result,
      checkpoint,
      metrics,
    });
  } catch (error) {
    post({
      type: "ERROR",
      analysisId: request.analysisId,
      taskId: request.taskId,
      roleId: request.roleId,
      message: error instanceof Error ? error.message : "シミュレーションに失敗しました。",
    });
  }
}

function post(message: SimulationWorkerResponse): void {
  workerScope.postMessage(message);
}

function ratio(numerator: number, denominator: number): number {
  return denominator === 0 ? 0 : numerator / denominator;
}

function yieldToWorkerEventLoop(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

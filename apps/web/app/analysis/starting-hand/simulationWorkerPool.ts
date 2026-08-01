import type {
  Counts34,
  RoleSimulationCheckpoint,
  RoleSimulationResult,
  SimulationRoleId,
} from "@mahjong-trainer/mahjong-core";
import {
  createRoleSimulationSession,
  diffSimulationCounters,
  getSimulationCounterSnapshot,
} from "@mahjong-trainer/mahjong-core";

import type {
  SimulationPerformanceMetrics,
  SimulationWorkerResponse,
} from "./simulationWorkerProtocol";

export interface SimulationStageInput {
  analysisId: string;
  roles: readonly SimulationRoleId[];
  initialHand: Counts34;
  targetTrials: number;
  seed: number;
  debug: boolean;
  batchSize?: number;
  checkpoints?: Partial<Record<SimulationRoleId, RoleSimulationCheckpoint>>;
  onProgress?: (progress: SimulationStageProgress) => void;
}

export interface SimulationStageProgress {
  completedTrials: number;
  totalTrials: number;
  byRole: Partial<Record<SimulationRoleId, number>>;
}

export interface SimulationStageOutput {
  results: Partial<Record<SimulationRoleId, RoleSimulationResult>>;
  checkpoints: Partial<Record<SimulationRoleId, RoleSimulationCheckpoint>>;
  metrics: Partial<Record<SimulationRoleId, SimulationPerformanceMetrics>>;
}

export interface SimulationRunner {
  readonly size: number;
  readonly mode: "worker" | "cooperative";
  runStage(input: SimulationStageInput): Promise<SimulationStageOutput>;
  cancel(analysisId: string): void;
  dispose(): void;
}

interface StageState extends SimulationStageOutput {
  input: SimulationStageInput;
  queues: SimulationRoleId[][];
  completedByRole: Partial<Record<SimulationRoleId, number>>;
  activeTasks: Map<string, SimulationRoleId>;
  activeByWorker: Map<number, { taskId: string; roleId: SimulationRoleId }>;
  retryCounts: Partial<Record<SimulationRoleId, number>>;
  resolve: (output: SimulationStageOutput) => void;
  reject: (error: Error) => void;
}

const ESTIMATED_ROLE_COST: Readonly<Record<SimulationRoleId, number>> = {
  toitoi: 45,
  flush: 45,
  riichi: 43,
  sanshoku: 34,
  tanyao: 30,
  ikkitsuukan: 23,
  chanta: 8,
  chiitoitsu: 7,
  pinfu: 25,
};

export class SimulationWorkerPool implements SimulationRunner {
  readonly mode = "worker" as const;
  private readonly workers: Worker[] = [];
  private stage: StageState | null = null;
  private disposed = false;

  constructor(workerCount: number) {
    const count = Math.max(1, Math.min(4, Math.floor(workerCount)));
    try {
      for (let index = 0; index < count; index += 1) this.workers.push(this.createWorker(index));
    } catch (error) {
      this.workers.forEach((worker) => worker.terminate());
      this.workers.length = 0;
      throw error;
    }
  }

  get size(): number {
    return this.workers.length;
  }

  runStage(input: SimulationStageInput): Promise<SimulationStageOutput> {
    if (this.disposed) return Promise.reject(new Error("Worker pool is disposed."));
    if (this.stage) return Promise.reject(new Error("A simulation stage is already running."));
    return new Promise((resolve, reject) => {
      const completedByRole: Partial<Record<SimulationRoleId, number>> = {};
      for (const roleId of input.roles) completedByRole[roleId] = input.checkpoints?.[roleId]?.completedTrials ?? 0;
      this.stage = {
        input,
        queues: createBalancedQueues(input.roles, this.workers.length),
        completedByRole,
        activeTasks: new Map(),
        activeByWorker: new Map(),
        retryCounts: {},
        results: {},
        checkpoints: {},
        metrics: {},
        resolve,
        reject,
      };
      this.workers.forEach((_, index) => this.assignNext(index));
      this.emitProgress();
    });
  }

  cancel(analysisId: string): void {
    this.workers.forEach((worker) => worker.postMessage({ type: "CANCEL", analysisId }));
    if (this.stage?.input.analysisId === analysisId) {
      const stage = this.stage;
      this.stage = null;
      stage.reject(new DOMException("Simulation cancelled.", "AbortError"));
    }
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    const stage = this.stage;
    this.stage = null;
    stage?.reject(new DOMException("Worker pool disposed.", "AbortError"));
    this.workers.forEach((worker) => worker.terminate());
    this.workers.length = 0;
  }

  private createWorker(index: number): Worker {
    const worker = new Worker(new URL("./chanta.worker.ts", import.meta.url));
    worker.onmessage = (event: MessageEvent<SimulationWorkerResponse>) => this.handleMessage(index, event.data);
    worker.onerror = () => this.handleWorkerCrash(index);
    return worker;
  }

  private assignNext(workerIndex: number): void {
    const stage = this.stage;
    if (!stage) return;
    const roleId = stage.queues[workerIndex]?.shift();
    if (!roleId) {
      if (stage.activeTasks.size === 0) this.finishStage(stage);
      return;
    }
    const taskId = `${stage.input.analysisId}:${roleId}:${stage.input.targetTrials}`;
    stage.activeTasks.set(taskId, roleId);
    stage.activeByWorker.set(workerIndex, { taskId, roleId });
    const initialHand = Int8Array.from(stage.input.initialHand);
    this.workers[workerIndex].postMessage({
      type: "RUN",
      analysisId: stage.input.analysisId,
      taskId,
      roleId,
      initialHand,
      targetTrials: stage.input.targetTrials,
      seed: stage.input.seed,
      debug: stage.input.debug,
      batchSize: stage.input.batchSize ?? 10,
      progressInterval: 50,
      checkpoint: stage.input.checkpoints?.[roleId],
    }, [initialHand.buffer]);
  }

  private handleMessage(workerIndex: number, message: SimulationWorkerResponse): void {
    const stage = this.stage;
    if (!stage || message.analysisId !== stage.input.analysisId) return;
    if (message.type === "PROGRESS") {
      stage.completedByRole[message.roleId] = message.completedTrials;
      this.emitProgress();
      return;
    }
    if (message.type === "ERROR") {
      stage.activeTasks.delete(message.taskId);
      stage.activeByWorker.delete(workerIndex);
      this.retryOrFail(workerIndex, message.roleId, new Error(message.message));
      return;
    }
    if (message.type === "CANCELLED") return;

    stage.activeTasks.delete(message.taskId);
    stage.activeByWorker.delete(workerIndex);
    stage.completedByRole[message.roleId] = message.checkpoint.completedTrials;
    stage.results[message.roleId] = message.result;
    stage.checkpoints[message.roleId] = message.checkpoint;
    stage.metrics[message.roleId] = message.metrics;
    this.emitProgress();
    this.assignNext(workerIndex);
  }

  private emitProgress(): void {
    const stage = this.stage;
    if (!stage) return;
    const completedTrials = stage.input.roles.reduce(
      (sum, roleId) => sum + (stage.completedByRole[roleId] ?? 0),
      0,
    );
    stage.input.onProgress?.({
      completedTrials,
      totalTrials: stage.input.targetTrials * stage.input.roles.length,
      byRole: { ...stage.completedByRole },
    });
  }

  private finishStage(stage: StageState): void {
    if (this.stage !== stage) return;
    this.stage = null;
    stage.resolve({ results: stage.results, checkpoints: stage.checkpoints, metrics: stage.metrics });
  }

  private fail(error: Error): void {
    const stage = this.stage;
    if (!stage) return;
    this.stage = null;
    stage.reject(error);
  }

  private retryOrFail(workerIndex: number, roleId: SimulationRoleId, error: Error): void {
    const stage = this.stage;
    if (!stage) return;
    const attempts = stage.retryCounts[roleId] ?? 0;
    if (attempts < 1) {
      stage.retryCounts[roleId] = attempts + 1;
      stage.queues[workerIndex]?.unshift(roleId);
      this.assignNext(workerIndex);
      return;
    }
    this.fail(error);
  }

  private handleWorkerCrash(workerIndex: number): void {
    const active = this.stage?.activeByWorker.get(workerIndex);
    if (active && this.stage) {
      this.stage.activeTasks.delete(active.taskId);
      this.stage.activeByWorker.delete(workerIndex);
    }
    this.workers[workerIndex]?.terminate();
    if (this.disposed) return;
    try {
      this.workers[workerIndex] = this.createWorker(workerIndex);
    } catch {
      this.fail(new Error("計算ワーカーを再起動できませんでした。ページを再読み込みしてください。"));
      return;
    }
    if (active) {
      this.retryOrFail(workerIndex, active.roleId, new Error(`${active.roleId} AIの計算ワーカーが停止しました。`));
    } else {
      this.assignNext(workerIndex);
    }
  }
}

export class CooperativeSimulationRunner implements SimulationRunner {
  readonly size = 1;
  readonly mode = "cooperative" as const;
  private activeAnalysisId: string | null = null;
  private readonly cancelledAnalyses = new Set<string>();
  private disposed = false;

  async runStage(input: SimulationStageInput): Promise<SimulationStageOutput> {
    if (this.disposed) throw new Error("Simulation runner is disposed.");
    if (this.activeAnalysisId) throw new Error("A simulation stage is already running.");
    this.activeAnalysisId = input.analysisId;
    this.cancelledAnalyses.delete(input.analysisId);
    const results: SimulationStageOutput["results"] = {};
    const checkpoints: SimulationStageOutput["checkpoints"] = {};
    const metrics: SimulationStageOutput["metrics"] = {};
    const completedByRole: Partial<Record<SimulationRoleId, number>> = {};
    for (const roleId of input.roles) {
      completedByRole[roleId] = input.checkpoints?.[roleId]?.completedTrials ?? 0;
    }

    try {
      for (const roleId of input.roles) {
        this.throwIfCancelled(input.analysisId);
        const checkpoint = input.checkpoints?.[roleId];
        const initialCompleted = checkpoint?.completedTrials ?? 0;
        const countersBefore = getSimulationCounterSnapshot();
        const startedAt = performance.now();
        let progressMessageCount = 0;
        let lastReportedTrials = initialCompleted;
        const session = createRoleSimulationSession({
          initialHand: input.initialHand,
          trials: input.targetTrials,
          seed: input.seed,
          debug: input.debug,
        }, roleId, checkpoint);

        while (session.completedTrials < input.targetTrials) {
          this.throwIfCancelled(input.analysisId);
          const batchSize = Math.min(2, input.batchSize ?? 2, input.targetTrials - session.completedTrials);
          session.runBatch(batchSize);
          completedByRole[roleId] = session.completedTrials;
          if (
            session.completedTrials >= input.targetTrials
            || session.completedTrials - lastReportedTrials >= 25
          ) {
            lastReportedTrials = session.completedTrials;
            progressMessageCount += 1;
            input.onProgress?.(createStageProgress(input, completedByRole));
          }
          await yieldToMainThread();
        }

        const result = session.getResult();
        const nextCheckpoint = session.createCheckpoint();
        if (!result || !nextCheckpoint) throw new Error("Simulation completed without a result.");
        const countersAfter = getSimulationCounterSnapshot();
        const counterDelta = diffSimulationCounters(countersBefore, countersAfter);
        counterDelta.peakCacheEntryCount = countersAfter.peakCacheEntryCount;
        const durationMs = performance.now() - startedAt;
        const completedTrials = Math.max(0, session.completedTrials - initialCompleted);
        results[roleId] = result;
        checkpoints[roleId] = nextCheckpoint;
        metrics[roleId] = {
          ...counterDelta,
          durationMs,
          completedTrials,
          averageTrialDurationMs: completedTrials > 0 ? durationMs / completedTrials : 0,
          cacheHitRate: ratio(counterDelta.cacheHitCount, counterDelta.cacheHitCount + counterDelta.cacheMissCount),
          progressMessageCount,
        };
      }
      return { results, checkpoints, metrics };
    } finally {
      if (this.activeAnalysisId === input.analysisId) this.activeAnalysisId = null;
      this.cancelledAnalyses.delete(input.analysisId);
    }
  }

  cancel(analysisId: string): void {
    this.cancelledAnalyses.add(analysisId);
  }

  dispose(): void {
    this.disposed = true;
    if (this.activeAnalysisId) this.cancelledAnalyses.add(this.activeAnalysisId);
  }

  private throwIfCancelled(analysisId: string): void {
    if (this.disposed || this.cancelledAnalyses.has(analysisId)) {
      throw new DOMException("Simulation cancelled.", "AbortError");
    }
  }
}

function createBalancedQueues(roles: readonly SimulationRoleId[], workerCount: number): SimulationRoleId[][] {
  const queues = Array.from({ length: workerCount }, () => [] as SimulationRoleId[]);
  const loads = Array(workerCount).fill(0) as number[];
  const sorted = [...roles].sort((left, right) => ESTIMATED_ROLE_COST[right] - ESTIMATED_ROLE_COST[left]);
  for (const roleId of sorted) {
    let target = 0;
    for (let index = 1; index < workerCount; index += 1) {
      if (loads[index]! < loads[target]!) target = index;
    }
    queues[target]!.push(roleId);
    loads[target] += ESTIMATED_ROLE_COST[roleId];
  }
  return queues;
}

function createStageProgress(
  input: SimulationStageInput,
  completedByRole: Partial<Record<SimulationRoleId, number>>,
): SimulationStageProgress {
  return {
    completedTrials: input.roles.reduce((sum, roleId) => sum + (completedByRole[roleId] ?? 0), 0),
    totalTrials: input.targetTrials * input.roles.length,
    byRole: { ...completedByRole },
  };
}

function ratio(numerator: number, denominator: number): number {
  return denominator === 0 ? 0 : numerator / denominator;
}

function yieldToMainThread(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

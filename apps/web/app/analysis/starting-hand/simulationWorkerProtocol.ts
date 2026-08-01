import type {
  RoleSimulationCheckpoint,
  RoleSimulationResult,
  SimulationCounterSnapshot,
  SimulationRoleId,
} from "@mahjong-trainer/mahjong-core";

export interface SimulationPerformanceMetrics extends SimulationCounterSnapshot {
  durationMs: number;
  completedTrials: number;
  averageTrialDurationMs: number;
  cacheHitRate: number;
  progressMessageCount: number;
}

export interface RunSimulationWorkerRequest {
  type: "RUN";
  analysisId: string;
  taskId: string;
  roleId: SimulationRoleId;
  initialHand: Int8Array;
  targetTrials: number;
  seed: number;
  debug: boolean;
  batchSize: number;
  progressInterval: number;
  checkpoint?: RoleSimulationCheckpoint;
}

export interface CancelSimulationWorkerRequest {
  type: "CANCEL";
  analysisId: string;
}

export type SimulationWorkerRequest = RunSimulationWorkerRequest | CancelSimulationWorkerRequest;

export type SimulationWorkerResponse =
  | {
      type: "PROGRESS";
      analysisId: string;
      taskId: string;
      roleId: SimulationRoleId;
      completedTrials: number;
      targetTrials: number;
    }
  | {
      type: "RESULT";
      analysisId: string;
      taskId: string;
      roleId: SimulationRoleId;
      result: RoleSimulationResult;
      checkpoint: RoleSimulationCheckpoint;
      metrics: SimulationPerformanceMetrics;
    }
  | {
      type: "CANCELLED";
      analysisId: string;
      taskId: string;
      roleId: SimulationRoleId;
    }
  | {
      type: "ERROR";
      analysisId: string;
      taskId: string;
      roleId: SimulationRoleId;
      message: string;
    };

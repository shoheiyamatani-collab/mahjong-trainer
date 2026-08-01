export interface WorkerCapacity {
  hardwareConcurrency?: number;
  deviceMemoryGb?: number;
  lowLoadMode?: boolean;
}

export function recommendedSimulationWorkerCount(capacity: WorkerCapacity): number {
  if (capacity.lowLoadMode) return 1;
  const cores = positiveIntegerOr(capacity.hardwareConcurrency, 2);
  const memory = positiveNumberOr(capacity.deviceMemoryGb, 4);
  if (memory <= 2 || cores <= 2) return 1;
  if (memory <= 4 || cores <= 4) return 2;
  return Math.min(4, Math.max(2, cores - 1));
}

function positiveIntegerOr(value: number | undefined, fallback: number): number {
  return value != null && Number.isFinite(value) && value > 0 ? Math.floor(value) : fallback;
}

function positiveNumberOr(value: number | undefined, fallback: number): number {
  return value != null && Number.isFinite(value) && value > 0 ? value : fallback;
}

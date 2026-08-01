export type SimulationCounterName =
  | "shantenCalculationCount"
  | "targetShantenCalculationCount"
  | "ukeireCalculationCount"
  | "agariCheckCount"
  | "waitCalculationCount"
  | "discardEvaluationCount"
  | "callEvaluationCount"
  | "cacheHitCount"
  | "cacheMissCount"
  | "detailedLogCount";

export interface SimulationCounterSnapshot {
  shantenCalculationCount: number;
  targetShantenCalculationCount: number;
  ukeireCalculationCount: number;
  agariCheckCount: number;
  waitCalculationCount: number;
  discardEvaluationCount: number;
  callEvaluationCount: number;
  cacheHitCount: number;
  cacheMissCount: number;
  detailedLogCount: number;
  peakCacheEntryCount: number;
}

const counters: SimulationCounterSnapshot = emptySnapshot();

export function resetSimulationCounters(): void {
  Object.assign(counters, emptySnapshot());
}

export function incrementSimulationCounter(name: SimulationCounterName, amount = 1): void {
  counters[name] += amount;
}

export function noteSimulationCacheSize(size: number): void {
  counters.peakCacheEntryCount = Math.max(counters.peakCacheEntryCount, size);
}

export function getSimulationCounterSnapshot(): SimulationCounterSnapshot {
  return { ...counters };
}

export function diffSimulationCounters(
  before: SimulationCounterSnapshot,
  after: SimulationCounterSnapshot,
): SimulationCounterSnapshot {
  const result = emptySnapshot();
  for (const key of Object.keys(result) as Array<keyof SimulationCounterSnapshot>) {
    result[key] = Math.max(0, after[key] - before[key]);
  }
  return result;
}

export class LruCache<K, V> {
  private readonly values = new Map<K, V>();

  constructor(private readonly maximumEntries: number) {
    if (!Number.isInteger(maximumEntries) || maximumEntries < 1) {
      throw new Error("maximumEntries must be a positive integer.");
    }
  }

  get size(): number {
    return this.values.size;
  }

  get(key: K): V | undefined {
    const value = this.values.get(key);
    if (value === undefined) {
      incrementSimulationCounter("cacheMissCount");
      return undefined;
    }
    this.values.delete(key);
    this.values.set(key, value);
    incrementSimulationCounter("cacheHitCount");
    return value;
  }

  set(key: K, value: V): this {
    if (this.values.has(key)) this.values.delete(key);
    this.values.set(key, value);
    if (this.values.size > this.maximumEntries) {
      const oldest = this.values.keys().next().value as K | undefined;
      if (oldest !== undefined) this.values.delete(oldest);
    }
    noteSimulationCacheSize(this.values.size);
    return this;
  }

  clear(): void {
    this.values.clear();
  }
}

function emptySnapshot(): SimulationCounterSnapshot {
  return {
    shantenCalculationCount: 0,
    targetShantenCalculationCount: 0,
    ukeireCalculationCount: 0,
    agariCheckCount: 0,
    waitCalculationCount: 0,
    discardEvaluationCount: 0,
    callEvaluationCount: 0,
    cacheHitCount: 0,
    cacheMissCount: 0,
    detailedLogCount: 0,
    peakCacheEntryCount: 0,
  };
}

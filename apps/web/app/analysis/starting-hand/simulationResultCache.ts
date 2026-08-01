import type {
  Counts34,
  RoleSimulationCheckpoint,
  SimulationRoleId,
} from "@mahjong-trainer/mahjong-core";
import { PRACTICAL_TENPAI_SCORING_VERSION } from "@mahjong-trainer/mahjong-core";

import type { SimulationPerformanceMetrics } from "./simulationWorkerProtocol";

export const SIMULATION_CACHE_TTL_MS = 24 * 60 * 60 * 1_000;
export const SIMULATION_CACHE_MAX_ENTRIES = 8;
const INDEX_KEY = "mahjong:starting-hand-analysis:index:v1";
const ENTRY_PREFIX = "mahjong:starting-hand-analysis:entry:v1:";

export interface CachedSimulationBundle {
  cacheKey: string;
  createdAt: number;
  expiresAt: number;
  hand: Counts34;
  targetTrials: number;
  baseSeed: number;
  checkpoints: Partial<Record<SimulationRoleId, RoleSimulationCheckpoint>>;
  metrics: Partial<Record<SimulationRoleId, SimulationPerformanceMetrics>>;
}

interface CacheIndexItem {
  id: string;
  cacheKey: string;
  createdAt: number;
  expiresAt: number;
}

const memoryCache = new Map<string, CachedSimulationBundle>();

export function readSimulationBundle(cacheKey: string): CachedSimulationBundle | null {
  const memory = memoryCache.get(cacheKey);
  if (memory && memory.expiresAt > Date.now() && hasCurrentPracticalTenpaiMetrics(memory)) return memory;
  if (memory) memoryCache.delete(cacheKey);
  const storage = getStorage();
  if (!storage) return null;
  pruneSimulationCache(storage);
  const item = readIndex(storage).find((entry) => entry.cacheKey === cacheKey);
  if (!item) return null;
  try {
    const parsed = JSON.parse(storage.getItem(`${ENTRY_PREFIX}${item.id}`) ?? "null") as CachedSimulationBundle | null;
    if (!parsed || parsed.cacheKey !== cacheKey || parsed.expiresAt <= Date.now() || !hasCurrentPracticalTenpaiMetrics(parsed)) return null;
    setMemoryCache(cacheKey, parsed);
    return parsed;
  } catch {
    return null;
  }
}

function hasCurrentPracticalTenpaiMetrics(bundle: CachedSimulationBundle): boolean {
  return Object.values(bundle.checkpoints).every((checkpoint) => !checkpoint
    || (
      checkpoint.result.practicalTenpaiScoringVersion === PRACTICAL_TENPAI_SCORING_VERSION
      && Number.isFinite(checkpoint.result.practicalTenpaiScore)
    ));
}

export function writeSimulationBundle(
  value: Omit<CachedSimulationBundle, "createdAt" | "expiresAt">,
): CachedSimulationBundle {
  const createdAt = Date.now();
  const bundle: CachedSimulationBundle = {
    ...value,
    createdAt,
    expiresAt: createdAt + SIMULATION_CACHE_TTL_MS,
    checkpoints: stripDebugLogs(value.checkpoints),
  };
  setMemoryCache(bundle.cacheKey, bundle);
  const storage = getStorage();
  if (!storage) return bundle;
  pruneSimulationCache(storage);
  const id = stableCacheId(bundle.cacheKey);
  try {
    storage.setItem(`${ENTRY_PREFIX}${id}`, JSON.stringify(bundle));
    const nextIndex = readIndex(storage)
      .filter((entry) => entry.cacheKey !== bundle.cacheKey)
      .concat({ id, cacheKey: bundle.cacheKey, createdAt, expiresAt: bundle.expiresAt })
      .sort((left, right) => right.createdAt - left.createdAt);
    for (const stale of nextIndex.slice(SIMULATION_CACHE_MAX_ENTRIES)) {
      storage.removeItem(`${ENTRY_PREFIX}${stale.id}`);
      memoryCache.delete(stale.cacheKey);
    }
    storage.setItem(INDEX_KEY, JSON.stringify(nextIndex.slice(0, SIMULATION_CACHE_MAX_ENTRIES)));
  } catch {
    // sessionStorage can be unavailable or full; the in-memory cache still works.
  }
  return bundle;
}

export function stableCacheId(value: string): string {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(36);
}

function pruneSimulationCache(storage: Storage): void {
  const now = Date.now();
  const valid = readIndex(storage).filter((entry) => {
    if (entry.expiresAt > now) return true;
    storage.removeItem(`${ENTRY_PREFIX}${entry.id}`);
    memoryCache.delete(entry.cacheKey);
    return false;
  });
  try {
    storage.setItem(INDEX_KEY, JSON.stringify(valid.slice(0, SIMULATION_CACHE_MAX_ENTRIES)));
  } catch {
    // Ignore restricted storage environments.
  }
}

function readIndex(storage: Storage): CacheIndexItem[] {
  try {
    const parsed = JSON.parse(storage.getItem(INDEX_KEY) ?? "[]") as CacheIndexItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getStorage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.sessionStorage;
  } catch {
    return null;
  }
}

function setMemoryCache(cacheKey: string, bundle: CachedSimulationBundle): void {
  memoryCache.delete(cacheKey);
  memoryCache.set(cacheKey, bundle);
  while (memoryCache.size > SIMULATION_CACHE_MAX_ENTRIES) {
    const oldestKey = memoryCache.keys().next().value as string | undefined;
    if (oldestKey === undefined) break;
    memoryCache.delete(oldestKey);
  }
}

function stripDebugLogs(
  checkpoints: Partial<Record<SimulationRoleId, RoleSimulationCheckpoint>>,
): Partial<Record<SimulationRoleId, RoleSimulationCheckpoint>> {
  return Object.fromEntries(Object.entries(checkpoints).map(([roleId, checkpoint]) => [
    roleId,
    checkpoint ? { ...checkpoint, result: { ...checkpoint.result, debugTrials: undefined } } : checkpoint,
  ])) as Partial<Record<SimulationRoleId, RoleSimulationCheckpoint>>;
}

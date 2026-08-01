import { beforeEach, describe, expect, it } from "vitest";

import {
  LruCache,
  getSimulationCounterSnapshot,
  normalShanten,
  resetSimulationCounters,
} from "../src";

describe("bounded simulation cache", () => {
  beforeEach(() => resetSimulationCounters());

  it("evicts the least recently used entry", () => {
    const cache = new LruCache<string, number>(2);
    cache.set("a", 1).set("b", 2);
    expect(cache.get("a")).toBe(1);
    cache.set("c", 3);

    expect(cache.get("a")).toBe(1);
    expect(cache.get("b")).toBeUndefined();
    expect(cache.get("c")).toBe(3);
    expect(cache.size).toBe(2);
  });

  it("records cache activity without exceeding the configured bound", () => {
    const cache = new LruCache<number, number>(2);
    cache.set(1, 1).set(2, 2).set(3, 3);
    cache.get(3);
    cache.get(1);
    const counters = getSimulationCounterSnapshot();

    expect(counters.cacheHitCount).toBe(1);
    expect(counters.cacheMissCount).toBe(1);
    expect(counters.peakCacheEntryCount).toBe(2);
  });

  it("reuses a normal shanten result for the same normalized hand", () => {
    const hand = [4, 0, 1, 0, 2, 0, 1, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0];
    const first = normalShanten(hand);
    const beforeSecond = getSimulationCounterSnapshot();
    const second = normalShanten(hand);
    const afterSecond = getSimulationCounterSnapshot();

    expect(second).toBe(first);
    expect(afterSecond.shantenCalculationCount).toBe(beforeSecond.shantenCalculationCount);
    expect(afterSecond.cacheHitCount).toBeGreaterThan(beforeSecond.cacheHitCount);
  });
});

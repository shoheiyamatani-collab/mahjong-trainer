import { describe, expect, it } from "vitest";

import { recommendedSimulationWorkerCount } from "../src";

describe("simulation worker policy", () => {
  it("uses one worker for low load mode and low-end devices", () => {
    expect(recommendedSimulationWorkerCount({ hardwareConcurrency: 16, deviceMemoryGb: 16, lowLoadMode: true })).toBe(1);
    expect(recommendedSimulationWorkerCount({ hardwareConcurrency: 2, deviceMemoryGb: 8 })).toBe(1);
    expect(recommendedSimulationWorkerCount({ hardwareConcurrency: 8, deviceMemoryGb: 2 })).toBe(1);
  });

  it("uses two workers for mobile-class devices", () => {
    expect(recommendedSimulationWorkerCount({ hardwareConcurrency: 4, deviceMemoryGb: 4 })).toBe(2);
  });

  it("caps desktop-class devices at four workers", () => {
    expect(recommendedSimulationWorkerCount({ hardwareConcurrency: 8, deviceMemoryGb: 8 })).toBe(4);
    expect(recommendedSimulationWorkerCount({ hardwareConcurrency: 32, deviceMemoryGb: 32 })).toBe(4);
  });
});

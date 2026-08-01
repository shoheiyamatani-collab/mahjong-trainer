import { describe, expect, it } from "vitest";

import {
  createRoleSimulationSession,
  parseHand,
  runChantaSimulation,
  runChiitoitsuSimulation,
  runFlushSimulation,
  runIkkitsuukanSimulation,
  runPinfuSimulation,
  runRiichiSimulation,
  runSanshokuSimulation,
  runTanyaoSimulation,
  runToitoiSimulation,
  type ChantaSimulationInput,
  type SimulationRoleId,
} from "../src";

const input: ChantaSimulationInput = {
  initialHand: parseHand("123m456m789p22s東東"),
  trials: 2,
  seed: 20260723,
  debug: false,
};

describe("resumable role simulation sessions", () => {
  const cases: Array<{
    roleId: SimulationRoleId;
    run: (value: ChantaSimulationInput) => ReturnType<typeof runTanyaoSimulation>;
  }> = [
    { roleId: "chanta", run: runChantaSimulation },
    { roleId: "flush", run: runFlushSimulation },
    { roleId: "chiitoitsu", run: runChiitoitsuSimulation },
    { roleId: "ikkitsuukan", run: runIkkitsuukanSimulation },
    { roleId: "toitoi", run: runToitoiSimulation },
    { roleId: "pinfu", run: runPinfuSimulation },
    { roleId: "tanyao", run: runTanyaoSimulation },
    { roleId: "sanshoku", run: runSanshokuSimulation },
    { roleId: "riichi", run: runRiichiSimulation },
  ];

  it.each(cases)("matches a monolithic $roleId run after batching", ({ roleId, run }) => {
    const expected = run(input);
    const session = createRoleSimulationSession(input, roleId);

    session.runBatch(1);
    const actual = session.runBatch(1);

    expect(actual).toEqual(expected);
  });

  it.each(cases)("restores a $roleId checkpoint without rerunning trials", ({ roleId, run }) => {
    const expected = run(input);
    const first = createRoleSimulationSession(input, roleId);
    first.runBatch(1);
    const checkpoint = first.createCheckpoint();
    expect(checkpoint?.completedTrials).toBe(1);

    const resumed = createRoleSimulationSession(input, roleId, checkpoint ?? undefined);
    const actual = resumed.runBatch(1);

    expect(actual).toEqual(expected);
    expect(resumed.completedTrials).toBe(2);
  });
});

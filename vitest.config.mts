import { defineConfig } from "vitest/config";

export default defineConfig({
  // Next preserves JSX for its build; tests need executable JSX instead.
  esbuild: { jsx: "automatic" },
  test: {
    include: ["**/*.test.{ts,tsx}"],
    maxWorkers: 2,
    // Deterministic simulations and the independent enumeration oracle are CPU
    // bound; avoid contention-dependent failures on CI and smaller machines.
    testTimeout: 30_000
  }
});

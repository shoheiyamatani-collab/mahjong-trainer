import { expect, it } from "vitest";

it("keeps the 500 transformed score questions consistent with their base han, fu and limits", async () => {
  // Import runs the catalogue's existing server-side validation of all 500 poses.
  await expect(import("./page")).resolves.toHaveProperty("default");
});

import { access, readFile, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = path.resolve(workspaceRoot, "apps/web/out");
const isReviewMode = process.env.ADSENSE_REVIEW_MODE === "true";

if (!isReviewMode) {
  console.log("AdSense Review Mode is off; all generated route families remain published.");
  process.exit(0);
}

const policyPath = path.resolve(workspaceRoot, "packages/content-index-policy/src/publicationPolicy.json");
const { reviewModeUnpublishedRoutePrefixes } = JSON.parse(await readFile(policyPath, "utf8"));

for (const routePrefix of reviewModeUnpublishedRoutePrefixes) {
  const normalizedPrefix = routePrefix.replace(/^\/+|\/+$/g, "");
  const target = path.resolve(outputRoot, normalizedPrefix);
  const relative = path.relative(outputRoot, target);

  if (!normalizedPrefix || relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Refusing to remove a path outside static output: ${target}`);
  }
  if (target !== path.resolve(outputRoot, normalizedPrefix)) {
    throw new Error(`Unexpected static output target: ${target}`);
  }

  try {
    await access(target);
  } catch (error) {
    if (error?.code === "ENOENT") {
      console.log(`No generated output for ${routePrefix}; nothing to remove.`);
      continue;
    }
    throw error;
  }

  await rm(target, { recursive: true, force: true });
  console.log(`Temporarily unpublished generated route family: ${routePrefix}`);
}

import { cp, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

const workspaceRoot = resolve(import.meta.dirname, "..");
const source = resolve(workspaceRoot, "apps/mleague/out");
const destination = resolve(workspaceRoot, "apps/web/out/mleague");

await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
await cp(source, destination, { recursive: true });

process.stdout.write(`Merged M League static output into ${destination}\n`);

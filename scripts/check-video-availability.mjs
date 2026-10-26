import { readFile, writeFile } from "node:fs/promises";

const inventory = JSON.parse(await readFile(new URL("../output/content-audit-input.json", import.meta.url), "utf8"));
const videos = new Map();
for (const guide of inventory.guides) videos.set(guide.youtubeId, { id: guide.youtubeId, title: guide.title, routes: [guide.articleHref] });
for (const [list, clips] of Object.entries(inventory.clipLists)) {
  for (const clip of clips) {
    const previous = videos.get(clip.id);
    if (previous) previous.routes.push(`mleague:${list}`);
    else videos.set(clip.id, { id: clip.id, title: clip.title, routes: [`mleague:${list}`] });
  }
}
const queue = [...videos.values()];
const results = [];
async function worker() {
  while (queue.length) {
    const video = queue.shift();
    const endpoint = new URL("https://www.youtube.com/oembed");
    endpoint.searchParams.set("url", `https://www.youtube.com/watch?v=${video.id}`);
    endpoint.searchParams.set("format", "json");
    try {
      const response = await fetch(endpoint, { signal: AbortSignal.timeout(15000) });
      const metadata = response.ok ? await response.json() : null;
      results.push({ ...video, status: response.status, titleAtCheck: metadata?.title, authorAtCheck: metadata?.author_name });
    } catch (error) {
      results.push({ ...video, status: "unconfirmed", error: error.message });
    }
  }
}
await Promise.all([worker(), worker(), worker()]);
results.sort((a, b) => a.id.localeCompare(b.id));
const report = {
  checkedAt: new Date().toISOString(),
  method: "Official YouTube oEmbed metadata. Success does not verify video contents or guarantee playback; failures are not proof of deletion.",
  results
};
await writeFile(new URL("../output/video-availability.json", import.meta.url), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ total: results.length, availableMetadata: results.filter((item) => item.status === 200).length,
  needsManualCheck: results.filter((item) => item.status !== 200) }, null, 2));

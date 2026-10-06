import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import { gunzipSync } from "node:zlib";
import { resolve, dirname, basename, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseTenhouXml, MAX_LOG_BYTES } from "./parser";
import { generateTedashiQuestions } from "./questions";
import { approvedQuestions } from "./publication";
import { syntheticXml } from "./fixtures";
import { generateRequestedQuestion, type RequestedCandidate } from "./requested";
import { collectReadingCandidates, selectReadingQuestions, type ReadingSource } from "./reading";
import type { LogSource, TedashiQuestion } from "./types";

const root = fileURLToPath(new URL("../../../", import.meta.url));
const args = process.argv.slice(2);
const command = args.shift();
const input = args[0] && !args[0].startsWith("--") ? resolve(process.env.INIT_CWD ?? root, args.shift()!) : null;
const option = (name: string) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const json = async (path: string, data: unknown) => { await mkdir(dirname(path), { recursive: true }); await writeFile(path, JSON.stringify(data, null, 2) + "\n", "utf8"); console.log(path); };
const out = (fallback: string) => resolve(process.env.INIT_CWD ?? root, option("--out") ?? fallback);
async function load(path: string) {
  const bytes = await readFile(path);
  const compressed = bytes[0] === 31 && bytes[1] === 139;
  const xml = (compressed ? gunzipSync(bytes, { maxOutputLength: MAX_LOG_BYTES }) : bytes).toString("utf8");
  const logId = basename(path).replace(/\.(xml|mjlog)(\.gz)?$/i, "");
  const synthetic = args.includes("--synthetic");
  const realId = /^\d{10}gm-[0-9a-f]{4}-[0-9a-f]{4,5}-[0-9a-f]{8}$/.test(logId);
  const source: LogSource = { sourceType: synthetic ? "synthetic" : "tenhou", logId, date: !synthetic && realId ? `${logId.slice(0, 4)}-${logId.slice(4, 6)}-${logId.slice(6, 8)}` : null, url: !synthetic && realId ? `https://tenhou.net/0/?log=${encodeURIComponent(logId)}` : null };
  return parseTenhouXml(xml, source);
}
async function files(path: string): Promise<string[]> {
  if (/\.(xml|mjlog)(\.gz)?$/i.test(path)) return [path];
  const entries = await readdir(path, { withFileTypes: true });
  const result: string[] = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const child = join(path, entry.name);
    if (entry.isDirectory()) result.push(...await files(child));
    else if (/\.(xml|mjlog)(\.gz)?$/i.test(entry.name)) result.push(child);
  }
  return result;
}

async function main() {
  if (command === "fixtures") {
    const directory = join(root, "data/tenhou/synthetic"); await mkdir(directory, { recursive: true });
    const questions: TedashiQuestion[] = [];
    for (const [i, suit] of (["m", "p", "s"] as const).entries()) for (let start = 2; start <= 5; start += 1) {
      const name = `synthetic-${suit}-${start}`; const xml = syntheticXml(suit, start, i * 4 + start - 2);
      await writeFile(join(directory, `${name}.xml`), xml);
      const log = parseTenhouXml(xml, { sourceType: "synthetic", logId: name, date: null, url: null });
      questions.push(...generateTedashiQuestions(log).filter((q) => q.status === "candidate"));
    }
    if (questions.length < 10) throw new Error("合成fixture問題が10問未満です");
    await json(join(root, "apps/web/app/training/tedashi-reading/data/synthetic.json"), questions);
    console.log(`synthetic only: ${questions.length} questions; never publish as Tenhou logs`); return;
  }
  if (!input) throw new Error("ローカルの牌譜ファイルまたはディレクトリを指定してください");
  if (command === "review") {
    const data = JSON.parse(await readFile(input, "utf8")) as TedashiQuestion[];
    const id = args.shift(); const status = args.shift();
    const q = data.find((question) => question.id === id);
    if (!q || !["approved", "rejected", "candidate"].includes(status ?? "")) throw new Error("問題IDとcandidate/approved/rejectedを指定してください");
    if (status === "approved") {
      const permissionReference = option("--permission-reference")?.trim();
      if (!permissionReference) throw new Error("天鳳の利用確認記録を--permission-referenceで指定してください");
      q.review = { contentHash: q.contentHash, reviewedAt: new Date().toISOString(), permissionReference }; q.status = "approved";
      if (!approvedQuestions([q]).length) throw new Error("合成・曖昧・改変済み・鳳凰卓以外の問題は公開承認できません");
    } else { q.status = status as TedashiQuestion["status"]; delete q.review; }
    await json(input, data); return;
  }
  if (command === "parse" || command === "inspect") {
    const log = await load(input);
    if (command === "parse") await json(out(`data/generated/${log.source.logId}.parsed.json`), log);
    else console.log(JSON.stringify({ source: log.source, table: log.table, rounds: log.rounds.map((round) => ({ ...round.info, events: round.events.length, discards: round.events.filter((e) => e.type === "discard").map((e) => ({ ...e, snapshots: undefined })) })) }, null, 2));
    return;
  }
  if (command === "generate") {
    const paths = await files(input); if (!paths.length) throw new Error("牌譜ファイルがありません");
    const questions: TedashiQuestion[] = [];
    for (const path of paths) questions.push(...generateTedashiQuestions(await load(path)));
    const unique = new Map<string, TedashiQuestion>();
    for (const question of questions) { if (unique.has(question.id)) throw new Error(`問題ID重複: ${question.id}`); unique.set(question.id, question); }
    await json(out("data/generated/tedashi-training.json"), [...unique.values()]);
    console.log(`candidate=${questions.filter((q) => q.status === "candidate").length}, rejected=${questions.filter((q) => q.status === "rejected").length}`);
    return;
  }
  if (command === "requested") {
    const requests = JSON.parse(await readFile(input, "utf8")) as RequestedCandidate[];
    const questions: TedashiQuestion[] = [];
    for (const request of requests) questions.push(generateRequestedQuestion(await load(join(root, "data/tenhou/local", `${request.logId}.xml`)), request));
    await json(out("data/generated/requested-questions.json"), questions);
    console.log(questions.map((q) => `${q.source.logId} ${q.source.round} ${q.source.honba}本場 ${q.source.seat} ${q.source.turn}巡目: ${q.analysis.summary}`).join("\n"));
    return;
  }
  if (command === "publish") {
    const questions = JSON.parse(await readFile(input, "utf8")) as TedashiQuestion[];
    const approved = approvedQuestions(questions);
    await json(out("apps/web/app/training/tedashi-reading/data/approved.json"), approved);
    console.log(`approved=${approved.length}`); return;
  }
  if (command === "curate") {
    const sources = JSON.parse(await readFile(input, "utf8")) as ReadingSource[];
    if (!sources.length || new Set(sources.map((s) => s.logId)).size !== sources.length) throw new Error("教材ソースが空または重複しています");
    const limit = Number(option("--limit") ?? 30);
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) throw new Error("--limitは1〜100です");
    const all: TedashiQuestion[] = [];
    const reports = [];
    for (const source of sources) {
      const log = await load(join(root, "data/tenhou/local", `${source.logId}.xml`));
      const result = collectReadingCandidates(log, source);
      all.push(...result.candidates);
      reports.push({ logId: source.logId, priority: source.priority, rounds: log.rounds.length, events: log.rounds.reduce((n, r) => n + r.events.length, 0), candidates: result.candidates.filter((q) => q.status === "candidate").length, rejected: result.rejected, targets: source.targets.length });
    }
    const selected = selectReadingQuestions(all, sources, limit);
    await json(out("data/generated/reading-questions.json"), selected);
    await json(join(root, "data/generated/reading-candidates.json"), all);
    await json(join(root, "data/generated/reading-report.json"), { generatedAt: new Date().toISOString(), total: all.length, selected: selected.length, sources: reports.map((r) => ({ ...r, selected: selected.filter((q) => q.source.logId === r.logId).length })), questions: selected.map((q) => ({ id: q.id, category: q.analysis.category, source: q.source, selection: q.selection, summary: q.analysis.summary })) });
    console.log(`selected=${selected.length}, candidates=${all.filter((q) => q.status === "candidate").length}, rejected=${reports.reduce((n, r) => n + r.rejected.length, 0) + all.filter((q) => q.status === "rejected").length}`);
    console.log(reports.map((r) => `${r.logId}: selected=${selected.filter((q) => q.source.logId === r.logId).length}, rounds=${r.rounds}, events=${r.events}`).join("\n"));
    return;
  }
  throw new Error("parse / inspect / generate / requested / curate / review / publish / fixturesを指定してください");
}
main().catch((error: unknown) => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; });

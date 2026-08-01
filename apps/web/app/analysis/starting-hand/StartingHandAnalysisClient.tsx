"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  HAND_TARGET_RANKING_STRATEGIES,
  TILE_NAMES,
  buildHandTargetRankingCacheKey,
  countsToTiles,
  createHandTargetRankingResult,
  emptyCounts,
  parseHand,
  recommendedSimulationWorkerCount,
  sortHandTargetRankingItems,
  sumCounts,
  tileIndex,
  type Counts34,
  type HandTargetRankingItem,
  type HandTargetRankingResult,
  type HandTargetRankingRoleId,
  type HandTargetRankingSort,
  type RoleSimulationCheckpoint,
  type RoleSimulationResult,
  type SimulationRoleId,
  type Tile,
} from "@mahjong-trainer/mahjong-core";

import { readSimulationBundle, writeSimulationBundle } from "./simulationResultCache";
import {
  CooperativeSimulationRunner,
  SimulationWorkerPool,
  type SimulationRunner,
  type SimulationStageProgress,
} from "./simulationWorkerPool";
import type { SimulationPerformanceMetrics } from "./simulationWorkerProtocol";

const SAMPLE_HAND = "12m789m19p789s東東白";
const IMAGE_SUFFIX = "-66-90-l-emb.png";
const HONOR_IMAGE_NUMBERS = new Map<string, number>([
  ["東", 1], ["南", 2], ["西", 3], ["北", 4], ["白", 5], ["發", 6], ["中", 7],
]);

export type AnalysisRoleId = HandTargetRankingRoleId | "pinfu";
type AnalysisMode = "ranking" | "single";

export interface RankingContext {
  rank?: number;
  practicalTenpaiScore?: number;
  tenpaiRate?: number;
  declarationRate?: number;
  winRate?: number;
  aiVersion?: string;
  ruleVersion?: string;
}

export interface StartingHandAnalysisClientProps {
  initialMode?: AnalysisMode;
  initialRoleId?: AnalysisRoleId;
  initialCounts?: Counts34;
  initialTrials?: number;
  initialSeed?: number;
  initialCacheKey?: string;
  rankingContext?: RankingContext;
}

const ANALYSIS_ROLES: Array<{
  id: AnalysisRoleId;
  name: string;
  shortName: string;
}> = [
  { id: "chanta", name: "純チャン・チャンタAI", shortName: "純チャン・チャンタ" },
  { id: "flush", name: "染め手（ホンイツ・チンイツ）AI", shortName: "ホンイツ・チンイツ" },
  { id: "chiitoitsu", name: "七対子全力狙いAI", shortName: "七対子" },
  { id: "ikkitsuukan", name: "一気通貫全力狙いAI", shortName: "一気通貫" },
  { id: "toitoi", name: "対々和全力狙いAI", shortName: "対々和" },
  { id: "pinfu", name: "平和単独分析AI", shortName: "平和" },
  { id: "tanyao", name: "タンヤオ全力狙いAI", shortName: "タンヤオ" },
  { id: "sanshoku", name: "三色同順全力狙いAI", shortName: "三色同順" },
  { id: "riichi", name: "リーチ全力狙いAI", shortName: "リーチ" },
];

type RankingQuality = "fast" | "standard";

const RANKING_SORT_OPTIONS: ReadonlyArray<{ value: HandTargetRankingSort; label: string; description: string }> = [
  { value: "practical", label: "総合評価", description: "実戦スコア順" },
  { value: "tenpai", label: "成立しやすさ", description: "総テンパイ率順" },
  { value: "turn12", label: "速度重視", description: "12巡以内率順" },
  { value: "preemptive", label: "先制重視", description: "先制テンパイ率順" },
  { value: "averageTurn", label: "平均巡目", description: "早い順" },
];

function isRankingSort(value: string | null): value is HandTargetRankingSort {
  return RANKING_SORT_OPTIONS.some((option) => option.value === value);
}

export function StartingHandAnalysisClient({
  initialMode = "ranking",
  initialRoleId = "chanta",
  initialCounts,
  initialTrials = 1_000,
  initialSeed = 20260718,
  initialCacheKey,
  rankingContext,
}: StartingHandAnalysisClientProps = {}) {
  const [counts, setCounts] = useState<Counts34>(() => initialCounts?.slice() ?? emptyCounts());
  const [trials, setTrials] = useState(initialTrials);
  const [rankingQuality, setRankingQuality] = useState<RankingQuality>(initialTrials <= 100 ? "fast" : "standard");
  const [baseSeed, setBaseSeed] = useState(initialSeed);
  const [mode, setMode] = useState<AnalysisMode>(initialMode);
  const [selectedRoleId, setSelectedRoleId] = useState<AnalysisRoleId>(initialRoleId);
  const [debug, setDebug] = useState(false);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<RoleSimulationResult | null>(null);
  const [rankingResult, setRankingResult] = useState<HandTargetRankingResult | null>(null);
  const [progress, setProgress] = useState<SimulationStageProgress | null>(null);
  const [stageLabel, setStageLabel] = useState<string | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<Partial<Record<SimulationRoleId, SimulationPerformanceMetrics>>>({});
  const [lowLoadMode, setLowLoadMode] = useState(false);
  const [workerCount, setWorkerCount] = useState(0);
  const [runnerMode, setRunnerMode] = useState<SimulationRunner["mode"]>("worker");
  const [error, setError] = useState<string | null>(null);
  const poolRef = useRef<SimulationRunner | null>(null);
  const activeAnalysisIdRef = useRef<string | null>(null);
  const checkpointRef = useRef<Partial<Record<SimulationRoleId, RoleSimulationCheckpoint>>>({});
  const lastProgressUpdateRef = useRef(0);
  const mountedRef = useRef(false);
  const tiles = useMemo(() => countsToTiles(counts), [counts]);
  const selectedRole = ANALYSIS_ROLES.find((role) => role.id === selectedRoleId)!;

  useEffect(() => {
    mountedRef.current = true;
    const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    const count = recommendedSimulationWorkerCount({
      hardwareConcurrency: navigator.hardwareConcurrency,
      deviceMemoryGb: deviceMemory,
      lowLoadMode,
    });
    let pool: SimulationRunner;
    try {
      pool = new SimulationWorkerPool(count);
    } catch {
      pool = new CooperativeSimulationRunner();
    }
    poolRef.current = pool;
    setWorkerCount(pool.size);
    setRunnerMode(pool.mode);
    return () => {
      mountedRef.current = false;
      pool.dispose();
      if (poolRef.current === pool) poolRef.current = null;
    };
  }, [lowLoadMode]);

  useEffect(() => {
    if (!initialCacheKey) return;
    const cached = readSimulationBundle(initialCacheKey);
    if (!cached) return;
    if (mode === "ranking") {
      if (!hasAllCheckpoints(cached.checkpoints, HAND_TARGET_RANKING_STRATEGIES.map((strategy) => strategy.id))) return;
      checkpointRef.current = cached.checkpoints;
      setRankingQuality(cached.targetTrials <= 100 ? "fast" : "standard");
      setRankingResult(rankingFromCheckpoints(
        cached.checkpoints,
        cached.hand,
        cached.targetTrials,
        cached.baseSeed,
      ));
      setPerformanceMetrics(cached.metrics);
      return;
    }
    const checkpoint = cached?.checkpoints[selectedRoleId];
    if (!checkpoint) return;
    checkpointRef.current = { [selectedRoleId]: checkpoint };
    setResult(checkpoint.result);
    setPerformanceMetrics(cached?.metrics ?? {});
  }, [initialCacheKey, mode, selectedRoleId]);

  const clearResults = () => {
    setResult(null);
    setRankingResult(null);
    setProgress(null);
    setStageLabel(null);
    setPerformanceMetrics({});
    checkpointRef.current = {};
  };

  const addTile = (tile: Tile) => {
    const index = tileIndex(tile);
    if (sumCounts(counts) >= 13 || counts[index]! >= 4) return;
    setCounts((current) => {
      const next = current.slice();
      next[index] += 1;
      return next;
    });
    clearResults();
  };

  const removeTile = (tile: Tile) => {
    const index = tileIndex(tile);
    setCounts((current) => {
      const next = current.slice();
      next[index] -= 1;
      return next;
    });
    clearResults();
  };

  const run = async () => {
    if (sumCounts(counts) !== 13) {
      setError("配牌を13枚選んでください。");
      return;
    }
    const pool = poolRef.current;
    if (!pool) {
      setError("分析処理の準備中です。少し待ってからもう一度押してください。");
      return;
    }
    const analysisId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    activeAnalysisIdRef.current = analysisId;
    lastProgressUpdateRef.current = 0;
    setRunning(true);
    setProgress(null);
    if (mode === "ranking") setRankingResult(null);
    else setResult(null);
    setError(null);
    try {
      if (mode === "ranking") {
        await runRankingAnalysis(pool, analysisId);
      } else {
        await runSingleAnalysis(pool, analysisId);
      }
    } catch (runError) {
      if (runError instanceof DOMException && runError.name === "AbortError") return;
      if (mountedRef.current && activeAnalysisIdRef.current === analysisId) {
        setError(runError instanceof Error ? runError.message : "分析処理に失敗しました。");
      }
    } finally {
      if (mountedRef.current && activeAnalysisIdRef.current === analysisId) {
        activeAnalysisIdRef.current = null;
        setRunning(false);
        setProgress(null);
        setStageLabel(null);
      }
    }
  };

  const runRankingAnalysis = async (pool: SimulationRunner, analysisId: string) => {
    const roles = HAND_TARGET_RANKING_STRATEGIES.map((strategy) => strategy.id);
    const targetTrials = rankingQuality === "fast" ? 100 : 1_000;
    const finalKey = buildHandTargetRankingCacheKey(counts, targetTrials, baseSeed);
    const finalCached = readSimulationBundle(finalKey);
    if (finalCached && hasAllCheckpoints(finalCached.checkpoints, roles)) {
      checkpointRef.current = finalCached.checkpoints;
      setRankingResult(rankingFromCheckpoints(finalCached.checkpoints, counts, targetTrials, baseSeed));
      setPerformanceMetrics(finalCached.metrics);
      setStageLabel("保存済み結果を表示");
      return;
    }

    let checkpoints: Partial<Record<SimulationRoleId, RoleSimulationCheckpoint>> = {};
    let metrics: Partial<Record<SimulationRoleId, SimulationPerformanceMetrics>> = {};
    if (targetTrials > 100) {
      const quickKey = buildHandTargetRankingCacheKey(counts, 100, baseSeed);
      const quickCached = readSimulationBundle(quickKey);
      if (quickCached && hasAllCheckpoints(quickCached.checkpoints, roles)) {
        checkpoints = quickCached.checkpoints;
        metrics = quickCached.metrics;
        checkpointRef.current = checkpoints;
        setRankingResult(rankingFromCheckpoints(checkpoints, counts, 100, baseSeed));
      }
    }

    if (!hasAllCheckpoints(checkpoints, roles)) {
      setStageLabel("速報を計算中（各AI 100試行）");
      const quick = await pool.runStage({
        analysisId,
        roles,
        initialHand: counts,
        targetTrials: 100,
        seed: baseSeed,
        debug: false,
        batchSize: 10,
        onProgress: setProgressFor(analysisId),
      });
      checkpoints = quick.checkpoints;
      metrics = quick.metrics;
      checkpointRef.current = checkpoints;
      const quickRanking = rankingFromCheckpoints(checkpoints, counts, 100, baseSeed);
      setRankingResult(quickRanking);
      setPerformanceMetrics(metrics);
      writeSimulationBundle({ cacheKey: quickRanking.cacheKey, hand: counts, targetTrials: 100, baseSeed, checkpoints, metrics });
    }

    if (targetTrials === 1_000) {
      setStageLabel("標準精度へ更新中（各AI 100 → 1000試行）");
      const standard = await pool.runStage({
        analysisId,
        roles,
        initialHand: counts,
        targetTrials,
        seed: baseSeed,
        debug: false,
        batchSize: 10,
        checkpoints,
        onProgress: setProgressFor(analysisId),
      });
      checkpoints = standard.checkpoints;
      metrics = mergeMetrics(metrics, standard.metrics);
      checkpointRef.current = checkpoints;
      const ranking = rankingFromCheckpoints(checkpoints, counts, targetTrials, baseSeed);
      setRankingResult(ranking);
      setPerformanceMetrics(metrics);
      writeSimulationBundle({ cacheKey: ranking.cacheKey, hand: counts, targetTrials, baseSeed, checkpoints, metrics });
    }
  };

  const runSingleAnalysis = async (pool: SimulationRunner, analysisId: string) => {
    const targetTrials = trials;
    const cacheKey = `${buildHandTargetRankingCacheKey(counts, targetTrials, baseSeed)}|single:${selectedRoleId}`;
    const cached = readSimulationBundle(cacheKey);
    const cachedCheckpoint = cached?.checkpoints[selectedRoleId];
    if (cachedCheckpoint) {
      checkpointRef.current = { [selectedRoleId]: cachedCheckpoint };
      setResult(cachedCheckpoint.result);
      setPerformanceMetrics(cached?.metrics ?? {});
      setStageLabel("保存済み結果を表示");
      return;
    }
    const existing = checkpointRef.current[selectedRoleId];
    if (existing && existing.completedTrials >= targetTrials) {
      setResult(existing.result);
      return;
    }
    setStageLabel(`${selectedRole.shortName}AIを${targetTrials.toLocaleString("ja-JP")}試行中`);
    const output = await pool.runStage({
      analysisId,
      roles: [selectedRoleId],
      initialHand: counts,
      targetTrials,
      seed: baseSeed,
      debug,
      batchSize: debug ? 1 : 10,
      checkpoints: existing ? { [selectedRoleId]: existing } : undefined,
      onProgress: setProgressFor(analysisId),
    });
    const checkpoint = output.checkpoints[selectedRoleId];
    if (!checkpoint) throw new Error("分析結果を取得できませんでした。");
    checkpointRef.current = { [selectedRoleId]: checkpoint };
    setResult(checkpoint.result);
    setPerformanceMetrics(output.metrics);
    if (!debug) {
      writeSimulationBundle({
        cacheKey,
        hand: counts,
        targetTrials,
        baseSeed,
        checkpoints: { [selectedRoleId]: checkpoint },
        metrics: output.metrics,
      });
    }
  };

  const setProgressFor = (analysisId: string) => (next: SimulationStageProgress) => {
    const now = Date.now();
    if (
      mountedRef.current
      && activeAnalysisIdRef.current === analysisId
      && (next.completedTrials >= next.totalTrials || now - lastProgressUpdateRef.current >= 100)
    ) {
      lastProgressUpdateRef.current = now;
      setProgress(next);
    }
  };

  const cancel = () => {
    const analysisId = activeAnalysisIdRef.current;
    if (!analysisId) return;
    poolRef.current?.cancel(analysisId);
    activeAnalysisIdRef.current = null;
    setRunning(false);
    setProgress(null);
    setStageLabel("計算を中止しました");
  };

  return (
    <main className="siteMain startingHandAnalysis">
      <header className="analysisPageHeader">
        <div>
          <p className="siteEyebrow">Starting Hand Analysis</p>
          <h1>手役何狙う？チェッカー</h1>
          <p>配牌から7つの手役とリーチ戦略を進め、テンパイ率・到達速度・先制しやすさを比較します。</p>
        </div>
        <Link className="analysisHelpLink" href="/analysis/starting-hand/help">確率の計算条件・AIの考え方を見る</Link>
      </header>

      <div className="analysisModeSwitch" role="group" aria-label="分析方法">
        <button type="button" className={mode === "ranking" ? "selected" : ""} aria-pressed={mode === "ranking"} disabled={running} onClick={() => { setMode("ranking"); clearResults(); }}>8戦略を比較</button>
        <button type="button" className={mode === "single" ? "selected" : ""} aria-pressed={mode === "single"} disabled={running} onClick={() => { setMode("single"); clearResults(); }}>AIを単独分析</button>
      </div>

      {rankingContext ? <RankingContextBanner context={rankingContext} /> : null}

      {mode === "single" ? (
        <section className="analysisRolePicker" aria-labelledby="analysis-role-heading">
          <h2 id="analysis-role-heading">単独分析するAI</h2>
          <div className="analysisRoleOptions">
            {ANALYSIS_ROLES.map((role) => (
              <button
                className={`${role.id} ${selectedRoleId === role.id ? "selected" : ""}`}
                type="button"
                aria-pressed={selectedRoleId === role.id}
                onClick={() => {
                  setSelectedRoleId(role.id);
                  clearResults();
                  setError(null);
                }}
                disabled={running}
                key={role.id}
              >
                <strong>{role.name}</strong>
              </button>
            ))}
          </div>
        </section>
      ) : (
        <section className="analysisComparisonIntro" aria-label="比較対象">
          <div><strong>比較する8つの狙い</strong><span>各AIは同じ配牌・試行回数・乱数シードで独立して対局します。</span></div>
          <ul>{HAND_TARGET_RANKING_STRATEGIES.map((strategy) => <li key={strategy.id}>{strategy.name}{strategy.category === "RIICHI_TARGET" ? <small>門前テンパイ戦略</small> : null}</li>)}</ul>
        </section>
      )}

      <section className="analysisWorkspace">
        <article className="analysisInputPanel">
          <div className="analysisPanelHeading">
            <h2>配牌</h2>
            <strong>{sumCounts(counts)} / 13</strong>
          </div>
          <div className="analysisHandStrip" style={{ "--analysis-tile-count": Math.max(tiles.length, 1) } as React.CSSProperties}>
            {tiles.length ? tiles.map((tile, index) => (
              <button type="button" onClick={() => removeTile(tile)} key={`${tile}-${index}`} aria-label={`${tile}を外す`}>
                <img src={tileImageSrc(tile)} alt={tile} />
              </button>
            )) : <span>下の牌を押して13枚選んでください</span>}
          </div>
          <div className="analysisInputActions">
            <button type="button" onClick={() => { setCounts(emptyCounts()); clearResults(); }}>クリア</button>
            <button type="button" onClick={() => { setCounts(parseHand(SAMPLE_HAND)); clearResults(); }}>サンプル</button>
          </div>
          <TileSelector counts={counts} onSelect={addTile} />
        </article>

        <aside className="analysisRunPanel">
          <h2>分析条件</h2>
          {mode === "ranking" ? (
            <div className="analysisQualityControl" role="group" aria-label="分析精度">
              <span>分析精度</span>
              <div>
                <button type="button" className={rankingQuality === "fast" ? "selected" : ""} aria-pressed={rankingQuality === "fast"} disabled={running} onClick={() => { setRankingQuality("fast"); clearResults(); }}>高速<small>各AI 100試行</small></button>
                <button type="button" className={rankingQuality === "standard" ? "selected" : ""} aria-pressed={rankingQuality === "standard"} disabled={running} onClick={() => { setRankingQuality("standard"); clearResults(); }}>標準<small>各AI 1000試行</small></button>
              </div>
            </div>
          ) : (
            <label className="analysisField">
              <span>試行回数</span>
              <select value={trials} onChange={(event) => { setTrials(Number(event.target.value)); clearResults(); }} disabled={running}>
                <option value={100}>100回（高速）</option>
                <option value={1000}>1,000回（標準）</option>
                <option value={10000}>10,000回（詳細）</option>
              </select>
            </label>
          )}
          <label className="analysisField">
            <span>基準乱数シード</span>
            <input type="number" min={1} step={1} value={baseSeed} onChange={(event) => { setBaseSeed(Math.max(1, Number(event.target.value) || 1)); clearResults(); }} disabled={running} />
          </label>
          <label className="analysisDebugToggle">
            <input type="checkbox" checked={lowLoadMode} onChange={(event) => setLowLoadMode(event.target.checked)} disabled={running} />
            低負荷モード（ワーカー1本）
          </label>
          <p className="analysisWorkerStatus">
            {runnerMode === "worker"
              ? `この端末では ${workerCount || 1} 本の計算ワーカーを使用します。`
              : "計算ワーカーを使えないため、画面操作を止めない小分け計算で実行します。"}
          </p>
          {process.env.NODE_ENV !== "production" ? (
            <label className="analysisDebugToggle">
              <input type="checkbox" checked={debug} onChange={(event) => setDebug(event.target.checked)} />
              開発用の巡目ログを記録
            </label>
          ) : null}
          <button className="analysisRunButton" type="button" onClick={run} disabled={running || sumCounts(counts) !== 13}>
            {running
              ? progress
                ? `${progress.completedTrials.toLocaleString("ja-JP")} / ${progress.totalTrials.toLocaleString("ja-JP")} 試行`
                : "計算を準備中…"
              : mode === "ranking" ? "8つの狙いを比較" : trials >= 10_000 ? "10,000回で詳しく分析" : `${selectedRole.shortName}を分析`}
          </button>
          {running ? <button className="analysisCancelButton" type="button" onClick={cancel}>計算を中止</button> : null}
          {stageLabel ? <p className="analysisStageLabel" aria-live="polite">{stageLabel}</p> : null}
          {running && progress ? <progress className="analysisProgress" max={progress.totalTrials} value={progress.completedTrials} /> : null}
          <p className="analysisRunNote">{mode === "ranking" ? "標準ではまず100試行の速報を表示し、その結果を1000試行まで継続します。" : "詳細10,000試行は選択したAIだけを計算します。"}</p>
          <Link href="/analysis/starting-hand/help#simulation-rules">分析条件を確認する</Link>
          {error ? <p className="analysisError" role="alert">{error}</p> : null}
        </aside>
      </section>

      {rankingResult ? <HandTargetRanking result={rankingResult} counts={counts} /> : null}
      {result ? <AnalysisResult result={result} /> : null}
      {process.env.NODE_ENV !== "production" && Object.keys(performanceMetrics).length ? <PerformanceMetrics metrics={performanceMetrics} /> : null}
    </main>
  );
}

function RankingContextBanner({ context }: { context: RankingContext }) {
  return (
    <aside className="analysisRankingContext">
      <strong>ランキングから引き継いだ比較結果</strong>
      <span>{context.rank ? `${context.rank}位` : "順位なし"}</span>
      {context.practicalTenpaiScore != null ? <span>実戦テンパイスコア {score(context.practicalTenpaiScore)}</span> : null}
      <span>テンパイ到達率 {context.tenpaiRate == null ? "—" : percent(context.tenpaiRate)}</span>
      {context.declarationRate != null ? <span>リーチ宣言率 {percent(context.declarationRate)}</span> : null}
      {context.winRate != null ? <span>成立アガリ率 {percent(context.winRate)}</span> : null}
      {context.aiVersion ? <span>AI版 {context.aiVersion}</span> : null}
      {context.ruleVersion ? <span>ルール版 {context.ruleVersion}</span> : null}
    </aside>
  );
}

function HandTargetRanking({ result, counts }: { result: HandTargetRankingResult; counts: Counts34 }) {
  const [sort, setSort] = useState<HandTargetRankingSort>("practical");
  const persistRankingUrl = (next: HandTargetRankingSort) => {
    const url = new URL(window.location.href);
    url.searchParams.set("sort", next);
    url.searchParams.set("hand", counts.join(","));
    url.searchParams.set("trials", String(result.trials));
    url.searchParams.set("seed", String(result.baseSeed));
    url.searchParams.set("cacheKey", result.cacheKey);
    window.history.replaceState(null, "", url);
  };
  useEffect(() => {
    const querySort = new URLSearchParams(window.location.search).get("sort");
    const next = isRankingSort(querySort) ? querySort : "practical";
    setSort(next);
    persistRankingUrl(next);
    // The ranking result identifies all values persisted in the URL.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const items = useMemo(() => sortHandTargetRankingItems(result.items, sort), [result.items, sort]);
  const leader = items[0]!;
  const changeSort = (next: HandTargetRankingSort) => {
    setSort(next);
    persistRankingUrl(next);
  };
  return (
    <section className="analysisRankingSection" aria-labelledby="ranking-heading">
      <header className="analysisRankingHeader">
        <div>
          <p className="siteEyebrow">Strategy Ranking</p>
          <p className={`analysisRankingStage ${result.trials >= 1_000 ? "standard" : "quick"}`}>{result.trials >= 1_000 ? "標準結果" : "暫定結果"}　各AI {result.trials.toLocaleString("ja-JP")}試行</p>
          <h2 id="ranking-heading">この配牌で実戦的にテンパイへ進みやすい狙い</h2>
        </div>
        <p>{leader.roleName}が、テンパイの速さと他家リーチへの先制を合わせた実戦テンパイスコアで首位です。実戦の正解を断定するものではありません。</p>
      </header>
      <div className="analysisRankingSort" role="group" aria-label="ランキングの並び順">
        {RANKING_SORT_OPTIONS.map((option) => (
          <button type="button" className={sort === option.value ? "selected" : ""} aria-pressed={sort === option.value} onClick={() => changeSort(option.value)} key={option.value}>
            <strong>{option.label}</strong><small>{option.description}</small>
          </button>
        ))}
      </div>
      <div className="analysisRankingGrid">
        {items.map((item) => <RankingCard item={item} result={result} counts={counts} sort={sort} key={item.roleId} />)}
      </div>
      <p className="analysisIndependentNote">7つの手役AIとリーチAIは別々に独立して試行します。8つの割合は合計100%へ正規化していません。</p>
    </section>
  );
}

function RankingCard({ item, result, counts, sort }: { item: HandTargetRankingItem; result: HandTargetRankingResult; counts: Counts34; sort: HandTargetRankingSort }) {
  const query = new URLSearchParams({
    hand: counts.join(","),
    trials: String(result.trials),
    seed: String(result.baseSeed),
    rank: String(item.rank),
    practicalTenpaiScore: String(item.practicalTenpaiScore),
    tenpaiRate: String(item.tenpaiRate),
    winRate: String(item.winRate),
    aiVersion: item.aiVersion,
    ruleVersion: item.ruleVersion,
    cacheKey: result.cacheKey,
    sort,
  });
  if (item.riichiDetails) query.set("declarationRate", String(item.riichiDetails.declarationRate));
  return (
    <article className={`analysisRankingCard ${item.roleId}`}>
      <div className="analysisRankBadge">{item.rank}<small>位</small></div>
      <div className="analysisRankingCardTitle">
        <h3>{item.roleName}</h3>
        <span>{item.strategyCategory === "RIICHI_TARGET" ? "門前テンパイ戦略" : item.shortDescription}</span>
      </div>
      <Metric label="実戦テンパイスコア" value={score(item.practicalTenpaiScore)} primary />
      <div className="analysisRankingSubmetrics">
        <Metric label="テンパイ到達率" value={percent(item.tenpaiRate)} />
        <Metric label="12巡目まで" value={percent(item.tenpaiByTurn12Rate)} />
        <Metric label="先制テンパイ率" value={percent(item.preemptiveTenpaiRate)} />
        <Metric label="平均テンパイ到達巡目" value={turn(item.averageFirstTenpaiTurn)} />
      </div>
      <details className="analysisRankingDetails">
        <summary>内訳を見る</summary>
        <dl>
          <div><dt>イーシャンテン到達率</dt><dd>{percent(item.iishantenRate)}</dd></div>
          <div><dt>追っかけテンパイ率</dt><dd>{percent(item.chasingTenpaiRate)}</dd></div>
          <div><dt>6巡目までのテンパイ率</dt><dd>{percent(item.tenpaiByTurn6Rate)}</dd></div>
          <div><dt>15巡目までのテンパイ率</dt><dd>{percent(item.tenpaiByTurn15Rate)}</dd></div>
          <div><dt>成立アガリ率</dt><dd>{percent(item.winRate)}</dd></div>
          <div><dt>有効試行数</dt><dd>{item.validTrials.toLocaleString("ja-JP")}回</dd></div>
          {item.riichiDetails ? <div><dt>リーチ宣言率</dt><dd>{percent(item.riichiDetails.declarationRate)}</dd></div> : null}
          {item.riichiDetails ? <div><dt>宣言後アガリ率</dt><dd>{item.riichiDetails.postRiichiWinRate == null ? "—" : percent(item.riichiDetails.postRiichiWinRate)}</dd></div> : null}
          {item.riichiDetails ? <div><dt>平均リーチ巡目</dt><dd>{turn(item.riichiDetails.averageRiichiTurn)}</dd></div> : null}
          {item.riichiDetails ? <div><dt>リーチ時の平均待ち残り</dt><dd>{item.riichiDetails.averageWaitLiveCountAtDeclaration == null ? "—" : `${item.riichiDetails.averageWaitLiveCountAtDeclaration.toFixed(1)}枚`}</dd></div> : null}
          {item.riichiDetails ? <div><dt>ロン / ツモ</dt><dd>{item.riichiDetails.ronWinCount}回 / {item.riichiDetails.tsumoWinCount}回</dd></div> : null}
        </dl>
      </details>
      <div className="analysisRankingLinks">
        <Link href={`${item.detailPath}?${query.toString()}`}>{item.strategyCategory === "RIICHI_TARGET" ? "リーチ戦略を詳しく分析" : "この手役を詳しく分析"}</Link>
        <Link href={`/analysis/starting-hand/help#strategy-${item.helpAnchor}`}>AIの判断条件を見る</Link>
      </div>
    </article>
  );
}

function AnalysisResult({ result }: { result: RoleSimulationResult }) {
  const flush = result.details?.flush;
  const chiitoitsu = result.details?.chiitoitsu;
  const ikkitsuukan = result.details?.ikkitsuukan;
  const toitoi = result.details?.toitoi;
  const pinfu = result.details?.pinfu;
  const tanyao = result.details?.tanyao;
  const sanshoku = result.details?.sanshoku;
  const riichi = result.details?.riichi;
  return (
    <article className={`analysisResultSection ${result.roleId}`}>
      <div className="analysisResultTitle">
        <div>
          <p className="siteEyebrow">Simulation Result</p>
          <h2>{result.roleName}</h2>
        </div>
        <Link href={`/analysis/starting-hand/help#strategy-${result.roleId}`}>このAIの判定条件を見る</Link>
      </div>
      <section className="analysisPracticalTenpai" aria-labelledby="practical-tenpai-heading">
        <div>
          <p className="siteEyebrow">Practical Tenpai</p>
          <h3 id="practical-tenpai-heading">実戦テンパイスコア</h3>
          <strong>{score(result.practicalTenpaiScore)}</strong>
          <span>到達巡目と他家リーチへの先制を加味</span>
        </div>
        <div className="analysisPracticalSummary">
          <Metric label="総テンパイ率" value={percent(result.rawTenpaiRate)} />
          <Metric label="12巡目まで" value={percent(result.tenpaiByTurn12Rate)} />
          <Metric label="先制テンパイ率" value={percent(result.preemptiveTenpaiRate)} />
          <Metric label="追っかけテンパイ率" value={percent(result.chasingTenpaiRate)} />
        </div>
      </section>
      <TenpaiTurnDistribution result={result} />
      <div className="analysisPrimaryMetrics">
        <Metric label="成立アガリ率" value={percent(result.winRate)} primary />
        <Metric label="テンパイ到達率" value={percent(result.tenpaiRate)} />
        <Metric label="イーシャンテン到達率" value={percent(result.iishantenRate)} />
      </div>
      {flush ? (
        <div className="analysisFlushBreakdown" aria-label="染め手の内訳">
          <Metric label="ホンイツ" value={percent(flush.honitsuWinRate)} />
          <Metric label="チンイツ" value={percent(flush.chinitsuWinRate)} />
        </div>
      ) : null}
      {chiitoitsu ? (
        <div className="analysisFlushBreakdown" aria-label="七対子の進行内訳">
          <Metric label="配牌の平均対子数" value={`${chiitoitsu.averageInitialPairKindCount.toFixed(2)}組`} />
          <Metric label="最大平均対子数" value={`${chiitoitsu.averageMaximumPairKindCount.toFixed(2)}組`} />
          <Metric label="テンパイ時の平均生き枚数" value={`${chiitoitsu.averageLiveWaitCountAtTenpai.toFixed(2)}枚`} />
        </div>
      ) : null}
      {ikkitsuukan ? (
        <div className="analysisFlushBreakdown" aria-label="一気通貫の進行内訳">
          <Metric label="萬子の成功" value={`${ikkitsuukan.manSuitWinCount}回`} />
          <Metric label="筒子の成功" value={`${ikkitsuukan.pinSuitWinCount}回`} />
          <Metric label="索子の成功" value={`${ikkitsuukan.souSuitWinCount}回`} />
        </div>
      ) : null}
      {toitoi ? (
        <div className="analysisFlushBreakdown toitoi" aria-label="対々和の進行内訳">
          <Metric label="平均ポン回数" value={`${toitoi.averagePonCount.toFixed(2)}回`} />
          <Metric label="配牌の平均対子数" value={`${toitoi.averageInitialPairKindCount.toFixed(2)}組`} />
          <Metric label="最大平均対子数" value={`${toitoi.averageMaximumPairKindCount.toFixed(2)}組`} />
          <Metric label="テンパイ時の平均生き枚数" value={toitoi.averageWaitLiveCountAtTenpai == null ? "—" : `${toitoi.averageWaitLiveCountAtTenpai.toFixed(2)}枚`} />
        </div>
      ) : null}
      {pinfu ? (
        <div className="analysisFlushBreakdown pinfu" aria-label="平和の進行内訳">
          <Metric label="平均待ち種類数" value={pinfu.averageWaitKindCountAtTenpai == null ? "—" : `${pinfu.averageWaitKindCountAtTenpai.toFixed(2)}種`} />
          <Metric label="平均待ち残り枚数" value={pinfu.averageWaitLiveCountAtTenpai == null ? "—" : `${pinfu.averageWaitLiveCountAtTenpai.toFixed(2)}枚`} />
          <Metric label="最大平均完成順子" value={`${pinfu.averageMaximumCompletedSequenceCount.toFixed(2)}組`} />
          <Metric label="最大平均両面ターツ" value={`${pinfu.averageMaximumRyanmenTaatsuCount.toFixed(2)}組`} />
        </div>
      ) : null}
      {tanyao ? (
        <>
          <div className="analysisRuleBadge">計算条件：喰いタンあり</div>
          <div className="analysisFlushBreakdown tanyao" aria-label="タンヤオの進行内訳">
            <Metric label="平均待ち種類数" value={tanyao.averageTargetWaitKindCountAtTenpai == null ? "—" : `${tanyao.averageTargetWaitKindCountAtTenpai.toFixed(2)}種`} />
            <Metric label="平均待ち残り枚数" value={tanyao.averageTargetWaitLiveCountAtTenpai == null ? "—" : `${tanyao.averageTargetWaitLiveCountAtTenpai.toFixed(2)}枚`} />
            <Metric label="配牌の平均1・9・字牌" value={`${tanyao.averageInitialTerminalHonorCount.toFixed(2)}枚`} />
            <Metric label="最大平均両面ターツ" value={`${tanyao.averageMaximumRyanmenTaatsuCount.toFixed(2)}組`} />
          </div>
        </>
      ) : null}
      {sanshoku ? (
        <div className="analysisFlushBreakdown sanshoku" aria-label="三色同順の進行内訳">
          <Metric label="平均待ち種類数" value={sanshoku.averageTargetWaitKindCountAtTenpai == null ? "—" : `${sanshoku.averageTargetWaitKindCountAtTenpai.toFixed(2)}種`} />
          <Metric label="平均待ち残り枚数" value={sanshoku.averageTargetWaitLiveCountAtTenpai == null ? "—" : `${sanshoku.averageTargetWaitLiveCountAtTenpai.toFixed(2)}枚`} />
          <Metric label="最大平均完成必須順子" value={`${sanshoku.averageMaximumCompletedRequiredSequenceCount.toFixed(2)}組`} />
          <Metric label="平均副露回数" value={`${sanshoku.averageCallCount.toFixed(2)}回`} />
        </div>
      ) : null}
      {riichi ? (
        <>
          <div className="analysisRuleBadge riichi">計算条件：門前・非フリテンで即リーチ</div>
          <div className="analysisFlushBreakdown riichi" aria-label="リーチの進行内訳">
            <Metric label="リーチ宣言率" value={percent(riichi.declarationRate)} />
            <Metric label="宣言後アガリ率" value={riichi.winAfterDeclarationRate == null ? "—" : percent(riichi.winAfterDeclarationRate)} />
            <Metric label="宣言時の平均待ち種類" value={riichi.averageWaitKindCountAtDeclaration == null ? "—" : `${riichi.averageWaitKindCountAtDeclaration.toFixed(2)}種`} />
            <Metric label="宣言時の平均待ち残り" value={riichi.averageWaitLiveCountAtDeclaration == null ? "—" : `${riichi.averageWaitLiveCountAtDeclaration.toFixed(2)}枚`} />
          </div>
        </>
      ) : null}
      <div className="analysisSecondaryMetrics">
        <Metric label="平均アガリ巡目" value={turn(result.averageWinTurn)} />
        <Metric label="平均テンパイ到達巡目" value={turn(result.averageFirstTenpaiTurn)} />
        <Metric label="平均イーシャンテン到達巡目" value={turn(result.averageFirstIishantenTurn)} />
        <Metric label="他家アガリ率" value={percent(result.opponentWinRate)} />
        <Metric label="流局率" value={percent(result.drawRate)} />
        <Metric label="成立不能率" value={percent(result.targetImpossibleRate)} />
      </div>
      <div className="analysisTrialCount">有効試行数：<strong>{result.validTrials.toLocaleString("ja-JP")}回</strong></div>
      <details className="analysisDetails">
        <summary>回数と内訳を見る</summary>
        <dl>
          <div><dt>総試行数</dt><dd>{result.totalTrials.toLocaleString("ja-JP")}回</dd></div>
          <div><dt>イーシャンテン到達</dt><dd>{result.iishantenReachCount.toLocaleString("ja-JP")}回</dd></div>
          <div><dt>テンパイ到達</dt><dd>{result.tenpaiReachCount.toLocaleString("ja-JP")}回</dd></div>
          <div><dt>6巡目までのテンパイ</dt><dd>{result.tenpaiByTurn6Count.toLocaleString("ja-JP")}回</dd></div>
          <div><dt>8巡目までのテンパイ</dt><dd>{result.tenpaiByTurn8Count.toLocaleString("ja-JP")}回</dd></div>
          <div><dt>10巡目までのテンパイ</dt><dd>{result.tenpaiByTurn10Count.toLocaleString("ja-JP")}回</dd></div>
          <div><dt>12巡目までのテンパイ</dt><dd>{result.tenpaiByTurn12Count.toLocaleString("ja-JP")}回</dd></div>
          <div><dt>15巡目までのテンパイ</dt><dd>{result.tenpaiByTurn15Count.toLocaleString("ja-JP")}回</dd></div>
          <div><dt>先制 / 追っかけテンパイ</dt><dd>{result.preemptiveTenpaiCount}回 / {result.chasingTenpaiCount}回</dd></div>
          <div><dt>{result.roleName}成立アガリ</dt><dd>{result.winCount.toLocaleString("ja-JP")}回</dd></div>
          {flush ? <div><dt>ホンイツ / チンイツ</dt><dd>{flush.honitsuWinCount}回 / {flush.chinitsuWinCount}回</dd></div> : null}
          {flush ? <div><dt>萬子 / 筒子 / 索子</dt><dd>{flush.manSuitWinCount}回 / {flush.pinSuitWinCount}回 / {flush.souSuitWinCount}回</dd></div> : null}
          {chiitoitsu ? <div><dt>平均待ち変更回数</dt><dd>{chiitoitsu.averageWaitChangeCount.toFixed(2)}回</dd></div> : null}
          {chiitoitsu ? <div><dt>終了時の平均対子数</dt><dd>{chiitoitsu.averageFinalPairKindCount.toFixed(2)}組</dd></div> : null}
          {ikkitsuukan ? <div><dt>萬子 / 筒子 / 索子</dt><dd>{ikkitsuukan.manSuitWinCount}回 / {ikkitsuukan.pinSuitWinCount}回 / {ikkitsuukan.souSuitWinCount}回</dd></div> : null}
          {ikkitsuukan ? <div><dt>必須順子 / 対象外面子の平均副露</dt><dd>{ikkitsuukan.averageRequiredSequenceCallCount.toFixed(2)}回 / {ikkitsuukan.averageExtraMeldCallCount.toFixed(2)}回</dd></div> : null}
          {ikkitsuukan ? <div><dt>試行中の最大平均完成順子数</dt><dd>{ikkitsuukan.averageMaximumCompletedRequiredSequenceCount.toFixed(2)}組</dd></div> : null}
          {toitoi ? <div><dt>シャンポン / 単騎からの成功</dt><dd>{toitoi.shanponWinCount}回 / {toitoi.tankiWinCount}回</dd></div> : null}
          {toitoi ? <div><dt>配牌時 / 試行中最大の平均対子数</dt><dd>{toitoi.averageInitialPairKindCount.toFixed(2)}組 / {toitoi.averageMaximumPairKindCount.toFixed(2)}組</dd></div> : null}
          {toitoi ? <div><dt>配牌時 / 試行中最大の平均刻子数</dt><dd>{toitoi.averageInitialTripletKindCount.toFixed(2)}組 / {toitoi.averageMaximumTripletKindCount.toFixed(2)}組</dd></div> : null}
          {toitoi ? <div><dt>門前 / 副露あり成功</dt><dd>{toitoi.closedWinCount}回 / {toitoi.openWinCount}回</dd></div> : null}
          {toitoi ? <div><dt>平均ポン / チー回数</dt><dd>{toitoi.averagePonCount.toFixed(2)}回 / {toitoi.averageChiCount.toFixed(2)}回</dd></div> : null}
          {pinfu ? <div><dt>数牌雀頭 / 非役牌風雀頭の成功</dt><dd>{pinfu.suitedPairWinCount}回 / {pinfu.nonValueWindPairWinCount}回</dd></div> : null}
          {pinfu ? <div><dt>平和でないアガリの見逃し</dt><dd>{pinfu.skippedNonPinfuWinCount}回</dd></div> : null}
          {tanyao ? <div><dt>通常形 / 七対子形の成功</dt><dd>{tanyao.standardWinCount}回 / {tanyao.chiitoitsuWinCount}回</dd></div> : null}
          {tanyao ? <div><dt>門前 / 副露あり成功</dt><dd>{tanyao.closedWinCount}回 / {tanyao.openWinCount}回</dd></div> : null}
          {tanyao ? <div><dt>平均チー / ポン回数</dt><dd>{tanyao.averageChiCount.toFixed(2)}回 / {tanyao.averagePonCount.toFixed(2)}回</dd></div> : null}
          {tanyao ? <div><dt>配牌時 / 試行中最小の平均1・9・字牌</dt><dd>{tanyao.averageInitialTerminalHonorCount.toFixed(2)}枚 / {tanyao.averageMinimumTerminalHonorCount.toFixed(2)}枚</dd></div> : null}
          {tanyao ? <div><dt>タンヤオでないアガリの見逃し</dt><dd>{tanyao.skippedNonTanyaoWinCount}回</dd></div> : null}
          {tanyao ? <div><dt>喰いタン / リーチ</dt><dd>{tanyao.openTanyaoEnabled ? "あり" : "なし"} / {tanyao.riichiCount}回</dd></div> : null}
          {sanshoku ? <div><dt>123 / 234 / 345 / 456の成功</dt><dd>{sanshoku.sequence123WinCount}回 / {sanshoku.sequence234WinCount}回 / {sanshoku.sequence345WinCount}回 / {sanshoku.sequence456WinCount}回</dd></div> : null}
          {sanshoku ? <div><dt>567 / 678 / 789の成功</dt><dd>{sanshoku.sequence567WinCount}回 / {sanshoku.sequence678WinCount}回 / {sanshoku.sequence789WinCount}回</dd></div> : null}
          {sanshoku ? <div><dt>門前 / 副露あり成功</dt><dd>{sanshoku.closedWinCount}回 / {sanshoku.openWinCount}回</dd></div> : null}
          {sanshoku ? <div><dt>必須順子 / 追加面子の平均副露</dt><dd>{sanshoku.averageRequiredSequenceCallCount.toFixed(2)}回 / {sanshoku.averageExtraMeldCallCount.toFixed(2)}回</dd></div> : null}
          {sanshoku ? <div><dt>三色でないアガリの見逃し / リーチ</dt><dd>{sanshoku.skippedNonSanshokuWinCount}回 / {sanshoku.riichiCount}回</dd></div> : null}
          {riichi ? <div><dt>宣言試行 / 正式成立</dt><dd>{riichi.declarationAttemptCount}回 / {riichi.declarationCount}回</dd></div> : null}
          {riichi ? <div><dt>宣言牌放銃 / 宣言前アガリ見逃し</dt><dd>{riichi.declarationDealInCount}回 / {riichi.skippedPreDeclarationWinCount}回</dd></div> : null}
          {riichi ? <div><dt>宣言時持ち点 / 供託</dt><dd>{riichi.startingPoints.toLocaleString("ja-JP")}点 / {riichi.riichiCost.toLocaleString("ja-JP")}点</dd></div> : null}
          <div><dt>門前成功 / 副露成功</dt><dd>{result.closedWinCount}回 / {result.openWinCount}回</dd></div>
          <div><dt>ロン / ツモ</dt><dd>{result.ronWinCount}回 / {result.tsumoWinCount}回</dd></div>
          <div><dt>平均副露回数</dt><dd>{result.averageCallCount.toFixed(2)}回</dd></div>
          <div><dt>無効試行</dt><dd>{result.invalidTrials}回</dd></div>
        </dl>
      </details>
      {result.debugTrials?.length ? (
        <details className="analysisDebugLog">
          <summary>開発用の1試行ログを見る</summary>
          {result.debugTrials[0]!.map((turnLog, index) => (
            <article key={`${turnLog.turn}-${index}`}>
              <strong>{turnLog.turn}巡目</strong>
              {turnLog.hand ? <p>手牌：{turnLog.hand.join(" ")}</p> : null}
              <p>通常向聴数：{turnLog.normalShanten} / 役専用向聴数：{turnLog.targetShanten}</p>
              {turnLog.completedTripletCount != null ? <p>完成刻子：{turnLog.completedTripletCount}組 / 副露刻子：{turnLog.openTripletCount ?? 0}組 / 対子：{turnLog.pairKindCount ?? 0}種類 / 雀頭候補：{turnLog.headCandidateCount ?? 0}種類</p> : null}
              {turnLog.toitoiWaits ? <p>待ち：{turnLog.toitoiWaits.join("、") || "なし"} / 待ち形：{turnLog.toitoiWaitType ?? "なし"} / 残り：{turnLog.toitoiWaitLiveCount ?? 0}枚</p> : null}
              {turnLog.tanyaoWaits ? <p>タンヤオ待ち：{turnLog.tanyaoWaits.join("、") || "なし"} / 種類：{turnLog.tanyaoWaitKindCount ?? 0}種 / 残り：{turnLog.tanyaoWaitLiveCount ?? 0}枚</p> : null}
              {turnLog.terminalHonorCount != null ? <p>1・9・字牌：{turnLog.terminalHonorCount}枚 / 中張牌：{turnLog.simpleTileCount ?? 0}枚 / 採用形：{turnLog.tanyaoBestShape ?? "なし"}</p> : null}
              {turnLog.tanyaoStandardShanten != null ? <p>通常形専用向聴：{turnLog.tanyaoStandardShanten} / 七対子専用向聴：{turnLog.tanyaoChiitoitsuShanten}</p> : null}
              {turnLog.sanshokuBestSequenceStart != null ? <p>三色候補：{turnLog.sanshokuBestSequenceStart}{turnLog.sanshokuBestSequenceStart + 1}{turnLog.sanshokuBestSequenceStart + 2} / 固定：{turnLog.sanshokuLockedSequenceStart == null ? "なし" : `${turnLog.sanshokuLockedSequenceStart}${turnLog.sanshokuLockedSequenceStart + 1}${turnLog.sanshokuLockedSequenceStart + 2}`}</p> : null}
              {turnLog.sanshokuManProgress != null ? <p>萬子 / 筒子 / 索子の進行：{turnLog.sanshokuManProgress} / {turnLog.sanshokuPinProgress ?? 0} / {turnLog.sanshokuSouProgress ?? 0}</p> : null}
              {turnLog.sanshokuWaits ? <p>三色待ち：{turnLog.sanshokuWaits.join("、") || "なし"} / 種類：{turnLog.sanshokuWaitKindCount ?? 0}種 / 残り：{turnLog.sanshokuWaitLiveCount ?? 0}枚</p> : null}
              {turnLog.riichiWaits ? <p>リーチ待ち：{turnLog.riichiWaits.join("、") || "なし"} / 種類：{turnLog.riichiWaitKindCount ?? 0}種 / 残り：{turnLog.riichiWaitLiveCount ?? 0}枚 / フリテン：{turnLog.riichiFuriten ? "あり" : "なし"}</p> : null}
              {turnLog.riichiPoints != null ? <p>持ち点：{turnLog.riichiPoints.toLocaleString("ja-JP")}点 / 牌山：{turnLog.riichiWallTilesRemaining ?? 0}枚 / 宣言可能：{turnLog.riichiCanDeclare ? "はい" : "いいえ"}</p> : null}
              {turnLog.riichiDeclarationAttempted ? <p>宣言牌：{turnLog.riichiDeclarationTile ?? "—"} / リーチ成立：{turnLog.riichiEstablished ? "はい" : "いいえ"} / 成立巡目：{turnLog.riichiEstablishedTurn ?? "—"}</p> : null}
              {turnLog.completedSequenceCount != null ? <p>完成順子：{turnLog.completedSequenceCount}組 / 両面：{turnLog.ryanmenTaatsuCount ?? 0}組 / 嵌張：{turnLog.kanchanTaatsuCount ?? 0}組 / 辺張：{turnLog.penchanTaatsuCount ?? 0}組</p> : null}
              {turnLog.targetEffectiveTiles.length ? <p>専用有効牌：{turnLog.targetEffectiveTiles.map((tile) => `${tile.tile}(${tile.remaining})`).join("、")}</p> : null}
              {turnLog.selectedDiscard ? <p>選択打牌：{turnLog.selectedDiscard}</p> : null}
              {turnLog.toitoiCallDecision ? <p>ポン候補：{turnLog.toitoiCallDecision.tile} / 判断：{turnLog.toitoiCallDecision.call ? "ポン" : "見送り"} / 理由：{turnLog.toitoiCallDecision.reason}</p> : null}
              {turnLog.tanyaoCallDecision ? <p>鳴き候補：{turnLog.tanyaoCallDecision.meld.tiles.join(" ")} / 判断：{turnLog.tanyaoCallDecision.call ? "鳴く" : "見送り"} / 理由：{turnLog.tanyaoCallDecision.reason}</p> : null}
              {turnLog.sanshokuCallDecision ? <p>鳴き候補：{turnLog.sanshokuCallDecision.meld.tiles.join(" ")} / 判断：{turnLog.sanshokuCallDecision.call ? "鳴く" : "見送り"} / 理由：{turnLog.sanshokuCallDecision.reason}</p> : null}
              {turnLog.decisionReason ? <p>判断理由：{turnLog.decisionReason}</p> : null}
              {turnLog.practicalTenpaiTrialScore != null ? (
                <p>実戦テンパイ：初到達 {turnLog.firstTenpaiTurn ?? "—"}巡（イベント {turnLog.firstTenpaiEventOrder ?? "—"}） / 他家初リーチ {turnLog.firstOpponentRiichiTurn ?? "なし"}巡（イベント {turnLog.firstOpponentRiichiEventOrder ?? "—"}） / 分類 {practicalSituationLabel(turnLog.practicalTenpaiSituation)} / 巡目重み {turnLog.practicalTenpaiTurnWeight?.toFixed(2)} × 状況重み {turnLog.practicalTenpaiSituationWeight?.toFixed(2)} = {turnLog.practicalTenpaiTrialScore.toFixed(2)} / 終了 {turnLog.trialOutcome ?? "—"}</p>
              ) : null}
            </article>
          ))}
        </details>
      ) : null}
      <p className="analysisCaution">確率は設定されたAIと簡略ルールによる参考値です。実戦の最適な打ち方を保証するものではありません。</p>
      <Link className="analysisFootLink" href="/analysis/starting-hand/help#probability-notes">確率の見方と注意事項を確認する</Link>
    </article>
  );
}

function TenpaiTurnDistribution({ result }: { result: RoleSimulationResult }) {
  const rows = [
    ["6巡目まで", result.tenpaiTurnDistribution.throughTurn6Rate],
    ["7〜9巡目", result.tenpaiTurnDistribution.turn7To9Rate],
    ["10〜12巡目", result.tenpaiTurnDistribution.turn10To12Rate],
    ["13〜15巡目", result.tenpaiTurnDistribution.turn13To15Rate],
    ["16巡目以降", result.tenpaiTurnDistribution.turn16PlusRate],
    ["未到達", result.tenpaiTurnDistribution.notReachedRate],
  ] as const;
  return (
    <div className="analysisTenpaiDistribution" aria-label="テンパイ初到達の巡目分布">
      <h3>テンパイ初到達の巡目分布</h3>
      {rows.map(([label, value]) => (
        <div className="analysisDistributionRow" key={label}>
          <span>{label}</span>
          <div><i style={{ width: `${Math.max(0, Math.min(100, value * 100))}%` }} /></div>
          <strong>{percent(value)}</strong>
        </div>
      ))}
    </div>
  );
}

function PerformanceMetrics({
  metrics,
}: {
  metrics: Partial<Record<SimulationRoleId, SimulationPerformanceMetrics>>;
}) {
  return (
    <details className="analysisPerformanceMetrics">
      <summary>開発用パフォーマンス計測</summary>
      <div>
        {Object.entries(metrics).map(([roleId, metric]) => metric ? (
          <article key={roleId}>
            <strong>{roleId}</strong>
            <span>{metric.durationMs.toFixed(0)} ms</span>
            <span>{metric.completedTrials}試行</span>
            <span>平均 {metric.averageTrialDurationMs.toFixed(1)} ms/試行</span>
            <span>キャッシュ命中 {percent(metric.cacheHitRate)}</span>
            <span>向聴計算 {metric.shantenCalculationCount.toLocaleString("ja-JP")}回</span>
            <span>役専用計算 {metric.targetShantenCalculationCount.toLocaleString("ja-JP")}回</span>
            <span>最大キャッシュ {metric.peakCacheEntryCount.toLocaleString("ja-JP")}件</span>
          </article>
        ) : null)}
      </div>
    </details>
  );
}

function Metric({ label, value, primary = false }: { label: string; value: string; primary?: boolean }) {
  return <div className={primary ? "analysisMetric primary" : "analysisMetric"}><span>{label}</span><strong>{value}</strong></div>;
}

function TileSelector({ counts, onSelect }: { counts: Counts34; onSelect: (tile: Tile) => void }) {
  const rows = [TILE_NAMES.slice(0, 9), TILE_NAMES.slice(9, 18), TILE_NAMES.slice(18, 27), TILE_NAMES.slice(27)];
  return (
    <div className="analysisTileSelector" aria-label="牌を追加">
      {rows.map((row, rowIndex) => (
        <div className="analysisTileRow" key={rowIndex}>
          {row.map((tile) => (
            <button type="button" onClick={() => onSelect(tile)} disabled={sumCounts(counts) >= 13 || counts[tileIndex(tile)]! >= 4} key={tile} aria-label={`${tile}を追加`}>
              <img src={tileImageSrc(tile)} alt={tile} />
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

function tileImageSrc(tile: Tile): string {
  if (tile.endsWith("m")) return `/tiles/man${tile[0]}${IMAGE_SUFFIX}`;
  if (tile.endsWith("p")) return `/tiles/pin${tile[0]}${IMAGE_SUFFIX}`;
  if (tile.endsWith("s")) return `/tiles/sou${tile[0]}${IMAGE_SUFFIX}`;
  return `/tiles/ji${HONOR_IMAGE_NUMBERS.get(tile) ?? 1}${IMAGE_SUFFIX}`;
}

function percent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

function score(value: number): string {
  return `${value.toFixed(1)}点`;
}

function practicalSituationLabel(
  value: "BEFORE_OPPONENT_RIICHI" | "AFTER_OPPONENT_RIICHI" | "NOT_REACHED" | undefined,
): string {
  if (value === "BEFORE_OPPONENT_RIICHI") return "先制";
  if (value === "AFTER_OPPONENT_RIICHI") return "追っかけ";
  return "未到達";
}

function turn(value: number | null): string {
  return value == null ? "—" : `${value.toFixed(1)}巡`;
}

function hasAllCheckpoints(
  checkpoints: Partial<Record<SimulationRoleId, RoleSimulationCheckpoint>>,
  roles: readonly HandTargetRankingRoleId[],
): boolean {
  return roles.every((roleId) => checkpoints[roleId] != null);
}

function rankingFromCheckpoints(
  checkpoints: Partial<Record<SimulationRoleId, RoleSimulationCheckpoint>>,
  counts: Counts34,
  trials: number,
  seed: number,
): HandTargetRankingResult {
  const results: Partial<Record<HandTargetRankingRoleId, RoleSimulationResult>> = {};
  for (const strategy of HAND_TARGET_RANKING_STRATEGIES) {
    const checkpoint = checkpoints[strategy.id];
    if (!checkpoint) throw new Error(`${strategy.name}の計算結果がありません。`);
    results[strategy.id] = checkpoint.result;
  }
  return createHandTargetRankingResult(results, counts, trials, seed);
}

function mergeMetrics(
  earlier: Partial<Record<SimulationRoleId, SimulationPerformanceMetrics>>,
  later: Partial<Record<SimulationRoleId, SimulationPerformanceMetrics>>,
): Partial<Record<SimulationRoleId, SimulationPerformanceMetrics>> {
  const merged = { ...earlier };
  for (const [roleId, next] of Object.entries(later) as Array<[SimulationRoleId, SimulationPerformanceMetrics]>) {
    const previous = merged[roleId];
    if (!previous) {
      merged[roleId] = next;
      continue;
    }
    const completedTrials = previous.completedTrials + next.completedTrials;
    const cacheHits = previous.cacheHitCount + next.cacheHitCount;
    const cacheMisses = previous.cacheMissCount + next.cacheMissCount;
    merged[roleId] = {
      durationMs: previous.durationMs + next.durationMs,
      completedTrials,
      averageTrialDurationMs: completedTrials === 0 ? 0 : (previous.durationMs + next.durationMs) / completedTrials,
      cacheHitRate: cacheHits + cacheMisses === 0 ? 0 : cacheHits / (cacheHits + cacheMisses),
      progressMessageCount: previous.progressMessageCount + next.progressMessageCount,
      shantenCalculationCount: previous.shantenCalculationCount + next.shantenCalculationCount,
      targetShantenCalculationCount: previous.targetShantenCalculationCount + next.targetShantenCalculationCount,
      ukeireCalculationCount: previous.ukeireCalculationCount + next.ukeireCalculationCount,
      agariCheckCount: previous.agariCheckCount + next.agariCheckCount,
      waitCalculationCount: previous.waitCalculationCount + next.waitCalculationCount,
      discardEvaluationCount: previous.discardEvaluationCount + next.discardEvaluationCount,
      callEvaluationCount: previous.callEvaluationCount + next.callEvaluationCount,
      cacheHitCount: cacheHits,
      cacheMissCount: cacheMisses,
      detailedLogCount: previous.detailedLogCount + next.detailedLogCount,
      peakCacheEntryCount: Math.max(previous.peakCacheEntryCount, next.peakCacheEntryCount),
    };
  }
  return merged;
}

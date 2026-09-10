# Starting-hand recommendation layer

## Repository investigation

- Route and metadata: `apps/web/app/analysis/starting-hand/page.tsx`; query restoration in `StartingHandQueryClient.tsx`.
- Input and result controller: `StartingHandAnalysisClient.tsx`, 34 integer counts, existing tile images in `public/tiles`.
- Existing eight AI policies: `chantaSimulation.ts`, `flush.ts`, `chiitoitsu.ts`, `ikkitsuukan.ts`, `toitoi.ts`, `tanyao.ts`, `sanshoku.ts`, `riichi.ts`. Pinfu remains a separate legacy detail policy.
- Shared four-player Monte Carlo, calls, furiten, winning checks and resumable RNG: `chantaSimulation.ts`.
- Normal shanten: `shanten.ts`; ukeire: `analyzer.ts` and dedicated role modules; scoring: `handScore.ts` / `scoring.ts`.
- Result scoring: `practicalTenpai.ts` and `startingHandRanking.ts`. Reference ranking uses preemptive tenpai timing, with secondary sort modes.
- Worker orchestration: `simulationWorkerPool.ts`, `simulationWorkerProtocol.ts`, `chanta.worker.ts`. Prior adaptive run was 100 trials for all roles then 1,000 for the best three or four.
- Persistence: `simulationResultCache.ts`, memory plus sessionStorage, eight entries, 24-hour TTL. No account, backend, DB or localStorage needed.
- Deployment: Next static export under `CF_PAGES=1`; no new API routes or server computation.
- Tests: Vitest in `packages/mahjong-core/tests`; there was no ESLint dependency/configuration at investigation time.

## New responsibilities

`packages/mahjong-core/src/recommendation/` contains types, validation, feature extraction, strategy scoring, explanations/tiers, pivot detection, and adaptive sampling. The UI uses `useStrategyRecommendation.ts` / `recommendation.worker.ts` and presents results in `StrategyRecommendations.tsx`. The original eight policies, opponent AI, scoring and shanten functions remain unchanged.

The score is a transparent heuristic, not a calibrated empirical recommendation probability. Exact normal, chiitoitsu and kokushi shanten are distinguished from estimated distances to constrained yaku. Pair/triplet kinds are explicit features; block features use a disjoint decomposition. Seeds can overlap because they are alternatives, not independent melds. Family simulation evidence is never labelled as the probability of a specific 456 sanshoku or pinzu flush.

Weights: speed 22%, ease of winning 15%, value 10%, shape 10%, flexibility 10%, calling 5%, yaku potential 8%, hand compatibility 20%. Commitment, estimated tempo loss and dora conflicts subtract points; poor compatibility caps the result. Values and justifications live together in `evaluate.ts` and are documented in the help page. They require future calibration against expert-reviewed positions.

Yakuhai and kokushi are new analytical strategies, not new Monte Carlo opponents/policies. Wind/dora settings affect the recommendation layer. Existing reference simulations retain their fixed East-round/self-East/no-dora settings and fixed-seed behavior. This deliberate boundary is stated beside the results and in help, and avoids silently changing the historical comparison conditions.

Pivot evaluation compares the same model/evidence before and after every legal draw/discard. Returned deltas are not simulated changes in win probability. The dead-wall indicator is removed from visible availability; the discarded tile is not returned to the wall. Results include the suggested discard and at most five draws.

Adaptive stages are 100, 300, 1,000, optionally 3,000. At most four distinct reference policies are refined per stage. Clear gaps stop early. Existing checkpoints resume without repeating completed trials. The selection uses the new recommendation score and a conservative uncertainty margin, not a formal sequential significance test. Rate error bars use Wilson intervals including zero-success samples.

## Remaining limitations

- Not an adaptive in-game AI, defense/EV engine, or expert-calibrated best-play solver.
- Constrained yaku distance, shape expectation and value expectation remain heuristic. Only normal/chiitoitsu/kokushi shanten is exact here.
- Red-five identity is not represented by the existing 34-count input; no fictional red-dora switch is shown.
- Own wind/dora do not alter legacy reference trials. New yakuhai/kokushi simulation policies can be added later without changing recommendation types.
- No persistence of learner accounts, history or results beyond the existing local cache.

## Verification

Tests cover representative recommendations, double wind counting, all indicator cycles, incompatible dora, disjoint blocks, fractional/invalid hands, four-copy constraints, pivot delta reproduction and staged refinement limits. Pivot suggestions must also remain competitive with the original main plan; gains from a very poor baseline alone do not qualify.

- Complete Vitest suite: 23 files, 281 tests passed, including 26 new recommendation tests. Existing fixed-seed and checkpoint/resumption tests pass.
- Web and core TypeScript checks: passed.
- ESLint with the TypeScript parser and React Hooks rules: passed for all added recommendation code, the changed controller/query components and help files, with zero warnings. Verification-only packages/configuration live under ignored `outputs/lint-tooling`; application manifests and lockfiles were not changed. This is not a new repository-wide lint setup.
- Next.js production compilation and static export: 104 pages generated successfully. No new server/API routes.
- Browser: sample input, random input, removing/adding tiles, manual 12-kind kokushi input, round/seat wind changes, double wind, indicator-to-dora display, and cross-tab query propagation verified.
- Browser: all eight reference AIs completed 100 trials; recommendation evidence and the existing detail section rendered. Cancellation/restart succeeded while the input tab remained usable. Adaptive refinement reused the initial results and started 100 -> 300 for one close AI, requesting only 200 additional trials. The full 3,000-trial workload was not used for the browser smoke test; stage selection and caps are covered by unit tests.
- Responsive checks: desktop 1,280 px and narrow 390/320 px viewports; no horizontal overflow or broken tile images. Detail disclosure controls and score meters remained within the content width. Browser error/warning log was empty during the smoke test.
- Existing UI: checker sample still reports 1p/4p as best, 16 kinds / 54 tiles; score sample reports 2 han / 30 fu / 2,000 points; training mode renders its question and answer controls.

## Changed files

- `packages/mahjong-core/src/index.ts`
- `packages/mahjong-core/src/recommendation/index.ts`
- `packages/mahjong-core/src/recommendation/types.ts`
- `packages/mahjong-core/src/recommendation/features.ts`
- `packages/mahjong-core/src/recommendation/evaluate.ts`
- `packages/mahjong-core/src/recommendation/recommend.ts`
- `packages/mahjong-core/src/recommendation/sampling.ts`
- `packages/mahjong-core/tests/recommendation.test.ts`
- `apps/web/app/analysis/starting-hand/StartingHandAnalysisClient.tsx`
- `apps/web/app/analysis/starting-hand/StartingHandQueryClient.tsx`
- `apps/web/app/analysis/starting-hand/StrategyRecommendations.tsx`
- `apps/web/app/analysis/starting-hand/useStrategyRecommendation.ts`
- `apps/web/app/analysis/starting-hand/recommendation.worker.ts`
- `apps/web/app/analysis/starting-hand/recommendations.css`
- `apps/web/app/analysis/starting-hand/help/page.tsx`
- `apps/web/app/analysis/starting-hand/help/helpContent.ts`
- `apps/web/app/analysis/starting-hand/help/recommendationContent.ts`
- `docs/starting-hand-recommendations.md`

## 実装の要点

おすすめ度は速度22%、アガリやすさ15%、打点10%、良形10%、柔軟性10%、鳴き5%、手役期待8%、配牌適性20%の合算を基本に、速度低下・役固定・ドラ利用の制約を減点します。各軸の意味と実際の式はヘルプおよび `evaluate.ts` に集約しています。

役牌は三元牌と自風・場風を重複なく数え、対子・暗刻・重なりの残り枚数を評価します。ダブ風は1種類で2翻です。国士は么九牌の種類数・対子・専用向聴数と通常手の距離を比較します。ドラは表示牌から求め、保持しやすい構想を評価し、染めや三色の制約で失いやすい場合に減点します。

方針転換は残りがある34種を引き、各打牌後の13枚を同じモデルで比較して抽出します。受け入れの構造部分と重複しないブロック分解は容量制限付きでキャッシュし、残り枚数は表示牌・仮想打牌を含む状態ごとに計算します。

今後は、専門家の配牌レビューに基づく重みの校正、役牌・国士の専用シミュレーション、風・ドラを反映した共通シミュレーション、赤牌の個体表現を追加できます。今回の実装は既存の役固定AIの上に載る学習用評価層であり、途中で方針を変える対局AIや最適期待値の証明ではありません。

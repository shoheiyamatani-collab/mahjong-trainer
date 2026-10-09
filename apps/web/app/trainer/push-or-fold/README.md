# Push or Fold

`pushFoldQuestions.ts` contains fixed, authored lesson specifications. The seed is
the question ID; it fills a reproducible physical snapshot, not a tactical answer.
`pushFoldFactory.ts` allocates 136 physical tiles and keeps hidden audit hands and
wall tiles server-side. This is a snapshot consistency check, not a replay proof.

`pushFoldAnalysis.ts` delegates shanten, ukeire, scoring, riichi eligibility and
endgame settlements to mahjong-core. Safety is per-opponent and fact-based; no
deal-in probabilities or expected-value optimum are claimed.

`page.tsx` validates every published lesson during static generation. Drafts and
inconsistent snapshots fail the build. To add a lesson, author the scenario,
verify its calculated facts, review the recommendation/acceptable alternatives,
then add regression assertions in `pushFold.test.ts`. A future replay importer
can provide the same question shape without changing the UI.

Only clear lessons enter tactical accuracy. Other lessons compare reasoning;
acceptable alternatives are not errors. Optional discard selection has its own
candidate-match score. Versioned localStorage is defensive and optional.

Current restrictions: four players, 100,000 starting total points, one dora
indicator, red fives, open tanyao, chi/pon only, self not already riichi, strict
target rank (tied opponents count ahead), no dealer win-stop. Hidden witnesses establish
possible legal riichi hands, not the full history from the deal. Editorial
recommendations are not specialist-reviewed or empirically calibrated.

Tests: `pnpm --filter @mahjong-trainer/web exec vitest run app/trainer/push-or-fold/pushFold.test.ts`

## Files

- `pushFoldTypes.ts`: serializable question and computed fact types.
- `pushFoldFactory.ts`: deterministic physical snapshots and private audits.
- `pushFoldQuestions.ts`: 20 authored cases per difficulty.
- `pushFoldAnalysis.ts`: validation, safety, core calculations and settlements.
- `pushFoldSession.ts`: selection, separate grading and versioned history.
- `PushFoldQuestionView.tsx`: existing tile art, rivers and factual comparisons.
- `PushFoldTrainingClient.tsx`: 10-question sessions, answers and review.
- `pushFold.module.css`: responsive layout and interaction states.
- `page.tsx`: build-time validation, metadata and independent learning content.
- `pushFold.test.ts`: 76 tests, including all 60 published snapshots and research-ledger equivalence.
- `README.md`: constraints, validation and extension notes.
- `../../../public/tool-screenshots/trainer-push-or-fold.jpg`: real UI screenshot.

Integration edits: `../trainerCatalog.ts`, `../riichi-or-dama/page.tsx`,
`../../learn/guides/practicalGuideData.ts` and
`../../learn/guides/requestedGuideData.ts`. The existing catalogue-driven sitemap
includes the new route without a sitemap rewrite.

## Verification (2026-10-08)

- Workspace `pnpm typecheck`: passed.
- Web Vitest: 190 passed (75 new, 115 existing).
- Core `pnpm test`: 304 passed, including the 365-day daily-question regression.
- Integrated `pnpm build`: 168 web and 1,227 M League pages; Next build/type validation/export passed. No standalone lint command is configured.
- Browser: all three 10-question sets, alternative answers, optional discard,
  review and history restore exercised. Checked 320/390/768/1280-pixel layouts.
- Export: canonical/index/structured data/sitemap verified; private audit omitted.
- Not deployed. Specialist tactical review and replay-based history validation
  remain future work.

## Research milestone 1

`packages/mahjong-core/src/pushFoldEvaluation` now provides round point accounting,
paired fixed-budget Monte Carlo evaluation, uncertainty intervals and calibration
measurements. These are research-only foundations, not a fitted opponent model
or a complete push/fold simulator. No probability estimates were added to this UI.
See `docs/push-fold-research.md` for definitions, validation gates and next steps.

Milestone 1 verification (2026-10-09): core 363, web 191 and Tenhou package 36
tests passed; workspace typecheck and integrated static export passed. The
60-question corpus is cross-checked against the new ledger. No deployment.

Milestone 2A adds an independent scoring oracle, correct winning-group
assignment, missing yaku/yakuman and contextual-yaku handling, and dead-wait
furiten/cache-policy fixes. The hand scorer is `hand-score-2.0.0`; the constrained
riichi AI is `riichi-ai-1.1.0`. A 50,046-case synthetic audit matches the reference.
Full-game rule/replay validation and opponent inference are still unfinished.

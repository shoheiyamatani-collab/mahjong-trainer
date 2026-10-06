# Tedashi Reading Training

Local URL: `http://127.0.0.1:3000/training/tedashi-reading`.

The later [five-log expansion](tedashi-reading-expansion.md) adds 30 locally selected candidates and four problem sets; the original three remain available. Commands and counts below describe the initial implementation where noted.

## Existing Components Reused

- `mahjong-core` Tile/Counts34, standard/open-hand shanten, chiitoitsu, kokushi, disjoint block evaluator and existing standard hand decomposition.
- `TileFigures` tile assets and TileStrip. Red images are existing JONGFOLIO assets copied unchanged into the existing tile directory.
- SiteSections, tool screenshots, existing primary buttons, trainer portal, Metadata API, JsonLd and central content-index policy.
- Existing training modes and their localStorage keys are unchanged. This exercise has a separate result key.

## Data Flow

```text
Private local XML / gzip .mjlog
  -> validated chronological events and all four player snapshots
  -> hand-before-draw / hand-before-discard / hand-after-discard
  -> existing shanten, waits, public-tile ukeire and block evaluators
  -> clarity and quality filtering
  -> candidate JSON
  -> human review + actual provider confirmation
  -> approved JSON
  -> static Next.js page and client-side exercise
```

The web browser never parses XML or requests logs from Tenhou. Production reads only the checked-in approved corpus, not local candidates. No API, database or SSR requirement was added. `CF_PAGES=1` retains the existing static-export configuration.

## Reconstruction and Analysis

Physical tile IDs 0..135 are preserved; IDs 16/52/88 are red fives only when the game rules enable them. Discarding a different physical copy of the drawn tile's kind is tedashi/empty-cut, not tsumogiri. Every event checks unique ownership and the effective hand size (`concealed tiles + 3 * meld count`, 13 or 14). Called river tiles are not counted twice. Chi, pon, ankan, daiminkan, kakan, rinshan, dora, riichi, ron, tsumo, multiple ron, chankan and draw termination are handled. Unknown events, missing round ends, illegal sequences, three-player logs, DTD/entities and oversized input fail closed.

Progress compares the 13-tile-equivalent hand before drawing with the 13-tile-equivalent hand after discarding. The 14-tile immediate-before snapshot is still retained. Ukeire is evaluated only for a 13-tile equivalent; never by drawing a hypothetical 15th tile. Counts subtract only one's own hand and publicly visible tiles, not hidden opponents' hands or the actual wall. Theoretical waits are separate from live ukeire, so a dead wait does not erase the fact of tenpai. A tanki label requires all existing standard winning decompositions to use the winning tile as the pair.

## Extraction and Clarity

The conservative automatic extractor prioritizes a clear isolated 4-to-3 meld candidate, a newly completed meld, progress to tenpai, and later numbered isolated-tile removal. It does not claim optimal play or intent. Overlapping meld candidates, early turns and complex calls are held out of this automatic MVP.

Clarity starts at 100; ambiguity subtracts 50, calls 40, early turns (<4) 25, low-value isolated removals (<6) 25. Automatic `candidate` requires clarity >= 80 and no quality flags; rejected candidates retain their flags for review. The score is an explainable screening heuristic, not a calibrated probability that a hand can be read from its river.

The three requested multi-event examples use separately verified event selectors. Their answers concern exact waits or shanten, not a speculative decomposition or folding intent. They remain `candidate`, even with factual clarity 100, until a human reviews the choices and permission.

## Three Requested Examples

| Log | Target | Verified change |
| --- | --- | --- |
| 2018031609gm-00a9-0000-fe2e9a07 | South 1, 0 honba, player 0 (East), turns 6..8; events 597/605/613 | 7p tedashi -> 9s tsumogiri -> 8p tedashi. Tenpai throughout: 8p tanki -> 8p tanki -> 8m tanki. |
| 2025011112gm-00a9-0000-09d1a6ab | South 3, 0 honba, player 2 (East), turns 9..11; events 724/732/740 | 8s tedashi -> 8s tedashi -> 9s tedashi. After-discard shanten: 2 -> 3 -> 2. Folding intent is not asserted. |
| 2020060510gm-00a9-0000-689e461d | East 3, 3 honba, player 1 (North), turns 4..7; events 565/573/581/586/587 | 8s empty-cut -> 8m tsumogiri -> 1s tsumogiri -> 1p pon -> 3p tedashi. From 1-shanten to tenpai, waiting on 1m/4m. Intervening tsumogiri is retained. |

The reference articles locate interesting sequences only. Article interpretations are not copied into answer data. Original hands are reconstructed from the local logs.

## Developer Commands

Run from the workspace repository root:

```powershell
pnpm tenhou:parse data/tenhou/local/2018031609gm-00a9-0000-fe2e9a07.xml
pnpm tenhou:inspect data/tenhou/local/2018031609gm-00a9-0000-fe2e9a07.xml
pnpm tenhou:generate data/tenhou/local
pnpm tenhou:requested data/tenhou/requested-candidates.json
pnpm tenhou:fixtures
pnpm test:tenhou
pnpm typecheck
```

Additional logs: put an authorized local file under `data/tenhou/local/<logId>.xml` or `.mjlog`, run generate, then inspect candidates. The CLI does not acquire logs. For synthetic input explicitly pass `--synthetic`. For a selected series add its log ID, round, honba, player, event sequences and expected patterns to the requested manifest. A mismatch aborts generation.

Only after obtaining genuine authorization and human review:

```powershell
pnpm tenhou:review data/generated/requested-questions.json <question-id> approved --permission-reference <actual-confirmation-reference>
pnpm tenhou:publish data/generated/requested-questions.json
$env:CF_PAGES = '1'
$env:ADSENSE_REVIEW_MODE = 'true'
pnpm build
```

`review` also accepts `candidate` and `rejected`. Any content edit invalidates approval until regeneration/review. Keep the provider's confirmation outside the public question corpus.

## Development and Production UI

- Development loads the three requested candidates first, then other clear candidates up to a 10-question session.
- Without private data, 12 clearly labeled synthetic fixtures support UI testing. `TEDASHI_SYNTHETIC_PREVIEW=true` forces this only in development, for safe screenshot capture.
- Four radio choices, 6-column river, text labels for tedashi/tsumogiri, riichi orientation, actual hands/calls, waits, limits and source links are available.
- Results store only anonymous session totals/categories/date/mode at `jongfolio:tedashi-reading:results:v1`, last 20 sessions. Storage failure is nonfatal.
- Production hides the portal card until approved questions exist; the route's guide remains readable and is `needs-improvement`/noindex and excluded from sitemap until explicitly marked ready.
- `approved.json` is currently empty. No real-log question is publicly released by this work.

## File Inventory

New: `packages/tenhou-analysis/{package.json,tsconfig.json,src/*,tests/replay.test.ts}`; `apps/web/app/training/tedashi-reading/{page.tsx,TedashiTrainingClient.tsx,tedashi.module.css,data/*}`; `data/tenhou/{.gitignore,requested-candidates.json,synthetic/*}`; `data/generated/.gitignore`; three existing red tile assets under `public/tiles`; synthetic card screenshot; this document and `tenhou-data-policy.md`.

Modified for this feature: root/web package manifests and lockfile; web Next transpile list; core hand-decomposition export; TileFigures exports/asset mapping; trainer portal link; central exact noindex policy; sitemap route inventory. Unrelated existing dirty work was preserved.

## Remaining Boundaries

- Provider confirmation and human approval are outstanding; no deployment was requested or performed.
- No intent classifier for folding, pushing or turning a hand is implemented.
- Structural filtering is conservative and heuristic. More decomposition/edge-case corpora and human-reviewed distractors are needed before expanding the published set.
- Three complete real logs and synthetic edge cases validate this initial parser, not every historic Tenhou format or ruleset. Four-player XML version 2.3 is the supported input; unsupported formats are rejected.
- Real integration tests require ignored local files and are skipped when those files are unavailable, such as clean CI checkouts.

## Validation Results (2026-10-06)

- `pnpm test:tenhou`: 18 passed, including all three private real-log integrations, exact IDs, red fives, chi/pon/all kan, riichi, chankan, multiple ron, ron/tsumo terminals, invalid input, ambiguity, public-tile counts and publication gating.
- `pnpm test`: 299 existing core tests passed, including hand scoring, shanten, ukeire, trainer logic and 365-day daily-question generation.
- `pnpm --filter @mahjong-trainer/content-index-policy test`: 22 passed, including the new exact noindex/ads/sitemap exclusion.
- `pnpm typecheck`: all workspace projects passed.
- `CF_PAGES=1 ADSENSE_REVIEW_MODE=true pnpm build`: Web 158 static pages and M League 1,227 static pages generated; lint/type validation and merged output succeeded. No standalone lint script exists in the repository.
- Static HTML has `noindex, follow`, canonical metadata, an empty production question array and a readable guide. The route is absent from sitemap. Neither the three private log IDs nor synthetic exercise IDs appear anywhere in public export output.
- The three logs produced 64 automatic candidates and 150 rejected cases, plus three separately verified requested series. These remain unapproved.
- `pnpm tenhou:parse` succeeded on the first supplied log: 11 complete rounds, 954 normalized events.
- Browser checks at 390px mobile, 768px tablet and 1280px desktop: no page-width overflow or missing tile images. Actual waits, 2 -> 3 -> 2 shanten, empty-cut and intermediate tsumogiri/pon frames matched the candidate JSON.
- Ten-question sessions showed 9/10 (one deliberate wrong answer) for synthetic UI verification and 10/10 when selecting the recorded factual answers in local review. Category totals, answer locking, next-question focus and successful local result-saving status were observed. This is a UI check, not human publication approval.
- Trainer card screenshot loaded; existing iishanten and checker pages still rendered. The new page's console had no error entries.
- `git diff --check` passed. Existing unrelated working-tree changes were not reset.
- No deployment was performed. The development server is left running on port 3000 with the real candidate preview, not synthetic mode.

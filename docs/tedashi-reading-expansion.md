# Five-Log Reading Expansion

Date: 2026-10-06. Development only; provider confirmation and human publication approval remain outstanding.

## Result

Five supplied logs were reconstructed through 51 complete rounds and 5,076 normalized events. The scanner evaluated factual reading topics across all four players, then selected 30 candidate questions. Seventeen selections correspond to the explicitly identified reference/primary-log anchors; thirteen additional examples diversify the collection. The earlier three requested questions remain available, for 33 local-preview questions in four sets (10/10/10/3).

| Supplied log | Priority | Rounds | Selected |
| --- | --- | --- | --- |
| 2022092022gm-00a9-0000-ed6553e3 | S | 11 | 5 |
| 2025072619gm-00a9-0000-249bdf30 | S | 7 | 7 |
| 2020061309gm-00a9-0000-f2391bf0 | S | 12 | 8 |
| 2020061807gm-00a9-0000-e5844cd4 | A | 10 | 5 |
| 2025111819gm-00a9-0000-3727d576 | A | 11 | 5 |

Nine categories are represented: shanten progress, cut order, retained neighbouring tiles, clear taatsu removal, post-call change, continued tsumogiri, actual waits, suit/honor composition, and dora-discard change.

## Verified Examples and Boundaries

- 2022 opening dealer's 3m tedashi: actual 2-shanten -> 1-shanten. After the following 2p tedashi, 4p remains. The 1p/2p sequence is checked against an initially independent two-tile component. After another player's 9p/4p/6p sequence, 8p remains but that hand is actually 4-shanten; an inferred upper-pinzu complex shape is not presented as truth.
- July 2025: the South discard riichi has actual 2s/5s waits. The explicitly scoped 6s..9s example uses the actual 9s discard, not a blanket interpretation of the prose's 9p wording. The later 9s discard leaves one suit plus honors; the earlier 3p/1p sequence is not labeled an already-established honitsu.
- June 13, 2020: the chi takes 4s into 345s. The displayed called tile is corrected to the actual called physical tile, not the lowest tile of the chi. The later actual waits are 3m/6m; not calling a particular tile is not used to categorically exclude a wait. The 7p pon followed by 6p discard takes a 1-shanten hand to tenpai.
- June 18, 2020: after the 6s tedashi, nine consecutive own tsumogiri preserve identical concealed physical IDs and melds. That example is tenpai. Other selected examples preserve 1-, 3-, or 4-shanten, deliberately disproving the shortcut that a long tsumogiri run necessarily means tenpai.
- November 2025: the dealer's dora East discard is verified against the actual North indicator and takes a 1-shanten hand to tenpai. It is not a quantitative danger estimate.

No hand-possession probability, inferred intention, folding label, aggregate good-shape rate, or guaranteed safe-tile elimination is generated from these examples. One reconstructed hand is evidence for that game's facts, not a statistical likelihood for all similar rivers. Overlapping shapes are not assigned a unique intended decomposition.

## Scoring and Selection

Factual clarity is 100 only after exact replay/anchor checks and topic-specific validation. This is not a calibrated probability of reading the hand from its river. The independent learning/selection score starts at 70: a supplied reference anchor adds 20, a comparable change or multi-action fact adds 10, tenpai or a verified 3+ tsumogiri run adds 5; scores cap at 100. Early generic examples subtract 25 and remain rejected. One explicitly referenced numbered-tile region is still meaningful early: it subtracts 10, requires exact retained tiles, and remains a candidate pending review.

Automatic eligibility requires score >=80, clarity >=80 and no quality flags. Topic validations require, among other things:

- Same-color neighbouring/scoped tiles actually remain in the concealed hand; a player's imagined block assignment is not asserted.
- Taatsu removal starts from an independent two-tile component, ends with both kinds absent, and does not hide an intervening call.
- Continued tsumogiri contains at least three draws and preserves both physical hand IDs and complete meld identities.
- Actual waits come from the existing core's winning/shanten logic, not from an author's guess or from a skipped call.
- One-suit-plus-honors composition is checked across concealed tiles and all melds; it does not assert an unfinished yaku has won.
- All intermediate own calls/discards between an anchor pair are included. Wrong anchors or omitted own actions fail closed.

Selection first covers every supplied log, then favors explicitly anchored examples and score. It allows at most 8 examples per S log, 5 per A log, 6 per category, and 3 unanchored selections per log/round. The same final event cannot be repeated under different topics. Ordering is deterministic by supplied source order and event sequence.

The run yielded 1,206 eligible factual candidates; 2,112 rejected topic attempts/early candidates were recorded with reasons. This is a count of topic evaluations, not 3,318 unique game situations or publication-ready lessons. Only the selected 30 enter the preview. All remain `candidate`; none is silently approved.

## Files and Workflow

New files: `data/tenhou/reading-sources.json`, `packages/tenhou-analysis/src/{reading.ts,labels.ts}`, `packages/tenhou-analysis/tests/reading.test.ts`, and this report.

Modified: shared requested-step/snapshot builder, exported component grouping helper, question types, CLI/package scripts, local JSON loader, training client and scoped CSS. No new dependency or route was added. Existing tile assets, parser, shanten/ukeire engine, tenpai decomposition and publication gate are reused.

Ignored local files: five raw XML logs, parsed snapshots, `reading-candidates.json`, `reading-questions.json`, and `reading-report.json`. These do not belong in `public/`, a public repository, or the production corpus before authorization.

```powershell
pnpm tenhou:curate data/tenhou/reading-sources.json
pnpm tenhou:requested data/tenhou/requested-candidates.json
pnpm test:tenhou
pnpm typecheck
```

`--limit 30` is the default. The scanner only reads local files and does not download or scrape logs. Add an authorized source and optional exact first/last event-pattern anchors to the manifest, regenerate, and inspect the private report/preview. A changed source or incorrect anchor aborts generation. For release follow `tenhou-data-policy.md`; use the real permission reference and human-reviewed unchanged content hash, then explicitly publish approved JSON.

Local preview: `http://127.0.0.1:3000/training/tedashi-reading`. The selected 30 precede the earlier three. Only an explicitly approved JSON corpus can appear in a production build; this corpus is still empty. The route remains noindex and excluded from sitemap.

## Reference Links

- [2022 reference article](https://note.com/huui/n/n9ed6019d43a3)
- [July 2025 reference article](https://note.com/huui/n/n2e26a517bbd2)
- [June 13 reference article](https://note.com/metabeat/n/n0a94d4079485)
- [June 18 reference article](https://note.com/metabeat/n/n838dd46d1c3b)
- [November 2025 original log](https://tenhou.net/0/?log=2025111819gm-00a9-0000-3727d576)
- [Tenhou log-use precautions](https://tenhou.net/man/index.html)

Articles locate noteworthy events only. Their images and prose are not copied into the lessons; correct answers come from the independently reconstructed original logs.

## Validation

- `pnpm test:tenhou`: 28 passed, including the five new complete logs and the earlier three, deterministic selection under reversed candidate order, four distinct options, content hashes, exact called-tile identity, 9-tsumogiri identity preservation, wrong-anchor rejection and missing-intermediate-step rejection.
- `pnpm test`: 299 existing core tests passed. `pnpm --filter @mahjong-trainer/content-index-policy test`: 22 passed.
- `pnpm typecheck`: every workspace project passed.
- `CF_PAGES=1 ADSENSE_REVIEW_MODE=true pnpm build`: Web and M League static builds, built-in lint/type validation and output merge succeeded. The route remains static with 113 kB first-load JS.
- The production question array remains empty; robots remains `noindex, follow`; the route is not in sitemap. A search across public output found none of the five new source IDs.
- Browser checks at 390px, 768px and 1280px found no page-width overflow or missing tile images. Set changes reset session state; the third set completed 10/10 with correct category totals and saved-result status. The earlier three questions remain in the fourth set. The nine-discard tsumogiri series showed every intermediate frame.
- No deployment, public corpus release, bulk downloading feature or new dependency was added. The development preview is left running at port 3000.

The scores and automated tests do not substitute for human pedagogical review or provider authorization. Requests to add probabilistic hand-reading, chiitoitsu likelihood, or guaranteed safety from a skipped call require a separate validated model and remain outside this fact-based MVP.

## Answer Hand Images

`HandSnapshotImage.tsx` renders each revealed concealed hand and meld set into a PNG using the existing tile assets. These are reconstructed factual hand diagrams, not copied screenshots of Tenhou or reference articles. Red fives and complete meld tiles are preserved. All concealed tiles and meld groups share a single horizontal row; a gap and label distinguish each meld. Image width follows the number of tiles and scales to the available viewport without wrapping or page-width overflow. Before/after panels are stacked so each row can use the full available width. Each image has a complete tile-list alt description and a native PNG download link. The original tile component remains the fallback if canvas or an asset fails.

Rendering occurs only after an answer reveals the hand. Tile loads and a bounded set of rendered images are cached. Nothing is written to public assets or added to the production corpus. The existing permission/review gates remain unchanged.

Browser checks covered all 33 questions: 94 before/after comparisons, 188 PNG images, no failed images and no page-width overflow. Mobile (390px), tablet (768px), red-five hands and post-call hands were checked visually. Native download-event automation was unavailable in the in-app browser; PNG data was separately extracted from the rendered images to verify the file content. No successful native download interaction is claimed.

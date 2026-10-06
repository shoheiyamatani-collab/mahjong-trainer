# Rule Comparison Learning Guide

Route: `/learn/guides/rule-differences-and-calling`

The user's draft is adapted into the existing learning-guide schema and layout. The learning index lists it under defense/calling; the calling-decision guide links back to it. No new dependency, API, monetization unit or deployment is introduced.

## Evidence and Scope

Rules checked on 2026-10-06:

- Tenhou manual: https://tenhou.net/man/index.html
- Mahjong Soul ranked rules: https://mahjongsoul.com/news/46 (verified in the browser; the text is dynamically loaded)
- Mahjong Soul official start guide: https://mahjongsoul.com/startguide/
- Mahjong Soul official FAQ: https://mahjongsoul.com/faq
- M League rules: https://m-league.jp/about/

The article concerns four-player standard ranked play and M League official matches. Tenhou's comparison assumes open tanyao and red fives enabled. Three-player modes and custom tournaments are excluded. Rules are attributed near each comparison. Strategic conclusions are contextual learning examples, not official strategy recommendations or computed win/rank probabilities.

The supplied numerical claims below remain pending source verification, not silently published as facts:

- 2026 Tenhou rank-level furo rates around 34-35%.
- M League's supposed overall 23.2% average, including its eligibility cutoff and weighting method.
- Watanabe Futoshi's 5,742-game historic sample and 37.106% rate, Mahjong Soul's roughly 37% and claimed stable-rank first place, M League's 1,391-round 31.4% sample.
- Asakura Koshin's combined 6,484-game 37.987% sample and M League's 1,382-round 26.1% sample.
- Exact Celestial/Celestial-only point allocations in Mahjong Soul. A general ranked rules page is not evidence for the exact rank payout table.

The article retains the theme of comparing player environments, but explains aggregation, sample, period and causal limitations without asserting those unverified figures. Ask for original aggregation URLs before adding a dated comparison table.

## Original Examples

- Tenhou seventh dan, four-player south, Phoenix: +90/+45/0/-135. Differences are arithmetic consequences of the official table, not expected values of a particular call.
- M League uses `(final score - 30000) / 1000 + placement points`; equal scores split placement points.
- South 4, nondealer, zero honba/sticks: 16,600 versus 17,400 demonstrates a 1,000-point ron from the 40,000-point dealer moving fourth to third. A separate 12,000 versus 19,000 scenario shows why a ron target changes required value.
- White pon example: 13 concealed tiles before calling; 10 concealed plus an open White triplet after discarding Red Dragon. The actual waits are 3s/6s, and ordinary nondealer ron with no bonus is White-only 1 han 30 fu, 1,000 points. It is synthetic instructional material, not an attributed player's game.
- Child wins advancing the round are distinguished from dealer continuation. Negative-score termination is distinguished from exactly zero; South 4 is not assumed to end every ranked game.

## Files and Checks

`ruleComparisonGuide.ts` contains the article. Optional tables and source links extend `LearningGuideSection` without changing existing data requirements. The existing article renderer, tile figures, metadata, canonical URL, Article/Breadcrumb structured data, static-parameter generation and sitemap registry are reused. Meld accessibility labels now use the Japanese tile names instead of asset identifiers.

Focused test command:

```powershell
pnpm exec vitest run apps/web/app/learn/guides/ruleComparisonGuide.test.ts
pnpm --filter @mahjong-trainer/web typecheck
$env:CF_PAGES='1'; $env:ADSENSE_REVIEW_MODE='true'; pnpm build:web
```

Four tests cover registration/related links, table/source completeness, legal tile counts, shanten, waits and actual hand scoring. Browser checks cover the index card, route navigation, responsive comparison tables and tile images. Publication remains a separate user-requested step.

Completed checks: all four focused tests and Web typecheck passed. The review-mode static Web build passed its lint/type checks and exported 159 pages. The new HTML includes three tables, the canonical URL and Article structured data; it has no noindex metadata and is included in sitemap. Mobile tables fit within the viewport, all tile images loaded, and the index card opens the new route. No deployment was performed; the preview remains on port 3000.

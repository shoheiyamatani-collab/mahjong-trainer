# Independent hand-score validation

This is an offline development tool, not a browser dependency or a prediction
model. It compares the existing TypeScript scorer with
[MahjongRepository/mahjong](https://github.com/MahjongRepository/mahjong) 2.0.0.
The MIT-licensed reference wheel is pinned by version and SHA-256 in
`requirements.txt` and installed only in the ignored `work/scoring-reference`.
The oracle refuses another library path or version, including this repo's
unrelated local Python `mahjong` module.

## Reproduce

Use an available Python 3.10+ executable in place of `python`:

```powershell
python -m pip install --upgrade --no-deps --only-binary=:all: --require-hashes --target work/scoring-reference -r research/scoring/requirements.txt
pnpm research:scoring --python python --count 50000 --output C:/absolute/path/scoring-report.json
```

The reference directory defaults to the repo's `work/scoring-reference`; an
explicit `--reference` path can override it. Output paths supplied to the CLI
are relative to `packages/tenhou-analysis`, so absolute paths are recommended.
No replay downloads, commercial training data, or publication are involved.

## Corpus and comparisons

`packages/mahjong-core/tests/support/scoringReferenceCases.ts` contains authored
edge cases and a deterministic generator of complete hand shapes. Generated
hands obey the four-copy limit, distinguish open/closed melds and quads, and
vary dealer/winds, ron/tsumo, riichi/double-riichi/ippatsu, honba and kyotaku.
The oracle allocates distinct physical IDs across the closed hand and melds.
It compares success/rejection, han, fu, yakuman multiplier, total points and
each payer's amount. Rejections distinguish no yaku, non-winning hands and
invalid contextual flags. It does not silently skip failed cases.

The agreed baseline is open tanyao, no red bonus, counted yakuman, no kiriage,
and double-yakuman variants only where a case explicitly enables them.
**This is not an assertion of full Tenhou or M League rule compatibility.**
In particular M League's kiriage and double-wind-pair fu differ from this
baseline ([official rules](https://m-league.jp/about/)). Red/indicator/ura counting, first-turn special yaku, responsibility
payments and rule-profile variants require a separate integration suite.

## Frozen oracle

To regenerate the small reference corpus after reviewing changes:

```powershell
pnpm research:scoring --python python --count 2000 --oracle C:/absolute/repo/packages/mahjong-core/tests/fixtures/scoringOracle.json
```

Regeneration fails if any mismatch remains. Expectations come from Python,
not from the TypeScript scorer. The corpus hash and reference version are
checked by `scoringOracle.test.ts`. Regular `pnpm test` uses the saved oracle
and does not require Python, network access or an installed reference package.
Do not edit expected points by hand to silence a failure.

## Scope

This checks a winning hand and its asserted scoring context. It does not prove
that a whole game could reach the position, reconstruct an event history, or
verify temporary/riichi furiten, kan restrictions, passing ron or dead-wall
progression. Those are the next complete-state/replay validation milestone.
Matching this corpus does not establish EV or deal-in probability accuracy.

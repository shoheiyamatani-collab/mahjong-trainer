# Tenhou Data Policy

Last checked: 2026-10-06. This is an operational checklist, not a legal opinion or a record of permission.

## Public Use Is Not Yet Approved

Tenhou's [official manual](https://tenhou.net/man/index.html), under its log-use precautions, restricts applications that do not require play on Tenhou and asks developers applying logs to general mahjong services to contact `support@c-egg.com`. Publicly accessible logs are not an automatic license for this training service. A response may impose conditions or refuse the proposed use.

Before publishing JONGFOLIO lessons derived from real logs, obtain and retain confirmation covering:

- The interactive training service, anonymous reconstruction of hands and rivers, source links, and expected number of examples.
- Whether displaying derived question JSON, screenshots, and explanations is permitted.
- Monetization (AdSense and affiliate links), if applicable.
- Any required attribution, event cooperation, limits, retention, withdrawal, or deletion procedure.
- Future Shorts, social posts, and other distribution: these are a separate scope, not assumed to be covered by web use.

No email has been sent and no permission has been obtained by this implementation. Local development is not a claim that the service is authorized. Stop acquisition or use if the provider requests it.

## Data Boundaries

- `data/tenhou/local/`: locally supplied XML or gzip `.mjlog` files. Git-ignored; never put them in `public/` or commit them.
- `data/generated/`: anonymous parsed logs and question candidates. Git-ignored; not read by production builds.
- `data/tenhou/requested-candidates.json`: public log IDs, reference links, and event selectors only, not reconstructed hands or names.
- `data/tenhou/synthetic/`: explicitly synthetic test fixtures, with no real player identity or real source claim.
- `apps/web/app/training/tedashi-reading/data/approved.json`: the only production question corpus. Empty until utilization confirmation and human review.
- `synthetic.json`: development-only exercises. It is not a real Tenhou corpus and cannot pass the publication gate.
- The card screenshot uses a synthetic exercise; it is not a screenshot of an unapproved real hand.

The parser ignores `UN` player names, ratings and ranks. Questions keep source ID/date, anonymous seat, round, honba, turn, event sequence and original-viewer URL. Raw files may themselves contain names, so keep them private. The original viewer can display player names: anonymity applies to JONGFOLIO, not to the external site.

No bulk downloader, log-redistribution endpoint, browser-based XML parsing, player ranking or automated public posting is implemented.

## Human Review and Release

1. Check the full reconstructed sequence against the original log, including physical IDs, red fives, calls, kan and intervening draws/discards.
2. Confirm every choice has one factual answer, and that no intent such as folding or block-fixing is presented as established fact.
3. Recheck quality flags and source attribution; remove ambiguous or low-value cases.
4. Obtain provider confirmation and record its actual reference. An arbitrary string is not evidence of permission.
5. Approve the reviewed, unchanged JSON with the CLI. A content hash ties approval to the reviewed content.
6. Export only approved questions, build and inspect the static output before any deployment.
7. Only after the page is genuinely ready, change its exact central index-policy entry from `needs-improvement` to `ready` and review navigation/AdSense eligibility.

Production additionally requires a real houou source, a valid log ID, clarity >= 80, no quality flags, a review timestamp, a permission reference, and an unchanged hash. This validates recorded review fields, not the authenticity or scope of an external permission.

Removing an approved question requires rebuilding and redeploying the static site. Removing a log locally alone does not remove already exported HTML/JSON.

## Format References

- [Tenhou manual and file format information](https://cdn.tenhou.net/man/)
- [Tenhou log-use rules](https://tenhou.net/man/index.html)
- [MahjongRepository Tenhou decoder](https://github.com/MahjongRepository/tenhou-python-bot/blob/master/project/tenhou/decoder.py)
- [Kobalab Tenhou converter](https://github.com/kobalab/tenhou-log/blob/master/lib/convlog.js)
- [fast-xml-parser](https://github.com/NaturalIntelligence/fast-xml-parser)

These references were used to verify format behavior. A decoder's availability or license does not grant rights to publish Tenhou log data.

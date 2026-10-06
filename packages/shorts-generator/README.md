# 雀フォリオ Shorts Generator

詳しい構成・運用方法は [`../../docs/SHORTS_GENERATOR.md`](../../docs/SHORTS_GENERATOR.md) を参照してください。

```bash
pnpm generate:shorts --type nani-kiru
pnpm generate:shorts --type machi
pnpm generate:shorts --type nani-kiru --count 30
pnpm generate:shorts:daily
pnpm generate:shorts:voice -- output/shorts/2026-09-20/nanikiru-001/problem.json
```

VOICEVOX Engineが起動していない環境では、分かりやすい警告を出し、ナレーションなし・SEありのMP4を生成します。意図的に音声を省く場合は `--no-voice` を指定します。

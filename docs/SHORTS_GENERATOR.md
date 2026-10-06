# 雀フォリオ YouTube Shorts 自動生成

## 概要

`packages/shorts-generator` は「毎日何切る」「毎日何待ち」の問題生成、既存ロジックでの正解検証、VOICEVOXナレーション、雀フォリオUIの縦型フレーム、SE、QRコード、MP4、YouTubeタイトル・概要欄を1コマンドで生成します。Webアプリとは別ワークスペースなので、通常のNext.js実行経路へ動画生成依存を持ち込みません。

## 調査結果と再利用箇所

- 牌画像: `apps/web/public/tiles/` の `man|pin|sou|ji{番号}-66-90-l-emb.png`
- ブランド素材: `apps/web/public/brand/janfolio-brand-board.png`
- フォント: `apps/web/public/fonts/NotoSansJP-VF.ttf`
- デザイン: `apps/web/app/globals.css` の背景、白カード、緑・オレンジ、角丸、タイポグラフィ
- 牌理: `packages/mahjong-core/src/analyzer.ts`
- 難しい何切る生成・品質判定: `packages/mahjong-core/src/ukeireMax.ts`
- 清一色生成・待ち判定: `packages/mahjong-core/src/chinitsu.ts`
- 牌理チェッカー: `/analysis/mahjong-tool`
- 清一色待ち当て: `/trainer#chinitsu-waits`

新規実装は動画用の構成、VOICEVOX接続、音声ミックス、投稿文、履歴管理のみです。シャンテン数、受け入れ、最適打牌、清一色の待ちは再実装していません。

## コマンド

リポジトリルートで実行します。

```bash
pnpm generate:shorts --type nani-kiru
pnpm generate:shorts --type machi
pnpm generate:shorts --type nani-kiru --count 30
pnpm generate:shorts:daily
pnpm generate:shorts:voice -- output/shorts/2026-09-20/nanikiru-001/problem.json
```

追加オプション:

- `--no-voice`: VOICEVOXへ接続せずSEのみで生成
- `--no-qr`: QRコードを非表示
- `--date 2026-09-20`: 日付を固定
- `SHORTS_OUTPUT_DIR`: 通常の履歴と分離したバッチ出力先へ変更（絶対パスも指定可能）

## VOICEVOX

既定接続先は `http://127.0.0.1:50021`、ずんだもんノーマルのspeaker IDは `3` です。設定は `packages/shorts-generator/shorts.config.json` に集約されています。

- URL: `voicevox.url`（環境変数 `VOICEVOX_URL` で上書き可能）
- speaker: `voicevox.speakerId`（`VOICEVOX_SPEAKER_ID` で上書き可能）
- 速度: `voicevox.speedScale`
- 音高: `voicevox.pitchScale`
- 抑揚: `voicevox.intonationScale`
- 音量: `voicevox.volumeScale`
- 麻雀読み辞書: `packages/shorts-generator/mahjong-readings.json`

各問題の `narration.json` は画面表示用 `displayText` と音声用 `speechText` を分離します。正解画面には詳細説明を表示しつつ、音声は牌名と受け入れ枚数へ短く要約します。「正解は」はリビールで一度だけ発話します。VOICEVOXは `audio_query` → パラメータ調整 → `synthesis` の順で呼び、`audio/intro.wav` 等を保存します。生成したWAVの実時間を読み取り、前の音声終了から160ms以上空けて次の音声を配置します。接続できない場合は `audio/VOICEVOX_NOT_GENERATED.txt` を残し、SEのみの動画生成を続行します。

`generate:shorts:voice` は保存済み `problem.json` の正解をもう一度 `mahjong-core` で検証してから、問題を変えずにWAVだけを再生成します。

VOICEVOXおよびずんだもんの公式条件を2026-09-20に確認し、概要欄へ既定で `VOICEVOX:ずんだもん` を追加しています。公開時は最新版も確認してください。

- https://voicevox.hiroshiba.jp/term/
- https://voicevox.hiroshiba.jp/qa/
- https://zunko.jp/con_ongen_kiyaku.html

## 動画生成

Sharpで1080×1920のSVG/PNGフレームを描画し、既存牌画像・ロゴ・フォントを合成します。FFmpegは、静止フレームを30fps/H.264へ変換し、指定時刻へVOICEVOX WAV・出題SE・毎秒のタイマーSE・正解SE・任意のサウンドロゴを配置するために必要です。`ffmpeg-static` を利用するため、Windows/macOSで別途PATH設定する必要はありません。

動画は25秒です。

1. 0〜1秒: ブランド・出題SE
2. 1〜4秒: 問題導入
3. 4〜12秒: 回答時間、毎秒SE、残り3秒を強調
4. 12〜13秒: 「正解は……」・正解SE
5. 13〜20秒: 正解・受け入れ/待ち枚数
6. 20〜25秒: CTA・QR・任意サウンドロゴ

## 出力

`output/shorts/YYYY-MM-DD/` に出力します。

```text
nanikiru-001.mp4
nanikiru-001.json
nanikiru-001-title.txt
nanikiru-001-description.txt
nanikiru-001/
├─ problem.json
├─ narration.json
├─ narration.txt
├─ title.txt
├─ description.txt
├─ audio/
│  ├─ intro.wav など（VOICEVOX利用時）
│  ├─ effects/（差し替えSEがない場合の生成音）
│  └─ mix.wav
└─ frames/
```

履歴は `output/shorts/history.json` に手牌、正解、種類、生成日時、動画生成日時を保存します。完全一致を避けるため、既存の何切る生成APIへ後方互換の `recentHands` 引数を追加し、清一色側は既存の `recentHands` を利用しています。

## 音声素材の差し替え

`packages/shorts-generator/assets/audio/` 配下へ配置します。

- `se/quiz-question.mp3`（冒頭1秒に自動トリミング）
- `se/clock-second-hand-loop.mp3`（4〜12秒の回答時間に1回配置）
- `se/quiz-correct.mp3`（最大1.2秒）
- `jongfolio-logo.wav`

MP3とWAVを利用できます。音量は `shorts.config.json` の `audio.volumes` で調整できます。サウンドロゴが未配置でも生成できます。SE未配置時は単純波形の独自フォールバックSEを出力フォルダへ生成します。

## CTA・投稿文

Shorts内ではチャンネルのプロフィール先頭リンクを主導線として案内します。QRコードを直接遷移用、「雀フォリオ」での検索を予備導線として併記します。YouTube Studioのチャンネル設定で、プロフィールの先頭リンクへ雀フォリオまたは対象ツールURLを設定してください。

URL、クレジット、ハッシュタグは `shorts.config.json` に集約しています。問題JSONの `toolUrl`、QRコード、コピー用URLを含む概要欄は同じ値から生成されます。

## 拡張方法

`ShortsProblem` を返す問題ジェネレーターを追加し、共通のナレーション、フレーム描画、音声ミックス、履歴管理へ渡します。点数計算・初心者イーシャンテン・ベタオリ等でも動画基盤をコピーする必要はありません。

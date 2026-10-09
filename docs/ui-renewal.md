# JONGFOLIO UI/UX renewal

## Scope

2026-10-09時点の既存サイトを基にした表示・操作性の改修です。デプロイ、問題データ変更、麻雀の計算・採点ロジック変更は行っていません。

### 改修ページ

- `/`: 検索、目的別導線、よく使うツール、代表的な練習、既存の今日の1問、ロードマップを順に配置。既存のサイト紹介本文も維持。
- `/trainer`: 全既存トレーニングを分野別のカラーヘッダー付きカードに整理。既存の役クイズへの導線も掲載。
- `/analysis/mahjong-tool`: 解析ツールの選択カードをコンパクト化。スクリーンショットは用途が分かる部分を表示。
- `/toolbox`: 新規の総合一覧。ツール名・説明・実機能に基づくキーワード検索、カテゴリ絞り込み、難易度表示、空結果時のリセットを実装。
- `/trainer/**`, `/training/**`, `/analysis/**`, `/tools`: 共通の見出し、色、ボタン、結果表示を適用。鳴き・リーチ・押し引きの既存共有スタイルもカテゴリ色へ統合。
- `/learn/**`, `/rules/**`, `/videos/**`: 共通ヘッダー、タイポグラフィ、カードと学習カテゴリ色を適用。初心者記事と学習ガイドに本文内目次を追加。
- `/mleague/**`: 共通ヘッダー・スマホナビを統合。選手、チーム、成績、一覧、カレンダーの配色を明るくし、文字のコントラストを改善。カレンダーの横スクロールは表の内側に限定。

## Design System

`shared/ui/design-tokens.css` がカテゴリ色、文字色、背景、余白、角丸、見出し、ヘッダー・モバイルナビの共通定義です。

| 分野 | 色 | 薄い背景 |
| --- | --- | --- |
| 解析 | `#137A59` | `#E8F6EE` |
| 練習 | `#A8500C` | `#FFF0DF` |
| 学習 | `#2468BF` | `#EAF3FF` |
| Mリーグ | `#793EB8` | `#F1E9FC` |
| 牌効率 | `#225DB0` | `#EAF2FF` |
| 待ち読み | `#713FB2` | `#F2EAFF` |
| 点数計算練習 | `#A45500` | `#FFF0D8` |
| 実戦判断 | `#AF3551` | `#FDECF0` |

練習と点数計算の色は、白文字と薄い背景上の文字がAA相当のコントラストを満たすよう、依頼色より少し暗くしています。色に加えカテゴリ名・アイコン・難易度を表示します。

既存のローカル配信Noto Sans JP可変フォントを再利用。Zen Kaku Gothic Newの追加配信や外部フォントの重複取得は行っていません。

H1はPC 36px、スマホ28px。トレーニングカードの白文字タイトルはPC 22px、スマホ20px。狭い画面では1列を優先し、長い日本語タイトルを自然に改行します。

カードのスクリーンショットは既存の実画面を小さく切り出し、タイトル・説明・難易度・開始操作を主役にしています。カード全体が1つのリンクで、キーボードのフォーカスも枠全体に表示します。

## Navigation And Search

- `SiteNavigation.tsx` の既存実装を再利用・改修し、`PlatformFrame` と `PlatformNavigation` をWeb/Mリーグで共有。
- スマホ下部にホーム・学ぶ・練習・ツール・メニューを配置。セーフエリアと本文下余白を確保。
- 回答・牌操作が中心のワークスペースでは下部固定ナビを隠し、操作領域を確保。
- メニューはネイティブdialogを使用。Escで閉じ、元のボタンへフォーカスを戻す。
- `toolCatalog.ts` で一覧、トップ、検索のツール名・URL・カテゴリ・キーワードを共通管理。
- 公開用カタログには15件の実在ツールを掲載。手出し読みは従来の教材公開可否条件を維持し、未承認教材を本番表示しない。
- クライアント検索とGETクエリを使用。DB・API・検索サービス・新規依存パッケージは不要。

## SEO And Existing Functionality

- 既存URL、metadata、canonical、構造化データ、noindexポリシーを維持。
- サイトマップには新しい `/toolbox` のみ追加。
- AdSense Review Modeの学習優先表示を維持。審査モードでは主導線を学習・練習・解析・点数計算にし、動画とMリーグは下部・メニュー・フッターから閲覧可能。
- 通常モードではMリーグの目的別カード、動画・Mリーグの下部カードを復帰。両モードの表示をSSRテストで確認。
- 牌画像・牌コンポーネント・入力・問題生成・正誤判定・計算エンジン・教材の文章は変更していない。
- 今日の1問の日付処理、決定論的生成、複数正解、解説、牌理チェッカーへの手牌受け渡しを維持。
- 拡大を阻害するviewportのmaximumScale指定を除去。

## Files

### 新規作成

- `shared/ui/design-tokens.css`
- `apps/web/app/platform.css`
- `apps/mleague/app/platform.css`
- `apps/web/app/components/HomeLearningHub.tsx`
- `apps/web/app/components/HomeLearningHub.test.ts`
- `apps/web/app/components/ToolCard.tsx`
- `apps/web/app/components/navigationModel.ts`
- `apps/web/app/toolbox/page.tsx`
- `apps/web/app/toolbox/ToolDirectory.tsx`
- `apps/web/app/toolbox/ToolDirectoryQuery.tsx`
- `apps/web/app/toolbox/toolCatalog.ts`
- `apps/web/app/toolbox/toolCatalog.test.ts`
- `apps/web/app/trainer/trainerPresentation.ts`
- `apps/web/app/analysis/mahjong-tool/AnalysisToolPreviews.test.ts`
- `docs/ui-renewal.md`

### 変更

- `apps/web/app/layout.tsx`
- `apps/web/app/globals.css`
- `apps/web/app/page.tsx`
- `apps/web/app/sitemap.ts`
- `apps/web/app/components/SiteChrome.tsx`
- `apps/web/app/components/SiteNavigation.tsx`
- `apps/web/app/analysis/mahjong-tool/AnalysisToolPreviews.tsx`
- `apps/web/app/trainer/TrainerLearningContent.tsx`
- `apps/web/app/trainer/TrainerLearningContent.test.ts`
- `apps/web/app/trainer/page.tsx`
- `apps/web/app/trainer/call-or-pass/page.tsx`
- `apps/web/app/trainer/call-or-pass/call.module.css`
- `apps/web/app/trainer/riichi-or-dama/page.tsx`
- `apps/web/app/trainer/push-or-fold/page.tsx`
- `apps/web/app/learn/[slug]/page.tsx`
- `apps/web/app/learn/guides/[slug]/page.tsx`
- `apps/web/app/learn/guides/guideLibrary.module.css`
- `apps/mleague/app/layout.tsx`
- `apps/mleague/components/SiteHeader.tsx`
- `apps/mleague/components/SiteFooter.tsx`

解析一覧のコンパクト化については、この全面改修の前に作業中だった変更も維持しています。

## Validation

| コマンド | 結果 |
| --- | --- |
| `pnpm test` | 377件成功、29ファイル。365日分の今日の1問生成、点数計算の参照データ検証を含む |
| `pnpm test:tenhou` | 36件成功、3ファイル |
| `pnpm --filter @mahjong-trainer/web exec vitest run` | 290件成功、13ファイル |
| `pnpm typecheck` | ワークスペース全体成功 |
| `CF_PAGES=1 ADSENSE_REVIEW_MODE=true TEDASHI_SYNTHETIC_PREVIEW=false pnpm build` | WebとMリーグの静的出力・統合成功。Next.jsのlint/型検証も成功 |
| `git diff --check` | 成功 |

単独のlintスクリプトは既存package.jsonにありません。既存ビルド内のlintを実行しています。

### 表示と操作

320 / 375 / 390 / 768 / 1024 / 1280pxで、主要ページのページ全体の横はみ出しとH1・ツールカードタイトルの文字切れを確認。

対象はトップ、トレーニング一覧、総合検索、牌理チェッカー、配牌分析、点数計算、オーラス条件計算、鳴き、リーチ、押し引き、イーシャンテン、受け入れMAX、7枚形、清一色、点数計算練習、HARD、役クイズ、ロードマップ、学習ガイド一覧・記事、初心者記事、プロ動画一覧・記事、Mリーグ一覧・選手・チーム・切り抜き・成績・カレンダー。

- 検索・カテゴリ絞り込み・空結果のリセットを確認。
- メニューのキーボード開閉、Esc、フォーカス復帰を確認。
- 鳴き、リーチ、押し引き、清一色、点数計算、役クイズの回答・解説・次問遷移を確認。
- 牌理チェッカーの入力・サンプル・結果、点数計算のロン/ツモ、オーラス条件の結果を確認。
- 今日の1問の答え開示、受け入れ、解析リンクを確認。
- 記事内目次リンクが固定ヘッダーの下に適切に移動することを確認。
- 動画iframeのyoutube-nocookie、title、lazy、fullscreen、YouTubeへの代替リンクを維持。
- 公開用XMLサイトマップは79 URL。`/toolbox`あり、審査対象外の動画・MリーグURLなし、出力HTMLが存在しないURLは0。

## Preview And Limitations

統合静的プレビュー: `http://127.0.0.1:4174/`

スクリーンショットとビルドログは、この作業チャットの `artifacts/ui-renewal/` に保存。変更前のトップ/トレーニングと、変更後のスマホトップ/トレーニング、PCトップ/選手ページを記録しています。

- 全1227件のMリーグページを個別に目視検証したわけではありません。共通テンプレートの代表ページを検証しています。
- 実機Android/iOS、Safariでは未検証。ブラウザ内の指定画面幅で確認しました。
- Lighthouse・実測CLSの性能計測は未実施。画像寸法の固定、既存ローカルフォント、依存追加なしで悪化を抑える設計です。
- 目次追加は初心者記事と学習ガイド。全ヘルプ・動画記事の個別目次まで追加していません。
- 既存のトレーニングの進捗・結果・解説は維持。すべてのツールに新しい進捗バーや折りたたみを追加したわけではありません。
- 狭い画面の表や長い手牌では、機能を守るため局所的な横スクロールを維持しています。
- コミット、push、デプロイは未実施。

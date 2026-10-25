# 監査後の既存コンテンツ改善

2026-10-25。`adsense-quality-audit.md` のB候補を実際のページ・計算処理と照合し、具体的な不足がある9ページを改善した。文字数を品質の合否基準にはしない。本番デプロイ・Git push・AdSense再申請は行っていない。

公開依頼後の補足：上記はローカル検証完了時点の記録。公開用には `ADSENSE_REVIEW_MODE=true`、`PRACTICAL_GUIDES_PREVIEW=false` で再検証し、承認レコードが空の新規30記事を除外する。Cloudflareの本番環境でもプレビューフラグは未設定。既存9ページと先行監査の修正が今回の公開対象で、AdSense再申請自体は行わない。

## 改善したページ

| 既存URL | 改善内容 |
| --- | --- |
| `/learn` | 古い「14記事」の固定表記を除去。牌の基礎・役・何切る・点数という、つまずき別の次の教材と練習を案内 |
| `/rules` | ロードマップを名乗るリンクの行き先を `/learn/roadmap` に修正。既存の学習順は維持 |
| `/toolbox` | 自分の手牌の振り返りと問題練習、アガリ点と順位条件の計算の違いをサーバー出力本文で説明。各道具の限界と既存HELP・練習へ接続 |
| `/tools/score-table` | 既存の検証済み4計算例を再利用したHTML比較表。ロン・ツモ、本場・供託、支払う点と受け取りを区別。切り上げ満貫なし・数え役満ありの前提と対応外を明記 |
| `/training/yaku-quiz` | 全11問に東場・南家、門前、アガリ牌、ロンツモ、リーチの条件を付与。リーチ例の14枚は宣言時ではなくアガリ後だと明記。平和の待ち方を確定。誤答22選択肢それぞれの理由と読み上げ通知を追加 |
| `/rules/yakuhai` | 連風牌の2翻、役牌の雀頭では役にならない条件、門前と中ポンの牌姿・符・点数比較、復習問題、公式確認先を追加 |
| `/rules/tsumo` | 実際の牌姿で2翻40符、700・1,300点を検証。「ツモなら常に20符」ではないことを説明。復習問題の答えを選択肢の文言と一致させた |
| `/rules/iipeikou` | 同じ完成形を門前とチーありで比較。一盃口・平和が消え、喰いタンだけが残ることを計算で確認 |
| `/rules/toitoi` | 中ポン後・七索ロンの3翻40符5,200点を検証。ロンで完成した刻子を暗刻に数えないこと、三暗刻・四暗刻との違いを説明 |

既存のカード・見出し・牌PNG・計算例データ・計算エンジンを再利用。新しいURL・依存パッケージ・計算ロジックは追加していない。役クイズの11問の手牌・選択肢・正答は維持し、条件と解説を具体化した。title・description・canonical・構造化データ・noindex方針も変更していない。

## 変更ファイル

- `apps/web/app/learn/page.tsx`
- `apps/web/app/rules/page.tsx`
- `apps/web/app/rules/yakuArticleData.ts`
- `apps/web/app/rules/yakuArticleExamples.test.ts`
- `apps/web/app/toolbox/page.tsx`
- `apps/web/app/tools/score-table/page.tsx`
- `apps/web/app/tools/tool-learning.module.css`
- `apps/web/app/training/yaku-quiz/page.tsx`
- `apps/web/app/training/yaku-quiz/quizData.ts`
- `apps/web/app/training/yaku-quiz/YakuQuizClient.tsx`
- 新規 `apps/web/app/training/yaku-quiz/quizData.test.ts`

## 検証

- `pnpm typecheck`：全workspace成功。
- `pnpm exec vitest run`：63ファイル・873テスト成功。今回追加17テスト。麻雀コアや既存トレーニングの回帰テストも含む。
- 役クイズ11問の合法な14枚、アガリ牌、役の成立、選択肢内の正解が一つであること、誤答理由、関連役記事を検証。
- 役牌の門前1翻40符1,300点／中ポン1翻30符1,000点、連風牌2翻、ツモ2翻40符、門前一盃口3翻30符／チー後1翻30符、対々和3翻40符を既存エンジンで検証。
- 点数表の4例は点数計算ツールと同じデータ・処理を使用。既存テストで役・符・支払い・受取合計を確認。
- `pnpm test:security`：5テスト成功。
- `CF_PAGES=1 ADSENSE_REVIEW_MODE=true PRACTICAL_GUIDES_PREVIEW=true pnpm build`：Web202・Mリーグ1,227ルートのStatic Export、統合、noindex適用、サイトマップ112 URL・内部参照1,618件の検査に成功。
- 9ページ×6幅（320 / 375 / 390 / 768 / 1024 / 1280px）、54ケースでページ横はみ出し・見出し切れなし、H1各1個。画面外の遅延読込画像は未読込を破損と誤判定しないよう分けて検査。
- ブラウザで誤答理由の表示→誤答のみ解き直し→全11問正解を確認。JavaScriptエラーログ0件。
- 点数比較表のリンクから2本場・供託1本を計算器へ読み込み、本場2・供託1、放銃者の支払い2,600点、受け取り3,600点を画面でも確認。最終のリンク・表のフォーカス調整後もWebを再ビルドし、Mリーグ出力の再統合とnoindex再適用を実施。
- `git diff --check`：成功。改行コードの警告はあるが、空白エラーなし。

30記事の確認版は別の `docs/practical-articles-30.md` に記録。ローカルはその確認版も含む。通常ビルドには未承認記事を含めない設計を維持している。

## 残る確認

1. 監査で本番にあったMリーグ日付・動画本文欠落・動画canonical・末尾スラッシュ404は、ローカルで修正済みだが未デプロイ。本番のCloudflare応答は公開後に再確認が必要。
2. 新しい実戦解説30記事は数値検証済みだが、戦術表現の最終編集確認待ち。未確認のまま承認状態を変更しない。
3. B候補の全ページを低品質と決めつけたり、全公開ページの人手監査が完了したとは扱わない。短いこと自体は不承認理由の確証ではない。
4. Search Consoleの実際の404・検索クエリ、お問い合わせの運営側受信、Mリーグ・動画記事の権利・独自性の全件確認は未完了。
5. noindexはAdSense審査対象外の保証ではない。今回の改善やテスト成功も承認を保証しない。

## ローカル確認

- 学習入口：<http://127.0.0.1:4173/learn/>
- ツールの使い分け：<http://127.0.0.1:4173/toolbox/#toolbox-purpose-title>
- 点数比較：<http://127.0.0.1:4173/tools/score-table/#score-table-examples-title>
- 役クイズ：<http://127.0.0.1:4173/training/yaku-quiz/>
- 役牌：<http://127.0.0.1:4173/rules/yakuhai/>

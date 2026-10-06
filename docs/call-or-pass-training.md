# 鳴く？鳴かない？トレーニング

## 実装と公開範囲

- 新規URL: `/trainer/call-or-pass`。固定ページのみをindex対象とする。
- 静的出力を維持。API・DB・追加依存パッケージなし。
- 今回はローカル実装。デプロイ・コミットは行わない。
- 4人打ち、喰いタンあり、喰い替えなし、赤牌・本場なし。リーチ問題のみ供託1本。
- 全問はJONGFOLIO独自の合成教材。実牌譜・本人の意図・実戦期待値のデータではない。

## 変更ファイル

新規:

- `apps/web/app/trainer/call-or-pass/page.tsx`: server metadata、構造化データ、ガイド、代表例、問題の事前計算。
- `CallTrainingClient.tsx`: 難易度、10問セッション、回答、成績、復習、端末履歴。
- `CallQuestionView.tsx`: 既存TileStripを使った手牌と副露、鳴き／スルーの比較。
- `callQuestions.ts`: 初級10・中級10・上級10の独立した問題データ。
- `callModel.ts`: 合法な鳴き、喰い替えチェック、打牌適用、既存計算の呼び出し、履歴・シャッフル。
- `callQuestions.test.ts`: 全問題とルール、解説の待ち・打点、成績・履歴の検証。
- `call.module.css`: 既存のshell、panel、CTAに合わせた局面・比較レイアウト。
- `apps/web/public/tool-screenshots/trainer-call-or-pass.jpg`: 実際のローカル画面。
- `packages/mahjong-core/src/handProgress.ts` と `tests/handProgress.test.ts`: 共通の進行度・公開牌込み受け入れ。

更新:

- `trainerCatalog.ts` / `TrainerLearningContent.tsx`: 独立アプリ用のカードデータと「実戦判断」カテゴリ。
- `apps/web/app/sitemap.ts`: 新規固定URLを掲載。
- `apps/web/app/learn/guides/requestedGuideData.ts`: 鳴き判断ガイドから本トレーニングへリンク。
- `packages/mahjong-core/src/index.ts`: 共通計算をexport。
- `packages/tenhou-analysis/src/questions.ts`: 既存の同等ループを共通計算へ置き換え、牌理の重複を防止。

## データスキーマ

`CallQuestion` は以下を保持する。

- id / difficulty / category / title
- hand（既存parseHand形式）/ melds / roundWind / roundNumber / seatWind / turn
- scores（東南西北順）/ doraIndicator / offered / offeredBy
- rivers（今回の捨て牌を含めない抜粋）/ riichiBy / riichiSticks / context
- options: action、consumed、discard、merit、risk、valuePlan
- pass: merit、risk、valuePlan
- recommendedAction / confidence / explanation / checkpoint

`availableActions` は手牌・捨て牌・捨てた席から計算する。全ての合法な行動種類に比較データが必要。
複数のチー形がある問題では、採用したチー形と打牌を回答前に明示する。今回は鳴き方・打牌自体を選ぶゲームではない。

## 難易度と推奨判断

- 初級10問: 役の確保、役なし、七対子、役付きテンパイ。confidenceは全問high。
- 中級10問: 速度と打点、同一牌姿の巡目比較、形固定、七対子との比較。
- 上級10問: オーラス目標、親子、ドラ、リーチへの現物、フリテン、死に待ち。
- 7つの成績カテゴリ: 役牌、速度、打点、役の確認、形・受け入れ、守備、対子手。

推奨は編集判断として設定し、シャンテンや役牌だけのif文で自動採点しない。
採点は推奨判断との一致。mediumは「寄り」と表示し、唯一の正解ではない旨を示す。

## 比較と計算

1. 元手牌は13枚相当。副露があれば10枚・7枚等。
2. 鳴く場合は手牌から2枚を消費し、捨て牌と合わせて副露を作り、指定打牌を1枚切る。
3. スルーと打牌後の手を同じ13枚相当で比較。
4. 既存 `normalShantenWithOpenMelds`、`chiitoitsuShanten`、`kokushiShantenForStrategy` を使う。
5. 受け入れは新しい共通 `analyzeHandProgress` で計算。手牌、副露、表示した河、ドラ表示牌、今回の捨て牌を重複なく差し引く。
6. 副露に移した牌と鳴いた後の打牌は、元の既知牌集合にすでに含まれるため二重に数えない。
7. テンパイ後は既存 `calculateHandScore` でアガリ牌ごとのロン・ツモを計算。ドラは完成形の枚数で数える。
8. 役なしではドラのみの和了を認めない。自分の河と待ち全体を照合し、フリテンなら全待ちでロン不可、役付きツモは可能。

点数は現在形の基本点で、リーチ・裏ドラ・赤ドラ・本場・供託の加点を含まない。未テンパイのvaluePlanは将来の目標であり、成立や金額を保証しない。
省略した河、隠れた手牌、山は不明なので、枚数は残りの上限。確率・期待値は表示しない。
問題はビルド時に事前計算して渡し、スマートフォン上で大量の手牌解析は行わない。

## UIと成績

- 既存PNG牌、TileStrip、panel、CTA、InternalLinkCard、ToolPreviewImage、JsonLdを再利用。
- スマホでは牌を読めるサイズで折り返す。受け入れ牌も横スクロールなし。
- ポン・チー・スルーは合法性に応じてdisabled。連打・二重回答は採点を重複させない。
- 初級・中級・上級ごとの10問をシャッフル。セッション内は重複なし、直前と次セット冒頭も重複回避。
- 最近5問を後ろへ回す。各難易度が10問なので、10問セット全体では再出題される。
- 正解数、正答率、連続正解、カテゴリ別成績、苦手カテゴリ、回答復習、もう10問、難易度変更。
- `jongfolio:call-or-pass:v1` に最近20問と最大20セッションを保存。保存できない環境でもプレイ可能。
- 回答・成績はURLに保存せず、問題ごとのページは作らない。

## 学習とSEO

6つの解説セクションと、問題データを再利用した5つの代表例をserver HTMLへ出力。
関連: 鳴き判断ガイド、牌理チェッカー、配牌分析、オーラス条件計算、現物・スジ・カベ、初心者ロードマップ。
既存の中央indexポリシーの `/trainer/**` に従い、審査モードでもindex。
title、description、canonical、OGP、WebApplication、BreadcrumbList、表示パンくず、sitemapを設定。
ルール参考: [天鳳公式マニュアル](https://tenhou.net/man/index.html)。推奨判断は公式教材ではない。

## 検証

- `pnpm exec vitest run apps/web/app/trainer/call-or-pass/callQuestions.test.ts packages/mahjong-core/tests/handProgress.test.ts`: 47件。
- `pnpm test`: 302件。365日何切る生成を含む既存機能の回帰テスト。
- `pnpm test:tenhou`: 28件。
- `pnpm typecheck`: workspace全体。
- `pnpm build`: webとMリーグの静的ビルド、Cloudflare用ルート正規化、出力マージ。
- ブラウザ: 全30問で回答→比較→結果、390px / 768px / 320px、デスクトップ1280pxを検証。
- 別途中級1問を誤答し、9/10・90%・苦手カテゴリ・成績保存を確認。
- 全30問で牌画像欠損と横方向のはみ出しなし。
- 実出力のindex / canonical / sitemap / 内部リンク / 確認用コードを確認する。

すべて成功。web160ページ、Mリーグ1,227ページの静的出力と統合が完了。
独立したlintコマンドはなく、Next.jsビルド内のlint・型検証を実行。
本番用HTMLをローカル配信し、10問完走、再読み込み後の履歴、index・canonical・構造化データ・一覧カード画像を実際のブラウザでも確認。
中央indexポリシー22件の回帰テストも成功。既存の牌理チェッカー・トレーニングはルートと計算を維持。

## 100問以上への拡張

`callQuestions.ts` に安定IDの問題を追加し、既存の型とvalidateCallQuestionを通す。
必要な行動種類の比較を全て追加する。チーの複数形はどの形で比較するか明記する。
条件違いは別IDで追加できる。まず牌枚数・公開牌・喰い替え・ロン対象外を検証し、その後に解説が実際の待ち・打点・必要点数と一致するテストを足す。
将来候補: 鳴く形と打牌のユーザー選択、100問以上からカテゴリ指定、条件違いの並列比較、赤牌・本場対応。

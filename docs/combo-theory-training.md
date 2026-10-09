# コンボ理論トレーニング 実装・検証記録

## 追加ルート

- アプリ: `/trainer/combo-theory`
- 独自解説: `/learn/guides/combo-theory`
- この文書はローカル検証の結果を記録する。公開状態はGit履歴とCloudflare Pagesのデプロイ履歴で確認する。

## 機能

- コンボ数計算: 初級・中級・上級、4択と数字入力。
- コンボ数比較: 2〜3牌、両面・愚形・合計を明示し、正解が一意の問題だけを採用。
- 実戦形式: 14枚の自分の手牌、4家の河、リーチ表示、副露、ドラ表示牌、巡目。既存の麻雀卓と河の拡大ダイアログを再利用。
- シミュレーター: 34牌種、可視枚数0〜4、比較対象1〜3牌、基本/対リーチ切替、任意のシャンポン相方、リセット、端末保存、共有URL。
- 回答後に5種類の内訳、牌画像、掛け算、除外理由、学習ポイントを表示。
- 成績: 直近1,000回答の解答数・正解数・正答率・連続正解、難易度別/モード別成績。未訂正の間違いは最新30問まで復習できる。
- 解説記事: 12節、局所形の牌図6例、確認問題2例、FAQ、確認した公開参考文献、関連記事。
- トレーニング一覧の実戦判断カテゴリ、トップ、ツール検索、押す/オリる、スジ・カベ関連記事へ導線を追加。

## 計算仕様

`R(t) = 4 - V(t)`。赤5は通常5と同じ牌種。実戦形式は136枚の物理IDを使い、鳴かれた牌が河と副露にある場合も1回だけ数える。

- 両面・カンチャン・ペンチャン: 同じ色の合法ターツを列挙し、`R(a) * R(b)`。
- シャンポン: 対象牌の対子を `R(t) * (R(t) - 1) / 2` で数える。
- 単騎: `R(t)`。
- 基本モデル: 本人の河によるフリテンを適用しない。
- 対リーチモデル: 列挙した待ちのいずれかが本人の河にあれば、その項を除外。他家の河は可視枚数にのみ含める。
- シャンポン相方不明: 条件付きの対子数。相方指定時は相方の残り2枚未満と本人の河によるフリテンも除外するが、相方の組み合わせ数は掛けない。
- 5種類の合計は整数の単純合計であり、放銃率やテンパイ確率には変換しない。
- 可視枚数、河の内数条件、対象牌、相方、URLデータが不正な場合は結果を表示しない。

## 生成と再現

`generateComboQuestion(seed, mode, difficulty)` はJSON化可能な問題・正解・計算内訳を返す。既存のseed乱数を使用し、候補は最大80回まで。上級は最初の20回で合計値が近い比較候補を優先する。

画面の「問題のseedを確認・指定」から再現できる。初期問題は `combo-start-v1` / calculation / beginner。各モードと難易度ボタンにも固定seedを用意している。

副露ありの検証済み再現例: `audit-0` / practical / intermediate。

実戦局面は既存の `makePushFoldQuestion` と `validatePushFoldAudit` を利用する。リーチ成立可能な隠れた手牌、他家の手牌、山、王牌を含めて136枚を検証し、検証用の隠れた配分はアプリの問題データに返さない。押し引きの判定ロジックや既存問題データは変更していない。

## テスト結果

- `pnpm test`: 麻雀ロジック389件成功。既存の365日何切る、シャンテン、受け入れ、点数計算、押し引き評価などを含む。
- `pnpm test:tenhou`: 36件成功。牌譜復元・手出し教材・既存ベンチマークを含む。
- `pnpm --filter @mahjong-trainer/web exec vitest run`: 300件成功。
- `pnpm typecheck`: workspace全体成功。
- 計算エンジンとは別の「完成順子から1枚を抜き、物理牌の組み合わせを列挙する」検証ロジックで、34牌種 × 2モデル × 500入力 = 34,000ケース一致。
- 1,800生成問題: 選択肢重複なし、正解一意、解説と計算一致、生成成功。副露あり191問、複数の4枚見えあり893問、フリテンによる除外あり634問。各分類には重複がある。
- 300合成局面: 136枚の一意な配分、手牌枚数、隠れたリーチの成立条件、鳴かれた牌の二重計数防止を確認。
- 無効URL、相方の不正なキー、河が総可視枚数を超える入力などを拒否。

## 静的出力

PowerShellで本番相当の設定を指定:

```powershell
$env:CF_PAGES = '1'
$env:ADSENSE_REVIEW_MODE = 'true'
$env:TEDASHI_SYNTHETIC_PREVIEW = 'false'
pnpm build
```

Next.jsのビルド内lint・型検証、Web 171ページとMリーグ1,227ページの静的生成、統合出力が成功。独立したlintコマンドは既存package.jsonにない。

サイトマップ81 URLに新しい2ルートを掲載。審査モードにおける動画・Mリーグの除外は維持。アプリのcanonical、index/follow、WebApplicationとBreadcrumbList、記事の既存SEO方式を確認。DB・SSR・常時稼働API・依存パッケージは追加していない。

## ブラウザ確認

ローカルの開発画面と、ビルド後の静的配信で操作を確認した。

- 4択・数字入力、正誤、重複回答防止、次の問題。
- 端末保存と再読み込み、難易度別/モード別成績、復習後の訂正。
- 比較と実戦形式、136枚検証済みの副露あり問題、河の拡大ダイアログ。
- シミュレーターの32→28再計算、両面の他方による16への除外、指定したシャンポン相方のフリテンによる0、最大4枚・対象3牌制限。
- 共有URLの同一状態再現、不正入力時のエラーと結果非表示、リセット。
- 記事・一覧・検索からの遷移。検索「コンボ」で1件、実戦判断・守備フィルターでも表示。
- 320/375/390/768/1024/1280pxで主要4モード、記事、トレーニング一覧、検索結果を検証。ページ全体の横はみ出し、見出し切れ、画像読込失敗なし。実戦形式の14枚は一列。
- 320pxの検索欄の幅制約を修正。麻雀卓の小さな見出しに新ページの文字サイズを適用しないようCSSを限定。
- 実機iOS/Safari・Androidでの検証は未実施。デスクトップChromiumの画面幅テストである。

## 新規ファイル

- `packages/mahjong-core/src/comboTheory.ts`
- `packages/mahjong-core/tests/comboTheory.test.ts`
- `packages/tenhou-analysis/src/replayTiles.ts`
- `apps/web/app/trainer/combo-theory/page.tsx`
- `apps/web/app/trainer/combo-theory/comboModel.ts`
- `apps/web/app/trainer/combo-theory/comboModel.test.ts`
- `apps/web/app/trainer/combo-theory/ComboTrainingClient.tsx`
- `apps/web/app/trainer/combo-theory/ComboSimulator.tsx`
- `apps/web/app/trainer/combo-theory/ComboExplanation.tsx`
- `apps/web/app/trainer/combo-theory/ComboView.test.ts`
- `apps/web/app/trainer/combo-theory/combo.module.css`
- `apps/web/app/learn/guides/comboTheoryGuide.ts`
- `apps/web/public/tool-screenshots/trainer-combo-theory.jpg`
- この文書。

## 変更ファイル

- `packages/mahjong-core/src/index.ts`: 計算APIをexport。
- `packages/tenhou-analysis/package.json`、`src/parser.ts`: 既存の物理牌変換をブラウザ安全な入口へ分離し、元のexportも維持。
- `apps/web/app/trainer/push-or-fold/pushFoldFactory.ts`、`pushFoldAnalysis.ts`: 上記の牌変換のimport先のみ変更。Node専用の牌譜処理を新クライアントへ読み込ませないため。
- `apps/web/app/trainer/push-or-fold/page.tsx`: 関連トレーニングリンク。
- `apps/web/app/trainer/trainerCatalog.ts`、`trainerPresentation.ts`: 新カード、実画面画像、切り出し。
- `apps/web/app/components/HomeLearningHub.tsx`: 既存のトレーニング紹介の下へリンク。
- `apps/web/app/toolbox/toolCatalog.ts`: 検索キーワード。
- `apps/web/app/platform.css`: 検索欄の狭い画面での幅制約。
- `apps/web/app/learn/guides/guideData.ts`、`guideLibraryData.ts`、`guideHighlights.ts`: 独自記事の登録、カード、強調。
- `apps/web/app/learn/guides/requestedGuideData.ts`: スジ・カベ・現物関連記事の内部リンク。
- `apps/web/app/learn/guides/practicalGuideData.test.ts`: 記事件数の期待値更新。

サイトマップは既存カタログと記事データから自動生成されるため、専用の分岐は増やしていない。

## 既知の限界

- コンボ数は局所的な形の組み合わせであり、相手の完全な手牌数・放銃率・テンパイ確率ではない。
- 通常手の局所モデルのみ。七対子・国士無双・複雑な多面待ち、全手牌の役や成立条件、同巡/見逃しフリテンは対象外。
- 相方未指定のシャンポンは条件付き。全ての待ちを完全手牌から復元したフリテン判定ではない。
- 実戦形式は物理牌の配分とリーチ成立可能性を検証した合成スナップショット。実牌譜や全巡目の再生ではない。
- 実測危険度モデルや最善押し引き判定は実装していない。根拠のない百分率は表示しない。
- 参考文献の確認は出版社の書誌公開情報と麻雀数理研究会の公開部分。書籍全文・有料実測表は使用せず、文章・問題・解説は独自制作。
- 成績は端末ローカル・直近1,000回答。アカウント同期なし。

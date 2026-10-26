# 麻雀実戦解説30本の制作記録

作成日：2026-10-25。既存23記事に、用途を分けた実戦応用30記事を追加するローカル確認版。

公開依頼後の補足：2026-10-26の第3段階の検証後、ユーザーから「新規30記事も公開する」と承認を受けた。確認日は2026-10-26、日付をまたいだ公開作業に合わせ公開日は2026-10-27で登録した。公開ビルドで `PRACTICAL_GUIDES_PREVIEW` は有効にせず、通常の承認ゲートから記事・カード・関連リンク・サイトマップを出力する。下記の未承認・未デプロイという記述は制作・検証時点の記録。

## 現在の状態

- 本文30本、77局面、91個の手牌スナップショットを実装。10問指定の2記事は各10問、その他は2〜3局面。
- 91個は前後・分岐・同じ手を別条件で使う表示を含む数で、すべて異なる91手という意味ではない。何切る10選の10手は互いに異なることをテストする。
- 5本ずつの6バッチで追加し、各バッチ追加時に合法性・待ち・点数などを検証。
- 全件、本文実装済み／数値検証済み／戦術上の最終確認待ち。プロ監修済みとは表示しない。
- `PRACTICAL_GUIDES_PREVIEW=true` の場合だけ確認待ちの30本を一覧・個別ルート・サイトマップに含める。未設定の通常ビルドには承認済みの記事だけ含む。
- この作業で本番デプロイ・Git push・AdSense再申請は行わない。

## 制作記事一覧

URLはすべて `/learn/guides/` の後に記載のslugが続く。実装状態の「確認版」は本文が実装されたローカルプレビューを意味する。数値検証は戦術の数学的な唯一解や、本人による監修を意味しない。

| No. | 記事タイトル | 優先度 | URL（slug） | 実装 | 牌姿・数値 | 戦術レビュー |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 受け入れ最大が正解とは限らない何切る10選 | S | [ukeire-versus-practical-decisions](http://127.0.0.1:4173/learn/guides/ukeire-versus-practical-decisions/) | 確認版 | 検証済 | 要確認 |
| 2 | 孤立牌は何を基準に切る？実戦で考えたい5つの軸 | A | [isolated-tile-priorities](http://127.0.0.1:4173/learn/guides/isolated-tile-priorities/) | 確認版 | 検証済 | 要確認 |
| 3 | 同じ受け入れ枚数なら何で差をつける？ | S | [equal-ukeire-tiebreakers](http://127.0.0.1:4173/learn/guides/equal-ukeire-tiebreakers/) | 確認版 | 検証済 | 要確認 |
| 4 | ドラを残すために牌効率を落とすべき場面 | S | [dora-versus-speed](http://127.0.0.1:4173/learn/guides/dora-versus-speed/) | 確認版 | 検証済 | 要確認 |
| 5 | 6ブロックから5ブロックに整理する実戦例 | A | [six-to-five-block-examples](http://127.0.0.1:4173/learn/guides/six-to-five-block-examples/) | 確認版 | 検証済 | 要確認 |
| 6 | 七対子と通常手、どちらを狙うべきか | A | [chiitoitsu-or-standard](http://127.0.0.1:4173/learn/guides/chiitoitsu-or-standard/) | 確認版 | 検証済 | 要確認 |
| 7 | 悪い配牌からアガリに近づく手順 | A | [weak-starting-hand-branches](http://127.0.0.1:4173/learn/guides/weak-starting-hand-branches/) | 確認版 | 検証済 | 要確認 |
| 8 | 先制テンパイを取るか、良形変化を待つか | S | [take-tenpai-or-improve](http://127.0.0.1:4173/learn/guides/take-tenpai-or-improve/) | 確認版 | 検証済 | 要確認 |
| 9 | リーチ判断が分かれ得る局面を比べる | S | [riichi-borderline-decisions](http://127.0.0.1:4173/learn/guides/riichi-borderline-decisions/) | 確認版 | 検証済 | 要確認 |
| 10 | 牌効率を無視するべき状況とは？ | S | [when-to-depart-from-efficiency](http://127.0.0.1:4173/learn/guides/when-to-depart-from-efficiency/) | 確認版 | 検証済 | 要確認 |
| 11 | 手出し・ツモ切りから何が分かる？ | S | [tedashi-tsumogiri-information](http://127.0.0.1:4173/learn/guides/tedashi-tsumogiri-information/) | 確認版 | 検証済 | 要確認 |
| 12 | リーチ宣言牌から考える待ちの候補 | S | [riichi-tile-wait-candidates](http://127.0.0.1:4173/learn/guides/riichi-tile-wait-candidates/) | 確認版 | 検証済 | 要確認 |
| 13 | スジが通っていても危険な牌とは？ | A | [suji-traps](http://127.0.0.1:4173/learn/guides/suji-traps/) | 確認版 | 検証済 | 要確認 |
| 14 | 早いリーチと遅いリーチで判断は変わる？ | A | [early-and-late-riichi](http://127.0.0.1:4173/learn/guides/early-and-late-riichi/) | 確認版 | 検証済 | 要確認 |
| 15 | 2軒リーチで安全牌が足りないとき | S | [two-riichi-short-on-safe-tiles](http://127.0.0.1:4173/learn/guides/two-riichi-short-on-safe-tiles/) | 確認版 | 検証済 | 要確認 |
| 16 | 対子落とし・ターツ落としから考える手牌進行 | S | [pair-and-taatsu-discard](http://127.0.0.1:4173/learn/guides/pair-and-taatsu-discard/) | 確認版 | 検証済 | 要確認 |
| 17 | 中盤のドラ切りから何を推測できるか | A | [midgame-dora-discard](http://127.0.0.1:4173/learn/guides/midgame-dora-discard/) | 確認版 | 検証済 | 要確認 |
| 18 | 手出しの順番から考えられる手牌変化 | S | [discard-order-hand-changes](http://127.0.0.1:4173/learn/guides/discard-order-hand-changes/) | 確認版 | 検証済 | 要確認 |
| 19 | 押し引きが微妙な局面の考え方 | S | [borderline-push-fold](http://127.0.0.1:4173/learn/guides/borderline-push-fold/) | 確認版 | 検証済 | 要確認 |
| 20 | 一見安全そうな牌に潜む危険な待ち | A | [deceptively-safe-tiles](http://127.0.0.1:4173/learn/guides/deceptively-safe-tiles/) | 確認版 | 検証済 | 要確認 |
| 21 | トップ目がやってはいけないこと5選 | A | [top-place-five-mistakes](http://127.0.0.1:4173/learn/guides/top-place-five-mistakes/) | 確認版 | 検証済 | 要確認 |
| 22 | ラス目で無理なアガリを狙うべきか | A | [last-place-attack](http://127.0.0.1:4173/learn/guides/last-place-attack/) | 確認版 | 検証済 | 要確認 |
| 23 | オーラスの着順条件・実戦問題10選 | S | [orasu-practice-ten](http://127.0.0.1:4173/learn/guides/orasu-practice-ten/) | 確認版 | 検証済 | 要確認 |
| 24 | 親番で押し引きが変わる理由 | A | [dealer-push-fold](http://127.0.0.1:4173/learn/guides/dealer-push-fold/) | 確認版 | 検証済 | 要確認 |
| 25 | 供託・本場が判断に与える影響 | B | [honba-and-sticks-decisions](http://127.0.0.1:4173/learn/guides/honba-and-sticks-decisions/) | 確認版 | 検証済 | 要確認 |
| 26 | 順位点を考えたリーチ判断 | S | [placement-points-and-riichi](http://127.0.0.1:4173/learn/guides/placement-points-and-riichi/) | 確認版 | 検証済 | 要確認 |
| 27 | ダマテンでアガる価値が高い状況 | A | [dama-value-situations](http://127.0.0.1:4173/learn/guides/dama-value-situations/) | 確認版 | 検証済 | 要確認 |
| 28 | 流局テンパイを目指すべき場面 | A | [endgame-tenpai-value](http://127.0.0.1:4173/learn/guides/endgame-tenpai-value/) | 確認版 | 検証済 | 要確認 |
| 29 | 相手の副露を見て守備を始める基準 | A | [opponent-calls-defense](http://127.0.0.1:4173/learn/guides/opponent-calls-defense/) | 確認版 | 検証済 | 要確認 |
| 30 | 失点を最小化するための局面判断 | S | [minimize-loss-decisions](http://127.0.0.1:4173/learn/guides/minimize-loss-decisions/) | 確認版 | 検証済 | 要確認 |

No.2と9は、実在するプロの未確認の意見として書かないようタイトルを調整した。各記事の既存テーマとの違いは `practicalArticleSpecs[].distinction` に記録している。

## 構成と重複回避

- 既存の牌効率・待ち・役・守備記事は基礎教材として維持。新記事は「一つの局面でどの条件が判断を変えるか」を中心に制作。
- 何切る：14枚→主な打牌と枚数基準の比較→理由→次の手順。通常手の最小シャンテンで受け入れ最大になる候補を自動で含める。
- 読み：河と手出し情報→別々の候補13枚または前後の13枚→確定する変化と残る推測。教材用の構成例であることを明記。
- 点棒：4人の持ち点→目標・本場・供託・同点設定→相手別の最低ロンとツモ→精算後の点棒。
- 既存記事からは関連する新しい応用記事を表示。新記事は基礎記事・他の新記事・既存トレーニングへ接続する。通常ビルドで未承認記事へのリンクは出ない。
- 初期HTMLに解説と数値表を出す。新しいアプリ・DB・外部有料API・依存パッケージは追加しない。

## 計算と牌図

- 牌画像は既存 `TileStrip` / `tileAssetName` と既存PNGを使用。
- チェッカーへのURLには手牌14枚を含める。公開牌のURL読込は既存ツールにないため、河・表示牌は読者が追加入力する案内を該当例に付けた。オーラスの点棒条件はURLから全入力を引き継ぐ。
- 通常手は `analyzeDiscards`、実際に表示する残り枚数は `calculateVisibleUkeire` を使用。元の14枚・捨てた牌・例に指定した河と追加公開牌を差し引く。本文の現物・明示したドラの表示牌も入力に反映。
- 特殊手を含む13枚の進行は `analyzeHandProgress`、七対子の比較は `chiitoitsuShanten` を使用。表の通常手受け入れと特殊手の進行を混同しないよう記載。
- リーチ・ダマは12の和了条件を比較。役なしロン1件を含む24パターンの点数判定を検証。赤・一発・裏ドラ・本場・供託を入れない比較条件を明記。
- オーラスは17の入力条件（問題集10問を含む）を `calculateOrasuConditions` で検証。流局2例は `calculateOrasuDraw` を使用。
- 15の通常の時系列変化と2つの分岐で、ツモ・打牌後の牌が保存されることを検証。
- 代表例：`556m788899p34567s` の5萬・6萬切りは各19枚受け。その後2索ツモ・7筒切りで、4・7萬の8枚待ちと5萬・9筒の4枚待ちに分かれることを検証。全体の最大は7筒切り23枚という別候補であることも表と本文に記載。
- 点棒条件の「該当なし」は単独役満までのツール候補で未達という意味。複合役満まで不可能という断定はしない。

## 変更したファイル

新規：`apps/web/app/learn/guides/practicalArticles/` に6バッチ、型、数値接続、表示、スタイル、点棒問題、管理表、公開承認設定、2つの検証テストを追加。オーラス計算へ入力を引き継ぐ `apps/web/app/analysis/orasu-condition/sharedCondition.ts` を追加。

変更：`guideData.ts`（既存型を任意項目で拡張）、`guideLibraryData.ts`（既存一覧へ追加）、`[slug]/page.tsx`（既存ルートとmetadataを維持して局面・日付・関連ツールを表示）、`OrasuConditionCalculator.tsx`（検証済みURL入力の読み込みを追加）。麻雀コアの計算・出題・判定は変更していない。

## 公開前の確認

`practicalArticles/reviewState.ts` の `practicalArticleApprovals` は現在空。戦術上の説明を本人が確認した記事から、slugをキーに実際の `reviewedAt` と `publishedAt` を登録する。通常ビルドではその記事だけ一覧・個別ルート・サイトマップへ追加する。確認前に実名やプロ監修の表記を増やさない。

作成日は2026-10-25として表示し、未公開の記事に公開済みの日付を捏造しない。Article構造化データには `dateCreated` / `dateModified`、公開承認後には `datePublished` を追加する。canonical、パンくず、固有title・descriptionは既存の共通ルートから生成する。

戦術上の最終確認では、各選択肢の有力になる巡目・点棒・役の条件、表現の強さ、オリる相手と安全根拠の範囲を確認する。数学的な唯一解や放銃率・和了率・期待値の測定結果として説明しない。

## 検証記録

- `pnpm typecheck`：全workspace成功。
- `pnpm exec vitest run`：62ファイル・856テスト成功（既存818件＋追加38件）。
- `pnpm exec vitest run apps/web/app/learn/guides/practicalArticles`：38テスト成功。30テーマ、77局面、91手牌、同率比較、牌の保存、点数、順位、リンク、実画像、公開制御を検証。
- `CF_PAGES=1 ADSENSE_REVIEW_MODE=true PRACTICAL_GUIDES_PREVIEW=true pnpm build`：Web202ルート、Mリーグ1,227ルートをStatic Export。サイトマップ112 URL・内部参照1,618件の検査に成功。
- 320 / 375 / 390 / 768 / 1024 / 1280pxで30記事を検査（180ケース）。ページ横はみ出し・画像読み込み失敗・見出し切れ・手牌の折り返しは0件。320pxの七対子比較表による幅拡大を修正してから全件再検査した。
- 本場2・供託1の入力引き継ぎをブラウザで操作し、東家32,000→30,400、自分28,500→31,100を計算ツールの内訳で確認。検索は対象記事1件へ絞り込めることを確認。ブラウザのJavaScriptエラーログは0件。
- 初期HTMLにも30記事・77局面・作成日と単一H1が含まれることを検査。JavaScriptで本文を後から作る構成ではない。
- 専用のESLintスクリプトは既存package.jsonにない。Next.jsビルドのLint/type validationは成功。最後の狭幅修正後もWebを再ビルドし、Mリーグ出力を再統合・審査ポリシーを再適用して静的出力を検査。
- 通常の公開対象、既存noindexポリシー、麻雀計算コードは維持。本番デプロイは行わない。

追補：既存9ページの監査後改善も含めた最新の全体テストは63ファイル・873件成功。詳細は [監査後の改善記録](adsense-quality-followup-2026-10-25.md) に記載。上記856件は30記事実装時点の記録。

## 今後の候補

2026-10-26追補: 第2段階で5カテゴリ・難易度・学習ルート・記事とツールの相互導線、フリテンとロン／ツモ比較を改善しました。最新の状態と検証は [第2段階の改善記録](adsense-quality-stage2-2026-10-26.md) を参照してください。上記の初回検証値は履歴として残しています。公開承認は引き続き未設定です。

1. 同じ14枚の巡目・ドラ・点棒だけを切り替え、判断が変わる条件を答える復習。
2. 手出しの前後を順に開示し、確定情報と推測を分けて記録する練習。
3. オーラス10問を点数計算と接続し、「必要点」と「今の手で作れる点」を交差させる練習。
4. 記事の例を間違いノートへ保存し、関連する既存トレーニングへ戻る導線。

これらの新機能自体は今回実装していない。まず30本の戦術上の最終確認と、承認記事の段階的公開を優先する。

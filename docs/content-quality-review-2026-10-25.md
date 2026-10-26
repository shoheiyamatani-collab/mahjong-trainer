# 既存コンテンツ品質改善・監査記録（2026-10-25）

## 対象と結論

- 動画紹介は実数68記事（初級30・中級25・プロ13）。全記事の出力本文、見出し、関連記事、書籍導線、metadataを調査。
- 今回の保守的な編集評価：A 1本／B 34本／C 33本。文字数で自動採点せず、目的・再現性・本文との整合・同テーマとの差分を見て判断した。Googleの採点や合否予測ではない。
- 68記事すべてに分野別の実在する練習・計算先を追加。これはナビ改善であり、68記事の内容を検証済み・十分な独自教材にしたという意味ではない。
- 全編視聴・字幕・局面の照合は完了していない。Aの1記事は元動画の未確認の断定を増やさず、独自の計算教材として再現できる例を追加・検証したもの。ほかの具体例の検証が必要な記事は改善待ちとして記録する。
- ページ削除・統合・新たなnoindex変更・デプロイはしていない。30本の新規解説記事のソース・公開承認状態には触れていない。

## 判断基準

- A：記事単独で使える独自教材と、その根拠・条件が十分に確認できる。
- B：学習対象と使い道は明確。独自の検証例や差分の追加で価値を高められる。
- C：見出しで約束した内容の不足、実際の条件を欠く推測、類似した視聴案内への依存が大きい。大幅な補強または整理を検討する。
- 「統合候補」は提案のみ。URLやページを統合する前には対象と理由について別途合意が必要。

## 動画68記事の個別評価

全行のURLは `/videos/strategy/` 以下。いずれも閲覧可能なまま保持する。
表中の不足は独自教材として残る課題を示す。本文のない小見出しを表示しない修正は行ったが、隠れていた説明を検証・補完したことにはならないため、分類を自動で引き上げていない。

| 記事URL（上記配下） | 評価 | 根拠・残る対応 |
| --- | --- | --- |
| `beginner-win-chance-basics` | B | 4分野の入門目的は明確。各判断の条件付き比較は不足 |
| `yaku-grouping-memory-guide` | B | 役の分類と役一覧の導線がある。分類を使う具体例は未検証 |
| `three-shanten-mistakes-beginners-avoid` | B | 雀頭と進行の説明はある。例外条件と全体手牌の検証が必要 |
| `ukeire-vs-shape-change-basics` | A | 既存14枚教材から1筒切り後の2萬ツモ／5筒ツモを比較。6索切り後の0／1シャンテンを既存ロジックで検証し、各14枚をツールへ渡して再現可能。元動画の局面とは区別 |
| `prioritize-ukeire-over-shape-change` | B | 表示のない手牌を指す説明を修正。元動画の各比較条件は要確認 |
| `tile-efficiency-complete-beginner-guide` | B | 学習順の案内として機能。総合講座の代わりになる独自教材ではない |
| `tile-efficiency-four-rules` | C | 4法則という案内に対し、本文は数え方の一般論にとどまる |
| `seven-important-shapes-to-memorize` | C | 7形の実体が本文に表示されない。類似する形の記事との整理候補 |
| `seven-strong-shapes-for-winning` | C | 7形という約束に対して具体的比較が不足。別の7形記事と重複 |
| `seven-meld-building-shapes` | C | 伸びる形の一般論が中心。7形の解説・差分を動画で確認する必要 |
| `beginner-nanikiru-ten-questions` | C | 架空の開閉操作案内は修正。問題ごとの独自検証はなく元動画への依存が強い |
| `isolated-terminal-tile-order` | B | 存在しない順位表の案内を修正。端牌比較の条件付き検証は残る |
| `honor-tile-discard-order` | B | 役牌・安全性の区別と利用者像が明確。場風・自風の具体的比較を今後検討 |
| `tile-efficiency-essential-theory-quiz` | C | 16問・5テーマの紹介に対して記事独自の問題検証がない |
| `important-yaku-for-higher-scores` | C | 表示されない緑枠への説明を修正。10役の独自解説・比較は役一覧に依存 |
| `beginner-calling-theory` | B | 役と鳴く形の条件を説明。点差・巡目で変わる条件の検証が必要 |
| `calling-to-improve-wait-quiz` | B | 鳴き後の分解という学習目的が具体的。10問の実局面は未検証 |
| `multi-sided-waits-23-patterns` | B | 23形を転載せず分解の見方を案内。独自の待ち検証が不足 |
| `riichi-judgment-ten-questions` | B | 待ち・打点・局面の判断軸が明確。動画各問の独自比較は未確認 |
| `after-calling-tenpai` | B | 打点と待ち改善を区別。副露非対応チェッカーへの紛らわしい導線を修正 |
| `how-to-read-fuuro-rate` | B | 副露率の定義がある。分母とルール差を含む実データの分析は未掲載 |
| `suji-kabe-defense-basics` | B | 現物と読みを区別。残る待ちの比較を自サイト教材で補う余地 |
| `no-safe-tile-defense-techniques` | B | 同種牌を使う守備の目的を説明。相手のツモ後など適用限界を補う必要 |
| `betaori-three-principles` | B | 表示されない色枠への説明を修正。安全情報の更新という復習目的を明確化 |
| `betaori-practice-ten-questions` | B | 安全と比較的安全を区別して練習に接続。動画各問の検証は未実施 |
| `common-bad-habits-self-check` | C | 3つの癖の見出しに対して本文が一般的な励ましにとどまる |
| `easy-score-calculation-without-fu` | B | 親子・翻符の確認先がある。例外を含めた独自の点数検証が必要 |
| `practical-score-calculation-quiz` | B | 平和のロン・ツモを区別。元動画の10問を検証した教材ではない |
| `discard-reading-fundamentals` | B | 確定情報と推測を区別する目的が明確。具体的な根拠照合は未掲載 |
| `reach-declaration-tile-reading` | B | 存在しない図の色説明を修正。宣言牌だけで待ちを断定しない注意を追加 |
| `intermediate-tile-efficiency-26-rules` | B | 公式8テーマを確認し、独自26項目との区別を明示。26判断の全編照合・計算検証は未完了 |
| `when-not-to-follow-tile-efficiency` | B | 速度以外の判断軸を説明。チェッカーで打点変化も分かるという誤案内を修正 |
| `three-dimensional-nanikiru` | B | 手牌と場況を分ける手順がある。条件を再現する独自実例は不足 |
| `when-terminal-is-better-than-28` | C | 逆転する3ケースの具体的説明が欠け、動画への依存が強い |
| `four-tile-shape-vs-floating-tile` | C | 5形の比較が本文に表示されない。候補と条件の再確認が必要 |
| `safe-tile-and-floating-tile-decisions` | C | 2基準をうたう一方、手牌・局面条件がなく判断を再現しにくい |
| `playing-bad-starting-hands` | B | 参加方針の整理と配牌分析に接続。同テーマ2本の差分は未検証 |
| `playing-weak-starting-hands` | B | 速度・打点・撤退の観点がある。別の悪配牌記事と類似する部分が多い |
| `how-to-handle-35677` | C | 存在しない図の案内は修正。部分形だけで選択を一般化しない全体条件の検証が必要 |
| `block-count-approach` | C | 4・5・6ブロックの説明のうち表示が不十分。既存5ブロック記事との整理候補 |
| `how-to-use-mahjong-reading` | C | 情報を3段階に分ける見出しの本文が不足。独自の実局面照合もない |
| `discard-block-structure-reading` | B | 手出し・河・推測の目的を説明。読みの根拠を確かめる実例が不足 |
| `betaori-priority-order` | B | 存在しない順位表の説明を修正。確定情報と複数相手の比較に整理 |
| `push-fold-judgment-ten-questions` | B | 判断材料と復習手順が明確。各問題の独自検証は未実施 |
| `betaori-risk-test-intermediate` | B | 確定情報・候補比較・次巡を分ける。危険度の実測値はない |
| `mawashi-uchi-counterattack` | B | 押す・回す・降りるの目的を区別。実局面の条件付き比較が必要 |
| `three-pairs-shape-efficiency` | C | 基準の見出しに本文がなく、5・6ブロックの比較条件も不足 |
| `ryankan-vs-aryanmen-shape` | B | 2形の役割の説明はある。待ち枚数を比較する独自例は未検証 |
| `how-to-handle-four-consecutive-shape` | C | 代表的な変化を示す本文が欠け、数字だけで一般化しやすい |
| `penchan-vs-isolated-tiles-priority` | B | テンパイ速度と良形変化を区別。巡目・打点込みの比較は未検証 |
| `calling-read-chi-discard-matagi` | C | 3条件の局面根拠と例外の検証が必要。確率表現の裏付けがない |
| `calling-read-fixed-ryanmen-chi` | C | 待ちを否定する推測の根拠が本文だけでは追えない。実牌譜の照合が必要 |
| `calling-read-two-essential-patterns` | C | 相手の手順を仮定する説明が中心。2パターンの成立条件を全編で再確認すべき |
| `how-to-handle-2446-shape` | C | 切り方の全体条件と3候補の比較が不足。部分形の断定を避ける精査が必要 |
| `discard-reading-ten-question-test` | B | 確定と推測を分けて解く目的が明確。10問の独自照合は未実施 |
| `pro/hori-shingo-practical-commentary` | C | 個別局の時刻・判断比較がなく、他の実戦解説と構成・復習文が類似。視聴観点と本人の発言を区別する表示に修正したが、独自の局面検証は残る |
| `pro/nakabayashi-kei-practical-commentary-1` | C | 個別局の時刻・判断比較がなく、他の実戦解説と構成・復習文が類似。視聴観点と本人の発言を区別する表示に修正したが、独自の局面検証は残る |
| `pro/nakabayashi-kei-practical-commentary-2` | C | 個別局の時刻・判断比較がなく、他の実戦解説と構成・復習文が類似。視聴観点と本人の発言を区別する表示に修正したが、独自の局面検証は残る |
| `pro/nakabayashi-kei-practical-commentary-3` | C | 個別局の時刻・判断比較がなく、他の実戦解説と構成・復習文が類似。視聴観点と本人の発言を区別する表示に修正したが、独自の局面検証は残る |
| `pro/sonoda-ken-practical-commentary` | C | 個別局の時刻・判断比較がなく、他の実戦解説と構成・復習文が類似。視聴観点と本人の発言を区別する表示に修正したが、独自の局面検証は残る |
| `pro/suzuki-yu-practical-commentary` | C | 個別局の時刻・判断比較がなく、他の実戦解説と構成・復習文が類似。視聴観点と本人の発言を区別する表示に修正したが、独自の局面検証は残る |
| `pro/date-arisa-practical-commentary` | C | 個別局の時刻・判断比較がなく、他の実戦解説と構成・復習文が類似。視聴観点と本人の発言を区別する表示に修正したが、独自の局面検証は残る |
| `pro/daigo-dai-practical-commentary` | C | 個別局の時刻・判断比較がなく、他の実戦解説と構成・復習文が類似。視聴観点と本人の発言を区別する表示に修正したが、独自の局面検証は残る |
| `pro/matsumoto-yoshihiro-practical-commentary` | C | 個別局の時刻・判断比較がなく、他の実戦解説と構成・復習文が類似。視聴観点と本人の発言を区別する表示に修正したが、独自の局面検証は残る |
| `pro/shibukawa-nanba-practical-commentary-2` | C | 個別局の時刻・判断比較がなく、他の実戦解説と構成・復習文が類似。視聴観点と本人の発言を区別する表示に修正したが、独自の局面検証は残る |
| `pro/ishii-kazuma-practical-commentary` | C | 個別局の時刻・判断比較がなく、他の実戦解説と構成・復習文が類似。視聴観点と本人の発言を区別する表示に修正したが、独自の局面検証は残る |
| `pro/asakura-koshin-practical-commentary` | C | 個別局の時刻・判断比較がなく、他の実戦解説と構成・復習文が類似。視聴観点と本人の発言を区別する表示に修正したが、独自の局面検証は残る |
| `pro/nishimura-yuichiro-practical-commentary` | C | 個別局の時刻・判断比較がなく、他の実戦解説と構成・復習文が類似。視聴観点と本人の発言を区別する表示に修正したが、独自の局面検証は残る |

## 今回の修正

- 使われていなかったVideoPracticeGatewayをサーバー出力型で接続。静的42記事と共通テンプレート26記事に分野別2導線を追加し、書籍より前へ配置。
- 見出ししかない要点は表示しない。表示していない図・色枠・順位表・開閉操作を指す説明を修正。既存の未使用データは削除せず残す。
- 共有テンプレートの26記事に読了目安を追加し、一覧と同じデータを利用。VideoObjectのpublisherを配信チャンネルに訂正。
- 26セオリー記事は公式説明欄の8テーマと、当サイトが整理した26の復習項目を分離。部分形は14枚の実局面ではないことを明示し、同じ両面を根拠なく「弱い」としたラベルを修正。
- 副露手の待ちを通常形専用チェッカーで調べるように見えるリンクと、チェッカーで打点変化を調べられるという誤案内を修正。
- 受け入れと手変わりの記事へ、既存教材の14枚から派生する検証例を追加。1筒切り後の受け入れ16種54枚、2萬ツモ→6索切りでテンパイ、5筒ツモ→6索切りでは一向聴を確認。各条件をチェッカーで再現できるリンクを設置。動画の実局面を捏造せず、独自の教材として分離した。
- 亜両面の部分図が3枚になっていたため4枚形へ訂正。追加導線と書籍が同じグリッド行へ並ばないようにし、記事内アンカーが固定ヘッダーの下へ隠れる点も修正。
- 動画一覧の「これからまとめます」という古い案内を現在の掲載状況に合わせた。

## 動画URLの確認範囲

- YouTube公式oEmbedで145個の固有IDを確認：動画紹介68、Mリーグ切り抜き77（最近24・役満37・名場面16）。
- 全145件でHTTP 200とタイトル・配信元を取得。各一覧内のID重複・URLとの不一致は0件。
- oEmbed成功は内容の正確性、全地域での再生、埋め込み可能性を保証しない。失敗した場合も削除とは断定しない設計。
- 元データ：`output/video-availability.json`（生成物）。再確認：`node scripts/check-video-availability.mjs`。
- 26セオリーの公式説明欄はブラウザで確認したが、26の各判断を全編照合したわけではない。

## Mリーグ

- トップ：結果・集計・切り抜きの違いを明示。点数表・逆転条件・守備の独自教材へ接続。
- 最近／役満／名場面：テーマ別の視聴・復習方法と、当サイトの学習記事・練習への導線を追加。投稿者の動画と当サイトの補足を区別。
- 切り抜きの紹介文は「掲載メモ」と表示し、局面の検証済み解説とは区別。非公式表記と訂正窓口を追加。
- 最近の切り抜き：10月24日公開を含む一覧に10月18日確認と書かれていた不整合を解消。最新掲載動画の公開日をデータから表示し、確認日と偽らない。
- 成績一覧：チーム集計・平均着順の分母を説明。ポイント順位、少ない半荘数、将来の勝率を混同しない注意を追加。
- 選手：既存のプロフィール・出典・動画との相互リンクを維持。成績表示にTOP率・連対率・ラス回避率の定義と解釈上の限界を追加。
- 2026-10-26の月曜表示は前回修正済み。既存の時差に依存しない日付処理と回帰テストを再実行。
- 残課題：切り抜き77件の全編照合・局面根拠の記録、掲載メモ内の感情・意図・確率表現の個別精査。動画タイトルだけで戦術解説を補わない。

## 運営・技術方針

- 運営表記は「雀フォリオ運営」を維持。個人名・所属・資格・経歴の調査や追加はしていない。
- 通常形専用チェッカーの範囲、公開牌入力と☆・良形率の関係、点数・条件計算の非対応範囲を明記。
- 計算値と推定値、動画公開日と確認日、共通計算ロジックでのテストと独立した検証の違いを明記。
- 訂正の再現条件、出典確認、回帰テスト、問い合わせへの流れを説明。
- URL・title・description・canonical・構造化データを原則保持。上記の配信元訂正を除くSEO方針変更なし。
- robots.txt、sitemap、AdSense確認情報、既存index方針は維持。品質評価をnoindexへ自動反映しない。

## 次の優先対応

1. C記事から主題の重複が大きい7形記事・実戦解説を選び、元動画の具体的時刻と条件を記録して検証する。ページ統合は事前相談する。
2. 鳴き読みの3記事は「通りやすい」等の条件と例外を実牌譜または確認可能な元動画で照合。根拠のない確率を追加しない。
3. B記事へ、既存ツールで再現できる比較を少数ずつ追加する。既存30記事の制作とは別に承認・検証する。
4. 切り抜き掲載メモの事実・意図の表現を1件ずつ精査し、確認時点と根拠を残す。今回の一般的な学習補足で局面検証を済ませたことにしない。
5. 本番反映は別途依頼後。審査前には公開HTML・リンク・実機表示を再確認する。noindexはAdSense審査からの除外保証ではない。

## 検証結果と変更範囲

- `pnpm typecheck`：全workspace成功。
- `CONTENT_AUDIT_REPORT=true pnpm exec vitest run`：64ファイル・883テスト成功。曜日表示・牌理・点数計算等の既存テストと、追加した計算例・表示の回帰テストを含む。
- `pnpm test:security`：5テスト成功。
- `pnpm build`：Web・Mリーグとも本番ビルドとNext.js内のESLint成功。その後の表示修正は`pnpm build:web`で再出力し、Mリーグ出力の統合・既存公開ポリシー適用を再実行。
- `ADSENSE_REVIEW_MODE=true pnpm verify:static`：サイトマップ112URL・内部参照1618件で出力欠落なし。ローカルは従来通り新規30記事を含むpreview設定で、本番への公開承認状態は変えていない。
- `audit-existing-content.py --check`：68記事の空の要点見出し0、練習導線68、読了目安欠落0。canonical・既存robots・nocookie iframeのID/title/lazy/fullscreen検証でエラー0。
- HTTP確認：主要29通りの末尾スラッシュあり／なしURLが200、存在しない検証用URLが404。
- ブラウザ確認：主要7ページ×320/375/390/768/1024/1280pxの42画面で意図しない横幅超過0。動画→何切る、Mリーグ→条件計算のクリック遷移も確認。追加した2萬ツモと5筒ツモのリンクでは、入力14枚と6索切りの「聴牌／一向聴」をチェッカー画面上でも照合した。
- `git diff --check`：エラーなし。`packages/mahjong-core`・牌譜解析・index設定・`apps/web/app/learn/guides`には差分なし。
- 変更は動画の静的42記事と共有表示、Mリーグのトップ・切り抜き・成績表示、about、動画限定CSS、監査スクリプト・テスト。新規公開route、依存パッケージ追加なし。
- 新規ファイル：`videoPracticeLinks.ts`、`chapterData.ts`、`ukeireExample.ts`、`ClipLearningGuide.tsx`、`scripts/content-quality.test.ts`、`scripts/audit-existing-content.py`、`scripts/check-video-availability.mjs`、本記録。

ローカル確認先：
- http://127.0.0.1:4173/videos/strategy/ukeire-vs-shape-change-basics/#ukeire-checker-example-title
- http://127.0.0.1:4173/videos/strategy/intermediate-tile-efficiency-26-rules/#official-chapters-title
- http://127.0.0.1:4173/mleague/clips/recent/#clip-learning-title
- http://127.0.0.1:4173/about/#calculation-policy

未実施：全68動画・77切り抜きの全編視聴による照合、全端末の実機検証、本番デプロイ・AdSense再申請。

## 参考資料

- [Google AdSense：独自性と付加価値のあるコンテンツ](https://support.google.com/adsense/answer/10015918?hl=ja)
- [26セオリーの元動画・公式説明欄](https://www.youtube.com/watch?v=7zl8NwudR5g)
- [Mリーグ公式ルール](https://m-league.jp/about/)

合格の保証や文字数・記事本数の固定基準としては扱わない。

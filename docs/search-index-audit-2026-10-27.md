# 検索インデックス技術監査（2026-10-27）

## 結論と対象範囲

指定8URLには、現時点でインデックス登録を妨げる技術的な障害は確認できませんでした。公開サイトのサイトマップ112URLも全件200応答です。未登録27件全体の原因が解消した、またはGoogleが必ず登録する、という判定ではありません。

開始時は `main` / `d8068929`、Gitの未コミット変更なし。リモートとの差分もなし。既存の計算ロジック、URL、記事30本の制作データ、index/noindex方針、Cloudflare PagesのStatic Export構成は維持しました。push・デプロイ・Search Console操作・AdSense再申請は実施していません。

公開サイトの取得結果と、今回修正したローカル出力は区別しています。以下の修正はまだ本番に反映していません。

## A. 発見した問題

| 優先度 | 確認した事実 | 対応 |
| --- | --- | --- |
| 重大 | 指定8URL・サイトマップ掲載URLのクロール阻害や掲載漏れは確認されず | 正常な設定は維持 |
| 中程度 | 既存の学習入口 `/learn` に他ページからのHTMLリンクがなく、孤立していた | `/learn/guides` の学習案内から1本リンクを追加 |
| 軽微 | サイトマップに更新日情報がなかった | 履歴が記録されている記事のみ `lastmod` を追加 |
| 軽微 | 既存の出力検査は「サイトマップURL→HTML」が中心で、新規公開HTMLの掲載漏れを検出しにくい | 逆方向の照合もビルドに追加 |
| 軽微 | 一向聴記事の部分図に「テンパイ牌」と表示され、全手牌のテンパイと混同し得た | 「面子になる牌」へ修正し、全13枚で確認する旨を明記 |
| 軽微 | 白いフッターに旧テーマの白文字指定が残り、ロゴの一部が読めなかった | 既存デザイントークンの文字色へ修正 |

「lastmodがない」「サイトが新しい」「本文が短い」ことだけを、27件の未登録原因とは判断していません。

## B. 実施した修正とファイル

作業ディレクトリ：`C:/Users/PC_User/Documents/Codex/2026-06-26/python-python-web-streamlit-ui-34`

| ファイル | 変更内容 |
| --- | --- |
| [sitemap.ts](C:/Users/PC_User/Documents/Codex/2026-06-26/python-python-web-streamlit-ui-34/apps/web/app/sitemap.ts) | 記事の記録済み作成日・更新日・公開日の最新日をlastmodに使用。ビルド日時は使わない |
| [sitemap.test.ts](C:/Users/PC_User/Documents/Codex/2026-06-26/python-python-web-streamlit-ui-34/apps/web/app/sitemap.test.ts)（新規） | 記事・教材・トレーニング・主要ツールの掲載、既存除外、重複、日付、別日のビルドでも不変であることを検査 |
| [学習記事一覧](C:/Users/PC_User/Documents/Codex/2026-06-26/python-python-web-streamlit-ui-34/apps/web/app/learn/guides/page.tsx) | 孤立していた `/learn` への自然なHTMLリンクを追加 |
| [requestedGuideData.ts](C:/Users/PC_User/Documents/Codex/2026-06-26/python-python-web-streamlit-ui-34/apps/web/app/learn/guides/requestedGuideData.ts) | 部分図の説明とラベルを修正。牌姿・計算値は変更しない |
| [platform.css](C:/Users/PC_User/Documents/Codex/2026-06-26/python-python-web-streamlit-ui-34/apps/web/app/platform.css) | フッターロゴの文字色のみ修正 |
| [verify-static-output.mjs](C:/Users/PC_User/Documents/Codex/2026-06-26/python-python-web-streamlit-ui-34/scripts/verify-static-output.mjs) | 検索対象HTMLのサイトマップ掲載漏れ、正確なcanonical一致、複数robots指定を検査 |
| [static-sitemap-checks.mjs](C:/Users/PC_User/Documents/Codex/2026-06-26/python-python-web-streamlit-ui-34/scripts/static-sitemap-checks.mjs)（新規） | noindex・404・正当なcanonical別名を除外した逆照合 |
| [static-sitemap-checks.test.mjs](C:/Users/PC_User/Documents/Codex/2026-06-26/python-python-web-streamlit-ui-34/scripts/static-sitemap-checks.test.mjs)（新規） | 掲載漏れ・HTML二重出力・別名・末尾スラッシュの回帰テスト |
| [audit-site-quality.py](C:/Users/PC_User/Documents/Codex/2026-06-26/python-python-web-streamlit-ui-34/scripts/audit-site-quality.py) | 初期HTMLリンクの到達性、孤立、robots、逆照合、指定8URL、公開HTTP転送経路の監査を追加 |
| [test_audit_site_quality.py](C:/Users/PC_User/Documents/Codex/2026-06-26/python-python-web-streamlit-ui-34/scripts/test_audit_site_quality.py) | 孤立、遮断、Googlebot別指定、ルートcanonical同値などのテスト |
| [content-quality.test.ts](C:/Users/PC_User/Documents/Codex/2026-06-26/python-python-web-streamlit-ui-34/scripts/content-quality.test.ts) | 部分図の説明とフッターの文字色の回帰テスト |
| この報告書（新規） | 調査範囲、検証結果、Search Consoleでの次の確認事項を記録 |

依存ライブラリは追加していません。

## C. サイトマップと件数

件数は記事データを利用する出力・テスト・HTML/XML監査から集計しています。サイトマップ生成に記事件数の固定値は追加していません。

| 集計対象 | 件数 |
| --- | ---: |
| 静的HTMLの重複を除いたルート | 1,421 |
| 上記のうちエラーページ | 2 |
| エラーページ以外の出力ルート（別名・noindexを含む） | 1,419 |
| 検索対象の正規ページ | 112 |
| ローカルXML sitemap / 現在の本番XML sitemap | 112 / 112 |
| 学習ガイド | 53 |
| 初心者ロードマップの教材 | 11 |
| 新規独自記事の公開・出力・サイトマップ掲載 | 30 / 30 |
| ツールカタログ | 16（トレーニング11、解析2、計算2、点数早見表1） |
| ローカルサイトマップのlastmodあり | 30 |
| 掲載漏れ・重複・出力のないURL・noindex混入 | すべて0 |

新規30記事は作成日2026-10-25、編集更新日2026-10-26、公開日2026-10-27が記録されているため、lastmodは2026-10-27です。記事データに日付履歴がないページは、推測せずlastmodを省略します。

学習ガイドは `learningGuides`、ロードマップ教材は `learnArticles`、トレーニングは既存カタログから生成しています。記事追加時にサイトマップへURLを個別転記する必要はありません。新規検索対象HTMLがサイトマップから漏れると、今回追加したビルド検査が失敗します。

今回、新たに削除・noindex化・サイトマップから除外した既存URLはありません。従来からの除外は次のとおりです。

| 出力上のnoindex群 | 件数 | 既存の理由 |
| --- | ---: | --- |
| `/mleague/**` | 1,223 | 第三者情報依存コンテンツの改善待ち。Mリーグ404も集計に含む |
| `/videos/**` | 74 | 動画紹介の品質管理方針 |
| `/analysis/starting-hand/{chanta,flush,chiitoitsu,ikkitsuukan,toitoi,pinfu,tanyao,sanshoku,riichi}` | 9 | 配牌分析の別名・プリセット。親ページへcanonicalを統一 |
| `/training` | 1 | `/trainer` へ301転送する旧URL |
| `/training/tedashi-reading` | 1 | 実牌譜利用の承認・検品待ち |
| `/404` | 1 | エラー応答用 |

合計1,309には2つのエラーページを含みます。これは「今回大量にnoindexにした」という意味ではなく、既存の静的出力全体を集計した数です。Search Consoleの8件とは母集団が異なり、直接比較できません。

## D. 技術SEO

### 指定8URL

すべて本番でスラッシュあり・なしの両方を取得し、200、意図しない転送なし、自己canonical、index/follow、X-Robots-Tagによる除外なし、robotsによる遮断なし、サイトマップ掲載、JavaScript実行前の本文ありを確認しました。

| パス | 初期HTMLの本文文字数（本番） | トップからのHTMLリンク数 | 被リンク元ページ数 |
| --- | ---: | ---: | ---: |
| `/analysis/starting-hand/help` | 12,814 | 2 | 10 |
| `/learn/basic-nanikiru` | 1,354 | 2 | 12 |
| `/learn/draw-and-discard` | 1,341 | 2 | 12 |
| `/learn/guides/good-shape-rate` | 1,770 | 2 | 14 |
| `/learn/guides/one-shanten-ukeire` | 1,027 | 2 | 4 |
| `/learn/guides/rule-differences-and-calling` | 5,091 | 2 | 3 |
| `/learn/guides/wait-types` | 1,002 | 2 | 9 |
| `/learn/roadmap` | 1,532 | 1 | 195 |

文字数はmain内から共通ヘッダー・ナビ・スクリプトを除いた検査用指標であり、品質の合否基準ではありません。一向聴記事の修正後ローカル本文は1,070文字です。被リンク元は静的HTMLのリンクグラフで集計し、同一ページ内の重複リンクは1件としています。

### 全出力と公開URLの整合

- 検索対象112ページ：サイトマップ漏れ、孤立、トップから到達不能、robots遮断、canonical矛盾はいずれも0。
- 指定8URLは1〜2リンクで到達可能。全検索対象の最大深度は5で、一部の役解説が4〜5リンク先にあります。到達不能ではなく、現時点でクロール障害とは判断しません。
- title・description・canonical欠落、重複title、壊れた内部リンク・アンカー、構文不正のJSON-LDはいずれも検出されませんでした。
- canonical相違候補10件は配牌プリセット9件と旧 `/training`。意図した別名なので変更していません。
- 本番の `/training` → `/trainer` は301の1段。`.html`別名やMリーグ配下の末尾スラッシュ正規化も1段で、ループはありません。
- `robots.txt` は `User-Agent: * / Allow: /` と正しいsitemapを出力。Googlebot全体の遮断なし。
- 学習記事一覧はクライアント検索に対応しつつ、初期HTMLに全53記事の通常のリンクを出力しています。JavaScriptでカテゴリを開くまで記事URLが現れない構成ではありません。
- `/index.txt` はNext.jsの内部ルータ用テキストデータとして取得できますが、サイトマップや本文リンクには含まれません。HTML記事とは別に集計しています。
- `wait-types` は5種類の待ちの入口、`wait-shape-basics` は両面・カンチャン・ペンチャンの比較、初心者教材は学習順の導入という役割を確認しました。似た用語があるだけで重複ページとは判断せず、統合やcanonical変更はしていません。

## E. テストと操作確認

- `pnpm typecheck`：成功。
- Vitest全体：70ファイル・980件成功。
- 通常モードのサイトマップ・中央SEOポリシーテスト：27件成功。審査モード解除だけで改善待ちページがindexへ戻らないことを維持。
- Nodeの静的サイトマップ・セキュリティ・Mリーグ更新テスト：14件成功。
- Pythonの監査回帰テスト：25件成功。
- `CF_PAGES=1 ADSENSE_REVIEW_MODE=true PRACTICAL_GUIDES_PREVIEW=false pnpm build`：成功。Web・Mリーグの統合、静的出力、最終検査まで完了。
- Next.jsビルド内のLint・型検査を実行。独立したESLintスクリプトは既存構成にありません。
- XMLはPython標準XMLパーサーで解析。新規30記事の静的出力検査：30記事、77局面、91牌姿、エラー0。
- 内部参照検査：1,616参照を確認。公開HTTP155取得の結果は200が153件、想定どおりの404が2件。404は存在しない監査URLと `/learn/guides/index.txt` で、本文リンク・サイトマップには不掲載。
- 表示：375 / 768 / 1440pxで主要7ページを確認し、指定8ページも375pxで確認。29表示サンプルでページ全体の横はみ出し・main内の画像読み込み失敗なし。
- 記事検索、追加した学習入口リンク、スマホメニューとEscape閉鎖、トレーニング回答→正誤→次問を実操作で確認。
- 牌理チェッカー：同じ14枚で16種54枚、良形率56%、超良形率33%を確認。
- 点数計算：2翻30符の子ロン2,000点から、ツモ切替で3翻20符・700/1,300点になることを確認。
- オーラス：2本場・供託1本、東家から1,000点ロンの実例で、東家30,400点・自分31,100点を確認。
- 回答操作は別ポートの検証用保存領域で実施し、通常プレビューの学習記録を変更しないようにしました。
- フッターの最終色は3画面幅でDOMから確認。白背景に見出し `rgb(22,43,67)`、補助文字 `rgb(71,85,105)` を適用し、ページ全体の横はみ出しなし。

## F. Search Consoleで人間が行うこと

この項目の操作は実施していません。

1. 変更の公開を別途判断した後、`https://jongfolio.com/sitemap.xml` の最終読込日が今回の公開日以降になっているか確認する。現在の本番XMLにはすでに新規30記事が含まれます。10月24日の「81件」と現在の112件だけを比べて障害とは判断しません。
2. URL検査の候補は、`/learn/roadmap`、`/learn/guides`、`/learn/guides/one-shanten-ukeire`、`/analysis/starting-hand/help`、新規記事の代表 `/learn/guides/ukeire-versus-practical-decisions`。必要に応じて残りの指定URLも確認する。
3. 「公開URLをテスト」で取得可否・レンダリングを確認し、インデックス済みデータの最終クロール日時、Googleが選択したcanonicalも確認する。公開URLテストの成功だけで登録済みとは判断しない。
4. 重要な少数URLについて、まだ未登録で、取得テストに問題がなければ登録リクエストを検討する。全URLの連続再送はしない。残りの新規記事はサイトマップと内部リンクからの発見・クロールの推移を見る。
5. 「noindex 8件」「代替13件」「転送4件」は対象URLの実リストを確認する。意図した除外・正規化なら変更しない。残り19件の検出済みURLと、クロール済み未登録1件もCSVで取得すると次の調査ができる。

Google公式では、検出済み未登録は発見済み・未クロールの状態であり、必ずしもサイト不具合を意味しません。[インデックス登録レポート](https://support.google.com/webmasters/answer/7440203?hl=ja)

lastmodは正確な更新履歴に基づく場合に用い、サイトマップは登録保証ではありません。[サイトマップの作成](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap?hl=ja)

少数URLはURL検査、多数はサイトマップを利用し、同じURLの反復リクエストでクロールが早まるわけではありません。[再クロールの依頼](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl?hl=ja)

## G. 未解決・未確認事項

- 27件のうち残り19URLは未提示のため、Search Console上の対象を個別には特定できません。コード・全静的出力に共通する検査は完了しています。
- Googleが実際に最後に取得したHTML、Google選択canonical、Googlebotの実アクセスログ、Search Consoleの現時点の集計、AdSenseの判断は管理画面等での確認が必要です。User-Agentを変えたHTTP取得は、実際のGooglebotによるクロールの証明ではありません。
- 指定8URLの未登録理由は、今回のHTTP・HTML検査だけでは断定できません。クロール待ち、Google側の選択や品質評価の可能性を含めて、URL検査と経過で判断してください。
- 今回のlastmod・学習入口リンク・説明・文字色の修正はローカルのみです。未デプロイであることと、すでに本番にある30記事を混同しないでください。
- 各記事の全文章に対する外部資料との独立した再査読や、全トレーニングの全問題を人間同様に手操作する試験までは実施していません。既存の計算・教材検証テストと代表操作で確認しています。
- 記事本文のスマホ画像とタブレット画像は撮影済みです。最後のフッター修正後のスクリーンショット再撮影はブラウザ撮影APIのタイムアウトで取得できませんでした。DOM上の文字列・適用色・画面幅の確認とビルドは成功しており、サイトのHTTP障害とは区別しています。

### 検査データとプレビュー

- [全静的ルート・リンク・発見経路](C:/Users/PC_User/Documents/Codex/2026-06-26/python-python-web-streamlit-ui-34/output/site-quality-inventory.json)
- [本番HTTP・転送経路の取得記録](C:/Users/PC_User/Documents/Codex/2026-06-26/python-python-web-streamlit-ui-34/output/site-quality-live.json)
- [新規記事の牌姿・計算検証範囲](C:/Users/PC_User/Documents/Codex/2026-06-26/python-python-web-streamlit-ui-34/output/stage3-article-verification.json)
- [表示幅の検査値](C:/Users/PC_User/Documents/Codex/2026-06-26/python-python-web-streamlit-ui-34/output/search-index-responsive.json)
- [フッターの最終適用色と表示幅](C:/Users/PC_User/Documents/Codex/2026-06-26/python-python-web-streamlit-ui-34/output/search-index-footer.json)
- [修正した部分図のスマホ表示](C:/Users/PC_User/Documents/Codex/2026-06-26/python-python-web-streamlit-ui-34/output/search-index-mobile.jpg)
- [本番相当ビルドのログ](C:/Users/PC_User/Documents/Codex/2026-06-26/python-python-web-streamlit-ui-34/output/search-index-build-2026-10-27.log)
- [ローカルの学習記事一覧](http://127.0.0.1:4173/learn/guides/)

検査を再実行する場合は、先に通常公開対象の `pnpm build` を完了し、その後 `scripts/audit-site-quality.py --live` を実行してください。ビルド中の出力ディレクトリは検査しないでください。

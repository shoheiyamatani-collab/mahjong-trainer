# 品質改善の追加確認（2026-10-29）

## 今回の対応

最新リモートは `37538dcf`。前回以降のMリーグ更新3コミットをfast-forwardで取り込み、前回の未コミット修正はすべて維持した。

今回新たに変更したのは、既存の頻出役ページと回帰テスト、およびこの報告書。push・デプロイ・Search Console操作・AdSense再申請はしていない。

### 根拠を確認できない役の出現率を修正

対象：`/rules/frequent-yaku`

- 「約40%台」「約20%」「約7〜10%」など、集計元・ルール・母集団が明記されていない6件の数値を除去。
- 全11役の「頻出度の目安」を、牌の構成や成立条件を見るための「覚えるときの目印」へ変更。
- 「上位5役」を「まず覚える5役」へ変更し、掲載順は学習上の順番で、統計上の順位ではないと明記。
- リーチは門前テンパイ以外にも宣言条件があること、平和は門前で成立することを要約にも明記。
- 既存の牌姿、翻数、詳細記事・クイズへのリンク、レイアウト、title/description/canonical、index方針は維持。計算・判定エンジンは変更していない。
- 根拠不明の数値や順位表現が戻らないよう回帰テストを追加。

変更ファイル：

- [頻出役ページ](C:/Users/PC_User/Documents/Codex/2026-06-26/python-python-web-streamlit-ui-34/apps/web/app/rules/frequent-yaku/page.tsx)
- [品質回帰テスト](C:/Users/PC_User/Documents/Codex/2026-06-26/python-python-web-streamlit-ui-34/scripts/content-quality.test.ts)

## 公開サイトの再確認

- 生の公開HTMLでは学習記事一覧に53記事、公開XMLサイトマップに112URL。検索取得ツールの古い23記事表示を、本番の現状とは扱わなかった。
- 前回指定の8URLを再取得し、すべて200、自己canonical、noindexなし、サイトマップ掲載、初期HTMLに本文ありを確認。
- この再確認だけで、実際のGoogleによるインデックス登録や、AdSense承認状況は判断できない。

### Cloudflareの取得制限について

`sitemap.xml` をPythonの標準User-Agentで取得すると403・エラー1010だった。一方、アプリ名を明示した `JongfolioQualityAudit/1.0` と、文字列として `Googlebot` を指定した取得は200で112URLを返した。

Pagesのカスタムドメインでも、標準PythonクライアントなどをBrowser Integrity Checkが拒否する場合があることは[Cloudflare公式](https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-1xxx-errors/error-1010/)に記載されている。今回の結果はその説明と一致するが、User-Agent変更は実際のGooglebotのアクセス確認ではない。セキュリティ設定の解除は行っていない。Googleによる取得可否は、Search Consoleの公開URLテストで別途確認する。

## 検証結果

- TypeScript：成功。
- Vitest全体：70ファイル、981件成功。最終文言修正後の対象テストも19件成功。
- Node回帰テスト：14件成功。Python監査テスト：25件成功。
- 本番ビルド・Cloudflare Pages向けStatic Export・Mリーグ出力統合：成功。
- 静的出力検査：サイトマップ112URL、内部参照1,616件を確認。
- 新規30記事の静的出力検査：30記事、77局面、91牌姿、エラー0。
- 375 / 768 / 1440pxで11役すべての学習目印が表示されること、出現率数値が残っていないこと、ページ全体の横はみ出し・main内画像の読み込み失敗がないことを確認。

この変更では牌姿や点数を変えていない。全11役の牌姿を新たに個別で計算し直した、あるいはサイトの全文章を再査読したという報告ではない。

## 次の優先順位

1. 前回のサイトマップ・孤立リンク・フッター修正と今回の改善を、ローカルで確認する。公開は別途承認後に行う。
2. Search Consoleの最新一覧で、未提示の残り19URL・Google選択canonical・最終クロール日時を確認する。登録待ちと実際の不具合を分ける。
3. 今回のように、既存記事の根拠不明の数値や、成立条件が省略されて誤解を招く説明を優先して検品する。確認できない動画の局面や数値は推測で補足しない。

現時点で、新たな大量noindex、URL変更、本文の一律長文化は提案しない。インデックス登録やAdSense合格を保証するものでもない。

[ローカルで今回の変更を見る](http://127.0.0.1:4173/rules/frequent-yaku/)

![修正後の学習目印](C:/Users/PC_User/Documents/Codex/2026-06-26/python-python-web-streamlit-ui-34/output/yaku-quality-2026-10-29-mobile.jpg)

# Noindex backlog

未完成ページを誤って検索対象へ戻さないための管理メモです。

## 現在の対象

| URL | 理由 | 検索へ戻す条件 |
| --- | --- | --- |
| `/videos/mleague-clips` | 紹介動画と記事が未選定 | 公開する動画、独自解説、記事リンクを用意する |
| `/mleague/events` | 公開できるイベントデータが0件 | 公式発表を確認したイベントを掲載する |
| `/mleague/correction-request` | フォームの送信機能が未実装 | 送信先、保存方針、完了・失敗表示を実装する |

すべて `robots: { index: false, follow: true }` を設定しています。Mリーグ側の2ページは `apps/mleague/app/sitemap.ts` からも除外しています。動画ページは機能フラグが無効のため、もともとサイトマップには含まれていません。

## 検索へ戻す手順

1. 上表の公開条件を満たす。
2. 対象ページの `metadata.robots` を削除する。
3. Mリーグページは `apps/mleague/app/sitemap.ts` の `staticPaths` へ戻す。
4. WebとMリーグをビルドし、生成HTMLから `noindex` が消えたことを確認する。
5. 公開後、Search ConsoleでURL検査とサイトマップ送信を行う。

## Noindexにしない準備中表示

なし。`/learn/meld-and-pair`、`/learn/winning-shape`、`/learn/tenpai-and-wait` にあった「待ち判定ツール」の準備中表示は、既存の麻雀トレーニングへのリンクに変更しました。

## 完成して検索へ戻したページ

| URL | 対応日 | 対応内容 |
| --- | --- | --- |
| `/mleague/policy` | 2026-09-25 | 正式な問い合わせ窓口、運営者情報、共通プライバシーポリシーへの導線を掲載 |

# Cloudflareで公開するときのチェックリスト

このファイルは、麻雀トレーナーをCloudflare Pagesで公開すると決めた日に最初に読むメモです。

詳しい説明やトラブル時の戻し方は、同じフォルダの`CLOUDFLARE_DEPLOY.md`を確認してください。

## 公開前に決めること

- 使用する独自ドメイン
- `www`あり・なしのどちらを正規URLにするか
- Cloudflareへ接続するGitHubリポジトリと本番ブランチ（通常は`main`）

仮のドメインをコードへ書かず、独自ドメインが決まってから設定します。

## ブランド・公開時の保留メモ

画面上のブランドは次の内容で進めます。

```text
ブランド名: 雀フォリオ
英字: JONGFOLIO
キャッチコピー: 麻雀を知る、学ぶ、強くなる。
正規URL: https://jongfolio.com
```

正式ドメインは取得済みです。wwwありのURLは正規URLへ301転送します。

```text
正式ドメイン: jongfolio.com
SEO用の正式サイトタイトル候補: 雀フォリオ｜麻雀初心者のための学習・練習サイト
```

`SITE_URL`、metadata、OGP、sitemap、robots.txt、Search Consoleは`https://jongfolio.com`へそろえます。正式SEOタイトルは公開後のSearch Console登録前に最終確認します。

## 1. 公開前の最終確認

リポジトリルートで次を実行します。

```powershell
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test
$env:CF_PAGES = "1"
pnpm build
Remove-Item Env:CF_PAGES
```

すべて成功し、`apps/web/out`が生成されることを確認します。

## 2. Cloudflare Pagesを作る

1. Cloudflareへログインする
2. `Workers & Pages`を開く
3. `Create application`から`Pages`を選ぶ
4. `Import an existing Git repository`を選ぶ
5. GitHubの対象リポジトリを接続する
6. Production branchを`main`にする

Cloudflareの設定値は次のとおりです。

```text
Framework preset: Next.js (Static HTML Export)
Root directory: 空欄（リポジトリルート）
Build command: pnpm build
Build output directory: apps/web/out
NODE_VERSION: 22.16.0
PNPM_VERSION: 11.7.0
```

`CF_PAGES=1`はCloudflareが自動で設定するため、手動登録は不要です。

## 3. pages.devで先に確認する

独自ドメインを切り替える前に、Cloudflareが発行した`*.pages.dev`で確認します。

- `/`から麻雀解析ツールへ移動できる
- 麻雀トレーニング、麻雀解析ツール、ルール、動画記事が開く
- 牌画像とYouTube動画が表示される
- 配牌分析、点数計算、受け入れ計算が動く
- スマートフォンで横にはみ出さない
- `/robots.txt`、`/sitemap.xml`、`/ads.txt`が開く
- ページを直接開いて再読み込みしても404にならない

この確認が終わるまで、Vercelプロジェクトは削除しません。

## 4. 独自ドメインをつなぐ

1. Pagesプロジェクトの`Custom domains`を開く
2. 独自ドメインを追加する
3. Cloudflare画面の案内に従ってDNSを設定する
4. Cloudflareの環境変数へ正規URLを設定する

```text
SITE_URL=https://jongfolio.com
```

5. 再デプロイする
6. `www`あり・なしの片方を正規URLへ301転送する
7. HTTPSと証明書エラーがないことを確認する

## 5. 独自ドメインで最終確認する

- 主要ページとツールが正常に動く
- `robots.txt`内のsitemap URLが独自ドメインになっている
- `sitemap.xml`内のURLが独自ドメインになっている
- 古いURLやブックマークからの導線が切れていない
- PCとスマートフォンで表示を確認する
- Search Console、AdSense、アクセス解析はID取得後に設定する

問題がなければ数日間様子を見てから、Vercelの自動デプロイ停止を検討します。Vercelの削除は急がなくて構いません。

## 問題が起きたとき

- CloudflareのDeploymentsから直前の正常なデプロイへRollbackする
- 独自ドメインで重大な問題がある場合は、DNSを従来のVercel構成へ戻す
- Vercelを残しておけば、Cloudflareの問題を直してから再度切り替えられる

## 公開時にCodexへ伝える言葉

次のように依頼すれば、この資料を読み直して公開前確認から再開できます。

```text
麻雀トレーナーをCloudflareで公開したい。
CLOUDFLARE_PUBLISH_CHECKLIST.mdとCLOUDFLARE_DEPLOY.mdを確認して、
既存Vercelを残したまま公開前チェックから進めて。
```

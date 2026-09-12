# 麻雀トレーナーをCloudflare Pagesへ移行する手順

> 公開すると決めた日に最初から順番に進める場合は、先に`CLOUDFLARE_PUBLISH_CHECKLIST.md`を開いてください。この文書は詳しい設定理由やトラブル対応を確認するための資料です。

## 1. 採用構成

このプロジェクトは、Cloudflare Pages向けのNext.js Static Exportを採用します。

```text
GitHub
  ↓ mainブランチへのpush
Cloudflare Pages（ビルドと静的ファイル配信）
  ↓
独自ドメイン
```

API、データベース、認証、SSR、ISRは使用しません。麻雀の計算とトレーニングはブラウザ内JavaScriptで動きます。Mリーグ情報だけは、別リポジトリで管理するサイトを同一ドメインの`/mleague`配下へつなぐため、限定的なPages Functionを使用します。D1、KV、R2、Durable Objects、Cloudflare Imagesは不要です。

Cloudflare Pagesはビルド時に`CF_PAGES=1`を自動設定します。`apps/web/next.config.mjs`は、この値がある場合だけ`output: "export"`を有効にします。通常のVercelビルドでは従来の構成とトップページのリダイレクトを維持します。

## 2. この構成を選んだ理由

- 全ページをビルド時にHTMLへ生成できる
- API Routes、Server Actions、サーバーCookie、外部DBがない
- 牌理、シャンテン、受け入れ、点数計算などはブラウザ内で完結する
- Workersの実行回数やデータベース料金が発生しない
- 現在のURL、UI、牌画像、麻雀ロジックを変更しなくてよい
- Vercelを残したまま`*.pages.dev`で並行確認できる

## 3. Cloudflareアカウント作成後の手順

1. Cloudflareへログインします。
2. `Workers & Pages`を開きます。
3. `Create application`から`Pages`を選びます。
4. `Import an existing Git repository`を選び、現在のGitHubリポジトリを接続します。
5. Production branchを`main`にします。
6. 下記のビルド設定と環境変数を入力します。
7. `Save and Deploy`を押し、最初は`*.pages.dev`で確認します。

## 4. GitHubとの接続方法

CloudflareのGitHub連携画面で、対象リポジトリだけを許可してください。接続後は`main`へのpushが本番デプロイ、その他のブランチやPull Requestがプレビューデプロイになります。

このリポジトリはpnpmワークスペースです。`apps/web`だけをRoot directoryにすると、`packages/mahjong-core`を参照できなくなります。Root directoryはリポジトリルートのままにしてください。

## 5. Build Command

```text
pnpm build
```

Cloudflareが依存関係を自動インストールします。手動設定が必要な場合のInstall commandは次のとおりです。

```text
pnpm install --frozen-lockfile
```

## 6. Build Output Directory

```text
apps/web/out
```

## 7. Node.jsとpnpmのバージョン

Cloudflare Pagesの環境変数へ次を設定してください。

```text
NODE_VERSION=22.16.0
PNPM_VERSION=11.7.0
```

`package.json`のpackage manager指定に合わせ、pnpmを別のpackage managerへ変更しません。

## 8. Environment Variables

### ビルド時だけ必要

`SITE_URL`には正式URLを設定します。未設定時もコード上の既定値`https://jongfolio.com`をrobots.txtとsitemap.xmlへ使用します。

```text
SITE_URL=https://jongfolio.com
```

### ブラウザへ公開してよい任意設定

Mリーグ外部サイトのURLを変更する場合だけ設定します。

```text
NEXT_PUBLIC_MLEAGUE_DIRECTORY_URL=https://リンク先URL
```

この値はブラウザへ公開されます。秘密情報を設定してはいけません。

### Cloudflareが自動設定

`CF_PAGES=1`はCloudflareが自動設定します。手動登録は不要です。

### 設定不要

Vercel用の`VERCEL_OIDC_TOKEN`をCloudflareへ移す必要はありません。`.env.local`や秘密鍵はGitへコミットしないでください。

## 9. Cloudflare上で必要な設定

- Framework preset: `Next.js (Static HTML Export)`
- Production branch: `main`
- Root directory: 空欄（リポジトリルート）
- Build command: `pnpm build`
- Build output directory: `apps/web/out`
- Node.js: `22.16.0`
- pnpm: `11.7.0`
- Pages Functions: `/mleague`と専用アセットの中継にのみ使用
- D1、KV、R2、Durable Objects: 作成しない

## 10. 初回デプロイと確認

最初のデプロイ後、発行された`https://プロジェクト名.pages.dev`で次を確認してください。

- `/`が`/analysis/mahjong-tool`へ移動する
- `/training`が`/trainer`へ移動する
- 主要ページを直接開き、更新しても404にならない
- 牌画像、ツール画像、YouTube埋め込みが表示される
- `/robots.txt`、`/sitemap.xml`、`/ads.txt`がHTTP 200になる
- スマートフォンとPCで表示が崩れない

ローカルでCloudflare向け出力を作る場合はPowerShellで次を実行します。

```powershell
$env:CF_PAGES = "1"
pnpm build
Remove-Item Env:CF_PAGES
```

生成物は`apps/web/out`です。

## 11. 独自ドメイン設定

Pagesプロジェクトの`Custom domains`で`jongfolio.com`を追加します。ドメインはCloudflare DNSで管理されているため、必要なDNSレコードは画面の案内に従って追加します。

正規URLは`https://jongfolio.com`です。`www.jongfolio.com`はパスとクエリ文字列を保ったまま正規URLへ301転送します。

## 12. HTTPS確認

Custom domainsでステータスがActiveになった後、次を確認します。

1. `https://独自ドメイン/`が開く
2. ブラウザに証明書エラーが出ない
3. HTTPで開いた場合にHTTPSへ移動する
4. 主要ページと静的ファイルがHTTPSで配信される

CAAレコードを設定している場合は、Cloudflareが証明書を発行できる設定かも確認してください。

## 13. wwwあり・なしの統一

正規URLを`https://example.com`または`https://www.example.com`のどちらかに決めます。CloudflareのBulk Redirectsで、もう一方から正規URLへ`301`転送します。

`Preserve query string`、`Subpath matching`、`Preserve path suffix`を有効にし、記事URLやクエリ文字列を維持してください。正規URLを決めた後、Cloudflareの`SITE_URL`も同じURLに更新して再デプロイします。

## 14. Vercelからドメインを切り替える手順

1. Vercelプロジェクトと`vercel.app` URLを残したままにします。
2. `*.pages.dev`で全機能を確認します。
3. Cloudflare Pagesへ独自ドメインを追加します。
4. DNSをCloudflare Pagesへ向けます。
5. `SITE_URL`へ独自ドメインを設定し、再デプロイします。
6. 独自ドメインでSEOファイル、主要ページ、ツールを再確認します。
7. 数日間エラーとアクセス状況を監視します。
8. 問題がないことを確認してから、Vercelの自動デプロイ停止を検討します。

Vercelプロジェクトや`vercel.app` URLは、Cloudflareでの確認前に削除しないでください。

## 15. ロールバック方法

### Cloudflare内で戻す

PagesプロジェクトのDeploymentsから、正常だった以前のデプロイを選んでRollbackします。

### Vercelへ戻す

Cloudflare側で重大な問題が出た場合は、独自ドメインのDNSまたは接続先を従来のVercel構成へ戻します。Vercelプロジェクトを残しておくことで、切り戻し時間を短くできます。

ロールバック後はDNS伝播、HTTPS、主要URL、robots.txt、sitemap.xmlを再確認してください。

## 16. AdSense・アフィリエイト対応

- `apps/web/public/ads.txt`は200で配信できる場所を用意しています。AdSense承認後、Googleが指定する正式な1行へ置き換えます。
- Google Search Console確認タグ、AdSense script、Google Analytics、Google Tag Managerは、各サービスのIDが確定してから`apps/web/app/layout.tsx`へ追加します。
- 今回は広告scriptやアフィリエイトタグを追加していません。
- 静的HTMLなので、Amazon・楽天の通常のアフィリエイトリンクを記事へ追加できます。

## 17. 月額料金の見込み

Pages Functionsや有料ストレージを使わない静的サイトのため、通常はCloudflare Pages無料枠内で運用できる見込みです。無料枠では月500ビルド、1サイト20,000ファイル、1ファイル25MiBまでが目安です。

費用が発生し得るのは、将来Workers Functions、R2、Cloudflare Imagesなどの有料機能を追加した場合、または独自ドメインの取得・更新費用です。

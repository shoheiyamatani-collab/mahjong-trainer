# セキュリティ運用

## 連絡先

脆弱性の疑いは `contact@jongfolio.com` へ非公開で連絡してください。
公開Issueへ認証情報、個人情報、再現用の攻撃コードを掲載しないでください。
再現したURL、影響、利用ブラウザなど、確認に必要な情報だけを記載してください。

## 配信構成と確認範囲

- 公開先はCloudflare Pagesの静的出力です。Next.jsの実行サーバー、Server Actions、DB、利用者のログインは使用しません。
- 開発サーバーは `127.0.0.1` に限定します。Vitest UI/APIや開発サーバーをインターネット・LANへ公開しないでください。
- 静的配信でも、ビルド環境、開発PC、依存パッケージ、外部スクリプト、管理アカウントのリスクは残ります。
- `NEXT_PUBLIC_*` の値は公開されます。秘密情報を設定せず、`.env`・認証ファイルをコミットしないでください。

## 依存更新と継続チェック

```text
pnpm install --frozen-lockfile
pnpm security:audit
pnpm test:security
pnpm exec vitest run
pnpm typecheck
```

Cloudflareと同じ `CF_PAGES=1` と実際の `ADSENSE_REVIEW_MODE` を設定して `pnpm build` も実行します。
監査は本番・開発の両依存を対象にします。検出件数と、実際の利用条件・到達可能性は分けて評価してください。
監査サービスへの接続失敗を「問題なし」として扱わないでください。

GitHubへ反映後、Security checksはpush・PR・週次・手動で実行されます。
Dependabotは依存とGitHub Actionsの更新PRを週次で作成します。自動マージ・自動デプロイはしません。
失敗通知を受け取れるよう、リポジトリのActions通知を確認してください。
GitHubのDependency graph・Dependabot alerts/security updatesの有効化は管理画面でも確認が必要です。

Next.jsは15系の修正版を使用します。Nextが固定する古いPostCSSとSharpは
`pnpm-workspace.yaml` の `overrides` で修正版に揃えています。Tailwindの固定するsource-map-jsも更新しています。
上流で不要になった際は、監査・画像処理・静的ビルドの確認後にoverrideを外してください。
Vitestは修正版4系と互換性のあるVite 6.4系を使用し、Next・バンドラのメジャー更新とは分離しています。

## 防御ヘッダー

中央定義は `scripts/security-headers.mjs` です。
既存prebuildが `apps/web/public/_headers` を生成し、Cloudflare Pagesが全静的ルートに適用します。
生成ファイルだけを編集すると次のビルドで上書きされます。
SEOのindex/noindex、robots、canonicalには関与しません。

- 有効化: MIME誤認防止、同一オリジン以外からのフレーム表示禁止、外部base URL・外部フォーム送信・プラグインの制限。
- 権限制限: カメラ、マイク、位置情報。動画の再生・全画面、コピー操作は制限しません。
- HSTS: `https://jongfolio.com` のみ180日。サブドメインやpreloadには拡張しません。
- リソースCSP: **Report-Onlyの検証段階**です。スクリプトの読み込みを包括的に遮断する完成版ではありません。
- Next静的出力のインラインスクリプトを許容しています。違反の自動収集先はなく、外部へのレポート送信もありません。

Report-Onlyの警告をブラウザで確認し、AdSense・YouTube・書籍画像・Workerの動作を確認してから
スクリプト等の制限を強制へ段階移行してください。`unsafe-inline` を削除する際は、静的HTMLのハッシュ管理等が必要です。
広告配信開始後は、新たな配信先が増える場合も含めて再確認します。

## 公開前後のチェック

1. 型チェック・全テスト・静的ビルド・監査を通す。
2. Cloudflare相当のローカル配信で `_headers` の適用を確認する。単純なHTTPサーバーは適用しません。
3. 牌理チェッカー、点数計算、オーラス条件、トレーニング、配牌分析Worker、動画、Mリーグを操作する。
4. 許可されたデプロイ後、HTTPSのレスポンスヘッダーと上記機能を公開環境で再確認する。
5. Cloudflare・GitHub・Googleの二段階認証またはパスキー、回復手段、連携トークンの最小権限を管理者が確認する。

この文書や自動監査は、侵入テストや安全性の保証の代わりにはなりません。

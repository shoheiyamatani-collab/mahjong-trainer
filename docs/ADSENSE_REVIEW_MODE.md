# AdSense Review Mode

JONGFOLIOの検索対象は `packages/content-index-policy/src/contentIndexPolicy.ts` で中央管理します。

## 審査中の切り替え

Cloudflare PagesのProduction環境変数に次を設定して再デプロイします。

```text
ADSENSE_REVIEW_MODE=true
```

未設定または `false` の場合、ヘッダーとトップページは通常表示へ戻ります。`needs-improvement` は審査モードを解除してもINDEXへ自動復帰しません。

審査モードでは、中央設定 `packages/content-index-policy/src/publicationPolicy.json` にある `/videos/**` と `/mleague/**` を**公開用Static Exportから一時除外**します。ユーザーが直接開いても公開サイトでは404になり、ナビゲーション・フッター・サイトマップからも外れます。記事、選手、チームのソースコードとデータは削除しません。

復帰するときはCloudflare Pagesの `ADSENSE_REVIEW_MODE` を `false` または未設定にして再ビルド・デプロイします。URLは元のまま再生成されますが、`contentIndexPolicy.ts` の `needs-improvement` が残るため検索結果には自動復帰しません。品質を確認したURLだけ `ready` に変更してください。審査モードのON/OFFは公開状態を切り替える操作なので、設定変更後は必ずビルド出力を確認してからデプロイします。

この一時非公開は、AdSense承認や過去の検索URL削除を保証するものではありません。既に検索登録されたURLは、Googleが再クロールするまで結果に残る可能性があります。Googlebotをrobots.txtで遮断せず、404応答を確認できる状態にします。

## 改善済みページをINDEXへ戻す

中央設定の広い `needs-improvement` ルールは残したまま、対象URLの完全一致ルールを追加します。完全一致ルールが優先されます。

```ts
{
  path: "/videos/strategy/example-article",
  match: "exact",
  status: "ready",
  reason: "独自牌姿・比較・確認問題・牌理チェッカー導線を追加済み"
}
```

`ready` に変更したURLはrobotsのINDEX、sitemap掲載、内部導線強化、広告掲載可否の対象へ戻せます。広告ユニットを実装するときは `canShowAdsOnPath(path)` が `true` のページだけで表示してください。

## 所有権確認と広告配信の分離（2026-10-24）

両アプリの共通レイアウトは `google-adsense-account` メタタグを維持し、`ads.txt` も維持します。一方、広告配信用 `adsbygoogle.js` を全ページから無条件に読み込む実装は停止しました。現時点では広告ユニットを配信しません。審査モード解除だけで配信用スクリプトが復活することもありません。

メタタグはGoogleが提供する正式なサイト確認方法です。既存のAdSense画面が広告コード方式で登録されている場合は、管理画面でメタタグまたはads.txtによる所有権確認が認識されるかを、再申請前に確認してください。コード上の変更だけで管理画面の状態が変わったとはみなしません。

- https://support.google.com/adsense/answer/12169212?hl=ja
- https://support.google.com/adsense/answer/7584263?hl=ja

承認後に配信を導入する場合も、ルートごとの `canShowAdsOnPath`、クライアント遷移後の状態、同意取得の要否、自動広告の対象ページを確認してください。共通レイアウトへの無条件なスクリプト再追加は避けます。静的出力チェックは所有権メタタグ・ads.txtと、配信停止中のスクリプト不在を確認します。

`noindex` はGoogle検索の掲載方針です。AdSense審査対象からの除外、コンテンツの権利確認、承認の保証にはなりません。直接閲覧できる改善待ちページも、内容・出典・権利を確認する必要があります。

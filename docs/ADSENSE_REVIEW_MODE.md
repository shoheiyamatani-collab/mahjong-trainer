# AdSense Review Mode

JONGFOLIOの検索対象は `packages/content-index-policy/src/contentIndexPolicy.ts` で中央管理します。

## 審査中の切り替え

Cloudflare PagesのProduction環境変数に次を設定して再デプロイします。

```text
ADSENSE_REVIEW_MODE=true
```

未設定または `false` の場合、ヘッダーとトップページは通常表示へ戻ります。`needs-improvement` は審査モードを解除してもINDEXへ自動復帰しません。

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

`ready` に変更したURLはrobotsのINDEX、sitemap掲載、内部導線強化、広告掲載可否の対象へ戻せます。広告ユニットを実装するときは `canShowAdsOnPath(path)` が `true` のページだけで表示してください。AdSenseサイト確認用スクリプトは全ページで維持します。

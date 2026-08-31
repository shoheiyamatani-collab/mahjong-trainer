type DisclosureNoticeProps = {
  className?: string;
};

export function AffiliateDisclosure({ className = "" }: DisclosureNoticeProps) {
  return (
    <aside className={`disclosureNotice disclosureNotice--affiliate ${className}`.trim()} aria-label="アフィリエイト広告について">
      <strong>広告について</strong>
      <p>本ページにはアフィリエイト広告が含まれています。リンクを経由して商品を購入された場合、当サイトが紹介料を受け取ることがあります。</p>
    </aside>
  );
}

export function PrDisclosure({ className = "" }: DisclosureNoticeProps) {
  return (
    <aside className={`disclosureNotice disclosureNotice--pr ${className}`.trim()} aria-label="PR・広告について">
      <strong>PR・広告</strong>
      <p>本ページは、企業等から報酬または商品の提供を受けて制作したプロモーションを含みます。</p>
    </aside>
  );
}

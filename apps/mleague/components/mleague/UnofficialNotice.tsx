export function UnofficialNotice() {
  return (
    <aside className="notice" aria-label="非公式サイトのご案内">
      <span className="notice-mark" aria-hidden="true">
        i
      </span>
      <div>
        <strong>このサイトは非公式です</strong>
        <p>
          Mリーグ機構、各チーム、所属団体、選手本人による運営・公認サイトではありません。
        </p>
      </div>
    </aside>
  );
}

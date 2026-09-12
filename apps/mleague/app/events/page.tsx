import type { Metadata } from "next";
import { EventPreview } from "@/components/mleague/EventPreview";
import { UnofficialNotice } from "@/components/mleague/UnofficialNotice";
import { playerEvents } from "@/data/mleague/events";

export const metadata: Metadata = {
  title: "選手イベント情報（準備中）｜Mリーグ選手名鑑",
  description:
    "麻雀店ゲスト、公開対局、トークイベント、大会など、公式発表を確認した情報の掲載準備ページです。",
};

export default function EventsPage() {
  return (
    <main id="main-content" className="page-shell">
      <header className="page-header">
        <span className="eyebrow">EVENTS</span>
        <h1 className="page-title">選手に会えるイベント情報</h1>
        <p className="page-lead">
          麻雀店ゲスト、公開対局、トークイベント、大会、サイン会などの掲載機能を準備しています。
        </p>
      </header>
      <UnofficialNotice />
      <section className="section">
        <EventPreview events={playerEvents} />
      </section>
      <section className="content-card content-section section">
        <h2>掲載する情報</h2>
        <p>
          選手本人、店舗、チーム、Mリーグ、所属団体、イベント主催者の公式発表があり、一般客向けに事前告知されたイベントのみを対象とします。
        </p>
        <h2>掲載しない情報</h2>
        <p>
          目撃情報、未発表情報、リアルタイムの居場所、移動・宿泊・自宅周辺などの個人情報は掲載しません。
        </p>
      </section>
    </main>
  );
}

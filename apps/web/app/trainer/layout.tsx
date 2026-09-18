import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "麻雀トレーニング | 何切る・待ち・点数計算を練習",
  description: "麻雀の何切る、待ち当て、役判定、清一色、点数計算を牌画像つきで練習できる初心者向けトレーニングです。",
  alternates: { canonical: "/trainer" }
};

export default function TrainerLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}

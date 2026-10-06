import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getRobotsPolicy } from "@mahjong-trainer/content-index-policy";

export const metadata: Metadata = {
  alternates: { canonical: "/trainer" },
  robots: getRobotsPolicy("/training")
};

export default function TrainingPage() {
  redirect("/trainer");
}

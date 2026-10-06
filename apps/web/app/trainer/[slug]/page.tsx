import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRobotsPolicy } from "@mahjong-trainer/content-index-policy";
import TrainerPage from "../page";
import { getTrainerDefinition, trainerDefinitions } from "../trainerCatalog";

type TrainerPageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return trainerDefinitions.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: TrainerPageProps): Promise<Metadata> {
  const definition = getTrainerDefinition((await params).slug);
  if (!definition) return {};
  const canonical = `/trainer/${definition.slug}`;

  return {
    title: definition.seoTitle,
    description: definition.seoDescription,
    alternates: { canonical },
    robots: getRobotsPolicy(canonical),
    openGraph: {
      type: "website",
      url: canonical,
      title: definition.seoTitle,
      description: definition.seoDescription
    }
  };
}

export default async function IndividualTrainerPage({ params }: TrainerPageProps) {
  if (!getTrainerDefinition((await params).slug)) notFound();
  return <TrainerPage />;
}

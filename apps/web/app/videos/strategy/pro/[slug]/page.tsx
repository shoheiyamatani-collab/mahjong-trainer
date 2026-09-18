import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VideoLessonArticle } from "../../VideoLessonArticle";
import { getProVideoLesson, proVideoLessons } from "../proVideoData";

type ProVideoPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return proVideoLessons.map((lesson) => ({ slug: lesson.slug.replace(/^pro\//, "") }));
}

export async function generateMetadata({ params }: ProVideoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getProVideoLesson(slug);
  if (!lesson) return {};

  const canonical = `/videos/strategy/${lesson.slug}`;

  return {
    title: lesson.guide.title,
    description: lesson.guide.description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      siteName: "雀フォリオ",
      title: lesson.guide.title,
      description: lesson.guide.description,
      publishedTime: lesson.publishedAt
    }
  };
}

export default async function ProVideoArticlePage({ params }: ProVideoPageProps) {
  const { slug } = await params;
  const lesson = getProVideoLesson(slug);
  if (!lesson) notFound();

  return (
    <VideoLessonArticle
      lesson={lesson}
      parent={{ href: "/videos/strategy/pro", label: "プロの実戦解説" }}
    />
  );
}

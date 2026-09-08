import { createVideoLessonMetadata, VideoLessonArticle } from "../VideoLessonArticle";
import { addedVideoLessons } from "../videoLessonData";

const lesson = addedVideoLessons.readingQuiz;

export const metadata = createVideoLessonMetadata(lesson);

export default function DiscardReadingQuizArticlePage() {
  return <VideoLessonArticle lesson={lesson} />;
}

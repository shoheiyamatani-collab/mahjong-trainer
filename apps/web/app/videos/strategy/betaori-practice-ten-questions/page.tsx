import { createVideoLessonMetadata, VideoLessonArticle } from "../VideoLessonArticle";
import { addedVideoLessons } from "../videoLessonData";

const lesson = addedVideoLessons.betaoriPractice;

export const metadata = createVideoLessonMetadata(lesson);

export default function BetaoriPracticeArticlePage() {
  return <VideoLessonArticle lesson={lesson} />;
}

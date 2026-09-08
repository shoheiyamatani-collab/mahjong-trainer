import { createVideoLessonMetadata, VideoLessonArticle } from "../VideoLessonArticle";
import { addedVideoLessons } from "../videoLessonData";

const lesson = addedVideoLessons.pushFoldQuiz;

export const metadata = createVideoLessonMetadata(lesson);

export default function PushFoldJudgmentArticlePage() {
  return <VideoLessonArticle lesson={lesson} />;
}

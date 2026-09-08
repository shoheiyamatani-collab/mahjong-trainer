import { createVideoLessonMetadata, VideoLessonArticle } from "../VideoLessonArticle";
import { addedVideoLessons } from "../videoLessonData";

const lesson = addedVideoLessons.riichiQuiz;

export const metadata = createVideoLessonMetadata(lesson);

export default function RiichiJudgmentArticlePage() {
  return <VideoLessonArticle lesson={lesson} />;
}

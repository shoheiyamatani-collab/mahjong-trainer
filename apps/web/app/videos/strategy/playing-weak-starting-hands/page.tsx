import { createVideoLessonMetadata, VideoLessonArticle } from "../VideoLessonArticle";
import { addedVideoLessons } from "../videoLessonData";

const lesson = addedVideoLessons.hirasawaBadHand;

export const metadata = createVideoLessonMetadata(lesson);

export default function PlayingWeakStartingHandsArticlePage() {
  return <VideoLessonArticle lesson={lesson} />;
}

import { createVideoLessonMetadata, VideoLessonArticle } from "../VideoLessonArticle";
import { addedVideoLessons } from "../videoLessonData";

const lesson = addedVideoLessons.clearRainBadHand;

export const metadata = createVideoLessonMetadata(lesson);

export default function PlayingBadStartingHandsArticlePage() {
  return <VideoLessonArticle lesson={lesson} />;
}

import { createVideoLessonMetadata, VideoLessonArticle } from "../VideoLessonArticle";
import { addedVideoLessons } from "../videoLessonData";

const lesson = addedVideoLessons.betaoriRiskTest;

export const metadata = createVideoLessonMetadata(lesson);

export default function BetaoriRiskTestArticlePage() {
  return <VideoLessonArticle lesson={lesson} />;
}

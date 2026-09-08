import { createVideoLessonMetadata, VideoLessonArticle } from "../VideoLessonArticle";
import { addedVideoLessons } from "../videoLessonData";

const lesson = addedVideoLessons.multiSidedWaits;

export const metadata = createVideoLessonMetadata(lesson);

export default function MultiSidedWaitsArticlePage() {
  return <VideoLessonArticle lesson={lesson} />;
}

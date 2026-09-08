import { createVideoLessonMetadata, VideoLessonArticle } from "../VideoLessonArticle";
import { addedVideoLessons } from "../videoLessonData";

const lesson = addedVideoLessons.tileEfficiencyExceptions;

export const metadata = createVideoLessonMetadata(lesson);

export default function TileEfficiencyExceptionsArticlePage() {
  return <VideoLessonArticle lesson={lesson} />;
}

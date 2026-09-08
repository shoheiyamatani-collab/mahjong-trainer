import { createVideoLessonMetadata, VideoLessonArticle } from "../VideoLessonArticle";
import { addedVideoLessons } from "../videoLessonData";

const lesson = addedVideoLessons.blockStructureReading;

export const metadata = createVideoLessonMetadata(lesson);

export default function BlockStructureReadingArticlePage() {
  return <VideoLessonArticle lesson={lesson} />;
}

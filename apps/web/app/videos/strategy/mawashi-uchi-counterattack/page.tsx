import { createVideoLessonMetadata, VideoLessonArticle } from "../VideoLessonArticle";
import { addedVideoLessons } from "../videoLessonData";

const lesson = addedVideoLessons.mawashiUchi;

export const metadata = createVideoLessonMetadata(lesson);

export default function MawashiUchiArticlePage() {
  return <VideoLessonArticle lesson={lesson} />;
}

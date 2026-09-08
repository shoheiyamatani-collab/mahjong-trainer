import { createVideoLessonMetadata, VideoLessonArticle } from "../VideoLessonArticle";
import { addedVideoLessons } from "../videoLessonData";

const lesson = addedVideoLessons.threeDimensionalNanikiru;

export const metadata = createVideoLessonMetadata(lesson);

export default function ThreeDimensionalNanikiruArticlePage() {
  return <VideoLessonArticle lesson={lesson} />;
}

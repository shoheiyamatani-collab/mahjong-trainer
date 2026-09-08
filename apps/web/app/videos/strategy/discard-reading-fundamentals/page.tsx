import { createVideoLessonMetadata, VideoLessonArticle } from "../VideoLessonArticle";
import { addedVideoLessons } from "../videoLessonData";

const lesson = addedVideoLessons.discardReadingFundamentals;

export const metadata = createVideoLessonMetadata(lesson);

export default function DiscardReadingFundamentalsArticlePage() {
  return <VideoLessonArticle lesson={lesson} />;
}

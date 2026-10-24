import TrainerWorkspace from "./TrainerWorkspace";
import { TrainerStudyGuide } from "./TrainerStudyGuide";

export default function TrainerPage() {
  return <TrainerWorkspace learningContent={<TrainerStudyGuide />} />;
}

import { useState } from "react";
import StepperControl from "./StepperControl";
import BasicInformation from "./BasicInformation";
import StudySubjects from "./StudySubjects";
import StudyGoals from "./StudyGoals";
import StudyPreferences from "./StudyPreferences";
import LearninStyle from "./LearninStyle";
import CurrentSchedule from "./CurrentSchedule";
import Alert from "./Alert";

const ProfileForm = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    "Basic Information",
    "Study Subjects",
    "Study Goals",
    "Study Preferences",
    "Learning Style",
    "Current Schedule",
    "Alert",
  ];
  const displayStep = (step: number) => {
    switch (step) {
      case 1:
        return <BasicInformation />;
      case 2:
        return <StudySubjects />;
      case 3:
        return <StudyGoals />;
      case 4:
        return <StudyPreferences />;
      case 5:
        return <LearninStyle />;
      case 6:
        return <CurrentSchedule />;
      case 7:
        return <Alert />;
    }
  };
  const handleClick = (direction: string) => {
    let newStep = currentStep;
    direction === "next" ? newStep++ : newStep--;
    newStep > 0 && newStep <= steps.length && setCurrentStep(newStep);
  };

  return (
    <div className="flex-grow flex flex-col justify-between text-gray-600">
      <div className="container flex-grow horizontal flex items-center">
        {/* <StepperForm steps={steps} currentStep={currentStep} /> */}
        <div className="flex-grow">{displayStep(currentStep)}</div>
      </div>
      <StepperControl
        handleClick={handleClick}
        steps={steps}
        currentStep={currentStep}
      />
    </div>
  );
};

export default ProfileForm;

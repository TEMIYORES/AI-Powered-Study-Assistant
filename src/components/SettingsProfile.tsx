import { useEffect, useState } from "react";
import { customStyles } from "../theme/Styles";
import AllSubjects, { option } from "../assets/subjects";
import Select from "react-select";
import TimeRangePicker from "@wojtekmaj/react-timerange-picker";
import "@wojtekmaj/react-timerange-picker/dist/TimeRangePicker.css";
import "../theme/Timerangepicker.css";
import {
  useGetProfileQuery,
  useSaveProfileMutation,
} from "../features/Apislices/ProfileApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser, setAuth } from "../features/store/auth/authSlice";
import Lottie from "lottie-react";
import Loader from "../assets/loader.json";
import Popup from "./Popup";
import { toast } from "sonner";

const SettingsProfile = () => {
  const currentUser = useSelector(getCurrentUser);
  const dispatch = useDispatch();
  const {
    data: profile,
    isLoading: gettingProfile,
    refetch,
  } = useGetProfileQuery({
    email: currentUser?.email,
  });
  useEffect(() => {
    refetch();
  }, [profile]);
  const [saveProfile, { isLoading: savingProfile }] = useSaveProfileMutation();
  const [age, setAge] = useState(profile?.age);
  const [educationLevel, setEducationLevel] = useState<
    "HighSchool" | "Undergraduate" | "Graduate"
  >(profile?.educationLevel);

  const [subjects, setSubjects] = useState<readonly option[]>(
    profile?.subjects
  );
  const [shortTermGoals, setShortTermGoals] = useState(profile?.shortTermGoals);
  const [longTermGoals, setLongTermGoals] = useState(profile?.longTermGoals);
  const [preferredStudyTimes, setPreferredStudyTimes] = useState<
    readonly option[]
  >(profile?.preferredStudyTimes);
  const [studySessionDuration, setStudySessionDuration] = useState(
    profile?.studySessionDuration
  );
  const [breakFrequency, setBreakFrequency] = useState(profile?.breakFrequency);
  const [learningStyle, setLearningStyle] = useState(profile?.learningStyle);
  const [availableStudyDays, setAvailableStudyDays] = useState<
    readonly option[]
  >(profile?.availableStudyDays);
  const [timeAvailability, setTimeAvailability] = useState<any>(
    profile?.timeAvailability
  );
  const [showPopup, setShowPopup] = useState(false);
  useEffect(() => {
    setAge(profile?.age);
    setEducationLevel(profile?.educationLevel);
    setSubjects(profile?.subjects);
    setShortTermGoals(profile?.shortTermGoals);
    setLongTermGoals(profile?.longTermGoals);
    setPreferredStudyTimes(profile?.preferredStudyTimes);
    setStudySessionDuration(profile?.studySessionDuration);
    setBreakFrequency(profile?.breakFrequency);
    setLearningStyle(profile?.learningStyle);
    setAvailableStudyDays(profile?.availableStudyDays);
    setTimeAvailability(profile?.timeAvailability);
  }, [profile]);

  const studyTimesoptions = [
    { label: "Morning", value: "Morning" },
    { label: "Afternoon", value: "Afternoon" },
    { label: "Evening", value: "Evening" },
    { label: "Night", value: "Night" },
  ];

  const handleTimeChange = (value: any, valueName: string) => {
    if (!value) {
      const { [valueName]: removed, ...newObjects } = timeAvailability;
      setTimeAvailability(newObjects);
    } else {
      setTimeAvailability((prev: any) => ({ ...prev, [valueName]: value }));
    }
  };
  const handleTimeRemoval = (days: string[]) => {
    const timeDays = Object.keys(timeAvailability);
    timeDays.forEach((timeDay) => {
      if (!days.includes(timeDay)) {
        const { [timeDay]: removed, ...newObjects } = timeAvailability;
        setTimeAvailability(newObjects);
      }
    });
  };
  console.log({ timeAvailability });
  const studyDaysOptions = [
    { label: "Monday", value: "Monday" },
    { label: "Tuesday", value: "Tuesday" },
    { label: "Wednesday", value: "Wednesday" },
    { label: "Thursday", value: "Thursday" },
    { label: "Friday", value: "Friday" },
    { label: "Saturday", value: "Saturday" },
    { label: "Sunday", value: "Sunday" },
  ];
  const handleSaveProfile = async () => {
    try {
      await saveProfile({
        email: currentUser?.email,
        type: "update",
        age,
        educationLevel,
        subjects,
        shortTermGoals,
        longTermGoals,
        preferredStudyTimes,
        studySessionDuration,
        breakFrequency,
        learningStyle,
        availableStudyDays,
        timeAvailability,
      });
      dispatch(setAuth({ studyPlanSetup: false }));
      setShowPopup(true);
    } catch (err) {
      toast.error("Error updating profile...");
    }
  };
  return gettingProfile || savingProfile ? (
    <div className="flex-grow w-full flex items-center justify-center">
      <Lottie animationData={Loader} loop={true} style={{ width: "100px" }} />
    </div>
  ) : (
    <div className="flex-grow w-full flex flex-col gap-3 items-end justify-between">
      <div className="flex-grow w-full h-[400px] flex flex-col gap-3 items-center overflow-y-auto">
        <div className="w-full">
          <label htmlFor="id" className="input-label">
            How old are you?
          </label>
          <input
            type="number"
            id="age"
            name="age"
            required
            value={age}
            onChange={(e) => {
              setAge(e.target.value);
            }}
            className="basic-input"
          />
        </div>
        <div className="w-full">
          <label htmlFor="educationLevel" className="input-label">
            What is your current education level?
          </label>
          <select
            name="educationLevel"
            id="educationLevel"
            value={educationLevel}
            onChange={(e) => {
              if (
                e.target.value === "HighSchool" ||
                e.target.value === "Undergraduate" ||
                e.target.value === "Graduate"
              ) {
                setEducationLevel(e.target.value);
              }
            }}
            className="basic-input"
          >
            <option value="HighSchool">High School</option>
            <option value="Undergraduate">Undergraduate</option>
            <option value="Graduate">Graduate</option>
          </select>
        </div>
        <div className="w-full">
          <label htmlFor="educationLevel" className="input-label">
            Which subjects are you currently studying?
          </label>
          <Select
            options={AllSubjects[educationLevel] as option[]}
            isMulti
            styles={customStyles}
            value={subjects}
            onChange={(values) => setSubjects(values)}
            className="w-full"
          />
        </div>
        <div className="w-full">
          <label htmlFor="educationLevel" className="input-label">
            What are your short-term study goals?
          </label>
          <textarea
            rows={5}
            value={shortTermGoals}
            name="shortTermGoals"
            onChange={(e) => {
              setShortTermGoals(e.target.value);
            }}
            className="basic-input"
            placeholder={`Ace my math test this week.\nComplete all homework assignments.\n`}
          />
        </div>
        <div className="w-full">
          <label htmlFor="educationLevel" className="input-label">
            What are your long-term study goals?
          </label>
          <textarea
            rows={5}
            value={longTermGoals}
            name="longTermGoals"
            onChange={(e) => {
              setLongTermGoals(e.target.value);
            }}
            className="basic-input"
            placeholder={`Get into a top-tier university.\nEarn a merit-based scholarship for college.\n`}
          />
        </div>
        <div className="w-full">
          <label className="input-label">When do you prefer to study?</label>
          <Select
            options={studyTimesoptions}
            isMulti
            styles={customStyles}
            value={preferredStudyTimes}
            onChange={(values) => setPreferredStudyTimes(values)}
            className="w-full"
          />
        </div>
        <div className="w-full">
          <label htmlFor="studySessionDuration" className="input-label">
            How long do you prefer each study session to be?
          </label>
          <select
            name="studySessionDuration"
            id="studySessionDuration"
            value={studySessionDuration}
            onChange={(e) => {
              {
                setStudySessionDuration(e.target.value);
              }
            }}
            className="basic-input"
          >
            <option value="30 minutes">30 minutes</option>
            <option value="1 hour">1 hour</option>
            <option value="1 hour 30 minutes">1 hour 30 minutes</option>
            <option value="2 hours">2 hours</option>
            <option value="2 hours">2 hours 30 minutes</option>
            <option value="2 hours">3 hours</option>
            <option value="2 hours">3 hours 30 minutes</option>
            <option value="2 hours">4 hours</option>
          </select>
        </div>
        <div className="w-full">
          <label htmlFor="breakFrequency" className="input-label">
            How often do you prefer to take breaks?
          </label>
          <select
            name="breakFrequency"
            id="breakFrequency"
            value={breakFrequency}
            onChange={(e) => {
              {
                setBreakFrequency(e.target.value);
              }
            }}
            className="basic-input"
          >
            <option value="30 minutes">Every 30 minutes</option>
            <option value="1 hour">Every hour</option>
            <option value="1 hour 30 minutes">Every hour 30 minutes</option>
            <option value="2 hours">Every 2 hours</option>
          </select>
        </div>
        <div className="w-full">
          <label htmlFor="learningStyle" className="input-label">
            What is your preferred learning style?
          </label>
          <select
            name="learningStyle"
            id="learningStyle"
            value={learningStyle}
            onChange={(e) => {
              {
                setLearningStyle(e.target.value);
              }
            }}
            className="basic-input"
          >
            <option value="Visual">Visual</option>
            <option value="Auditory">Auditory</option>
            <option value="Reading/Writing">Reading/Writing</option>
            <option value="Kinesthetic">Kinesthetic</option>
          </select>
        </div>
        <div className="w-full">
          <label className="input-label">
            Which days of the week are you available to study?
          </label>
          <Select
            options={studyDaysOptions}
            isMulti
            styles={customStyles}
            value={availableStudyDays}
            onChange={(values) => {
              setAvailableStudyDays(values);
              const days = values.map((value) => value.value);
              handleTimeRemoval(days);
            }}
            className="w-full"
          />
        </div>
        <div className="w-full">
          <label htmlFor="timeAvailability" className="input-label">
            What times are you available to study on each selected day? (24hr)
          </label>
          <div className="mt-2">
            {availableStudyDays?.length ? (
              availableStudyDays.map((day: { label: string }) => {
                return (
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <span className="w-1/3 text-start text-textcolor">
                      {day.label}
                    </span>
                    <TimeRangePicker
                      name="timeAvailability"
                      onChange={(value) => handleTimeChange(value, day.label)}
                      value={timeAvailability[day.label]}
                      required
                      amPmAriaLabel="PM"
                      disableClock={true}
                      className={"w-2/3 text-center text-textcolor"}
                    />
                  </div>
                );
              })
            ) : (
              <span className="text-sm text-start text-desccolor">
                No option
              </span>
            )}
          </div>
        </div>
      </div>
      <button className="basic-button" onClick={handleSaveProfile}>
        Save Profile
      </button>
      {showPopup ? <Popup /> : null}
    </div>
  );
};

export default SettingsProfile;

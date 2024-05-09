import React, { useState, useEffect } from "react";

interface ProgressFieldProps {
  sessionStatus: string;
  goalMinutes: string;
  startDateTime: string;
  totalTime: string;
}

const ProgressField: React.FC<ProgressFieldProps> = ({
  sessionStatus,
  goalMinutes,
  startDateTime,
  totalTime,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [remainingTime, setRemainingTime] = useState("00:00:00");
  const [progress, setProgress] = useState(0);
  const [goalReached, setGoalReached] = useState(false);

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    if (!startDateTime || sessionStatus !== "on") {
      setRemainingTime("00:00:00");
      setProgress(0);
      setGoalReached(false);

      return;
    }

    const calculateRemainingTime = () => {
      const serverDate = new Date(startDateTime);
      const clientTimeZoneOffset = new Date().getTimezoneOffset();
      const offsetMilliseconds = clientTimeZoneOffset * 60000;
      const startTime = new Date(serverDate.getTime() - offsetMilliseconds);
      const elapsedTimeMs = currentTime.getTime() - startTime.getTime();
      const goalTimeMinutes = goalMinutes.split(":").map(Number);
      const goalTimeMs =
        (goalTimeMinutes[0] * 60 + goalTimeMinutes[1]) * 60 * 1000;
      const remainingTimeMs = goalTimeMs - elapsedTimeMs;

      const progress = Math.max(
        0,
        Math.min(100, (elapsedTimeMs / goalTimeMs) * 100)
      );
      setProgress(progress);

      if (remainingTimeMs <= 0) {
        setGoalReached(true);
        setRemainingTime("00:00:00");
      } else {
        const hours = Math.floor(remainingTimeMs / (1000 * 60 * 60));
        const minutes = Math.floor(
          (remainingTimeMs % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((remainingTimeMs % (1000 * 60)) / 1000);

        const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        setRemainingTime(formattedTime);
        setGoalReached(false);
      }
    };

    calculateRemainingTime();
  }, [sessionStatus, startDateTime, goalMinutes, currentTime]);

  return (
    <div>
      {sessionStatus === "on" ? (
        !goalReached ? (
          <div>
            <h2>Session Progress</h2>
            <div style={{ width: "100%", margin: "10px 0", fontSize: "16px" }}>
              Time Remaining: {remainingTime}
              <div
                style={{
                  width: "100%",
                  backgroundColor: "#f4cdec",
                  borderRadius: "10px",
                }}
              >
                <div
                  style={{
                    width: `${progress}%`,
                    height: "20px",
                    backgroundColor: "#cdf9da",
                    borderRadius: "10px",
                  }}
                ></div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h2>Session Complete</h2>
            <p>The goal has been reached in {goalMinutes}!</p>
          </div>
        )
      ) : (
        <div>
          <h2>Team Progress</h2>
          <p>
            Your time goal has been reached. Feel free to continue with you
            work!
          </p>
        </div>
      )}
    </div>
  );
};

export default ProgressField;

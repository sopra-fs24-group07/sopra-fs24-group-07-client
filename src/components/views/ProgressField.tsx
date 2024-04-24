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
  const [inSes, setInSes] = useState(false);

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
      setInSes(false);

      return;
    }

    const calculateRemainingTime = () => {
      const startTime = new Date(startDateTime);
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

      const hours = Math.floor(remainingTimeMs / (1000 * 60 * 60));
      const minutes = Math.floor(
        (remainingTimeMs % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((remainingTimeMs % (1000 * 60)) / 1000);

      const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      setRemainingTime(formattedTime);
      setInSes(remainingTimeMs > 0);
    };

    calculateRemainingTime();
  }, [sessionStatus, startDateTime, goalMinutes, currentTime]);

  return (
    <div>
      {inSes ? (
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
          <h2>Team Progress</h2>
          <p>The team has spent {totalTime} in sessions so far!</p>
        </div>
      )}
    </div>
  );
};

export default ProgressField;
